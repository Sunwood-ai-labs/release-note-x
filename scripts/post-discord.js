#!/usr/bin/env node

/**
 * Discord 投稿スクリプト
 *
 * 使い方:
 *   node scripts/post-discord.js "タイトル" "URL"
 *   node scripts/post-discord.js "タイトル" "URL" "要約"
 *   node scripts/post-discord.js --file "タイトル" "URL" "/path/to/summary.txt"
 *   node scripts/post-discord.js --with-ai "タイトル" "URL" "true" "リリースノート"
 *   node scripts/post-discord.js --test
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFile } from 'fs/promises';
import { createDiscordClient, createDiscordEmbed, postToDiscord } from '../lib/discord-client.js';
import { createOpenAIClient, summarizeRelease, detectLanguage } from '../lib/openai-client.js';

// ES Moduleで__dirnameを取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .envを読み込み
dotenv.config({ path: join(__dirname, '..', '.env') });

/**
 * Discordにリリース通知を投稿
 */
async function postRelease(client, title, url, summary = null) {
  try {
    const embed = createDiscordEmbed(title, url, summary);
    return await postToDiscord(client, embed);
  } catch (error) {
    throw error;
  }
}

/**
 * テスト投稿用のデータを取得
 */
function getTestRelease() {
  const now = new Date();
  const timeStr = now.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

  return {
    title: `Test Release ${now.getTime()}`,
    url: 'https://github.com/Sunwood-ai-labs/release-note-x',
    summary: `🧪 Discord投稿テスト\n\n時刻: ${timeStr}\n\nこれはGitHubリリースノートをDiscordに投稿するシステムのテストです。`
  };
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2);

  // ヘルプ表示
  if (args.includes('--help') || args.includes('-h')) {
    console.log('📖 Discord 投稿スクリプト\n');
    console.log('使い方:');
    console.log('  node scripts/post-discord.js "タイトル" "URL"');
    console.log('  node scripts/post-discord.js "タイトル" "URL" "要約"');
    console.log('  node scripts/post-discord.js --file "タイトル" "URL" "/path/to/summary.txt"');
    console.log('  node scripts/post-discord.js --with-ai "タイトル" "URL" "true" "リリースノート"');
    console.log('  node scripts/post-discord.js --test          # テスト投稿\n');
    console.log('環境変数:');
    console.log('  DISCORD_WEBHOOK_URL - Discord Webhook URL (必須)');
    console.log('  OPENAI_API_KEY      - OpenAI/OpenRouter API Key (AI要約時必須)\n');
    process.exit(0);
  }

  let client;
  let title, url, summary;

  try {
    // Discordクライアントを初期化
    client = createDiscordClient();

    // 引数の解析
    if (args.includes('--test')) {
      // テスト投稿
      const testRelease = getTestRelease();
      title = testRelease.title;
      url = testRelease.url;
      summary = testRelease.summary;
      console.log('🧪 テストモードでDiscordに投稿します\n');
    } else if (args[0] === '--with-ai') {
      // AI要約モード
      title = args[1];
      url = args[2];
      const enableSummary = args[3] === 'true';
      const releaseNotes = args[4] || '';

      if (enableSummary && releaseNotes) {
        console.log('🤖 AI要約を生成します...');
        try {
          const aiClient = createOpenAIClient({ quiet: true });
          summary = await summarizeRelease(aiClient, releaseNotes, { quiet: true });
          console.log('✅ AI要約を生成しました');
        } catch (error) {
          console.log(`⚠️ AI要約に失敗しました: ${error.message}`);
          summary = `🚀 ${title}\n\n新しいリリースが利用可能です！`;
        }
      }
    } else if (args[0] === '--file') {
      // ファイルから読み込むモード（長いテキスト用）
      title = args[1];
      url = args[2];
      const summaryPath = args[3];

      if (summaryPath) {
        try {
          summary = await readFile(summaryPath, 'utf-8');
        } catch (error) {
          console.log(`⚠️ ファイルの読み込みに失敗しました: ${error.message}`);
          summary = null;
        }
      } else {
        summary = null;
      }
    } else {
      // 通常投稿
      title = args[0];
      url = args[1];
      summary = args[2] || null;
    }

    // 必須引数のチェック（テストモード以外）
    if (!args.includes('--test') && !args.includes('--with-ai') && !args.includes('--file') && (!title || !url)) {
      console.log('❌ タイトルとURLは必須です');
      console.log('使い方: node scripts/post-discord.js "タイトル" "URL"');
      console.log('       node scripts/post-discord.js --test\n');
      process.exit(1);
    }

    // 投稿実行
    await postRelease(client, title, url, summary);

  } catch (error) {
    if (error.message.includes('DISCORD_WEBHOOK_URL')) {
      console.error('\n❌ Discord Webhook URLが設定されていません');
      console.log('   .envファイルに DISCORD_WEBHOOK_URL を設定してください\n');
      console.log('   取得方法:');
      console.log('   1. Discordサーバーの設定 → インテグレーション → Webhook');
      console.log('   2. 新しいWebhookを作成');
      console.log('   3. Webhook URLをコピーして.envに貼り付け\n');
    } else {
      console.error('\n💥 エラーが発生しました:', error.message);
    }
    process.exit(1);
  }
}

// 実行
main().catch(error => {
  console.error('💥 予期しないエラー:', error.message);
  process.exit(1);
});
