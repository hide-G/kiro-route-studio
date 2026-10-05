import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
const DEFAULT_SCENE = path.join(ROOT, 'scenes', 'halloween-neon.json');

function number(value, fallback, field, min, max) {
  const result = value ?? fallback;
  if (!Number.isFinite(result) || result < min || result > max) {
    throw new Error(`${field} は ${min} 以上 ${max} 以下の数値が必要です`);
  }
  return result;
}

function point(value, fallback, field) {
  const item = value ?? fallback;
  return { x: number(item?.x, 0, `${field}.x`, -10000, 10000), y: number(item?.y, 0, `${field}.y`, -10000, 10000) };
}

export function normalizeConfig(input = {}) {
  const output = input.output ?? {};
  const scene = input.scene ?? {};
  const route = scene.route ?? [{ x: -4, y: 2 }, { x: 0, y: 0 }, { x: 4, y: -2 }];
  if (!Array.isArray(route) || route.length < 2) throw new Error('scene.route は2点以上必要です');
  return {
    output: {
      width: number(output.width, 1080, 'output.width', 160, 2160),
      height: number(output.height, 1920, 'output.height', 240, 3840),
      fps: number(output.fps, 24, 'output.fps', 1, 60),
      durationSeconds: number(output.durationSeconds, 12, 'output.durationSeconds', 0.25, 180),
      framesDir: String(output.framesDir ?? 'output/frames'),
      videoPath: String(output.videoPath ?? 'output/route-video.mp4'),
    },
    scene: {
      seed: Math.trunc(number(scene.seed, 20261005, 'scene.seed', 0, 4294967295)),
      tileWidth: number(scene.tileWidth, 92, 'scene.tileWidth', 8, 400),
      tileHeight: number(scene.tileHeight, 46, 'scene.tileHeight', 4, 200),
      origin: point(scene.origin, { x: 540, y: 850 }, 'scene.origin'),
      title: String(scene.title ?? 'GHOST ROUTE'),
      subtitle: String(scene.subtitle ?? 'Follow Boo to the midnight meetup'),
      buildings: Array.isArray(scene.buildings) ? scene.buildings.map((building, index) => ({
        id: String(building.id ?? `building-${index}`), x: number(building.x, 0, `scene.buildings[${index}].x`, -50, 50),
        y: number(building.y, 0, `scene.buildings[${index}].y`, -50, 50),
        width: number(building.width, 1, `scene.buildings[${index}].width`, 0.25, 10),
        depth: number(building.depth, 1, `scene.buildings[${index}].depth`, 0.25, 10),
        height: number(building.height, 2, `scene.buildings[${index}].height`, 0.25, 12),
      })) : [],
      route: route.map((item, index) => point(item, undefined, `scene.route[${index}]`)),
      palette: {
        sky: String(scene.palette?.sky ?? '#09051c'), ground: String(scene.palette?.ground ?? '#17102f'),
        grid: String(scene.palette?.grid ?? '#4d2b72'), route: String(scene.palette?.route ?? '#ff8a00'),
        cyan: String(scene.palette?.cyan ?? '#2de2e6'), purple: String(scene.palette?.purple ?? '#b026ff'),
      },
    },
  };
}

export async function loadConfig(configPath = DEFAULT_SCENE) {
  const absolute = path.resolve(ROOT, configPath);
  return normalizeConfig(JSON.parse(await readFile(absolute, 'utf8')));
}

export { ROOT, DEFAULT_SCENE };
