<div align="center">

<img src="./assets/header.svg" alt="Release Note X Header">

</div>

# Release Note X

GitHubリリースノートを自動的にソーシャルメディアに投稿するシステム

**対応プラットフォーム:**
- 🐦 **X (Twitter)** - 公式API対応
- 💬 **Discord** - Webhook連携
- 🤖 **AI要約** - OpenAI/OpenRouter対応（無料モデルも可）

## 🚀 Features

- 📢 GitHubリリースの自動監視
- 🤖 AIによるリリース内容の要約（OpenAI/OpenRouter）
- 🐦 X（Twitter）への自動投稿
- 💬 Discord への自動投稿（Embed形式）
- ⚙️ 設定可能な要約スタイル
- 🔧 CI/CD統合対応（GitHub Actions）

## 📋 前提条件

- **Node.js** v18 以上
- **npm** または **yarn**
- 各プラットフォームのAPI認証情報（詳細は各ガイド参照）

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

### クイックスタート

```bash
# Clone the repository
git clone https://github.com/Sunwood-ai-labs/release-note-x.git
cd release-note-x

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env

# Edit .env with your API credentials
```

### プラットフォーム別ガイド

各プラットフォームの詳細なセットアップ方法は、別ドキュメントを参照してください：

| プラットフォーム | ドキュメント | 認証方法 |
|----------------|-------------|---------|
| 🐦 X (Twitter) | [docs/X.md](docs/X.md) | X Developer Portal |
| 💬 Discord | [docs/DISCORD.md](docs/DISCORD.md) | Webhook URL |
| 🤖 AI 要約 | [docs/AI.md](docs/AI.md) | OpenAI API / OpenRouter |

---

## 🛠️ Usage

### 各プラットフォームに投稿

```bash
# X (Twitter) にテスト投稿
npm run post:test

# Discord にテスト投稿
npm run discord:test

# 両方に同時投稿
npm run post:all --test
```

### AI 要約

```bash
# テスト要約を生成
npm run summarize --test

# カスタムテキストを要約
node scripts/ai-summarize.js "## 新機能\n- 機能1\n- 機能2"

# AI要約付きで投稿
npm run post:all "v1.0.0" "https://..." "リリースノート" --summarize
```

### スクリプト一覧

| コマンド | 説明 |
|---------|------|
| `npm run post:test` | X にテスト投稿 |
| `npm run discord:test` | Discord にテスト投稿 |
| `npm run post:all` | 両プラットフォームに投稿 |
| `npm run summarize` | AI 要約を生成 |
| `npm run thread:test` | X でスレッド投稿 |
| `npm run sync-secrets` | GitHub Secrets に同期 |

---

## 🔄 GitHub Actions 連携

GitHubリリースと連動して自動的に投稿できます！

### 設定方法

1. `.github/workflows/` のワークフローファイルを対象リポジトリにコピー
2. GitHub Secrets に認証情報を設定:

**X (Twitter):**
- `X_API_KEY`
- `X_API_SECRET`
- `X_ACCESS_TOKEN`
- `X_ACCESS_SECRET`

**Discord:**
- `DISCORD_WEBHOOK_URL`

**AI 要約（オプション）:**
- `OPENAI_API_KEY` または `OPENROUTER_API_KEY`

3. リリースを作成すると自動的に投稿されます

### 手動テスト

```bash
# GitHub Actions から手動実行
gh workflow run release-to-x.yml
gh workflow run release-to-discord.yml
```


## 📁 Project Structure

