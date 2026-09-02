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
  RotateCcw,
  ArrowRight,
  HelpCircle,
  Sliders,
} from 'lucide-react';
import InlineMath from '../InlineMath';

interface PresetFunction {
  id: string;
  name: string;
  latex: string;
  derivativeLatex: string;
  f: (x: number) => number;
  df: (x: number) => number;
  minX: number;
  maxX: number;
  step: number;
  defaultX0: number;
  root: number;
}

const PRESET_FUNCTIONS: PresetFunction[] = [
  {
    id: 'f_poly',
    name: 'x² - 4x - 45',
    latex: 'f(x) = x^2 - 4x - 45',
    derivativeLatex: "f'(x) = 2x - 4",
    f: (x) => x * x - 4 * x - 45,
    df: (x) => 2 * x - 4,
    minX: 3.0,
    maxX: 12.0,
    step: 0.05,
    defaultX0: 4.5,
    root: 9.0,
  },
  {
    id: 'f_sin',
    name: 'x - 0.8 - 0.2·sen(x)',
    latex: 'f(x) = x - 0.8 - 0.2\\sin(x)',
    derivativeLatex: "f'(x) = 1 - 0.2\\cos(x)",
    f: (x) => x - 0.8 - 0.2 * Math.sin(x),
    df: (x) => 1 - 0.2 * Math.cos(x),
    minX: 0.0,
    maxX: 2.2,
    step: 0.01,
    defaultX0: 0.4,
    root: 0.9643339,
  },
  {
    id: 'f_cos',
    name: 'x - cos(x)',
    latex: 'f(x) = x - \\cos(x)',
    derivativeLatex: "f'(x) = 1 + \\sin(x)",
    f: (x) => x - Math.cos(x),
    df: (x) => 1 + Math.sin(x),
    minX: -0.5,
    maxX: 2.2,
    step: 0.01,
    defaultX0: 1.8,
    root: 0.739085,
  },
  {
    id: 'f_exp',
    name: '70e⁻¹·⁵ˣ + 25e⁻⁰·⁰⁷⁵ˣ - 9',
    latex: 'f(x) = 70 e^{-1.5x} + 25 e^{-0.075x} - 9',
    derivativeLatex: "f'(x) = -105 e^{-1.5x} - 1.875 e^{-0.075x}",
    f: (x) => 70 * Math.exp(-1.5 * x) + 25 * Math.exp(-0.075 * x) - 9,
    df: (x) => -105 * Math.exp(-1.5 * x) - 1.875 * Math.exp(-0.075 * x),
    minX: 0.0,
    maxX: 16.0,
    step: 0.1,
    defaultX0: 1.0,
    root: 13.6293,
  },
];

interface TangentSnapshot {
  xn: number;
  fxn: number;
  dfxn: number;
  nextXn: number;
  iteration: number;
}

