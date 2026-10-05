# Kiro Route Studio 👻

KiroのSpec駆動開発で、ハロウィン・ネオンのアイソメ街、発光ルート、ゴースト案内役「Boo」を描き、縦型MP4へ変換するNode.jsアプリです。外部素材・Python・生成APIは使わず、同一seedから決定論的な連番PNGを生成します。

**Public repository:** https://github.com/hide-G/kiro-route-studio

## 30秒クイックスタート

前提: Node.js 24、npm、FFmpeg、FFprobe。

```bash
npm ci
npm test
npm run test:pbt
npm run render:preview
npm run verify:video
```

生成物は`output/preview.mp4`（1080x1920、1秒、H.264/yuv420p）です。本編は`npm run render -- --preset halloween-neon`、PNGのみは末尾に`--frames-only`を付けます。

## Webプレビュー

```bash
npm run web
# http://127.0.0.1:4173
```

単一画面から1秒プレビューを生成し、SSEで進捗を表示します。localhost限定、同時ジョブ1件、許可プリセットのみです。

## アーキテクチャ

`scene JSON → config/route/isometric → @napi-rs/canvas → 連番PNG → FFmpeg → MP4 → FFprobe`

- `src/core/`: 純粋関数と決定論的PRNG
- `src/render/`: 街・ルート・ゴースト描画、安全な`output/`書込み
- `src/video/`: shellを使わないFFmpeg/FFprobe
- `src/web/`: localhost Web UI
- `src/mcp/`: 3ツールの読み取り専用stdio MCP

## Kiro University Challenge 証拠索引

| 項目 | 証拠 |
|---|---|
| 1. Spec-driven development | [requirements](.kiro/specs/route-video/requirements.md) / [design](.kiro/specs/route-video/design.md) / [tasks](.kiro/specs/route-video/tasks.md) |
| 2. Steering documents | [always: product](.kiro/steering/product.md) / [always: tech](.kiro/steering/tech.md) / [fileMatch: structure](.kiro/steering/structure.md) |
| 3. Hooks | [spec check](.kiro/hooks/spec-check.kiro.hook) / [test on save](.kiro/hooks/test-on-save.kiro.hook) |
| 4. Property-based testing | [CP-01..08](test/properties/) / `npm run test:pbt` |
| 5. Powers | [利用証拠](docs/kiro-evidence.md) |
| 6. MCP | [設定](.kiro/settings/mcp.json) / [サーバー](src/mcp/server.mjs) / `npm run mcp:smoke` |
| 7. Custom agents | [route-director](.kiro/agents/route-director.json) / [quality-reviewer](.kiro/agents/quality-reviewer.json) |
| Bonus: Kiro Web | [cloud session手順](docs/cloud-session.md) |
| Bonus: packaged Power | [自己完結Power](power/route-video/) |

## 検証・提出

- [検証実測](docs/verification.md)
- [申込欄の英文](docs/submission.md)
- [3分デモ台本](docs/demo-script.md)
- [SNS投稿文](docs/social-post.md)
- [最終チェック](docs/final-checklist.md)
- [EC2安全実行手順](docs/ec2.md)

## 安全性

削除対象は`output/`配下のみです。AWSテンプレートは提供しますが自動デプロイしません。EC2はSSM接続、IMDSv2必須、暗号化EBS、インバウンドなし、90分自動停止を前提とします。Git初期化・commit・push・応募送信も自動実行しません。
