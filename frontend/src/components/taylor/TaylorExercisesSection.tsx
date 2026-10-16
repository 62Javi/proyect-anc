import React, { useState } from 'react';
import {
  FileCheck2,
  ArrowUpRight,
  Calculator,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Printer,
  ArrowDown,
} from 'lucide-react';
import type { TaylorPreset } from '../../types/taylor';
import InlineMath from '../InlineMath';
import MathText from '../MathText';
import { useAppPrint } from '../../hooks/useAppPrint';
import { formatCleanNumber } from '../../utils/numberFormat';

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
    title: 'Ejercicio Nº 1 - Inciso a)',
    subtitle: 'Decaimiento cúbico con condición inicial en $x=0$, hallar $y(0.5)$ con paso $h=0.1$.',
    expression: '-3*x^2*y',
    displayExpression: '-3x^2y',
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
    title: 'Ejercicio Nº 1 - Inciso b)',
    subtitle: 'Ecuación no lineal separable con derivada cuadrática en $y$, hallar $y(0.5)$ con paso $h=0.1$.',
    expression: '(1/4)*(1 + y^2)',
    displayExpression: '\\frac{1}{4}(1 + y^2)',
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
    title: 'Ejercicio Nº 1 - Inciso c)',
    subtitle: '$y\' = 2xy$, $y(1)=1$, hallar $y(1.3)$ con paso $h=0.1$.',
    expression: '2*x*y',
    displayExpression: '2xy',
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
    title: 'Ejercicio Nº 1 - Inciso d)',
    subtitle: 'Variable temporal $t \\in [1, 3]$ con $h=0.5$. Pregunta: ¿Cuántas iteraciones son necesarias? Hallar $y(3)$.',
    expression: '(1/t)*(y^2 + y)',
    displayExpression: '\\frac{1}{t}(y^2 + y)',
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
  // INCISO A: y' = -3x^2 y (Derivadas Parciales)
  // ==========================================
  {
    preset: OFFICIAL_TAYLOR_EXERCISES[0],
    problemStatement:
      'Aproximar usando el método de Taylor una solución al PVI: $y\' = -3x^2y$, con $0 \\le x \\le 0.5$, $h = 0.1$ e $y(0) = 3$. Hallar $y(0.5)$.',
    deduction: {
      ruleName: 'Derivadas Parciales y Regla de la Cadena',
      ruleFormula: 'y\'\' = \\frac{\\partial f}{\\partial x} + \\frac{\\partial f}{\\partial y} \\cdot y\'',
      ruleDescription:
        'Aplicamos la fórmula oficial de la cátedra derivando parcialmente la función $f(x,y) = -3x^2 y$ respecto a $x$ e $y$:',
      boxU: {
        label: 'Derivada Parcial respecto a x',
        math: '\\frac{\\partial f}{\\partial x} = -6xy',
        note: 'Derivamos f(x,y) considerando a y como constante.',
      },
      boxUPrime: {
        label: 'Derivada Parcial respecto a y',
        math: '\\frac{\\partial f}{\\partial y} = -3x^2',
        note: 'Derivamos f(x,y) considerando a x como constante.',
      },
      boxV: {
        label: 'Primera Derivada (y\')',
        math: "y' = -3x^2 y",
        note: 'Expresión original de la EDO.',
      },
      boxVPrime: {
        label: 'Sustitución y Producto',
        math: '\\frac{\\partial f}{\\partial y} \\cdot y\' = (-3x^2)(-3x^2 y)',
        note: 'Multiplicación por la primera derivada.',
      },
      appliedRuleFormulaMath:
        "y'' = \\frac{\\partial f}{\\partial x} + \\frac{\\partial f}{\\partial y} \\cdot y'",
      substitutionMath:
        "y'' = (-6xy) + (-3x^2) \\cdot (-3x^2 y)",
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
  // INCISO B: y' = 1/4 (1 + y^2) (Derivadas Parciales)
  // ==========================================
  {
    preset: OFFICIAL_TAYLOR_EXERCISES[1],
    problemStatement:
      'Aproximar usando el método de Taylor una solución al PVI: $y\' = \\frac{1}{4}(1 + y^2)$, con $0 \\le x \\le 0.5$, $h = 0.1$ e $y(0) = 1$. Hallar $y(0.5)$.',
    deduction: {
      ruleName: 'Derivadas Parciales y Regla de la Cadena',
      ruleFormula: 'y\'\' = \\frac{\\partial f}{\\partial x} + \\frac{\\partial f}{\\partial y} \\cdot y\'',
      ruleDescription:
        'Aplicamos la fórmula oficial de la cátedra derivando parcialmente la función $f(x,y) = \\frac{1}{4}(1 + y^2)$ respecto a $x$ e $y$:',
      boxU: {
        label: 'Derivada Parcial respecto a x',
        math: '\\frac{\\partial f}{\\partial x} = 0',
        note: 'La función no depende explícitamente de x.',
      },
      boxUPrime: {
        label: 'Derivada Parcial respecto a y',
        math: '\\frac{\\partial f}{\\partial y} = \\frac{2y}{4} = \\frac{y}{2}',
        note: 'Derivamos f respecto a y.',
      },
      boxV: {
        label: 'Primera Derivada (y\')',
        math: "y' = \\frac{1}{4}(1 + y^2)",
        note: 'Expresión original de la EDO.',
      },
      boxVPrime: {
        label: 'Sustitución y Producto',
        math: '\\frac{\\partial f}{\\partial y} \\cdot y\' = \\left(\\frac{y}{2}\\right) \\cdot \\left[\\frac{1}{4}(1 + y^2)\\right]',
        note: 'Multiplicación por la primera derivada.',
      },
      appliedRuleFormulaMath:
        "y'' = \\frac{\\partial f}{\\partial x} + \\frac{\\partial f}{\\partial y} \\cdot y'",
      substitutionMath:
        "y'' = 0 + \\left(\\frac{y}{2}\\right) \\cdot \\left[\\frac{1}{4}(1 + y^2)\\right]",
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
  // INCISO C: y' = 2xy (Derivadas Parciales)
  // ==========================================
  {
    preset: OFFICIAL_TAYLOR_EXERCISES[2],
    problemStatement:
      'Aproximar usando el método de Taylor una solución al PVI: $y\' = 2xy$, con $h = 0.1$ e $y(1) = 1$. Hallar $y(1.3)$.',
    deduction: {
      ruleName: 'Derivadas Parciales y Regla de la Cadena',
      ruleFormula: 'y\'\' = \\frac{\\partial f}{\\partial x} + \\frac{\\partial f}{\\partial y} \\cdot y\'',
      ruleDescription:
        'Aplicamos la fórmula oficial de la cátedra derivando parcialmente la función $f(x,y) = 2xy$ respecto a $x$ e $y$:',
      boxU: {
        label: 'Derivada Parcial respecto a x',
        math: '\\frac{\\partial f}{\\partial x} = 2y',
        note: 'Derivamos f(x,y) considerando a y como constante.',
      },
      boxUPrime: {
        label: 'Derivada Parcial respecto a y',
        math: '\\frac{\\partial f}{\\partial y} = 2x',
        note: 'Derivamos f(x,y) considerando a x como constante.',
      },
      boxV: {
        label: 'Primera Derivada (y\')',
        math: "y' = 2xy",
        note: 'Expresión original de la EDO.',
      },
      boxVPrime: {
        label: 'Sustitución y Producto',
        math: '\\frac{\\partial f}{\\partial y} \\cdot y\' = (2x) \\cdot (2xy)',
        note: 'Multiplicación por la primera derivada.',
      },
      appliedRuleFormulaMath:
        "y'' = \\frac{\\partial f}{\\partial x} + \\frac{\\partial f}{\\partial y} \\cdot y'",
      substitutionMath:
        "y'' = 2y + (2x) \\cdot (2xy)",
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
  // INCISO D: y' = 1/t (y^2 + y) (Derivadas Parciales)
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
      ruleName: 'Derivadas Parciales y Regla de la Cadena',
      ruleFormula: 'y\'\' = \\frac{\\partial f}{\\partial t} + \\frac{\\partial f}{\\partial y} \\cdot y\'',
      ruleDescription:
        'Aplicamos la fórmula oficial de la cátedra derivando parcialmente la función $f(t,y) = \\frac{1}{t}(y^2 + y)$ respecto a $t$ e $y$:',
      boxU: {
        label: 'Derivada Parcial respecto a t',
        math: '\\frac{\\partial f}{\\partial t} = -\\frac{1}{t^2}(y^2 + y)',
        note: 'Derivamos f(t,y) considerando a y como constante.',
      },
      boxUPrime: {
        label: 'Derivada Parcial respecto a y',
        math: '\\frac{\\partial f}{\\partial y} = \\frac{1}{t}(2y + 1)',
        note: 'Derivamos f(t,y) considerando a t como constante.',
      },
      boxV: {
        label: 'Primera Derivada (y\')',
        math: "y' = \\frac{1}{t}(y^2 + y)",
        note: 'Expresión original de la EDO.',
      },
      boxVPrime: {
        label: 'Sustitución y Producto',
        math: '\\frac{\\partial f}{\\partial y} \\cdot y\' = \\left[\\frac{1}{t}(2y + 1)\\right] \\cdot \\left[\\frac{1}{t}(y^2 + y)\\right]',
        note: 'Multiplicación por la primera derivada.',
      },
      appliedRuleFormulaMath:
        "y'' = \\frac{\\partial f}{\\partial t} + \\frac{\\partial f}{\\partial y} \\cdot y'",
      substitutionMath:
        "y'' = -\\frac{1}{t^2}(y^2 + y) + \\left[\\frac{1}{t}(2y + 1)\\right] \\cdot \\left[\\frac{1}{t}(y^2 + y)\\right]",
      simplificationSteps: [
        "y'' = \\frac{-(y^2 + y) + (2y + 1)(y^2 + y)}{t^2}",
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
    finalExactValue: '-1.2',
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

  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    'tp5-1a': false,
    'tp5-1b': false,
    'tp5-1c': false,
    'tp5-1d': false,
  });

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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
            utilizando la deducción analítica de la segunda derivada mediante derivadas parciales y regla de la cadena multivariable.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
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
              {/* Card Header */}
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

              {/* Parameters Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Ecuación Diferencial
                  </span>
                  <div className="font-mono font-bold text-slate-900 mt-1 text-sm">
                    <InlineMath math={`${ex.y_var}' = ${ex.displayExpression || ex.expression}`} />
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

                    {/* CUADROS PARA DERIVADAS PARCIALES Y SUSTITUCIÓN */}
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        Cálculo de derivadas parciales y sustitución:
                      </span>
                      
                      {/* Fila superior: Las 3 primeras cajas en una fila de 3 columnas */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Box 1 */}
                        <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-1">
                          <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wide">
                            {detail.deduction.boxU.label}
                          </span>
                          <div className="text-sm sm:text-base font-bold text-slate-900 font-mono overflow-x-auto overflow-y-hidden py-1.5 scrollbar-none">
                            <InlineMath math={detail.deduction.boxU.math} />
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug">
                            {detail.deduction.boxU.note}
                          </p>
                        </div>

                        {/* Box 2 */}
                        <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-1">
                          <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wide">
                            {detail.deduction.boxUPrime.label}
                          </span>
                          <div className="text-sm sm:text-base font-bold text-slate-900 font-mono overflow-x-auto overflow-y-hidden py-1.5 scrollbar-none">
                            <InlineMath math={detail.deduction.boxUPrime.math} />
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug">
                            {detail.deduction.boxUPrime.note}
                          </p>
                        </div>

                        {/* Box 3 */}
                        <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-1">
                          <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wide">
                            {detail.deduction.boxV.label}
                          </span>
                          <div className="text-sm sm:text-base font-bold text-slate-900 font-mono overflow-x-auto overflow-y-hidden py-1.5 scrollbar-none">
                            <InlineMath math={detail.deduction.boxV.math} />
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug">
                            {detail.deduction.boxV.note}
                          </p>
                        </div>
                      </div>

                      {/* Fila inferior: La 4ta caja (Sustitución y producto) en ancho completo con texto centrado */}
                      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 text-center">
                        <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wide">
                          {detail.deduction.boxVPrime.label}
                        </span>
                        <div className="text-sm sm:text-base font-bold text-slate-900 font-mono overflow-x-auto overflow-y-hidden py-1.5 scrollbar-none flex justify-center">
                          <InlineMath math={detail.deduction.boxVPrime.math} />
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          {detail.deduction.boxVPrime.note}
                        </p>
                      </div>
                    </div>

                    {/* FÓRMULA DE LA REGLA APLICADA */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        Fórmula de derivación aplicada:
                      </span>
                      <div className="text-sm sm:text-base font-bold text-slate-900 font-mono py-2 overflow-x-auto overflow-y-hidden scrollbar-none">
                        <InlineMath math={detail.deduction.appliedRuleFormulaMath} />
                      </div>
                    </div>

                    {/* SUSTITUCIÓN Y SIMPLIFICACIÓN */}
                    <div className="space-y-2 bg-white border border-slate-200 rounded-xl p-4">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                        Sustitución y simplificación algebraica
                      </span>
                      <div className="space-y-2 font-mono text-xs sm:text-sm text-slate-800 overflow-x-auto overflow-y-hidden scrollbar-none">
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
                      <div className="text-lg sm:text-2xl font-black font-mono text-slate-900 py-2.5 overflow-x-auto overflow-y-hidden scrollbar-none">
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
                    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-1.5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Fórmula Canónica de Taylor (Grado 2):
                      </span>
                      <div className="text-base sm:text-xl font-black text-slate-900 font-mono py-2.5 overflow-x-auto overflow-y-hidden scrollbar-none">
                        <InlineMath math={detail.canonicalFormulaMath} />
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-1.5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Sustitución Particular para este P.V.I.:
                      </span>
                      <div className="text-sm sm:text-lg font-bold text-slate-900 font-mono py-2.5 overflow-x-auto overflow-y-hidden scrollbar-none">
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
                            <td className="p-3 text-slate-700">{formatCleanNumber(s.x, 4)}</td>
                            <td className="p-3 text-slate-900 font-medium">
                              {formatCleanNumber(s.y, 6)}
                            </td>
                            <td className="p-3 text-slate-600">{formatCleanNumber(s.yp, 6)}</td>
                            <td className="p-3 text-slate-600">{formatCleanNumber(s.ypp, 6)}</td>
                            <td className="p-3 text-slate-900 font-bold bg-slate-100/60">
                              {formatCleanNumber(s.yNext, 6)}
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