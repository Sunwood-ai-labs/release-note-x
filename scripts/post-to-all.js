#!/usr/bin/env node

/**
 * マルチプラットフォーム投稿スクリプト
 *
 * X (Twitter) と Discord に同時に投稿します
 *
 * 使い方:
 *   node scripts/post-to-all.js "タイトル" "URL"
 *   node scripts/post-to-all.js "タイトル" "URL" --summarize
 *   node scripts/post-to-all.js "タイトル" "URL" --discord-only
 *   node scripts/post-to-all.js "タイトル" "URL" --x-only
 */

import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createDiscordClient, createDiscordEmbed, postToDiscord } from '../lib/discord-client.js';
import { createOpenAIClient, summarizeRelease, createFallbackSummary } from '../lib/openai-client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

/**
 * Xクライアントを初期化
 */
function createTwitterClient() {
  const {
    X_API_KEY,
    X_API_SECRET,
    X_ACCESS_TOKEN,
    X_ACCESS_SECRET
  } = process.env;

  if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_SECRET) {
    return null;
  }

  return new TwitterApi({
    appKey: X_API_KEY,
    appSecret: X_API_SECRET,
    accessToken: X_ACCESS_TOKEN,
    accessSecret: X_ACCESS_SECRET,
  });
}

/**
 * Xに投稿
 */
async function postToX(client, text) {
  try {
    console.log('\n🐦 X (Twitter) に投稿します');
    console.log('---');
    console.log(text);
    console.log('---');

    const result = await client.v2.tweet(text);

    console.log('✅ Xへの投稿成功！');
    console.log(`   Tweet ID: ${result.data.id}`);
    console.log(`   URL: https://x.com/i/status/${result.data.id}`);

    return { success: true, result };
  } catch (error) {
    console.error('❌ Xへの投稿に失敗しました');
    console.error(`   ${error.message}`);

    if (error.code === 429) {
      console.error('\n⚠️  レート制限（429エラー）');
      console.error('   Freeプラン: 500 posts/月');
    }

    return { success: false, error };
  }
}

/**
 * Discordに投稿
 */
async function postToDiscordWrapper(title, url, summary) {
  try {
    const client = createDiscordClient();
    const embed = createDiscordEmbed(title, url, summary);

    console.log('\n💬 Discord に投稿します');

    const result = await postToDiscord(client, embed);

    console.log('✅ Discordへの投稿成功！');

    return { success: true, result };
  } catch (error) {
    console.error('❌ Discordへの投稿に失敗しました');
    console.error(`   ${error.message}`);
    return { success: false, error };
  }
}

/**
 * AI要約を生成
 */
