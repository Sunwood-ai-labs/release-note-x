/**
 * OpenAI Client Module
 *
 * Provides functions for AI-powered release note summarization
 * using OpenAI API (GPT-3.5/GPT-4) or OpenRouter.
 */

import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Load system prompt from markdown file
 * @param {string} language - 'ja' or 'en'
 * @returns {string} System prompt
 */
function loadSystemPrompt(language) {
  const filename = 'system-prompt-v2-jp-en.md';
  const filePath = join(__dirname, 'prompts', filename);
  return readFileSync(filePath, 'utf-8');
}

/**
 * Validate and create OpenAI/OpenRouter client
 * @param {Object} options - Optional parameters
 * @param {boolean} options.quiet - Suppress logging output
 * @returns {OpenAI} OpenAI or OpenRouter client instance
 */
export function createOpenAIClient(options = {}) {
  const { quiet = false } = options;
  const { OPENAI_API_KEY, OPENROUTER_API_KEY } = process.env;

  // Support both OpenAI and OpenRouter
  const apiKey = OPENROUTER_API_KEY || OPENAI_API_KEY;
  const useOpenRouter = !!OPENROUTER_API_KEY || process.env.AI_PROVIDER === 'openrouter';

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY or OPENROUTER_API_KEY environment variable is required');
  }

  // Validate API key format
  // OpenAI: sk-*, OpenRouter: sk-or-*
  if (!apiKey.startsWith('sk-') && !apiKey.startsWith('sk-or-')) {
    throw new Error('Invalid API key format (must start with sk- or sk-or-)');
  }

  const config = { apiKey };

  // Use OpenRouter base URL if specified
  if (useOpenRouter) {
    config.baseURL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
    if (!quiet) {
      console.log('🔗 Using OpenRouter API');
    }
  }

  return new OpenAI(config);
}

/**
 * Detect language from text (Japanese or English)
 * @param {string} text - Text to analyze
 * @returns {string} 'ja' for Japanese, 'en' for English
 */
export function detectLanguage(text) {
  // Simple Japanese detection using Unicode ranges
  // Hiragana: U+3040-U+309F, Katakana: U+30A0-U+30FF, Kanji: U+4E00-U+9FAF
  const japaneseRegex = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/;

  // Check if any Japanese characters are present
  if (japaneseRegex.test(text)) {
    return 'ja';
  }

  return 'en';
}

/**
 * Get system prompt for summarization
 * @param {string} language - 'ja' or 'en'
 * @returns {string} System prompt
 */
function getSystemPrompt(language) {
  return loadSystemPrompt(language);
}

/**
 * Get user prompt for summarization
 * @param {string} releaseNotes - Original release notes
 * @param {string} language - 'ja' or 'en'
 * @returns {string} User prompt
 */
function getUserPrompt(releaseNotes, language) {
  if (language === 'ja') {
    return `以下のGitHubリリースノートをSNS向けに要約してください：

---
${releaseNotes}
---

上記のリリースノートを要約してください。`;
  }

  return `Please summarize the following GitHub release notes for social media:

---
${releaseNotes}
---

Summarize the release notes above.`;
}

/**
 * Summarize release notes using OpenAI API
 * @param {OpenAI} client - OpenAI client instance
 * @param {string} releaseNotes - Original release notes to summarize
 * @param {Object} options - Optional parameters
 * @returns {Promise<string>} Summarized text
 */
