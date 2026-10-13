import React, { useState } from 'react';
import {
  FileCheck2,
  ArrowUpRight,
  Calculator,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Sparkles,
  Printer,
  Layers,
  ArrowDown,
} from 'lucide-react';
import type { TaylorPreset } from '../../types/taylor';
import InlineMath from '../InlineMath';
import MathText from '../MathText';
import { useAppPrint } from '../../hooks/useAppPrint';

interface TaylorExercisesSectionProps {
  onLoadExercise: (preset: TaylorPreset) => void;
}

export interface SolvedIterationStep {
  n: number;
  x: number;
  y: number;
  yp: number;
  ypp: number;
  yNext: number;
  yExact: number;
}

export interface DeductionFactorBox {
  label: string;
  math: string;
  note: string;
}

export interface SecondDerivativeDeduction {
  ruleName: string;
  ruleFormula: string;
  ruleDescription: string;
  boxU: DeductionFactorBox;
  boxUPrime: DeductionFactorBox;
  boxV: DeductionFactorBox;
  boxVPrime: DeductionFactorBox;
  appliedRuleFormulaMath: string;
  substitutionMath: string;
  simplificationSteps: string[];
  discreteFormulaMath: string;
}

export interface SolvedTaylorExerciseDetail {
  preset: TaylorPreset;
  problemStatement: string;
  specialQuestion?: string;
  specialAnswer?: string;
  pedagogicalNote?: string;
  deduction: SecondDerivativeDeduction;
  canonicalFormulaMath: string;
  particularFormulaMath: string;
  finalTargetLabel: string;
  finalApproxValue: string;
  finalExactFormula: string;
  finalExactValue: string;
  steps: SolvedIterationStep[];
}

export const OFFICIAL_TAYLOR_EXERCISES: TaylorPreset[] = [
  {
    id: 'tp5-1a',
    title: 'Ejercicio Nº 1 - Inciso a) (Práctica 05 EDO)',
    subtitle: 'Decaimiento cúbico con condición inicial en $x=0$. Hallar $y(0.5)$ con paso $h=0.1$.',
    expression: '-3*x^2*y',
    x_var: 'x',
    y_var: 'y',
    x0: 0.0,
    y0: 3.0,
    xf: 0.5,
    h: 0.1,
    order: 2,
    exactFormula: 'y(x) = 3 \\cdot e^{-x^3}',
    source: 'tp5',
  },
  {
    id: 'tp5-1b',
    title: 'Ejercicio Nº 1 - Inciso b) (Práctica 05 EDO)',
    subtitle: 'Ecuación no lineal separable con derivada cuadrática en $y$. Hallar $y(0.5)$ con paso $h=0.1$.',
    expression: '(1/4)*(1 + y^2)',
    x_var: 'x',
    y_var: 'y',
    x0: 0.0,
    y0: 1.0,
    xf: 0.5,
    h: 0.1,
    order: 2,
    exactFormula: 'y(x) = \\tan\\left(\\frac{x}{4} + \\frac{\\pi}{4}\\right)',
    source: 'tp5',
  },
  {
    id: 'tp5-1c',
    title: 'Ejercicio Nº 1 - Inciso c) (Práctica 05 EDO)',
    subtitle: 'Desarrollado en apunte Amiconi: $y\' = 2xy$, $y(1)=1$, hallar $y(1.3)$ con paso $h=0.1$.',
    expression: '2*x*y',
    x_var: 'x',
    y_var: 'y',
    x0: 1.0,
    y0: 1.0,
    xf: 1.3,
    h: 0.1,
    order: 2,
    exactFormula: 'y(x) = e^{x^2 - 1}',
    source: 'tp5',
  },
  {
    id: 'tp5-1d',
    title: 'Ejercicio Nº 1 - Inciso d) (Práctica 05 EDO)',
    subtitle: 'Variable temporal $t \\in [1, 3]$ con $h=0.5$. Pregunta: ¿Cuántas iteraciones son necesarias? Hallar $y(3)$.',
    expression: '(1/t)*(y^2 + y)',
    x_var: 't',
    y_var: 'y',
    x0: 1.0,
    y0: -2.0,
    xf: 3.0,
    h: 0.5,
    order: 2,
    exactFormula: 'y(t) = -\\frac{2t}{2t - 1}',
    source: 'tp5',
  },
];

