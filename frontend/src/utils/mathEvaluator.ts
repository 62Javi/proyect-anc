/**
 * Safe client-side mathematical expression evaluator and continuous domain sampler.
 * Allows infinite continuous curve rendering (like GeoGebra / Desmos) regardless of zoom level.
 */

export function compileMathExpression(rawExpr: string): ((x: number) => number) | null {
  if (!rawExpr || typeof rawExpr !== 'string') return null;

  try {
    let s = rawExpr.trim();

    // Remove LaTeX delimiters if present
    s = s.replace(/^\$+|\$+$/g, '');

    // Normalize unicode math symbols
    s = s.replace(/·/g, '*').replace(/×/g, '*').replace(/÷/g, '/');
    s = s.replace(/−/g, '-');
    s = s.replace(/\\cdot/g, '*').replace(/\\times/g, '*');
    s = s.replace(/\\left/g, '').replace(/\\right/g, '');

    // Fractions \frac{a}{b} -> ((a)/(b))
    s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '(($1)/($2))');

    // Exponential notation: e^{...}, e^x, e^-1.5x
    s = s.replace(/e\^\{([^}]+)\}/g, 'exp($1)');
    s = s.replace(/e\^(-?[\d.]+[a-zA-Z]?)/g, 'exp($1)');

    // Exponentiation: ^{...} -> **(...)
    s = s.replace(/\^\{([^}]+)\}/g, '**($1)');
    s = s.replace(/\^/g, '**');

    // LaTeX function prefixes
    s = s.replace(/\\(sin|cos|tan|asin|acos|atan|sinh|cosh|tanh|exp|ln|log|sqrt|abs)/g, '$1');
    s = s.replace(/\bln\b/g, 'log');

    // Pipe notation for absolute value |...| -> abs(...)
    let prev = '';
    while (s.includes('|') && s !== prev) {
      prev = s;
      s = s.replace(/\|([^|]+)\|/g, 'abs($1)');
    }

    const funcs = [
      'sin',
      'cos',
      'tan',
      'asin',
      'acos',
      'atan',
      'sinh',
      'cosh',
      'tanh',
      'exp',
      'log',
      'sqrt',
      'abs',
    ];

    // Implicit multiplications:
    // 1) number followed by word (e.g. 4x -> 4*x, 70exp -> 70*exp)
    s = s.replace(/(\d)\s*([a-zA-Z]+)/g, '$1*$2');
    // 2) variable x followed by number (e.g. x2 -> x*2)
    s = s.replace(/([xX])\s*(\d)/g, '$1*$2');
    // 3) number followed by opening paren (e.g. 2(...) -> 2*(...))
    s = s.replace(/(\d)\s*\(/g, '$1*(');
    // 4) closing paren followed by opening paren (e.g. (...)(...) -> (...)*(...))
    s = s.replace(/\)\s*\(/g, ')*(');
    // 5) closing paren followed by letter/variable (e.g. (...)x -> (...)*x)
    s = s.replace(/\)\s*([a-zA-Z]+)/g, ')*$1');
    // 6) word followed by opening paren (only insert * if word is not a math function)
    s = s.replace(/([a-zA-Z]+)\s*\(/g, (_, word) => {
      if (funcs.includes(word.toLowerCase())) return `${word}(`;
      return `${word}*(`;
    });

    // Replace functions with Math.fn
    funcs.forEach((fn) => {
      const re = new RegExp(`\\b${fn}\\b`, 'g');
      s = s.replace(re, `Math.${fn}`);
    });

    // Constants
    s = s.replace(/\bpi\b/gi, 'Math.PI');
    s = s.replace(/\be\b/g, 'Math.E');

    // Create safe evaluation function
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const evaluator = new Function(
      'x',
      `"use strict"; try { const res = ${s}; return Number.isFinite(res) ? res : null; } catch(e) { return null; }`
    ) as (x: number) => number | null;

    // Sanity check
    evaluator(1);
    return (x: number) => {
      const res = evaluator(x);
      return res !== null && Number.isFinite(res) ? res : NaN;
    };
  } catch {
    return null;
  }
}

/**
 * Extrapolates / interpolates y from known discrete data points.
 */
