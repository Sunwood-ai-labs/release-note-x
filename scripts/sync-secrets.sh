#!/bin/bash

# GitHub Secrets同期スクリプト
#
# 使い方:
#   ./scripts/sync-secrets.sh
#   ./scripts/sync-secrets.sh --force

echo "🔐 GitHub Secrets 同期スクリプト"
echo ""

# .envファイルを読み込む
env_vars=()
while IFS='=' read -r key value; do
  # コメントと空行をスキップ
  [[ "$key" =~ ^#.*$ ]] && continue
  [[ -z "$key" ]] && continue
  
  # プレースホルダーをスキップ
  [[ "$value" =~ ^your_.*_here$ ]] && continue
  [[ -z "$value" ]] && continue
  
  # Bearer Tokenは除外（Actionsでは不要）
  [[ "$key" = "X_BEARER_TOKEN" ]] && continue
  
  env_vars+=("$key=$value")
done < .env

if [ ${#env_vars[@]} -eq 0 ]; then
  echo "❌ .envファイルに有効な環境変数がありません"
  exit 1
fi

echo "📝 ${#env_vars[@]}個の環境変数を検出しました:"
echo ""
for env in "${env_vars[@]}"; do
  key="${env%%=*}"
  echo "   - $key"
done
echo ""

# forceオプション確認
if [[ ! " $* " =~ " --force " ]]; then
  read -p "GitHub Secretsに設定します。よろしいですか？ (y/N): " answer
  if [ "$answer" != "y" ] && [ "$answer" != "Y" ]; then
    echo "キャンセルしました"
    exit 0
  fi
fi

# Secretを設定
echo "🚀 GitHub Secretsに同期します..."
echo ""

success=0
failed=0

for env in "${env_vars[@]}"; do
  key="${env%%=*}"
  value="${env#*=}"
  
  if echo "$value" | gh secret set "$key" 2>/dev/null; then
    echo "✅ $key → GitHub Secret"
    ((success++))
  else
    echo "❌ $key の設定に失敗しました"
    ((failed++))
  fi
done

echo ""
if [ $success -gt 0 ]; then
  echo "✅ 同期完了！ ($success個成功、$failed個失敗)"
fi

if [ $failed -gt 0 ]; then
  echo "⚠️  $failed個の設定に失敗しました"
fi

echo ""
echo "📋 次のステップ:"
echo "   1. GitHubリポジトリの Settings → Secrets and variables → Actions で確認"
echo "   2. リリースを作成して自動投稿をテスト"
