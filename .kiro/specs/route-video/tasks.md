# Kiro Route Studio 実装タスク

> 2026-10-06の最小動作版に合わせて更新。実測は`docs/verification.md`を参照。

- [x] 1. ESMプロジェクト基盤
  - `package.json`、固定依存、`package-lock.json`、`.gitignore`を作成。
  - `npm ci`成功、脆弱性0。

- [x] 2. 純粋coreとハロウィンシーン
  - 設定標準化、アイソメ投影、距離基準経路、タイムライン、seed PRNGを実装。
  - `scenes/halloween-neon.json`は建物7件、経路6点、既定288フレーム。

- [x] 3. Property-based testing
  - `test/properties/`にCP-01..CP-08を一対一で実装。
  - `npm run test:pbt`: 8/8成功。

- [x] 4. Canvas描画と安全な連番PNG
  - 街、奥行き建物、ネオンルート、ゴースト、カメラ移動、タイトル、進捗を実装。
  - `output/`外を拒否し、6桁連番12枚のsmokeに成功。

- [x] 5. CLI、FFmpeg、FFprobe
  - `--config`、`--preset`、`--frames-only`と日本語進捗を実装。
  - 1秒プレビューをH.264/yuv420p/1080x1920で生成・検証。
  - 12秒本編は締切優先で未実行（同じコード経路）。

- [x] 6. localhost Web UI
  - 127.0.0.1限定、許可プリセット、単一ジョブ、SSE進捗、MP4表示を実装。
  - `npm run test:web`成功。

- [x] 7. Kiro全7レッスン成果物
  - Steering always+fileMatch、Hooks 2本、PBT、Power利用証拠、3ツールMCP、Agents 2体を作成。
  - `npm run validate:kiro`と`npm run mcp:smoke`成功。

- [x] 8. Bonus成果物
  - Kiro Web cloud session手順を`docs/cloud-session.md`へ作成。
  - plugin/skill/resource/独自MCPを含む自己完結Powerを`power/route-video/`へ作成。
  - 実cloud sessionの操作・収録はユーザー実施。

- [x] 9. AWS EC2安全実行手順
  - CloudFormation、SSM、IMDSv2、暗号化EBS、インバウンドなし、90分stop、3日ログを定義。
  - `npm run validate:infra`成功。AWSデプロイは未実施。

- [x] 10. README・提出資料・統合検証
  - README、submission、demo script、social post、final checklist、verificationを作成。
  - repo URLは`https://github.com/hide-G/kiro-route-studio`。
  - `npm test` 6/6、PBT 8/8、シーン、MCP、Kiro、IaC、提出資料、MP4を検証済み。
