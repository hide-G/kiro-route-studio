import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ROOT } from '../core/config.mjs';
import { frameName } from '../core/timeline.mjs';

export function resolveOutput(relativePath) {
  const outputRoot = path.resolve(ROOT, 'output');
  const target = path.resolve(ROOT, relativePath);
  if (target === outputRoot || !target.startsWith(`${outputRoot}${path.sep}`)) {
    throw new Error('出力先は output/ 配下の安全なパスを指定してください');
  }
  return target;
}

export async function prepareFrames(relativePath) {
  const target = resolveOutput(relativePath);
  await rm(target, { recursive: true, force: true });
  await mkdir(target, { recursive: true });
  return target;
}

export async function writeFrame(directory, index, buffer) {
  const target = path.join(directory, frameName(index));
  const temporary = `${target}.tmp`;
  await writeFile(temporary, buffer);
  await import('node:fs/promises').then(({ rename }) => rename(temporary, target));
  return target;
}
