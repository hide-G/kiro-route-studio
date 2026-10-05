import { createCanvas } from '@napi-rs/canvas';
import { worldToScreen } from '../core/isometric.mjs';
import { interpolateRoute } from '../core/route.mjs';
import { createRandom } from '../core/random.mjs';
import { normalizedTime, smoothstep } from '../core/timeline.mjs';

function polygon(ctx, points, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (const point of points.slice(1)) ctx.lineTo(point.x, point.y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
}

function drawBuilding(ctx, building, projection, random) {
  const p = worldToScreen(building, projection);
  const right = worldToScreen({ x: building.x + building.width, y: building.y }, projection);
  const back = worldToScreen({ x: building.x, y: building.y + building.depth }, projection);
  const far = worldToScreen({ x: building.x + building.width, y: building.y + building.depth }, projection);
  const rise = building.height * projection.tileHeight * 1.3;
  const top = [p, right, far, back].map((point) => ({ x: point.x, y: point.y - rise }));
  polygon(ctx, [back, far, top[2], top[3]], '#24134d', '#8f4dff');
  polygon(ctx, [right, far, top[2], top[1]], '#331953', '#ff5ea8');
  polygon(ctx, top, '#52226f', '#2de2e6');
  ctx.fillStyle = random() > 0.45 ? '#ffb000' : '#2de2e6';
  for (let floor = 1; floor < building.height * 1.7; floor += 1) {
    ctx.globalAlpha = 0.45 + random() * 0.45;
    ctx.fillRect(p.x + 8, p.y - floor * projection.tileHeight * 0.65, 8, 12);
  }
  ctx.globalAlpha = 1;
}

function drawGhost(ctx, point, time, scale) {
  const bob = Math.sin(time * Math.PI * 8) * 10 * scale;
  ctx.save();
  ctx.translate(point.x, point.y - 72 * scale + bob);
  ctx.shadowColor = '#2de2e6';
  ctx.shadowBlur = 36 * scale;
  ctx.fillStyle = '#d9ffff';
  ctx.beginPath();
  ctx.arc(0, 0, 27 * scale, Math.PI, 0);
  ctx.lineTo(27 * scale, 34 * scale);
  ctx.lineTo(13 * scale, 23 * scale);
  ctx.lineTo(0, 35 * scale);
  ctx.lineTo(-13 * scale, 23 * scale);
  ctx.lineTo(-27 * scale, 34 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#15102d';
  ctx.beginPath(); ctx.arc(-9 * scale, -2 * scale, 4 * scale, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(9 * scale, -2 * scale, 4 * scale, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

export function renderFrame(config, frameIndex, count) {
  const { width, height } = config.output;
  const scene = config.scene;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const time = normalizedTime(frameIndex, count);
  const scale = width / 1080;
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, scene.palette.sky);
  gradient.addColorStop(0.7, '#150b2e');
  gradient.addColorStop(1, '#260c31');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);

  const projection = {
    tileWidth: scene.tileWidth * scale,
    tileHeight: scene.tileHeight * scale,
    origin: {
      x: scene.origin.x * scale + Math.sin(time * Math.PI * 2) * 24 * scale,
      y: scene.origin.y * (height / 1920) + (smoothstep(time) - 0.5) * 100 * scale,
    },
  };
  for (let x = -8; x <= 8; x += 1) {
    for (let y = -7; y <= 7; y += 1) {
      const p = worldToScreen({ x, y }, projection);
      const px = worldToScreen({ x: x + 1, y }, projection);
      const py = worldToScreen({ x: x + 1, y: y + 1 }, projection);
      const pz = worldToScreen({ x, y: y + 1 }, projection);
      polygon(ctx, [p, px, py, pz], scene.palette.ground, scene.palette.grid);
    }
  }

  const random = createRandom(scene.seed);
  const buildings = [...scene.buildings].sort((a, b) => a.x + a.y - b.x - b.y || a.id.localeCompare(b.id));
  for (const building of buildings) drawBuilding(ctx, building, projection, random);

  const routePoints = scene.route.map((point) => worldToScreen(point, projection));
  const visible = Math.max(2, Math.ceil(routePoints.length * (0.18 + 0.82 * smoothstep(time))));
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.shadowColor = scene.palette.route; ctx.shadowBlur = 28 * scale;
  ctx.strokeStyle = scene.palette.route; ctx.lineWidth = 16 * scale;
  ctx.beginPath(); ctx.moveTo(routePoints[0].x, routePoints[0].y);
  for (const point of routePoints.slice(1, visible)) ctx.lineTo(point.x, point.y);
  ctx.stroke(); ctx.shadowBlur = 0;
  ctx.strokeStyle = '#fff4b0'; ctx.lineWidth = 4 * scale; ctx.stroke();
  ctx.restore();

  const ghostWorld = interpolateRoute(scene.route, smoothstep(time));
  drawGhost(ctx, worldToScreen(ghostWorld, projection), time, scale);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff'; ctx.shadowColor = scene.palette.purple; ctx.shadowBlur = 28 * scale;
  ctx.font = `bold ${72 * scale}px sans-serif`; ctx.fillText(scene.title, width / 2, 150 * (height / 1920));
  ctx.shadowBlur = 0; ctx.fillStyle = scene.palette.cyan;
  ctx.font = `${30 * scale}px sans-serif`; ctx.fillText(scene.subtitle, width / 2, 205 * (height / 1920));
  ctx.fillStyle = 'rgba(7,3,20,0.7)'; ctx.fillRect(width * 0.12, height * 0.88, width * 0.76, 24 * scale);
  ctx.fillStyle = scene.palette.route; ctx.fillRect(width * 0.12, height * 0.88, width * 0.76 * time, 24 * scale);
  ctx.fillStyle = '#fff'; ctx.font = `bold ${26 * scale}px sans-serif`; ctx.fillText(`${Math.round(time * 100)}%  MIDNIGHT MEETUP`, width / 2, height * 0.92);
  return canvas.toBuffer('image/png');
}
