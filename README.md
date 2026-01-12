<div align="center">

<img src="./assets/header.svg" alt="Release Note X Header">

</div>

# Release Note X

GitHubリリースノートを要約してXに投稿するシステム

> **✅ 通常のタイムライン投稿は公式APIで完全サポートされています**
>

## 🚀 Features

- 📢 GitHubリリースノートを自動監視
- 🤝 AIによるリリース内容の要約（予定）
- 🐦 X（Twitter）への自動投稿
- ⚙️ 設定可能な要約スタイル（予定）
- 🔧 CI/CD統合対応（GitHub Actions / CircleCI）

## 📋 前提条件

- **Node.js** v18 以上
- **npm** または **yarn**
- **X Developer Account** - [X Developer Portal](https://developer.x.com/en/portal/dashboard) で取得

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Sunwood-ai-labs/release-note-x.git
cd release-note-x

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env
```

## ⚙️ Setup

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
8. API Keys & Tokens を取得

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

### 4. 依存パッケージ

```json
{
  "dependencies": {
    "twitter-api-v2": "^1.22.0",
    "dotenv": "^16.4.1"
  }
}
```

> **💡 注意:** `twitter-api-v2` はX (Twitter) APIの仕様変更により、今後メンテナンスされない可能性があります。詳細は [twitter-api-v2 on npm](https://www.npmjs.com/package/twitter-api-v2) を参照。

## 🛠️ Usage

### X API v2 で投稿する仕組み


### スレッド投稿

```bash
# テストスレッド投稿
npm run thread:test

# 複数のツイートでスレッドを作成
node scripts/post-thread.js "ツイート1" "ツイート2" "ツイート3"

# ファイルからスレッド投稿（---で区切る）
node scripts/post-thread.js --file RELEASE_NOTES.md

**ファイル形式:**
```/
ツイート1の内容
---
ツイート2の内容
---
ツイート3の内容
```
```
node scripts/post-thread.js --file example/RELEASE_NOTES.md
```
**通常のタイムライン投稿は `POST /2/tweets` エンドメントを使用します**

このエンドポイントは公式APIで完全サポートされており、以下の機能が利用可能です：

- ✅ テキスト投稿（最大500文字）
- ✅ 画像/動画添付
- ✅ リプライ
- ✅ リンク付き投稿
- ✅ ハッシュタグ
- ✅ メンション

**APIエンドポイント:** `POST https://api.x.com/2/tweets`

**認証方式:** OAuth 1.0a User Context または OAuth 2.0

参考: [Create or Edit Post - X API Documentation](https://docs.x.com/x-api/posts/create-post)

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

## 📁 Project Structure

```
release-note-x/
├── scripts/
│   ├── post-x.js          # X投稿スクリプト
│   ├── ai-summarize.js    # AI要約スクリプト（予定）
│   └── types.ts           # 型定義（予定）
├── .github/
│   └── workflows/
│       └── release-to-x.yml  # GitHub Actions（予定）
├── assets/
│   └── header.svg         # ヘッダー画像
├── package.json
├── .env.example
└── README.md
```

## 🔧 Configuration

| Environment Variable | 必須 | 説明 |
|---------------------|:----:|-------------|
| `X_API_KEY` | ✅ | X (Twitter) API Key |
| `X_API_SECRET` | ✅ | X (Twitter) API Secret |
| `X_ACCESS_TOKEN` | ✅ | X (Twitter) Access Token |
| `X_ACCESS_SECRET` | ✅ | X (Twitter) Access Secret |
| `X_BEARER_TOKEN` | ⚠️ | Bearer Token (一部APIで必要) |

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

### 使用方法

リリースを作成すると、自動的に以下の内容がXに投稿されます：

```
🚀 リリース名

リリースURL```

**手動でテスト:**

```bash
node scripts/post-release.js "v1.0.0" "https://github.com/user/repo/releases/tag/v1.0.0"
```

## 🚧 Roadmap

- [x] X (Twitter) 投稿機能
- [ ] AIによるリリースノート要約
- [x] GitHub Actions 連携
- [ ] GitHub Actions ワークフロー
- [ ] CircleCI Orb
- [ ] 複数リポジトリ監視
- [ ] 投稿履歴管理

## ⚠️ Known Issues & FAQ

### Q: 通常のタイムライン投稿はできますか？

**A: はい、問題なくできます！** ✅

- 通常の投稿は `POST /2/tweets` エンドメントを使用
- **公式APIで完全サポートされています**
- テキスト、画像、リプライなどすべて機能します
- `twitter-api-v2` ライブラリの `client.v2.tweet()` メソッドで利用可能

### 参考リンク

- [Create Tweets With X API v2 - 詳細チュートリアル](https://mydeveloperplanet.com/2024/05/01/create-tweets-with-x-api-v2/)
- [How to Post Tweets via Twitter API in Node.js](https://www.omi.me/blogs/api-guides/how-to-post-tweets-via-twitter-api-in-node-js)
- [twitter-api-v2 GitHub Examples](https://github.com/PLhery/node-twitter-api-v2/blob/master/doc/examples.md)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [twitter-api-v2](https://github.com/PLhery/node-twitter-api-v2) - X APIクライアントライブラリ
- [X Developer Platform](https://developer.x.com/) - APIドキュメント

---

<div align="center">

Made with ❤️ by [Sunwood-ai-labs](https://github.com/Sunwood-ai-labs)

**Sources:**
- [twitter-api-v2 on npm](https://www.npmjs.com/package/twitter-api-v2)
- [X API Documentation](https://docs.x.com/x-api/introduction)
- [X API Communities](https://docs.x.com/x-api/communities/lookup/introduction)

</div>
