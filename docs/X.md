# X (Twitter) Integration Guide

GitHubリリースノートをX (Twitter) に自動投稿するための詳細設定ガイドです。

## 📋 前提条件

- **X Developer Account** - [X Developer Portal](https://developer.x.com/en/portal/dashboard) で取得

## 🚀 Setup

### 1. アカウントの作成

**ボット専用アカウントタイプはありません。通常のアカウント作成でOKです！**

#### 自分のアカウントを使う（推奨・最も簡単）

- ✅ 追加作業なし
- ✅ 即座に開始可能
- ✅ Freeプランで十分

#### 専用アカウントを作りたい場合

**手順:**

1. [X.com](https://x.com/) にアクセス
2. 通常通りアカウントを作成
3. **「Automated」ラベルを追加（推奨）:**
   - 設定 → アカウント → アカウント情報
   - **Automation（自動化）** → アカウントの管理
   - 自動アカウントラベルを有効化
4. プロフィールを設定:
   - 名前: `プロジェクト名 Bot` 等
   - 自己紹介: `運営:@あなたのアカウント`

> **💡 「Automated」ラベルを追加すると、プロフィールに「自動アカウント」と表示されます**

参考: [About Automated account labels](https://help.x.com/en/using-x/automated-account-labels)

### 2. X Developer Account の作成

**手順:**

1. [X Developer Portal](https://developer.x.com/en/portal/dashboard) にアクセス
2. 「Sign up for Free Account」または「Get Started」をクリック
3. Xアカウントでログイン
4. 開発者利用規約に同意

**5. Use case の記述（申請用テンプレート）:**

以下の質問に答える必要があります。コピーして使用してください:

---

**Q: Describe all of your use cases of X's data and API**

I will create a bot that automatically posts GitHub release notes to X (Twitter).

**Use Case:**

- Monitor GitHub repositories for new releases
- Summarize release notes using AI (optional)
- Post formatted release announcements to X

**Purpose:**

Automate the sharing of software project updates with followers on X.

**Data Used:**

- POST /2/tweets endpoint for posting tweets only
- No reading of user data, timelines, or search functionality

**Classification:**

- App Type: Bot / Automated App
- Access Level: Read and Write (for posting tweets)

---

6. 開発者利用規約に同意
7. アカウントタイプを選択:
   - **Free** ($0/月) - 500 posts/月
8. プロジェクトを作成:
   - プロジェクト名を入力（例: `release-note-x`）
   - アプリを作成
9. API Keys & Tokens を取得

**取得する認証情報:**

- **API Key** (Consumer Key)
- **API Secret** (Consumer Secret)
- **Access Token**
- **Access Secret**
- **Bearer Token** (オプション)

> **✅ 自分のアカウントで手軽に始められます！** 追加アカウント作成は不要です。

### 3. 環境変数の設定

`.env` ファイルを編集:

```bash
# X (Twitter) API Credentials
X_API_KEY=your_api_key_here
X_API_SECRET=your_api_secret_here
X_ACCESS_TOKEN=your_access_token_here
X_ACCESS_SECRET=your_access_secret_here
X_BEARER_TOKEN=your_bearer_token_here
```

## 🛠️ Usage

### CLIで投稿をテスト

```bash
# テスト投稿
npm run post:test

# カスタムメッセージを投稿
npm run post "こんにちは、世界！"
```

### スクリプト直接実行

```bash
# テスト投稿
node scripts/post-x.js --test

# カスタムメッセージ
node scripts/post-x.js "投稿内容"

# ヘルプ表示
node scripts/post-x.js
```

### スレッド投稿

```bash
# テストスレッド投稿
npm run thread:test

# 複数のツイートでスレッドを作成
node scripts/post-thread.js "ツイート1" "ツイート2" "ツイート3"

# ファイルからスレッド投稿（---で区切る）
node scripts/post-thread.js --file example/RELEASE_NOTES.md
```

**ファイル形式:**

```markdown
ツイート1の内容
---
ツイート2の内容
---
ツイート3の内容
```

## 🔄 GitHub Actions 連携

GitHubリリースと連動して自動的にXに投稿できます！

### 設定方法

1. GitHubリポジトリの **Settings** → **Secrets and variables** → **Actions**
2. 以下のSecretsを追加：

| Secret | 値 |
|--------|---|
| `X_API_KEY` | Developer PortalのAPI Key |
| `X_API_SECRET` | Developer PortalのAPI Secret |
| `X_ACCESS_TOKEN` | Developer PortalのAccess Token |
| `X_ACCESS_SECRET` | Developer PortalのAccess Secret |

3. 変更をプッシュ

### Secretsの設定（簡易方法）

**自動同期スクリプトを使用:**

```bash
# .envからGitHub Secretsに同期
npm run sync-secrets

# 既存のSecretを上書き
npm run sync-secrets --force
```

このスクリプトは `.env` ファイルの内容をGitHub Secretsに自動転送します。

または、手動でSecretsを設定することもできます：

**手動設定手順:**

1. GitHubリポジトリの **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** をクリック
3. 以下のSecretsを追加：

| Name | Secret |
|------|--------|
| `X_API_KEY` | .envの `X_API_KEY` の値 |
| `X_API_SECRET` | .envの `X_API_SECRET` の値 |
| `X_ACCESS_TOKEN` | .envの `X_ACCESS_TOKEN` の値 |
| `X_ACCESS_SECRET` | .envの `X_ACCESS_SECRET` の値 |

4. **Add secret** をクリックして保存

### 使用方法

リリースを作成すると、自動的に以下の内容がXに投稿されます：

```
🚀 リリース名

リリースURL
```

**手動でテスト:**

```bash
node scripts/post-release.js "v1.0.0" "https://github.com/user/repo/releases/tag/v1.0.0"
```

## ⚠️ Known Issues & FAQ

### Q: 通常のタイムライン投稿はできますか？

**A: はい、問題なくできます！** ✅

- 通常の投稿は `POST /2/tweets` エンドメントを使用
- **公式APIで完全サポートされています**
- テキスト、画像、リプライなどすべて機能します
- `twitter-api-v2` ライブラリの `client.v2.tweet()` メソッドで利用可能

### Q: X API Communities 機能について

**コミュニティへの投稿は非公式のみ**

現在、X API v2には**コミュニティに投稿する公式エンドポイントはありません**。

- [X API Communities Lookup](https://docs.x.com/x-api/communities/lookup/introduction) では情報の取得のみ可能
- **コミュニティに投稿する公式エンドポイントはありません**

**回避策:**

1. 通常のタイムラインに投稿 → 手動で「コミュニティに共有」
2. XのアプリまたはWebから直接コミュニティに投稿

### 参考リンク

- [Create Tweets With X API v2 - 詳細チュートリアル](https://mydeveloperplanet.com/2024/05/01/create-tweets-with-x-api-v2/)
- [How to Post Tweets via Twitter API in Node.js](https://www.omi.me/blogs/api-guides/how-to-post-tweets-via-twitter-api-in-node.js)
- [twitter-api-v2 GitHub Examples](https://github.com/PLhery/node-twitter-api-v2/blob/master/doc/examples.md)
