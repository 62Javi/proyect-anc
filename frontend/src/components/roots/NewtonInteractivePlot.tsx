import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react';
import type { NewtonPlotData } from '../../services/api';

interface NewtonInteractivePlotProps {
  plotData: NewtonPlotData;
  root: number | null;
}

export const NewtonInteractivePlot: React.FC<NewtonInteractivePlotProps> = ({
  plotData,
  root,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const totalTangents = plotData.tangents.length;

  React.useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= totalTangents - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, totalTangents]);

  if (!plotData || plotData.curve_x.length === 0) {
    return (
      <div className="h-[320px] flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs font-semibold uppercase tracking-wider">
        No hay datos de gráfica disponibles
      </div>
    );
  }

  const activeTangent = plotData.tangents[currentStepIndex];

  // Build chart dataset with f(x) and the active tangent line
  const chartData = plotData.curve_x.map((xVal, idx) => {
    const yCurve = plotData.curve_y[idx];
    let yTangent: number | null = null;

    if (activeTangent) {
      // y = f(xn) + f'(xn) * (x - xn)
      const tVal =
        activeTangent.y_point +
        activeTangent.slope * (xVal - activeTangent.x_point);
      // Keep tangent values bounded in graph view
      if (Math.abs(tVal) < 1e4) {
        yTangent = tVal;
      }
    }

    return {
      x: Number(xVal.toFixed(4)),
      f_x: Number(yCurve.toFixed(4)),
      tangente: yTangent !== null ? Number(yTangent.toFixed(4)) : undefined,
    };
  });

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
      {/* Header and Step Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Visualización Geométrica: Rectas Tangentes
          </h3>
          <p className="text-xs text-slate-500">
            Paso a paso de la linealización <span className="font-mono text-slate-900 font-bold">Lₙ(x)</span> e intersección con el eje <span className="font-mono">y = 0</span>.
          </p>
        </div>

        {totalTangents > 0 && (
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg bg-white shadow-xs border border-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
              title={isPlaying ? 'Pausar animación' : 'Reproducir animación'}
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex((prev) => Math.max(0, prev - 1));
              }}
              disabled={currentStepIndex === 0}
              className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30 text-slate-700 transition-colors"
              title="Paso anterior"
            >
              <ChevronLeft size={15} />
            </button>

            <span className="text-xs font-bold text-slate-700 font-mono px-2">
              Paso {currentStepIndex + 1} / {totalTangents}
            </span>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex((prev) => Math.min(totalTangents - 1, prev + 1));
              }}
              disabled={currentStepIndex === totalTangents - 1}
              className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30 text-slate-700 transition-colors"
              title="Paso siguiente"
            >
              <ChevronRight size={15} />
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex(0);
              }}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
              title="Reiniciar"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Step Detail Pill */}
      {activeTangent && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Punto actual xₙ</span>
            <span className="font-mono font-bold text-slate-900">{activeTangent.x_point.toFixed(5)}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">f(xₙ)</span>
            <span className="font-mono font-bold text-slate-900">{activeTangent.y_point.toFixed(5)}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Pendiente f'(xₙ)</span>
            <span className="font-mono font-bold text-slate-900">{activeTangent.slope.toFixed(5)}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Próximo xₙ₊₁</span>
            <span className="font-mono font-bold text-emerald-700">{activeTangent.x_intercept.toFixed(5)}</span>
          </div>
        </div>
      )}

      {/* Plot container */}
      <div className="w-full h-[320px] sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="x"
              tick={{ fill: '#64748B', fontSize: 11 }}
              axisLine={{ stroke: '#CBD5E1' }}
              tickLine={false}
              minTickGap={45}
            />
            <YAxis
              tick={{ fill: '#64748B', fontSize: 11 }}
              axisLine={{ stroke: '#CBD5E1' }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                fontSize: '11px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
            />

            {/* Axis Y = 0 */}
            <ReferenceLine y={0} stroke="#94A3B8" strokeWidth={1.5} />

            {/* Current xn marker */}
            {activeTangent && (
              <ReferenceLine
                x={Number(activeTangent.x_point.toFixed(4))}
                stroke="#0F172A"
                strokeDasharray="4 4"
                label={{
                  value: `xₙ=${activeTangent.x_point.toFixed(3)}`,
                  fill: '#0F172A',
                  fontSize: 10,
                  position: 'top',
                }}
              />
            )}

            {/* Next xn+1 marker */}
            {activeTangent && (
              <ReferenceLine
                x={Number(activeTangent.x_intercept.toFixed(4))}
                stroke="#10B981"
                strokeDasharray="4 4"
                label={{
                  value: `xₙ₊₁=${activeTangent.x_intercept.toFixed(3)}`,
                  fill: '#059669',
                  fontSize: 10,
                  position: 'bottom',
                }}
              />
            )}

            {/* Final Root marker */}
            {root !== null && (
              <ReferenceLine
                x={Number(root.toFixed(4))}
                stroke="#E11D48"
                strokeWidth={1.5}
                label={{
                  value: `Raíz=${root.toFixed(4)}`,
                  fill: '#E11D48',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
            )}

            {/* Curve f(x) */}
            <Line
              type="monotone"
              dataKey="f_x"
              name="f(x)"
              stroke="#0F172A"
              strokeWidth={2.2}
              dot={false}
              isAnimationActive={false}
            />

            {/* Tangent Line Ln(x) */}
            {activeTangent && (
              <Line
                type="linear"
                dataKey="tangente"
                name={`Tangente (Paso ${currentStepIndex + 1})`}
                stroke="#475569"
                strokeWidth={2}
                dot={false}
                strokeDasharray="3 2"
                isAnimationActive={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & hints */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-slate-900 rounded-full" />
          <span>Curva f(x)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-slate-600 rounded-full border-b border-dashed" />
          <span>Recta Tangente Lₙ(x)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Intersección con eje (xₙ₊₁)</span>
        </div>
      </div>
    </div>
  );
};
export default NewtonInteractivePlot;
