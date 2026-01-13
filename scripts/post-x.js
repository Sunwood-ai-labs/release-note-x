#!/usr/bin/env node

/**
 * X (Twitter) 投稿スクリプト
 *
 * 使い方:
 *   node scripts/post-x.js "投稿内容"
 *   node scripts/post-x.js --with-ai "タイトル" "URL" "true" "リリースノート"
 *   node scripts/post-x.js --test
 */

import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createOpenAIClient, summarizeRelease } from '../lib/openai-client.js';

// ES Moduleで__dirnameを取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .envを読み込み
dotenv.config({ path: join(__dirname, '..', '.env') });

/**
 * Xクライアントを初期化
 */
function createTwitterClient() {
  const {
    X_API_KEY,
    X_API_SECRET,
    X_ACCESS_TOKEN,
    X_ACCESS_SECRET,
    X_BEARER_TOKEN
  } = process.env;

  if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_SECRET) {
    console.error('❌ X API認証情報が不足しています');
    console.log('   .envファイルに以下を設定してください:');
    console.log('   - X_API_KEY');
    console.log('   - X_API_SECRET');
    console.log('   - X_ACCESS_TOKEN');
    console.log('   - X_ACCESS_SECRET');
    process.exit(1);
  }

  // OAuth 1.0a ユーザーコンテキストを作成（投稿用）
  const client = new TwitterApi({
    appKey: X_API_KEY,
    appSecret: X_API_SECRET,
    accessToken: X_ACCESS_TOKEN,
    accessSecret: X_ACCESS_SECRET,
  });

  return client;
}

/**
 * Xにテキストを投稿
 */
async function postToX(client, text) {
  try {
    console.log('📝 投稿内容:');
    console.log('---');
    console.log(text);
    console.log('---');

    // 投稿
    const tweet = await client.v2.tweet(text);

    console.log('✅ 投稿成功！');
    console.log(`   Tweet ID: ${tweet.data.id}`);
    console.log(`   URL: https://x.com/i/status/${tweet.data.id}`);

    return tweet;
  } catch (error) {
    console.error('❌ 投稿に失敗しました');
    console.error(`   ${error.message}`);

    if (error.code) {
      console.error(`   エラーコード: ${error.code}`);
    }

    if (error.errors) {
      error.errors.forEach(e => {
        console.error(`   ${e.message}`);
      });
    }

    throw error;
  }
}

/**
 * テスト投稿
 */
function getTestPost() {
  const now = new Date();
  const timeStr = now.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

  return `🚀 Release Note X テスト投稿

時刻: ${timeStr}

これはGitHubリリースノートを要約してXに投稿するシステムのテストです。

#ReleaseNoteX #GitHub #Twitter`;
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2);
  const client = createTwitterClient();

  let text;

  // 引数の解析
  if (args[0] === '--with-ai') {
    // AI要約モード
    const title = args[1];
    const url = args[2];
    const enableSummary = args[3] === 'true';
    const releaseNotes = args[4] || '';

    if (enableSummary && releaseNotes) {
      console.log('🤖 AI要約を生成します...');
      try {
        const aiClient = createOpenAIClient({ quiet: true });
        text = await summarizeRelease(aiClient, releaseNotes, { quiet: true });
        console.log('✅ AI要約を生成しました');
      } catch (error) {
        console.log(`⚠️ AI要約に失敗しました: ${error.message}`);
        text = `🚀 ${title}\n\n${url}`;
      }
    } else {
      text = `🚀 ${title}\n\n${url}`;
    }
  } else if (args.includes('--test')) {
    // テスト投稿
    text = getTestPost();
    console.log('🧪 テストモードで投稿します\n');
  } else {
    // 通常投稿
    text = args.join(' ');
  }

  // テキストが指定されていない場合はヘルプを表示
  if (!text) {
    console.log('📖 X 投稿スクリプト\n');
    console.log('使い方:');
    console.log('  node scripts/post-x.js "投稿内容"');
    console.log('  node scripts/post-x.js --with-ai "タイトル" "URL" "true" "リリースノート"');
    console.log('  node scripts/post-x.js --test           # テスト投稿\n');
    process.exit(0);
  }

  // 文字数チェック（Xは最大500文字）
  if (text.length > 500) {
    console.warn(`⚠️  文字数オーバー: ${text.length}/500文字`);
    const answer = await prompt('続行しますか？ (y/N): ');
    if (answer.toLowerCase() !== 'y') {
      console.log('キャンセルしました');
      process.exit(0);
    }
  }

  // 投稿実行
  await postToX(client, text);
}

/**
 * 簡易プロンプト（非同期）
 */
async function prompt(question) {
  process.stdout.write(question);
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.once('line', line => {
      rl.close();
      resolve(line.trim());
    });
  });
}

// 実行
main().catch(error => {
  console.error('💥 エラーが発生しました:', error.message);
  process.exit(1);
});
