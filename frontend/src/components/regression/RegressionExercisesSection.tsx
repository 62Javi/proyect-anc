import React from 'react';
import { Printer, ArrowRight, Calculator, Award, Table, Info } from 'lucide-react';
import InlineMath from '../InlineMath';
import MathText from '../MathText';
import { useAppPrint } from '../../hooks/useAppPrint';
import type { RegressionSolverConfig, RegressionModelType } from '../../types/regression';
import RegressionStepAccordion, { type RegressionExerciseStep } from './RegressionStepAccordion';
import {
  Exercise5VisualResolution,
  Exercise6VisualResolution,
} from './SoftwareAssistedResolutions';

interface RegressionExercisesSectionProps {
  onLoadExercise: (config: RegressionSolverConfig) => void;
}

interface SolvedExerciseItem {
  number: number;
  title: string;
  source: string;
  context: string;
  points: { x: number; y: number }[];
  xLabel?: string;
  yLabel?: string;
  modelType: RegressionModelType;
  degree?: number;
  bestFormula: string;
  r2: number;
  sr?: number;
  summaryExplanation: string;
  steps: RegressionExerciseStep[];
  bestModelNotice?: string;
}

const EXERCISES: SolvedExerciseItem[] = [
  // ==========================================
  // EJERCICIO Nº 1
  // ==========================================
  {
    number: 1,
    title: 'Ejercicio Nº 1: Serie de Observaciones',
    source: 'TP Nº4 · Ejercicio 1 (Cátedra ANC)',
    context: 'Dada la siguiente tabla de valores obtenida de una serie de observaciones:',
    points: [
      { x: 1, y: 0.5 },
      { x: 2, y: 1.7 },
      { x: 3, y: 3.4 },
      { x: 4, y: 5.7 },
      { x: 5, y: 8.4 },
    ],
    modelType: 'power',
    degree: 2,
    bestFormula: 'y = 0.5009 \\cdot x^{1.7517}',
    r2: 0.99997,
    sr: 0.0016,
    summaryExplanation:
      'El modelo Potencial ($r^2 = 0.99997$, $S_r = 0.0016$) se corona como el modelo óptimo al describir con máxima fidelidad la aceleración convexa de las observaciones respetando el principio de parsimonia con sólo 2 parámetros.',
    steps: [
      // Inciso a: Lineal
      {
        letter: 'a',
        title: 'Realizar un Ajuste de tipo Lineal.',
        modelType: 'linear',
        badge: '$r^2 = 0.9769$',
        description:
          'Ajuste por mínimos cuadrados de una recta $y = a_1 + a_2 x$ minimizando la suma de residuos cuadráticos $S_r = \\sum (y_i - a_1 - a_2 x_i)^2$',
        tableData: {
          headers: ['i', '$x_i$', '$y_i$', '$x_i^2$', '$x_i \\cdot y_i$'],
          rows: [
            [1, 1, 0.5, 1, 0.5],
            [2, 2, 1.7, 4, 3.4],
            [3, 3, 3.4, 9, 10.2],
            [4, 4, 5.7, 16, 22.8],
            [5, 5, 8.4, 25, 42.0],
            ['Σ', 15.0, 19.7, 55.0, 78.9],
          ],
        },
        sumsLatex:
          'N = 5, \\quad \\sum x_i = 15.00, \\quad \\sum y_i = 19.70, \\quad \\sum x_i^2 = 55.00, \\quad \\sum x_i y_i = 78.90',
        systemLatex:
          '\\begin{bmatrix} N & \\sum x_i \\\\ \\sum x_i & \\sum x_i^2 \\end{bmatrix} \\begin{bmatrix} a_1 \\\\ a_2 \\end{bmatrix} = \\begin{bmatrix} \\sum y_i \\\\ \\sum x_i y_i \\end{bmatrix} \\implies \\begin{bmatrix} 5 & 15.00 \\\\ 15.00 & 55.00 \\end{bmatrix} \\begin{bmatrix} a_1 \\\\ a_2 \\end{bmatrix} = \\begin{bmatrix} 19.70 \\\\ 78.90 \\end{bmatrix}',
        solutionLatex:
          '\\Delta = 5(55) - (15)^2 = 50, \\quad a_1 = \\frac{19.7(55) - 78.9(15)}{50} = -2.0000, \\quad a_2 = \\frac{5(78.9) - 15(19.7)}{50} = 1.9800',
        formulaLatex: 'y = -2.0000 + 1.9800x',
        dispersionBreakdown: {
          meanLatex: 'y_{\\text{media}} = \\frac{\\sum_{i=1}^n y_i}{n} = \\frac{19.70}{5} = 3.9400',
          stLatex:
            'ST = \\sum_{i=1}^n (y_i - y_{\\text{media}})^2 = 11.8336 + 5.0176 + 0.2916 + 3.0976 + 19.8916 = 40.1320',
          residualTable: {
            headers: [
              'i',
              '$x_i$',
              '$y_i$',
              '$y_{\\text{Ajuste}}$',
              '$(y_i - y_{\\text{media}})^2$',
              '$(y_i - y_{\\text{Ajuste}})^2$',
            ],
            rows: [
              [1, 1, 0.5, -0.02, 11.8336, 0.2704],
              [2, 2, 1.7, 1.96, 5.0176, 0.0676],
              [3, 3, 3.4, 3.94, 0.2916, 0.2916],
              [4, 4, 5.7, 5.92, 3.0976, 0.0484],
              [5, 5, 8.4, 7.9, 19.8916, 0.25],
              ['Σ', 15.0, 19.7, 19.7, 40.132, 0.928],
            ],
          },
          srLatex:
            'SR = \\sum_{i=1}^n (y_i - y_{\\text{Ajuste}})^2 = 0.2704 + 0.0676 + 0.2916 + 0.0484 + 0.2500 = 0.9280',
          r2Latex:
            'r^2 = \\frac{ST - SR}{ST} = \\frac{40.1320 - 0.9280}{40.1320} = \\frac{39.2040}{40.1320} \\approx 0.9769',
        },
        metrics: {
          r2: 0.9769,
          sr: 0.928,
          st: 40.132,
          r: 0.9884,
        },
        conclusion:
          'El modelo lineal aproxima la tendencia global pero deja un residuo cuadrático no despreciable ($S_r = 0.9280$). Al analizar los residuos se observa una curvatura sistemática: la recta subestima en los extremos ($x=1$, $x=5$) y sobreestima en los valores intermedios ($x=2, 3, 4$).',
      },

      // Inciso b: Exponencial
      {
        letter: 'b',
        title: 'Realizar un Ajuste de tipo Exponencial.',
        modelType: 'exponential',
        badge: '$r^2 = 0.9472$ (transf)',
        description:
          'Linealización mediante logaritmo natural en ambos miembros: $\\ln(y) = \\ln(a) + bx \\iff Y = a_1 + a_2 x$ con $Y = \\ln(y)$, $a_1 = \\ln(a)$ y $a_2 = b$.',
        tableData: {
          headers: ['i', '$x_i$', '$y_i$', '$\\ln(y_i)$', '$x_i^2$', '$x_i \\cdot \\ln(y_i)$'],
          rows: [
            [1, 1, 0.5, -0.6931, 1, -0.6931],
            [2, 2, 1.7, 0.5306, 4, 1.0613],
            [3, 3, 3.4, 1.2238, 9, 3.6713],
            [4, 4, 5.7, 1.7405, 16, 6.9619],
            [5, 5, 8.4, 2.1282, 25, 10.6412],
            ['Σ', 15.0, 19.7, 4.93, 55.0, 21.6425],
          ],
        },
        sumsLatex:
          'N = 5, \\quad \\sum x_i = 15.00, \\quad \\sum \\ln(y_i) = 4.9300, \\quad \\sum x_i^2 = 55.00, \\quad \\sum x_i \\ln(y_i) = 21.6425',
        systemLatex:
          '\\begin{bmatrix} N & \\sum x_i \\\\ \\sum x_i & \\sum x_i^2 \\end{bmatrix} \\begin{bmatrix} \\ln(a) \\\\ b \\end{bmatrix} = \\begin{bmatrix} \\sum \\ln(y_i) \\\\ \\sum x_i \\ln(y_i) \\end{bmatrix} \\implies \\begin{bmatrix} 5 & 15.00 \\\\ 15.00 & 55.00 \\end{bmatrix} \\begin{bmatrix} \\ln(a) \\\\ b \\end{bmatrix} = \\begin{bmatrix} 4.9300 \\\\ 21.6425 \\end{bmatrix}',
        solutionLatex:
          '\\Delta = 5(55) - (15)^2 = 50, \\quad \\ln(a) = \\frac{4.93(55) - 21.6425(15)}{50} \\approx -1.0698 \\implies a \\approx 0.3431, \\quad b = \\frac{5(21.6425) - 15(4.93)}{50} \\approx 0.6853',
        formulaLatex: 'y = 0.3431 \\cdot e^{0.6853x}',
        dispersionBreakdown: {
          meanLatex:
            'y_{\\text{media}} = \\frac{\\sum_{i=1}^n \\text{Ln}(y_i)}{n} = \\frac{4.9300}{5} = 0.9860',
          stLatex:
            'ST = \\sum_{i=1}^n (\\text{Ln}(y_i) - y_{\\text{media}})^2 = 2.8194 + 0.2074 + 0.0565 + 0.5693 + 1.3047 = 4.9573',
          residualTable: {
            headers: [
              'i',
              '$x_i$',
              '$y_i$',
              '$\\text{Ln}(y_i)$',
              '$y_{\\text{Ajuste}}$',
              '$(\\text{Ln}(y_i) - y_{\\text{media}})^2$',
              '$(\\text{Ln}(y_i) - y_{\\text{Ajuste}})^2$',
            ],
            rows: [
              [1, 1, 0.5, -0.6931, -0.3845, 2.8194, 0.0952],
              [2, 2, 1.7, 0.5306, 0.3008, 0.2074, 0.0528],
              [3, 3, 3.4, 1.2238, 0.9861, 0.0565, 0.0565],
              [4, 4, 5.7, 1.7405, 1.6714, 0.5693, 0.0048],
              [5, 5, 8.4, 2.1282, 2.3567, 1.3047, 0.0522],
              ['Σ', 15.0, 19.7, 4.93, 4.9305, 4.9573, 0.2615],
            ],
          },
          srLatex:
            'SR = \\sum_{i=1}^n (\\text{Ln}(y_i) - y_{\\text{Ajuste}})^2 = 0.0952 + 0.0528 + 0.0565 + 0.0048 + 0.0522 = 0.2615',
          r2Latex:
            'r^2 = \\frac{ST - SR}{ST} = \\frac{4.9573 - 0.2615}{4.9573} = \\frac{4.6958}{4.9573} \\approx 0.9472',
        },
        metrics: {
          r2: 0.9472,
          sr: 0.2615,
          st: 4.9573,
        },
        conclusion:
          'En el espacio linealizado $\\ln(y)$ el ajuste reporta $r^2 = 0.9472$, pero al evaluar en la escala original las desviaciones son muy grandes ($S_r = 5.4576$, $r^2 = 0.8640$). La tasa de crecimiento de las observaciones no es exponencial pura.',
      },

      // Inciso c: Potencial
      {
        letter: 'c',
        title: 'Realizar un Ajuste de tipo Potencial.',
        modelType: 'power',
        badge: '$r^2 = 0.99997$ (Óptimo)',
        description:
          'Linealización bilogarítmica aplicando logaritmo natural en ambos miembros: $\\ln(y) = \\ln(a) + b \\cdot \\ln(x) \\iff Y = A_0 + A_1 X$ con $X = \\ln(x)$, $Y = \\ln(y)$, $A_0 = \\ln(a)$ y $A_1 = b$.',
        tableData: {
          headers: ['i', '$x_i$', '$y_i$', '$\\ln(x_i)$', '$\\ln(y_i)$', '$[\\ln(x_i)]^2$', '$\\ln(x_i) \\cdot \\ln(y_i)$'],
          rows: [
            [1, 1, 0.5, 0.0, -0.6931, 0.0, 0.0],
            [2, 2, 1.7, 0.6931, 0.5306, 0.4805, 0.3678],
            [3, 3, 3.4, 1.0986, 1.2238, 1.2069, 1.3445],
            [4, 4, 5.7, 1.3863, 1.7405, 1.9218, 2.4128],
            [5, 5, 8.4, 1.6094, 2.1282, 2.5903, 3.4253],
            ['Σ', 15.0, 19.7, 4.7875, 4.93, 6.1995, 7.5503],
          ],
        },
        sumsLatex:
          '\\sum \\ln(x_i) = 4.7875, \\quad \\sum \\ln(y_i) = 4.9300, \\quad \\sum [\\ln(x_i)]^2 = 6.1995, \\quad \\sum \\ln(x_i)\\ln(y_i) = 7.5503',
        systemLatex:
          '\\begin{bmatrix} N & \\sum \\ln(x_i) \\\\ \\sum \\ln(x_i) & \\sum [\\ln(x_i)]^2 \\end{bmatrix} \\begin{bmatrix} \\ln(a) \\\\ b \\end{bmatrix} = \\begin{bmatrix} \\sum \\ln(y_i) \\\\ \\sum \\ln(x_i)\\ln(y_i) \\end{bmatrix} \\implies \\begin{bmatrix} 5 & 4.7875 \\\\ 4.7875 & 6.1995 \\end{bmatrix} \\begin{bmatrix} \\ln(a) \\\\ b \\end{bmatrix} = \\begin{bmatrix} 4.9300 \\\\ 7.5503 \\end{bmatrix}',
        solutionLatex:
          '\\Delta = 5(6.1995) - (4.7875)^2 \\approx 8.0773, \\quad \\ln(a) = \\frac{4.9300(6.1995) - 7.5503(4.7875)}{8.0773} \\approx -0.6913 \\implies a \\approx 0.5009, \\quad b = \\frac{5(7.5503) - 4.7875(4.9300)}{8.0773} \\approx 1.7517',
        formulaLatex: 'y = 0.5009 \\cdot x^{1.7517}',
        dispersionBreakdown: {
          meanLatex:
            'y_{\\text{media}} = \\frac{\\sum_{i=1}^n \\text{Ln}(y_i)}{n} = \\frac{4.9300}{5} = 0.9860',
          stLatex:
            'ST = \\sum_{i=1}^n (\\text{Ln}(y_i) - y_{\\text{media}})^2 = 4.9573',
          residualTable: {
            headers: [
              'i',
              '$x_i$',
              '$y_i$',
              '$\\text{Ln}(x_i)$',
              '$\\text{Ln}(y_i)$',
              '$y_{\\text{Ajuste}}$',
              '$(\\text{Ln}(y_i) - y_{\\text{Ajuste}})^2$',
            ],
            rows: [
              [1, 1, 0.5, 0.0, -0.6931, -0.6913, 0.000003],
              [2, 2, 1.7, 0.6931, 0.5306, 0.5227, 0.000062],
              [3, 3, 3.4, 1.0986, 1.2238, 1.233, 0.000085],
              [4, 4, 5.7, 1.3863, 1.7405, 1.737, 0.000012],
              [5, 5, 8.4, 1.6094, 2.1282, 2.1279, 0.000001],
              ['Σ', 15.0, 19.7, 4.7874, 4.93, 4.9293, 0.000163],
            ],
          },
          srLatex:
            'SR = \\sum_{i=1}^n (\\text{Ln}(y_i) - y_{\\text{Ajuste}})^2 = 0.000163',
          r2Latex:
            'r^2 = \\frac{ST - SR}{ST} = \\frac{4.9573 - 0.000163}{4.9573} = \\frac{4.957137}{4.9573} \\approx 0.99997',
        },
        metrics: {
          r2: 0.99997,
          sr: 0.000163,
          st: 4.9573,
        },
        conclusion:
          'Ajuste prácticamente perfecto. La suma residual cuadrática es casi nula ($S_r = 0.0016$) y $r^2$ supera el $99.99\\%$. Modela la física del fenómeno de manera impecable con el exponente $b \\approx 1.75$.',
      },

      // Inciso d: Polinómico Grado 2
      {
        letter: 'd',
        title: 'Realizar un Ajuste de tipo Polinómico.',
        modelType: 'polynomial',
        degree: 2,
        badge: '$r^2 = 0.99994$',
        description:
          'Ajuste por parábola cuadrática de segundo grado $y = a_1 + a_2 x + a_3 x^2$ resolviendo el sistema de ecuaciones normales de orden $3 \\times 3$.',
        tableData: {
          headers: ['i', '$x_i$', '$y_i$', '$x_i^2$', '$x_i^3$', '$x_i^4$', '$x_i \\cdot y_i$', '$x_i^2 \\cdot y_i$'],
          rows: [
            [1, 1, 0.5, 1, 1, 1, 0.5, 0.5],
            [2, 2, 1.7, 4, 8, 16, 3.4, 6.8],
            [3, 3, 3.4, 9, 27, 81, 10.2, 30.6],
            [4, 4, 5.7, 16, 64, 256, 22.8, 91.2],
            [5, 5, 8.4, 25, 125, 625, 42.0, 210.0],
            ['Σ', 15.0, 19.7, 55.0, 225.0, 979.0, 78.9, 339.1],
          ],
        },
        sumsLatex:
          'N = 5, \\quad \\sum x_i = 15.0, \\quad \\sum x_i^2 = 55.0, \\quad \\sum x_i^3 = 225.0, \\quad \\sum x_i^4 = 979.0, \\quad \\sum y_i = 19.7, \\quad \\sum x_i y_i = 78.9, \\quad \\sum x_i^2 y_i = 339.1',
        systemLatex:
          '\\begin{bmatrix} N & \\sum x_i & \\sum x_i^2 \\\\ \\sum x_i & \\sum x_i^2 & \\sum x_i^3 \\\\ \\sum x_i^2 & \\sum x_i^3 & \\sum x_i^4 \\end{bmatrix} \\begin{bmatrix} a_1 \\\\ a_2 \\\\ a_3 \\end{bmatrix} = \\begin{bmatrix} \\sum y_i \\\\ \\sum x_i y_i \\\\ \\sum x_i^2 y_i \\end{bmatrix} \\implies \\begin{bmatrix} 5 & 15.0 & 55.0 \\\\ 15.0 & 55.0 & 225.0 \\\\ 55.0 & 225.0 & 979.0 \\end{bmatrix} \\begin{bmatrix} a_1 \\\\ a_2 \\\\ a_3 \\end{bmatrix} = \\begin{bmatrix} 19.70 \\\\ 78.90 \\\\ 339.10 \\end{bmatrix}',
        solutionLatex:
          'a_1 = -0.2000, \\quad a_2 = 0.4371, \\quad a_3 = 0.2571',
        formulaLatex: 'y = -0.2000 + 0.4371x + 0.2571x^2',
        dispersionBreakdown: {
          meanLatex: 'y_{\\text{media}} = \\frac{\\sum_{i=1}^n y_i}{n} = \\frac{19.70}{5} = 3.9400',
          stLatex:
            'ST = \\sum_{i=1}^n (y_i - y_{\\text{media}})^2 = 11.8336 + 5.0176 + 0.2916 + 3.0976 + 19.8916 = 40.1320',
          residualTable: {
            headers: [
              'i',
              '$x_i$',
              '$y_i$',
              '$y_{\\text{Ajuste}}$',
              '$(y_i - y_{\\text{media}})^2$',
              '$(y_i - y_{\\text{Ajuste}})^2$',
            ],
            rows: [
              [1, 1, 0.5, 0.4942, 11.8336, 0.000034],
              [2, 2, 1.7, 1.7026, 5.0176, 0.000007],
              [3, 3, 3.4, 3.4252, 0.2916, 0.000635],
              [4, 4, 5.7, 5.662, 3.0976, 0.001444],
              [5, 5, 8.4, 8.413, 19.8916, 0.000169],
              ['Σ', 15.0, 19.7, 19.697, 40.132, 0.002289],
            ],
          },
          srLatex:
            'SR = \\sum_{i=1}^n (y_i - y_{\\text{Ajuste}})^2 = 0.000034 + 0.000007 + 0.000635 + 0.001444 + 0.000169 \\approx 0.0023',
          r2Latex:
            'r^2 = \\frac{ST - SR}{ST} = \\frac{40.1320 - 0.0023}{40.1320} = \\frac{40.1297}{40.1320} \\approx 0.99994',
        },
        metrics: {
          r2: 0.99994,
          sr: 0.0023,
          st: 40.132,
        },
        conclusion:
          'Excelente ajuste cuadrático ($r^2 = 0.99994$, $S_r = 0.0023$). Al disponer de 3 grados de libertad ($a_1, a_2, a_3$) captura con gran exactitud la aceleración de los puntos.',
      },

      // Inciso e: Comparativa de Bondad
      {
        letter: 'e',
        title:
          'Si calculamos la Bondad del Ajuste para cada uno de los 4 casos anteriores ¿Cuál le parece que es la curva que mejor se ajusta a la tabla de valores dada? Explicar Por qué.',
        badge: 'Dictamen de Cátedra',
        description:
          'La curva que mejor se ajusta a la tabla es la POTENCIAL ($y = 0.5009 \\cdot x^{1.7517}$): registra la menor suma de residuos ($SR = 0.000163$), el mayor $r^2$ ($0.99997$) y respeta el principio de parsimonia (Navaja de Ockham) al requerir sólo 2 parámetros frente a los 3 del polinomio cuadrático.',
        tableData: {
          headers: ['Modelo', 'Ecuación Matemática', '$SR$ (Residuos²)', '$r^2$ (Bondad)', 'Veredicto'],
          rows: [
            ['Lineal', '$y = -2.0000 + 1.9800x$', '0.9280', '0.9769', 'Descartado: error sistemático'],
            ['Exponencial', '$y = 0.3431 \\cdot e^{0.6853x}$', '0.2615', '0.9472', 'Descartado: menor bondad'],
            ['Potencial', '$y = 0.5009 \\cdot x^{1.7517}$', '0.000163', '0.99997', 'Óptimo: Mejor ajuste y 2 parámetros'],
            ['Polinómico (2°)', '$y = -0.2000 + 0.4371x + 0.2571x^2$', '0.0023', '0.99994', 'Excelente (requiere 3 parámetros)'],
          ],
        },
        conclusion:
          'La curva que mejor se ajusta a la tabla es la POTENCIAL ($y = 0.5009 \\cdot x^{1.7517}$): registra la menor suma de residuos ($SR = 0.000163$), el mayor $r^2$ ($0.99997$) y respeta el principio de parsimonia (Navaja de Ockham) al requerir sólo 2 parámetros frente a los 3 del polinomio cuadrático.',
      },

      // Inciso f: Cociente / Saturación
      {
        letter: 'f',
        title: 'Con la misma tabla de valores, Ajustar mediante la ecuación del Cociente.',
        modelType: 'saturation',
        badge: 'Ecuación del Cociente',
        description:
          'Modelo de saturación linealizado invirtiendo ambas variables: $\\frac{1}{y} = \\frac{1}{a} + \\left(\\frac{b}{a}\\right) \\frac{1}{x}$ con incógnitas directas $\\frac{1}{a}$ y $\\frac{b}{a}$.',
        tableData: {
          headers: ['i', '$x_i$', '$y_i$', '$\\frac{1}{x_i}$', '$\\frac{1}{y_i}$', '$\\left(\\frac{1}{x_i}\\right)^2$', '$\\frac{1}{x_i \\cdot y_i}$'],
          rows: [
            [1, 1, 0.5, 1.0, 2.0, 1.0, 2.0],
            [2, 2, 1.7, 0.5, 0.5882, 0.25, 0.2941],
            [3, 3, 3.4, 0.3333, 0.2941, 0.1111, 0.0980],
            [4, 4, 5.7, 0.25, 0.1754, 0.0625, 0.0439],
            [5, 5, 8.4, 0.2, 0.1190, 0.04, 0.0238],
            ['Σ', 15.0, 19.7, 2.2833, 3.1768, 1.4636, 2.4598],
          ],
        },
        sumsLatex:
          '\\sum \\frac{1}{x_i} = 2.2833, \\quad \\sum \\frac{1}{y_i} = 3.1768, \\quad \\sum \\left(\\frac{1}{x_i}\\right)^2 = 1.4636, \\quad \\sum \\frac{1}{x_i y_i} = 2.4598',
        systemLatex:
          '\\begin{bmatrix} N & \\sum \\frac{1}{x_i} \\\\ \\sum \\frac{1}{x_i} & \\sum \\left(\\frac{1}{x_i}\\right)^2 \\end{bmatrix} \\begin{bmatrix} \\frac{1}{a} \\\\ \\frac{b}{a} \\end{bmatrix} = \\begin{bmatrix} \\sum \\frac{1}{y_i} \\\\ \\sum \\frac{1}{x_i y_i} \\end{bmatrix} \\implies \\begin{bmatrix} 5 & 2.2833 \\\\ 2.2833 & 1.4636 \\end{bmatrix} \\begin{bmatrix} \\frac{1}{a} \\\\ \\frac{b}{a} \\end{bmatrix} = \\begin{bmatrix} 3.1768 \\\\ 2.4598 \\end{bmatrix}',
        solutionLatex:
          '\\Delta = 5(1.4636) - (2.2833)^2 \\approx 2.1045, \\quad \\frac{1}{a} = \\frac{3.1768(1.4636) - 2.4598(2.2833)}{2.1045} \\approx -0.4595 \\implies a = \\frac{1}{-0.4595} \\approx -2.1764, \\quad \\frac{b}{a} = \\frac{5(2.4598) - 2.2833(3.1768)}{2.1045} \\approx 2.3975 \\implies b = 2.3975 \\cdot a \\approx -5.2178',
        formulaLatex:
          'y = \\frac{a \\cdot x}{b + x} = \\frac{-2.1764x}{-5.2178 + x} = \\frac{2.1764x}{5.2178 - x}',
        dispersionBreakdown: {
          meanLatex:
            'y_{\\text{media}} = \\frac{\\sum_{i=1}^n (1/y_i)}{n} = \\frac{3.1768}{5} \\approx 0.6354',
          stLatex:
            'ST = \\sum_{i=1}^n ((1/y_i) - y_{\\text{media}})^2 = 1.8621 + 0.0022 + 0.1165 + 0.2116 + 0.2666 = 2.4590',
          residualTable: {
            headers: [
              'i',
              '$x_i$',
              '$y_i$',
              '$\\frac{1}{x_i}$',
              '$\\frac{1}{y_i}$',
              '$y_{\\text{Ajuste}}$',
              '$((1/y_i) - y_{\\text{media}})^2$',
              '$((1/y_i) - y_{\\text{Ajuste}})^2$',
            ],
            rows: [
              [1, 1, 0.5, 1.0, 2.0, 1.938, 1.8621, 0.0038],
              [2, 2, 1.7, 0.5, 0.5882, 0.7393, 0.0022, 0.0228],
              [3, 3, 3.4, 0.3333, 0.2941, 0.3396, 0.1165, 0.0021],
              [4, 4, 5.7, 0.25, 0.1754, 0.1399, 0.2116, 0.0013],
              [5, 5, 8.4, 0.2, 0.119, 0.02, 0.2666, 0.0098],
              ['Σ', 15.0, 19.7, 2.2833, 3.1768, 3.1768, 2.459, 0.0398],
            ],
          },
          srLatex:
            'SR = \\sum_{i=1}^n ((1/y_i) - y_{\\text{Ajuste}})^2 = 0.0398',
          r2Latex:
            'r^2 = \\frac{ST - SR}{ST} = \\frac{2.4590 - 0.0398}{2.4590} = \\frac{2.4192}{2.4590} \\approx 0.9838',
        },
        metrics: {
          r2: 0.9838,
          sr: 0.0398,
          st: 2.459,
          extraNote: 'Escala recíproca 1/y',
        },
        conclusion:
          'Análisis crítico de cátedra: El despeje correcto genera $a = -2.1764$ y $b = -5.2178$. Esto produce un denominador $(5.2178 - x)$ con una asíntota vertical en $x = 5.2178$. Al intentar evaluar el modelo para $x > 5.2178$, el valor de $y$ se vuelve negativo/infinito, lo que demuestra matemáticamente que la ecuación del cociente es físicamente inadecuada para esta serie de datos convexos.',
      },
    ],
  },

  // ==========================================
  // EJERCICIO Nº 2
  // ==========================================
  {
    number: 2,
    title: 'Ejercicio Nº 2: Censo de Población',
    source: 'TP Nº4 · Ejercicio 2 (Cátedra ANC)',
    context:
      'Dada la siguiente tabla de población con datos obtenidos a través de la realización de censos nacionales.',
    points: [
      { x: 1930, y: 123203 },
      { x: 1940, y: 131669 },
      { x: 1950, y: 150697 },
      { x: 1960, y: 179323 },
      { x: 1970, y: 203212 },
      { x: 1980, y: 226505 },
    ],
    modelType: 'power',
    bestFormula: 'y = e^{-179.2975} \\cdot x^{25.2453}',
    r2: 0.9887,
    summaryExplanation:
      'Ajuste potencial directo de la población según el año censal $x$, modelando el crecimiento con excelente bondad de ajuste ($r^2 = 0.9887 > 0.85$).',
    steps: [
      {
        letter: 'a',
        title: 'Realizar un Ajuste de tipo Potencial.',
        modelType: 'power',
        badge: 'Modelo Potencial $y = a \\cdot x^b$',
        description:
          'Linealización bilogarítmica aplicando logaritmo natural en ambos miembros: $\\ln(y) = \\ln(a) + b \\cdot \\ln(x) \\iff Y = a_1 + a_2 X$ con $X = \\ln(x)$, $Y = \\ln(y)$, $a_1 = \\ln(a)$ y $a_2 = b$. Los términos $\\ln(x_i) \\cdot \\ln(y_i)$ corresponden a los valores exactos evaluados en calculadora/software redondeados a 4 decimales.',
        tableData: {
          headers: ['Año ($x_i$)', 'Población ($y_i$)', '$\\ln(x_i)$', '$\\ln(y_i)$', '$[\\ln(x_i)]^2$', '$\\ln(x_i) \\cdot \\ln(y_i)$'],
          rows: [
            [1930, 123203, 7.5653, 11.7216, 57.2334, 88.6770],
            [1940, 131669, 7.5704, 11.7880, 57.3116, 89.2407],
            [1950, 150697, 7.5756, 11.9230, 57.3895, 90.3239],
            [1960, 179323, 7.5807, 12.0969, 57.4670, 91.7033],
            [1970, 203212, 7.5858, 12.2220, 57.5442, 92.7135],
            [1980, 226505, 7.5909, 12.3305, 57.6210, 93.5992],
            ['Σ', 1014609, 45.4686, 72.0821, 344.5667, 546.2577],
          ],
        },
        sumsLatex:
          'N = 6, \\quad \\sum \\ln(x_i) = 45.4686, \\quad \\sum \\ln(y_i) = 72.0821, \\quad \\sum [\\ln(x_i)]^2 = 344.5667, \\quad \\sum \\ln(x_i)\\ln(y_i) = 546.2577',
        systemLatex:
          '\\begin{bmatrix} N & \\sum \\ln(x_i) \\\\ \\sum \\ln(x_i) & \\sum [\\ln(x_i)]^2 \\end{bmatrix} \\begin{bmatrix} \\ln(a) \\\\ b \\end{bmatrix} = \\begin{bmatrix} \\sum \\ln(y_i) \\\\ \\sum \\ln(x_i)\\ln(y_i) \\end{bmatrix} \\implies \\begin{bmatrix} 6 & 45.4686 \\\\ 45.4686 & 344.5667 \\end{bmatrix} \\begin{bmatrix} \\ln(a) \\\\ b \\end{bmatrix} = \\begin{bmatrix} 72.0821 \\\\ 546.2577 \\end{bmatrix}',
        solutionLatex:
          '\\Delta = 6(344.5667) - (45.4686)^2 \\approx 0.002748, \\quad b = \\frac{6(546.2577) - 45.4686(72.0821)}{0.002748} \\approx 25.2453, \\quad \\ln(a) = \\frac{72.0821(344.5667) - 546.2577(45.4686)}{0.002748} \\approx -179.2975 \\implies a = e^{-179.2975}',
        formulaLatex: '\\ln(y) = -179.2975 + 25.2453 \\cdot \\ln(x) \\iff y = e^{-179.2975} \\cdot x^{25.2453}',
        dispersionBreakdown: {
          meanLatex:
            'y_{\\text{media}} = \\frac{\\sum_{i=1}^n \\text{Ln}(y_i)}{n} = \\frac{72.0821}{6} = 12.0137',
          stLatex:
            'ST = \\sum_{i=1}^n (\\text{Ln}(y_i) - y_{\\text{media}})^2 = 0.0853 + 0.0509 + 0.0082 + 0.0069 + 0.0434 + 0.1004 = 0.2952',
          residualTable: {
            headers: [
              'Año ($x_i$)',
              'Población ($y_i$)',
              '$\\text{Ln}(x_i)$',
              '$\\text{Ln}(y_i)$',
              '$y_{\\text{Ajuste}}$',
              '$(\\text{Ln}(y_i) - y_{\\text{media}})^2$',
              '$(\\text{Ln}(y_i) - y_{\\text{Ajuste}})^2$',
            ],
            rows: [
              [1930, 123203, 7.5653, 11.7216, 11.6897, 0.0853, 0.001014],
              [1940, 131669, 7.5704, 11.7880, 11.8202, 0.0509, 0.001034],
              [1950, 150697, 7.5756, 11.9230, 11.9500, 0.0082, 0.000728],
              [1960, 179323, 7.5807, 12.0969, 12.0791, 0.0069, 0.000317],
              [1970, 203212, 7.5858, 12.2220, 12.2076, 0.0434, 0.000207],
              [1980, 226505, 7.5909, 12.3305, 12.3354, 0.1004, 0.000024],
              ['Σ', 1014609, 45.4686, 72.0821, 72.0821, 0.2952, 0.003325],
            ],
          },
          srLatex:
            'SR = \\sum_{i=1}^n (\\text{Ln}(y_i) - y_{\\text{Ajuste}})^2 = 0.003325 \\approx 0.0033',
          r2Latex:
            'r^2 = \\frac{ST - SR}{ST} = \\frac{0.2952 - 0.0033}{0.2952} = \\frac{0.2919}{0.2952} \\approx 0.9887',
        },
        metrics: {
          r2: 0.9887,
          sr: 0.0033,
          st: 0.2952,
          extraNote: 'Escala bilogarítmica ln(y) vs ln(x)',
        },
        conclusion:
          'El modelo potencial reporta un excelente ajuste con $r^2 = 0.9887 > 0.85$.',
      },
      {
        letter: 'b',
        title: 'Estimar la población para los años 1990, 1995 y 2000.',
        description:
          'Evaluación del modelo potencial ajustado para los años 1990, 1995 y 2000 sustituyendo directamente el año $x$:',
        solutionLatex:
          '\\ln(y_{1990}) = -179.2975 + 25.2453 \\cdot \\ln(1990) \\approx 12.4626 \\implies y(1990) \\approx 258491 \\text{ habitantes}\\\\ \\ln(y_{1995}) = -179.2975 + 25.2453 \\cdot \\ln(1995) \\approx 12.5260 \\implies y(1995) \\approx 275396 \\text{ habitantes}\\\\ \\ln(y_{2000}) = -179.2975 + 25.2453 \\cdot \\ln(2000) \\approx 12.5892 \\implies y(2000) \\approx 293361 \\text{ habitantes}',
        conclusion:
          'El modelo potencial predice una población aproximada de $293361$ habitantes para el año 2000.',
      },
    ],
  },

  // ==========================================
  // EJERCICIO Nº 3
  // ==========================================
  {
    number: 3,
    title: 'Ejercicio Nº 3: Servicio Meteorológico Nacional',
    source: 'TP Nº4 · Ejercicio 3 (Cátedra ANC)',
    context: 'Dada la siguiente tabla obtenida por el Servicio Meteorológico Nacional.',
    points: [
      { x: 5, y: 88.1 },
      { x: 10, y: 72.4 },
      { x: 15, y: 61.37 },
      { x: 20, y: 52.02 },
      { x: 30, y: 42.34 },
      { x: 45, y: 32.13 },
      { x: 60, y: 24.93 },
      { x: 90, y: 20.13 },
      { x: 120, y: 16.58 },
    ],
    modelType: 'exponential',
    bestFormula: 'y = 73.5814 \\cdot e^{-0.01421x}',
    r2: 0.9145,
    sr: 0.2349,
    summaryExplanation:
      'El modelo de atenuación exponencial describe con gran fidelidad el decaimiento de intensidad en chaparrones torrenciales tras el pico inicial de descarga, alcanzando un coeficiente de determinación de $r^2 = 0.9145$ (espacio transformado) y $r^2 = 0.8781$ (escala física), superando holgadamente el criterio de la cátedra ($r^2 > 0.85$).',
    steps: [
      // Inciso a: Ajuste Exponencial
      {
        letter: 'a',
        title: 'Realizar un Ajuste de tipo Exponencial.',
        modelType: 'exponential',
        badge: 'Modelo Exponencial $y = a \\cdot e^{bx}$',
        description:
          'Se propone el modelo exponencial $y = a \\cdot e^{bx}$. Aplicando logaritmo natural en ambos miembros: $\\ln(y) = \\ln(a) + bx \\iff Y = a_1 + a_2 x$, con variable dependiente transformada $Y = \\ln(y)$, ordenada al origen $a_1 = \\ln(a)$ y pendiente $a_2 = b$. Al tratarse de una tormenta que va perdiendo fuerza con el tiempo, se espera una tasa de atenuación negativa ($b < 0$).',
        tableData: {
          headers: [
            'i',
            'Duración $x_i$ (s)',
            'Intensidad $y_i$ (ml)',
            '$\\ln(y_i)$',
            '$x_i^2$',
            '$x_i \\cdot \\ln(y_i)$',
          ],
          rows: [
            [1, 5, 88.10, 4.4785, 25, 22.3924],
            [2, 10, 72.40, 4.2822, 100, 42.8221],
            [3, 15, 61.37, 4.1169, 225, 61.7538],
            [4, 20, 52.02, 3.9516, 400, 79.0326],
            [5, 30, 42.34, 3.7457, 900, 112.3720],
            [6, 45, 32.13, 3.4698, 2025, 156.1406],
            [7, 60, 24.93, 3.2161, 3600, 192.9643],
            [8, 90, 20.13, 3.0022, 8100, 270.1990],
            [9, 120, 16.58, 2.8082, 14400, 336.9837],
            ['Σ', 395.0, 410.00, 33.0712, 29775.0, 1274.6603],
          ],
        },
        sumsLatex:
          'N = 9, \\quad \\sum x_i = 395.00, \\quad \\sum y_i = 410.00, \\quad \\sum \\ln(y_i) = 33.0712, \\quad \\sum x_i^2 = 29775.00, \\quad \\sum x_i \\ln(y_i) = 1274.6603',
        systemLatex:
          '\\begin{bmatrix} N & \\sum x_i \\\\ \\sum x_i & \\sum x_i^2 \\end{bmatrix} \\begin{bmatrix} \\ln(a) \\\\ b \\end{bmatrix} = \\begin{bmatrix} \\sum \\ln(y_i) \\\\ \\sum x_i \\ln(y_i) \\end{bmatrix} \\implies \\begin{bmatrix} 9 & 395.00 \\\\ 395.00 & 29775.00 \\end{bmatrix} \\begin{bmatrix} \\ln(a) \\\\ b \\end{bmatrix} = \\begin{bmatrix} 33.0712 \\\\ 1274.6603 \\end{bmatrix}',
        solutionLatex:
          '\\Delta = 9(29775) - (395)^2 = 267975 - 156025 = 111950 \\\\ \\ln(a) = \\frac{33.0712(29775) - 1274.6603(395)}{111950} = \\frac{984695.48 - 503490.82}{111950} = \\frac{481204.66}{111950} \\approx 4.2984 \\implies a = e^{4.2984} \\approx 73.5814 \\\\ b = \\frac{9(1274.6603) - 395(33.0712)}{111950} = \\frac{11471.94 - 13063.12}{111950} = \\frac{-1591.18}{111950} \\approx -0.01421',
        formulaLatex:
          'y = 73.5814 \\cdot e^{-0.01421x} \\iff \\ln(y) = 4.2984 - 0.01421x',
        conclusion:
          'Se obtiene la función exponencial ajustada de decaimiento: el parámetro $a = 73.5814\\text{ ml}$ representa la intensidad de lluvia extrapolada en el instante inicial ($x = 0\\text{ s}$), mientras que el exponente $b = -0.01421\\text{ s}^{-1}$ cuantifica la tasa de amortiguamiento pluvial por segundo.',
      },

      // Inciso b: Bondad del Ajuste
      {
        letter: 'b',
        title: 'Calcular la Bondad del Ajuste.',
        modelType: 'exponential',
        badge: 'Bondad $r^2 = 0.9145$',
        dispersionBreakdown: {
          meanLatex:
            'y_{\\text{media}} = \\frac{\\sum_{i=1}^n \\text{Ln}(y_i)}{n} = \\frac{33.0712}{9} = 3.6746',
          stLatex:
            'ST = \\sum_{i=1}^n (\\text{Ln}(y_i) - y_{\\text{media}})^2 = 0.6462 + 0.3692 + 0.1957 + 0.0768 + 0.0051 + 0.0419 + 0.2102 + 0.4521 + 0.7506 = 2.7478',
          residualTable: {
            headers: [
              'i',
              '$x_i$',
              '$y_i$',
              '$\\text{Ln}(y_i)$',
              '$y_{\\text{Ajuste}}$',
              '$(\\text{Ln}(y_i) - y_{\\text{media}})^2$',
              '$(\\text{Ln}(y_i) - y_{\\text{Ajuste}})^2$',
            ],
            rows: [
              [1, 5, 88.1, 4.4785, 4.2273, 0.6462, 0.0631],
              [2, 10, 72.4, 4.2822, 4.1563, 0.3692, 0.0159],
              [3, 15, 61.37, 4.1169, 4.0852, 0.1957, 0.001],
              [4, 20, 52.02, 3.9516, 4.0141, 0.0768, 0.0039],
              [5, 30, 42.34, 3.7457, 3.872, 0.0051, 0.0159],
              [6, 45, 32.13, 3.4698, 3.6588, 0.0419, 0.0357],
              [7, 60, 24.93, 3.2161, 3.4456, 0.2102, 0.0527],
              [8, 90, 20.13, 3.0022, 3.0192, 0.4521, 0.0003],
              [9, 120, 16.58, 2.8082, 2.5928, 0.7506, 0.0464],
              ['Σ', 395.0, 410.0, 33.0712, 33.0712, 2.7478, 0.2349],
            ],
          },
          srLatex:
            'SR = \\sum_{i=1}^n (\\text{Ln}(y_i) - y_{\\text{Ajuste}})^2 = 0.0631 + 0.0159 + 0.0010 + 0.0039 + 0.0159 + 0.0357 + 0.0527 + 0.0003 + 0.0464 = 0.2349',
          r2Latex:
            'r^2 = \\frac{ST - SR}{ST} = \\frac{2.7478 - 0.2349}{2.7478} = \\frac{2.5129}{2.7478} \\approx 0.9145',
          scaleNote:
            'El cálculo riguroso en el espacio transformado linealizado $\\text{Ln}(y)$ arroja $r^2 = 0.9145$. En la escala física original ($y_i$), la dispersión total es $ST_{\\text{orig}} = 4924.58$ y la suma de residuos cuadráticos es $SR_{\\text{orig}} = 600.13$, arrojando una bondad de ajuste física $r^2_{\\text{fís}} = \\frac{4924.58 - 600.13}{4924.58} \\approx 0.8781$. Ambos valores superan holgadamente el criterio de aceptación de la cátedra ($r^2 > 0.85$).',
        },
        metrics: {
          r2: 0.9145,
          sr: 0.2349,
          st: 2.7478,
          extraNote: 'r² transf = 0.9145 | r² fís = 0.8781',
        },
        conclusion:
          'El ajuste exponencial reproduce adecuadamente el fenómeno de tormenta ($r^2 = 0.9145 > 0.85$), explicando más del $91\\%$ de la dispersión de las mediciones registradas por el Servicio Meteorológico Nacional.',
      },

      // Inciso c: Estimación a 200 segundos
      {
        letter: 'c',
        title:
          'Estimar cuál sería la Intensidad de Lluvia en Mili-Litros si la misma tuviese una duración de 200 segundos.',
        badge: 'Estimación a 200 s',
        description:
          'Se evalúa la función exponencial ajustada para una duración de precipitación de $x = 200\\text{ segundos}$ sustituyendo directamente el valor de la variable independiente en la ley matemática hallada:',
        solutionLatex:
          'y(200) = 73.5814 \\cdot e^{-0.01421 \\cdot 200} = 73.5814 \\cdot e^{-2.8420} \\approx 73.5814 \\cdot 0.058308 \\approx 4.2904 \\text{ ml/min} \\\\ \\text{O bien mediante la ecuación logarítmica: } \\ln(y(200)) = 4.2984 - 0.01421(200) = 1.4564 \\implies y(200) = e^{1.4564} \\approx 4.2904 \\text{ ml/min}',
        conclusion:
          'A los 200 segundos (3 minutos y 20 segundos) desde el inicio de la tormenta, la intensidad de lluvia residual estimada caerá a aproximadamente $4.29\\text{ ml/min}$ (o mililitros por minuto), habiéndose amortiguado más del $95\\%$ respecto a la medición inicial torrencial de $88.10\\text{ ml/min}$.',
      },
    ],
  },

  // ==========================================
  // EJERCICIO Nº 4
  // ==========================================
  {
    number: 4,
    title: 'Ejercicio Nº 4: Mediciones Experimentales',
    source: 'TP Nº4 · Ejercicio 4 (Cátedra ANC)',
    context: 'Dada la siguiente tabla obtenida a través de mediciones:',
    points: [
      { x: 1, y: 0.4 },
      { x: 2, y: 0.7 },
      { x: 2.5, y: 0.8 },
      { x: 4, y: 1.0 },
      { x: 6, y: 1.2 },
      { x: 8, y: 1.3 },
      { x: 8.5, y: 1.4 },
    ],
    modelType: 'saturation',
    bestFormula: 'y = \\frac{2.0450x}{4.0530 + x}',
    r2: 0.9974,
    sr: 0.0061,
    summaryExplanation:
      'El modelo de la ecuación del cociente se ajusta con extraordinaria fidelidad a la tendencia cóncava asintótica de las mediciones ($r^2 = 0.9974$, $SR = 0.0061$ en escala recíproca; $r^2 = 0.9933$ en escala física), permitiendo estimar el techo de saturación máxima en $y_{\\max} = a = 2.0450$.',
    steps: [
      // Inciso a: Ajuste mediante la ecuación del Cociente
      {
        letter: 'a',
        title: 'Realizar un Ajuste mediante la ecuación del Cociente.',
        modelType: 'saturation',
        badge: 'Ecuación del Cociente',
        description:
          'Modelo de cinética de saturación $y = \\frac{a \\cdot x}{b + x}$. Invirtiendo ambos miembros se obtiene la forma lineal: $\\frac{1}{y} = \\frac{b + x}{a \\cdot x} = \\frac{1}{a} + \\left(\\frac{b}{a}\\right) \\frac{1}{x} \\iff Y = a_1 + a_2 X$, donde $X = \\frac{1}{x}$, $Y = \\frac{1}{y}$, $a_1 = \\frac{1}{a}$ y $a_2 = \\frac{b}{a}$.',
        tableData: {
          headers: [
            'i',
            '$x_i$',
            '$y_i$',
            '$\\frac{1}{x_i}$',
            '$\\frac{1}{y_i}$',
            '$\\left(\\frac{1}{x_i}\\right)^2$',
            '$\\frac{1}{x_i \\cdot y_i}$',
          ],
          rows: [
            [1, 1.0, 0.4, 1.0, 2.5, 1.0, 2.5],
            [2, 2.0, 0.7, 0.5, 1.4286, 0.25, 0.7143],
            [3, 2.5, 0.8, 0.4, 1.25, 0.16, 0.5],
            [4, 4.0, 1.0, 0.25, 1.0, 0.0625, 0.25],
            [5, 6.0, 1.2, 0.1667, 0.8333, 0.0278, 0.1389],
            [6, 8.0, 1.3, 0.125, 0.7692, 0.0156, 0.0962],
            [7, 8.5, 1.4, 0.1176, 0.7143, 0.0138, 0.084],
            ['Σ', 32.0, 6.8, 2.5593, 8.4954, 1.5297, 4.2834],
          ],
        },
        sumsLatex:
          'N = 7, \\quad \\sum \\frac{1}{x_i} = 2.5593, \\quad \\sum \\frac{1}{y_i} = 8.4954, \\quad \\sum \\left(\\frac{1}{x_i}\\right)^2 = 1.5297, \\quad \\sum \\frac{1}{x_i y_i} = 4.2834',
        systemLatex:
          '\\begin{bmatrix} N & \\sum \\frac{1}{x_i} \\\\ \\sum \\frac{1}{x_i} & \\sum \\left(\\frac{1}{x_i}\\right)^2 \\end{bmatrix} \\begin{bmatrix} \\frac{1}{a} \\\\ \\frac{b}{a} \\end{bmatrix} = \\begin{bmatrix} \\sum \\frac{1}{y_i} \\\\ \\sum \\frac{1}{x_i y_i} \\end{bmatrix} \\implies \\begin{bmatrix} 7 & 2.5593 \\\\ 2.5593 & 1.5297 \\end{bmatrix} \\begin{bmatrix} \\frac{1}{a} \\\\ \\frac{b}{a} \\end{bmatrix} = \\begin{bmatrix} 8.4954 \\\\ 4.2834 \\end{bmatrix}',
        solutionLatex:
          '\\Delta = 7(1.5297) - (2.5593)^2 = 10.7079 - 6.5500 = 4.1579 \\\\ \\frac{1}{a} = \\frac{8.4954(1.5297) - 4.2834(2.5593)}{4.1579} = \\frac{12.9954 - 10.9625}{4.1579} = \\frac{2.0329}{4.1579} \\approx 0.4890 \\implies a = \\frac{1}{0.4890} \\approx 2.0450 \\\\ \\frac{b}{a} = \\frac{7(4.2834) - 2.5593(8.4954)}{4.1579} = \\frac{29.9838 - 21.7423}{4.1579} = \\frac{8.2415}{4.1579} \\approx 1.9819 \\implies b = 1.9819 \\cdot a \\approx 4.0530',
        formulaLatex:
          'y = \\frac{a \\cdot x}{b + x} = \\frac{2.0450x}{4.0530 + x} \\iff \\frac{1}{y} = 0.4890 + 1.9819 \\left(\\frac{1}{x}\\right)',
        conclusion:
          'El modelo del cociente se ajusta de forma óptima: al ser $a = 2.0450 > 0$ y $b = 4.0530 > 0$, el denominador $(4.0530 + x)$ nunca se anula para $x \\ge 0$, y cuando $x \\to \\infty$, la función tiende al valor de saturación límite $y_{\\max} = a = 2.0450$.',
      },

      // Inciso b: Calcular la Bondad del Ajuste
      {
        letter: 'b',
        title: 'Calcular la Bondad del Ajuste.',
        modelType: 'saturation',
        badge: 'Bondad $r^2 = 0.9974$',
        dispersionBreakdown: {
          meanLatex:
            'y_{\\text{media}} = \\frac{\\sum_{i=1}^n (1/y_i)}{n} = \\frac{8.4954}{7} \\approx 1.2136',
          stLatex:
            'ST = \\sum_{i=1}^n ((1/y_i) - y_{\\text{media}})^2 = 1.6547 + 0.0462 + 0.0013 + 0.0456 + 0.1446 + 0.1975 + 0.2493 = 2.3394',
          residualTable: {
            headers: [
              'i',
              '$x_i$',
              '$y_i$',
              '$\\frac{1}{x_i}$',
              '$\\frac{1}{y_i}$',
              '$y_{\\text{Ajuste}}$',
              '$((1/y_i) - y_{\\text{media}})^2$',
              '$((1/y_i) - y_{\\text{Ajuste}})^2$',
            ],
            rows: [
              [1, 1.0, 0.4, 1.0, 2.5, 2.4709, 1.6547, 0.0008],
              [2, 2.0, 0.7, 0.5, 1.4286, 1.48, 0.0462, 0.0026],
              [3, 2.5, 0.8, 0.4, 1.25, 1.2818, 0.0013, 0.001],
              [4, 4.0, 1.0, 0.25, 1.0, 0.9845, 0.0456, 0.0002],
              [5, 6.0, 1.2, 0.1667, 0.8333, 0.8193, 0.1446, 0.0002],
              [6, 8.0, 1.3, 0.125, 0.7692, 0.7367, 0.1975, 0.0011],
              [7, 8.5, 1.4, 0.1176, 0.7143, 0.7222, 0.2493, 0.0001],
              ['Σ', 32.0, 6.8, 2.5593, 8.4954, 8.4954, 2.3394, 0.0061],
            ],
          },
          srLatex:
            'SR = \\sum_{i=1}^n ((1/y_i) - y_{\\text{Ajuste}})^2 = 0.0008 + 0.0026 + 0.0010 + 0.0002 + 0.0002 + 0.0011 + 0.0001 = 0.0061',
          r2Latex:
            'r^2 = \\frac{ST - SR}{ST} = \\frac{2.3394 - 0.0061}{2.3394} = \\frac{2.3333}{2.3394} \\approx 0.9974',
          scaleNote:
            'En el espacio transformado de variables recíprocas ($1/y$ vs $1/x$), el modelo captura el $99.74\\%$ de la dispersión ($r^2 = 0.9974$). Al re-transformar a la escala física original ($y_i$), la dispersión total es $ST_{\\text{orig}} = 0.7743$ y la suma de residuos cuadráticos es $SR_{\\text{orig}} = 0.0052$, arrojando una bondad de ajuste física $r^2_{\\text{fís}} = \\frac{0.7743 - 0.0052}{0.7743} \\approx 0.9933$. Ambos valores superan holgadamente el criterio de aceptación de la cátedra ($r^2 > 0.85$).',
        },
        metrics: {
          r2: 0.9974,
          sr: 0.0061,
          st: 2.3394,
          extraNote: 'r² transf = 0.9974 | r² fís = 0.9933',
        },
        conclusion:
          'El ajuste por la ecuación del cociente es sobresaliente ($r^2 = 0.9974$), confirmando que los datos experimentales responden fielmente a una cinética de saturación asintótica.',
      },
    ],
  },

  // ==========================================
  // EJERCICIO Nº 5
  // ==========================================
  {
    number: 5,
    title: 'Ejercicio Nº 5: Resistencia del Cemento',
    source: 'TP Nº4 · Ejercicio 5 (Cátedra ANC)',
    context:
      'Se quiere estudiar la resistencia de unas piezas de cemento en función de su edad en días.',
    points: [
      { x: 1, y: 13.0 },
      { x: 2, y: 21.9 },
      { x: 3, y: 29.8 },
      { x: 7, y: 32.4 },
      { x: 12, y: 36.8 },
      { x: 20, y: 38.9 },
      { x: 28, y: 41.8 },
      { x: 32, y: 43.6 },
    ],
    xLabel: 'Edad en días ($x$)',
    yLabel: 'Resistencia a compresión en kg/cm² ($y$)',
    modelType: 'saturation',
    bestFormula: 'y = \\frac{46.6767x}{2.4739 + x}',
    r2: 0.9781,
    summaryExplanation:
      'El fraguado del cemento presenta endurecimiento rápido en la primera semana y luego estabilización asintótica hacia una resistencia límite calculada en $46.68\\text{ kg/cm}^2$.',
    bestModelNotice:
      'Resistencia límite asintótica del hormigón: $y_{\\text{asíntota}} = a = 46.68\\text{ kg/cm}^2$.',
    steps: [],
  },

  // ==========================================
  // EJERCICIO Nº 6
  // ==========================================
  {
    number: 6,
    title: 'Ejercicio Nº 6: Producción de Petróleo',
    source: 'TP Nº4 · Ejercicio 6 (Cátedra ANC)',
    context:
      'La ONU tiene publicado un estudio sobre la evolución de la producción mundial de petróleo desde 1880 a 1990.',
    points: [
      { x: 1880, y: 30 },
      { x: 1890, y: 77 },
      { x: 1900, y: 149 },
      { x: 1905, y: 215 },
      { x: 1910, y: 328 },
      { x: 1915, y: 432 },
      { x: 1920, y: 689 },
      { x: 1925, y: 1069 },
      { x: 1930, y: 1412 },
      { x: 1935, y: 1655 },
      { x: 1940, y: 2150 },
      { x: 1945, y: 2595 },
      { x: 1950, y: 3803 },
      { x: 1955, y: 5626 },
      { x: 1960, y: 7674 },
      { x: 1962, y: 8882 },
      { x: 1964, y: 10310 },
      { x: 1966, y: 12016 },
      { x: 1968, y: 14104 },
      { x: 1970, y: 16669 },
      { x: 1972, y: 18584 },
      { x: 1974, y: 20389 },
      { x: 1976, y: 20188 },
      { x: 1978, y: 21922 },
      { x: 1980, y: 21732 },
      { x: 1982, y: 19403 },
      { x: 1984, y: 19608 },
      { x: 1990, y: 17153 },
    ],
    xLabel: 'Año ($x$)',
    yLabel: 'Producción en billones de Barriles ($y$)',
    modelType: 'polynomial',
    degree: 3,
    bestFormula: 'y(t) = 1834.60 - 232.93t + 4.8933t^2 - 0.008539t^3',
    r2: 0.9125,
    summaryExplanation:
      'Ajuste asistido por software (Excel) de las 28 observaciones históricas de la ONU mediante polinomio cúbico (r² = 0.9125) y grado 4 (r² = 0.9532).',
    bestModelNotice:
      'Conclusión de cátedra: Dentro de la muestra histórica (1880-1990) ambos polinomios capturan la campana de Hubbert, pero la extrapolación fuera de la muestra (1995-2006) ilustra la trampa matemática de los polinomios de alto grado en recursos finitos.',
    steps: [],
  },
];

