# Kiro Web cloud session 手順

## 目的
ローカルとクラウドで同じSpec、Node.jsコード、テスト、CLIが動くことをデモする。Kiro Webが利用可能なアカウントで、公開前または公開後のリポジトリをcloud sessionへ開く。

## 再現手順

```bash
node --version
npm --version
npm ci
npm test
npm run test:pbt
npm run validate:scene
npm run render:smoke
npm run mcp:smoke
```

FFmpeg/FFprobeがある場合だけ次を実行する。

```bash
ffmpeg -version
ffprobe -version
npm run render:preview
npm run verify:video
```

FFmpegがない場合は`render:smoke`の連番PNG成功を記録し、ローカルのMP4・ffprobe実測と並べる。パッケージの管理者権限インストールを無理に行わない。

## Cloud configuration

- Runtime: Node.js 24
- Install: `npm ci`
- Test: `npm test && npm run test:pbt`
- Build artifact: `output/`（Git管理外）
- Secrets: なし
- AWS credentials: 不要
- External API: なし

## デモで比較する内容

| 観点 | Local | Kiro Web cloud session |
|---|---|---|
| Node/npm | バージョンを表示 | バージョンを表示 |
| Tests/PBT | 全成功を表示 | 同じコマンドの成功を表示 |
| Canvas | PNG/MP4 | 最低限PNG |
| FFmpeg | MP4 + ffprobe | 導入済みなら同じ検証 |
| MCP | `npm run mcp:smoke` | 同じstdioスモーク |

## 未検証の扱い

このファイルは再現手順です。実際のKiro Web実行はユーザーがcloud sessionで行い、収録画面を証拠にします。実行していない結果を成功と記載しません。
