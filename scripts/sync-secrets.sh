#!/bin/bash

# GitHub Secrets同期スクリプト
#
# 使い方:
#   ./scripts/sync-secrets.sh
#   ./scripts/sync-secrets.sh --force
#   ./scripts/sync-secrets.sh --repo OWNER/REPO
#   ./scripts/sync-secrets.sh --repo OWNER/REPO --force
#   ./scripts/sync-secrets.sh --repos "OWNER/REPO1,OWNER/REPO2"
#   ./scripts/sync-secrets.sh --all

echo "🔐 GitHub Secrets 同期スクリプト"
echo ""

# デフォルトのターゲットリポジトリ（カンマ区切り）
DEFAULT_REPOS="Sunwood-ai-labs/MysticLibrary"

# ターゲットリポジトリの解析
TARGET_REPOS=()
ALL_REPOS=false

for arg in "$@"; do
  case $arg in
    --repo=*)
      TARGET_REPOS=("${arg#*=}")
      shift
      ;;
    --repo)
      shift
      TARGET_REPOS=("$1")
      shift
      ;;
    --repos=*)
      IFS=',' read -ra TARGET_REPOS <<< "${arg#*=}"
      shift
      ;;
    --repos)
      shift
      IFS=',' read -ra TARGET_REPOS <<< "$1"
      shift
      ;;
    --all)
      ALL_REPOS=true
      shift
      ;;
  esac
done

# 現在のリポジトリを取得
CURRENT_REPO=$(gh repo view --json owner,name -q '.owner.login + "/" + .name' 2>/dev/null)

# --all オプションの場合、デフォルトリポジトリ＋現在のリポジトリ
if [ "$ALL_REPOS" = true ]; then
  if [ -n "$DEFAULT_REPOS" ]; then
    IFS=',' read -ra DEFAULT_REPOS_ARRAY <<< "$DEFAULT_REPOS"
    TARGET_REPOS=("${DEFAULT_REPOS_ARRAY[@]}")
  fi
  # 現在のリポジトリを追加（まだ含まれていない場合）
  if [[ ! " ${TARGET_REPOS[@]} " =~ " ${CURRENT_REPO} " ]]; then
    TARGET_REPOS+=("$CURRENT_REPO")
  fi
fi

# ターゲットが空の場合は現在のリポジトリを使用
if [ ${#TARGET_REPOS[@]} -eq 0 ]; then
  TARGET_REPOS=("$CURRENT_REPO")
fi

echo "📂 同期先リポジトリ:"
for repo in "${TARGET_REPOS[@]}"; do
  echo "   - $repo"
done
echo "📂 現在のリポジトリ: $CURRENT_REPO"
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

total_success=0
total_failed=0

# 各リポジトリに同期
for TARGET_REPO in "${TARGET_REPOS[@]}"; do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📂 $TARGET_REPO に同期中..."
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
      ((total_success++))
    else
      echo "❌ $key の設定に失敗しました"
      ((failed++))
      ((total_failed++))
    fi
  done

  echo ""
  if [ $success -gt 0 ]; then
    echo "✅ $TARGET_REPO: $success個成功、$failed個失敗"
  fi
  echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $total_success -gt 0 ]; then
  echo "✅ 同期完了！(合計: $total_success個成功、$total_failed個失敗)"
fi

if [ $total_failed -gt 0 ]; then
  echo "⚠️  $total_failed個の設定に失敗しました"
fi

echo ""
echo "📋 次のステップ:"
for repo in "${TARGET_REPOS[@]}"; do
  echo "   1. $repo の Settings → Secrets and variables → Actions で確認"
done
echo "   2. リリースを作成して自動投稿をテスト"
