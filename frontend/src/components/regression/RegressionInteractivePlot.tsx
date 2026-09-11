import React, { useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';
import type { FitResponse, RegressionDataPoint } from '../../services/api';
import type { RegressionModelType } from '../../types/regression';
import usePlotInteractivity from '../roots/usePlotInteractivity';
import InlineMath from '../InlineMath';

interface RegressionInteractivePlotProps {
  result: FitResponse;
  modelType: RegressionModelType;
  degree?: number;
  points: RegressionDataPoint[];
}

export const RegressionInteractivePlot: React.FC<RegressionInteractivePlotProps> = ({
  result,
  modelType,
  degree = 2,
  points,
}) => {
  // Compute base bounds from experimental points
  const { baseCenter, baseSpan, baseMinY, baseMaxY } = useMemo(() => {
    if (!points || points.length === 0) {
      return { baseCenter: 0, baseSpan: 10, baseMinY: -5, baseMaxY: 5 };
    }
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const spanX = Math.max(1, maxX - minX);
    const spanY = Math.max(1, maxY - minY);

    return {
      baseCenter: (minX + maxX) / 2,
      baseSpan: spanX * 1.3, // 15% padding on each side
      baseMinY: minY - spanY * 0.2,
      baseMaxY: maxY + spanY * 0.2,
    };
  }, [points]);

  const {
    zoom,
    panOffsetY,
    setZoom,
    setPanOffset,
    setPanOffsetY,
    isDragging,
    containerRef,
    currentMinX,
    currentMaxX,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    dragProps,
  } = usePlotInteractivity({
    baseSpan,
    baseCenter,
    minZoom: 0.05,
    maxZoom: 50,
  });

  // Reset viewport when the result or points change
  React.useEffect(() => {
    setZoom(1);
    setPanOffset(0);
    setPanOffsetY(0);
  }, [result, setZoom, setPanOffset, setPanOffsetY]);

  // Evaluator for the fitted model function f(x) anywhere in R
  const evaluateFittedFunction = useMemo(() => {
    const p = result.parameters || {};

    return (x: number): number | null => {
      try {
        if (modelType === 'linear') {
          return (p.a1 ?? 0) + (p.a2 ?? 0) * x;
        }
        if (modelType === 'polynomial') {
          let val = 0;
          Object.entries(p).forEach(([k, coeff]) => {
            const m = k.match(/a(\d+)/);
            if (m) {
              const pwr = parseInt(m[1], 10);
              val += coeff * Math.pow(x, pwr);
            }
          });
          return val;
        }
        if (modelType === 'exponential') {
          const val = (p.a ?? 1) * Math.exp((p.b ?? 0) * x);
          return Number.isFinite(val) ? val : null;
        }
        if (modelType === 'power') {
          if (x <= 0) return null;
          const val = (p.a ?? 1) * Math.pow(x, p.b ?? 1);
          return Number.isFinite(val) ? val : null;
        }
        if (modelType === 'saturation') {
          const denom = (p.b ?? 0) + x;
          if (Math.abs(denom) < 1e-9) return null;
          const val = ((p.a ?? 1) * x) / denom;
          return Number.isFinite(val) ? val : null;
        }
      } catch {
        return null;
      }
      return null;
    };
  }, [result.parameters, modelType]);

  // Generate continuous GeoGebra-style dataset spanning edge-to-edge from currentMinX to currentMaxX
  const { chartData, effectiveYMin, effectiveYMax } = useMemo(() => {
    const N_SAMPLES = 220;
    const step = (currentMaxX - currentMinX) / (N_SAMPLES - 1);
    const mapByX: Record<number, { x: number; y_actual?: number; y_pred?: number }> = {};

    // 1. Sample continuous curve along the visible X domain
    for (let i = 0; i < N_SAMPLES; i++) {
      const curX = currentMinX + i * step;
      const roundedX = Math.round(curX * 1000) / 1000;
      const pred = evaluateFittedFunction(curX);
      mapByX[roundedX] = {
        x: roundedX,
        y_pred: pred !== null && Number.isFinite(pred) ? pred : undefined,
      };
    }

    // 2. Overlay the exact experimental observations
    points.forEach((pt) => {
      const roundedX = Math.round(pt.x * 1000) / 1000;
      const pred = evaluateFittedFunction(pt.x);
      if (mapByX[roundedX]) {
        mapByX[roundedX].y_actual = pt.y;
        if (pred !== null && Number.isFinite(pred)) {
          mapByX[roundedX].y_pred = pred;
        }
      } else {
        mapByX[roundedX] = {
          x: pt.x,
          y_actual: pt.y,
          y_pred: pred !== null && Number.isFinite(pred) ? pred : undefined,
        };
      }
    });

    const sortedData = Object.values(mapByX).sort((a, b) => a.x - b.x);

    // Compute effective Y boundaries
    const visiblePoints = points.filter(
      (p) => p.x >= currentMinX && p.x <= currentMaxX
    );
    const visibleYs = visiblePoints.map((p) => p.y);
    let curMinY = baseMinY;
    let curMaxY = baseMaxY;
    if (visibleYs.length > 0) {
      curMinY = Math.min(...visibleYs);
      curMaxY = Math.max(...visibleYs);
      const span = Math.max(1, curMaxY - curMinY);
      curMinY -= span * 0.2;
      curMaxY += span * 0.2;
    }

    return {
      chartData: sortedData,
      effectiveYMin: Math.round((curMinY + panOffsetY) * 100) / 100,
      effectiveYMax: Math.round((curMaxY + panOffsetY) * 100) / 100,
    };
  }, [
    currentMinX,
    currentMaxX,
    evaluateFittedFunction,
    points,
    baseMinY,
    baseMaxY,
    panOffsetY,
  ]);

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-4 min-w-0 max-w-full overflow-hidden">
      {/* Header with Title, Formula, and Interactive Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              Gráfico Interactivo de Regresión
            </span>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              {modelType === 'linear'
                ? 'Modelo Lineal'
                : modelType === 'polynomial'
                ? `Polinómico (grado ${degree})`
                : modelType === 'exponential'
                ? 'Exponencial'
                : modelType === 'power'
                ? 'Potencial'
                : 'Cociente'}
            </span>
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 font-mono overflow-x-auto max-w-full scrollbar-none py-0.5">
            <InlineMath math={result.formula_latex} />
          </div>
          <p className="text-xs text-slate-500">
            Curva continua evaluada dinámicamente de borde a borde y {points.length} observaciones experimentales.
          </p>
        </div>

        {/* GeoGebra-style Toolbar (Zoom & Reset) */}
        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-2xs">
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-xl bg-white hover:bg-slate-900 hover:text-white text-slate-700 transition-all cursor-pointer shadow-2xs"
              title="Acercar (Zoom In)"
            >
              <ZoomIn size={15} />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-xl bg-white hover:bg-slate-900 hover:text-white text-slate-700 transition-all cursor-pointer shadow-2xs"
              title="Alejar (Zoom Out)"
            >
              <ZoomOut size={15} />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-900 hover:text-white text-slate-700 font-mono text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1"
              title="Restablecer vista inicial"
            >
              <RotateCcw size={13} />
              <span>{Math.round(zoom * 100)}%</span>
            </button>
          </div>
        </div>
      </div>

      {/* Legend & Navigation Hint */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 bg-slate-50/70 p-2.5 px-3.5 rounded-xl border border-slate-200/70">
        <div className="flex items-center gap-4 font-semibold text-slate-700">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 inline-block" />
            <span>Puntos experimentales ({points.length})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-blue-600 inline-block rounded" />
            <span>Curva continua de regresión</span>
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
          <Move size={12} className="text-slate-400" />
          <span>Arrastra para mover el plano · Rueda del ratón para zoom</span>
        </div>
      </div>

      {/* Interactive Canvas */}
      <div
        ref={containerRef}
        {...dragProps}
        className={`relative w-full h-72 sm:h-96 select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={true} horizontal={true} />
            <XAxis
              type="number"
              dataKey="x"
              domain={[Number(currentMinX.toFixed(2)), Number(currentMaxX.toFixed(2))]}
              allowDataOverflow={true}
              stroke="#94a3b8"
              fontSize={11}
              tickLine={true}
              tickFormatter={(val) => {
                if (Math.abs(val) >= 1e6) return `${(val / 1e6).toFixed(1)}M`;
                if (Math.abs(val) >= 1e4) return `${(val / 1e3).toFixed(0)}k`;
                return Number(val).toFixed(Math.abs(val) < 10 ? 1 : 0);
              }}
            />
            <YAxis
              type="number"
              domain={[effectiveYMin, effectiveYMax]}
              allowDataOverflow={true}
              stroke="#94a3b8"
              fontSize={11}
              tickLine={true}
              tickFormatter={(val) => {
                if (Math.abs(val) >= 1e6) return `${(val / 1e6).toFixed(1)}M`;
                if (Math.abs(val) >= 1e4) return `${(val / 1e3).toFixed(0)}k`;
                return Number(val).toFixed(Math.abs(val) < 10 ? 1 : 0);
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                fontSize: '11px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
              formatter={(val: any, name: any) => [
                val != null && !isNaN(Number(val)) ? Number(val).toFixed(3) : '-',
                name === 'y_actual' ? 'Dato Experimental' : 'Curva Ajustada',
              ]}
              labelFormatter={(label) => `x = ${Number(label).toFixed(3)}`}
            />

            {/* Origin Reference Lines if in visible range */}
            {currentMinX <= 0 && currentMaxX >= 0 && (
              <ReferenceLine x={0} stroke="#cbd5e1" strokeWidth={1.5} />
            )}
            {effectiveYMin <= 0 && effectiveYMax >= 0 && (
              <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1.5} />
            )}

            {/* Regression Curve (Continuous edge-to-edge) */}
            <Line
              type="monotone"
              dataKey="y_pred"
              name="Curva Ajustada"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
              connectNulls={true}
            />

            {/* Experimental Data Points */}
            <Scatter
              name="Dato Experimental"
              dataKey="y_actual"
              fill="#0f172a"
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RegressionInteractivePlot;
