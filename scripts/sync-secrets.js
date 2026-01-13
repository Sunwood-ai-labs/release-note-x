#!/usr/bin/env node

/**
 * GitHub Secrets同期スクリプト
 *
 * .envファイルの内容をGitHub Secretsに同期します
 *
 * 使い方:
 *   node scripts/sync-secrets.js
 *   node scripts/sync-secrets.js --force  # 確認なしで上書き
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 値をマスクして表示（先頭4文字 + ****）
 */
function maskValue(value) {
  if (!value || value.length < 4) return '****';
  return `${value.substring(0, 4)}${'*'.repeat(Math.min(value.length - 4, 12))}`;
}

/**
 * .envファイルを読み込む
 */
function loadEnvFile() {
  try {
    const content = readFileSync(join(__dirname, '..', '.env'), 'utf-8');
    const env = {};
    
    content.split('\n').forEach(line => {
      line = line.trim();
      // コメントと空行を無視
      if (!line || line.startsWith('#')) return;
      
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        // 空の値は除外
        if (value && value !== 'your_api_key_here' && value !== 'your_api_secret_here') {
          env[key] = value;
        }
      }
    });
    
    return env;
  } catch (error) {
    console.error('❌ .envファイルの読み込みに失敗しました');
    console.error(`   ${error.message}`);
    process.exit(1);
  }
}

/**
 * GitHub Secretを設定
 */
function setGitHubSecret(key, value) {
  try {
    const masked = maskValue(value);
    // gh secret set コマンドを実行
    execSync(`echo "${value}" | gh secret set ${key}`, {
      stdio: 'pipe',
      stderr: 'pipe'
    });
    console.log(`✅ ${key} (${masked}) → GitHub Secret`);
  } catch (error) {
    console.error(`❌ ${key} の設定に失敗しました`);
    console.error(`   ${error.message}`);
  }
}

/**
 * 既存のSecretを確認
 */
async function checkExistingSecrets(envVars) {
  try {
    const result = execSync('gh secret list', { 
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    
    const existingSecrets = JSON.parse(result);
    const secrets = existingSecrets.map(s => s.name);
    
    return Object.keys(envVars).filter(key => secrets.includes(key));
  } catch (error) {
    // Secretsがない場合
    return [];
  }
}

/**
 * 確認プロンプト
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

/**
 * メイン処理
 */
async function main() {
  console.log('🔐 GitHub Secrets 同期スクリプト\n');

  // .envファイルを読み込み
  const envVars = loadEnvFile();
  
  if (Object.keys(envVars).length === 0) {
    console.error('❌ .envファイルに有効な環境変数がありません');
    process.exit(1);
  }

  console.log(`📝 ${Object.keys(envVars).length}個の環境変数を検出しました:\n`);
  Object.keys(envVars).forEach(key => {
    const masked = maskValue(envVars[key]);
    console.log(`   - ${key}: ${masked}`);
  });
  console.log('');

  // 既存のSecretを確認
  const existingSecrets = await checkExistingSecrets(envVars);
  
  if (existingSecrets.length > 0) {
    console.log(`⚠️  以下のSecretは既に存在します:`);
    existingSecrets.forEach(key => console.log(`   - ${key}`));
    console.log('');
  }

  // forceオプション確認
  const force = process.argv.includes('--force');
  
  if (!force && existingSecrets.length > 0) {
    const answer = await prompt('既存のSecretを上書きしますか？ (y/N): ');
    if (answer.toLowerCase() !== 'y') {
      console.log('キャンセルしました');
      process.exit(0);
    }
  }

  // Secretを設定
  console.log('🚀 GitHub Secretsに同期します...\n');
  
  for (const [key, value] of Object.entries(envVars)) {
    setGitHubSecret(key, value);
  }

  console.log('\n✅ 同期完了！');
  console.log('\n📋 次のステップ:');
  console.log('   1. GitHubリポジトリの Settings → Secrets and variables → Actions で確認');
  console.log('   2. リリースを作成して自動投稿をテスト');
}

main().catch(error => {
  console.error('💥 エラー:', error.message);
  process.exit(1);
});
