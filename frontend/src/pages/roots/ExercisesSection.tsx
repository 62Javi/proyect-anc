import React from 'react';
import FormulaDisplay from '../../components/FormulaDisplay';
import InlineMath from '../../components/InlineMath';
import { ArrowRight, CheckCircle2, Play, Award } from 'lucide-react';

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
      id: 'tp2-9-eng',
      title: 'TP2 - Ejercicio 9 (Caso de Ingeniería): Concentración de Bacterias en un Río',
      method: 'newton' as const,
      expression: '70*exp(-1.5*x) + 25*exp(-0.075*x) - 9',
      fPrime: '-105*exp(-1.5*x) - 1.875*exp(-0.075*x)',
      latexExpr: '70 e^{-1.5 x} + 25 e^{-0.075 x} - 9',
      latexFPrime: '-105 e^{-1.5 x} - 1.875 e^{-0.075 x}',
      x0: 1.0,
      tolerance: 1e-4,
      maxIterations: 12,
      description: 'Modelo ambiental de dispersión y decaimiento bacteriano río abajo tras una descarga. Determinar la distancia x (en km) donde la concentración desciende hasta el límite ecológico seguro de 9 ppm.',
      analyticalRoots: 'Ecuación no lineal trascendente. No admite despeje algebraico directo.',
      expectedRoot: '13.606 \\text{ km}',
      isEngineeringStar: true,
      stepsSummary: [
        'Paso 1 (x₀ = 1.0): f(1) = 29.79, f\'(1) = -25.16 ⟹ x₁ = 2.184 km',
        'Paso 2 (x₁ = 2.184): f(2.184) = 14.85 ⟹ x₂ = 5.210 km',
        'Paso 3 (x₂ = 5.210): f(5.210) = 7.74 ⟹ x₃ = 10.845 km',
        'Paso 4 (x₃ = 10.845): x₄ = 13.480 km',
        'Paso 5 (x₄ = 13.480): x₅ = 13.606 km (Error < 10⁻⁴. Convergencia exitosa)',
      ],
    },
    {
      id: 'tp2-7-a1',
      title: 'TP2 - Ejercicio 7 (a1): Polinomio Cuadrático',
      method: 'newton' as const,
      expression: 'x**2 - 4*x - 45',
      fPrime: '2*x - 4',
      latexExpr: 'x^2 - 4x - 45',
      latexFPrime: '2x - 4',
      x0: 0.5,
      tolerance: 1e-4,
      maxIterations: 10,
      description: 'Determinar la raíz del polinomio partiendo desde el valor inicial x₀ = 0.5.',
      analyticalRoots: 'Raíces analíticas: (x - 9)(x + 5) = 0 ⟹ r₁ = 9, r₂ = -5.',
      expectedRoot: '-5.0000',
      stepsSummary: [
        'Paso 1: x₁ = 0.5 - (-46.75)/(-3.0) = -15.0833',
        'Paso 2: x₂ = -8.1068',
        'Paso 3: x₃ = -5.4608',
        'Paso 4: x₄ = -5.0205',
        'Paso 5: x₅ = -5.0000 (Alcanza la raíz negativa con error < 10⁻⁴)',
      ],
    },
    {
      id: 'tp2-7-a2',
      title: 'TP2 - Ejercicio 7 (a2): Polinomio Cuadrático (Raíz Positiva)',
      method: 'newton' as const,
      expression: 'x**2 - 4*x - 45',
      fPrime: '2*x - 4',
      latexExpr: 'x^2 - 4x - 45',
      latexFPrime: '2x - 4',
      x0: 4.0,
      tolerance: 1e-4,
      maxIterations: 10,
      description: 'Misma función pero partiendo desde x₀ = 4.0 para atraer la raíz positiva.',
      analyticalRoots: 'Al iniciar a la derecha de la cúspide (x > 2), la tangente proyecta hacia r = 9.',
      expectedRoot: '9.0000',
      stepsSummary: [
        'Paso 1: x₁ = 4.0 - (-45.0)/(4.0) = 15.2500',
        'Paso 2: x₂ = 10.7418',
        'Paso 3: x₃ = 9.2081',
        'Paso 4: x₄ = 9.0029',
        'Paso 5: x₅ = 9.0000 (Converge a la raíz positiva r = 9)',
      ],
    },
    {
      id: 'tp2-7-b',
      title: 'TP2 - Ejercicio 7 (b): Ecuación Trascendente con Seno',
      method: 'newton' as const,
      expression: 'x - 0.8 - 0.2*sin(x)',
      fPrime: '1 - 0.2*cos(x)',
      latexExpr: 'x - 0.8 - 0.2\\sin(x)',
      latexFPrime: '1 - 0.2\\cos(x)',
      x0: 0.7854,
      tolerance: 1e-4,
      maxIterations: 10,
      description: 'Estimar la raíz con semilla inicial x₀ = π/4 (0.7854 rad).',
      analyticalRoots: 'Dado que |0.2·cos(x)| ≤ 0.2 < 1, la derivada nunca se anula y converge en 2 iteraciones.',
      expectedRoot: '0.9643',
      stepsSummary: [
        'Paso 1: x₁ = 0.7854 - (-0.1558)/(0.8586) = 0.9669',
        'Paso 2: x₂ = 0.9643 (Error < 10⁻⁴)',
      ],
    },
    {
      id: 'tp2-8-a',
      title: 'TP2 - Ejercicio 8 (a): Ecuación del Coseno (Número de Dottie)',
      method: 'newton' as const,
      expression: 'x - cos(x)',
      fPrime: '1 + sin(x)',
      latexExpr: 'x - \\cos(x)',
      latexFPrime: '1 + \\sin(x)',
      x0: 0.7854,
      tolerance: 1e-3,
      maxIterations: 10,
      description: 'Estimar la raíz de f(x) = x - cos(x) desde x₀ = π/4.',
      analyticalRoots: 'Punto fijo universal del coseno en radianes.',
      expectedRoot: '0.7391',
      stepsSummary: [
        'Paso 1: x₁ = 0.7854 - (0.0783)/(1.7071) = 0.7395',
        'Paso 2: x₂ = 0.7391 (Precisión instantánea)',
      ],
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-2">
        <h2 className="text-2xl font-black text-slate-900">Ejercicios de la Guía Oficial de Trabajos Prácticos</h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Problemas oficiales de la cátedra resueltos paso a paso. Haz clic en <strong>"Probar en el Simulador"</strong> para cargar automáticamente sus parámetros y ver la animación.
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-6">
        {exercises.map((ex) => (
          <div
            key={ex.id}
            className={`bg-white rounded-3xl border p-6 sm:p-8 shadow-sm transition-all space-y-5 ${
              (ex as any).isEngineeringStar
                ? 'border-slate-900 ring-2 ring-slate-900/10 hover:shadow-xl'
                : 'border-slate-200 hover:border-slate-400 hover:shadow-md'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    Método de Newton
                  </span>
                  {(ex as any).isEngineeringStar && (
                    <span className="text-xs font-black uppercase tracking-widest text-white bg-slate-900 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <Award size={14} /> Caso de Ingeniería Real
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-2">{ex.title}</h3>
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
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Play size={14} />
                <span>Probar en el Simulador</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{ex.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormulaDisplay label="f(x)" formula={ex.latexExpr} />
              <FormulaDisplay label="f'(x)" formula={ex.latexFPrime} />
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-3">
              <span className="font-black text-slate-900 uppercase tracking-wider block text-xs">
                Desarrollo Paso a Paso:
              </span>
              <ul className="space-y-1.5 text-slate-700 font-mono text-xs">
                {ex.stepsSummary.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ArrowRight size={14} className="text-slate-900 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-700">
                <span className="font-sans font-medium text-xs">{ex.analyticalRoots}</span>
                <span className="font-sans font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 size={16} /> Raíz Calculada: <InlineMath math={`r \\approx ${ex.expectedRoot}`} />
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
