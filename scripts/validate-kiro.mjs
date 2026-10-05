import { access, readFile } from 'node:fs/promises';
const files=['.kiro/steering/product.md','.kiro/steering/tech.md','.kiro/steering/structure.md','.kiro/hooks/spec-check.kiro.hook','.kiro/hooks/test-on-save.kiro.hook','.kiro/settings/mcp.json','.kiro/agents/route-director.json','.kiro/agents/quality-reviewer.json','power/route-video/plugin.json','power/route-video/skills/route-video/SKILL.md','power/route-video/mcp/server.mjs'];
for(const file of files) await access(file);
for(const file of files.filter((item)=>item.endsWith('.json')||item.endsWith('.hook'))) JSON.parse(await readFile(file,'utf8'));
const product=await readFile('.kiro/steering/product.md','utf8'), structure=await readFile('.kiro/steering/structure.md','utf8');
if(!product.includes('inclusion: always')||!structure.includes('inclusion: fileMatch')) throw new Error('Steeringのalways/fileMatchが不足しています');
console.log(`Kiro成果物検証成功: ${files.length}ファイル、always + fileMatch`);
