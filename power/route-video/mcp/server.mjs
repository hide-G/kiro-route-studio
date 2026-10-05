#!/usr/bin/env node
import readline from 'node:readline';
const tools=[
  {name:'get_route_video_checklist',description:'動画確認表を返します',inputSchema:{type:'object',properties:{}}},
  {name:'get_supported_stack',description:'対応技術スタックを返します',inputSchema:{type:'object',properties:{}}},
  {name:'get_safety_rules',description:'安全規則を返します',inputSchema:{type:'object',properties:{}}}
];
const text={get_route_video_checklist:'決定性、連番、H.264/yuv420p、縦型、FFprobeを確認します。',get_supported_stack:'Node.js ESM + @napi-rs/canvas + FFmpeg + node:test/fast-check',get_safety_rules:'output配下のみ。shell、Python移植、無断AWS/Git操作は禁止。'};
readline.createInterface({input:process.stdin,crlfDelay:Infinity}).on('line',(line)=>{let q;try{q=JSON.parse(line);if(q.method==='notifications/initialized')return;let result;if(q.method==='initialize')result={protocolVersion:'2025-06-18',capabilities:{tools:{}},serverInfo:{name:'route-video-power',version:'1.0.0'}};else if(q.method==='tools/list')result={tools};else if(q.method==='tools/call'&&text[q.params?.name])result={content:[{type:'text',text:text[q.params.name]}]};else throw new Error('未対応メソッドです');process.stdout.write(JSON.stringify({jsonrpc:'2.0',id:q.id,result})+'\n');}catch(error){process.stdout.write(JSON.stringify({jsonrpc:'2.0',id:q?.id??null,error:{code:-32603,message:error.message}})+'\n');}});
