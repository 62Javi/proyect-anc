import React, { useState, useEffect, useMemo } from 'react';
import {
  ComposedChart,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Scatter,
} from 'recharts';
import {
  Calculator,
  Play,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Eye,
} from 'lucide-react';
import { fitRegression, type FitResponse, type RegressionDataPoint } from '../../services/api';
import InlineMath from '../InlineMath';
import type { RegressionModelType, RegressionSolverConfig } from '../../types/regression';

interface InteractiveRegressionSolverProps {
  initialConfig?: RegressionSolverConfig;
}

const PRESETS = [
  {
    id: 'tp4_ex1',
    title: 'TP4 · Ej. 1: Serie de observaciones',
    model: 'power' as RegressionModelType,
    degree: 2,
    points: [
      { x: 1, y: 0.5 },
      { x: 2, y: 1.7 },
      { x: 3, y: 3.4 },
      { x: 4, y: 5.7 },
      { x: 5, y: 8.4 },
    ],
  },
  {
    id: 'tp4_ex2',
    title: 'TP4 · Ej. 2: Censo Poblacional',
    model: 'exponential' as RegressionModelType,
    degree: 2,
    points: [
      { x: 1930, y: 123.203 },
      { x: 1940, y: 131.669 },
      { x: 1950, y: 150.697 },
      { x: 1960, y: 179.323 },
      { x: 1970, y: 203.212 },
      { x: 1980, y: 226.505 },
    ],
  },
  {
    id: 'tp4_ex3',
    title: 'TP4 · Ej. 3: Intensidad de Lluvia',
    model: 'exponential' as RegressionModelType,
    degree: 2,
    points: [
      { x: 5, y: 88.1 },
      { x: 10, y: 72.4 },
      { x: 15, y: 61.37 },
      { x: 20, y: 52.02 },
      { x: 30, y: 42.34 },
      { x: 45, y: 32.13 },
      { x: 60, y: 24.93 },
      { x: 90, y: 20.13 },
      { x: 120, y: 16.58 },
    ],
  },
  {
    id: 'tp4_ex4',
    title: 'TP4 · Ej. 4: Saturación / Cociente',
    model: 'saturation' as RegressionModelType,
    degree: 2,
    points: [
      { x: 1, y: 0.4 },
      { x: 2, y: 0.7 },
      { x: 2.5, y: 0.8 },
      { x: 4, y: 1.0 },
      { x: 6, y: 1.2 },
      { x: 8, y: 1.3 },
      { x: 8.5, y: 1.4 },
    ],
  },
  {
    id: 'tp4_ex5',
    title: 'TP4 · Ej. 5: Resistencia Cemento',
    model: 'saturation' as RegressionModelType,
    degree: 2,
    points: [
      { x: 1, y: 13.0 },
      { x: 2, y: 21.9 },
      { x: 3, y: 29.8 },
      { x: 7, y: 32.4 },
      { x: 12, y: 36.8 },
      { x: 20, y: 38.9 },
      { x: 28, y: 41.8 },
      { x: 32, y: 43.6 },
    ],
  },
];