async function generateSummary(releaseNotes) {
  try {
    const client = createOpenAIClient();
    const summary = await summarizeRelease(client, releaseNotes, {
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
    });
    return { success: true, summary };
  } catch (error) {
    console.warn('⚠️  AI要約に失敗しました。フォールバックを使用します');
    const fallback = createFallbackSummary(releaseNotes, 280);
    return { success: false, summary: fallback };
  }
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2);

  // オプションの解析
  const options = {
    summarize: args.includes('--summarize'),
    discordOnly: args.includes('--discord-only'),
    xOnly: args.includes('--x-only'),
    help: args.includes('--help') || args.includes('-h'),
    test: args.includes('--test')
  };

  // ヘルプ表示
  if (options.help) {
    console.log('📖 マルチプラットフォーム投稿スクリプト\n');
    console.log('使い方:');
    console.log('  node scripts/post-to-all.js "タイトル" "URL"');
    console.log('  node scripts/post-to-all.js "タイトル" "URL" --summarize');
    console.log('  node scripts/post-to-all.js "タイトル" "URL" --discord-only');
    console.log('  node scripts/post-to-all.js "タイトル" "URL" --x-only');
    console.log('  node scripts/post-to-all.js --test\n');
    console.log('オプション:');
    console.log('  --summarize      AI要約を使用（OpenAI API）');
    console.log('  --discord-only   Discordのみに投稿');
    console.log('  --x-only         Xのみに投稿');
    console.log('  --test           テストモード');
    console.log('  --help, -h       ヘルプを表示\n');
    process.exit(0);
  }

  let title, url, releaseNotes;

  // テストモード
  if (options.test) {
    const now = new Date();
    title = `Test Release ${now.getTime()}`;
    url = 'https://github.com/Sunwood-ai-labs/release-note-x';
    releaseNotes = `## テストリリース

テスト投稿です。

### 新機能
- 機能1
- 機能2

### バグ修正
- バグ1
- バグ2`;
    console.log('🧪 テストモード\n');
  } else {
    // 引数から取得
    const filteredArgs = args.filter(arg =>
      !arg.startsWith('--')
    );

    title = filteredArgs[0];
    url = filteredArgs[1];
    releaseNotes = filteredArgs.slice(2).join(' ') || null;

    if (!title || !url) {
      console.error('❌ タイトルとURLは必須です');
      console.log('\n使い方: node scripts/post-to-all.js "タイトル" "URL"');
      console.log('       node scripts/post-to-all.js --help  (詳細)\n');
      process.exit(1);
    }
  }

  console.log('📋 投稿内容:');
  console.log(`   タイトル: ${title}`);
  console.log(`   URL: ${url}`);
  console.log(`   AI要約: ${options.summarize ? 'オン' : 'オフ'}`);

  // クライアントの初期化
  const xClient = createTwitterClient();
  let discordAvailable = false;
  try {
    createDiscordClient();
    discordAvailable = true;
  } catch {
    discordAvailable = false;
  }

  // AI要約の生成
  let summary = null;
  if (options.summarize && releaseNotes) {
    console.log('\n🤖 AI要約を生成中...');
    const result = await generateSummary(releaseNotes);
    summary = result.summary;
  }

  // 投稿結果
  const results = {
    x: null,
    discord: null
  };

  // Xに投稿
  if (!options.discordOnly && xClient) {
    const tweetText = summary
      ? `${summary}\n\n${url}`
      : `🚀 ${title}\n\n${url}`;

    results.x = await postToX(xClient, tweetText);
  } else if (options.discordOnly) {
    console.log('\n⏭️  Xへの投稿はスキップされました (--discord-only)');
  } else if (!xClient) {
    console.log('\n⏭️  X API認証情報がないためスキップされました');
  }

  // Discordに投稿
  if (!options.xOnly && discordAvailable) {
    results.discord = await postToDiscordWrapper(title, url, summary);
  } else if (options.xOnly) {
    console.log('\n⏭️  Discordへの投稿はスキップされました (--x-only)');
  } else if (!discordAvailable) {
    console.log('\n⏭️  Discord Webhook URLがないためスキップされました');
  }

  // 結果サマリー
  console.log('\n' + '='.repeat(50));
  console.log('📊 投稿結果サマリー');
  console.log('='.repeat(50));

  if (results.x) {
    console.log(`🐦 X (Twitter): ${results.x.success ? '✅ 成功' : '❌ 失敗'}`);
  } else {
    console.log('🐦 X (Twitter): ⏭️  スキップ');
  }

  if (results.discord) {
    console.log(`💬 Discord: ${results.discord.success ? '✅ 成功' : '❌ 失敗'}`);
  } else {
    console.log('💬 Discord: ⏭️  スキップ');
  }

  console.log('='.repeat(50));

  // 両方失敗した場合はエラー終了
  const allFailed = (results.x && !results.x.success && xClient) &&
                    (results.discord && !results.discord.success && discordAvailable);

  if (allFailed) {
    process.exit(1);
  }
}

// 実行
main().catch(error => {
  console.error('\n💥 エラーが発生しました:', error.message);
  process.exit(1);
});
