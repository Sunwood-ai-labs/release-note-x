#!/bin/bash

# GitHub Secrets同期スクリプト
#
# 使い方:
#   ./scripts/sync-secrets.sh
#   ./scripts/sync-secrets.sh --force
#   ./scripts/sync-secrets.sh --repo OWNER/REPO
#   ./scripts/sync-secrets.sh --repo OWNER/REPO --force

echo "🔐 GitHub Secrets 同期スクリプト"
echo ""

# ターゲットリポジトリの解析
TARGET_REPO=""

for arg in "$@"; do
  case $arg in
    --repo=*)
      TARGET_REPO="${arg#*=}"
      shift
      ;;
    --repo)
      shift
      TARGET_REPO="$1"
      shift
      ;;
  esac
done

# 現在のリポジトリを取得
CURRENT_REPO=$(gh repo view --json owner,name -q '.owner.login + "/" + .name' 2>/dev/null)

if [ -z "$TARGET_REPO" ]; then
  TARGET_REPO="$CURRENT_REPO"
fi

echo "📂 同期先リポジトリ: $TARGET_REPO"
if [ "$TARGET_REPO" != "$CURRENT_REPO" ]; then
  echo "📂 現在のリポジトリ: $CURRENT_REPO"
fi
echo ""

# .envファイルを読み込む（変数展開を防ぐ）
env_vars=()
while IFS= read -r line || [[ -n "$line" ]]; do
  # コメントと空行をスキップ
  [[ "$line" =~ ^[[:space:]]*#.*$ ]] && continue
  [[ -z "${line// }" ]] && continue

  # 最初の=でキーと値に分割
  key="${line%%=*}"
  value="${line#*=}"

  # 空のキーをスキップ
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

# gh secret set のオプションを構築
GH_OPTS=""
if [ "$TARGET_REPO" != "$CURRENT_REPO" ]; then
  GH_OPTS="--repo $TARGET_REPO"
fi

for env in "${env_vars[@]}"; do
  key="${env%%=*}"
  value="${env#*=}"

  # 値をヒアドキュメントで渡して変数展開を防ぐ
  if eval "gh secret set '$key' $GH_OPTS --body '$value'" 2>/dev/null; then
    echo "✅ $key → $TARGET_REPO"
    ((success++))
  else
    echo "❌ $key の設定に失敗しました"
    ((failed++))
  fi
done

echo ""
if [ $success -gt 0 ]; then
  echo "✅ 同期完了！ ($success個成功、$failed個失敗)"
  echo "📂 同期先: $TARGET_REPO"
fi

if [ $failed -gt 0 ]; then
  echo "⚠️  $failed個の設定に失敗しました"
fi

echo ""
echo "📋 次のステップ:"
echo "   1. $TARGET_REPO の Settings → Secrets and variables → Actions で確認"
echo "   2. リリースを作成して自動投稿をテスト"
