import React from 'react';
import FormulaDisplay from '../../components/FormulaDisplay';
import InlineMath from '../../components/InlineMath';
import { ArrowRight, CheckCircle2, Play, Award, Printer } from 'lucide-react';
import { useAppPrint } from '../../hooks/useAppPrint';
import type { SolverConfig, RootMethod } from '../../types/roots';

interface ExerciseItem {
  id: string;
  title: string;
  description: string;
  method: RootMethod;
  expression: string;
  latexExpr: string;
  latexFPrime: string;
  x0: number;
  tolerance: number;
  maxIterations: number;
  expectedRoot: number;
  analyticalRoots: string;
  stepsSummary: string[];
  isEngineeringStar?: boolean;
}

interface ExercisesSectionProps {
  onLoadExercise: (config: SolverConfig) => void;
}

export const ExercisesSection: React.FC<ExercisesSectionProps> = ({ onLoadExercise }) => {
  // Integramos el custom hook pasando el nombre descriptivo para el PDF
  const { printRef, handlePrint } = useAppPrint('Ejercicios-Resueltos-TP2');

  const exercises: ExerciseItem[] = [
    {
      id: 'ej-7a',
      title: 'Ejercicio 7 - Inciso A: x - cos(x) = 0',
      description: 'Encontrar la raíz mediante el método de Newton-Raphson con tolerancia 10⁻⁴.',
      method: 'newton',
      expression: 'x - cos(x)',
      latexExpr: 'f(x) = x - \\cos(x)',
      latexFPrime: "f'(x) = 1 + \\sin(x)",
      x0: 0.7854,
      tolerance: 1e-4,
      maxIterations: 25,
      expectedRoot: 0.739085,
      analyticalRoots: 'Número de Dottie (Punto fijo del coseno)',
      stepsSummary: [
        'Evaluación inicial en x₀ = π/4 ≈ 0.7854: f(0.7854) = 0.07829',
        'Primera derivada en x₀: f\'(0.7854) = 1.7071',
        'Primera iteración: x₁ = 0.7854 - (0.07829 / 1.7071) = 0.7395',
        'Convergencia alcanzada en 3 iteraciones con cota |xₙ₊₁ - xₙ| < 10⁻⁴',
      ],
    },
    {
      id: 'ej-7b',
      title: 'Ejercicio 7 - Inciso B: x³ - 2x - 5 = 0',
      description: 'Búsqueda de la única raíz real del polinomio cúbico en el intervalo [1, 2].',
      method: 'newton',
      expression: 'x**3 - 2*x - 5',
      latexExpr: 'f(x) = x^3 - 2x - 5',
      latexFPrime: "f'(x) = 3x^2 - 2",
      x0: 2.0,
      tolerance: 1e-4,
      maxIterations: 25,
      expectedRoot: 2.094551,
      analyticalRoots: 'Única raíz real real en x ≈ 2.09455',
      stepsSummary: [
        'Evaluación inicial en x₀ = 2.0: f(2) = -1.0, f\'(2) = 10.0',
        'Primera corrección de Newton: x₁ = 2.0 - (-1.0 / 10.0) = 2.10',
        'Evaluación en x₁: f(2.10) = 0.061, f\'(2.10) = 11.23',
        'Segunda iteración: x₂ = 2.09456, logrando la precisión solicitada',
      ],
    },
    {
      id: 'ej-7c',
      title: 'Ejercicio 7 - Inciso C: e⁻ˣ - x = 0',
      description: 'Cálculo de intersección trascendente exponencial-lineal.',
      method: 'newton',
      expression: 'exp(-x) - x',
      latexExpr: 'f(x) = e^{-x} - x',
      latexFPrime: "f'(x) = -e^{-x} - 1",
      x0: 0.5,
      tolerance: 1e-4,
      maxIterations: 25,
      expectedRoot: 0.567143,
      analyticalRoots: 'Constante Omega de Lambert (Ω ≈ 0.567143)',
      stepsSummary: [
        'Evaluación inicial en x₀ = 0.5: f(0.5) = 0.10653, f\'(0.5) = -1.60653',
        'Cálculo de x₁ = 0.5 - (0.10653 / -1.60653) = 0.56631',
        'Convergencia cuadrática progresiva hasta alcanzar la tolerancia |xₙ₊₁ - xₙ| < 10⁻⁴',
      ],
    },
    {
      id: 'ej-8',
      title: 'Ejercicio 8: Método de Punto Fijo (g(x) = 0.8 + 0.2·sen(x))',
      description: 'Análisis de convergencia y cálculo iterativo del punto fijo x = g(x).',
      method: 'fixed-point',
      expression: '0.8 + 0.2*sin(x)',
      latexExpr: 'g(x) = 0.8 + 0.2\\sin(x)',
      latexFPrime: "g'(x) = 0.2\\cos(x)",
      x0: 0.7854,
      tolerance: 1e-4,
      maxIterations: 25,
      expectedRoot: 0.964334,
      analyticalRoots: 'Criterio de convergencia: |g\'(x)| ≤ 0.2 < 1 (Garantizado)',
      stepsSummary: [
        'Verificación previa del Teorema de Existencia y Unicidad',
        'Constante de Lipschitz k = 0.2 < 1 asegura convergencia rápida',
        'Iteración 1: x₁ = g(0.7854) = 0.9414',
        'Iteración 2: x₂ = g(0.9414) = 0.9617',
        'Convergencia monótona en 5 iteraciones.',
      ],
    },
    {
      id: 'ej-9',
      title: 'Ejercicio 9: Concentración de Bacterias en Río (TP2)',
      description:
        'Caso de aplicación en Ingeniería Ambiental: determinar el tiempo t (en horas) para el cual la concentración de bacterias cae a un nivel seguro de 9 partes/millón.',
      method: 'newton',
      expression: '70*exp(-1.5*x) + 25*exp(-0.075*x) - 9',
      latexExpr: 'C(t) = 70e^{-1.5t} + 25e^{-0.075t} - 9',
      latexFPrime: "C'(t) = -105e^{-1.5t} - 1.875e^{-0.075t}",
      x0: 1.0,
      tolerance: 1e-4,
      maxIterations: 25,
      expectedRoot: 13.598,
      analyticalRoots: 'Interpretación física: t ≈ 13.6 horas para desinfección',
      stepsSummary: [
        'Evaluación del modelo de transporte de contaminantes con dos tasas de decaimiento exponencial',
        'Derivación analítica de la tasa de cambio C\'(t) en función del tiempo t',
        'Evaluación en t₀ = 1.0: C(1.0) = 20.81, C\'(1.0) = -25.17',
        'Estabilización de las iteraciones numéricas hasta obtener la raíz en t ≈ 13.598 horas',
      ],
      isEngineeringStar: true,
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Banner de Acción */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900">Ejercicios de la Guía Oficial TP2</h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Resolución paso a paso de los Ejercicios 7 (incisos A, B, C), Ejercicio 8 y Ejercicio 9.
          </p>
        </div>
        <button
          onClick={() => handlePrint()}
          className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Printer size={16} />
          <span>Imprimir Guía Completa PDF</span>
        </button>
      </div>

      {/* CONTENEDOR IMPRIMIBLE (Vinculado a la ref del hook) */}
      <div ref={printRef} className="space-y-6">
        {exercises.map((ex) => (
          <div
            key={ex.id}
            className={`exercise-card bg-white rounded-3xl border p-6 sm:p-8 shadow-sm space-y-5 print:border-slate-300 print:shadow-none ${
              ex.isEngineeringStar
                ? 'border-slate-900 ring-2 ring-slate-900/10'
                : 'border-slate-200'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    {ex.method === 'newton' ? 'Método de Newton' : 'Punto Fijo'}
                  </span>
                  {ex.isEngineeringStar && (
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
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer print:hidden"
              >
                <Play size={14} />
                <span>Probar en el Simulador</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{ex.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormulaDisplay label={ex.method === 'newton' ? 'f(x)' : 'g(x)'} formula={ex.latexExpr} />
              <FormulaDisplay label={ex.method === 'newton' ? "f'(x)" : "g'(x)"} formula={ex.latexFPrime} />
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-3 print:bg-white">
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