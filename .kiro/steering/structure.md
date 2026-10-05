---
inclusion: fileMatch
fileMatchPattern: "{src,test,scripts}/**/*.mjs"
---
# JavaScript配置規約

- `src/core`: 副作用のない設定・数学・タイムライン。
- `src/render`: Canvas描画と安全なフレーム書込み。
- `src/video`: FFmpeg/FFprobeアダプター。
- `src/web`: localhost限定UI。
- `src/mcp`: 読み取り専用stdio MCP。
- `test/properties`: design.mdのCP-IDと一対一のPBT。
- コメントが必要な場合は日本語で、関数・変数名は英語とする。
