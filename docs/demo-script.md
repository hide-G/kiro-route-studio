# 3分以内デモ台本（目安 2分35秒）

| 時間 | 画面 | ナレーション |
|---|---|---|
| 0:00-0:10 | `output/preview.mp4`を全画面 | 「Kiro Route Studioです。Booがネオンのアイソメ街を案内し、ルートが動画として伸びます。」 |
| 0:10-0:25 | `.kiro/specs/route-video/requirements.md` | 「KiroのSpec駆動で、描画、決定性、動画仕様、安全性をEARS要件にしました。」 |
| 0:25-0:38 | `design.md`の図とCP表 | 「設計から8つのCorrectness Propertiesを導きました。」 |
| 0:38-0:52 | Steering 3ファイル | 「alwaysのプロダクト・技術制約と、fileMatchの構造規約を使います。」 |
| 0:52-1:04 | Hooks 2ファイル | 「Spec保存時は整合確認、ESM保存時は同じNode.jsスタックの高速テストです。」 |
| 1:04-1:20 | `npm run test:pbt`の成功結果 | 「fast-checkが投影、経路、正規化、連番、決定的PNGを生成入力で検証します。」 |
| 1:20-1:34 | MCP設定と`npm run mcp:smoke` | 「独自stdio MCPはinitialize、一覧、呼出しを実装し、3ツールすべて読み取り専用です。」 |
| 1:34-1:46 | Agents 2体 | 「演出担当と品質担当を分離し、禁止事項と完了条件を持たせました。」 |
| 1:46-2:00 | `npm run render:preview`進捗 | 「ローカルでは同じCLIが連番PNGを描き、FFmpegでMP4化します。」 |
| 2:00-2:10 | `npm run verify:video` | 「FFprobeで1080x1920、H.264、yuv420p、1秒を実測します。」 |
| 2:10-2:22 | Kiro Web cloud sessionのターミナル | 「クラウドセッションでも同じnpm ci、テスト、frames-only生成を実行します。」 |
| 2:22-2:33 | Web UI | 「localhost UIではSSE進捗と完成動画を一画面で確認できます。」 |
| 2:33-2:43 | `power/route-video` | 「Bonusとしてskill、resource、MCPを自己完結Powerへパッケージしました。」 |
| 2:43-2:55 | 完成動画とGitHub | 「外部素材なし、AWS自動変更なし。Specから検証済み動画までKiroで完成しました。」 |

## 収録前確認

- ブラウザ・ターミナルに個人情報、AWS認証情報、絶対ホームパスを映さない。
- 動画は30秒以上3分以内、公開URLはログイン不要にする。
- Kiro Web部分は実際のクラウドセッション画面のみを使用し、未実施なら成功を装わない。
