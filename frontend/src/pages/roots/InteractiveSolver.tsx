import React, { useState, useEffect } from 'react';
import { calculateNewtonRoot, calculateFixedPointRoot, type NewtonResponse, type FixedPointResponse } from '../../services/api';
import FormulaDisplay from '../../components/FormulaDisplay';
import UnifiedMathInput from '../../components/UnifiedMathInput';
import InlineMath from '../../components/InlineMath';
import NewtonInteractivePlot from '../../components/roots/NewtonInteractivePlot';
import FixedPointInteractivePlot from '../../components/roots/FixedPointInteractivePlot';
import RootsIterationTable from '../../components/roots/RootsIterationTable';
import type { SolverConfig, RootMethod } from '../../types/roots';
import {
  Calculator,
  Play,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const renderMessageWithLatex = (msg?: string) => {
  if (!msg) return null;

  // Transform raw scientific notation into clean LaTeX \times 10^{...}
  const formattedMsg = msg.replace(
    /(-?\d+(?:\.\d+)?)[eE]([+-]?\d+)/g,
    (_, mantissa, exp) => {
      const m = parseFloat(mantissa);
      const e = parseInt(exp, 10);
      return `$${m} \\times 10^{${e}}$`;
    }
  );

  const parts = formattedMsg.split(/(\$[^$]+\$)/g);
  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const math = part.slice(1, -1);
          return <InlineMath key={idx} math={math} className="font-semibold" />;
        }
        return <span key={idx}>{part}</span>;
      })}
    </>
  );
};

interface InteractiveSolverProps {
  initialConfig?: SolverConfig;
}

