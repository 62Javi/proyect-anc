import React, { useState } from 'react';
import {
  calculateNewtonRoot,
  calculateFixedPointRoot,
  type NewtonResponse,
  type FixedPointResponse,
} from '../../services/api';
import NewtonInteractivePlot from '../../components/roots/NewtonInteractivePlot';
import FixedPointInteractivePlot from '../../components/roots/FixedPointInteractivePlot';
import FormulaDisplay from '../../components/FormulaDisplay';
import {
  Zap,
  Play,
  TrendingUp,
  Sparkles,
  Users,
  Flame,
} from 'lucide-react';

interface BattlePreset {
  id: string;
  name: string;
  fExpr: string;
  gExpr: string;
  defaultX0: number;
  tolerance: number;
  description: string;
}

const BATTLE_PRESETS: BattlePreset[] = [
  {
    id: 'quadratic',
    name: 'Polinomio Cuadrático (TP2)',
    fExpr: 'x**2 - 4*x - 45',
    gExpr: 'sqrt(4*x + 45)',
    defaultX0: 4.0,
    tolerance: 1e-4,
    description: 'Raíz en r = 9. Observa cómo Newton llega en 3 saltos mientras Punto Fijo requiere múltiples pasos.',
  },
  {
    id: 'trig',
    name: 'Trascendente con Seno (TP2)',
    fExpr: 'x - 0.8 - 0.2*sin(x)',
    gExpr: '0.8 + 0.2*sin(x)',
    defaultX0: 0.2,
    tolerance: 1e-4,
    description: 'Raíz en r ≈ 0.9643. Excelente para que un compañero elija un x₀ aleatorio entre 0 y 2.',
  },
  {
    id: 'dottie',
    name: 'Ecuación del Coseno (Dottie)',
    fExpr: 'x - cos(x)',
    gExpr: 'cos(x)',
    defaultX0: 0.1,
    tolerance: 1e-4,
    description: 'Punto fijo clásico r ≈ 0.739085. Newton cuadruplica la velocidad del coseno iterado.',
  },
];

