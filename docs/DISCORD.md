# Discord Integration Guide

GitHubリリースノートをDiscordに自動投稿するための詳細設定ガイドです。

## 📋 前提条件

- Discord サーバーの管理権限
- Webhook 作成権限

## 🚀 Setup

### Discord Webhook URL の取得方法

#### ステップ 1: Discord サーバーを開く

Webhook を作成したい Discord サーバーを開きます。

#### ステップ 2: サーバー設定を開く

サーバー名の横にある**下矢印（▼）**をクリックし、**「サーバー設定」**を選択します。

**ショートカットキー:**
- **Windows**: `Ctrl` + `Shift` + `S`
- **Mac**: `Cmd` + `Shift` + `S`

#### ステップ 3: インテグレーションを選択

左メニューから**「インテグレーション」**をクリックします。

#### ステップ 4: Webhook を作成

**「Webhook」**セクションを見つけ、**「Webhook を取得」**ボタンをクリックします。

#### ステップ 5: Webhook を設定

1. **名前**: Webhook の名前を入力（例: `Release Note Bot`）
2. **アイコン**: 必要に応じてアイコンを変更
3. **チャンネル**: 投稿先のチャンネルを選択
4. **「Webhook URL をコピー」**ボタンをクリック

コピーされた URL は以下の形式です:
```
https://discord.com/api/webhooks/1234567890/abcdefghijklmnopqrstuvwxyz
```

#### ステップ 6: .env に設定

コピーした URL を `.env` ファイルに貼り付けます:

```bash
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/1234567890/abcdefghijklmnopqrstuvwxyz
```

---

## 🖼️ Webhook の管理オプション

Webhook 作成後、以下の設定が可能です：

| 設定項目 | 説明 |
|---------|------|
| **名前** | 投稿時のボット名 |
| **アイコン** | 投稿時のアバター画像 |
| **チャンネル** | 投稿先チャンネルの変更 |
| **コピー** | Webhook URL の再コピー |
| **削除** | Webhook の削除 |

---

## 🛠️ Usage

### CLIで投稿をテスト

```bash
# テスト投稿
npm run discord:test

# カスタムメッセージを投稿
node scripts/post-discord.js "リリース名" "URL"
```

### スクリプト直接実行

```bash
# テスト投稿
node scripts/post-discord.js --test

# カスタムメッセージ
node scripts/post-discord.js "v1.0.0" "https://github.com/user/repo/releases/tag/v1.0.0"

# 要約付きで投稿
node scripts/post-discord.js "v1.0.0" "https://..." "要約テキスト"

# ヘルプ表示
node scripts/post-discord.js --help
```

## 🎨 Discord Embed 形式

Discordにはリッチな埋め込みメッセージ（Embed）で投稿されます：

```
┌─────────────────────────────────────────┐
│ 🚀 Release v1.0.0                       │
│                                         │
│ 新しいリリースが利用可能です！            │
│                                         │
│ 📦 リリース: v1.0.0                     │
│ 🔗 リンク: GitHub Releases              │
│                                         │
│ Release Note X                          │
└─────────────────────────────────────────┘
```

## 🔄 GitHub Actions 連携

GitHubリリースと連動して自動的にDiscordに投稿できます！

### 設定方法

1. GitHubリポジトリの **Settings** → **Secrets and variables** → **Actions**
2. 以下のSecretを追加：

| Secret | 値 |
|--------|---|
| `DISCORD_WEBHOOK_URL` | Discord Webhook URL |

3. 変更をプッシュ

### 使用方法

リリースを作成すると、自動的に以下の内容がDiscordに投稿されます：

```
🚀 リリース名
リリースURL
```

**手動でテスト:**

```bash
node scripts/post-discord.js "v1.0.0" "https://github.com/user/repo/releases/tag/v1.0.0"
```

## 🔒 セキュリティ上の注意

- ⚠️ **Webhook URL を公開しない** - 誰でも投稿できます
- ⚠️ **GitHub Secrets に保存** - `.env` を `.gitignore` に含める
- ✅ **定期的なローテーション** - 漏洩が疑われる場合は再作成

## 🎯 テスト投稿

セットアップ後、以下のコマンドでテストできます：

```bash
npm run discord:test
```

成功すると、指定したチャンネルにテストメッセージが投稿されます。
