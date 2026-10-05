---
inclusion: always
---
# 技術制約

- Node.js 24 ESM、固定バージョンの依存のみを使う。
- Canvasは`@napi-rs/canvas`、PBTは`fast-check`、テストは`node:test`を使う。
- 子プロセスは`spawn`と引数配列で起動し、shellを使わない。
- 乱数はseed付き純粋PRNGとし、同一入力のPNGを決定論的にする。
- 削除・生成は`output/`配下だけに限定する。
- Python、外部生成API、AWSリソースの直接作成は使わない。
