#!/usr/bin/env node
import readline from 'node:readline';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { ROOT } from '../core/config.mjs';

const tools = [
  { name: 'list_scenes', description: '利用可能なシーンJSONを一覧します', inputSchema: { type: 'object', properties: {}, additionalProperties: false } },
  { name: 'get_scene_summary', description: '指定シーンの安全な要約を返します', inputSchema: { type: 'object', properties: { name: { type: 'string' } }, required: ['name'], additionalProperties: false } },
  { name: 'get_verification_summary', description: '最新の検証記録を読み取り専用で要約します', inputSchema: { type: 'object', properties: {}, additionalProperties: false } },
];

async function callTool(name, args = {}) {
  if (name === 'list_scenes') {
    const names = (await readdir(path.join(ROOT, 'scenes'))).filter((item) => item.endsWith('.json'));
    return { content: [{ type: 'text', text: JSON.stringify({ scenes: names }) }] };
  }
  if (name === 'get_scene_summary') {
    if (!/^[a-z0-9-]+\.json$/i.test(args.name ?? '')) throw new Error('安全なシーン名を指定してください');
    const scene = JSON.parse(await readFile(path.join(ROOT, 'scenes', args.name), 'utf8'));
    return { content: [{ type: 'text', text: JSON.stringify({ name: args.name, title: scene.scene?.title, buildings: scene.scene?.buildings?.length ?? 0, routePoints: scene.scene?.route?.length ?? 0, output: scene.output }) }] };
  }
  if (name === 'get_verification_summary') {
    const text = await readFile(path.join(ROOT, 'docs', 'verification.md'), 'utf8').catch(() => '# 検証記録\n未生成');
    return { content: [{ type: 'text', text: text.split(/\r?\n/).slice(0, 24).join('\n') }] };
  }
  throw new Error(`未知のツールです: ${name}`);
}

const input = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
input.on('line', async (line) => {
  if (!line.trim()) return;
  let request;
  try {
    request = JSON.parse(line);
    let result;
    if (request.method === 'initialize') result = { protocolVersion: '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'route-video-readonly', version: '1.0.0' } };
    else if (request.method === 'notifications/initialized') return;
    else if (request.method === 'tools/list') result = { tools };
    else if (request.method === 'tools/call') result = await callTool(request.params?.name, request.params?.arguments);
    else throw new Error(`未対応メソッドです: ${request.method}`);
    process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id: request.id, result })}\n`);
  } catch (error) {
    process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id: request?.id ?? null, error: { code: -32603, message: error.message } })}\n`);
  }
});