export const InteractiveRegressionSolver: React.FC<InteractiveRegressionSolverProps> = ({ initialConfig }) => {
  const defaultPoints = useMemo(
    () => [
      { x: 1, y: 0.5 },
      { x: 2, y: 1.7 },
      { x: 3, y: 3.4 },
      { x: 4, y: 5.7 },
      { x: 5, y: 8.4 },
    ],
    []
  );

  const [modelType, setModelType] = useState<RegressionModelType>(initialConfig?.modelType || 'linear');
  const [degree, setDegree] = useState<number>(initialConfig?.degree || 2);
  const [points, setPoints] = useState<RegressionDataPoint[]>(
    initialConfig?.points || defaultPoints
  );

  const [pasteMode, setPasteMode] = useState<'separate' | 'table'>('separate');
  const [pasteX, setPasteX] = useState<string>(
    (initialConfig?.points || defaultPoints).map((p) => p.x).join(', ')
  );
  const [pasteY, setPasteY] = useState<string>(
    (initialConfig?.points || defaultPoints).map((p) => p.y).join(', ')
  );
  const [pasteText, setPasteText] = useState<string>(
    (initialConfig?.points || defaultPoints).map((p) => `${p.x}\t${p.y}`).join('\n')
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FitResponse | null>(null);

  const previewPoints = useMemo(() => {
    if (pasteMode === 'separate') {
      const xs = pasteX
        .trim()
        .split(/[\s,;]+/)
        .map((v) => parseFloat(v.replace(',', '.')))
        .filter((v) => !isNaN(v));
      const ys = pasteY
        .trim()
        .split(/[\s,;]+/)
        .map((v) => parseFloat(v.replace(',', '.')))
        .filter((v) => !isNaN(v));
      const count = Math.min(xs.length, ys.length);
      const matched: RegressionDataPoint[] = [];
      for (let i = 0; i < count; i++) {
        matched.push({ x: xs[i], y: ys[i] });
      }
      return {
        matched,
        countX: xs.length,
        countY: ys.length,
        isEqual: xs.length === ys.length && xs.length > 0,
        isValid: xs.length === ys.length && xs.length >= 2,
      };
    } else {
      const lines = pasteText.trim().split('\n');
      const matched: RegressionDataPoint[] = [];
      for (const line of lines) {
        const parts = line.trim().split(/[\t,; ]+/).filter(Boolean);
        if (parts.length >= 2) {
          const x = parseFloat(parts[0].replace(',', '.'));
          const y = parseFloat(parts[1].replace(',', '.'));
          if (!isNaN(x) && !isNaN(y)) {
            matched.push({ x, y });
          }
        }
      }
      return {
        matched,
        countX: matched.length,
        countY: matched.length,
        isEqual: matched.length >= 2,
        isValid: matched.length >= 2,
      };
    }
  }, [pasteMode, pasteX, pasteY, pasteText]);

  useEffect(() => {
    if (initialConfig) {
      setModelType(initialConfig.modelType);
      if (initialConfig.degree) setDegree(initialConfig.degree);
      if (initialConfig.points && initialConfig.points.length > 0) {
        setPoints(initialConfig.points);
        setPasteX(initialConfig.points.map((pt) => pt.x).join(', '));
        setPasteY(initialConfig.points.map((pt) => pt.y).join(', '));
        setPasteText(initialConfig.points.map((pt) => `${pt.x}\t${pt.y}`).join('\n'));
      }
    }
  }, [initialConfig]);

  const handleSelectPreset = (p: (typeof PRESETS)[0]) => {
    setModelType(p.model);
    setDegree(p.degree);
    setPoints(p.points);
    setPasteX(p.points.map((pt) => pt.x).join(', '));
    setPasteY(p.points.map((pt) => pt.y).join(', '));
    setPasteText(p.points.map((pt) => `${pt.x}\t${pt.y}`).join('\n'));
    setError(null);
  };

  const handleCalculate = async () => {
    try {
      setLoading(true);
      setError(null);
      const activePoints = previewPoints.isValid ? previewPoints.matched : points;
      if (previewPoints.isValid) {
        setPoints(previewPoints.matched);
      }
      if (activePoints.length < 2) {
        throw new Error('Se requieren al menos 2 observaciones válidas para calcular la regresión.');
      }
      const res = await fitRegression({
        model_type: modelType,
        degree: modelType === 'polynomial' ? degree : undefined,
        points: activePoints,
      });
      setResult(res);
    } catch (err: any) {
      setError(err?.message || 'Error al calcular el ajuste');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Run on mount
  useEffect(() => {
    handleCalculate();
  }, [modelType, degree]);

  // Merge points and curve for recharts
  const chartData = (() => {
    if (!result) return [];
    const mapByX: Record<number, { x: number; actual?: number; predicted?: number }> = {};

    result.points_x.forEach((px, idx) => {
      mapByX[px] = {
        x: px,
        actual: result.points_y[idx],
      };
    });

    result.curve_x.forEach((cx, idx) => {
      const rounded = Math.round(cx * 100) / 100;
      if (!mapByX[rounded]) {
        mapByX[rounded] = { x: rounded, predicted: result.curve_y[idx] };
      } else {
        mapByX[rounded].predicted = result.curve_y[idx];
      }
    });

    return Object.values(mapByX).sort((a, b) => a.x - b.x);
  })();

  return (
    <div className="space-y-8">
      {/* Configuration Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-md shadow-slate-200">
              <Calculator size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                Ajuste por Mínimos Cuadrados
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Calculadora & Laboratorio de Regresión
              </h2>
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 block">Ejercicios precargados del apunte:</span>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 transition-all cursor-pointer"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Model Selection Tabs */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 block">Tipo de Regresión / Modelo:</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'linear', label: 'Lineal', latex: 'y = a_1 + a_2 x' },
              { id: 'polynomial', label: 'Polinómico', latex: 'y = a_1 + a_2 x + \\dots' },
              { id: 'exponential', label: 'Exponencial', latex: 'y = a \\cdot e^{b x}' },
              { id: 'power', label: 'Potencial', latex: 'y = a \\cdot x^b' },
              { id: 'saturation', label: 'Cociente', latex: 'y = \\frac{a \\cdot x}{b + x}' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setModelType(m.id as RegressionModelType)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[74px] last:col-span-2 sm:last:col-span-1 ${
                  modelType === m.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <span className="text-xs font-bold leading-tight">{m.label}</span>
                <span
                  className={`text-xs mt-1.5 overflow-x-auto no-scrollbar ${
                    modelType === m.id ? 'text-slate-200' : 'text-slate-600'
                  }`}
                >
                  <InlineMath math={m.latex} />
                </span>
              </button>
            ))}
          </div>

          {modelType === 'polynomial' && (
            <div className="flex items-center gap-3 pt-2">
              <label className="text-xs font-bold text-slate-600">Grado del polinomio (k):</label>
              <div className="flex items-center gap-1">
                {[2, 3, 4, 5].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => setDegree(deg)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      degree === deg
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {deg}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Panel Principal de Entrada de Observaciones (Carga Rápida con Previsualización) */}
        <div className="p-4 sm:p-6 bg-slate-50/80 rounded-3xl border border-slate-200 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={18} className="text-slate-700" />
                <h3 className="text-sm font-black text-slate-900">
                  Entrada de Observaciones (X e Y)
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 font-medium pt-0.5">
                Ingresa o pega directamente los valores numéricos sin filas tediosas.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs self-start sm:self-auto shadow-2xs">
              <button
                type="button"
                onClick={() => setPasteMode('separate')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  pasteMode === 'separate'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                X e Y separados
              </button>
              <button
                type="button"
                onClick={() => setPasteMode('table')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  pasteMode === 'table'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Columnas (X Y)
              </button>
            </div>
          </div>

          {pasteMode === 'separate' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span>Valores de X</span>
                    <span className="text-[10px] font-mono text-slate-400 font-normal">
                      (separados por coma o espacio)
                    </span>
                  </label>
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-md">
                    {previewPoints.countX} números
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={pasteX}
                  onChange={(e) => setPasteX(e.target.value)}
                  placeholder="1, 2, 3, 4, 5"
                  className="w-full p-3 text-xs font-mono font-medium bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-2xs leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span>Valores de Y</span>
                    <span className="text-[10px] font-mono text-slate-400 font-normal">
                      (separados por coma o espacio)
                    </span>
                  </label>
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-md">
                    {previewPoints.countY} números
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={pasteY}
                  onChange={(e) => setPasteY(e.target.value)}
                  placeholder="0.5, 1.7, 3.4, 5.7, 8.4"
                  className="w-full p-3 text-xs font-mono font-medium bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-2xs leading-relaxed"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Pega columnas X e Y directamente (Excel, Sheets, CSV o TSV):
                </label>
                <span className="text-[10px] text-slate-400">Ejemplo: 1 [TAB] 0.5</span>
              </div>
              <textarea
                rows={4}
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="1   0.5&#10;2   1.7&#10;3   3.4&#10;4   5.7&#10;5   8.4"
                className="w-full p-3 text-xs font-mono font-medium bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-2xs"
              />
            </div>
          )}

          {/* PREVISUALIZACIÓN EN TIEMPO REAL */}
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Eye size={14} className="text-slate-500" />
                <span>Previsualización en tiempo real:</span>
              </div>

              {previewPoints.isValid ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 size={13} />
                  {previewPoints.matched.length} pares (X, Y) sincronizados
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  <AlertTriangle size={13} />
                  {pasteMode === 'separate' && previewPoints.countX !== previewPoints.countY
                    ? `Disparidad: X (${previewPoints.countX}) ≠ Y (${previewPoints.countY}). Deben coincidir en cantidad.`
                    : 'Ingresa al menos 2 pares válidos'}
                </span>
              )}
            </div>

            {previewPoints.matched.length > 0 && (
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-slate-100 scrollbar-thin">
                {previewPoints.matched.map((pt, pIdx) => (
                  <span
                    key={pIdx}
                    className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[11px] font-mono text-slate-800 shadow-2xs"
                  >
                    ({pt.x}, {pt.y})
                  </span>
                ))}
              </div>
            )}

            {/* Visualización tabular compacta opcional */}
            {previewPoints.matched.length > 0 && (
              <details className="text-xs text-slate-500 pt-1 group">
                <summary className="cursor-pointer font-bold text-slate-700 hover:text-slate-900 select-none flex items-center gap-1.5 w-fit">
                  <span>Ver tabla de pares ordenados ({previewPoints.matched.length} filas)</span>
                </summary>
                <div className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50 scrollbar-thin">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 font-mono text-slate-700">
                        <th className="px-3 py-1.5 font-bold w-12">#</th>
                        <th className="px-3 py-1.5 font-bold">X</th>
                        <th className="px-3 py-1.5 font-bold">Y</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono">
                      {previewPoints.matched.map((pt, idx) => (
                        <tr key={idx} className="hover:bg-slate-100/50">
                          <td className="px-3 py-1 text-slate-400">{idx + 1}</td>
                          <td className="px-3 py-1 text-slate-900 font-bold">{pt.x}</td>
                          <td className="px-3 py-1 text-slate-900 font-bold">{pt.y}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleCalculate}
          disabled={loading || !previewPoints.isValid}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Play size={16} fill="currentColor" />
          )}
          <span>Calcular Ajuste & Ecuaciones Normales</span>
        </button>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* RESULTS PRESENTATION */}
      {result && (
        <div className="space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Coeficiente de Determinación
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-emerald-600">
                  {result.metrics.r2.toFixed(5)}
                </span>
                <span className="text-xs text-slate-400 font-bold">r²</span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 block">
                {result.metrics.r2 >= 0.85 ? '✅ Ajuste Válido (> 0.85)' : '⚠️ Ajuste Débil'}
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Correlación (r)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-slate-900">
                  {result.metrics.r.toFixed(5)}
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 block">
                Asociación entre variables
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Suma Residuos (SR)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-slate-900">
                  {result.metrics.sr.toFixed(4)}
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 block">
                Error cuadrático minimizado
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Error Estándar (Sy/x)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-slate-900">
                  {result.metrics.syx.toFixed(4)}
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 block">
                Dispersión de los residuos
              </span>
            </div>
          </div>

          {/* Model Formula Banner */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Ecuación de Regresión Resultante
              </span>
              <div className="text-lg sm:text-xl font-black text-slate-900 font-mono mt-1">
                <InlineMath math={result.formula_latex} />
              </div>
            </div>
            {result.transformed_latex && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono text-slate-600">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Forma Linealizada:</span>
                <InlineMath math={result.transformed_latex} />
              </div>
            )}
          </div>

          {/* Chart 1: Scatter + Fit Curve */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Gráfico de Dispersión y Curva de Ajuste
              </h4>
              <p className="text-xs text-slate-500">
                Puntos de la tabla experimental y función calculada por mínimos cuadrados
              </p>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="x" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                    formatter={(val: any, name: any) => [
                      `${Number(val).toFixed(3)}`,
                      name === 'actual' ? 'Dato Experimental' : 'Ajuste',
                    ]}
                  />
                  <Scatter name="actual" dataKey="actual" fill="#0f172a" />
                  <Line type="monotone" dataKey="predicted" stroke="#2563eb" strokeWidth={2.5} dot={false} connectNulls />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Residuals Plot */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Gráfico de Residuos <InlineMath math="e_i = y_i - \hat{y}_i" />
                </h4>
                <p className="text-xs text-slate-500">
                  Comportamiento de los errores respecto a la línea central cero
                </p>
              </div>
            </div>

            <div className="h-44 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.residuals} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="x" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${Number(val).toFixed(4)}`, 'Residuo']}
                  />
                  <ReferenceLine y={0} stroke="#dc2626" strokeWidth={1.5} />
                  <Line
                    type="monotone"
                    dataKey="residual"
                    stroke="#0284c7"
                    strokeWidth={1.5}
                    dot={{ r: 3, fill: '#0284c7' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gauss Normal Equations LaTeX Box */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-base font-bold text-slate-900">
              Sistema de Ecuaciones Normales de Gauss Resuelto
            </h4>
            <p className="text-xs text-slate-500">
              Matriz con las sumatorias experimentales calculadas y despeje de los parámetros:
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 overflow-x-auto space-y-3">
              <div className="text-xs sm:text-sm font-semibold text-slate-900">
                <InlineMath math={result.normal_equations.matrix_latex} block />
              </div>
              <div className="h-px bg-slate-200 w-full" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-700">
                <span className="font-bold text-slate-900">Parámetros obtenidos:</span>
                <InlineMath math={result.normal_equations.solution_latex} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveRegressionSolver;
