import React, { useState, useMemo } from 'react';
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
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, HelpCircle } from 'lucide-react';
import type { FixedPointPlotData, FixedPointStep } from '../../services/api';
import InlineMath from '../InlineMath';

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
  const totalSteps = steps?.length || 0;

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
      }, 1400);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, totalSteps]);

  // Compute a FIXED, stable Y-domain so the axes and curves NEVER jump or shift between steps
  const { yMin, yMax } = useMemo(() => {
    if (!plotData || !plotData.curve_y || plotData.curve_y.length === 0) {
      return { yMin: -10, yMax: 10 };
    }

    const allY = [...plotData.curve_y, ...plotData.line_y_eq_x];
    let min = Math.min(...allY);
    let max = Math.max(...allY);

    if (min > 0) min = 0;
    if (max < 0) max = 0;

    const span = max - min || 2;
    const padding = span * 0.15;

    return {
      yMin: Math.floor(min - padding),
      yMax: Math.ceil(max + padding),
    };
  }, [plotData]);

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
    <div className="w-full bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider">
            Diagrama de Telaraña (Cobweb Plot)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Intersección entre la curva <InlineMath math="y = g(x)" /> y la recta identidad <InlineMath math="y = x" />.
          </p>
        </div>

        {totalSteps > 0 && (
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-white shadow-xs border border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
              title={isPlaying ? 'Pausar animación' : 'Reproducir animación'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex((prev) => Math.max(0, prev - 1));
              }}
              disabled={currentStepIndex === 0}
              className="p-2 rounded-xl hover:bg-slate-200 disabled:opacity-30 text-slate-700 transition-colors cursor-pointer"
              title="Paso anterior"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-xs font-black text-slate-900 font-mono px-3">
              Paso {currentStepIndex + 1} de {totalSteps}
            </span>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex((prev) => Math.min(totalSteps - 1, prev + 1));
              }}
              disabled={currentStepIndex === totalSteps - 1}
              className="p-2 rounded-xl hover:bg-slate-200 disabled:opacity-30 text-slate-700 transition-colors cursor-pointer"
              title="Paso siguiente"
            >
              <ChevronRight size={16} />
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex(0);
              }}
              className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              title="Reiniciar"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Step and Convergence Indicator */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
        {activeStep && (
          <>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Punto actual xₙ</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{activeStep.xn.toFixed(4)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">g(xₙ) = xₙ₊₁</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{activeStep.gxn.toFixed(4)}</span>
            </div>
          </>
        )}
        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-bold">Constante |g'(x)|</span>
          <span
            className={`font-mono font-bold text-sm ${
              kConstantEst && kConstantEst < 1 ? 'text-slate-900' : 'text-slate-600'
            }`}
          >
            {kConstantEst !== null && kConstantEst !== undefined
              ? `k ≈ ${kConstantEst.toFixed(3)} ${kConstantEst < 1 ? '(< 1)' : '(≥ 1)'}`
              : 'N/A'}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-bold">Punto Fijo (Raíz)</span>
          <span className="font-mono font-bold text-slate-900 text-sm">
            {root !== null ? root.toFixed(4) : 'Buscando...'}
          </span>
        </div>
      </div>

      {/* Graphical Explanation Banner */}
      {activeStep && (
        <div className="bg-slate-100/70 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-700 flex items-start gap-2.5">
          <HelpCircle size={16} className="text-slate-900 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900">¿Cómo leer el Diagrama de Telaraña (Paso {currentStepIndex + 1})?</strong>
            <p className="mt-0.5 leading-relaxed">
              En cada iteración, subimos verticalmente hasta la curva <InlineMath math="y = g(x)" /> para obtener <InlineMath math={`g(x_${currentStepIndex}) = ${activeStep.gxn.toFixed(3)}`} />. Luego nos movemos horizontalmente hasta chocar con la recta <InlineMath math="y = x" />, proyectando la nueva posición <InlineMath math={`x_${currentStepIndex + 1}`} />.
            </p>
          </div>
        </div>
      )}

      {/* Plot container */}
      <div className="w-full h-[340px] sm:h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
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
              domain={[yMin, yMax]}
              allowDataOverflow={true}
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
                stroke="#0F172A"
                strokeDasharray="4 4"
                label={{
                  value: `xₙ=${activeStep.xn.toFixed(3)}`,
                  fill: '#0F172A',
                  fontSize: 10,
                  position: 'top',
                }}
              />
            )}

            {/* Final Fixed point marker */}
            {root !== null && (
              <ReferenceLine
                x={Number(root.toFixed(4))}
                stroke="#0F172A"
                strokeWidth={2}
                label={{
                  value: `p=${root.toFixed(4)}`,
                  fill: '#0F172A',
                  fontSize: 11,
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
              strokeWidth={1.8}
              strokeDasharray="4 4"
              dot={false}
              isAnimationActive={false}
            />

            {/* Function g(x) */}
            <Line
              type="monotone"
              dataKey="g_x"
              name="Curva de iteración g(x)"
              stroke="#0F172A"
              strokeWidth={2.4}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-700 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1 bg-slate-900 rounded-full" />
          <span>Curva de iteración y = g(x)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1 bg-slate-400 rounded-full border-b border-dashed" />
          <span>Recta Identidad y = x</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
          <span>Punto Fijo p tal que p = g(p)</span>
        </div>
      </div>
    </div>
  );
};
export default FixedPointInteractivePlot;
