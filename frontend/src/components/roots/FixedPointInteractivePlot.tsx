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
import type { FixedPointPlotData, FixedPointStep } from '../../services/api';

interface FixedPointInteractivePlotProps {
  plotData: FixedPointPlotData;
  steps: FixedPointStep[];
  root: number | null;
  kConstantEst?: number | null;
}

export const FixedPointInteractivePlot: React.FC<FixedPointInteractivePlotProps> = ({
  plotData,
  steps,
  root,
  kConstantEst,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const totalSteps = steps.length;

  React.useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= totalSteps - 1) {
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
  }, [isPlaying, totalSteps]);

  if (!plotData || plotData.curve_x.length === 0) {
    return (
      <div className="h-[320px] flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs font-semibold uppercase tracking-wider">
        No hay datos de gráfica disponibles
      </div>
    );
  }

  const activeStep = steps[currentStepIndex];

  // Build chart dataset with g(x) and y = x
  const chartData = plotData.curve_x.map((xVal, idx) => {
    const yCurve = plotData.curve_y[idx];
    const yLine = plotData.line_y_eq_x[idx];

    return {
      x: Number(xVal.toFixed(4)),
      g_x: Number(yCurve.toFixed(4)),
      y_eq_x: Number(yLine.toFixed(4)),
    };
  });

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Diagrama de Telaraña (Cobweb Plot)
          </h3>
          <p className="text-xs text-slate-500">
            Intersección entre <span className="font-mono text-indigo-600">y = g(x)</span> y la recta identidad <span className="font-mono text-slate-700">y = x</span>.
          </p>
        </div>

        {totalSteps > 0 && (
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg bg-white shadow-xs border border-slate-200 text-slate-700 hover:text-indigo-600 transition-colors"
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
              Paso {currentStepIndex + 1} / {totalSteps}
            </span>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex((prev) => Math.min(totalSteps - 1, prev + 1));
              }}
              disabled={currentStepIndex === totalSteps - 1}
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

      {/* Step and Convergence Indicator */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 text-xs">
        {activeStep && (
          <>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Punto actual xₙ</span>
              <span className="font-mono font-bold text-slate-900">{activeStep.xn.toFixed(5)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">g(xₙ) = xₙ₊₁</span>
              <span className="font-mono font-bold text-indigo-700">{activeStep.gxn.toFixed(5)}</span>
            </div>
          </>
        )}
        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-bold">Constante |g'(x)|</span>
          <span
            className={`font-mono font-bold ${
              kConstantEst && kConstantEst < 1 ? 'text-emerald-700' : 'text-amber-700'
            }`}
          >
            {kConstantEst !== null && kConstantEst !== undefined
              ? `k ≈ ${kConstantEst.toFixed(3)} ${kConstantEst < 1 ? '(< 1 Converge)' : '(≥ 1 Diverge)'}`
              : 'N/A'}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-bold">Punto Fijo (Raíz)</span>
          <span className="font-mono font-bold text-emerald-700">
            {root !== null ? root.toFixed(5) : 'Buscando...'}
          </span>
        </div>
      </div>

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

            {/* Reference line y = 0 */}
            <ReferenceLine y={0} stroke="#94A3B8" strokeWidth={1} />

            {/* Active step marker */}
            {activeStep && (
              <ReferenceLine
                x={Number(activeStep.xn.toFixed(4))}
                stroke="#6366F1"
                strokeDasharray="4 4"
                label={{
                  value: `xₙ=${activeStep.xn.toFixed(3)}`,
                  fill: '#4F46E5',
                  fontSize: 10,
                  position: 'top',
                }}
              />
            )}

            {/* Final Fixed point marker */}
            {root !== null && (
              <ReferenceLine
                x={Number(root.toFixed(4))}
                stroke="#E11D48"
                strokeWidth={1.5}
                label={{
                  value: `p=${root.toFixed(4)}`,
                  fill: '#E11D48',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
            )}

            {/* Reference Line y = x */}
            <Line
              type="monotone"
              dataKey="y_eq_x"
              name="Recta Identidad y = x"
              stroke="#94A3B8"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              isAnimationActive={false}
            />

            {/* Function g(x) */}
            <Line
              type="monotone"
              dataKey="g_x"
              name="g(x)"
              stroke="#6366F1"
              strokeWidth={2.4}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-indigo-600 rounded-full" />
          <span>Curva de iteración y = g(x)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-slate-400 rounded-full border-b border-dashed" />
          <span>Recta Identidad y = x</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Punto Fijo p tal que p = g(p)</span>
        </div>
      </div>
    </div>
  );
};
export default FixedPointInteractivePlot;
