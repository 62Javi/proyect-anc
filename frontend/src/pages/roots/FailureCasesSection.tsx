import React from 'react';
import FormulaDisplay from '../../components/FormulaDisplay';
import { AlertOctagon, RotateCw, TrendingDown, Bomb, Zap } from 'lucide-react';

interface FailureCasesSectionProps {
  onLoadExample: (config: {
    method: 'newton' | 'fixed-point';
    expression: string;
    x0: number;
    tolerance: number;
    maxIterations: number;
  }) => void;
}

export const FailureCasesSection: React.FC<FailureCasesSectionProps> = ({ onLoadExample }) => {
  const cases = [
    {
      title: '1. Derivada Nula (f\'(xₙ) = 0)',
      icon: <AlertOctagon size={20} className="text-slate-900" />,
      tag: 'División por Cero',
      formula: 'f(x) = x^2 - 4',
      exprRaw: 'x**2 - 4',
      x0: 0.0,
      sabotageLabel: '💥 Sabotear con Tangente Horizontal',
      description:
        'Si en alguna iteración la recta tangente es completamente horizontal (f\'(xₙ) = 0), la fórmula de Newton xₙ₊₁ = xₙ - f(xₙ)/0 genera una indeterminación inmediata y el método no puede intersectar el eje horizontal.',
      recommendation:
        'Desplazar la estimación inicial x₀ hacia una región con pendiente no nula.',
    },
    {
      title: '2. Ciclos Oscilatorios Infinitos (Bucles)',
      icon: <RotateCw size={20} className="text-slate-900" />,
      tag: 'Bucle Cerrado',
      formula: 'f(x) = x^3 - x - 3',
      exprRaw: 'x**3 - x - 3',
      x0: 0.0,
      sabotageLabel: '🌀 Sabotear con Bucle Oscilatorio',
      description:
        'En ciertas funciones y puntos iniciales específicos, la recta tangente proyecta exactamente de un punto a otro que a su vez vuelve a proyectar al punto original (bucle cerrado infinito entre dos valores sin aproximar la raíz).',
      recommendation:
        'Alterar ligeramente x₀ para romper la simetría periódica del ciclo oscilatorio.',
    },
    {
      title: '3. Divergencia por Pendiente Decreciente',
      icon: <TrendingDown size={20} className="text-slate-900" />,
      tag: 'Divergencia al Infinito',
      formula: 'f(x) = x^3 - 5x',
      exprRaw: 'x**3 - 5*x',
      x0: 1.0,
      sabotageLabel: '🚀 Sabotear con Disparo al Infinito',
      description:
        'Si el punto inicial se ubica cerca de un punto de inflexión o donde la pendiente envía la proyección cada vez más lejos de las raíces existentes, la sucesión de Newton diverge exponencialmente.',
      recommendation:
        'Realizar un análisis previo de la función para escoger un x₀ dentro de la cuenca de atracción de la raíz.',
    },
    {
      title: '4. Divergencia en Punto Fijo (|g\'(x)| ≥ 1)',
      icon: <AlertOctagon size={20} className="text-slate-900" />,
      tag: 'Condición de Lipschitz Violada',
      formula: 'g(x) = x^2 - 2',
      exprRaw: 'x**2 - 2',
      x0: 2.5,
      sabotageLabel: '🕸️ Sabotear con Telaraña Expansiva',
      description:
        'Si la derivada de la función de iteración cumple |g\'(x)| ≥ 1, el diagrama de telaraña se expande en espiral alejándose del punto fijo en cada iteración.',
      recommendation:
        'Reordenar algebraicamente la ecuación f(x) = 0 para obtener otra g(x) alternativa que satisfaga |g\'(x)| < 1.',
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-slate-900 mb-1">
          <Bomb size={22} />
          <h2 className="text-xl font-bold text-slate-900">Laboratorio de Sabotaje y Casos de Fallo</h2>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
          Aunque el método de Newton posee convergencia cuadrática local, no siempre garantiza converger. Usa los botones de <strong>Sabotaje en Vivo</strong> para forzar los fallos matemáticos en el simulador y mostrarlos durante la clase.
        </p>
      </div>

      {/* Failure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cases.map((c, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {c.icon}
                  <h3 className="text-sm font-bold text-slate-900">{c.title}</h3>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  {c.tag}
                </span>
              </div>

              <FormulaDisplay label="Función de Prueba" formula={c.formula} />

              <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                <span className="font-bold block text-[10px] uppercase text-slate-900">Solución:</span>
                {c.recommendation}
              </div>
            </div>

            <button
              onClick={() =>
                onLoadExample({
                  method: c.title.includes('Punto Fijo') ? 'fixed-point' : 'newton',
                  expression: c.exprRaw,
                  x0: c.x0,
                  tolerance: 1e-4,
                  maxIterations: 10,
                })
              }
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
            >
              <Zap size={14} />
              <span>{c.sabotageLabel}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default FailureCasesSection;
