import { spawn } from 'node:child_process';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { ROOT } from '../core/config.mjs';
import { resolveOutput } from '../render/frame-writer.mjs';

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { shell: false, windowsHide: true });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout = (stdout + chunk).slice(-20000); });
    child.stderr.on('data', (chunk) => { stderr = (stderr + chunk).slice(-20000); });
    child.once('error', reject);
    child.once('close', (code) => code === 0 ? resolve({ stdout, stderr }) : reject(new Error(`${command} が終了コード ${code} で失敗しました: ${stderr.slice(-1000)}`)));
  });
}

export async function toolsAvailable() {
  try { await run('ffmpeg', ['-version']); await run('ffprobe', ['-version']); return true; } catch { return false; }
}

export async function encodeVideo(config) {
  const framesDir = resolveOutput(config.output.framesDir);
  const videoPath = resolveOutput(config.output.videoPath);
  await mkdir(path.dirname(videoPath), { recursive: true });
  const args = ['-y', '-loglevel', 'error', '-framerate', String(config.output.fps), '-i', path.join(framesDir, 'frame-%06d.png'), '-vf', `scale=${config.output.width}:${config.output.height}:flags=lanczos`, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '22', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', videoPath];
  await run('ffmpeg', args);
  return { videoPath: path.relative(ROOT, videoPath).replaceAll('\\', '/'), command: `ffmpeg ${args.join(' ')}` };
}

export async function probeVideo(relativePath) {
  const target = path.resolve(ROOT, relativePath);
  const { stdout } = await run('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=codec_name,pix_fmt,width,height,duration:format=duration', '-of', 'json', target]);
  const data = JSON.parse(stdout);
  const stream = data.streams?.[0];
  if (!stream) throw new Error('ffprobeで映像ストリームを確認できませんでした');
  return { codec: stream.codec_name, pixelFormat: stream.pix_fmt, width: stream.width, height: stream.height, duration: Number(stream.duration ?? data.format?.duration) };
}

export function assertVideo(probe, expected) {
  const errors = [];
  if (probe.codec !== 'h264') errors.push(`codec=${probe.codec}`);
  if (probe.pixelFormat !== 'yuv420p') errors.push(`pixelFormat=${probe.pixelFormat}`);
  if (probe.width !== expected.width) errors.push(`width=${probe.width}`);
  if (probe.height !== expected.height) errors.push(`height=${probe.height}`);
  if (Math.abs(probe.duration - expected.duration) > 1 / expected.fps + 0.02) errors.push(`duration=${probe.duration}`);
  if (errors.length) throw new Error(`動画仕様が不一致です: ${errors.join(', ')}`);
}
