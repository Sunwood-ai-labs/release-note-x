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
  return `# v0.2.0 - Multi-Platform Expansion Release

## 新機能

- 💬 Discord Webhook 投稿機能
- 🤖 AI によるリリースノート要約
- 🌐 マルチプラットフォーム対応（X + Discord）
- 🔧 OpenRouter サポート（無料モデル）

## バグ修正

- Discord 応答処理: 204 No Content 対応
- post-release スクリプトの構文エラー修正
- ワークフローの YAML 構文エラー修正

## 変更点

- README をマルチプラットフォーム対応に書き直し
- ドキュメントを分割（X.md, DISCORD.md, AI.md）
- GitHub Secrets 同期ツール追加

## 互換性

- Node.js 18 以上が必要`;
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2);

  // Check for quiet mode (output only the summary)
  const quietMode = args.includes('--quiet');
  if (quietMode) {
    // Remove --quiet from args for further processing
    const quietIndex = args.indexOf('--quiet');
    args.splice(quietIndex, 1);
  }

  // ヘルプ表示
  if (args.includes('--help') || args.includes('-h')) {
    console.log('📖 AI要約スクリプト\n');
    console.log('使い方:');
    console.log('  node scripts/ai-summarize.js "リリースノート"');
    console.log('  node scripts/ai-summarize.js --file path/to/release-notes.md');
    console.log('  node scripts/ai-summarize.js --test');
    console.log('  node scripts/ai-summarize.js --quiet (要約のみ出力)\n');
    console.log('環境変数:');
    console.log('  OPENAI_API_KEY - OpenAI APIキー (必須)');
    console.log('  OPENAI_MODEL   - 使用するモデル (オプション、デフォルト: gpt-3.5-turbo)\n');
    process.exit(0);
  }

  let client;
  let releaseNotes;

  try {
    // OpenAIクライアントを初期化
    client = createOpenAIClient({ quiet: quietMode });

    // 引数の解析
    if (args.includes('--test')) {
      // テストモード
      releaseNotes = getTestReleaseNotes();
      if (!quietMode) console.log('🧪 テストモードで要約を生成します\n');
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
        if (!quietMode) console.log(`📄 ファイルを読み込み: ${filePath}\n`);
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
    if (!quietMode) console.log(`🌐 言語: ${detectedLanguage === 'ja' ? '日本語' : 'English'}\n`);

    // 要約生成
    if (!quietMode) {
      console.log('📝 元のリリースノート:');
      console.log('---');
      console.log(releaseNotes);
      console.log('---\n');
    }

    const summary = await summarizeRelease(client, releaseNotes, { quiet: quietMode });

    if (!quietMode) {
      console.log('\n📋 生成された要約:');
      console.log('---');
      console.log(summary);
      console.log('---\n');
      console.log(`✅ 要約完了! (文字数: ${summary.length})`);
    } else {
      // Quiet mode: output only the summary
      console.log(summary);
    }

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
