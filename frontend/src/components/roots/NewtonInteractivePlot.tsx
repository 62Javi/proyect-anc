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
import usePlotInteractivity from './usePlotInteractivity';
import { compileMathExpression, sampleContinuousDomain } from '../../utils/mathEvaluator';

interface NewtonInteractivePlotProps {
  plotData: NewtonPlotData;
  root: number | null;
  expression?: string;
}

export const NewtonInteractivePlot: React.FC<NewtonInteractivePlotProps> = ({
  plotData,
  root,
  expression,
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

  // Focus initial view nicely around the iterations
  const { baseCenter, baseSpan } = useMemo(() => {
    if (!plotData || !plotData.tangents || plotData.tangents.length === 0) {
      const xs = plotData?.curve_x || [-5, 5];
      const min = xs[0] ?? -5;
      const max = xs[xs.length - 1] ?? 5;
      return { baseCenter: (min + max) / 2, baseSpan: Math.max(2, max - min) };
    }
    const xPoints = plotData.tangents.flatMap((t) => [
      t.x_point,
      ...(t.x_intercept !== null && Number.isFinite(t.x_intercept) ? [t.x_intercept] : []),
    ]);
    if (plotData.roots_x) xPoints.push(...plotData.roots_x);
    const minX = Math.min(...xPoints);
    const maxX = Math.max(...xPoints);
    const center = (minX + maxX) / 2;
    const span = Math.max(4, (maxX - minX) * 1.6);
    return { baseCenter: center, baseSpan: span };
  }, [plotData]);

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

  const activeTangent = plotData?.tangents?.[currentStepIndex];
  const prevTangent = currentStepIndex > 0 ? plotData?.tangents?.[currentStepIndex - 1] : null;

  // Compile mathematical expression for infinite continuous rendering
  const evaluator = useMemo(() => {
    return expression ? compileMathExpression(expression) : null;
  }, [expression]);

  // Generate continuous chart dataset across [currentMinX, currentMaxX] like GeoGebra
  const { points: chartData, yMin: rawYMin, yMax: rawYMax } = useMemo(() => {
    return sampleContinuousDomain({
      minX: currentMinX,
      maxX: currentMaxX,
      pointsCount: 200,
      evaluator,
      fallbackX: plotData?.curve_x,
      fallbackY: plotData?.curve_y,
      activeTangent,
      prevTangent,
    });
  }, [currentMinX, currentMaxX, evaluator, plotData, activeTangent, prevTangent]);

  const yMin = rawYMin + panOffsetY;
  const yMax = rawYMax + panOffsetY;

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
            {activeTangent && (
              <>
                <ReferenceLine
                  x={activeTangent.x_point}
                  stroke="#EF4444"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  label={{ value: `x${currentStepIndex}`, position: 'bottom', fill: '#EF4444', fontSize: 11, fontWeight: 'bold' }}
                />
                {activeTangent.x_intercept !== null && Number.isFinite(activeTangent.x_intercept) && (
                  <ReferenceLine
                    x={activeTangent.x_intercept}
                    stroke="#3B82F6"
                    strokeDasharray="3 3"
                    strokeWidth={1.5}
                    label={{ value: `x${currentStepIndex + 1}`, position: 'bottom', fill: '#3B82F6', fontSize: 11, fontWeight: 'bold' }}
                  />
                )}
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
