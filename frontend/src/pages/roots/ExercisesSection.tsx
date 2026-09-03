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
  const { printRef, handlePrint } = useAppPrint('Ejercicios-Resueltos-TP2-Amiconi');

  const exercises: ExerciseItem[] = [
    // --- PROBLEMA 7 ---
    {
      id: 'ej-7a1',
      title: 'Problema 7 - Inciso a1: Polinomio Cuadrático (x₀ = 0.5)',
      description: 'Estimar el valor de la raíz con el método de Newton realizando 4 iteraciones partiendo de x₀ = 0.5.',
      method: 'newton',
      expression: 'x**2 - 4*x - 45',
      latexExpr: 'f(x) = x^2 - 4x - 45',
      latexFPrime: "f'(x) = 2x - 4",
      x0: 0.5,
      tolerance: 1e-4,
      maxIterations: 4,
      expectedRoot: -5.0,
      analyticalRoots: 'Raíces analíticas exactas: x = 9 y x = -5',
      stepsSummary: [
        'Evaluación inicial en x₀ = 0.5: f(0.5) = -46.75, f\'(0.5) = -3.0',
        'Cálculo de x₁ = 0.5 - (-46.75 / -3.0) = -15.0833',
        'Evaluación en x₁: f(-15.0833) = 242.84, f\'(-15.0833) = -34.1666',
        'Convergencia hacia la raíz negativa x = -5 en 4 iteraciones.',
      ],
    },
    {
      id: 'ej-7a2',
      title: 'Problema 7 - Inciso a2: Polinomio Cuadrático (x₀ = 4.0)',
      description: 'Estimar el valor de la raíz con el método de Newton realizando 4 iteraciones partiendo de x₀ = 4.0.',
      method: 'newton',
      expression: 'x**2 - 4*x - 45',
      latexExpr: 'f(x) = x^2 - 4x - 45',
      latexFPrime: "f'(x) = 2x - 4",
      x0: 4.0,
      tolerance: 1e-4,
      maxIterations: 4,
      expectedRoot: 9.0,
      analyticalRoots: 'Raíces analíticas exactas: x = 9 y x = -5',
      stepsSummary: [
        'Evaluación inicial en x₀ = 4.0: f(4) = -45.0, f\'(4) = 4.0',
        'Cálculo de x₁ = 4.0 - (-45.0 / 4.0) = 15.25',
        'Evaluación en x₁: f(15.25) = 126.56, f\'(15.25) = 26.5',
        'Convergencia hacia la raíz positiva x = 9 en 4 iteraciones.',
      ],
    },
    {
      id: 'ej-7b',
      title: 'Problema 7 - Inciso b: Ecuación Trigonométrica Perturbada',
      description: 'Estimar el valor aproximado de la raíz con 4 iteraciones partiendo de x₀ = π/4 (0.7854 rad).',
      method: 'newton',
      expression: 'x - 0.8 - 0.2*sin(x)',
      latexExpr: 'f(x) = x - 0.8 - 0.2\\sin(x)',
      latexFPrime: "f'(x) = 1 - 0.2\\cos(x)",
      x0: 0.7854,
      tolerance: 1e-4,
      maxIterations: 4,
      expectedRoot: 0.964334,
      analyticalRoots: 'Raíz única en el dominio real x ≈ 0.964334',
      stepsSummary: [
        'Evaluación inicial en x₀ = 0.7854: f(0.7854) = -0.1560, f\'(0.7854) = 0.8586',
        'Cálculo de x₁ = 0.7854 - (-0.1560 / 0.8586) = 0.9671',
        'Evaluación en x₁: f(0.9671) = 0.0024, f\'(0.9671) = 0.8865',
        'Convergencia de alta precisión obtenida al cabo de 4 iteraciones.',
      ],
    },

    // --- PROBLEMA 8 ---
    {
      id: 'ej-8a',
      title: 'Problema 8 - Inciso a: x - cos(x) = 0',
      description: 'Estimar mediante Newton con error < 10⁻³ partiendo de x₀ = π/4 (0.7854 rad).',
      method: 'newton',
      expression: 'x - cos(x)',
      latexExpr: 'f(x) = x - \\cos(x)',
      latexFPrime: "f'(x) = 1 + \\sin(x)",
      x0: 0.7854,
      tolerance: 1e-3,
      maxIterations: 25,
      expectedRoot: 0.739085,
      analyticalRoots: 'Número de Dottie (Punto fijo universal del coseno)',
      stepsSummary: [
        'Evaluación inicial en x₀ = 0.7854: f(0.7854) = 0.07829, f\'(0.7854) = 1.7071',
        'Iteración 1: x₁ = 0.7854 - (0.07829 / 1.7071) = 0.7395',
        'Iteración 2: x₂ = 0.7391, logrando un error |x₂ - x₁| < 10⁻³.',
      ],
    },
    {
      id: 'ej-8b',
      title: 'Problema 8 - Inciso b: eˣ + 2x + 2·cos(x) - 6 = 0',
      description: 'Resolver mediante Newton con un error < 10⁻³ partiendo de x₀ = π/4 (0.7854 rad).',
      method: 'newton',
      expression: 'exp(x) + 2*x + 2*cos(x) - 6',
      latexExpr: 'f(x) = e^x + 2x + 2\\cos(x) - 6',
      latexFPrime: "f'(x) = e^x + 2 - 2\\sin(x)",
      x0: 0.7854,
      tolerance: 1e-3,
      maxIterations: 25,
      expectedRoot: 0.828833,
      analyticalRoots: 'Raíz en x ≈ 0.8288',
      stepsSummary: [
        'Evaluación inicial en x₀ = 0.7854: f(0.7854) = -0.8208, f\'(0.7854) = 2.7792',
        'Iteración 1: x₁ = 0.7854 - (-0.8208 / 2.7792) = 1.0807',
        'Iteración 2: x₂ = 0.8525, Iteración 3: x₃ = 0.8289',
        'Cumple con el criterio de paro de error < 10⁻³.',
      ],
    },
    {
      id: 'ej-8c1',
      title: 'Problema 8 - Inciso c1: Polinomio Cúbico (x₀ = 1.9)',
      description: 'Estimar la raíz de f(x) = x³ - 2x² - 3x - 10 con error < 10⁻³ usando x₀ = 1.9.',
      method: 'newton',
      expression: 'x**3 - 2*x**2 - 3*x - 10',
      latexExpr: 'f(x) = x^3 - 2x^2 - 3x - 10',
      latexFPrime: "f'(x) = 3x^2 - 4x - 3",
      x0: 1.9,
      tolerance: 1e-3,
      maxIterations: 25,
      expectedRoot: 3.425938,
      analyticalRoots: 'Única raíz real x ≈ 3.4259',
      stepsSummary: [
        'Evaluación inicial en x₀ = 1.9: f(1.9) = -16.061, f\'(1.9) = 0.23',
        'Debido al valor pequeño de f\'(1.9), el primer salto x₁ resulta grande (x₁ = 71.73)',
        'El método recalibra en las siguientes iteraciones hasta estabilizarse en la raíz x ≈ 3.4259.',
      ],
    },
    {
      id: 'ej-8c2',
      title: 'Problema 8 - Inciso c2: Polinomio Cúbico (x₀ = -3.0)',
      description: 'Estimar la raíz de f(x) = x³ - 2x² - 3x - 10 con error < 10⁻³ usando x₀ = -3.0.',
      method: 'newton',
      expression: 'x**3 - 2*x**2 - 3*x - 10',
      latexExpr: 'f(x) = x^3 - 2x^2 - 3x - 10',
      latexFPrime: "f'(x) = 3x^2 - 4x - 3",
      x0: -3.0,
      tolerance: 1e-3,
      maxIterations: 25,
      expectedRoot: 3.425938,
      analyticalRoots: 'Única raíz real x ≈ 3.4259',
      stepsSummary: [
        'Evaluación inicial en x₀ = -3.0: f(-3) = -46.0, f\'(-3) = 36.0',
        'Iteración 1: x₁ = -3.0 - (-46.0 / 36.0) = -1.7222',
        'Avanza a través de la zona plana hasta aproximar y converger en la raíz real x ≈ 3.4259.',
      ],
    },

    // --- PROBLEMA 9 ---
    {
      id: 'ej-9',
      title: 'Problema 9: Concentración de Bacterias en Lago',
      description:
        'Determinar el tiempo t (en horas) necesario para que la concentración de bacterias se reduzca a c(t) = 7. Expresión: 80e⁻²ᵗ + 20e⁻⁰.⁵ᵗ = 7.',
      method: 'newton',
      expression: '80*exp(-2*x) + 20*exp(-0.5*x) - 7',
      latexExpr: 'c(t) = 80e^{-2t} + 20e^{-0.5t} - 7',
      latexFPrime: "c'(t) = -160e^{-2t} - 10e^{-0.5t}",
      x0: 1.0,
      tolerance: 1e-4,
      maxIterations: 25,
      expectedRoot: 2.0722,
      analyticalRoots: 'Interpretación física: t ≈ 2.07 horas (2 hs 4 min)',
      stepsSummary: [
        'Planteo de f(t) = 80e⁻²ᵗ + 20e⁻⁰.⁵ᵗ - 7 = 0',
        'Derivada C\'(t) = -160e⁻²ᵗ - 10e⁻⁰.⁵ᵗ',
        'Evaluación inicial en t₀ = 1.0: f(1.0) = 5.9547, f\'(1.0) = -27.7082',
        'Iteración 1: t₁ = 1.0 - (5.9547 / -27.7082) = 1.2149',
        'Convergencia obtenida en t ≈ 2.0722 horas.',
      ],
      isEngineeringStar: true,
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Banner de Acción */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900">Ejercicios Resueltos - TP Nº 2 (Cátedra Amiconi)</h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Resolución oficial completa de los Problemas 7, 8 y 9 del Trabajo Práctico.
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

      {/* CONTENEDOR IMPRIMIBLE */}
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
                    Método de Newton
                  </span>
                  {ex.isEngineeringStar && (
                    <span className="text-xs font-black uppercase tracking-widest text-white bg-slate-900 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <Award size={14} /> Aplicación de Ingeniería
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
              <FormulaDisplay label="f(x)" formula={ex.latexExpr} />
              <FormulaDisplay label="f'(x)" formula={ex.latexFPrime} />
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