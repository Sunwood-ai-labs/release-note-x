# AI Summarization Guide

GitHubリリースノートをAIを使って要約するための設定ガイドです。

OpenAI公式APIと、OpenRouter（無料モデル対応）の両方に対応しています。

## 📋 概要

- **OpenAI API**: GPT-3.5/GPT-4 で高品質な要約
- **OpenRouter**: 無料モデル（Gemma, Mistral等）も使用可能

---

## 🚀 Setup

### Option 1: OpenAI API（公式）

#### 1. API Key の取得

1. [OpenAI Platform](https://platform.openai.com/api-keys) にアクセス
2. **Create new secret key** をクリック
3. APIキーをコピー（`sk-`で始まる文字列）

#### 2. 環境変数の設定

`.env` ファイルを編集:

```bash
# OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key-here

# モデル選択（オプション、デフォルト: gpt-3.5-turbo）
OPENAI_MODEL=gpt-3.5-turbo
```

**利用可能なモデル:**
- `gpt-3.5-turbo` - コストパフォーマンス重視
- `gpt-4` - 高品質要約（コスト高）

---

### Option 2: OpenRouter（無料モデル対応）

OpenRouterは複数のAIモデルを統合的に利用できるサービスで、**無料モデル**も提供しています。

#### 1. API Key の取得

1. [OpenRouter](https://openrouter.ai/keys) にアクセス
2. サインアップ/ログイン
3. APIキーをコピー（`sk-or-`で始まる文字列）

#### 2. 環境変数の設定

`.env` ファイルを編集:

```bash
# OpenRouter API Key
OPENROUTER_API_KEY=sk-or-your-openrouter-api-key-here

# Base URL（通常は変更不要）
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# モデル選択（オプション）
OPENROUTER_MODEL=google/gemma-7b-it:free
```

**利用可能な無料モデル:**

| モデル | 特徴 |
|--------|------|
| `google/gemma-7b-it:free` | Google Gemma 7B、日本語対応 |
| `mistralai/mistral-7b-instruct:free` | Mistral 7B、高性能 |
| `gryphe/mythomax-l2-13b:free` | MythoMax 13B、創造的 |

他のモデルは [OpenRouter Models](https://openrouter.ai/models?order=newest&free=true) で確認。

---

## 🛠️ Usage

### CLIで要約をテスト

```bash
# テスト要約（テスト用リリースノートを使用）
npm run summarize --test

# 直接入力して要約
node scripts/ai-summarize.js "## 新機能\n- 機能1\n- 機能2"

# ファイルから要約
node scripts/ai-summarize.js --file path/to/release-notes.md
```

### 出力例

**入力:**
````markdown
## v2.0.0 - Major Release

### 新機能
- ユーザー認証機能を追加
- ダッシュボードを刷新
- ダークモードに対応

### バグ修正
- ファイルアップロード時のメモリリークを修正
- モバイル表示時のレイアウト崩れを修正
````

**出力（日本語）:**
```
🚀 v2.0.0 - Major Release

• ユーザー認証機能を追加
• ダッシュボードを刷新
• ダークモードに対応
• メモリリーク・レイアウト崩れを修正
```

---

## 🔄 GitHub Actions で AI 要約を使用

### 設定方法

1. GitHubリポジトリの **Settings** → **Secrets and variables** → **Actions**
2. 以下のSecretを追加：

**OpenAIの場合:**
| Secret | 値 |
|--------|---|
| `OPENAI_API_KEY` | OpenAI API Key |
| `OPENAI_MODEL` | `gpt-3.5-turbo` (オプション) |

**OpenRouterの場合:**
| Secret | 値 |
|--------|---|
| `OPENROUTER_API_KEY` | OpenRouter API Key |
| `OPENROUTER_BASE_URL` | `https://openrouter.ai/api/v1` (オプション) |
| `OPENROUTER_MODEL` | `z-ai/glm-4.5-air:free` (オプション) |

3. ワークフロー実行時に `enable_summarization: true` を指定

### 使用方法

**X (Twitter) ワークフロー:**
```yaml
# .github/workflows/release-to-x.yml
- name: Post to X with AI summarization
  run: |
    # ... release notes ...
    node scripts/ai-summarize.js "$RELEASE_NOTES"
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
    # または
    OPENROUTER_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}
```

---

## 🌐 言語設定

自動検出または手動設定が可能です。

```bash
# 自動検出（デフォルト）
SUMMARY_LANGUAGE=auto

# 日本語固定
SUMMARY_LANGUAGE=ja

# 英語固定
SUMMARY_LANGUAGE=en
```

---

## 💰 コスト比較

| サービス | モデル | コスト（入力/出力） |
|---------|--------|-------------------|
| OpenAI | gpt-3.5-turbo | $0.50 / $1.50 per 1M tokens |
| OpenAI | gpt-4 | $30 / $60 per 1M tokens |
| OpenRouter | Gemma 7B (free) | **無料** |
| OpenRouter | Mistral 7B (free) | **無料** |

**推定:** 1回の要約あたり約200-500トークン

---

## ⚠️ エラーハンドリング

API エラーが発生した場合、自動的にフォールバック機能が動作します：

1. **要約失敗時**: 元のテキストから簡易要約を生成
2. **ネットワークエラー**: 接続を確認して再試行
3. **レート制限**: クォータ確認を促すメッセージ表示

---

## 🎯 テスト

セットアップ後、以下のコマンドでテストできます：

```bash
# OpenAI テスト
OPENAI_API_KEY=sk-... npm run summarize --test

# OpenRouter テスト
OPENROUTER_API_KEY=sk-or-... npm run summarize --test
```

---

## 🔗 参考リンク

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [OpenRouter Documentation](https://openrouter.ai/docs)
- [OpenRouter Models](https://openrouter.ai/models)
