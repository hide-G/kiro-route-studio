export function worldToScreen(point, options) {
  const a = options.tileWidth / 2;
  const b = options.tileHeight / 2;
  return {
    x: options.origin.x + (point.x - point.y) * a,
    y: options.origin.y + (point.x + point.y) * b,
  };
}

export function screenToWorld(point, options) {
  const a = options.tileWidth / 2;
  const b = options.tileHeight / 2;
  const sx = (point.x - options.origin.x) / a;
  const sy = (point.y - options.origin.y) / b;
  return { x: (sx + sy) / 2, y: (sy - sx) / 2 };
}
