export function routeLength(points) {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }
  return total;
}

export function interpolateRoute(points, progress) {
  if (!Array.isArray(points) || points.length < 2) throw new Error('scene.route は2点以上必要です');
  const t = Math.max(0, Math.min(1, progress));
  if (t === 0) return { ...points[0] };
  if (t === 1) return { ...points.at(-1) };
  const lengths = [];
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    const length = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    lengths.push(length);
    total += length;
  }
  if (total === 0) return { ...points[0] };
  const target = t * total;
  let consumed = 0;
  for (let i = 0; i < lengths.length; i += 1) {
    if (target <= consumed + lengths[i] || i === lengths.length - 1) {
      if (lengths[i] === 0) continue;
      const local = (target - consumed) / lengths[i];
      return {
        x: points[i].x + (points[i + 1].x - points[i].x) * local,
        y: points[i].y + (points[i + 1].y - points[i].y) * local,
      };
    }
    consumed += lengths[i];
  }
  return { ...points.at(-1) };
}
