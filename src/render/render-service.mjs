import { frameCount, progressPercent } from '../core/timeline.mjs';
import { prepareFrames, writeFrame } from './frame-writer.mjs';
import { renderFrame } from './scene-renderer.mjs';
import { assertVideo, encodeVideo, probeVideo, toolsAvailable } from '../video/ffmpeg.mjs';

export async function render(config, { framesOnly = false, onProgress = () => {} } = {}) {
  const count = frameCount(config);
  const directory = await prepareFrames(config.output.framesDir);
  for (let index = 0; index < count; index += 1) {
    await writeFrame(directory, index, renderFrame(config, index, count));
    onProgress({ completed: index + 1, total: count, percent: progressPercent(index, count) });
  }
  if (framesOnly) return { framesOnly: true, frameCount: count };
  if (!(await toolsAvailable())) {
    return { framesOnly: true, frameCount: count, reason: 'FFmpegまたはFFprobeを利用できません' };
  }
  const encoded = await encodeVideo(config);
  const probe = await probeVideo(encoded.videoPath);
  assertVideo(probe, { width: config.output.width, height: config.output.height, duration: config.output.durationSeconds, fps: config.output.fps });
  return { framesOnly: false, frameCount: count, ...encoded, probe };
}
