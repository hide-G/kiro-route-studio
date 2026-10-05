# Route Video Skill

## 目的
Node.js ESM、Canvas、FFmpegを使い、外部素材なしの決定論的な縦型ルート動画を短時間で作る。

## 手順
1. EARS形式で画面要素、経路、動画仕様、安全な出力先を定義する。
2. 設定・座標変換・経路補間を純粋関数へ分離する。
3. seedを固定し、同じframeのPNGハッシュをPBTで確認する。
4. 連番PNGをH.264/yuv420pへ変換し、FFprobeで寸法と時間を検証する。
5. `resources/checklist.md`でレビューする。

## 禁止事項
Python移植、任意パス削除、shell経由のFFmpeg、検証前の成功主張、利用者の承認なしのAWS/Git操作を行わない。
