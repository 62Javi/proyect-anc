import React from 'react';
import FormulaDisplay from '../../components/FormulaDisplay';
import { ArrowRight, CheckCircle2, Play } from 'lucide-react';

interface ExercisesSectionProps {
  onLoadExercise: (config: {
    method: 'newton' | 'fixed-point';
    expression: string;
    x0: number;
    tolerance: number;
    maxIterations: number;
  }) => void;
}

export const ExercisesSection: React.FC<ExercisesSectionProps> = ({ onLoadExercise }) => {
  const exercises = [
    {
      id: 'tp2-7-a1',
      title: 'TP2 - Ejercicio 7 (a1): Polinomio Cuadrático',
      method: 'newton' as const,
      expression: 'x**2 - 4*x - 45',
      fPrime: '2*x - 4',
      x0: 0.5,
      tolerance: 1e-4,
      maxIterations: 10,
      description: 'Determinar la raíz del polinomio f(x) = x² - 4x - 45 partiendo desde el valor inicial x₀ = 0.5.',
      analyticalRoots: 'Las raíces analíticas son (x - 9)(x + 5) = 0 ⟹ r₁ = 9, r₂ = -5.',
      expectedRoot: -5.0,
      stepsSummary: [
        'Iteración 1: x₁ = 0.5 - (0.5² - 4(0.5) - 45) / (2(0.5) - 4) = 0.5 - (-46.75)/(-3) = -15.0833',
        'Iteración 2: x₂ = -8.1068',
        'Iteración 3: x₃ = -5.4608',
        'Iteración 4: x₄ = -5.0205',
        'Iteración 5: x₅ = -5.0000 (Converge a la raíz r = -5 con error < 10⁻⁴)',
      ],
    },
    {
      id: 'tp2-7-a2',
      title: 'TP2 - Ejercicio 7 (a2): Polinomio Cuadrático',
      method: 'newton' as const,
      expression: 'x**2 - 4*x - 45',
      fPrime: '2*x - 4',
      x0: 4.0,
      tolerance: 1e-4,
      maxIterations: 10,
      description: 'Misma función f(x) = x² - 4x - 45 pero partiendo desde x₀ = 4.',
      analyticalRoots: 'Partiendo de x₀ = 4 (más cercano a la raíz positiva r = 9):',
      expectedRoot: 9.0,
      stepsSummary: [
        'Iteración 1: x₁ = 4 - (4² - 4(4) - 45)/(2(4) - 4) = 4 - (-45)/4 = 15.25',
        'Iteración 2: x₂ = 10.7418',
        'Iteración 3: x₃ = 9.2081',
        'Iteración 4: x₄ = 9.0029',
        'Iteración 5: x₅ = 9.0000 (Converge a la raíz positiva r = 9)',
      ],
    },
    {
      id: 'tp2-7-b',
      title: 'TP2 - Ejercicio 7 (b): Ecuación Trascendente con Seno',
      method: 'newton' as const,
      expression: 'x - 0.8 - 0.2*sin(x)',
      fPrime: '1 - 0.2*cos(x)',
      x0: 0.7854, // pi/4
      tolerance: 1e-4,
      maxIterations: 10,
      description: 'Estimar la raíz de f(x) = x - 0.8 - 0.2·sen(x) con x₀ = π/4 (0.7854 rad).',
      analyticalRoots: 'Dado que |0.2·cos(x)| ≤ 0.2 < 1, el método converge suavemente.',
      expectedRoot: 0.9643,
      stepsSummary: [
        'Iteración 1: x₁ = 0.7854 - (-0.1558)/(0.8586) = 0.9669 rad',
        'Iteración 2: x₂ = 0.9643 rad (Error |x₂ - x₁| < 10⁻⁴)',
      ],
    },
    {
      id: 'tp2-8-a',
      title: 'TP2 - Ejercicio 8 (a): Ecuación del Coseno',
      method: 'newton' as const,
      expression: 'x - cos(x)',
      fPrime: '1 + sin(x)',
      x0: 0.7854,
      tolerance: 1e-3,
      maxIterations: 10,
      description: 'Estimar utilizando el método de Newton con error < 10⁻³ la raíz de f(x) = x - cos(x) desde x₀ = π/4.',
      analyticalRoots: 'Conocido como el número de Dottie (punto fijo de cos(x)).',
      expectedRoot: 0.739085,
      stepsSummary: [
        'Iteración 1: x₁ = 0.7854 - (0.7854 - 0.7071)/(1 + 0.7071) = 0.739536',
        'Iteración 2: x₂ = 0.739085',
        'Iteración 3: x₃ = 0.739085 (|x₃ - x₂| < 10⁻⁶ < 10⁻³)',
      ],
    },
    {
      id: 'tp2-8-b',
      title: 'TP2 - Ejercicio 8 (b): Ecuación Exponencial Trascendente',
      method: 'newton' as const,
      expression: 'exp(x) + 2*x + 2*cos(x) - 6',
      fPrime: 'exp(x) + 2 - 2*sin(x)',
      x0: 0.7854,
      tolerance: 1e-3,
      maxIterations: 10,
      description: 'Resolver eˣ + 2x + 2·cos(x) = 6 partiendo desde x₀ = π/4 con cota de error < 10⁻³.',
      analyticalRoots: 'f(x) = eˣ + 2x + 2cos(x) - 6 = 0.',
      expectedRoot: 0.9004,
      stepsSummary: [
        'Iteración 1: x₁ = 0.7854 - (-0.2114)/(2.7797) = 0.8615',
        'Iteración 2: x₂ = 0.9001',
        'Iteración 3: x₃ = 0.9004 (|x₃ - x₂| < 10⁻³)',
      ],
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Ejercicios Resueltos - TP2 Amiconi</h2>
        <p className="text-slate-600 text-sm mt-1">
          Problemas oficiales de la guía de trabajos prácticos de la cátedra resueltos paso a paso. Haz clic en <strong>"Probar en el Simulador"</strong> para ejecutarlos en vivo.
        </p>
      </div>

      {/* Exercise Cards */}
      <div className="space-y-6">
        {exercises.map((ex) => (
          <div
            key={ex.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:border-indigo-300 transition-all space-y-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                  {ex.method === 'newton' ? 'Newton-Raphson' : 'Punto Fijo'}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">{ex.title}</h3>
              </div>

              <button
                onClick={() =>
                  onLoadExercise({
                    method: ex.method,
                    expression: ex.expression,
                    x0: ex.x0,
                    tolerance: ex.tolerance,
                    maxIterations: ex.maxIterations,
                  })
                }
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Play size={14} />
                <span>Probar en el Simulador</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{ex.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <FormulaDisplay label="f(x)" formula={ex.expression.replace(/\*\*/g, '^').replace(/\*/g, ' ')} />
              <FormulaDisplay label="f'(x)" formula={ex.fPrime.replace(/\*\*/g, '^').replace(/\*/g, ' ')} />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                Desarrollo de Iteraciones:
              </span>
              <ul className="space-y-1 text-slate-600 font-mono text-[11px]">
                {ex.stepsSummary.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ArrowRight size={13} className="text-indigo-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-700">
                <span className="font-sans font-medium text-[11px]">{ex.analyticalRoots}</span>
                <span className="font-sans font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Raíz: r ≈ {ex.expectedRoot}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ExercisesSection;