```
release-note-x/
├── scripts/
│   ├── post-x.js           # X投稿スクリプト
│   ├── post-discord.js     # Discord投稿スクリプト
│   ├── post-thread.js      # スレッド投稿スクリプト
│   ├── post-release.js     # リリース通知スクリプト
│   ├── post-to-all.js      # マルチプラットフォーム投稿
│   ├── ai-summarize.js     # AI要約スクリプト
│   └── sync-secrets.sh     # Secrets同期スクリプト
├── lib/
│   ├── discord-client.js   # Discord Webhook クライアント
│   └── openai-client.js    # OpenAI/OpenRouter クライアント
├── .github/workflows/
│   ├── release-to-x.yml    # X用ワークフロー
│   └── release-to-discord.yml # Discord用ワークフロー
├── docs/
│   ├── X.md                # X設定ガイド
│   ├── DISCORD.md          # Discord設定ガイド
│   └── AI.md               # AI要約ガイド
├── assets/
│   └── header.svg          # ヘッダー画像
├── example/
│   └── RELEASE_NOTES.md    # サンプル
├── package.json
├── .env.example
└── README.md
```

## 🔧 Configuration

### 共通設定

| Environment Variable | 必須 | 説明 |
|---------------------|:----:|-------------|
| `NODE_ENV` | ❌ | 環境指定（production/development） |

### X (Twitter)

| Environment Variable | 必須 | 説明 |
|---------------------|:----:|-------------|
| `X_API_KEY` | ✅ | X API Key |
| `X_API_SECRET` | ✅ | X API Secret |
| `X_ACCESS_TOKEN` | ✅ | X Access Token |
| `X_ACCESS_SECRET` | ✅ | X Access Secret |
| `X_BEARER_TOKEN` | ❌ | Bearer Token (一部APIで必要) |

### Discord

| Environment Variable | 必須 | 説明 |
|---------------------|:----:|-------------|
| `DISCORD_WEBHOOK_URL` | ✅ | Discord Webhook URL |

### AI 要約

| Environment Variable | 必須 | 説明 |
|---------------------|:----:|-------------|
| `OPENAI_API_KEY` | ⚠️ | OpenAI API Key |
| `OPENROUTER_API_KEY` | ⚠️ | OpenRouter API Key |
| `OPENAI_MODEL` | ❌ | OpenAI モデル（デフォルト: gpt-3.5-turbo） |
| `OPENROUTER_MODEL` | ❌ | OpenRouter モデル（デフォルト: google/gemma-7b-it:free） |
| `SUMMARY_LANGUAGE` | ❌ | 言語設定（auto/ja/en） |

## 🚧 Roadmap

### v0.1.0 (完了)
- [x] X (Twitter) 投稿機能
- [x] スレッド投稿機能
- [x] GitHub Actions 連携
- [x] GitHub Secrets 同期ツール

### v0.2.0 (現在)
- [x] Discord 投稿機能
- [x] AI によるリリースノート要約
- [x] OpenRouter サポート（無料モデル）
- [x] マルチプラットフォーム対応
- [x] ドキュメント分割

### 今後
- [ ] 複数リポジトリ監視
- [ ] 投稿履歴管理
- [ ] カスタムテンプレート
- [ ] Web UI

## ⚠️ FAQ

### Q: 無料で使えますか？

**A: はい！** OpenRouter の無料モデルを使えば、AI 要約も無料です。

- X (Twitter): Freeプランで500 posts/月
- Discord: 完全無料
- AI 要約: OpenRouter の無料モデル（Gemma, Mistral等）

### Q: 複数のプラットフォームに同時投稿できますか？

**A: はい！** `npm run post:all` でXとDiscordに同時投稿可能です。

### Q: 通常のタイムライン投稿はできますか？

**A: はい、問題なくできます！** ✅ 詳細は [docs/X.md](docs/X.md) を参照。


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [twitter-api-v2](https://github.com/PLhery/node-twitter-api-v2) - X APIクライアントライブラリ
- [X Developer Platform](https://developer.x.com/) - APIドキュメント
- [OpenAI](https://openai.com/) - AI API
- [OpenRouter](https://openrouter.ai/) - AI モデル統合プラットフォーム

---

<div align="center">

Made with ❤️ by [Sunwood-ai-labs](https://github.com/Sunwood-ai-labs)

**Documentation:**
- [X (Twitter) Guide](docs/X.md)
- [Discord Guide](docs/DISCORD.md)
- [AI Summarization Guide](docs/AI.md)

</div>
