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
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  HelpCircle,
} from 'lucide-react';
import type { NewtonPlotData } from '../../services/api';
import InlineMath from '../InlineMath';

interface NewtonInteractivePlotProps {
  plotData: NewtonPlotData;
  root: number | null;
}

export const NewtonInteractivePlot: React.FC<NewtonInteractivePlotProps> = ({
  plotData,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const totalTangents = plotData?.tangents?.length || 0;

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
      }, 1400);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, totalTangents]);

  React.useEffect(() => {
    setCurrentStepIndex(0);
  }, [plotData]);

  const activeTangent = plotData?.tangents?.[currentStepIndex];
  const prevTangent = currentStepIndex > 0 ? plotData?.tangents?.[currentStepIndex - 1] : null;

  // Compute stable Y-domain
  const { yMin, yMax } = useMemo(() => {
    if (!plotData || !plotData.curve_y || plotData.curve_y.length === 0) {
      return { yMin: -10, yMax: 10 };
    }

    let min = Math.min(...plotData.curve_y);
    let max = Math.max(...plotData.curve_y);

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

  // Build chart dataset with f(x), active tangent line, and previous tangent line
  const chartData = plotData.curve_x.map((xVal, idx) => {
    const yCurve = plotData.curve_y[idx];
    let yTangent: number | null = null;
    let yPrevTangent: number | null = null;

    if (activeTangent) {
      const tVal =
        activeTangent.y_point +
        activeTangent.slope * (xVal - activeTangent.x_point);
      if (tVal >= yMin * 2 && tVal <= yMax * 2) {
        yTangent = tVal;
      }
    }

    if (prevTangent) {
      const ptVal =
        prevTangent.y_point +
        prevTangent.slope * (xVal - prevTangent.x_point);
      if (ptVal >= yMin * 2 && ptVal <= yMax * 2) {
        yPrevTangent = ptVal;
      }
    }

    return {
      x: Number(xVal.toFixed(4)),
      f_x: Number(yCurve.toFixed(4)),
      tangente: yTangent !== null ? Number(yTangent.toFixed(4)) : undefined,
      prevTangente: yPrevTangent !== null ? Number(yPrevTangent.toFixed(4)) : undefined,
    };
  });

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
      {/* Header and Step Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider">
            Visualización Geométrica: Rectas Tangentes
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Intersección de la recta tangente <InlineMath math="L_n(x)" /> con el eje <InlineMath math="y = 0" />.
          </p>
        </div>

        {totalTangents > 0 && (
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
              Paso {currentStepIndex + 1} de {totalTangents}
            </span>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex((prev) => Math.min(totalTangents - 1, prev + 1));
              }}
              disabled={currentStepIndex === totalTangents - 1}
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

      {/* Step Detail Pill */}
      {activeTangent && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Punto actual xₙ</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{activeTangent.x_point.toFixed(4)}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Altura f(xₙ)</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{activeTangent.y_point.toFixed(4)}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Pendiente f'(xₙ)</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{activeTangent.slope.toFixed(4)}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Próximo xₙ₊₁ (corte y=0)</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{activeTangent.x_intercept.toFixed(4)}</span>
          </div>
        </div>
      )}

      {/* Graphical Explanation Banner */}
      {activeTangent && (
        <div className="bg-slate-100/70 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-700 flex items-start gap-2.5">
          <HelpCircle size={16} className="text-slate-900 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900">¿Qué hace el algoritmo en el Paso {currentStepIndex + 1}?</strong>
            <p className="mt-0.5 leading-relaxed">
              Nos paramos en <InlineMath math={`x_${currentStepIndex} = ${activeTangent.x_point.toFixed(3)}`} />, evaluamos la curva y trazamos la recta tangente con inclinación <InlineMath math={`f'(x) = ${activeTangent.slope.toFixed(3)}`} />. La recta corta al eje <InlineMath math="y=0" /> proyectando el nuevo punto <InlineMath math={`x_${currentStepIndex + 1} = ${activeTangent.x_intercept.toFixed(3)}`} />.
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

            {/* Axis Y = 0 */}
            <ReferenceLine y={0} stroke="#94A3B8" strokeWidth={1.5} />

            {/* Curve f(x) */}
            <Line
              type="monotone"
              dataKey="f_x"
              name="Curva f(x)"
              stroke="#0F172A"
              strokeWidth={2.4}
              dot={false}
              isAnimationActive={false}
            />

            {/* Previous Tangent Line (Blue dashed) */}
            {prevTangent && (
              <Line
                type="linear"
                dataKey="prevTangente"
                name={`Tangente Anterior (Paso ${currentStepIndex})`}
                stroke="#3B82F6"
                strokeWidth={2.0}
                dot={false}
                strokeDasharray="4 4"
                isAnimationActive={false}
              />
            )}

            {/* Current Tangent Line Ln(x) (Red dashed) */}
            {activeTangent && (
              <Line
                type="linear"
                dataKey="tangente"
                name={`Tangente Actual (Paso ${currentStepIndex + 1})`}
                stroke="#EF4444"
                strokeWidth={2.2}
                dot={false}
                strokeDasharray="3 2"
                isAnimationActive={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & hints */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-700 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1 bg-slate-900 rounded-full" />
          <span>Curva de la función f(x)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1 bg-rose-500 rounded-full border-b border-dashed" />
          <span>Recta Tangente Actual Lₙ(x) (Rojo)</span>
        </div>
        {prevTangent && (
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 bg-blue-500 rounded-full border-b border-dashed" />
            <span>Recta Tangente Anterior Lₙ₋₁(x) (Azul)</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewtonInteractivePlot;
