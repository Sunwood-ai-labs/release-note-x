# v0.2.0 - Multi-Platform Expansion Release

## 新機能

- 💬 Discord Webhook 投稿機能
- 🤖 AI によるリリースノート要約
- 🌐 マルチプラットフォーム対応（X + Discord）
- 🔧 OpenRouter サポート（無料モデル）

## バグ修正

- Discord 応答処理: 204 No Content 対応
- post-release スクリプトの構文エラー修正
- ワークフローの YAML 構文エラー修正

## 変更点

- README をマルチプラットフォーム対応に書き直し
- ドキュメントを分割（X.md, DISCORD.md, AI.md）
- GitHub Secrets 同期ツール追加

## 互換性

- Node.js 18 以上が必要

---

## コードブロックテスト

このリリースノートにはコードブロックも含まれています：

```javascript
// JavaScript の例
const test = "special chars: <>&\"\\'";
console.log(test);
```

```bash
# Bash の例
echo "Test with special chars: <>&\"\\'"
```

これらのコードブロックが正しく処理されることを確認します。
