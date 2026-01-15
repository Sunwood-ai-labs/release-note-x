<img src="https://raw.githubusercontent.com/Sunwood-ai-labs/release-note-x/main/assets/release-header-v0.3.0.svg" alt="v0.3.0 Release"/>

# v0.3.0 - AI Summarization & External Prompts / AI要約と外部プロンプト

**リリース日 / Release Date:** 2026-01-14

---

## 日本語 / Japanese

### 概要

v0.3.0 は、AI 要約機能の統合とシステムプロンプトの外部化に焦点を当てたリリースです。リリースノートの作成を AI で自動要約できるようになり、システムプロンプトが外部ファイルで管理可能になりました。また、バイリンガル対応（日本語・英語）が強化されました。

### 新機能

- **AI 要約統合**: X (Twitter) と Discord の投稿に AI 要約を統合
  - リリースノートを自動で要約し、投稿文字数制限内に収める機能
- **外部システムプロンプト**: システムプロンプトを外部 Markdown ファイルで管理
  - `lib/prompts/system-prompt-ja.md` (日本語)
  - `lib/prompts/system-prompt-en.md` (英語)
- **バイリンガルシステムプロンプト v2**: 日本語・英語のバイリンガルシステムプロンプトを追加
  - `lib/prompts/system-prompt-v2-jp-en.md`

### バグ修正

- **ワークフロー**: RELEASE_NOTES の環境変数渡しを修正
  - シェル変数として渡すように変更
  - heredoc を使用して特殊文字を正しく処理
- **OpenAI**: コードブロックを正しく処理するために RELEASE_NOTES を環境変数経由で渡すように修正
- **Post-Release**: 403 エラーの詳細メッセージを追加

### 変更

- **OpenAI クライアント**: 外部 Markdown ファイルからシステムプロンプトを読み込むようにリファクタリング
- **リリースヘッダー**: v0.1.0 ベースデザインに revert し、アニメーションを控えめに調整

### 設定

- **.gitignore**: `ZERO_CC_PRJ` サブディレクトリを除外
- **.SourceSageignore**: SourceSage 無視設定を追加

---

## English

### Overview

v0.3.0 focuses on integrating AI summarization and externalizing system prompts. Release notes can now be automatically summarized by AI for posting within character limits. System prompts are now managed as external files, and bilingual support (Japanese/English) has been enhanced.

### What's New

- **AI Summarization Integration**: Integrated AI summarization for X (Twitter) and Discord posts
  - Automatically summarizes release notes to fit within character limits
- **External System Prompts**: System prompts now managed as external Markdown files
  - `lib/prompts/system-prompt-ja.md` (Japanese)
  - `lib/prompts/system-prompt-en.md` (English)
- **Bilingual System Prompt v2**: Added Japanese-English bilingual system prompt
  - `lib/prompts/system-prompt-v2-jp-en.md`

### Bug Fixes

- **Workflows**: Fixed RELEASE_NOTES environment variable passing
  - Changed to pass as shell variable
  - Use heredoc to handle special characters correctly
- **OpenAI**: Fixed passing RELEASE_NOTES via environment variable to handle code blocks correctly
- **Post-Release**: Added detailed 403 error message

### Changes

- **OpenAI Client**: Refactored to load system prompts from external Markdown files
- **Release Header**: Reverted to v0.1.0 base design with subtle animations

### Configuration

- **.gitignore**: Excluded `ZERO_CC_PRJ` subdirectory
- **.SourceSageignore**: Added SourceSage ignore configuration

---

## アップグレード方法 / Upgrade Guide

```bash
# 方法 1: Git タグから / From Git Tag
git fetch --tags
git checkout v0.3.0

# 方法 2: 最新のメインから / From Latest Main
git pull origin main
```

---

## ファイル変更 / File Changes

```
 .SourceSageignore                        |  25 +++
 .github/workflows/release-to-discord.yml |  47 +----
 .github/workflows/release-to-x.yml       |  47 +----
 .gitignore                               |   1 +
 assets/release-header-v0.2.0.svg         | 289 ++++++++++++-------------------
 docs/AI.md                               |   3 +-
 lib/openai-client.js                     |  57 ++----
 lib/prompts/system-prompt-en.md          |  18 ++
 lib/prompts/system-prompt-ja.md          |  18 ++
 lib/prompts/system-prompt-v2-jp-en.md    | 161 +++++++++++++++++
 scripts/ai-summarize.js                  |  12 +-
 scripts/post-discord.js                  |  26 ++-
 scripts/post-release.js                  |  25 +--
 scripts/post-x.js                        |  25 ++-
 test-release-notes.md                    |  43 +++++
 15 files changed, 487 insertions(+), 310 deletions(-)
```

---

## コントリビューター / Contributors

@Sunwood-ai-labs

---

## 次のリリース予定 / Upcoming Release

- 継続的な機能改善
- ユーザーフィードバックによる最適化

---

## リンク / Links

- [GitHub Repository](https://github.com/Sunwood-ai-labs/release-note-x)
- [Issues](https://github.com/Sunwood-ai-labs/release-note-x/issues)
- [Previous Release (v0.2.0)](https://github.com/Sunwood-ai-labs/release-note-x/releases/tag/v0.2.0)

---

<div align="center">

[Claude Code](https://claude.ai/code) のために ❤️ を込めて / Made with ❤️ for [Claude Code](https://claude.ai/code)

Developed with **GLM-4.7** by Zhipu AI

</div>
