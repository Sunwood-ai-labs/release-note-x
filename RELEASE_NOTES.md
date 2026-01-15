<img src="https://raw.githubusercontent.com/Sunwood-ai-labs/release-note-x/main/assets/release-header-v0.2.0.svg" alt="v0.2.0 Release"/>

# v0.2.0 - マルチプラットフォーム拡張リリース / Multi-Platform Expansion Release

**リリース日 / Release Date:** 2026年1月13日 / January 13, 2026

---

## 日本語 / Japanese

### 概要

Release Note X v0.2.0 は、Discord と AI 要約機能のサポートにより、マルチプラットフォーム対応を実現したメジャーアップデートです。OpenRouter の無料モデルを使用することで、AI 要約も無料で利用可能になりました。

### 新機能

#### Discord 連携
- **Discord Webhook 投稿**: Embed 形式でリッチなリリース通知
- **GitHub Actions 連携**: リリース作成時に自動的に Discord へ投稿
- **カスタマイズ可能な Embed**: カラー、フッター、タイムスタンプ設定

#### AI 要約
- **OpenAI サポート**: GPT モデルによるリリースノートの自動要約
- **OpenRouter サポート**: 無料モデル（Gemma, Mistral 等）対応
- **言語自動検出**: 日本語/英語の自動判別
- **要約スタイル設定**: 要約の長さやトーンをカスタマイズ可能

#### マルチプラットフォーム
- **同時投稿機能**: X (Twitter) と Discord への同時投稿
- **統一された CLI**: シンプルなコマンドで全プラットフォームに対応

#### ドキュメント
- **X (Twitter) ガイド**: `docs/X.md` - API キー取得から投稿まで
- **Discord ガイド**: `docs/DISCORD.md` - Webhook 設定から Embed カスタマイズまで
- **AI 要約ガイド**: `docs/AI.md` - OpenAI/OpenRouter 設定からプロンプト設定まで

### バグ修正

- **Discord 応答処理**: 204 No Content 応答の適切なハンドリングを追加
- **post-release スクリプト**: catch ブロックの構文エラーを修正
- **ワークフロー**: AI 要約のエラーハンドリングを改善

### ワークフロー改善

- **手動トリガー対応**: GitHub Actions から手動実行可能
- **AI 要約統合**: X 投稿ワークフローに AI 要約機能を統合
- **Discord ワークフロー**: 新しく `.github/workflows/release-to-discord.yml` を追加

### 開発者体験

- **スクリプト拡張**: `npm run discord:test` でテスト投稿可能
- **環境変数テンプレート**: `.env.example` に Discord と AI 設定を追加
- **詳細なログ**: 投稿内容の確認とデバッグが容易に

### アップグレード方法

```bash
# Git タグから取得
git fetch --tags
git checkout v0.2.0

# または最新の main ブランチから
git pull origin main
```

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/Sunwood-ai-labs/release-note-x.git
cd release-note-x

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env
# .env を編集して API キーを設定
```

---

## English

### Overview

Release Note X v0.2.0 is a major update that achieves multi-platform support through Discord integration and AI summarization features. AI summarization is now available for free using OpenRouter's free models.

### What's New

#### Discord Integration
- **Discord Webhook Posting**: Rich release notifications in Embed format
- **GitHub Actions Integration**: Automatically post to Discord on release creation
- **Customizable Embeds**: Configure colors, footers, and timestamps

#### AI Summarization
- **OpenAI Support**: Automatic release note summarization using GPT models
- **OpenRouter Support**: Free models supported (Gemma, Mistral, etc.)
- **Language Auto-Detection**: Automatic Japanese/English detection
- **Summary Style Settings**: Customize summary length and tone

#### Multi-Platform
- **Simultaneous Posting**: Post to X (Twitter) and Discord simultaneously
- **Unified CLI**: Simple commands for all platforms

#### Documentation
- **X (Twitter) Guide**: `docs/X.md` - From API key acquisition to posting
- **Discord Guide**: `docs/DISCORD.md` - From webhook setup to embed customization
- **AI Summarization Guide**: `docs/AI.md` - From OpenAI/OpenRouter setup to prompt configuration

### Bug Fixes

- **Discord Response Handling**: Added proper handling for 204 No Content responses
- **post-release Script**: Fixed syntax error in catch block
- **Workflow**: Improved AI summarization error handling

### Workflow Improvements

- **Manual Trigger Support**: Manual execution from GitHub Actions
- **AI Summarization Integration**: Integrated AI summarization into X posting workflow
- **Discord Workflow**: Added `.github/workflows/release-to-discord.yml`

### Developer Experience

- **Script Extensions**: `npm run discord:test` for test posts
- **Environment Variable Template**: Added Discord and AI settings to `.env.example`
- **Detailed Logging**: Easier content verification and debugging

### Upgrade

```bash
# Fetch by git tag
git fetch --tags
git checkout v0.2.0

# Or from latest main branch
git pull origin main
```

### Installation

```bash
# Clone repository
git clone https://github.com/Sunwood-ai-labs/release-note-x.git
cd release-note-x

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env to set API keys
```

---

## Environment Variables

### Discord (Required)

| Variable | Description |
|----------|-------------|
| `DISCORD_WEBHOOK_URL` | Discord Webhook URL |

### AI Summarization (Optional)

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API Key (or use OpenRouter) |
| `OPENROUTER_API_KEY` | OpenRouter API Key (supports free models) |
| `OPENROUTER_MODEL` | Model name (default: `google/gemma-7b-it:free`) |
| `SUMMARY_LANGUAGE` | Language preference (auto/ja/en) |

---

## Usage Examples

```bash
# Discord test post
npm run discord:test

# AI summarization test
npm run summarize --test

# Post to both platforms
npm run post:all "v0.2.0" "https://..." "Release notes" --summarize
```

---

## Change Statistics

```
18 files changed, 2646 insertions(+), 244 deletions(-)
```

---

## ライセンス / License

MIT License - 詳細は [LICENSE](LICENSE) を参照 / see [LICENSE](LICENSE) for details.

---

## リンク / Links

- [リポジトリ / Repository](https://github.com/Sunwood-ai-labs/release-note-x)
- [イシュー / Issues](https://github.com/Sunwood-ai-labs/release-note-x/issues)
- [v0.1.0 リリース / v0.1.0 Release](https://github.com/Sunwood-ai-labs/release-note-x/releases/tag/v0.1.0)

---

<div align="center">

[Claude Code](https://claude.ai/code) のために ❤️ を込めて / Made with ❤️ for [Claude Code](https://claude.ai/code)

</div>
