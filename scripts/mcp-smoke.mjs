import { spawn } from 'node:child_process';
import readline from 'node:readline';

const child = spawn(process.execPath, ['src/mcp/server.mjs'], { shell: false, windowsHide: true });
const output = readline.createInterface({ input: child.stdout });
const pending = new Map();
output.on('line', (line) => { const message=JSON.parse(line); const handler=pending.get(message.id); if(handler){ pending.delete(message.id); handler(message); } });
function request(id, method, params) {
  return new Promise((resolve, reject) => { pending.set(id, (message) => message.error ? reject(new Error(message.error.message)) : resolve(message.result)); child.stdin.write(`${JSON.stringify({jsonrpc:'2.0',id,method,params})}\n`); setTimeout(()=>reject(new Error(`${method} がタイムアウトしました`)),5000).unref(); });
}
try {
  const initialized=await request(1,'initialize',{protocolVersion:'2025-06-18',capabilities:{},clientInfo:{name:'smoke',version:'1.0.0'}});
  child.stdin.write(`${JSON.stringify({jsonrpc:'2.0',method:'notifications/initialized'})}\n`);
  const listed=await request(2,'tools/list',{});
  if(initialized.serverInfo?.name!=='route-video-readonly'||listed.tools?.length<3) throw new Error('MCP初期化または3ツール一覧が不正です');
  const scenes=await request(3,'tools/call',{name:'list_scenes',arguments:{}});
  const summary=await request(4,'tools/call',{name:'get_scene_summary',arguments:{name:'halloween-neon.json'}});
  const verification=await request(5,'tools/call',{name:'get_verification_summary',arguments:{}});
  if(!scenes.content?.[0]||!summary.content?.[0]||!verification.content?.[0]) throw new Error('MCPツール応答が不正です');
  console.log(`MCPスモーク成功: initialize / tools/list(${listed.tools.length}) / tools/call(3件)`);
} finally { child.kill(); }
