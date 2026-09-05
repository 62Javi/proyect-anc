import React from 'react';
import FormulaDisplay from '../../components/FormulaDisplay';
import { Play, Award, Printer } from 'lucide-react';
import { useAppPrint } from '../../hooks/useAppPrint';
import type { SolverConfig, RootMethod } from '../../types/roots';
import InlineMath from '../../components/InlineMath';
import ExerciseStepAccordion, { type StepIteration } from '../../components/roots/ExerciseStepAccordion';

export interface ExerciseItem {
  id: string;
  title: React.ReactNode;
  description: React.ReactNode;
  method: RootMethod;
  expression: string;
  latexExpr: string;
  latexFPrime: string;
  x0: number;
  tolerance: number;
  maxIterations: number;
  expectedRoot: number;
  iterations: StepIteration[];
  isEngineeringStar?: boolean;
  preliminarySteps?: React.ReactNode;
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
      expression: 'x^2 - 4x - 45',
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
      expression: 'x^2 - 4x - 45',
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
      expression: 'x - 0.8 - 0.2sin(x)',
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
      title: 'Problema 8 - Inciso a: f(x) = x - cos(x) (x₀ = π/4)',
      description: 'Estimar mediante Newton con error < 10⁻³ partiendo de x₀ = π/4 (0.7854 rad).',
      method: 'newton',
      expression: 'x - cos(x)',
      latexExpr: 'f(x) = x - \\cos(x)',
      latexFPrime: "f'(x) = 1 + \\sin(x)",
      x0: 0.7854,
      tolerance: 1e-3,
      maxIterations: 25,
      expectedRoot: 0.739085,
      iterations: [
        {
          formula: 'x_0 = \\frac{\\pi}{4} - \\frac{\\frac{\\pi}{4} - \\cos\\left(\\frac{\\pi}{4}\\right)}{1 + \\sin\\left(\\frac{\\pi}{4}\\right)} = 0.7854 - \\frac{0.0783}{1.7071} = 0.739536',
          error: '\\text{Error: } |x_1 - x_0| = |0.739536 - 0.785398| = 0.045862 \\nless 0.001 \\text{ (continúa)}',
        },
        {
          formula: 'x_1 = 0.739536 - \\frac{0.739536 - \\cos(0.739536)}{1 + \\sin(0.739536)} = 0.739536 - \\frac{0.000755}{1.673945} = 0.739085',
          error: '\\text{Error: } |x_2 - x_1| = |0.739085 - 0.739536| = 0.000451 < 0.001 \\text{ (cumple condición de parada)}',
        },
      ],
    },
    {
      id: 'ej-8b',
      title: 'Problema 8 - Inciso b: f(x) = eˣ + 2x + 2·cos(x) - 6 (x₀ = π/4)',
      description: 'Resolver mediante Newton con un error < 10⁻³ partiendo de x₀ = π/4 (0.7854 rad).',
      method: 'newton',
      expression: 'exp(x) + 2x + 2cos(x) - 6',
      latexExpr: 'f(x) = e^x + 2x + 2\\cos(x) - 6',
      latexFPrime: "f'(x) = e^x + 2 - 2\\sin(x)",
      x0: 0.7854,
      tolerance: 1e-3,
      maxIterations: 25,
      expectedRoot: 1.0650,
      iterations: [
        {
          formula: 'x_0 = \\frac{\\pi}{4} - \\frac{e^{\\pi/4} + 2\\left(\\frac{\\pi}{4}\\right) + 2\\cos\\left(\\frac{\\pi}{4}\\right) - 6}{e^{\\pi/4} + 2 - 2\\sin\\left(\\frac{\\pi}{4}\\right)} = 0.7854 - \\frac{-0.8217}{2.7791} = 1.081077',
          error: '\\text{Error: } |x_1 - x_0| = |1.081077 - 0.785398| = 0.295679 \\nless 0.001 \\text{ (continúa)}',
        },
        {
          formula: 'x_1 = 1.0811 - \\frac{e^{1.0811} + 2(1.0811) + 2\\cos(1.0811) - 6}{e^{1.0811} + 2 - 2\\sin(1.0811)} = 1.081077 - \\frac{0.050762}{3.182922} = 1.065128',
          error: '\\text{Error: } |x_2 - x_1| = |1.065128 - 1.081077| = 0.015949 \\nless 0.001 \\text{ (continúa)}',
        },
        {
          formula: 'x_2 = 1.0651 - \\frac{e^{1.0651} + 2(1.0651) + 2\\cos(1.0651) - 6}{e^{1.0651} + 2 - 2\\sin(1.0651)} = 1.065128 - \\frac{0.000252}{3.151509} = 1.065048',
          error: '\\text{Error: } |x_3 - x_2| = |1.065048 - 1.065128| = 0.000080 < 0.001 \\text{ (cumple condición de parada)}',
        },
      ],
    },
    {
      id: 'ej-8c1',
      title: 'Problema 8 - Inciso c1: f(x) = x³ - 2x² - 3x + 10 (x₀ = 1.9)',
      description: 'Estimar la raíz de f(x) = x³ - 2x² - 3x + 10 con error < 10⁻³ usando x₀ = 1.9.',
      method: 'newton',
      expression: 'x^3 - 2x^2 - 3x + 10',
      latexExpr: 'f(x) = x^3 - 2x^2 - 3x + 10',
      latexFPrime: "f'(x) = 3x^2 - 4x - 3",
      x0: 1.9,
      tolerance: 1e-3,
      maxIterations: 25,
      expectedRoot: -2.0,
      iterations: [
        {
          formula: 'x_0 = 1.9 - \\frac{(1.9)^3 - 2(1.9)^2 - 3(1.9) + 10}{3(1.9)^2 - 4(1.9) - 3} = 1.9 - \\frac{3.9390}{0.2300} = -15.2261',
          error: '\\text{Error: } |x_1 - x_0| = |-15.2261 - 1.9000| = 17.1261 \\nless 0.001 \\text{ (continúa)}',
        },
        {
          formula: 'x_1 = -15.2261 - \\frac{(-15.2261)^3 - 2(-15.2261)^2 - 3(-15.2261) + 10}{3(-15.2261)^2 - 4(-15.2261) - 3} = -15.2261 - \\frac{-3937.9096}{753.4055} = -9.9993',
          error: '\\text{Error: } |x_2 - x_1| = |-9.9993 - (-15.2261)| = 5.2268 \\nless 0.001 \\text{ (continúa)}',
        },
        {
          formula: 'x_2 = -9.9993 - \\frac{(-9.9993)^3 - 2(-9.9993)^2 - 3(-9.9993) + 10}{3(-9.9993)^2 - 4(-9.9993) - 3} = -9.9993 - \\frac{-1159.7554}{336.9535} = -6.5574',
          error: '\\text{Error: } |x_3 - x_2| = |-6.5574 - (-9.9993)| = 3.4419 \\nless 0.001 \\text{ (continúa)}',
        },
        {
          formula: 'x_3 = -6.5574 - \\frac{(-6.5574)^3 - 2(-6.5574)^2 - 3(-6.5574) + 10}{3(-6.5574)^2 - 4(-6.5574) - 3} = -6.5574 - \\frac{-338.2900}{152.2276} = -4.3351',
          error: '\\text{Error: } |x_4 - x_3| = |-4.3351 - (-6.5574)| = 2.2223 \\nless 0.001 \\text{ (continúa)}',
        },
        {
          formula: 'x_4 = -4.3351 - \\frac{(-4.3351)^3 - 2(-4.3351)^2 - 3(-4.3351) + 10}{3(-4.3351)^2 - 4(-4.3351) - 3} = -4.3351 - \\frac{-96.0526}{70.7204} = -2.9769',
          error: '\\text{Error: } |x_5 - x_4| = |-2.9769 - (-4.3351)| = 1.3582 \\nless 0.001 \\text{ (continúa)}',
        },
        {
          formula: 'x_5 = -2.9769 - \\frac{(-2.9769)^3 - 2(-2.9769)^2 - 3(-2.9769) + 10}{3(-2.9769)^2 - 4(-2.9769) - 3} = -2.9769 - \\frac{-25.1751}{35.4939} = -2.2676',
          error: '\\text{Error: } |x_6 - x_5| = |-2.2676 - (-2.9769)| = 0.7093 \\nless 0.001 \\text{ (continúa)}',
        },
        {
          formula: 'x_6 = -2.2676 - \\frac{(-2.2676)^3 - 2(-2.2676)^2 - 3(-2.2676) + 10}{3(-2.2676)^2 - 4(-2.2676) - 3} = -2.2676 - \\frac{-5.1422}{21.4972} = -2.0284',
          error: '\\text{Error: } |x_7 - x_6| = |-2.0284 - (-2.2676)| = 0.2392 \\nless 0.001 \\text{ (continúa)}',
        },
        {
          formula: 'x_7 = -2.0284 - \\frac{(-2.0284)^3 - 2(-2.0284)^2 - 3(-2.0284) + 10}{3(-2.0284)^2 - 4(-2.0284) - 3} = -2.0284 - \\frac{-0.4900}{17.4575} = -2.0004',
          error: '\\text{Error: } |x_8 - x_7| = |-2.0004 - (-2.0284)| = 0.0281 \\nless 0.001 \\text{ (continúa)}',
        },
        {
          formula: 'x_8 = -2.0004 - \\frac{(-2.0004)^3 - 2(-2.0004)^2 - 3(-2.0004) + 10}{3(-2.0004)^2 - 4(-2.0004) - 3} = -2.0004 - \\frac{-0.0063}{17.0060} = -2.0000',
          error: '\\text{Error: } |x_9 - x_8| = |-2.0000 - (-2.0004)| = 0.0004 < 0.001 \\text{ (cumple condición de parada)}',
        },
      ],
    },
    {
      id: 'ej-8c2',
      title: 'Problema 8 - Inciso c2: f(x) = x³ - 2x² - 3x + 10 (x₀ = -3.0)',
      description: 'Estimar la raíz de f(x) = x³ - 2x² - 3x + 10 con error < 10⁻³ usando x₀ = -3.0.',
      method: 'newton',
      expression: 'x^3 - 2x^2 - 3x + 10',
      latexExpr: 'f(x) = x^3 - 2x^2 - 3x + 10',
      latexFPrime: "f'(x) = 3x^2 - 4x - 3",
      x0: -3.0,
      tolerance: 1e-3,
      maxIterations: 25,
      expectedRoot: -2.0,
      iterations: [
        {
          formula: 'x_0 = -3.0 - \\frac{(-3.0)^3 - 2(-3.0)^2 - 3(-3.0) + 10}{3(-3.0)^2 - 4(-3.0) - 3} = -3.0 - \\frac{-26.0000}{36.0000} = -2.2778',
          error: '\\text{Error: } |x_1 - x_0| = |-2.2778 - (-3.0000)| = 0.7222 \\nless 0.001 \\text{ (continúa)}',
        },
        {
          formula: 'x_1 = -2.2778 - \\frac{(-2.2778)^3 - 2(-2.2778)^2 - 3(-2.2778) + 10}{3(-2.2778)^2 - 4(-2.2778) - 3} = -2.2778 - \\frac{-5.3609}{21.6759} = -2.0305',
          error: '\\text{Error: } |x_2 - x_1| = |-2.0305 - (-2.2778)| = 0.2473 \\nless 0.001 \\text{ (continúa)}',
        },
        {
          formula: 'x_2 = -2.0305 - \\frac{(-2.0305)^3 - 2(-2.0305)^2 - 3(-2.0305) + 10}{3(-2.0305)^2 - 4(-2.0305) - 3} = -2.0305 - \\frac{-0.5252}{17.4901} = -2.0004',
          error: '\\text{Error: } |x_3 - x_2| = |-2.0004 - (-2.0305)| = 0.0300 \\nless 0.001 \\text{ (continúa)}',
        },
        {
          formula: 'x_3 = -2.0004 - \\frac{(-2.0004)^3 - 2(-2.0004)^2 - 3(-2.0004) + 10}{3(-2.0004)^2 - 4(-2.0004) - 3} = -2.0004 - \\frac{-0.0073}{17.0068} = -2.0000',
          error: '\\text{Error: } |x_4 - x_3| = |-2.0000 - (-2.0004)| = 0.0004 < 0.001 \\text{ (cumple condición de parada)}',
        },
      ],
    },

    // --- PROBLEMA 9 ---
    {
      id: 'ej-9',
      title: (
        <span>
          Problema 9: Concentración de Bacterias - <InlineMath math="c(t) = 80e^{-2t} + 20e^{-0.5t} - 7" /> (<InlineMath math="t_0 = 2.0" />)
        </span>
      ),
      description: (
        <span>
          Determinar el tiempo <InlineMath math="t" /> (en horas) para que la concentración de bacterias se reduzca a <InlineMath math="c(t) = 7" /> (es decir, resolver <InlineMath math="f(t) = 80e^{-2t} + 20e^{-0.5t} - 7 = 0" />).
        </span>
      ),
      method: 'newton',
      expression: '80exp(-2x) + 20exp(-0.5x) - 7',
      latexExpr: 'c(t) = 80e^{-2t} + 20e^{-0.5t} - 7',
      latexFPrime: "c'(t) = -160e^{-2t} - 10e^{-0.5t}",
      x0: 2.0,
      tolerance: 1e-3,
      maxIterations: 25,
      expectedRoot: 2.3291,
      preliminarySteps: (
        <div className="space-y-3">
          {/* Paso previo 1: Teorema de Bolzano */}
          <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2.5 print:border-slate-200/60 print:shadow-none">
            <span className="text-xs font-bold text-slate-800 block">
              Paso 1: Análisis previo de localización (Teorema de Bolzano)
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Antes de empezar a iterar a ciegas, es de excelente práctica matemática delimitar en qué intervalo se encuentra nuestra raíz. Evaluamos <InlineMath math="f(t)" /> en algunos puntos enteros para buscar un cambio de signo:
            </p>
            <div className="space-y-1.5 p-2.5 bg-slate-50 rounded-lg border border-slate-100 print:bg-white print:border-none print:p-0">
              <div className="text-xs text-slate-800">
                • <InlineMath math="f(0) = 80e^0 + 20e^0 - 7 = 80 + 20 - 7 = 93 > 0" />
              </div>
              <div className="text-xs text-slate-800">
                • <InlineMath math="f(1) = 80e^{-2} + 20e^{-0.5} - 7 \approx 15.96 > 0" />
              </div>
              <div className="text-xs text-slate-800">
                • <InlineMath math="f(2) = 80e^{-4} + 20e^{-1} - 7 \approx 1.8228 > 0" />
              </div>
              <div className="text-xs text-slate-800">
                • <InlineMath math="f(3) = 80e^{-6} + 20e^{-1.5} - 7 \approx -2.3391 < 0" />
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Como <InlineMath math="f(t)" /> es una función continua, y vemos que cambia de signo entre <InlineMath math="t = 2.0" /> (<InlineMath math="f(2.0) > 0" />) y <InlineMath math="t = 3.0" /> (<InlineMath math="f(3.0) < 0" />), por el <strong>Teorema de Bolzano</strong> aseguramos que existe al menos una raíz en el intervalo <InlineMath math="[2.0, 3.0]" />.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              De hecho, si evaluamos en <InlineMath math="t = 2.5" />, obtenemos <InlineMath math="f(2.5) \approx -0.7309 < 0" />, lo que acota nuestra raíz al intervalo más estrecho <InlineMath math="[2.0, 2.5]" />.
            </p>
          </div>

          {/* Paso previo 2: Elección de t0 y criterio de parada */}
          <div className="p-3.5 sm:p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2.5 print:border-slate-200/60 print:shadow-none">
            <span className="text-xs font-bold text-slate-800 block">
              Paso 2: Definir el Punto Inicial <InlineMath math="t_0" /> y el Criterio de Parada
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Como el enunciado original no fija un valor inicial ni una tolerancia de corte, establecemos nosotros las condiciones de trabajo fundamentadas en el paso anterior:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li className="flex items-start gap-1.5">
                <span className="font-bold">• Punto Inicial (<InlineMath math="t_0" />):</span>
                <span>Elegimos <InlineMath math="t_0 = 2.0" /> por encontrarse inmediatamente antes del cambio de signo en el intervalo acotado <InlineMath math="[2.0, 2.5]" />.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold">• Criterio de Parada:</span>
                <span>Decidimos fijar una cota de error absoluto <InlineMath math="E = |t_{n+1} - t_n| < 10^{-3} = 0.001" />.</span>
              </li>
            </ul>
          </div>
        </div>
      ),
      iterations: [
        {
          formula: 't_0 = 2.0000 - \\frac{80e^{-2(2.0000)} + 20e^{-0.5(2.0000)} - 7}{-160e^{-2(2.0000)} - 10e^{-0.5(2.0000)}} = 2.0000 - \\frac{1.8228}{-6.6093} = 2.2758',
          error: '\\text{Error: } |t_1 - t_0| = |2.2758 - 2.0000| = 0.2758 \\nless 0.001 \\text{ (continúa)}',
        },
        {
          formula: 't_1 = 2.2758 - \\frac{80e^{-2(2.2758)} + 20e^{-0.5(2.2758)} - 7}{-160e^{-2(2.2758)} - 10e^{-0.5(2.2758)}} = 2.2758 - \\frac{0.2539}{-4.8930} = 2.3277',
          error: '\\text{Error: } |t_2 - t_1| = |2.3277 - 2.2758| = 0.0519 \\nless 0.001 \\text{ (continúa)}',
        },
        {
          formula: 't_2 = 2.3277 - \\frac{80e^{-2(2.3277)} + 20e^{-0.5(2.3277)} - 7}{-160e^{-2(2.3277)} - 10e^{-0.5(2.3277)}} = 2.3277 - \\frac{0.0065}{-4.6445} = 2.3291',
          error: '\\text{Error: } |t_3 - t_2| = |2.3291 - 2.3277| = 0.0014 \\nless 0.001 \\text{ (continúa)}',
        },
        {
          formula: 't_3 = 2.3291 - \\frac{80e^{-2(2.3291)} + 20e^{-0.5(2.3291)} - 7}{-160e^{-2(2.3291)} - 10e^{-0.5(2.3291)}} = 2.3291 - \\frac{0.0000}{-4.6381} = 2.3291',
          error: '\\text{Error: } |t_4 - t_3| = |2.3291 - 2.3291| = 0.0000 < 0.001 \\text{ (cumple condición de parada)}',
        },
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
                    expression: ex.expression
                      .replace(/\*\*/g, '^')
                      .replace(/(\d+)\s*[*·]\s*([a-zA-Z(])/g, '$1$2')
                      .replace(/([a-zA-Z])\s*[*·]\s*([a-zA-Z(])/g, '$1$2'),
                    x0: ex.x0,
                    tolerance: 1e-1,
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
              expectedRoot={ex.expectedRoot}
              isOpenDefault={false}
              preliminarySteps={ex.preliminarySteps}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExercisesSection;