import http from 'node:http';
import { createReadStream } from 'node:fs';
import { access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { loadConfig, normalizeConfig, ROOT } from '../core/config.mjs';
import { render } from '../render/render-service.mjs';
import path from 'node:path';

const state = { running: false, percent: 0, message: '待機中', video: null };
const page = `<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Kiro Route Studio</title><style>body{margin:0;background:radial-gradient(circle at top,#321353,#09051c 65%);color:#fff;font-family:system-ui;min-height:100vh;display:grid;place-items:center}.card{width:min(720px,88vw);padding:36px;border:1px solid #8f4dff;border-radius:24px;background:#100827dd;box-shadow:0 0 50px #b026ff55}h1{color:#2de2e6}.ghost{font-size:72px;filter:drop-shadow(0 0 18px #2de2e6)}button{padding:14px 24px;border:0;border-radius:99px;background:#ff8a00;font-weight:800;cursor:pointer}progress{width:100%;height:22px}video{width:260px;max-height:460px;margin-top:20px;border-radius:16px}</style><main class="card"><div class="ghost">👻</div><h1>Kiro Route Studio</h1><p>ハロウィン・ネオンのアイソメ街を、Booが案内します。</p><button id="start">1秒プレビューを生成</button><p id="status">待機中</p><progress id="progress" max="100" value="0"></progress><div id="result"></div></main><script>const s=document.querySelector('#status'),p=document.querySelector('#progress'),r=document.querySelector('#result'),b=document.querySelector('#start');const events=new EventSource('/events');events.onmessage=e=>{const x=JSON.parse(e.data);s.textContent=x.message;p.value=x.percent;b.disabled=x.running;if(x.video)r.innerHTML='<video controls autoplay loop src="/output/preview.mp4"></video>'};b.onclick=async()=>{const response=await fetch('/api/render',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({preset:'halloween-neon'})});if(!response.ok)s.textContent=(await response.json()).error};</script></html>`;

export function createWebServer() {
  return http.createServer(async (request, response) => {
    try {
      if (request.method === 'GET' && request.url === '/') { response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); response.end(page); return; }
      if (request.method === 'GET' && request.url === '/events') {
        response.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache', connection: 'keep-alive' });
        const send = () => response.write(`data: ${JSON.stringify(state)}\n\n`);
        send(); const timer = setInterval(send, 400); request.on('close', () => clearInterval(timer)); return;
      }
      if (request.method === 'GET' && request.url === '/api/status') { response.writeHead(200, { 'content-type': 'application/json' }); response.end(JSON.stringify(state)); return; }
      if (request.method === 'POST' && request.url === '/api/render') {
        if (state.running) { response.writeHead(409, { 'content-type': 'application/json' }); response.end(JSON.stringify({ error: '生成処理はすでに実行中です' })); return; }
        let body = ''; for await (const chunk of request) body += chunk;
        const input = JSON.parse(body || '{}');
        if (input.preset !== 'halloween-neon') { response.writeHead(400, { 'content-type': 'application/json' }); response.end(JSON.stringify({ error: '許可されていないプリセットです' })); return; }
        state.running = true; state.percent = 0; state.message = '生成を開始しました'; state.video = null;
        response.writeHead(202, { 'content-type': 'application/json' }); response.end(JSON.stringify({ accepted: true }));
        const base = await loadConfig('scenes/halloween-neon.json');
        const config = normalizeConfig({ ...base, output: { ...base.output, fps: 12, durationSeconds: 1, framesDir: 'output/preview-frames', videoPath: 'output/preview.mp4' } });
        render(config, { onProgress: ({ percent }) => { state.percent = percent; state.message = `生成中 ${percent}%`; } })
          .then((result) => { state.message = result.framesOnly ? 'PNG生成完了' : 'MP4生成完了'; state.video = result.videoPath ?? null; })
          .catch((error) => { state.message = `生成失敗: ${error.message}`; })
          .finally(() => { state.running = false; });
        return;
      }
      if (request.method === 'GET' && request.url === '/output/preview.mp4') {
        const target = path.join(ROOT, 'output', 'preview.mp4'); await access(target);
        response.writeHead(200, { 'content-type': 'video/mp4' }); createReadStream(target).pipe(response); return;
      }
      response.writeHead(404, { 'content-type': 'application/json' }); response.end(JSON.stringify({ error: '見つかりません' }));
    } catch (error) { response.writeHead(400, { 'content-type': 'application/json' }); response.end(JSON.stringify({ error: `要求を処理できません: ${error.message}` })); }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createWebServer().listen(4173, '127.0.0.1', () => console.log('Webプレビュー: http://127.0.0.1:4173'));
}
