# Kiro Route Studio 要件定義

## 1. 目的と範囲

Kiro Route Studio は、純Node.jsでアイソメトリックな街、ルート、ゴースト案内役を描画し、縦型の連番PNGと提出用MP4を生成する。既存の `E:\jaws2026\kiro-meetup-route-isometric` は着想のみの参考とし、Pythonコード、素材、アルゴリズムをコピーまたは移植しない。

実装は ESM JavaScript とし、ローカル、Kiro Webクラウドセッション、AWS EC2で同一のCLIを実行可能にする。既定動画は12秒、24fps、1080x1920とし、30秒から3分という提出動画枠内でデモに組み込める短い生成物を優先する。

## 2. 用語

- **設定**: シーン、出力、動画、配色、乱数シードを表すJSON互換値。
- **フレーム**: `frame-000000.png` から始まる連番PNG。
- **正規化**: 省略値の補完、範囲制限、型検証を行い、標準形の設定を返す処理。
- **経路進捗**: 経路始点を0、終点を1とする実数 `t`。
- **提出用MP4**: H.264、yuv420p、1080x1920の縦型動画。

## 3. 機能要件

### R-01 CLIと設定

1. WHEN 利用者が `npm run render -- --config <path>` を実行した場合、THE SYSTEM SHALL 指定JSONを読み込み、正規化した設定で描画を開始する。
2. WHEN 設定パスが省略された場合、THE SYSTEM SHALL リポジトリ同梱のハロウィン・ネオン設定を使用する。
3. IF 設定値が許容範囲外、未知の型、または必須値不足である場合、THE SYSTEM SHALL 対象フィールドを含む日本語エラーを標準エラーへ出し、非0で終了する。
4. WHEN 同じ正規化済み設定を再度正規化した場合、THE SYSTEM SHALL 値として同一の結果を返す。

### R-02 アイソメトリック描画

1. WHEN フレームを描画する場合、THE SYSTEM SHALL 1080x1920のPNGに背景、地面グリッド、奥行き順に並ぶ建物、発光する経路、ゴースト案内役、タイトル、案内テキスト、進捗表示を描く。
2. WHEN ワールド座標を画面座標へ投影する場合、THE SYSTEM SHALL 設計で定義したアイソメトリック変換を一貫して使用する。
3. WHEN 同じ設定と乱数シードで同じフレーム番号を描画する場合、THE SYSTEM SHALL バイト列が同一のPNGを生成する。
4. WHILE 動画が進行している間、THE SYSTEM SHALL カメラ位置、経路の描画量、ゴースト位置、ネオンの明滅を時間に応じて更新し、静止画の切替だけではない動きを生成する。

### R-03 経路アニメーション

1. WHEN 経路進捗が0の場合、THE SYSTEM SHALL ゴーストを経路の始点に配置する。
2. WHEN 経路進捗が1の場合、THE SYSTEM SHALL ゴーストを経路の終点に配置する。
3. IF 経路進捗が `[0,1]` 内の場合、THE SYSTEM SHALL 折れ線上の連続した位置を返し、経路範囲外へ外挿しない。
4. WHILE フレーム番号が増加する間、THE SYSTEM SHALL 表示進捗を0から100まで単調非減少にする。

### R-04 連番PNG出力

1. WHEN 描画を開始した場合、THE SYSTEM SHALL 出力先を安全に作成または再作成し、6桁ゼロ埋めの連番PNGを欠番なく出力する。
2. WHEN `durationSeconds × fps` が整数フレーム数へ正規化された場合、THE SYSTEM SHALL そのフレーム数と完全に一致する枚数を生成する。
3. WHILE PNGを生成している間、THE SYSTEM SHALL 完了数、総数、百分率をCLIとWeb UIへ通知する。
4. IF 出力先がプロジェクト管理外を指す、または危険なルートを指す場合、THE SYSTEM SHALL 削除処理を行わずエラー終了する。

### R-05 MP4変換

1. WHEN FFmpegが利用可能でPNG生成が完了した場合、THE SYSTEM SHALL 連番PNGをH.264、yuv420p、1080x1920、設定fpsのMP4へ変換する。
2. WHEN MP4生成後、THE SYSTEM SHALL FFprobeで幅、高さ、コーデック、ピクセル形式、継続時間を検証し、要件不一致なら非0で終了する。
3. IF FFmpegまたはFFprobeが利用できない場合、THE SYSTEM SHALL PNG生成を成功として保持し、実行すべきFFmpegコマンドを表示し、明確な部分成功状態を返す。
4. IF `--frames-only` が指定された場合、THE SYSTEM SHALL FFmpegの有無にかかわらずPNG生成後に終了する。

### R-06 最小Web UI