export async function summarizeRelease(client, releaseNotes, options = {}) {
  const {
    language = null, // null for auto-detect
    model = process.env.OPENAI_MODEL,
    maxTokens,
    temperature = 0.7,
    quiet = false // suppress logging output
  } = options;

  // Determine default model based on provider
  const useOpenRouter = process.env.OPENROUTER_API_KEY || process.env.AI_PROVIDER === 'openrouter';
  const defaultModel = useOpenRouter
    ? (process.env.OPENROUTER_MODEL || 'google/gemma-7b-it:free')
    : 'gpt-3.5-turbo';

  const selectedModel = model || defaultModel;

  try {
    if (!quiet) {
      console.log(`🤖 AI要約を生成中... (モデル: ${selectedModel})`);
    }

    // Auto-detect language if not specified
    const detectedLanguage = language || detectLanguage(releaseNotes);
    if (!quiet) {
      console.log(`   言語: ${detectedLanguage === 'ja' ? '日本語' : 'English'}`);
    }

    const systemPrompt = getSystemPrompt(detectedLanguage);
    const userPrompt = getUserPrompt(releaseNotes, detectedLanguage);

    const response = await client.chat.completions.create({
      model: selectedModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: maxTokens,
      temperature: temperature
    });

    // Handle reasoning models (Nvidia, GLM, etc.) that put content in reasoning field
    const message = response.choices[0].message;
    let summary = message.content;

    // For reasoning models, prioritize reasoning field for complete summary
    if (message.reasoning && message.reasoning.trim().length > 10) {
      let reasoningText = message.reasoning;

      // First, try to extract 【SUMMARY】...【/SUMMARY】 content from reasoning
      const tagMatch = reasoningText.match(/【SUMMARY】([\s\S]*?)【\/SUMMARY】/);
      if (tagMatch && tagMatch[1].trim().length > 10) {
        summary = tagMatch[1].trim();
        if (!quiet) {
          console.log('🧠 Using reasoning field for response');
        }
      }
      // Try to extract 【SUMMARY】...【/SUMMARY】 from content if reasoning doesn't have it
      else if (summary && summary.includes('【SUMMARY】')) {
        const contentTagMatch = summary.match(/【SUMMARY】([\s\S]*?)【\/SUMMARY】/);
        if (contentTagMatch && contentTagMatch[1].trim().length > 10) {
          summary = contentTagMatch[1].trim();
        }
      }
      // If content is incomplete or empty, try extracting from reasoning
      else if (!summary || summary.trim().length < 50) {
        // Try code block
        const codeBlockMatch = reasoningText.match(/```[\s\S]*?\n([\s\S]*?)```/);
        if (codeBlockMatch && codeBlockMatch[1].trim().length > 10) {
          summary = codeBlockMatch[1].trim();
        }
        // Extract from rocket emoji onwards
        else if (reasoningText.includes('🚀') || reasoningText.includes('🎉')) {
          const emojiIndex = Math.max(
            reasoningText.indexOf('🚀'),
            reasoningText.indexOf('🎉')
          );
          if (emojiIndex > 0) {
            summary = reasoningText.substring(emojiIndex).trim();
          } else {
            summary = reasoningText.trim();
          }
        }
        // Fallback to last non-empty paragraph
        else {
          const paragraphs = reasoningText.split('\n\n').filter(p => p.trim().length > 10);
          summary = paragraphs[paragraphs.length - 1] || reasoningText;
        }
        if (!quiet) {
          console.log('🧠 Using reasoning field for response');
        }
      }
    }

    const tokensUsed = response.usage.total_tokens;

    if (!quiet) {
      console.log(`✅ 要約生成完了！ (使用トークン数: ${tokensUsed})`);
    }

    return summary.trim();

  } catch (error) {
    console.error('❌ 要約の生成に失敗しました');
    console.error(`   ${error.message}`);

    // OpenAI/OpenRouter-specific error handling
    if (error.status === 401) {
      console.error('\n⚠️  API認証エラー（401）');
      console.error('   APIキーを確認してください');
    } else if (error.status === 429) {
      console.error('\n⚠️  レート制限（429エラー）');
      console.error('   クォータ残量を確認してください');
      if (useOpenRouter) {
        console.error('   https://openrouter.ai/keys');
      } else {
        console.error('   https://platform.openai.com/account/usage');
      }
    } else if (error.status === 500) {
      console.error('\n⚠️  APIサーバーエラー（500）');
      console.error('   後でもう一度お試しください');
    } else if (error.code === 'ENOTFOUND' || error.message.includes('fetch failed')) {
      console.error('\n⚠️  ネットワークエラー');
      console.error('   インターネット接続を確認してください');
    }

    // Re-throw for caller to handle fallback
    throw error;
  }
}

/**
 * Create a fallback summary when AI fails
 * @param {string} releaseNotes - Original release notes
 * @param {number} maxLength - Maximum length (default 280)
 * @returns {string} Truncated summary
 */
export function createFallbackSummary(releaseNotes, maxLength = 280) {
  console.warn('⚠️  フォールバック: 要約をスキップして元のテキストを使用します');

  // Remove markdown formatting
  let cleaned = releaseNotes
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\*\*/g, '')      // Remove bold
    .replace(/\*/g, '')         // Remove italic
    .replace(/```/g, '')       // Remove code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links, keep text
    .replace(/\n+/g, ' ')      // Replace newlines with spaces
    .trim();

  // Truncate if too long
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength - 3) + '...';
  }

  return cleaned;
}
