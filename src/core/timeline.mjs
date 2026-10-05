export const smoothstep = (value) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

export function frameCount(config) {
  return Math.round(config.output.durationSeconds * config.output.fps);
}

export function normalizedTime(index, count) {
  return count <= 1 ? 0 : Math.max(0, Math.min(1, index / (count - 1)));
}

export function progressPercent(index, count) {
  return count <= 1 ? 100 : Math.round(normalizedTime(index, count) * 100);
}

export function frameName(index) {
  return `frame-${String(index).padStart(6, '0')}.png`;
}
