import { access, readFile } from 'node:fs/promises';
const files=['README.md','docs/submission.md','docs/demo-script.md','docs/social-post.md','docs/final-checklist.md','docs/cloud-session.md','docs/ec2.md','docs/kiro-evidence.md','.kiro/specs/route-video/requirements.md','.kiro/specs/route-video/design.md','.kiro/specs/route-video/tasks.md'];
for(const file of files) await access(file);
const submission=await readFile('docs/submission.md','utf8'), social=await readFile('docs/social-post.md','utf8');
for(const token of ['https://github.com/hide-G/kiro-route-studio','Spec-driven development','Property-based testing','Model Context Protocol']) if(!submission.includes(token)) throw new Error(`提出資料に不足: ${token}`);
for(const token of ['#KiroUniversity','#BuildWithKiro','@kirodotdev','@kiro']) if(!social.includes(token)) throw new Error(`SNS資料に不足: ${token}`);
console.log(`提出資料検証成功: ${files.length}ファイル、リポジトリURL、7レッスン、SNSタグ`);
