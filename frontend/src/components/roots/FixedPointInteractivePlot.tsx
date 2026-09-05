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
import type { FixedPointPlotData, FixedPointStep } from '../../services/api';
import InlineMath from '../InlineMath';
import usePlotInteractivity from './usePlotInteractivity';
import { compileMathExpression, sampleContinuousDomain } from '../../utils/mathEvaluator';

interface FixedPointInteractivePlotProps {
  plotData: FixedPointPlotData;
  steps: FixedPointStep[];
  root: number | null;
  kConstantEst?: number | null;
  expression?: string;
}

export const FixedPointInteractivePlot: React.FC<FixedPointInteractivePlotProps> = ({
  plotData,
  steps,
  root,
  kConstantEst,
  expression,
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

  // Focus initial view nicely around the iterations
  const { baseCenter, baseSpan } = useMemo(() => {
    if (!steps || steps.length === 0) {
      const xs = plotData?.curve_x || [-5, 5];
      const min = xs[0] ?? -5;
      const max = xs[xs.length - 1] ?? 5;
      return { baseCenter: (min + max) / 2, baseSpan: Math.max(2, max - min) };
    }
    const xPoints = steps.flatMap((s) => [s.xn, s.xn_plus_1]);
    if (root !== null) xPoints.push(root);
    const minX = Math.min(...xPoints);
    const maxX = Math.max(...xPoints);
    const center = (minX + maxX) / 2;
    const span = Math.max(4, (maxX - minX) * 1.6);
    return { baseCenter: center, baseSpan: span };
  }, [steps, root, plotData]);

  const {
    setZoom,
    setPanOffset,
    setPanOffsetY,
    panOffsetY,
    isDragging,
    containerRef,
    currentMinX,
    currentMaxX,
    dragProps,
  } = usePlotInteractivity({
    baseSpan,
    baseCenter,
    minZoom: 0.05,
    maxZoom: 40,
  });

  React.useEffect(() => {
    setCurrentStepIndex(0);
    setZoom(1);
    setPanOffset(0);
    setPanOffsetY(0);
  }, [plotData, setZoom, setPanOffset, setPanOffsetY]);

  const activeStep = steps[currentStepIndex];

  const evaluator = useMemo(() => {
    return expression ? compileMathExpression(expression) : null;
  }, [expression]);

  const { points: chartData, yMin: rawYMin, yMax: rawYMax } = useMemo(() => {
    return sampleContinuousDomain({
      minX: currentMinX,
      maxX: currentMaxX,
      pointsCount: 200,
      evaluator,
      fallbackX: plotData?.curve_x,
      fallbackY: plotData?.curve_y,
      isFixedPoint: true,
    });
  }, [currentMinX, currentMaxX, evaluator, plotData]);

  const yMin = rawYMin + panOffsetY;
  const yMax = rawYMax + panOffsetY;

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

      {/* Plot container with drag-to-pan and mouse-wheel zoom */}
      <div
        ref={containerRef}
        {...dragProps}
        className={`relative w-full h-[340px] sm:h-[420px] select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 15, right: 25, left: -10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#E2E8F0" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[Number(currentMinX.toFixed(2)), Number(currentMaxX.toFixed(2))]}
              allowDataOverflow={true}
              tick={{ fill: '#64748B', fontSize: 11 }}
              axisLine={{ stroke: '#94A3B8' }}
              tickLine={true}
              minTickGap={45}
              tickFormatter={(val) => Number(val).toFixed(1)}
            />
            <YAxis
              domain={[yMin, yMax]}
              allowDataOverflow={true}
              tick={{ fill: '#64748B', fontSize: 11 }}
              axisLine={{ stroke: '#94A3B8' }}
              tickLine={true}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                fontSize: '11px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
            />

            {/* Principal Cartesian Axes (GeoGebra Style X and Y intersecting at origin) */}
            <ReferenceLine
              y={0}
              stroke="#475569"
              strokeWidth={2}
              label={{ value: 'X', position: 'right', fill: '#475569', fontSize: 12, fontWeight: 'bold' }}
            />
            <ReferenceLine
              x={0}
              stroke="#475569"
              strokeWidth={2}
              label={{ value: 'Y', position: 'top', fill: '#475569', fontSize: 12, fontWeight: 'bold' }}
            />

            {/* Step Projections */}
            {activeStep && (
              <>
                <ReferenceLine
                  x={activeStep.xn}
                  stroke="#3B82F6"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  label={{ value: `x${currentStepIndex}`, position: 'bottom', fill: '#3B82F6', fontSize: 11, fontWeight: 'bold' }}
                />
                <ReferenceLine
                  y={activeStep.gxn}
                  stroke="#9333EA"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  label={{ value: `g(x${currentStepIndex})`, position: 'left', fill: '#9333EA', fontSize: 11, fontWeight: 'bold' }}
                />
              </>
            )}

            {/* Root Reference if known */}
            {root !== null && Number.isFinite(root) && (
              <ReferenceLine
                x={root}
                stroke="#10B981"
                strokeDasharray="4 2"
                strokeWidth={1.6}
                label={{ value: 'Raíz', position: 'insideTopLeft', fill: '#059669', fontSize: 11, fontWeight: 'bold' }}
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
      </div>
    </div>
  );
};

export default FixedPointInteractivePlot;
