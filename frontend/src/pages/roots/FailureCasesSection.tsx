import React from 'react';
import FormulaDisplay from '../../components/FormulaDisplay';
import { AlertOctagon, RotateCw, TrendingDown, Play } from 'lucide-react';

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
      icon: <AlertOctagon size={20} className="text-rose-600" />,
      tag: 'División por Cero',
      formula: 'f(x) = x^2 - 4',
      exprRaw: 'x**2 - 4',
      x0: 0.0,
      description:
        'Si en alguna iteración la recta tangente es completamente horizontal (f\'(xₙ) = 0), la ecuación xₙ₊₁ = xₙ - f(xₙ)/0 genera una indeterminación y el método no puede proyectar una intersección con el eje x.',
      recommendation:
        'Cambiar la estimación inicial x₀ a un punto donde la derivada no se anule.',
    },
    {
      title: '2. Ciclos Oscilatorios Infinitos (Bucles)',
      icon: <RotateCw size={20} className="text-amber-600" />,
      tag: 'No Converge',
      formula: 'f(x) = x^3 - x - 3',
      exprRaw: 'x**3 - x - 3',
      x0: 0.0,
      description:
        'En ciertas funciones y puntos iniciales específicos, la recta tangente proyecta exactamente de un punto a otro que a su vez vuelve a proyectar al punto original (bucle cerrado entre dos o más valores sin acercarse a la raíz).',
      recommendation:
        'Alterar ligeramente x₀ para romper la simetría del ciclo oscilatorio.',
    },
    {
      title: '3. Divergencia por Pendiente Decreciente',
      icon: <TrendingDown size={20} className="text-purple-600" />,
      tag: 'Divergencia',
      formula: 'f(x) = x^3 - 5x',
      exprRaw: 'x**3 - 5*x',
      x0: 1.0,
      description:
        'Si el punto de inicio se ubica cerca de un punto de inflexión o donde la pendiente envía la proyección cada vez más lejos de las raíces existentes, la sucesión divergerá al infinito.',
      recommendation:
        'Realizar un bosquejo previo de la función o usar el método de bisección para acotar un intervalo seguro antes de aplicar Newton.',
    },
    {
      title: '4. Divergencia en Punto Fijo (|g\'(x)| ≥ 1)',
      icon: <AlertOctagon size={20} className="text-red-600" />,
      tag: 'Criterio de Lipschitz Violado',
      formula: 'g(x) = x^2 - 2',
      exprRaw: 'x**2 - 2',
      x0: 2.5,
      description:
        'Si la derivada de la función de iteración cumple |g\'(x)| ≥ 1, el diagrama de telaraña se expande en espiral alejándose del punto fijo en cada iteración.',
      recommendation:
        'Reordenar algebraicamente la ecuación f(x) = 0 para obtener otra g(x) alternativa que satisfaga |g\'(x)| < 1 en el entorno de la raíz.',
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2">
        <h2 className="text-xl font-bold text-slate-900">Casos de Fallo y Limitaciones</h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          Aunque el método de Newton-Raphson posee convergencia cuadrática local, no siempre garantiza converger. Analizar estos casos es fundamental para comprender la robustez del algoritmo.
        </p>
      </div>

      {/* Failure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cases.map((c, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {c.icon}
                  <h3 className="text-sm font-bold text-slate-900">{c.title}</h3>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {c.tag}
                </span>
              </div>

              <FormulaDisplay label="Función de Prueba" formula={c.formula} />

              <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                <span className="font-bold block text-[10px] uppercase text-indigo-700">Solución:</span>
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
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Play size={14} />
              <span>Ver comportamiento en el Simulador</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default FailureCasesSection;