function interpolateExtrapolate(
  x: number,
  xs: number[],
  ys: number[]
): number {
  const n = xs.length;
  if (n === 0) return 0;
  if (n === 1) return ys[0];

  if (x <= xs[0]) {
    const dx = xs[1] - xs[0];
    if (Math.abs(dx) < 1e-12) return ys[0];
    const slope = (ys[1] - ys[0]) / dx;
    return ys[0] + slope * (x - xs[0]);
  }

  if (x >= xs[n - 1]) {
    const dx = xs[n - 1] - xs[n - 2];
    if (Math.abs(dx) < 1e-12) return ys[n - 1];
    const slope = (ys[n - 1] - ys[n - 2]) / dx;
    return ys[n - 1] + slope * (x - xs[n - 1]);
  }

  // Binary search for interval
  let low = 0;
  let high = n - 1;
  while (high - low > 1) {
    const mid = Math.floor((low + high) / 2);
    if (xs[mid] <= x) {
      low = mid;
    } else {
      high = mid;
    }
  }

  const dx = xs[high] - xs[low];
  if (Math.abs(dx) < 1e-12) return ys[low];
  const t = (x - xs[low]) / dx;
  return ys[low] + t * (ys[high] - ys[low]);
}

export interface ContinuousPoint {
  x: number;
  f_x: number | null;
  tangente?: number | null;
  prevTangente?: number | null;
  y_eq_x?: number | null;
  g_x?: number | null;
}

/**
 * Samples continuous points across [minX, maxX] so the curve and lines
 * never abruptly truncate when zooming or panning.
 */
export function sampleContinuousDomain({
  minX,
  maxX,
  pointsCount = 180,
  evaluator,
  fallbackX,
  fallbackY,
  activeTangent,
  prevTangent,
  isFixedPoint = false,
}: {
  minX: number;
  maxX: number;
  pointsCount?: number;
  evaluator?: ((x: number) => number) | null;
  fallbackX?: number[];
  fallbackY?: number[];
  activeTangent?: { x_point: number; y_point: number; slope: number } | null;
  prevTangent?: { x_point: number; y_point: number; slope: number } | null;
  isFixedPoint?: boolean;
}): { points: ContinuousPoint[]; yMin: number; yMax: number } {
  const points: ContinuousPoint[] = [];
  const span = maxX - minX;
  const dx = span / (pointsCount - 1);

  let rawYMin = Infinity;
  let rawYMax = -Infinity;

  const hasFallback = !!(fallbackX && fallbackY && fallbackX.length > 0 && fallbackY.length === fallbackX.length);

  for (let i = 0; i < pointsCount; i++) {
    const x = minX + i * dx;
    let yCurve: number | null = null;

    if (evaluator) {
      const val = evaluator(x);
      if (Number.isFinite(val)) {
        yCurve = val;
      }
    }

    if (yCurve === null && hasFallback) {
      const val = interpolateExtrapolate(x, fallbackX!, fallbackY!);
      if (Number.isFinite(val)) {
        yCurve = val;
      }
    }

    let yTan: number | null = null;
    if (activeTangent && Number.isFinite(activeTangent.slope)) {
      yTan = activeTangent.y_point + activeTangent.slope * (x - activeTangent.x_point);
    }

    let yPrevTan: number | null = null;
    if (prevTangent && Number.isFinite(prevTangent.slope)) {
      yPrevTan = prevTangent.y_point + prevTangent.slope * (x - prevTangent.x_point);
    }

    let yEqX: number | null = null;
    if (isFixedPoint) {
      yEqX = x;
    }

    // Accumulate min/max for adaptive domain focusing on the function
    if (yCurve !== null) {
      if (yCurve < rawYMin) rawYMin = yCurve;
      if (yCurve > rawYMax) rawYMax = yCurve;
    }

    points.push({
      x: Number(x.toFixed(4)),
      f_x: yCurve !== null ? Number(yCurve.toFixed(4)) : null,
      tangente: yTan !== null ? Number(yTan.toFixed(4)) : undefined,
      prevTangente: yPrevTan !== null ? Number(yPrevTan.toFixed(4)) : undefined,
      g_x: isFixedPoint && yCurve !== null ? Number(yCurve.toFixed(4)) : undefined,
      y_eq_x: yEqX !== null ? Number(yEqX.toFixed(4)) : undefined,
    });
  }

  if (!Number.isFinite(rawYMin)) rawYMin = -10;
  if (!Number.isFinite(rawYMax)) rawYMax = 10;

  // Always include y = 0 axis line clearly in view
  if (rawYMin > 0) rawYMin = 0;
  if (rawYMax < 0) rawYMax = 0;

  const ySpan = Math.max(2, rawYMax - rawYMin);
  const padding = ySpan * 0.15;

  const computedYMin = Math.floor(rawYMin - padding);
  const computedYMax = Math.ceil(rawYMax + padding);

  return {
    points,
    yMin: computedYMin,
    yMax: computedYMax,
  };
}
