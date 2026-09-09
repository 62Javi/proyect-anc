import React, { useState, useEffect } from 'react';
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
  Plus,
  Trash2,
  FileSpreadsheet,
  AlertCircle,
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
  const [modelType, setModelType] = useState<RegressionModelType>(initialConfig?.modelType || 'linear');
  const [degree, setDegree] = useState<number>(initialConfig?.degree || 2);
  const [points, setPoints] = useState<RegressionDataPoint[]>(
    initialConfig?.points || [
      { x: 1, y: 0.5 },
      { x: 2, y: 1.7 },
      { x: 3, y: 3.4 },
      { x: 4, y: 5.7 },
      { x: 5, y: 8.4 },
    ]
  );

  const [pasteText, setPasteText] = useState<string>('');
  const [showPasteBox, setShowPasteBox] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FitResponse | null>(null);

  useEffect(() => {
    if (initialConfig) {
      setModelType(initialConfig.modelType);
      if (initialConfig.degree) setDegree(initialConfig.degree);
      if (initialConfig.points) setPoints(initialConfig.points);
    }
  }, [initialConfig]);

  const handlePointChange = (index: number, field: 'x' | 'y', val: string) => {
    const num = parseFloat(val);
    const next = [...points];
    next[index] = { ...next[index], [field]: isNaN(num) ? 0 : num };
    setPoints(next);
  };

  const handleAddPoint = () => {
    const lastX = points.length > 0 ? points[points.length - 1].x : 0;
    setPoints([...points, { x: lastX + 1, y: 0 }]);
  };

  const handleRemovePoint = (index: number) => {
    if (points.length <= 2) return;
    setPoints(points.filter((_, i) => i !== index));
  };

  const handleParsePaste = () => {
    if (!pasteText.trim()) return;
    const lines = pasteText.trim().split('\n');
    const parsed: RegressionDataPoint[] = [];

    for (const line of lines) {
      // Split by tab, comma, semicolon, or space
      const parts = line.trim().split(/[\t,; ]+/).filter(Boolean);
      if (parts.length >= 2) {
        const x = parseFloat(parts[0].replace(',', '.'));
        const y = parseFloat(parts[1].replace(',', '.'));
        if (!isNaN(x) && !isNaN(y)) {
          parsed.push({ x, y });
        }
      }
    }

    if (parsed.length >= 2) {
      setPoints(parsed);
      setShowPasteBox(false);
      setPasteText('');
      setError(null);
    } else {
      setError('Formato no reconocido. Pega al menos dos filas con columnas X e Y.');
    }
  };

  const handleCalculate = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fitRegression({
        model_type: modelType,
        degree: modelType === 'polynomial' ? degree : undefined,
        points,
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

          <button
            onClick={() => setShowPasteBox(!showPasteBox)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all self-start sm:self-auto cursor-pointer"
          >
            <FileSpreadsheet size={16} />
            <span>{showPasteBox ? 'Cerrar Pegar Tabla' : 'Pegar desde Excel / CSV'}</span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 block">Ejercicios precargados del apunte:</span>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setModelType(p.model);
                  setDegree(p.degree);
                  setPoints(p.points);
                }}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 transition-all cursor-pointer"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Excel Paste Modal/Area */}
        {showPasteBox && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Pega tus datos directamente aquí (columnas X e Y separadas por tabulador o espacio):
              </label>
              <span className="text-[10px] text-slate-400">Ejemplo: 1 [TAB] 2.5</span>
            </div>
            <textarea
              rows={4}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="1   0.5&#10;2   1.7&#10;3   3.4&#10;4   5.7&#10;5   8.4"
              className="w-full p-3 text-xs font-mono bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPasteBox(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleParsePaste}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
              >
                Importar Puntos
              </button>
            </div>
          </div>
        )}

        {/* Model Selection Tabs */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 block">Tipo de Regresión / Modelo:</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'linear', label: 'Lineal', formula: 'y = a1 + a2·x' },
              { id: 'polynomial', label: 'Polinómico', formula: 'y = a1 + a2·x + ...' },
              { id: 'exponential', label: 'Exponencial', formula: 'y = a·e^(bx)' },
              { id: 'power', label: 'Potencial', formula: 'y = a·x^b' },
              { id: 'saturation', label: 'Cociente', formula: 'y = a·x/(b+x)' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setModelType(m.id as RegressionModelType)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  modelType === m.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <span className="text-xs font-bold">{m.label}</span>
                <span className={`text-[10px] font-mono mt-1 ${modelType === m.id ? 'text-slate-300' : 'text-slate-400'}`}>
                  {m.formula}
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

        {/* Data Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">
              Tabla de Observaciones ({points.length} puntos):
            </label>
            <button
              onClick={handleAddPoint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Agregar Punto</span>
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-2xl p-2 bg-slate-50/50">
            <div className="grid grid-cols-12 gap-2 px-3 py-1.5 text-[10px] font-black uppercase text-slate-400">
              <span className="col-span-1">#</span>
              <span className="col-span-5">Variable X</span>
              <span className="col-span-5">Variable Y</span>
              <span className="col-span-1 text-center">Acción</span>
            </div>

            <div className="space-y-1.5">
              {points.map((p, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded-xl border border-slate-200/70">
                  <span className="col-span-1 text-xs font-bold text-slate-400">{idx + 1}</span>
                  <div className="col-span-5">
                    <input
                      type="number"
                      step="any"
                      value={p.x}
                      onChange={(e) => handlePointChange(idx, 'x', e.target.value)}
                      className="w-full px-2.5 py-1 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                  <div className="col-span-5">
                    <input
                      type="number"
                      step="any"
                      value={p.y}
                      onChange={(e) => handlePointChange(idx, 'y', e.target.value)}
                      className="w-full px-2.5 py-1 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      onClick={() => handleRemovePoint(idx)}
                      disabled={points.length <= 2}
                      className="text-slate-400 hover:text-rose-600 disabled:opacity-30 transition-colors cursor-pointer p-1"
                      title="Eliminar punto"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
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
