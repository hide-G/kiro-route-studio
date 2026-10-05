import { readFile } from 'node:fs/promises';
const text=await readFile('aws/ec2-route-renderer.yaml','utf8');
const required=['HttpTokens: required','Encrypted: true','InstanceInitiatedShutdownBehavior: stop','AmazonSSMManagedInstanceCore','RetentionInDays: 3','shutdown -h +90'];
for(const token of required) if(!text.includes(token)) throw new Error(`EC2安全設定が不足しています: ${token}`);
if(/SecurityGroupIngress/.test(text)||/0\.0\.0\.0\/0[\s\S]{0,80}(FromPort: 22|ToPort: 22)/.test(text)) throw new Error('インバウンドSSHは禁止です');
console.log('EC2 IaC静的検証成功: IMDSv2、暗号化EBS、SSM、インバウンドなし、自動停止、3日ログ保持');
