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
      title: '1. Derivada Nula (División por Cero)',
      icon: <AlertOctagon size={22} className="text-slate-900" />,
      tag: 'f\'(xₙ) = 0',
      formula: 'x^2 - 4',
      exprRaw: 'x**2 - 4',
      x0: 0.0,
      sabotageLabel: '💥 Sabotear con Tangente Horizontal',
      description:
        'Si la recta tangente es horizontal (f\'(xₙ) = 0), la fórmula xₙ₊₁ = xₙ - f(xₙ)/0 genera una indeterminación inmediata porque la recta es paralela al eje horizontal y nunca lo corta.',
      recommendation:
        'Mover la semilla x₀ a un punto donde f\'(x₀) ≠ 0.',
    },
    {
      title: '2. Ciclos Oscilatorios Infinitos (Bucles)',
      icon: <RotateCw size={22} className="text-slate-900" />,
      tag: 'Bucle Periódico',
      formula: 'x^3 - x - 3',
      exprRaw: 'x**3 - x - 3',
      x0: 0.0,
      sabotageLabel: '🌀 Sabotear con Bucle Oscilatorio',
      description:
        'En ciertas funciones simétricas, la recta tangente proyecta a un valor que en el siguiente paso vuelve a proyectar exactamente al punto inicial, quedando atrapado en un bucle infinito entre dos valores.',
      recommendation:
        'Perturbar ligeramente x₀ para romper la simetría periódica.',
    },
    {
      title: '3. Disparo al Infinito (Divergencia)',
      icon: <TrendingDown size={22} className="text-slate-900" />,
      tag: 'Divergencia',
      formula: 'x^3 - 5x',
      exprRaw: 'x**3 - 5*x',
      x0: 1.0,
      sabotageLabel: '🚀 Sabotear con Disparo al Infinito',
      description:
        'Cerca de puntos de inflexión con pendiente muy pequeña, la tangente proyecta valores astronómicos cada vez más alejados de las raíces reales.',
      recommendation:
        'Realizar un bosquejo de la función para situar x₀ dentro del intervalo de atracción.',
    },
    {
      title: '4. Telaraña Expansiva en Punto Fijo',
      icon: <AlertOctagon size={22} className="text-slate-900" />,
      tag: '|g\'(x)| ≥ 1',
      formula: 'x^2 - 2',
      exprRaw: 'x**2 - 2',
      x0: 2.5,
      sabotageLabel: '🕸️ Sabotear con Telaraña Expansiva',
      description:
        'Si la derivada de la función de iteración cumple |g\'(x)| ≥ 1, se viola el Teorema 1 y la telaraña se abre en una espiral que huye del punto fijo.',
      recommendation:
        'Reordenar algebraicamente f(x) = 0 para obtener un despeje g(x) alternativo con pendiente menor a 1.',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-3 text-slate-900">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
            <Bomb size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Laboratorio de Sabotaje & Casos de Fallo</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Demostraciones en vivo</p>
          </div>
        </div>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Los métodos numéricos no son mágicos. Tienen condiciones matemáticas estrictas para converger. Usa los botones de <strong>Sabotaje</strong> para provocar los fallos en vivo y mostrarle a la clase qué ocurre cuando se violan las hipótesis de los teoremas.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cases.map((c, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {c.icon}
                  <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  {c.tag}
                </span>
              </div>

              <FormulaDisplay label="Función" formula={c.formula} />

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{c.description}</p>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
                <span className="font-black block text-[10px] uppercase text-slate-900 tracking-wider">¿Cómo solucionarlo en la práctica?</span>
                <p>{c.recommendation}</p>
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
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-md shadow-slate-200 cursor-pointer"
            >
              <Zap size={15} />
              <span>{c.sabotageLabel}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default FailureCasesSection;