1. WHEN 利用者が `npm run web` を実行した場合、THE SYSTEM SHALL localhostに、プリセット選択、生成開始、進捗、ログ、完成MP4へのリンクを持つ単一画面を提供する。
2. WHEN Web UIから生成を開始した場合、THE SYSTEM SHALL CLIと同じ正規化、描画、動画化モジュールを使用する。
3. WHILE 生成中の場合、THE SYSTEM SHALL 二重起動を拒否し、進捗を画面へ継続表示する。
4. IF 入力値または生成処理が失敗した場合、THE SYSTEM SHALL 秘密情報や絶対パスを露出しない日本語エラーを表示する。

### R-07 実行環境と運用

1. WHEN ローカル、Kiro Webクラウドセッション、またはEC2でNode.js、npm依存、FFmpegが揃っている場合、THE SYSTEM SHALL 同一の `npm run render` コマンドで生成できる。
2. WHEN EC2用CloudFormationを検証する場合、THE SYSTEM SHALL IMDSv2必須、暗号化EBS、インバウンドなし、SSM接続、最小権限、短期ログ保持、自動停止策を定義する。
3. IF S3連携を追加する場合、THE SYSTEM SHALL バケット名や認証情報をコードへ埋め込まず、AWS SDK for JavaScript v3とインスタンスロールのみを使用する。
4. THE SYSTEM SHALL AWSリソースを自動作成またはデプロイせず、IaCテンプレートと手順だけを提供する。

### R-08 品質と安全性

1. WHEN 自動テストを実行した場合、THE SYSTEM SHALL Node.js組み込みテストとfast-checkによる単体・プロパティテストを実行する。
2. IF Canvas、ファイル、子プロセス、HTTP処理が失敗した場合、THE SYSTEM SHALL 原因を保持した日本語エラーを返し、一部だけ完成したMP4を成功扱いしない。
3. WHEN HTTP要求を処理する場合、THE SYSTEM SHALL localhostのみで待受し、許可したプリセットと数値範囲以外の入力を拒否する。

## 4. Kiro University Challenge 採点要件

### K-01 Spec-driven development（必須）

WHEN 審査者がリポジトリを確認した場合、THE SYSTEM SHALL `.kiro/specs/route-video/requirements.md`、`design.md`、`tasks.md` に追跡可能な要件、設計、実装状況を提示する。

### K-02 Steering documents（必須）

WHEN Kiroが本プロジェクトを扱う場合、THE SYSTEM SHALL `.kiro/steering/product.md`、`tech.md`、`structure.md` から目的、技術制約、配置規約を取得できる。

### K-03 Hooks（必須）

WHEN仕様または実装ファイルが保存される場合、THE SYSTEM SHALL `.kiro/hooks/` のフック定義から仕様整合性確認または高速テストを実行でき、実行内容をREADMEで説明する。

### K-04 Property-based testing（必須・IDE）

WHEN `npm run test:pbt` を実行した場合、THE SYSTEM SHALL fast-checkで `design.md` のCorrectness Propertiesと一対一対応する不変条件を検証し、失敗時にシードと反例を出力する。

### K-05 Powers（必須）

WHEN 実装または検証をKiroで行う場合、THE SYSTEM SHALL 使用したPower、その目的、得られた結果を `docs/kiro-evidence.md` に記録し、関連成果物へリンクする。

### K-06 MCP（必須）

WHEN KiroのMCP設定を有効化した場合、THE SYSTEM SHALL `.kiro/settings/mcp.json` 経由でローカルの読み取り専用route-video MCPサーバーを起動し、プリセット一覧と最新の検証要約を取得できる。IF 成果物が存在しない場合、THE SYSTEM SHALL 空または未生成を返し、生成やAWS変更を副作用として実行しない。

### K-07 Custom agents（必須）

WHEN Kiroで動画演出または品質確認を行う場合、THE SYSTEM SHALL `.kiro/agents/` の専用エージェント定義を選択でき、役割、入力、禁止事項、完了条件を明示する。

### K-08 Bonus: Kiro Web・cloud sessions・cloud configuration

WHEN Kiro Webクラウドセッションで作業する場合、THE SYSTEM SHALL `docs/cloud-session.md` の再現可能なセットアップ、ローカルとの差分、検証結果を提示し、デモ動画でローカルとクラウド双方の実行を確認できる。

### K-09 Bonus: Package a Kiro power

WHEN 審査者が `power/route-video/` を確認した場合、THE SYSTEM SHALL `plugin.json`、スキル、リソース、必要ならMCP設定を含む再利用可能なPowerパッケージと公開方法を提示する。

## 5. 受入条件

- `npm ci` と `npm test` がNode.js 24で成功する。
- `npm run test:pbt` がCorrectness Propertiesをすべて検証する。
- `npm run render -- --preset halloween-neon` が既定枚数のPNGとMP4を生成する。
- `npm run verify:video` が1080x1920、H.264、yuv420p、約12秒を確認する。
- `npm run web` から同じ生成処理を開始し、進捗と完成リンクを確認できる。
- `npm run validate:infra` がCloudFormationの構文検証をローカルで完了する。AWSへの作成・変更・デプロイは行わない。
- READMEと `docs/submission.md` から採点9項目の証拠へ到達できる。
