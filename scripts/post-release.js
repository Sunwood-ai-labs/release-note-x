#!/usr/bin/env node

/**
 * GitHubリリース通知をXに投稿するスクリプト
 *
 * 使い方:
 *   node scripts/post-release.js "リリース名" "リリースURL"
 */

import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

async function postRelease(client, title, url) {
  try {
    // 投稿内容を作成
    const tweet = `🚀 ${title}\n\n${url}`;

    console.log('📝 リリース通知を投稿します');
    console.log('---');
    console.log(tweet);
    console.log('---');

    // 投稿
    const result = await client.v2.tweet(tweet);

    console.log('✅ 投稿成功！');
    console.log(`   Tweet ID: ${result.data.id}`);
    console.log(`   URL: https://x.com/i/status/${result.data.id}`);

    return result;
  } catch (error) {
    console.error('❌ 投稿に失敗しました');
    console.error(`   ${error.message}`);

    if (error.code === 403) {
      console.error('\n⚠️  権限エラー（403 Forbidden）');
      console.error('   原因: X APIの権限設定が不十分です');
      console.error('   解決策:');
      console.error('   1. https://developer.x.com/en/portal/dashboard にアクセス');
      console.error('   2. App Settings → Permissions → "Read and write" に変更');
      console.error('   3. Access Tokenを再生成して.envを更新');
    } else if (error.code === 429) {
      console.error('\n⚠️  レート制限（429エラー）が発生しました');
      console.error('   Freeプラン: 500 posts/月');
    } else if (error.code === 401) {
      console.error('\n⚠️  認証エラー（401 Unauthorized）');
      console.error('   APIキーまたはトークンが無効です');
    }

    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('❌ 引数が不足しています');
    console.log('使い方: node scripts/post-release.js "リリース名" "リリースURL"');
    process.exit(1);
  }

  const [title, url] = args;
  const client = createTwitterClient();

  await postRelease(client, title, url);
}

main().catch(error => {
  console.error('💥 エラー:', error.message);
  process.exit(1);
});