export const NewtonGeometricDemo: React.FC = () => {
  const [selectedFuncId, setSelectedFuncId] = useState<string>('f_poly');
  const activeFunc = useMemo(
    () => PRESET_FUNCTIONS.find((p) => p.id === selectedFuncId) || PRESET_FUNCTIONS[0],
    [selectedFuncId]
  );

  const [currentXn, setCurrentXn] = useState<number>(activeFunc.defaultX0);
  const [iteration, setIteration] = useState<number>(0);
  const [prevTangent, setPrevTangent] = useState<TangentSnapshot | null>(null);

  // Reset when function changes
  const handleSelectFunction = (funcId: string) => {
    const fn = PRESET_FUNCTIONS.find((p) => p.id === funcId) || PRESET_FUNCTIONS[0];
    setSelectedFuncId(funcId);
    setCurrentXn(fn.defaultX0);
    setIteration(0);
    setPrevTangent(null);
  };

  // Mathematical evaluation at currentXn
  const fxn = activeFunc.f(currentXn);
  const dfxn = activeFunc.df(currentXn);
  const isDerivativeZero = Math.abs(dfxn) < 1e-9;

  // Next step x_{n+1} = x_n - f(x_n)/f'(x_n)
  const nextXn = !isDerivativeZero ? currentXn - fxn / dfxn : null;
  const absError = nextXn !== null ? Math.abs(nextXn - currentXn) : null;

  // Handle next iteration button (preserves previous iteration for color comparison)
  const handleNextIteration = () => {
    if (nextXn !== null && Number.isFinite(nextXn)) {
      setPrevTangent({
        xn: currentXn,
        fxn,
        dfxn,
        nextXn,
        iteration,
      });

      const clampedNext = Math.max(activeFunc.minX - 0.5, Math.min(activeFunc.maxX + 0.5, nextXn));
      setCurrentXn(Number(clampedNext.toFixed(4)));
      setIteration((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentXn(activeFunc.defaultX0);
    setIteration(0);
    setPrevTangent(null);
  };

  // Generate chart points dynamically
  const { chartData, yMin, yMax } = useMemo(() => {
    const points: Array<{
      x: number;
      f_x: number;
      currentTangent?: number;
      prevTangent?: number;
    }> = [];

    const minX = activeFunc.minX;
    const maxX = activeFunc.maxX;
    const span = maxX - minX;
    const numPoints = 140;
    const dx = span / (numPoints - 1);

    let rawMinY = Infinity;
    let rawMaxY = -Infinity;

    for (let i = 0; i < numPoints; i++) {
      const x = minX + i * dx;
      const y = activeFunc.f(x);
      if (Number.isFinite(y)) {
        if (y < rawMinY) rawMinY = y;
        if (y > rawMaxY) rawMaxY = y;
      }
    }

    if (!Number.isFinite(rawMinY)) rawMinY = -5;
    if (!Number.isFinite(rawMaxY)) rawMaxY = 5;

    if (rawMinY > 0) rawMinY = 0;
    if (rawMaxY < 0) rawMaxY = 0;

    const ySpan = rawMaxY - rawMinY || 4;
    const computedYMin = Math.floor(rawMinY - ySpan * 0.25);
    const computedYMax = Math.ceil(rawMaxY + ySpan * 0.25);

    for (let i = 0; i < numPoints; i++) {
      const x = minX + i * dx;
      const yCurve = activeFunc.f(x);

      let curTan: number | undefined = undefined;
      if (!isDerivativeZero) {
        const tVal = fxn + dfxn * (x - currentXn);
        if (tVal >= computedYMin * 1.6 && tVal <= computedYMax * 1.6) {
          curTan = Number(tVal.toFixed(4));
        }
      }

      let prevTan: number | undefined = undefined;
      if (prevTangent && Math.abs(prevTangent.dfxn) > 1e-9) {
        const ptVal = prevTangent.fxn + prevTangent.dfxn * (x - prevTangent.xn);
        if (ptVal >= computedYMin * 1.6 && ptVal <= computedYMax * 1.6) {
          prevTan = Number(ptVal.toFixed(4));
        }
      }

      points.push({
        x: Number(x.toFixed(3)),
        f_x: Number(yCurve.toFixed(4)),
        currentTangent: curTan,
        prevTangent: prevTan,
      });
    }

    return {
      chartData: points,
      yMin: computedYMin,
      yMax: computedYMax,
    };
  }, [activeFunc, currentXn, fxn, dfxn, isDerivativeZero, prevTangent]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-7 shadow-sm space-y-6">
      {/* Header and Function Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              Simulador Gráfico Interactivo
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900">
            Deducción Geométrica: Rectas Tangentes & Comparativa
          </h3>
          <p className="text-xs text-slate-500">
            Compara la recta tangente actual (roja) con la anterior (azul) y avanza paso a paso.
          </p>
        </div>

        {/* Function selection tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
          {PRESET_FUNCTIONS.map((fn) => (
            <button
              key={fn.id}
              onClick={() => handleSelectFunction(fn.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedFuncId === fn.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {fn.name}
            </button>
          ))}
        </div>
      </div>

      {/* Math Banner & Formula */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">
              Tangente Activa L_{iteration}(x)
            </span>
          </div>
          <div className="font-mono text-sm sm:text-base font-bold text-amber-300">
            L_{iteration}(x) = {fxn.toFixed(3)} + ({dfxn.toFixed(3)}) · (x - {currentXn.toFixed(3)})
          </div>
          {prevTangent && (
            <div className="text-xs font-mono text-blue-300 flex items-center gap-1.5 pt-0.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>
                Iteración anterior L_{prevTangent.iteration}(x) en x = {prevTangent.xn.toFixed(3)} (Corte fue {prevTangent.nextXn.toFixed(3)})
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700 text-center">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Iteración</span>
            <span className="font-mono text-sm sm:text-base font-black text-white">n = {iteration}</span>
          </div>

          <div className="bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700 text-center">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Próximo xₙ₊₁</span>
            <span className="font-mono text-sm sm:text-base font-black text-emerald-400">
              {nextXn !== null ? nextXn.toFixed(4) : 'Indet.'}
            </span>
          </div>
        </div>
      </div>

      {/* Chart container */}
      <div className="w-full h-[330px] sm:h-[410px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="x"
              domain={[activeFunc.minX, activeFunc.maxX]}
              allowDataOverflow={true}
              tick={{ fill: '#64748B', fontSize: 11 }}
              axisLine={{ stroke: '#CBD5E1' }}
              tickLine={false}
              minTickGap={40}
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
              strokeWidth={2.6}
              dot={false}
              isAnimationActive={false}
            />

            {/* Previous Tangent Line (Blue dashed) */}
            {prevTangent && (
              <Line
                type="linear"
                dataKey="prevTangent"
                name={`Tangente Anterior L_${prevTangent.iteration}(x)`}
                stroke="#3B82F6"
                strokeWidth={2.2}
                dot={false}
                strokeDasharray="4 4"
                isAnimationActive={false}
              />
            )}

            {/* Current Tangent line (Red vibrant) */}
            <Line
              type="linear"
              dataKey="currentTangent"
              name={`Tangente Actual L_${iteration}(x)`}
              stroke="#EF4444"
              strokeWidth={2.5}
              dot={false}
              strokeDasharray="3 2"
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-bold text-slate-700 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1 bg-slate-900 rounded-full" />
          <span>Curva f(x)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1 bg-rose-500 rounded-full border-b border-dashed" />
          <span>Tangente Actual Lₙ(x) (Rojo)</span>
        </div>
        {prevTangent && (
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 bg-blue-500 rounded-full border-b border-dashed" />
            <span>Tangente Anterior Lₙ₋₁(x) (Azul)</span>
          </div>
        )}
      </div>

      {/* Interactive Controls (Slider + Next Step Button) */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-slate-700" />
            <label className="text-xs font-black uppercase tracking-wider text-slate-800">
              Punto por donde pasa <InlineMath math="x_n" />:{' '}
              <span className="text-sm font-mono text-indigo-600 font-bold ml-1">
                {currentXn.toFixed(3)}
              </span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNextIteration}
              disabled={nextXn === null || isDerivativeZero}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
              title="Avanzar a x_{n+1}"
            >
              <span>Próxima Iteración (xₙ₊₁)</span>
              <ArrowRight size={15} />
            </button>

            <button
              onClick={handleReset}
              className="p-2.5 bg-white hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold transition-colors cursor-pointer"
              title="Reiniciar punto inicial"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Range Slider for xn */}
        <div className="space-y-1">
          <input
            type="range"
            min={activeFunc.minX}
            max={activeFunc.maxX}
            step={activeFunc.step}
            value={currentXn}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setCurrentXn(val);
            }}
            className="w-full accent-slate-900 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-bold text-slate-400 font-mono">
            <span>{activeFunc.minX}</span>
            <span>Arrastra el slider para mover el punto de tangencia</span>
            <span>{activeFunc.maxX}</span>
          </div>
        </div>
      </div>

      {/* Real-time Math Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Punto actual xₙ</span>
          <span className="text-sm font-black font-mono text-slate-900">{currentXn.toFixed(4)}</span>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Altura f(xₙ)</span>
          <span className="text-sm font-black font-mono text-slate-900">{fxn.toFixed(4)}</span>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pendiente f'(xₙ)</span>
          <span className="text-sm font-black font-mono text-slate-900">
            {isDerivativeZero ? '0 (Falla)' : dfxn.toFixed(4)}
          </span>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Corte xₙ₊₁</span>
          <span className="text-sm font-black font-mono text-emerald-800">
            {nextXn !== null ? nextXn.toFixed(4) : 'Indeterminado'}
          </span>
        </div>
      </div>

      {/* Step Explanation Banner */}
      <div className="bg-slate-100/80 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 flex items-start gap-3">
        <HelpCircle size={18} className="text-slate-900 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <strong className="text-slate-900 font-bold">
            Procedimiento en la Iteración {iteration}:
          </strong>
          <p>
            1. <strong>Tangente Actual (Roja):</strong> Evaluamos <InlineMath math={`f(x_${iteration}) = ${fxn.toFixed(3)}`} /> y trazamos <InlineMath math={`L_${iteration}(x)`} /> con pendiente <InlineMath math={`f'(x_${iteration}) = ${dfxn.toFixed(3)}`} />.
          </p>
          <p>
            2. <strong>Corte en eje horizontal:</strong> La tangente roja corta al eje <InlineMath math="y=0" /> en <InlineMath math={`x_${iteration + 1} = ${nextXn !== null ? nextXn.toFixed(4) : '...'}`} />.
          </p>
          {prevTangent && (
            <p className="text-blue-700 font-medium">
              3. <strong>Comparación visual:</strong> Observa la tangente anterior (línea azul) en <InlineMath math={`x_${prevTangent.iteration} = ${prevTangent.xn.toFixed(3)}`} /> respecto a la nueva tangente roja. ¡Cada iteración aproxima más la recta tangente al comportamiento de la raíz!
            </p>
          )}
          {absError !== null && (
            <p className="text-slate-900 font-bold pt-1">
              Diferencia de paso: <InlineMath math={`|x_${iteration + 1} - x_${iteration}| = ${absError.toFixed(5)}`} />
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewtonGeometricDemo;