export const DETAILED_TAYLOR_EXERCISES: SolvedTaylorExerciseDetail[] = [
  // ==========================================
  // INCISO A: y' = -3x^2 y (Regla del Producto)
  // ==========================================
  {
    preset: OFFICIAL_TAYLOR_EXERCISES[0],
    problemStatement:
      'Aproximar usando el método de Taylor una solución al PVI: $y\' = -3x^2y$, con $0 \\le x \\le 0.5$, $h = 0.1$ e $y(0) = 3$. Hallar $y(0.5)$.',
    deduction: {
      ruleName: 'Regla del Producto',
      ruleFormula: '(u \\cdot v)\' = u\' \\cdot v + u \\cdot v\'',
      ruleDescription:
        'Expresamos la derivada como el producto de dos factores: $u = -3x^2$ y $v = y(x)$. Derivamos miembro a miembro respecto a $x$:',
      boxU: {
        label: 'Primer Factor (u)',
        math: 'u = -3x^2',
        note: 'Término cuadrático en la variable independiente x.',
      },
      boxUPrime: {
        label: "Derivada de u (u')",
        math: "u' = \\frac{d}{dx}(-3x^2) = -6x",
        note: 'Derivación polinómica estándar respecto a x.',
      },
      boxV: {
        label: 'Segundo Factor (v)',
        math: 'v = y',
        note: 'Función dependiente incógnita y(x).',
      },
      boxVPrime: {
        label: "Derivada de v (v')",
        math: "v' = \\frac{d}{dx}(y) = y'",
        note: "Como y depende de x, su derivada es y'.",
      },
      appliedRuleFormulaMath:
        "y'' = (u \\cdot v)' = u' \\cdot v + u \\cdot v'",
      substitutionMath:
        "y'' = (-6x) \\cdot y + (-3x^2) \\cdot y' = -6xy - 3x^2 \\cdot (-3x^2 y)",
      simplificationSteps: [
        "y'' = -6xy + 9x^4 y",
        "y'' = 3xy \\cdot (3x^3 - 2)",
      ],
      discreteFormulaMath: "y''_n = 3 x_n y_n (3 x_n^3 - 2)",
    },
    canonicalFormulaMath: "y_{n+1} = y_n + h \\cdot y'_n + \\frac{h^2}{2!} y''_n",
    particularFormulaMath:
      "y_{n+1} = y_n + h \\cdot [-3 x_n^2 y_n] + \\frac{h^2}{2} \\cdot [3 x_n y_n (3 x_n^3 - 2)]",
    finalTargetLabel: 'y(0.5)',
    finalApproxValue: '2.657994',
    finalExactFormula: 'y(0.5) = 3 \\cdot e^{-0.125}',
    finalExactValue: '2.647491',
    steps: [
      { n: 0, x: 0.0, y: 3.0, yp: 0.0, ypp: 0.0, yNext: 3.0, yExact: 2.997001 },
      { n: 1, x: 0.1, y: 3.0, yp: -0.09, ypp: -1.7973, yNext: 2.982014, yExact: 2.976096 },
      { n: 2, x: 0.2, y: 2.982014, yp: -0.357842, ypp: -3.535475, yNext: 2.928552, yExact: 2.920042 },
      { n: 3, x: 0.3, y: 2.928552, yp: -0.790709, ypp: -5.057902, yNext: 2.824192, yExact: 2.814034 },
      { n: 4, x: 0.4, y: 2.824192, yp: -1.355612, ypp: -6.127366, yNext: 2.657994, yExact: 2.647491 },
    ],
  },

  // ==========================================
  // INCISO B: y' = 1/4 (1 + y^2) (Regla de la Cadena)
  // ==========================================
  {
    preset: OFFICIAL_TAYLOR_EXERCISES[1],
    problemStatement:
      'Aproximar usando el método de Taylor una solución al PVI: $y\' = \\frac{1}{4}(1 + y^2)$, con $0 \\le x \\le 0.5$, $h = 0.1$ e $y(0) = 1$. Hallar $y(0.5)$.',
    deduction: {
      ruleName: 'Regla de la Cadena',
      ruleFormula: '\\frac{d}{dx}[g(y)] = g\'(y) \\cdot y\'',
      ruleDescription:
        'La ecuación depende exclusivamente de $y(x)$. Identificamos la función exterior $g(y)$ y la variable dependiente interior $y$:',
      boxU: {
        label: 'Función Exterior g(y)',
        math: 'g(y) = \\frac{1}{4}(1 + y^2)',
        note: 'Expresión autónoma en términos de y.',
      },
      boxUPrime: {
        label: "Derivada Exterior g'(y)",
        math: "g'(y) = \\frac{d}{dy}\\left[\\frac{1 + y^2}{4}\\right] = \\frac{2y}{4} = \\frac{y}{2}",
        note: 'Derivada directa de g respecto a y (la derivada de 1 es 0 y de y^2 es 2y).',
      },
      boxV: {
        label: 'Función Interior (y)',
        math: 'y = y(x)',
        note: 'Variable dependiente incógnita.',
      },
      boxVPrime: {
        label: "Derivada Interior (y')",
        math: "y' = \\frac{dy}{dx}",
        note: "Derivada de la función interior respecto a x.",
      },
      appliedRuleFormulaMath:
        "y'' = \\frac{d}{dx}[g(y)] = g'(y) \\cdot y' = \\frac{y}{2} \\cdot y'",
      substitutionMath:
        "y'' = \\frac{y}{2} \\cdot \\left[\\frac{1}{4}(1 + y^2)\\right]",
      simplificationSteps: [
        "y'' = \\frac{y(1 + y^2)}{8}",
      ],
      discreteFormulaMath: "y''_n = \\frac{y_n (1 + y_n^2)}{8}",
    },
    canonicalFormulaMath: "y_{n+1} = y_n + h \\cdot y'_n + \\frac{h^2}{2!} y''_n",
    particularFormulaMath:
      "y_{n+1} = y_n + h \\cdot \\left[\\frac{1 + y_n^2}{4}\\right] + \\frac{h^2}{2} \\cdot \\left[\\frac{y_n (1 + y_n^2)}{8}\\right]",
    finalTargetLabel: 'y(0.5)',
    finalApproxValue: '1.287109',
    finalExactFormula: 'y(0.5) = \\tan\\left(\\frac{0.5}{4} + \\frac{\\pi}{4}\\right)',
    finalExactValue: '1.287427',
    steps: [
      { n: 0, x: 0.0, y: 1.0, yp: 0.5, ypp: 0.25, yNext: 1.05125, yExact: 1.051293 },
      { n: 1, x: 0.1, y: 1.05125, yp: 0.526282, ypp: 0.276627, yNext: 1.105261, yExact: 1.105354 },
      { n: 2, x: 0.2, y: 1.105261, yp: 0.555401, ypp: 0.306931, yNext: 1.162336, yExact: 1.162486 },
      { n: 3, x: 0.3, y: 1.162336, yp: 0.587756, ypp: 0.341585, yNext: 1.22282, yExact: 1.223035 },
      { n: 4, x: 0.4, y: 1.22282, yp: 0.623822, ypp: 0.381411, yNext: 1.287109, yExact: 1.287427 },
    ],
  },

  // ==========================================
  // INCISO C: y' = 2xy (Regla del Producto)
  // ==========================================
  {
    preset: OFFICIAL_TAYLOR_EXERCISES[2],
    problemStatement:
      'Aproximar usando el método de Taylor una solución al PVI: $y\' = 2xy$, con $h = 0.1$ e $y(1) = 1$. Hallar $y(1.3)$.',
    pedagogicalNote:
      'Este ejercicio es el ejemplo modelo resuelto paso a paso en el apunte del Ing. Amiconi (páginas 7 a 9), arrojando los mismos valores canónicos $y(1.1) = 1.23$, $y(1.2) = 1.5426$ e $y(1.3) = 1.9727$.',
    deduction: {
      ruleName: 'Regla del Producto',
      ruleFormula: '(u \\cdot v)\' = u\' \\cdot v + u \\cdot v\'',
      ruleDescription:
        'Expresamos la derivada como el producto de dos factores: $u = 2x$ y $v = y(x)$. Derivamos miembro a miembro respecto a $x$:',
      boxU: {
        label: 'Primer Factor (u)',
        math: 'u = 2x',
        note: 'Término lineal en x.',
      },
      boxUPrime: {
        label: "Derivada de u (u')",
        math: "u' = \\frac{d}{dx}(2x) = 2",
        note: 'Derivada constante respecto a x.',
      },
      boxV: {
        label: 'Segundo Factor (v)',
        math: 'v = y',
        note: 'Función dependiente y(x).',
      },
      boxVPrime: {
        label: "Derivada de v (v')",
        math: "v' = \\frac{d}{dx}(y) = y'",
        note: 'Derivada de y respecto de x.',
      },
      appliedRuleFormulaMath:
        "y'' = (u \\cdot v)' = u' \\cdot v + u \\cdot v'",
      substitutionMath:
        "y'' = 2 \\cdot y + (2x) \\cdot y' = 2y + 2x \\cdot (2xy)",
      simplificationSteps: [
        "y'' = 2y + 4x^2 y",
        "y'' = 2y \\cdot (1 + 2x^2)",
      ],
      discreteFormulaMath: "y''_n = 2 y_n (1 + 2 x_n^2)",
    },
    canonicalFormulaMath: "y_{n+1} = y_n + h \\cdot y'_n + \\frac{h^2}{2!} y''_n",
    particularFormulaMath:
      "y_{n+1} = y_n + h \\cdot [2 x_n y_n] + \\frac{h^2}{2} \\cdot [2 y_n (1 + 2 x_n^2)]",
    finalTargetLabel: 'y(1.3)',
    finalApproxValue: '1.972761',
    finalExactFormula: 'y(1.3) = e^{1.3^2 - 1} = e^{0.69}',
    finalExactValue: '1.993716',
    steps: [
      { n: 0, x: 1.0, y: 1.0, yp: 2.0, ypp: 6.0, yNext: 1.23, yExact: 1.233678 },
      { n: 1, x: 1.1, y: 1.23, yp: 2.706, ypp: 8.4132, yNext: 1.542666, yExact: 1.552707 },
      { n: 2, x: 1.2, y: 1.542666, yp: 3.702398, ypp: 11.971088, yNext: 1.972761, yExact: 1.993716 },
    ],
  },

  // ==========================================
  // INCISO D: y' = 1/t (y^2 + y) (Regla del Cociente)
  // ==========================================
  {
    preset: OFFICIAL_TAYLOR_EXERCISES[3],
    problemStatement:
      'Aproximar usando el método de Taylor una solución al PVI: $y\' = \\frac{1}{t}(y^2 + y)$, con $1 \\le t \\le 3$, $h = 0.5$ e $y(1) = -2$. ¿Cuántas iteraciones son necesarias para resolver el ejercicio? Resolver.',
    specialQuestion:
      '¿Cuántas iteraciones son necesarias para resolver el ejercicio?',
    specialAnswer:
      'Son necesarias exactamente $N = \\frac{t_f - t_0}{h} = \\frac{3.0 - 1.0}{0.5} = 4$ iteraciones: evaluando en los puntos $t_0 = 1.0$, $t_1 = 1.5$, $t_2 = 2.0$, $t_3 = 2.5$ y $t_4 = 3.0$.',
    deduction: {
      ruleName: 'Regla del Cociente',
      ruleFormula: '\\left(\\frac{u}{v}\\right)\' = \\frac{u\' \\cdot v - u \\cdot v\'}{v^2}',
      ruleDescription:
        'Escribimos la derivada como el cociente $y\' = \\frac{y^2 + y}{t}$ e identificamos numerador $u$ y denominador $v$:',
      boxU: {
        label: 'Numerador (u)',
        math: 'u = y^2 + y',
        note: 'Polinomio cuadrático en y.',
      },
      boxUPrime: {
        label: "Derivada del Numerador (u')",
        math: "u' = \\frac{d}{dt}(y^2 + y) = (2y + 1) \\cdot y'",
        note: "Regla de la cadena al derivar respecto a t.",
      },
      boxV: {
        label: 'Denominador (v)',
        math: 'v = t',
        note: 'Variable temporal independiente.',
      },
      boxVPrime: {
        label: "Derivada del Denominador (v')",
        math: "v' = \\frac{d}{dt}(t) = 1",
        note: 'Derivada directa respecto a t.',
      },
      appliedRuleFormulaMath:
        "y'' = \\left(\\frac{u}{v}\\right)' = \\frac{u' \\cdot v - u \\cdot v'}{v^2}",
      substitutionMath:
        "y'' = \\frac{[(2y + 1) \\cdot y'] \\cdot t - (y^2 + y) \\cdot 1}{t^2} = \\frac{[(2y + 1) \\cdot \\left(\\frac{y^2 + y}{t}\\right)] \\cdot t - (y^2 + y)}{t^2}",
      simplificationSteps: [
        "y'' = \\frac{(2y + 1)(y^2 + y) - (y^2 + y)}{t^2}",
        "y'' = \\frac{(y^2 + y)[(2y + 1) - 1]}{t^2} = \\frac{(y^2 + y)(2y)}{t^2}",
        "y'' = \\frac{2y^2 (y + 1)}{t^2}",
      ],
      discreteFormulaMath: "y''_n = \\frac{2 y_n^2 (y_n + 1)}{t_n^2}",
    },
    canonicalFormulaMath: "y_{n+1} = y_n + h \\cdot y'_n + \\frac{h^2}{2!} y''_n",
    particularFormulaMath:
      "y_{n+1} = y_n + h \\cdot \\left[\\frac{y_n^2 + y_n}{t_n}\\right] + \\frac{h^2}{2} \\cdot \\left[\\frac{2 y_n^2 (y_n + 1)}{t_n^2}\\right]",
    finalTargetLabel: 'y(3.0)',
    finalApproxValue: '-1.458885',
    finalExactFormula: 'y(3.0) = -\\frac{2(3)}{2(3) - 1} = -\\frac{6}{5}',
    finalExactValue: '-1.200000',
    steps: [
      { n: 0, x: 1.0, y: -2.0, yp: 2.0, ypp: -8.0, yNext: -2.0, yExact: -1.5 },
      { n: 1, x: 1.5, y: -2.0, yp: 1.333333, ypp: -3.555556, yNext: -1.777778, yExact: -1.333333 },
      { n: 2, x: 2.0, y: -1.777778, yp: 0.691358, ypp: -1.229081, yNext: -1.585734, yExact: -1.25 },
      { n: 3, x: 2.5, y: -1.585734, yp: 0.371527, ypp: -0.471315, yNext: -1.458885, yExact: -1.2 },
    ],
  },
];

