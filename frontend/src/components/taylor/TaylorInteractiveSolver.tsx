import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Sparkles,
  Table,
  AlertCircle,
  Sigma,
} from 'lucide-react';
import { solveTaylorODE } from '../../services/api';
import type { TaylorPreset, TaylorRequest, TaylorResponse } from '../../types/taylor';
import { OFFICIAL_TAYLOR_EXERCISES } from './TaylorExercisesSection';
import TaylorStepAccordion from './TaylorStepAccordion';
import InlineMath from '../InlineMath';

interface TaylorInteractiveSolverProps {
  initialConfig?: TaylorPreset;
  onResultChange?: (res: TaylorResponse) => void;
}

export const TaylorInteractiveSolver: React.FC<TaylorInteractiveSolverProps> = ({
  initialConfig,
  onResultChange,
}) => {
  // Form State
  const [expression, setExpression] = useState<string>('2*x*y');
  const [xVar, setXVar] = useState<string>('x');
  const [yVar, setYVar] = useState<string>('y');
  const [x0, setX0] = useState<string>('1');
  const [y0, setY0] = useState<string>('1');
  const [xf, setXf] = useState<string>('1.3');
  const [h, setH] = useState<string>('0.1');
  const [order, setOrder] = useState<number>(2);

  // Results State
  const [result, setResult] = useState<TaylorResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync initialConfig when provided
  useEffect(() => {
    if (initialConfig) {
      setExpression(initialConfig.expression);
      setXVar(initialConfig.x_var);
      setYVar(initialConfig.y_var);
      setX0(String(initialConfig.x0));
      setY0(String(initialConfig.y0));
      setXf(String(initialConfig.xf));
      setH(String(initialConfig.h));
      setOrder(initialConfig.order);
      // Execute automatically
      handleSolveWithParams({
        expression: initialConfig.expression,
        x_var: initialConfig.x_var,
        y_var: initialConfig.y_var,
        x0: initialConfig.x0,
        y0: initialConfig.y0,
        xf: initialConfig.xf,
        h: initialConfig.h,
        order: initialConfig.order,
      });
    }
  }, [initialConfig]);

  // Initial solve on mount with default Amiconi Exercise 1
  useEffect(() => {
    if (!initialConfig && !result) {
      handleSolve();
    }
  }, []);

  const handleSolveWithParams = async (params: TaylorRequest) => {
    setLoading(true);
    setError(null);
    try {
      const data = await solveTaylorODE(params);
      setResult(data);
      onResultChange?.(data);
    } catch (err: any) {
      setError(err?.message || 'Error al procesar la ecuación con el método de Taylor.');
    } finally {
      setLoading(false);
    }
  };

  const handleSolve = () => {
    const numX0 = parseFloat(x0);
    const numY0 = parseFloat(y0);
    const numXf = parseFloat(xf);
    const numH = parseFloat(h);

    if (isNaN(numX0) || isNaN(numY0) || isNaN(numXf) || isNaN(numH)) {
      setError('Por favor ingresa valores numéricos válidos para x₀, y₀, xf y el paso h.');
      return;
    }

    if (numXf <= numX0) {
      setError('El punto final xf debe ser estrictamente mayor que el punto inicial x₀.');
      return;
    }

    if (numH <= 0) {
      setError('El paso de integración h debe ser mayor que cero.');
      return;
    }

    handleSolveWithParams({
      expression,
      x_var: xVar,
      y_var: yVar,
      x0: numX0,
      y0: numY0,
      xf: numXf,
      h: numH,
      order,
    });
  };

  const handleSelectPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = OFFICIAL_TAYLOR_EXERCISES.find((ex) => ex.id === e.target.value);
    if (selected) {
      setExpression(selected.expression);
      setXVar(selected.x_var);
      setYVar(selected.y_var);
      setX0(String(selected.x0));
      setY0(String(selected.y0));
      setXf(String(selected.xf));
      setH(String(selected.h));
      setOrder(selected.order);
      handleSolveWithParams({
        expression: selected.expression,
        x_var: selected.x_var,
        y_var: selected.y_var,
        x0: selected.x0,
        y0: selected.y0,
        xf: selected.xf,
        h: selected.h,
        order: selected.order,
      });
    }
  };

  const handleReset = () => {
    setExpression('2*x*y');
    setXVar('x');
    setYVar('y');
    setX0('1');
    setY0('1');
    setXf('1.3');
    setH('0.1');
    setOrder(2);
    setError(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Parameter Configuration Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="p-1.5 bg-slate-100 rounded-lg text-slate-800">
                <Sigma size={18} />
              </span>
              Configuración del P.V.I. & Método de Taylor
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Ingresa la ecuación diferencial y parámetros o selecciona un ejercicio de cátedra.
            </p>
          </div>

          {/* Quick Presets Dropdown */}
          <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
              Presets:
            </span>
            <select
              onChange={handleSelectPreset}
              defaultValue="amiconi-1"
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 w-full sm:w-auto cursor-pointer"
            >
              <option value="" disabled>Seleccionar ejercicio...</option>
              {OFFICIAL_TAYLOR_EXERCISES.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.title.replace(/\(.*\)/, '')} ({ex.y_var}' = {ex.expression})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Ecuación y' = f(x, y) */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Ecuación Diferencial {yVar}' = f({xVar}, {yVar})</span>
              <span className="text-[10px] text-slate-400 font-normal">ej. 2*x*y, -3*x^2*y</span>
            </label>
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              placeholder="2*x*y"
            />
          </div>

          {/* Orden de Taylor */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Orden de Taylor (p)</span>
              <span className="text-[10px] text-blue-600 font-bold">Grupo 1 = Orden 2</span>
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl">
              {[1, 2, 3, 4].map((ord) => (
                <button
                  key={ord}
                  type="button"
                  onClick={() => setOrder(ord)}
                  className={`py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    order === ord
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {ord}º
                </button>
              ))}
            </div>
          </div>

          {/* Paso h */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Paso h</span>
              <span className="text-[10px] text-slate-400">Δx</span>
            </label>
            <input
              type="number"
              step="0.05"
              value={h}
              onChange={(e) => setH(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              placeholder="0.1"
            />
          </div>

          {/* x0 */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Valor Inicial {xVar}₀
            </label>
            <input
              type="number"
              step="any"
              value={x0}
              onChange={(e) => setX0(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              placeholder="1.0"
            />
          </div>

          {/* y0 */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Condición {yVar}({xVar}₀) = {yVar}₀
            </label>
            <input
              type="number"
              step="any"
              value={y0}
              onChange={(e) => setY0(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              placeholder="1.0"
            />
          </div>

          {/* xf */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Punto Final {xVar}f
            </label>
            <input
              type="number"
              step="any"
              value={xf}
              onChange={(e) => setXf(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              placeholder="1.3"
            />
          </div>

          {/* Variables (x o t) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Variable Indep.
            </label>
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setXVar('x')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  xVar === 'x' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                x (espacial)
              </button>
              <button
                type="button"
                onClick={() => setXVar('t')}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  xVar === 't' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                t (temporal)
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="text-xs text-slate-500 font-medium">
            Iteraciones estimadas:{' '}
            <strong className="text-slate-900">
              N = ({xf} - {x0}) / {h} ={' '}
              {Math.max(0, Math.round((parseFloat(xf) - parseFloat(x0)) / (parseFloat(h) || 1)))}
            </strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              type="button"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw size={14} />
              <span>Restablecer</span>
            </button>
            <button
              onClick={handleSolve}
              disabled={loading}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-xl text-xs font-black transition-all shadow-sm cursor-pointer flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Calculando derivadas...</span>
                </>
              ) : (
                <>
                  <Play size={14} className="fill-current" />
                  <span>Calcular por Taylor</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2.5">
            <AlertCircle size={18} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Resultado Taylor {order}º
              </span>
              <div className="text-xl font-black text-slate-900 font-mono">
                {result.final_approx_value}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {yVar}({result.xf}) aproximado
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Solución Analítica
              </span>
              <div className="text-xl font-black text-emerald-800 font-mono">
                {result.final_exact_value !== null && result.final_exact_value !== undefined
                  ? result.final_exact_value
                  : 'No cerrada'}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {yVar}({result.xf}) exacto (SymPy)
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Error Relativo Final
              </span>
              <div className="text-xl font-black text-slate-900 font-mono">
                {result.final_error_rel !== null && result.final_error_rel !== undefined ? (
                  `${result.final_error_rel.toFixed(3)}%`
                ) : (
                  '-'
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {result.final_error_abs !== null && result.final_error_abs !== undefined
                  ? `Error Abs: ${result.final_error_abs.toFixed(5)}`
                  : 'N/A'}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Iteraciones Totales
              </span>
              <div className="text-xl font-black text-slate-900 font-mono">
                {result.n_steps} pasos
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Paso h = {result.h}
              </p>
            </div>
          </div>

          {/* Derivadas Simbólicas y Ordenada Genérica */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sparkles size={18} className="text-slate-800" />
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Derivadas Simbólicas & Ordenada Genérica
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Derivadas calculadas */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Derivadas Analíticas Sucesivas (Regla de la Cadena)
                </span>
                <div className="space-y-2 text-xs">
                  {result.derivatives.map((d) => (
                    <div key={d.order} className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-700 mr-2">
                        {d.order_label} ({d.order}º orden):
                      </span>
                      <div className="font-mono text-slate-900 font-bold overflow-x-auto">
                        <InlineMath math={`${d.order_label} = ${d.latex}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ordenada Genérica */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 block">
                    Fórmula de la Ordenada Genérica para {yVar}_&#123;n+1&#125;
                  </span>
                  <div className="py-3 overflow-x-auto text-blue-950 font-bold">
                    <InlineMath math={result.generic_formula_latex} block />
                  </div>
                </div>
                <p className="text-[11px] text-blue-800/80 leading-relaxed font-medium">
                  Esta es la fórmula clave de cátedra. Recorre el dominio sustituyendo iterativamente en cada paso los valores de ({xVar}_n, {yVar}_n).
                </p>
              </div>
            </div>
          </div>

          {/* Tabla de Iteraciones */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Table size={18} className="text-slate-800" />
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Tabla de Iteraciones Numéricas
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-black">
                    <th className="p-3">n</th>
                    <th className="p-3">{xVar}_n</th>
                    <th className="p-3">{yVar}_n</th>
                    {result.derivatives.map((d) => (
                      <th key={d.order} className="p-3">{d.order_label}_n</th>
                    ))}
                    <th className="p-3">{yVar}_&#123;n+1&#125;</th>
                    {result.has_exact_solution && (
                      <>
                        <th className="p-3">{yVar}_exacta</th>
                        <th className="p-3">Error Abs.</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {result.steps.map((s, idx) => (
                    <tr key={s.step} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 font-bold text-slate-900">{idx}</td>
                      <td className="p-3 font-mono text-slate-700">{s.xn}</td>
                      <td className="p-3 font-mono text-slate-700">{s.yn}</td>
                      {s.derivatives_values.map((dv, dIdx) => (
                        <td key={dIdx} className="p-3 font-mono text-slate-600">{dv}</td>
                      ))}
                      <td className="p-3 font-mono font-bold text-blue-900">{s.yn_plus_1}</td>
                      {result.has_exact_solution && (
                        <>
                          <td className="p-3 font-mono text-emerald-800">{s.y_exact ?? '-'}</td>
                          <td className="p-3 font-mono text-rose-700">{s.error_abs ?? '-'}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Desglose Paso a Paso Metodología Amiconi */}
          <TaylorStepAccordion result={result} />
        </div>
      )}
    </div>
  );
};

export default TaylorInteractiveSolver;
