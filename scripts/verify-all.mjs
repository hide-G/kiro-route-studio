import { spawnSync } from 'node:child_process';
const npmCli=process.env.npm_execpath;
if(!npmCli) throw new Error('npm CLIの実行パスを取得できません');
const tasks=['test','test:pbt','validate:scene','mcp:smoke','validate:kiro','validate:infra','verify:submission','verify:video'];
for(const task of tasks){
  console.log(`\n=== npm run ${task} ===`);
  const result=spawnSync(process.execPath,[npmCli,'run',task],{stdio:'inherit',shell:false});
  if(result.error) throw result.error;
  if(result.status!==0) process.exit(result.status??1);
}
console.log('\n全体検証成功');
