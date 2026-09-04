import React from 'react';
import FormulaDisplay from '../../components/FormulaDisplay';
import { Play, Award, Printer } from 'lucide-react';
import { useAppPrint } from '../../hooks/useAppPrint';
import type { SolverConfig, RootMethod } from '../../types/roots';
import ExerciseStepAccordion from '../../components/roots/ExerciseStepAccordion';

export interface ExerciseItem {
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
  analyticalRoots?: string;
  iterations: string[];
  isEngineeringStar?: boolean;
}

interface ExercisesSectionProps {
  onLoadExercise: (config: SolverConfig) => void;
}

export const ExercisesSection: React.FC<ExercisesSectionProps> = ({ onLoadExercise }) => {
  const { printRef, handlePrint } = useAppPrint('Ejercicios-Resueltos-TP2');

  const exercises: ExerciseItem[] = [
    // --- PROBLEMA 7 ---
    {
      id: 'ej-7a1',
      title: 'Problema 7 - Inciso a1: f(x) = x² - 4x - 45 (x₀ = 0.5)',
      description: 'Estimar el valor aproximado de la raíz que se obtiene al aplicar el método de Newton con 4 iteraciones partiendo de x₀ = 0.5.',
      method: 'newton',
      expression: 'x**2 - 4*x - 45',
      latexExpr: 'f(x) = x^2 - 4x - 45',
      latexFPrime: "f'(x) = 2x - 4",
      x0: 0.5,
      tolerance: 1e-4,
      maxIterations: 4,
      expectedRoot: -5.0,
      iterations: [
        'x_0 = 0.5 - \\frac{(0.5)^2 - 4(0.5) - 45}{2(0.5) - 4} = 0.5 - \\frac{-46.75}{-3.0} = -15.0833',
        'x_1 = -15.0833 - \\frac{(-15.0833)^2 - 4(-15.0833) - 45}{2(-15.0833) - 4} = -15.0833 - \\frac{242.84}{-34.17} = -7.9758',
        'x_2 = -7.9758 - \\frac{(-7.9758)^2 - 4(-7.9758) - 45}{2(-7.9758) - 4} = -7.9758 - \\frac{50.52}{-19.95} = -5.4438',
        'x_3 = -5.4438 - \\frac{(-5.4438)^2 - 4(-5.4438) - 45}{2(-5.4438) - 4} = -5.4438 - \\frac{6.41}{-14.89} = -5.0132 \\approx -5',
      ],
    },
    {
      id: 'ej-7a2',
      title: 'Problema 7 - Inciso a2: f(x) = x² - 4x - 45 (x₀ = 4)',
      description: 'Estimar el valor aproximado de la raíz que se obtiene al aplicar el método de Newton con 4 iteraciones partiendo de x₀ = 4.',
      method: 'newton',
      expression: 'x**2 - 4*x - 45',
      latexExpr: 'f(x) = x^2 - 4x - 45',
      latexFPrime: "f'(x) = 2x - 4",
      x0: 4.0,
      tolerance: 1e-4,
      maxIterations: 4,
      expectedRoot: 9.0,
      iterations: [
        'x_0 = 4 - \\frac{4^2 - 4(4) - 45}{2(4) - 4} = 4 - \\frac{-45.0}{4.0} = 15.2500',
        'x_1 = 15.25 - \\frac{(15.25)^2 - 4(15.25) - 45}{2(15.25) - 4} = 15.25 - \\frac{126.56}{26.50} = 10.4741',
        'x_2 = 10.4741 - \\frac{(10.4741)^2 - 4(10.4741) - 45}{2(10.4741) - 4} = 10.4741 - \\frac{22.81}{16.95} = 9.1282',
        'x_3 = 9.1282 - \\frac{(9.1282)^2 - 4(9.1282) - 45}{2(9.1282) - 4} = 9.1282 - \\frac{1.81}{14.26} = 9.0012 \\approx 9',
      ],
    },
    {
      id: 'ej-7b',
      title: 'Problema 7 - Inciso b: f(x) = x - 0.8 - 0.2·sen(x) (x₀ = π/4)',
      description: 'Estimar el valor aproximado de la raíz con 4 iteraciones partiendo de x₀ = π/4 (0.7854 rad).',
      method: 'newton',
      expression: 'x - 0.8 - 0.2*sin(x)',
      latexExpr: 'f(x) = x - 0.8 - 0.2\\sin(x)',
      latexFPrime: "f'(x) = 1 - 0.2\\cos(x)",
      x0: 0.7854,
      tolerance: 1e-4,
      maxIterations: 4,
      expectedRoot: 0.964334,
      iterations: [
        'x_0 = \\frac{\\pi}{4} - \\frac{\\frac{\\pi}{4} - 0.8 - 0.2\\sin\\left(\\frac{\\pi}{4}\\right)}{1 - 0.2\\cos\\left(\\frac{\\pi}{4}\\right)} = 0.7854 - \\frac{-0.1560}{0.8586} = 0.9671',
        'x_1 = 0.9671 - \\frac{0.9671 - 0.8 - 0.2\\sin(0.9671)}{1 - 0.2\\cos(0.9671)} = 0.9671 - \\frac{0.0025}{0.8865} = 0.9643',
        'x_2 = 0.9643 - \\frac{0.9643 - 0.8 - 0.2\\sin(0.9643)}{1 - 0.2\\cos(0.9643)} = 0.9643 - \\frac{0.0000}{0.8860} = 0.9643',
        'x_3 = 0.9643 - \\frac{0.9643 - 0.8 - 0.2\\sin(0.9643)}{1 - 0.2\\cos(0.9643)} = 0.9643',
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
      iterations: [
        'x_0 = \\frac{\\pi}{4} - \\frac{\\frac{\\pi}{4} - \\cos\\left(\\frac{\\pi}{4}\\right)}{1 + \\sin\\left(\\frac{\\pi}{4}\\right)} = 0.7854 - \\frac{0.0783}{1.7071} = 0.7395',
        'x_1 = 0.7395 - \\frac{0.7395 - \\cos(0.7395)}{1 + \\sin(0.7395)} = 0.7395 - \\frac{0.0008}{1.6739} = 0.7391',
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
      expectedRoot: 1.0650,
      analyticalRoots: 'Raíz real en x ≈ 1.0650',
      iterations: [
        'x_0 = \\frac{\\pi}{4} - \\frac{e^{\\pi/4} + 2\\left(\\frac{\\pi}{4}\\right) + 2\\cos\\left(\\frac{\\pi}{4}\\right) - 6}{e^{\\pi/4} + 2 - 2\\sin\\left(\\frac{\\pi}{4}\\right)} = 0.7854 - \\frac{-0.8217}{2.7791} = 1.0811',
        'x_1 = 1.0811 - \\frac{e^{1.0811} + 2(1.0811) + 2\\cos(1.0811) - 6}{e^{1.0811} + 2 - 2\\sin(1.0811)} = 1.0811 - \\frac{0.0508}{3.1829} = 1.0651',
        'x_2 = 1.0651 - \\frac{e^{1.0651} + 2(1.0651) + 2\\cos(1.0651) - 6}{e^{1.0651} + 2 - 2\\sin(1.0651)} = 1.0651 - \\frac{0.0003}{3.1515} = 1.0650',
      ],
    },
    {
      id: 'ej-8c1',
      title: 'Problema 8 - Inciso c1: f(x) = x³ - 2x² - 3x - 10 (x₀ = 1.9)',
      description: 'Estimar la raíz de f(x) = x³ - 2x² - 3x - 10 con error < 10⁻³ usando x₀ = 1.9.',
      method: 'newton',
      expression: 'x**3 - 2*x**2 - 3*x - 10',
      latexExpr: 'f(x) = x^3 - 2x^2 - 3x - 10',
      latexFPrime: "f'(x) = 3x^2 - 4x - 3",
      x0: 1.9,
      tolerance: 1e-3,
      maxIterations: 25,
      expectedRoot: 3.6030,
      analyticalRoots: 'Única raíz real x ≈ 3.6030',
      iterations: [
        'x_0 = 1.9 - \\frac{(1.9)^3 - 2(1.9)^2 - 3(1.9) - 10}{3(1.9)^2 - 4(1.9) - 3} = 1.9 - \\frac{-16.0610}{0.2300} = 71.7304',
        'x_1 = 71.7304 - \\frac{(71.7304)^3 - 2(71.7304)^2 - 3(71.7304) - 10}{3(71.7304)^2 - 4(71.7304) - 3} = 71.7304 - \\frac{358555.70}{15145.84} = 48.0569',
        'x_2 = 48.0569 - \\frac{(48.0569)^3 - 2(48.0569)^2 - 3(48.0569) - 10}{3(48.0569)^2 - 4(48.0569) - 3} = 48.0569 - \\frac{106212.64}{6733.17} = 32.2824',
        'x_3 = 32.2824 - \\frac{(32.2824)^3 - 2(32.2824)^2 - 3(32.2824) - 10}{3(32.2824)^2 - 4(32.2824) - 3} = 32.2824 - \\frac{31451.93}{2994.32} = 21.7785',
      ],
    },
    {
      id: 'ej-8c2',
      title: 'Problema 8 - Inciso c2: f(x) = x³ - 2x² - 3x - 10 (x₀ = -3.0)',
      description: 'Estimar la raíz de f(x) = x³ - 2x² - 3x - 10 con error < 10⁻³ usando x₀ = -3.0.',
      method: 'newton',
      expression: 'x**3 - 2*x**2 - 3*x - 10',
      latexExpr: 'f(x) = x^3 - 2x^2 - 3x - 10',
      latexFPrime: "f'(x) = 3x^2 - 4x - 3",
      x0: -3.0,
      tolerance: 1e-3,
      maxIterations: 25,
      expectedRoot: 3.6030,
      analyticalRoots: 'Única raíz real x ≈ 3.6030',
      iterations: [
        'x_0 = -3.0 - \\frac{(-3.0)^3 - 2(-3.0)^2 - 3(-3.0) - 10}{3(-3.0)^2 - 4(-3.0) - 3} = -3.0 - \\frac{-46.0000}{36.0000} = -1.7222',
        'x_1 = -1.7222 - \\frac{(-1.7222)^3 - 2(-1.7222)^2 - 3(-1.7222) - 10}{3(-1.7222)^2 - 4(-1.7222) - 3} = -1.7222 - \\frac{-15.8736}{12.7870} = -0.4808',
        'x_2 = -0.4808 - \\frac{(-0.4808)^3 - 2(-0.4808)^2 - 3(-0.4808) - 10}{3(-0.4808)^2 - 4(-0.4808) - 3} = -0.4808 - \\frac{-9.1311}{-0.3830} = -24.3197',
        'x_3 = -24.3197 - \\frac{(-24.3197)^3 - 2(-24.3197)^2 - 3(-24.3197) - 10}{3(-24.3197)^2 - 4(-24.3197) - 3} = -24.3197 - \\frac{-15503.68}{1868.62} = -16.0228',
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
      expectedRoot: 2.3291,
      analyticalRoots: 'Interpretación física: t ≈ 2.33 horas (2 horas y 20 minutos)',
      iterations: [
        't_0 = 1.0 - \\frac{80e^{-2(1.0)} + 20e^{-0.5(1.0)} - 7}{-160e^{-2(1.0)} - 10e^{-0.5(1.0)}} = 1.0 - \\frac{15.9574}{-27.7190} = 1.5757',
        't_1 = 1.5757 - \\frac{80e^{-2(1.5757)} + 20e^{-0.5(1.5757)} - 7}{-160e^{-2(1.5757)} - 10e^{-0.5(1.5757)}} = 1.5757 - \\frac{5.5200}{-11.3952} = 2.0601',
        't_2 = 2.0601 - \\frac{80e^{-2(2.0601)} + 20e^{-0.5(2.0601)} - 7}{-160e^{-2(2.0601)} - 10e^{-0.5(2.0601)}} = 2.0601 - \\frac{1.4391}{-6.1685} = 2.2934',
        't_3 = 2.2934 - \\frac{80e^{-2(2.2934)} + 20e^{-0.5(2.2934)} - 7}{-160e^{-2(2.2934)} - 10e^{-0.5(2.2934)}} = 2.2934 - \\frac{0.1685}{-4.8065} = 2.3285',
      ],
      isEngineeringStar: true,
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Banner de Acción */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900">Ejercicios Resueltos - TP Nº 2</h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Resolución de los Problemas 7, 8 y 9 del Trabajo Práctico.
          </p>
        </div>
        <button
          type="button"
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
                type="button"
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

            {/* DESARROLLO PASO A PASO DESPLEGABLE */}
            <ExerciseStepAccordion
              iterations={ex.iterations}
              analyticalRoots={ex.analyticalRoots}
              expectedRoot={ex.expectedRoot}
              isOpenDefault={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExercisesSection;