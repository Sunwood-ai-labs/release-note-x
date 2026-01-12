<img src="./assets/release-header-v0.1.0.svg" alt="v0.1.0 Release Header"/>

# v0.1.0 - Initial Release / 初回リリース

**リリース日 / Release Date:** 2026-01-13

---

## 日本語 / Japanese

### 概要

GitHubリリースノートを自動監視し、X（Twitter）に投稿するシステムの初回リリースです。

### 新機能

- 🐦 X（Twitter）投稿機能
  - twitter-api-v2 を使用した公式API対応
  - シンプルなCLIコマンドでの投稿
  - テスト投稿機能

- 🧵 スレッド投稿機能
  - 複数ツイートの連続投稿
  - ファイルからの読み込み対応（`---` デリミタ方式）
  - スレッドの自動構築

- 🔄 GitHub Actions 連携
  - リリース作成時の自動投稿ワークフロー
  - `.github/workflows/release-to-x.yml` を同梱

- 🔐 GitHub Secrets 同期ツール
  - `.env` からGitHub Secretsへの一括転送
  - `npm run sync-secrets` で簡単設定

### 変更

- ♻️ スレッドデリミタを `---` に統一
- 🎨 ヘッダー画像のタイポグラフィ改善（SF Pro Display フォント適用）
- 📝 README のマークダウンフォーマット修正

### 使用方法

```bash
# インストール
npm install

# 環境変数設定
cp .env.example .env

# テスト投稿
npm run post:test

# スレッド投稿
npm run thread:test

# GitHub Secrets に同期
npm run sync-secrets
```

---

## English

### Overview

First release of Release Note X - a system that monitors GitHub releases and automatically posts them to X (Twitter).

### What's New

- 🐦 X (Twitter) Posting Functionality
  - Official API support via twitter-api-v2
  - Simple CLI commands for posting
  - Test posting feature

- 🧵 Thread Posting Feature
  - Sequential posting of multiple tweets
  - File input support (`---` delimiter format)
  - Automatic thread construction

- 🔄 GitHub Actions Integration
  - Auto-post workflow on release creation
  - Includes `.github/workflows/release-to-x.yml`

- 🔐 GitHub Secrets Sync Tool
  - Bulk transfer from `.env` to GitHub Secrets
  - Easy setup with `npm run sync-secrets`

### Changes

- ♻️ Unified thread delimiter to `---`
- 🎨 Improved header typography (SF Pro Display font)
- 📝 Fixed README markdown formatting

### Usage

```bash
# Install
npm install

# Setup environment variables
cp .env.example .env

# Test post
npm run post:test

# Thread post
npm run thread:test

# Sync to GitHub Secrets
npm run sync-secrets
```

---

## Installation

```bash
git clone https://github.com/Sunwood-ai-labs/release-note-x.git
cd release-note-x
npm install
```

## Documentation

Full documentation available at: [README.md](https://github.com/Sunwood-ai-labs/release-note-x#readme)

---

<div align="center">

Made with ❤️ by [Sunwood-ai-labs](https://github.com/Sunwood-ai-labs)

</div>
