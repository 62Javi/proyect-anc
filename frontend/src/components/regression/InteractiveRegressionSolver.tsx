import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Scatter,
  ScatterChart,
} from 'recharts';
import {
  Calculator,
  Play,
  FileSpreadsheet,
  AlertCircle,
  AlertTriangle,
  Eye,
  Thermometer,
} from 'lucide-react';
import { fitRegression, type FitResponse, type RegressionDataPoint } from '../../services/api';
import InlineMath from '../InlineMath';
import DynamicRegressionStepByStep from './DynamicRegressionStepByStep';
import RegressionInteractivePlot from './RegressionInteractivePlot';
import { CASE1_PRESETS, type Case1Preset } from '../../data/case1Datasets';
import type { RegressionModelType, RegressionSolverConfig } from '../../types/regression';

interface InteractiveRegressionSolverProps {
  initialConfig?: RegressionSolverConfig;
}

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

  const [pasteX, setPasteX] = useState<string>(
    (initialConfig?.points || defaultPoints).map((p) => p.x).join(', ')
  );
  const [pasteY, setPasteY] = useState<string>(
    (initialConfig?.points || defaultPoints).map((p) => p.y).join(', ')
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FitResponse | null>(null);

  const previewPoints = useMemo(() => {
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
  }, [pasteX, pasteY]);

  useEffect(() => {
    if (initialConfig) {
      if (initialConfig.modelType === 'newton_cooling') {
        setModelType('exponential');
      } else {
        setModelType(initialConfig.modelType);
      }
      if (initialConfig.degree) setDegree(initialConfig.degree);
      if (initialConfig.points && initialConfig.points.length > 0) {
        setPoints(initialConfig.points);
        setPasteX(initialConfig.points.map((pt) => pt.x).join(', '));
        setPasteY(initialConfig.points.map((pt) => pt.y).join(', '));
      }
      setResult(null);
      setError(null);
    }
  }, [initialConfig]);

  const handleCalculateWithPoints = async (
    activePoints: RegressionDataPoint[],
    mType: RegressionModelType = modelType,
    deg: number = degree
  ) => {
    try {
      setLoading(true);
      setError(null);
      if (activePoints.length < 2) {
        throw new Error('Se requieren al menos 2 observaciones válidas para calcular la regresión.');
      }
      const res = await fitRegression({
        model_type: mType,
        degree: mType === 'polynomial' ? deg : undefined,
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

  const handleSelectCase1Preset = (c: Case1Preset) => {
    setPoints(c.points);
    setPasteX(c.points.map((pt) => pt.x).join(', '));
    setPasteY(c.points.map((pt) => pt.y).join(', '));
    setError(null);
    setResult(null);
  };

  const handleCalculate = () => {
    const activePoints = previewPoints.isValid ? previewPoints.matched : points;
    if (previewPoints.isValid) {
      setPoints(previewPoints.matched);
    }
    handleCalculateWithPoints(activePoints, modelType, degree);
  };

  return (
    <div className="space-y-6 sm:space-y-8 w-full min-w-0 max-w-full">
      {/* Configuration Card */}
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-6 min-w-0 max-w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-md shadow-slate-200 shrink-0">
              <Calculator size={22} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                Ajuste por Mínimos Cuadrados
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                Calculadora & Laboratorio de Regresión
              </h2>
            </div>
          </div>
        </div>

        {/* Caso 1 Quick Load: 4 Recipientes (61 puntos c/u) */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Thermometer size={15} className="text-blue-600" />
              <span>Precarga Rápida Caso 1 (Enfriamiento · 61 puntos c/u):</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              1-clic para precargar los valores de cada vaso particular
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {CASE1_PRESETS.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelectCase1Preset(c)}
                className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-slate-300 rounded-2xl text-left transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
              >
                <div className="min-w-0">
                  <span className="block truncate font-bold text-xs text-slate-800 group-hover:text-slate-950">
                    {c.shortName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                    61 puntos (0 a 120m)
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Model Selection Tabs */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 block">Tipo de Regresión / Modelo:</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 min-w-0">
            {[
              { id: 'linear', label: 'Lineal', latex: 'y = a_1 + a_2 x' },
              { id: 'polynomial', label: 'Polinómico', latex: 'y = a_1 + a_2 x + \\dots' },
              { id: 'exponential', label: 'Exponencial', latex: 'y = a \\cdot e^{b x}' },
              { id: 'power', label: 'Potencial', latex: 'y = a \\cdot x^b' },
              { id: 'saturation', label: 'Cociente', latex: 'y = \\frac{a \\cdot x}{b + x}' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setModelType(m.id as RegressionModelType);
                  if (result !== null) setResult(null);
                }}
                className={`p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[76px] last:col-span-2 sm:last:col-span-1 min-w-0 overflow-hidden select-none ${
                  modelType === m.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-slate-900/10'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <span className="text-xs font-black tracking-tight">{m.label}</span>
                <div
                  className={`mt-1.5 flex items-center text-[11px] sm:text-xs pointer-events-none overflow-hidden select-none ${
                    modelType === m.id ? 'text-slate-100' : 'text-slate-600'
                  }`}
                >
                  <InlineMath math={m.latex} />
                </div>
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
                    onClick={() => {
                      setDegree(deg);
                      if (result !== null) setResult(null);
                    }}
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
        <div className="p-4 sm:p-6 bg-slate-50/80 rounded-2xl sm:rounded-3xl border border-slate-200 space-y-4 shadow-2xs min-w-0 max-w-full overflow-hidden">
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

          </div>

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
                onChange={(e) => {
                  setPasteX(e.target.value);
                  if (result !== null) setResult(null);
                }}
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
                onChange={(e) => {
                  setPasteY(e.target.value);
                  if (result !== null) setResult(null);
                }}
                placeholder="0.5, 1.7, 3.4, 5.7, 8.4"
                className="w-full p-3 text-xs font-mono font-medium bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-2xs leading-relaxed"
              />
            </div>
          </div>

          {/* PREVISUALIZACIÓN: DIAGRAMA DE DISPERSIÓN EN VIVO */}
          {!result && (
            <div className="p-3.5 sm:p-5 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 space-y-3 shadow-2xs min-w-0 max-w-full overflow-hidden">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Eye size={15} className="text-slate-500" />
                  <span>Nube de Puntos Experimental en Vivo:</span>
                </div>

                {!previewPoints.isValid && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    <AlertTriangle size={13} />
                    {previewPoints.countX !== previewPoints.countY
                      ? `Disparidad: X (${previewPoints.countX}) ≠ Y (${previewPoints.countY}). Deben coincidir en cantidad.`
                      : 'Ingresa al menos 2 pares válidos'}
                  </span>
                )}
              </div>

              {/* Live Scatter Chart */}
              {previewPoints.matched.length > 0 ? (
                <div className="h-44 sm:h-52 w-full pt-1 min-w-0 max-w-full overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis
                        type="number"
                        dataKey="x"
                        name="X"
                        stroke="#94a3b8"
                        fontSize={11}
                        tickLine={false}
                        domain={['auto', 'auto']}
                        tickFormatter={(val) =>
                          Math.abs(val) >= 1e6
                            ? `${(val / 1e6).toFixed(1)}M`
                            : Math.abs(val) >= 1e4
                            ? `${(val / 1e3).toFixed(0)}k`
                            : String(val)
                        }
                      />
                      <YAxis
                        type="number"
                        dataKey="y"
                        name="Y"
                        stroke="#94a3b8"
                        fontSize={11}
                        tickLine={false}
                        domain={['auto', 'auto']}
                      />
                      <Tooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          fontSize: '11px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                        formatter={(val: any, name: any) => [
                          val != null && !isNaN(Number(val)) ? Number(val).toLocaleString() : '-',
                          name === 'y' ? 'Dato Experimental Y' : name === 'x' ? 'Dato Experimental X' : name,
                        ]}
                      />
                      <Scatter name="Datos" data={previewPoints.matched} fill="#0f172a" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-xs text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  Ingresa valores de X e Y para previsualizar la nube de puntos en vivo
                </div>
              )}
            </div>
          )}
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
        <div className="space-y-6 sm:space-y-8 w-full min-w-0 max-w-full">
          {/* Main GeoGebra-Style Interactive Plot (Zoom, Pan, Edge-to-Edge Continuous Curve) */}
          <RegressionInteractivePlot
            result={result}
            modelType={modelType}
            points={points}
          />

          {/* Chart 2: Residuals Plot */}
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-4 min-w-0 max-w-full overflow-hidden">
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

            <div className="h-44 w-full pt-2 min-w-0 max-w-full overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.residuals} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    type="number"
                    dataKey="x"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    domain={['auto', 'auto']}
                    tickFormatter={(val) =>
                      Math.abs(val) >= 1e6
                        ? `${(val / 1e6).toFixed(1)}M`
                        : Math.abs(val) >= 1e4
                        ? `${(val / 1e3).toFixed(0)}k`
                        : String(val)
                    }
                  />
                  <YAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [
                      val != null && !isNaN(Number(val)) ? `${Number(val).toFixed(4)}` : '-',
                      'Residuo',
                    ]}
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

          {/* Mathematical Step-by-Step Resolution (Exact layout from Apunte / screenshot) */}
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-4 min-w-0 max-w-full overflow-hidden">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Desarrollo Matemático Paso a Paso
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Resolución Analítica por Ecuaciones Normales y Regla de Cramer
              </h3>
              <p className="text-xs text-slate-500">
                Cálculo explícito de las sumatorias del sistema, sustitución en la matriz de Gauss, resolución por determinantes y desglose de varianza (ST, SR, r²).
              </p>
            </div>

            <DynamicRegressionStepByStep
              modelType={modelType}
              degree={degree}
              points={points}
              result={result}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveRegressionSolver;
