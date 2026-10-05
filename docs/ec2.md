# AWS EC2 安全実行手順（デプロイは未実施）

## 安全設計

`aws/ec2-route-renderer.yaml`は短命なx86_64レンダラーを定義します。インバウンドなし、Session Manager接続、IMDSv2必須、暗号化gp3 EBS、アクセスキーなし、3日ログ保持、90分後stop、OS shutdown時stopです。S3は使用しません。

## デプロイ前の人手確認

AWSへの作成・変更はコストと権限を伴い、完全には自動復元できません。このリポジトリの検証では実行していません。実施する場合は、まず次の読み取り確認を行い、Accountが`285336573977`であることを確認してください。

```bash
aws sts get-caller-identity --profile nagata
npm run validate:infra
```

次にCloudFormation変更セットを作成し、**インスタンスタイプ、VPC/Subnet、IAM、推定料金、90分停止設定を人がレビューしてから**実行します。`dps`プロファイルは使いません。公開IPを付けず、SSM/VPCエンドポイントまたは管理されたNAT経路があるprivate subnetを推奨します。

## 接続・実行（スタック作成後のみ）

```bash
aws ssm start-session --target <INSTANCE_ID> --profile nagata --region <REGION>
git clone https://github.com/hide-G/kiro-route-studio.git
cd kiro-route-studio
bash scripts/ec2-render.sh "$PWD"
```

`ec2-render.sh`は`npm ci`、テスト、1秒MP4、ffprobeを実行し、成功・失敗を問わずshutdownします。インスタンスストアやEBS上の生成物は停止・削除で失われ得るため、必要な成果物はSession Manager経由などで回収してから削除します。

## 終了確認

1. EC2状態が`stopped`であることを確認。
2. 必要な成果物を回収。
3. CloudFormationスタックの削除影響を人が確認して削除。
4. 残存EBS、Elastic IP、CloudWatch Logs、課金を確認。

> 本作業ではAWS CLIによるcreate/update/deploy/deleteを一切実行していません。
