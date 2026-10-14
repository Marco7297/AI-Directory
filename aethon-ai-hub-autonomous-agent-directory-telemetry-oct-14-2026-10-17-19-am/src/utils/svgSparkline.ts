/**
 * Lightweight SVG Sparkline mathematical helper library.
 * Generates ultra-crisp SVG paths, bezier splines, and area fills for data trends.
 */

export interface Point {
  x: number;
  y: number;
  value: number;
  index: number;
}

export interface SparklineGeometry {
  points: Point[];
  linePath: string;
  areaPath: string;
  min: number;
  max: number;
  current: number;
  delta: number;
}

/**
 * Calculates SVG coordinate points and smooth bezier or straight line paths from an array of numbers.
 */
export function calculateSparkline(
  data: number[],
  width = 80,
  height = 24,
  padding = 3
): SparklineGeometry {
  if (!data || data.length === 0) {
    return {
      points: [],
      linePath: '',
      areaPath: '',
      min: 0,
      max: 0,
      current: 0,
      delta: 0,
    };
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max === min ? 1 : max - min;
  const current = data[data.length - 1];
  const first = data[0];
  const delta = current - first;

  const innerWidth = Math.max(1, width - padding * 2);
  const innerHeight = Math.max(1, height - padding * 2);

  const stepX = data.length > 1 ? innerWidth / (data.length - 1) : innerWidth;

  const points: Point[] = data.map((val, i) => {
    const x = padding + i * stepX;
    // Invert Y so highest value is at the top
    const normalizedY = (val - min) / range;
    const y = height - padding - normalizedY * innerHeight;
    return { x, y, value: val, index: i };
  });

  if (points.length === 1) {
    const p = points[0];
    return {
      points,
      linePath: `M ${p.x - 2} ${p.y} L ${p.x + 2} ${p.y}`,
      areaPath: `M ${p.x - 2} ${height} L ${p.x - 2} ${p.y} L ${p.x + 2} ${p.y} L ${p.x + 2} ${height} Z`,
      min,
      max,
      current,
      delta: 0,
    };
  }

  // Smooth Catmull-Rom / Bezier curve construction
  let linePath = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const currentP = points[i];
    const nextP = points[i + 1];
    
    // Control points for smooth horizontal flow
    const cpx1 = currentP.x + (nextP.x - currentP.x) * 0.45;
    const cpy1 = currentP.y;
    const cpx2 = currentP.x + (nextP.x - currentP.x) * 0.55;
    const cpy2 = nextP.y;

    linePath += ` C ${cpx1.toFixed(1)} ${cpy1.toFixed(1)}, ${cpx2.toFixed(1)} ${cpy2.toFixed(1)}, ${nextP.x.toFixed(1)} ${nextP.y.toFixed(1)}`;
  }

  // Closed area path for gradient fills
  const firstP = points[0];
  const lastP = points[points.length - 1];
  const bottomY = height;
  const areaPath = `${linePath} L ${lastP.x.toFixed(1)} ${bottomY} L ${firstP.x.toFixed(1)} ${bottomY} Z`;

  return {
    points,
    linePath,
    areaPath,
    min,
    max,
    current,
    delta,
  };
}
