#!/usr/bin/env node

/**
 * X (Twitter) スレッド投稿スクリプト
 *
 * 使い方:
 *   node scripts/post-thread.js --file RELEASE_NOTES.md
 *
 * ファイル形式（---でツイートを区切る）:
 *   ツイート1の内容
 *   ---
 *   ツイート2の内容
 *   ---
 *   ツイート3の内容
 */

import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

function createTwitterClient() {
  const {
    X_API_KEY,
    X_API_SECRET,
    X_ACCESS_TOKEN,
    X_ACCESS_SECRET
  } = process.env;

  if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_SECRET) {
    console.error('❌ X API認証情報が不足しています');
    process.exit(1);
  }

  return new TwitterApi({
    appKey: X_API_KEY,
    appSecret: X_API_SECRET,
    accessToken: X_ACCESS_TOKEN,
    accessSecret: X_ACCESS_SECRET,
  });
}

/**
 * スレッドを投稿（1回のAPI呼び出しでまとめて処理）
 */
async function postThread(client, tweets) {
  try {
    console.log(`🧵 ${tweets.length}つのツイートでスレッドを作成します\n`);
    console.log('📝 投稿内容:');
    tweets.forEach((tweet, index) => {
      console.log(`--- ツイート ${index + 1} ---`);
      console.log(tweet);
      console.log('');
    });

    // tweetThread メソッドを使用（内部的に連続投稿）
    const thread = await client.v2.tweetThread(tweets);

    console.log('✅ スレッド投稿成功！');
    console.log(`   Tweet IDs:`);
    
    thread.forEach((tweet, index) => {
      console.log(`   ${index + 1}. https://x.com/i/status/${tweet.data.id}`);
    });

    console.log(`\n🔗 スレッド先頭: https://x.com/i/status/${thread[0].data.id}`);

    return thread;
  } catch (error) {
    console.error('❌ スレッド投稿に失敗しました');
    console.error(`   ${error.message}`);
    
    if (error.code === 429) {
      console.error('\n⚠️  レート制限（429エラー）が発生しました');
      console.error('   Freeプラン: 500 posts/月（約17 posts/日）');
      console.error('   数時間待ってから再試行してください');
    }
    
    throw error;
  }
}

/**
 * マークダウンファイルからツイートを読み込み（---で区切る）
 */
function readTweetsFromMarkdown(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  
  // --- で区切られたツイートに分割
  const tweets = content
    .split(/^---$/gm)
    .map(t => t.trim())
    .filter(t => t.length > 0);

  return tweets;
}

/**
 * テストスレッド
 */
function getTestThread() {
  return [
    '🧵 GitHubリリースノートをXに自動投稿するシステムを作りました！',
    '✨ 機能：\n• GitHubリリース監視\n• AIによる要約（予定）\n• Xへの自動投稿',
    '🚀 使い方：\nnode scripts/post-x.js "メッセージ"',
    '📝 詳しくは：\nhttps://github.com/Sunwood-ai-labs/release-note-x\n\n#GitHub #X #Twitter'
  ];
}

async function main() {
  const args = process.argv.slice(2);
  const client = createTwitterClient();

  let tweets = [];

  if (args.includes('--test')) {
    tweets = getTestThread();
  } else if (args.includes('--file')) {
    const fileIndex = args.indexOf('--file');
    const filePath = args[fileIndex + 1];
    if (!filePath) {
      console.error('❌ ファイルパスを指定してください');
      console.log('   使い方: node scripts/post-thread.js --file <ファイルパス>');
      process.exit(1);
    }
    tweets = readTweetsFromMarkdown(filePath);
  } else {
    // 引数をツイートとして使用
    tweets = args.filter(arg => !arg.startsWith('--'));
  }

  if (tweets.length === 0) {
    console.log('📖 X スレッド投稿スクリプト\n');
    console.log('使い方:');
    console.log('  node scripts/post-thread.js --file RELEASE_NOTES.md\n');
    console.log('ファイル形式（---でツイートを区切る）:');
    console.log('  ツイート1の内容');
    console.log('  ---');
    console.log('  ツイート2の内容');
    console.log('  ---');
    console.log('  ツイート3の内容\n');
    console.log('参考: node scripts/post-thread.js --test');
    process.exit(0);
  }

  // 文字数チェック
  tweets.forEach((tweet, index) => {
    if (tweet.length > 500) {
      console.warn(`⚠️  ツイート${index + 1}が${tweet.length}/500文字です`);
    }
  });

  await postThread(client, tweets);
}

main().catch(error => {
  console.error('💥 エラー:', error.message);
  process.exit(1);
});