export const InteractiveSolver: React.FC<InteractiveSolverProps> = ({
  initialConfig,
}) => {
  const [method, setMethod] = useState<RootMethod>(
    initialConfig?.method || 'newton'
  );
  const [expression, setExpression] = useState<string>(
    initialConfig?.expression || 'x^2 - 4x - 45'
  );
  const [x0, setX0] = useState<number | string>(initialConfig?.x0 ?? '4');
  const [tolerance, setTolerance] = useState<number>(
    initialConfig?.tolerance ?? 0.001 // Por defecto 10⁻³
  );
  const [maxIterations, setMaxIterations] = useState<number>(
    initialConfig?.maxIterations ?? 25
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [newtonResult, setNewtonResult] = useState<NewtonResponse | null>(null);
  const [fixedPointResult, setFixedPointResult] =
    useState<FixedPointResponse | null>(null);
  const [activeStep, setActiveStep] = useState<number | undefined>(undefined);

  const TOLERANCE_OPTIONS = [
    { label: '10⁻¹ (0.1)', value: '1e-1' },
    { label: '10⁻² (0.01)', value: '1e-2' },
    { label: '10⁻³ (0.001)', value: '1e-3' },
    { label: '10⁻⁴ (0.0001)', value: '1e-4' },
    { label: '10⁻⁵ (1 × 10⁻⁵)', value: '1e-5' },
    { label: '10⁻⁶ (1 × 10⁻⁶)', value: '1e-6' },
    { label: '10⁻⁷ (1 × 10⁻⁷)', value: '1e-7' },
    { label: '10⁻⁸ (1 × 10⁻⁸)', value: '1e-8' },
  ];

  const handleCalculateWith = async (
    curMethod: RootMethod,
    expr: string,
    valX0: number | string,
    tol: number,
    maxIter: number
  ) => {
    setLoading(true);
    setError(null);
    setActiveStep(undefined);

    try {
      if (curMethod === 'newton') {
        const res = await calculateNewtonRoot({
          expression: expr,
          x0: valX0,
          tolerance: Number(tol),
          max_iterations: Number(maxIter),
        });
        setNewtonResult(res);
        setFixedPointResult(null);
      } else {
        const res = await calculateFixedPointRoot({
          g_expression: expr,
          x0: valX0,
          tolerance: Number(tol),
          max_iterations: Number(maxIter),
        });
        setFixedPointResult(res);
        setNewtonResult(null);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error no identificado al procesar el cálculo.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Sincronización cuando cambia la prop initialConfig
  useEffect(() => {
    if (initialConfig) {
      setMethod(initialConfig.method);
      setExpression(initialConfig.expression);
      setX0(initialConfig.x0);
      setTolerance(initialConfig.tolerance);
      setMaxIterations(initialConfig.maxIterations);

      handleCalculateWith(
        initialConfig.method,
        initialConfig.expression,
        initialConfig.x0,
        initialConfig.tolerance,
        initialConfig.maxIterations
      );
    }
  }, [initialConfig]);

  const handleCalculate = () => {
    handleCalculateWith(method, expression, x0, tolerance, maxIterations);
  };

  const presets: Array<{
    name: string;
    math: string;
    method: RootMethod;
    expr: string;
    x0: string | number;
    tol: number;
  }> = [
    {
      name: 'x² - 4x - 45',
      math: 'x^2 - 4x - 45',
      method: 'newton',
      expr: 'x^2 - 4x - 45',
      x0: '4',
      tol: 0.001,
    },
    {
      name: 'x - cos(x)',
      math: 'x - \\cos(x)',
      method: 'newton',
      expr: 'x - cos(x)',
      x0: 'pi/4',
      tol: 0.001,
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-200 print:hidden">
              <Calculator size={22} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Simulador de Ecuaciones</h2>
            </div>
          </div>

          {/* Selector de Método */}
          <div className="flex items-center gap-2 print:hidden">
            <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 border border-slate-200">
              <button
                onClick={() => setMethod('newton')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  method === 'newton'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Método de Newton
              </button>
              <button
                onClick={() => setMethod('fixed-point')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  method === 'fixed-point'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Punto Fijo (x = g(x))
              </button>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <div className="sm:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              {method === 'newton' ? 'Función f(x) = 0' : 'Función de iteración g(x)'}
            </label>
            <UnifiedMathInput
              value={expression}
              onChange={(_, ascii) => {
                const pyExpr = ascii
                  .replace(/·/g, '*')
                  .replace(/÷/g, '/')
                  .replace(/π/g, 'pi')
                  .replace(/\\ /g, ' ');
                setExpression(pyExpr);
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Semilla Inicial (<InlineMath math="x_0" />)
            </label>
            <UnifiedMathInput
              value={String(x0)}
              hideMenu={true}
              onChange={(_, ascii) => {
                const pyVal = ascii
                  .replace(/·/g, '*')
                  .replace(/÷/g, '/')
                  .replace(/π/g, 'pi')
                  .replace(/\\ /g, ' ');
                setX0(pyVal);
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Tolerancia (<InlineMath math="\varepsilon" />)
            </label>
            <div className="print:hidden">
              <select
                value={Number(tolerance).toExponential()}
                onChange={(e) => setTolerance(parseFloat(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-mono font-bold text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
              >
                {TOLERANCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden print:flex items-center px-4 py-2 border border-slate-300 rounded-xl bg-white min-h-[42px] text-sm font-mono font-bold text-slate-900">
              {TOLERANCE_OPTIONS.find((opt) => opt.value === Number(tolerance).toExponential())?.label || Number(tolerance).toExponential()}
            </div>
          </div>

          {/* Máximo de Iteraciones */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Max. Iteraciones
            </label>
            <div className="print:hidden">
              <input
                type="number"
                min={1}
                max={500}
                value={maxIterations}
                onChange={(e) => setMaxIterations(parseInt(e.target.value, 10) || 1)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-mono font-bold text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div className="hidden print:flex items-center px-4 py-2 border border-slate-300 rounded-xl bg-white min-h-[42px] text-sm font-mono font-bold text-slate-900">
              {maxIterations}
            </div>
          </div>
        </div>

        {/* Quick Presets & Run Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 print:hidden">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Ejemplos Rápidos:
            </span>
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setExpression(p.expr);
                  setX0(p.x0);
                  setNewtonResult(null);
                  setFixedPointResult(null);
                  setError(null);
                  setActiveStep(undefined);
                }}
                className="whitespace-nowrap inline-flex items-center justify-center text-xs px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 font-semibold transition-all cursor-pointer shrink-0"
              >
                <InlineMath math={p.math} />
              </button>
            ))}
          </div>

          <button
            onClick={handleCalculate}
            disabled={loading || !expression.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-slate-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="animate-pulse">Calculando...</span>
            ) : (
              <>
                <Play size={16} />
                <span>Calcular Raíz</span>
              </>
            )}
          </button>
        </div>
      </div>

        {/* Error alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-900 p-5 rounded-2xl flex items-start gap-3 text-xs sm:text-sm">
            <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={18} />
            <div>
              <span className="font-bold block uppercase tracking-wider">Error en el cálculo:</span>
              {error}
            </div>
          </div>
        )}

        {/* Result Status Banner */}
        {(newtonResult || fixedPointResult) && (
          <div
            className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-4 ${
              (newtonResult?.converged || fixedPointResult?.converged)
                ? 'bg-slate-900 text-white border-slate-900 print:bg-white print:text-slate-900 print:border-slate-300'
                : 'bg-amber-50/90 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {(newtonResult?.converged || fixedPointResult?.converged) ? (
                  <CheckCircle className="text-white print:text-slate-900" size={28} />
                ) : (
                  <AlertCircle className="text-amber-600" size={28} />
                )}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest block opacity-70">
                    Resultado del Cálculo
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black">
                    {(newtonResult?.converged || fixedPointResult?.converged)
                      ? `Raíz encontrada: ${(newtonResult?.root ?? fixedPointResult?.root)?.toFixed(6)}`
                      : 'No se alcanzó convergencia'}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-3.5 py-1.5 rounded-xl bg-white/10 text-white border border-white/20 print:text-slate-900 print:border-slate-300">
                  {(newtonResult?.iterations_count ?? fixedPointResult?.iterations_count)} iteraciones
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed opacity-90">
              {renderMessageWithLatex(newtonResult?.message || fixedPointResult?.message)}
            </p>

            {/* Formulas Render */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 bg-white p-3 rounded-2xl text-slate-900">
              {newtonResult && (
                <>
                  <FormulaDisplay label="f(x)" formula={newtonResult.latex_f} />
                  <FormulaDisplay label="f'(x)" formula={newtonResult.latex_f_prime} />
                </>
              )}
              {fixedPointResult && (
                <>
                  <FormulaDisplay label="g(x)" formula={fixedPointResult.latex_g} />
                  <FormulaDisplay label="g'(x)" formula={fixedPointResult.latex_g_prime} />
                </>
              )}
            </div>
          </div>
        )}

        {/* Interactive Plots */}
        {newtonResult && (
          <NewtonInteractivePlot
            plotData={newtonResult.plot_data}
            root={newtonResult.root}
            expression={expression}
          />
        )}

        {fixedPointResult && (
          <FixedPointInteractivePlot
            plotData={fixedPointResult.plot_data}
            steps={fixedPointResult.steps}
            root={fixedPointResult.root}
            kConstantEst={fixedPointResult.k_constant_est}
            expression={expression}
          />
        )}

        {/* Steps Table */}
        {(newtonResult || fixedPointResult) && (
          <RootsIterationTable
            type={method}
            newtonSteps={newtonResult?.steps}
            fixedPointSteps={fixedPointResult?.steps}
            activeStep={activeStep}
            onSelectStep={(st) => setActiveStep(st)}
          />
        )}
      </div>
    );
  };

  export default InteractiveSolver;