export const TaylorExercisesSection: React.FC<TaylorExercisesSectionProps> = ({ onLoadExercise }) => {
  const { printRef, handlePrint } = useAppPrint('Ejercicios-Resueltos-Taylor-TP5');

  // State for expanded detailed resolution per card
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    'tp5-1a': true,
    'tp5-1b': true,
    'tp5-1c': true,
    'tp5-1d': true,
  });

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const areAllExpanded = Object.values(expandedCards).every(Boolean);

  const toggleAll = () => {
    const nextState = !areAllExpanded;
    setExpandedCards({
      'tp5-1a': nextState,
      'tp5-1b': nextState,
      'tp5-1c': nextState,
      'tp5-1d': nextState,
    });
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto pb-12">
      {/* Top Banner de Acción y Encabezado con Botón Imprimir */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-slate-100 text-slate-900 rounded-xl">
              <FileCheck2 size={20} />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Ejercicios Resueltos - Práctica Nº 05 (EDO)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-3xl">
            Resolución paso a paso del Ejercicio Nº 1 (Incisos a, b, c y d) por el Método de Taylor de Grado 2,
            con deducción analítica de derivadas, formulación de ordenada genérica y tablas de iteración.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <button
            type="button"
            onClick={toggleAll}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Layers size={14} />
            <span>{areAllExpanded ? 'Colapsar todo' : 'Expandir todo'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setExpandedCards({
                'tp5-1a': true,
                'tp5-1b': true,
                'tp5-1c': true,
                'tp5-1d': true,
              });
              setTimeout(() => {
                handlePrint();
              }, 120);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Printer size={15} />
            <span>Imprimir Ejercicios Resueltos PDF</span>
          </button>
        </div>
      </div>

      {/* Contenedor Imprimible con los 4 Ejercicios */}
      <div ref={printRef} className="space-y-6">
        {DETAILED_TAYLOR_EXERCISES.map((detail) => {
          const ex = detail.preset;
          const isExpanded = !!expandedCards[ex.id];

          return (
            <div
              key={ex.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm hover:border-slate-300 transition-all space-y-6 print:border-slate-300 print:shadow-none print:break-inside-avoid"
            >
              {/* Card Header (Sin cartelitos arriba) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    {ex.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    <MathText text={ex.subtitle} />
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onLoadExercise(ex)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 self-start sm:self-auto print:hidden"
                >
                  <Calculator size={14} />
                  <span>Cargar en Simulador</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>

              {/* Enunciado Oficial */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90 text-xs sm:text-sm text-slate-800">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Enunciado Oficial de la Cátedra
                </span>
                <MathText text={detail.problemStatement} />
              </div>

              {/* Special Question Box if present (Inciso d) */}
              {detail.specialQuestion && detail.specialAnswer && (
                <div className="p-4 bg-slate-100/80 border border-slate-200 rounded-2xl text-xs sm:text-sm space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                    <HelpCircle size={16} className="shrink-0 text-slate-600" />
                    <span>Pregunta de la Guía: <MathText text={detail.specialQuestion} /></span>
                  </div>
                  <div className="text-slate-700 pl-5 font-medium leading-relaxed">
                    <MathText text={detail.specialAnswer} />
                  </div>
                </div>
              )}

              {/* Pedagogical reference if present (Inciso c) */}
              {detail.pedagogicalNote && (
                <div className="p-3.5 bg-slate-100/80 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 flex items-start gap-2">
                  <Sparkles size={16} className="shrink-0 mt-0.5 text-slate-600" />
                  <div>
                    <span className="font-bold block">Referencia Oficial de Cátedra:</span>
                    <span className="text-slate-600">{detail.pedagogicalNote}</span>
                  </div>
                </div>
              )}

              {/* Parameters Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Ecuación Diferencial
                  </span>
                  <div className="font-mono font-bold text-slate-900 mt-1 text-sm">
                    <InlineMath math={`${ex.y_var}' = ${ex.expression}`} />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Condición Inicial & Paso de Integración
                  </span>
                  <div className="font-mono text-slate-800 mt-1 text-sm">
                    <InlineMath
                      math={`${ex.y_var}(${ex.x0}) = ${ex.y0}, \\quad h=${ex.h}`}
                    />
                  </div>
                </div>
              </div>

              {/* Toggle Button for Detailed Step-by-Step */}
              <div className="pt-1 print:hidden">
                <button
                  type="button"
                  onClick={() => toggleCard(ex.id)}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold transition-colors cursor-pointer select-none"
                >
                  <span className="flex items-center gap-2">
                    <FileCheck2 size={15} className="text-slate-600" />
                    <span>{isExpanded ? 'Ocultar resolución analítica e iteraciones' : 'Ver resolución analítica paso a paso y tabla de iteraciones'}</span>
                  </span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* Detailed Resolution Content */}
              <div className={`${isExpanded ? 'block' : 'hidden'} print:block space-y-6 pt-2 border-t border-slate-100`}>
                
                {/* 1. DEDUCCIÓN PASO A PASO DE LA SEGUNDA DERIVADA */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs font-black flex items-center justify-center">
                      1
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                      Deducción Analítica de la Segunda Derivada ({detail.deduction.ruleName})
                    </h4>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
                    {/* Regla Aplicada */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Método de Derivación: {detail.deduction.ruleName}
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 font-mono text-xs sm:text-sm font-bold">
                          <InlineMath math={detail.deduction.ruleFormula} />
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 font-medium">
                        <MathText text={detail.deduction.ruleDescription} />
                      </div>
                    </div>

                    {/* LOS 4 CUADROS CLAROS PARA u, u', v, v' EN GRIS/NEGRO */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        Identificación de factores y derivadas:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Factor u */}
                        <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-1">
                          <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wide">
                            {detail.deduction.boxU.label}
                          </span>
                          <div className="text-sm sm:text-base font-bold text-slate-900 font-mono overflow-x-auto py-0.5">
                            <InlineMath math={detail.deduction.boxU.math} />
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug">
                            {detail.deduction.boxU.note}
                          </p>
                        </div>

                        {/* Derivada u' */}
                        <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-1">
                          <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wide">
                            {detail.deduction.boxUPrime.label}
                          </span>
                          <div className="text-sm sm:text-base font-bold text-slate-900 font-mono overflow-x-auto py-0.5">
                            <InlineMath math={detail.deduction.boxUPrime.math} />
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug">
                            {detail.deduction.boxUPrime.note}
                          </p>
                        </div>

                        {/* Factor v */}
                        <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-1">
                          <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wide">
                            {detail.deduction.boxV.label}
                          </span>
                          <div className="text-sm sm:text-base font-bold text-slate-900 font-mono overflow-x-auto py-0.5">
                            <InlineMath math={detail.deduction.boxV.math} />
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug">
                            {detail.deduction.boxV.note}
                          </p>
                        </div>

                        {/* Derivada v' */}
                        <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-1">
                          <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wide">
                            {detail.deduction.boxVPrime.label}
                          </span>
                          <div className="text-sm sm:text-base font-bold text-slate-900 font-mono overflow-x-auto py-0.5">
                            <InlineMath math={detail.deduction.boxVPrime.math} />
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug">
                            {detail.deduction.boxVPrime.note}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* FÓRMULA DE LA REGLA APLICADA */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        Fórmula de derivación aplicada:
                      </span>
                      <div className="text-sm sm:text-base font-bold text-slate-900 font-mono py-1 overflow-x-auto">
                        <InlineMath math={detail.deduction.appliedRuleFormulaMath} />
                      </div>
                    </div>

                    {/* SUSTITUCIÓN DE y' Y SIMPLIFICACIÓN ALGEBRAICA */}
                    <div className="space-y-2 bg-white border border-slate-200 rounded-xl p-4">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                        Sustitución de <InlineMath math={`${ex.y_var}'`} /> y simplificación algebraica
                      </span>
                      <div className="space-y-2 font-mono text-xs sm:text-sm text-slate-800 overflow-x-auto">
                        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
                          <span className="text-[10px] text-slate-400 block font-sans mb-0.5 font-bold uppercase">
                            Sustitución directa:
                          </span>
                          <InlineMath math={detail.deduction.substitutionMath} />
                        </div>
                        {detail.deduction.simplificationSteps.map((stepStr, sIdx) => (
                          <div key={sIdx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center gap-2">
                            <ArrowDown size={14} className="text-slate-400 shrink-0" />
                            <InlineMath math={stepStr} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* FÓRMULA FINAL DE LA SEGUNDA DERIVADA EN EL NODO n */}
                    <div className="bg-white border-2 border-slate-300 rounded-xl p-4 sm:p-5 shadow-xs space-y-1">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">
                        Fórmula Final de la Segunda Derivada en el Nodo <InlineMath math="n" />:
                      </span>
                      <div className="text-lg sm:text-2xl font-black font-mono text-slate-900 py-1 overflow-x-auto">
                        <InlineMath math={detail.deduction.discreteFormulaMath} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. ORDENADA GENÉRICA PARA TAYLOR DE GRADO 2 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs font-black flex items-center justify-center">
                      2
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                      Ordenada Genérica para Taylor de Grado 2 (<InlineMath math="p=2" />)
                    </h4>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
                    {/* Fórmula Canónica Destacada */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-1.5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Fórmula Canónica de Taylor (Grado 2):
                      </span>
                      <div className="text-base sm:text-xl font-black text-slate-900 font-mono py-1 overflow-x-auto">
                        <InlineMath math={detail.canonicalFormulaMath} />
                      </div>
                    </div>

                    {/* Expresión Particular con Sustitución Completa */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-1.5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Sustitución Particular para este P.V.I.:
                      </span>
                      <div className="text-sm sm:text-lg font-bold text-slate-900 font-mono py-1 overflow-x-auto">
                        <InlineMath math={detail.particularFormulaMath} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. TABLA DE ITERACIONES NUMÉRICAS */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs font-black flex items-center justify-center">
                        3
                      </span>
                      <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                        Tabla de Iteraciones Numéricas
                      </h4>
                    </div>
                    <span className="text-xs text-slate-600 font-bold bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      Paso <InlineMath math={`h = ${ex.h}`} />
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                          <th className="p-3 text-center w-12">
                            <InlineMath math="n" />
                          </th>
                          <th className="p-3">
                            <InlineMath math={`${ex.x_var}_n`} />
                          </th>
                          <th className="p-3">
                            <InlineMath math={`${ex.y_var}_n`} />
                          </th>
                          <th className="p-3">
                            <InlineMath math={`${ex.y_var}'_n`} />
                          </th>
                          <th className="p-3">
                            <InlineMath math={`${ex.y_var}''_n`} />
                          </th>
                          <th className="p-3 font-black text-slate-900 bg-slate-200/50">
                            <InlineMath math={`${ex.y_var}_{n+1}`} />
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono text-xs sm:text-sm">
                        {detail.steps.map((s) => (
                          <tr
                            key={s.n}
                            className={
                              s.n % 2 === 0
                                ? 'bg-white hover:bg-slate-50 transition-colors'
                                : 'bg-slate-50/50 hover:bg-slate-50 transition-colors'
                            }
                          >
                            <td className="p-3 text-center font-bold text-slate-500 font-sans">
                              {s.n}
                            </td>
                            <td className="p-3 text-slate-700">{s.x.toFixed(2)}</td>
                            <td className="p-3 text-slate-900 font-medium">
                              {s.y.toFixed(6)}
                            </td>
                            <td className="p-3 text-slate-600">{s.yp.toFixed(6)}</td>
                            <td className="p-3 text-slate-600">{s.ypp.toFixed(6)}</td>
                            <td className="p-3 text-slate-900 font-bold bg-slate-100/60">
                              {s.yNext.toFixed(6)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 4. RESULTADO APROXIMADO FINAL */}
                <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl p-6 sm:p-7 shadow-xs">
                  <div className="space-y-1.5">
                    <span className="text-xs uppercase tracking-widest text-slate-500 font-bold block">
                      Resultado Numérico Aproximado Final por Taylor Orden 2:
                    </span>
                    <div className="text-2xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">
                      <InlineMath math={`${detail.finalTargetLabel} \\approx ${detail.finalApproxValue}`} />
                    </div>
                    <p className="text-xs text-slate-500 font-medium pt-1">
                      Valor calculado iterando la ordenada genérica en el intervalo del problema.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaylorExercisesSection;
