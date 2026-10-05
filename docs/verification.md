# 検証記録

## 環境診断

- 実施日時: 2026-10-06 06:03:35 +09:00（日本時間）
- 作業ディレクトリ: `E:\jaws2026\kiro-route-video`
- 診断方針: 環境情報と AWS 接続先の読み取り確認のみを実施し、AWS リソースの作成・変更・デプロイは実施していません。

| コマンド | 出力要約 | 判定 |
|---|---|---|
| `node --version` | `v24.15.0` | インストール済み |
| `npm --version` | `11.12.1` | インストール済み |
| `ffmpeg -version` | `ffmpeg version 8.1.1-full_build-www.gyan.dev` | インストール済み |
| `ffprobe -version` | `ffprobe version 8.1.1-full_build-www.gyan.dev` | インストール済み |
| `aws sts get-caller-identity --profile nagata` | Account: `285336573977`、ARN: `arn:aws:iam::285336573977:user/Admin` | 指定アカウントと一致 |

### 確認結果

- FFmpeg: あり（バージョン `8.1.1-full_build-www.gyan.dev`）
- FFprobe: あり（バージョン `8.1.1-full_build-www.gyan.dev`）
- AWS アカウント: `285336573977` への接続を確認しました。

## 最小動作版の受入検証

- 実施日時: 2026-10-06 07:02:09 +09:00（日本時間）
- Node.js技術スタックのみを使用し、Pythonではテストしていません。
- AWSリソースの作成・変更・デプロイ、Git操作は実施していません。

| コマンド | 実測結果 | 判定 |
|---|---|---|
| `npm ci` | 固定依存4 packages、脆弱性0 | 成功 |
| `npm test` | unit/Web integration 6件、pass 6 / fail 0 | 成功 |
| `npm run test:pbt` | CP-01..CP-08、pass 8 / fail 0（通常100 runs、描画20 runs） | 成功 |
| `npm run validate:scene` | 建物7件、経路6点、既定288フレーム | 成功 |
| `npm run render:smoke` | 1080x1920 PNGを12枚、6桁連番、frames-only | 成功 |
| `npm run render:preview` | PNG 12枚から`output/preview.mp4`を生成 | 成功 |
| `npm run verify:video` | H.264、yuv420p、1080x1920、1.000秒 | 成功 |
| `npm run mcp:smoke` | initialize / tools/list（3ツール）/ tools/call（3件） | 成功 |
| `npm run validate:kiro` | Steering always+fileMatch、Hooks、Agents、Power、MCP | 成功 |
| `npm run validate:infra` | IMDSv2、暗号化EBS、SSM、インバウンドなし、自動stop、3日ログ | 成功（静的検証） |
| `npm run verify:submission` | 必須資料、repo URL、7 lessons、SNSタグ | 成功 |

### プレビューMP4実測

- パス: `output/preview.mp4`（`.gitignore`対象）
- サイズ: 165,698 bytes
- SHA-256: `8B5241EF1E687F6C062A31F23617534978324F186408EA20FECBEA38688FD6A7`
- 映像: ハロウィン・ネオンのアイソメ街、発光ルート、移動するゴースト、タイトル、進捗表示

## 未検証・人手が必要な事項

- 12秒・288フレームの本編生成は締切優先のため未実行。共通レンダリング経路は1秒版で検証済みです。
- Kiro Web cloud sessionの実行と収録はユーザー操作が必要です。手順は`docs/cloud-session.md`にあります。
- EC2は安全手順とCloudFormationのローカル静的検証のみで、実デプロイしていません。
- 公開GitHub、公開デモ動画、SNS投稿、応募フォーム送信は未実施です。
