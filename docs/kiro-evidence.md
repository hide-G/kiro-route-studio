# Kiro利用証拠

## Powers

| Power / guidance | 目的 | 適用結果 |
|---|---|---|
| Amazon EC2 Compute | 短命レンダラーの接続・IMDSv2・ストレージ・停止策 | SSM、インバウンドなし、IMDSv2、暗号化EBS、stop動作を`aws/ec2-route-renderer.yaml`へ反映 |
| AWS CloudFormation | IaCの安全な既定値と検証方針 | ハードコードした物理名・秘密を避け、デプロイせず静的検証する構成へ限定 |
| AWS IAM | EC2信頼ポリシーと権限スコープの確認 | EC2サービス信頼、SSM managed policy、対象ロググループだけの書込みを定義 |

## Specから実装への流れ

1. `.kiro/specs/route-video/requirements.md`でEARS要件と9採点項目を定義。
2. `design.md`で純粋core、Canvas、FFmpeg、Web、8 Correctness Propertiesを設計。
3. `tasks.md`で成果物と検証コマンドへ分解。
4. Steeringで固定技術と安全境界を継続適用。
5. Hooks、PBT、MCP、Agentsで変更時と提出前を検証。

## 主な成果

- `src/render/scene-renderer.mjs`: アイソメ街、奥行き建物、発光ルート、ゴースト、カメラ移動。
- `test/properties/`: CP-01..08をfast-checkで実行。
- `src/mcp/server.mjs`: 副作用のない3ツール。
- `power/route-video/`: skill、resource、独自MCPを含む再利用可能Power。
- `docs/verification.md`: 実コマンドとffprobeの記録。

AWSリソース作成、Git操作、公開、応募送信は行っていません。
