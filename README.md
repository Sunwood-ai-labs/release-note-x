<div align="center">

<img src="./assets/header.svg" alt="Release Note X Header">

</div>

# Release Note X

GitHubリリースノートを要約してXに投稿するシステム

## 🚀 Features

- 📢 GitHubリリースノートを自動監視
- 🤝 AIによるリリース内容の要約
- 🐦 X（Twitter）への自動投稿
- ⚙️ 設定可能な要約スタイル

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Sunwood-ai-labs/release-note-x.git
cd release-note-x

# Install dependencies
npm install
```

## 🛠️ Usage

```bash
# Configure your API keys
cp .env.example .env

# Run the application
npm start
```

## ⚙️ Configuration

| Environment Variable | Description |
|---------------------|-------------|
| `GITHUB_TOKEN` | GitHub Personal Access Token |
| `X_API_KEY` | X (Twitter) API Key |
| `X_API_SECRET` | X (Twitter) API Secret |
| `X_ACCESS_TOKEN` | X (Twitter) Access Token |
| `X_ACCESS_SECRET` | X (Twitter) Access Secret |

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by [Sunwood-ai-labs](https://github.com/Sunwood-ai-labs)

</div>