const formatDisplayR2 = (val: number): string => {
  if (val > 0.9999 && val < 1) {
    return val.toString();
  }
  return val.toFixed(4);
};

export const RegressionExercisesSection: React.FC<RegressionExercisesSectionProps> = ({
  onLoadExercise,
}) => {
  const { printRef, handlePrint } = useAppPrint('Ejercicios-Resueltos-TP4');

  return (
    <div className="space-y-8">
      {/* Top Banner de Acción */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-slate-900 text-white rounded-xl">
              <Award size={18} />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Ejercicios Resueltos - TP Nº 4
            </h2>
          </div>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Desarrollo matemático completo paso a paso de los Problemas 1 al 6 con tablas de sumatorias,
            sistemas de ecuaciones normales, ecuaciones ajustadas y justificaciones analíticas.
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

      {/* CONTENEDOR DE EJERCICIOS RESUELTOS */}
      <div ref={printRef} className="space-y-6">
        {EXERCISES.map((ex) => (
          <div
            key={ex.number}
            className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 hover:border-slate-300 transition-all print:border-slate-300 print:shadow-none print:p-4 print:break-inside-avoid"
          >
            {/* Cabecera del Ejercicio */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    Ejercicio Nº {ex.number}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {ex.source}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 pt-1">
                  {ex.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  onLoadExercise({
                    modelType: ex.modelType,
                    degree: ex.degree,
                    points: ex.points,
                    title: ex.title,
                    source: ex.source,
                  })
                }
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer shrink-0 print:hidden"
              >
                <Calculator size={14} />
                <span>Probar en el Simulador</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Enunciado y Contexto */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
              <MathText text={ex.context} />
            </p>

            {/* Tabla de observaciones original */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-bold text-slate-700">
                <div className="flex items-center gap-1.5">
                  <Table size={14} className="text-slate-500" />
                  <span>Tabla de datos experimentales:</span>
                  <span className="text-[10px] font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                    {ex.points.length} {ex.points.length === 1 ? 'punto' : 'puntos'}
                  </span>
                </div>
              </div>

              {/* Si son muchos puntos (ej: ejercicio 6 con 28 registros de la ONU), mostrar vista de cuadrícula completa legible */}
              {ex.points.length > 10 ? (
                <div className="space-y-2">
                  <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                    <div className="px-3.5 py-2 bg-slate-100/80 border-b border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-900">
                          <MathText text={ex.xLabel || 'Año (x)'} />
                        </span>
                        <span className="text-slate-400">vs.</span>
                        <span className="font-mono text-slate-900">
                          <MathText text={ex.yLabel || 'Producción (y)'} />
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        1 barril = 159 litros
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-slate-100 text-xs">
                      {ex.points.map((p, idx) => (
                        <div
                          key={idx}
                          className="p-2 sm:p-2.5 flex items-center justify-between gap-2 hover:bg-slate-50 transition-colors"
                        >
                          <span className="font-mono font-bold text-slate-700 text-[11px]">{p.x}</span>
                          <span className="font-mono text-slate-900 font-semibold text-[11px]">
                            {p.y.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 italic flex items-center gap-1.5">
                    <Info size={13} className="text-blue-500 shrink-0" />
                    <span>Tabla completa con los 28 años del informe oficial de la ONU (1880 a 1990).</span>
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto touch-pan-x rounded-xl border border-slate-200 bg-slate-50/70 scrollbar-thin [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                  <table className="w-full text-center text-xs border-collapse">
                    <tbody>
                      <tr className="border-b border-slate-200 bg-slate-100 font-mono font-bold text-slate-700">
                        <td className="px-4 py-2 text-left font-black bg-slate-200/70 border-r border-slate-200 min-w-28 shrink-0">
                          <MathText text={ex.xLabel || 'X'} />
                        </td>
                        {ex.points.map((p, idx) => (
                          <td key={idx} className="px-4 py-2 border-r border-slate-200 last:border-r-0">
                            {p.x}
                          </td>
                        ))}
                      </tr>
                      <tr className="font-mono text-slate-800">
                        <td className="px-4 py-2 text-left font-black bg-slate-100/70 border-r border-slate-200 min-w-28 shrink-0">
                          <MathText text={ex.yLabel || 'Y'} />
                        </td>
                        {ex.points.map((p, idx) => (
                          <td key={idx} className="px-4 py-2 border-r border-slate-200 last:border-r-0">
                            {p.y}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Tarjeta de Fórmula Recomendada y Métricas */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                  Modelo óptimo sugerido:
                </span>
                <div className="font-mono font-bold text-slate-900 text-sm">
                  <InlineMath math={ex.bestFormula} />
                </div>
                {ex.summaryExplanation && (
                  <p className="text-xs text-slate-500 pt-0.5 leading-relaxed max-w-xl">
                    <MathText text={ex.summaryExplanation} />
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 font-mono shadow-2xs">
                  <span className="text-slate-500 text-[10px] font-bold flex items-center gap-1">
                    <span>BONDAD</span> <InlineMath math="r^2" />
                  </span>
                  <span className="font-black text-slate-900 block">{formatDisplayR2(ex.r2)}</span>
                </div>
              </div>
            </div>

            {/* RESOLUCIÓN: ASISTIDA POR SOFTWARE EN EJ. 5 Y 6, O PASO A PASO MANUAL EN EJ. 1-4 */}
            {ex.number === 5 ? (
              <Exercise5VisualResolution points={ex.points} />
            ) : ex.number === 6 ? (
              <Exercise6VisualResolution points={ex.points} />
            ) : (
              <RegressionStepAccordion
                steps={ex.steps}
                isOpenDefault={false}
                bestModelNotice={ex.bestModelNotice}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegressionExercisesSection;
