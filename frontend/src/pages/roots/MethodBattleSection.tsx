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
import InlineMath from '../../components/InlineMath';
import {
  Zap,
  Play,
  TrendingUp,
  Sparkles,
  Users,
  Flame,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

interface BattlePreset {
  id: string;
  name: string;
  fExpr: string;
  gExpr: string;
  defaultX0: number;
  tolerance: number;
  description: string;
  rootValue: string;
}

const BATTLE_PRESETS: BattlePreset[] = [
  {
    id: 'quadratic',
    name: 'Polinomio Cuadrático (TP2)',
    fExpr: 'x**2 - 4*x - 45',
    gExpr: 'sqrt(4*x + 45)',
    defaultX0: 4.0,
    tolerance: 1e-4,
    description: 'Buscamos la raíz positiva r = 9. Observa cómo Newton llega en 3 saltos mientras Punto Fijo requiere más de 12 pasos.',
    rootValue: '9.0000',
  },
  {
    id: 'trig',
    name: 'Ecuación Trascendente con Seno (TP2)',
    fExpr: 'x - 0.8 - 0.2*sin(x)',
    gExpr: '0.8 + 0.2*sin(x)',
    defaultX0: 0.2,
    tolerance: 1e-4,
    description: 'Raíz en r ≈ 0.9643. Ideal para que un compañero elija un x₀ cualquiera entre 0 y 2.',
    rootValue: '0.9643',
  },
  {
    id: 'dottie',
    name: 'Ecuación del Coseno (Número de Dottie)',
    fExpr: 'x - cos(x)',
    gExpr: 'cos(x)',
    defaultX0: 0.1,
    tolerance: 1e-4,
    description: 'Punto fijo clásico r ≈ 0.739085. Newton cuadruplica la velocidad del coseno iterado.',
    rootValue: '0.7391',
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
          max_iterations: 35,
        }),
        calculateFixedPointRoot({
          g_expression: gExpression,
          x0: Number(x0),
          tolerance: Number(tolerance),
          max_iterations: 35,
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
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header Banner - Presentation Styled */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-slate-900 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 flex items-center gap-1.5">
                <Flame size={14} className="text-slate-900" /> Duelo de Métodos en Vivo
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Dinámica para la Exposición
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Punto Fijo Común vs. Método de Newton
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl">
              ¿Por qué la cátedra dice que <strong>Newton es el rey de los puntos fijos</strong>? Pídele a un compañero una semilla inicial (<InlineMath math="x_0" />). Al correr la simulación en vivo, verán cómo ambos buscan la misma raíz pero Newton llega en 3 saltos gracias a su <strong>orden cuadrático</strong>.
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xl shadow-slate-200 shrink-0">
            <Zap size={28} />
          </div>
        </div>

        {/* Intuitive Guide Box for Presenter */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-slate-700 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-wider text-xs">
            <HelpCircle size={16} /> ¿Qué estamos demostrando en esta pantalla?
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">🐢 Punto Fijo (<InlineMath math="x_{n+1} = g(x_n)" />)</span>
              <p className="text-xs text-slate-600">Despeje algebraico simple. Avanza a pasos lentos porque su derivada en la raíz cumple <InlineMath math="|g'(p)| < 1" /> (orden lineal).</p>
            </div>
            <div className="bg-slate-900 text-white p-3 rounded-xl space-y-1">
              <span className="font-bold text-slate-100 block">🚀 Método de Newton (<InlineMath math="x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}" />)</span>
              <p className="text-xs text-slate-300">Punto fijo optimizado. Al dividir por la derivada, logra <InlineMath math="g'(p) = 0" />, duplicando los decimales exactos en cada iteración (orden cuadrático).</p>
            </div>
          </div>
        </div>

        {/* Step 1: Preset Selection */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">
            1. Seleccionar Ecuación del Duelo:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {BATTLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedPreset.id === preset.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-sm">{preset.name}</div>
                <div className="mt-2 text-xs">
                  <span className={selectedPreset.id === preset.id ? 'text-slate-300 font-medium' : 'text-slate-500'}>
                    <InlineMath math={`f(x) = ${preset.fExpr.replace(/\*\*/g, '^').replace(/\*/g, '')}`} />
                  </span>
                </div>
                <div className={`text-[11px] mt-1 ${selectedPreset.id === preset.id ? 'text-slate-400' : 'text-slate-400'}`}>
                  Raíz esperada: <InlineMath math={`r \\approx ${preset.rootValue}`} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Seed Input & Run Button */}
        <div className="bg-slate-100/70 p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-5 w-full sm:w-auto">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Users size={15} className="text-slate-900" />
                Semilla elegida por la clase (<InlineMath math="x_0" />):
              </label>
              <input
                type="number"
                step="any"
                value={x0}
                onChange={(e) => setX0(parseFloat(e.target.value) || 0)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-base font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 w-36 shadow-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Tolerancia de error (<InlineMath math="\varepsilon" />):
              </label>
              <select
                value={tolerance}
                onChange={(e) => setTolerance(parseFloat(e.target.value))}
                className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-xs"
              >
                <option value="1e-3">10⁻³ (0.001)</option>
                <option value="1e-4">10⁻⁴ (0.0001)</option>
                <option value="1e-6">10⁻⁶ (0.000001)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleRunBattle}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-sm font-black uppercase tracking-wider shadow-lg shadow-slate-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="animate-pulse">Ejecutando Duelo...</span>
            ) : (
              <>
                <Play size={18} />
                <span>Correr Duelo en Vivo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Comparison Section */}
      {hasRun && newtonResult && fixedPointResult && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 animate-in fade-in duration-500">
          {/* Main Verdict Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-widest text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                Resultado de la Competencia
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {newtonResult.converged && fixedPointResult.converged ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={24} className="text-slate-900" />
                    Ambos alcanzaron la misma raíz: <InlineMath math={`r \\approx ${(newtonResult.root ?? 0).toFixed(5)}`} />
                  </span>
                ) : (
                  'Comparativa de Convergencia'
                )}
              </h3>
            </div>

            {speedupRatio && (
              <div className="flex items-center gap-3 bg-slate-900 text-white p-4 rounded-2xl shadow-md">
                <TrendingUp size={28} className="text-amber-400" />
                <div>
                  <div className="text-2xl font-black">{speedupRatio}x Más Rápido</div>
                  <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Aceleración de Newton</div>
                </div>
              </div>
            )}
          </div>

          {/* Side-by-Side Visual Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Punto Fijo Column */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Método 1</span>
                  <h4 className="text-lg font-bold text-slate-900">Punto Fijo Común</h4>
                </div>
                <span className="text-sm font-black text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                  {fixedPointIters} iteraciones
                </span>
              </div>
              <FormulaDisplay label="g(x)" formula={fixedPointResult.latex_g} />
              <div className="text-xs text-slate-600 leading-relaxed space-y-1">
                <p><strong>Velocidad:</strong> Orden Lineal (<InlineMath math="p=1" />).</p>
                <p><strong>Mecánica:</strong> Rebota entre la curva <InlineMath math="y=g(x)" /> y la recta <InlineMath math="y=x" /> avanzando paso a paso.</p>
              </div>
              <FixedPointInteractivePlot
                plotData={fixedPointResult.plot_data}
                steps={fixedPointResult.steps}
                root={fixedPointResult.root}
                kConstantEst={fixedPointResult.k_constant_est}
              />
            </div>

            {/* Newton Column */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl shadow-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-400" /> Método 2 (Rey)
                  </span>
                  <h4 className="text-lg font-bold text-white">Método de Newton</h4>
                </div>
                <span className="text-sm font-black text-slate-900 bg-white px-3 py-1.5 rounded-xl shadow-md">
                  {newtonIters} iteraciones
                </span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <FormulaDisplay label="f'(x)" formula={newtonResult.latex_f_prime} />
              </div>
              <div className="text-xs text-slate-300 leading-relaxed space-y-1">
                <p><strong>Velocidad:</strong> Orden Cuadrático (<InlineMath math="p=2" />).</p>
                <p><strong>Mecánica:</strong> Traza tangentes que cortan el eje <InlineMath math="y=0" /> catapultando la aproximación a la raíz.</p>
              </div>
              <div className="bg-white text-slate-900 rounded-2xl p-2">
                <NewtonInteractivePlot
                  plotData={newtonResult.plot_data}
                  root={newtonResult.root}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MethodBattleSection;
