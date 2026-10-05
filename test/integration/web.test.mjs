import test from 'node:test';
import assert from 'node:assert/strict';
import { createWebServer } from '../../src/web/server.mjs';

test('Web UIはlocalhostで画面と入力検証を提供する', async () => {
  const server = createWebServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  try {
    const page = await fetch(`http://127.0.0.1:${port}/`);
    assert.equal(page.status, 200);
    assert.match(await page.text(), /Kiro Route Studio/);
    const invalid = await fetch(`http://127.0.0.1:${port}/api/render`, { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({ preset: 'invalid' }) });
    assert.equal(invalid.status, 400);
  } finally { await new Promise((resolve) => server.close(resolve)); }
});
