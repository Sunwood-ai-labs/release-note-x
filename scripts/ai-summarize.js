#!/usr/bin/env node

/**
 * AI要約スクリプト
 *
 * 使い方:
 *   node scripts/ai-summarize.js "リリースノート"
 *   node scripts/ai-summarize.js --file path/to/release-notes.md
 *   node scripts/ai-summarize.js --test
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { createOpenAIClient, summarizeRelease, createFallbackSummary, detectLanguage } from '../lib/openai-client.js';

// ES Moduleで__dirnameを取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .envを読み込み
dotenv.config({ path: join(__dirname, '..', '.env') });

/**
 * テスト用のリリースノート
 */
function getTestReleaseNotes() {
  return `# v2.0.0 - Major Release

## 新機能

- 🔐 ユーザー認証機能を追加
- 📊 ダッシュボードを刷新
- 🎨 ダークモードに対応
- 🌐 多言語サポート（日本語、英語、中国語）

## バグ修正

- ファイルアップロード時のメモリリークを修正
- モバイル表示時のレイアウト崩れを修正
- ログインセッションの有効期限バグを修正

## 変更点

- APIレスポンス形式を変更
- 依存パッケージをアップデート
- コードベースをリファクタリング

## 互換性

- Node.js 18以上が必要になりました
- 古いバージョンからの移行ガイドを追加`;
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2);

  // ヘルプ表示
  if (args.includes('--help') || args.includes('-h')) {
    console.log('📖 AI要約スクリプト\n');
    console.log('使い方:');
    console.log('  node scripts/ai-summarize.js "リリースノート"');
    console.log('  node scripts/ai-summarize.js --file path/to/release-notes.md');
    console.log('  node scripts/ai-summarize.js --test\n');
    console.log('環境変数:');
    console.log('  OPENAI_API_KEY - OpenAI APIキー (必須)');
    console.log('  OPENAI_MODEL   - 使用するモデル (オプション、デフォルト: gpt-3.5-turbo)\n');
    process.exit(0);
  }

  let client;
  let releaseNotes;

  try {
    // OpenAIクライアントを初期化
    client = createOpenAIClient();

    // 引数の解析
    if (args.includes('--test')) {
      // テストモード
      releaseNotes = getTestReleaseNotes();
      console.log('🧪 テストモードで要約を生成します\n');
    } else if (args.includes('--file')) {
      // ファイルから読み込み
      const fileIndex = args.indexOf('--file');
      const filePath = args[fileIndex + 1];

      if (!filePath) {
        console.error('❌ ファイルパスが指定されていません');
        console.log('使い方: node scripts/ai-summarize.js --file path/to/file.md\n');
        process.exit(1);
      }

      try {
        releaseNotes = readFileSync(filePath, 'utf-8');
        console.log(`📄 ファイルを読み込み: ${filePath}\n`);
      } catch (error) {
        console.error(`❌ ファイルの読み込みに失敗しました: ${filePath}`);
        console.error(`   ${error.message}\n`);
        process.exit(1);
      }
    } else {
      // 引数から直接取得
      releaseNotes = args.join(' ');
    }

    // リリースノートのチェック
    if (!releaseNotes || releaseNotes.trim().length === 0) {
      console.log('❌ リリースノートが指定されていません');
      console.log('使い方: node scripts/ai-summarize.js "リリースノート"');
      console.log('       node scripts/ai-summarize.js --file path/to/file.md');
      console.log('       node scripts/ai-summarize.js --test\n');
      process.exit(1);
    }

    // 言語検出
    const detectedLanguage = detectLanguage(releaseNotes);
    console.log(`🌐 言語: ${detectedLanguage === 'ja' ? '日本語' : 'English'}\n`);

    // 要約生成
    console.log('📝 元のリリースノート:');
    console.log('---');
    console.log(releaseNotes);
    console.log('---\n');

    const summary = await summarizeRelease(client, releaseNotes);

    console.log('\n📋 生成された要約:');
    console.log('---');
    console.log(summary);
    console.log('---\n');

    console.log(`✅ 要約完了! (文字数: ${summary.length})`);

  } catch (error) {
    if (error.message.includes('OPENAI_API_KEY')) {
      console.error('\n❌ OpenAI APIキーが設定されていません');
      console.log('   .envファイルに OPENAI_API_KEY を設定してください\n');
      console.log('   取得方法:');
      console.log('   1. https://platform.openai.com/api-keys にアクセス');
      console.log('   2. Create new secret key をクリック');
      console.log('   3. APIキーをコピーして.envに貼り付け\n');

      // Fallback: 簡易要約
      if (releaseNotes) {
        const fallback = createFallbackSummary(releaseNotes);
        console.log('\n📋 フォールバック要約:');
        console.log('---');
        console.log(fallback);
        console.log('---\n');
      }
    } else {
      console.error('\n💥 エラーが発生しました:', error.message);

      // Fallback for other errors
      if (releaseNotes) {
        console.log('\nフォールバック要約を生成します...\n');
        const fallback = createFallbackSummary(releaseNotes);
        console.log('📋 フォールバック要約:');
        console.log('---');
        console.log(fallback);
        console.log('---\n');
      }
    }
    process.exit(1);
  }
}

// 実行
main().catch(error => {
  console.error('💥 予期しないエラー:', error.message);
  process.exit(1);
});