export const MethodBattleSection: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<BattlePreset>(BATTLE_PRESETS[0]);
  const [fExpression, setFExpression] = useState<string>(BATTLE_PRESETS[0].fExpr);
  const [gExpression, setGExpression] = useState<string>(BATTLE_PRESETS[0].gExpr);
  const [x0, setX0] = useState<number>(BATTLE_PRESETS[0].defaultX0);
  const [tolerance, setTolerance] = useState<number>(1e-4);

  const [loading, setLoading] = useState<boolean>(false);
  const [newtonResult, setNewtonResult] = useState<NewtonResponse | null>(null);
  const [fixedPointResult, setFixedPointResult] = useState<FixedPointResponse | null>(null);
  const [hasRun, setHasRun] = useState<boolean>(false);

  const handleSelectPreset = (preset: BattlePreset) => {
    setSelectedPreset(preset);
    setFExpression(preset.fExpr);
    setGExpression(preset.gExpr);
    setX0(preset.defaultX0);
    setTolerance(preset.tolerance);
    setHasRun(false);
    setNewtonResult(null);
    setFixedPointResult(null);
  };

  const handleRunBattle = async () => {
    setLoading(true);
    setHasRun(true);

    try {
      const [nRes, fpRes] = await Promise.all([
        calculateNewtonRoot({
          expression: fExpression,
          x0: Number(x0),
          tolerance: Number(tolerance),
          max_iterations: 30,
        }),
        calculateFixedPointRoot({
          g_expression: gExpression,
          x0: Number(x0),
          tolerance: Number(tolerance),
          max_iterations: 30,
        }),
      ]);

      setNewtonResult(nRes);
      setFixedPointResult(fpRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const newtonIters = newtonResult?.iterations_count ?? 0;
  const fixedPointIters = fixedPointResult?.iterations_count ?? 0;
  const speedupRatio =
    newtonIters > 0 && fixedPointIters > 0
      ? (fixedPointIters / newtonIters).toFixed(1)
      : null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1">
                <Flame size={12} className="text-slate-900" /> Duelo de Métodos en Vivo
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Dinámica para la Exposición
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Punto Fijo Común vs. Newton (El Punto Fijo Optimizado)
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-3xl">
              Pídele a un compañero una semilla inicial ($x_0$). Ejecuten la simulación en vivo para comprobar visual y matemáticamente cómo el método de Newton pulveriza en velocidad al Punto Fijo gracias a su convergencia cuadrática.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-200 shrink-0">
            <Zap size={24} />
          </div>
        </div>

        {/* Preset Selector */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            1. Seleccionar Ecuación del Duelo:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {BATTLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  selectedPreset.id === preset.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-xs">{preset.name}</div>
                <div className={`text-[11px] mt-1 font-mono ${selectedPreset.id === preset.id ? 'text-slate-300' : 'text-slate-500'}`}>
                  f(x): {preset.fExpr}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input & Action Button */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Users size={14} className="text-slate-900" />
                Semilla elegida por la clase (x₀):
              </label>
              <input
                type="number"
                step="any"
                value={x0}
                onChange={(e) => setX0(parseFloat(e.target.value) || 0)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 w-36"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Tolerancia (ε):
              </label>
              <select
                value={tolerance}
                onChange={(e) => setTolerance(parseFloat(e.target.value))}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="1e-3">10⁻³</option>
                <option value="1e-4">10⁻⁴</option>
                <option value="1e-6">10⁻⁶</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleRunBattle}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-md shadow-slate-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="animate-pulse">Calculando duelo...</span>
            ) : (
              <>
                <Play size={16} />
                <span>Correr Simulación en Vivo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Comparison Banner */}
      {hasRun && newtonResult && fixedPointResult && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                Veredicto del Duelo
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                {newtonResult.converged && fixedPointResult.converged
                  ? `Ambos métodos llegaron a la misma raíz: r ≈ ${newtonResult.root?.toFixed(5)}`
                  : 'Comparativa de Convergencia'}
              </h3>
            </div>

            {speedupRatio && (
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <TrendingUp size={24} className="text-slate-900" />
                <div>
                  <div className="text-lg font-black text-slate-900">{speedupRatio}x Más Rápido</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Aceleración de Newton</div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Punto Fijo Box */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Punto Fijo Común</span>
                <span className="text-xs font-black text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  {fixedPointIters} iteraciones
                </span>
              </div>
              <div className="text-xs text-slate-600">
                <strong>Orden de Convergencia:</strong> Lineal (Orden 1). Da pequeños pasos progresivos con pendiente $|g'(x)| &lt; 1$.
              </div>
            </div>

            {/* Newton Box */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-400" />
                  Método de Newton
                </span>
                <span className="text-xs font-black text-slate-900 bg-white px-2.5 py-1 rounded-lg shadow-sm">
                  {newtonIters} iteraciones
                </span>
              </div>
              <div className="text-xs text-slate-300">
                <strong>Orden de Convergencia:</strong> Cuadrático (Orden 2). La función está diseñada para que $g'(p) = 0$, duplicando los decimales exactos en cada paso.
              </div>
            </div>
          </div>

          {/* Side by Side Interactive Plots */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
            {/* Punto Fijo Side */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  1. Punto Fijo: x = g(x)
                </h4>
                <span className="text-xs text-slate-500 font-mono">
                  {fixedPointIters} pasos
                </span>
              </div>
              <FormulaDisplay label="g(x)" formula={fixedPointResult.latex_g} />
              <FixedPointInteractivePlot
                plotData={fixedPointResult.plot_data}
                steps={fixedPointResult.steps}
                root={fixedPointResult.root}
                kConstantEst={fixedPointResult.k_constant_est}
              />
            </div>

            {/* Newton Side */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  2. Newton: xₙ₊₁ = xₙ - f/f'
                </h4>
                <span className="text-xs text-slate-500 font-mono">
                  {newtonIters} pasos
                </span>
              </div>
              <FormulaDisplay label="f'(x)" formula={newtonResult.latex_f_prime} />
              <NewtonInteractivePlot
                plotData={newtonResult.plot_data}
                root={newtonResult.root}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MethodBattleSection;
