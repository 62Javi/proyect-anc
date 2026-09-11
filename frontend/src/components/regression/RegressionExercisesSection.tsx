import React from 'react';
import { Printer, ArrowRight, Calculator, Award, Table } from 'lucide-react';
import InlineMath from '../InlineMath';
import MathText from '../MathText';
import { useAppPrint } from '../../hooks/useAppPrint';
import type { RegressionSolverConfig, RegressionModelType } from '../../types/regression';
import RegressionStepAccordion, { type RegressionExerciseStep } from './RegressionStepAccordion';

interface RegressionExercisesSectionProps {
  onLoadExercise: (config: RegressionSolverConfig) => void;
}

interface SolvedExerciseItem {
  number: number;
  title: string;
  source: string;
  context: string;
  points: { x: number; y: number }[];
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
    title: 'Serie de Observaciones: Comparativa de Ajustes y Ecuación del Cociente',
    source: 'TP Nº4 · Ejercicio 1 (Cátedra ANC)',
    context:
      'Dada la tabla de valores obtenida de una serie de observaciones, se resuelven los 4 ajustes solicitados en los incisos a-d (Lineal, Exponencial, Potencial y Polinómico), se evalúa la bondad de ajuste $r^2$ para determinar la curva óptima y, finalmente, se analiza el ajuste mediante la ecuación del Cociente (inciso f).',
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
    bestModelNotice:
      'Veredicto final: El modelo Potencial $y = 0.5009 \\cdot x^{1.7517}$ es la curva óptima de ajuste. Supera al modelo lineal y exponencial en concordancia física y residuos, y aventaja al polinomio de segundo grado al lograr menor dispersión residual ($S_r = 0.0016$ vs $0.0023$) utilizando un parámetro menos.',
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
            'r^2 = \\frac{ST - SR}{ST} = \\frac{40.1320 - 0.9280}{40.1320} = \\frac{39.2040}{40.1320} \\approx 0.9769 \\implies r = +\\sqrt{0.9769} \\approx 0.9884',
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
            'r^2 = \\frac{ST - SR}{ST} = \\frac{4.9573 - 0.2615}{4.9573} = \\frac{4.6958}{4.9573} \\approx 0.9472 \\implies r = +\\sqrt{0.9472} \\approx 0.9732',
        },
        metrics: {
          r2: 0.9472,
          sr: 0.2615,
          st: 4.9573,
          r: 0.9732,
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
            [3, 3, 3.4, 1.0986, 1.2238, 1.2069, 1.3444],
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
            'r^2 = \\frac{ST - SR}{ST} = \\frac{4.9573 - 0.000163}{4.9573} = \\frac{4.957137}{4.9573} \\approx 0.99997 \\implies r = +\\sqrt{0.99997} \\approx 0.99998',
        },
        metrics: {
          r2: 0.99997,
          sr: 0.000163,
          st: 4.9573,
          r: 0.99998,
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
            'r^2 = \\frac{ST - SR}{ST} = \\frac{40.1320 - 0.0023}{40.1320} = \\frac{40.1297}{40.1320} \\approx 0.99994 \\implies r = +\\sqrt{0.99994} \\approx 0.99997',
        },
        metrics: {
          r2: 0.99994,
          sr: 0.0023,
          st: 40.132,
          r: 0.99997,
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
            [3, 3, 3.4, 0.3333, 0.2941, 0.1111, 0.098],
            [4, 4, 5.7, 0.25, 0.1754, 0.0625, 0.0439],
            [5, 5, 8.4, 0.2, 0.119, 0.04, 0.0238],
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
    title: 'Censo Nacional y Crecimiento Poblacional Histórico',
    source: 'TP Nº4 · Ejercicio 2 (Cátedra ANC)',
    context:
      'Serie censal de población (habitantes) entre 1930 y 1980. Ajuste de tipo Potencial directo sobre el año cronológico $x$, y proyección demográfica para los años 1990, 1995 y 2000.',
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
      'Ajuste potencial directo de la población según el año censal $x$, modelando el crecimiento con excelente correlación ($r^2 = 0.9887, r = 0.9944$).',
    bestModelNotice:
      'Proyecciones demográficas calculadas: Año 1990: $258491$ hab. | Año 1995: $275396$ hab. | Año 2000: $293361$ hab.',
    steps: [
      {
        letter: 'a',
        title: 'Linealización bilogarítmica del Ajuste Potencial',
        modelType: 'power',
        badge: 'Modelo Potencial $y = a \\cdot x^b$',
        description:
          'Linealización bilogarítmica aplicando logaritmo natural en ambos miembros: $\\ln(y) = \\ln(a) + b \\cdot \\ln(x) \\iff Y = a_1 + a_2 X$ con $X = \\ln(x)$, $Y = \\ln(y)$, $a_1 = \\ln(a)$ y $a_2 = b$.',
        tableData: {
          headers: ['Año ($x_i$)', 'Población ($y_i$)', '$\\ln(x_i)$', '$\\ln(y_i)$', '$[\\ln(x_i)]^2$', '$\\ln(x_i) \\cdot \\ln(y_i)$'],
          rows: [
            [1930, 123203, 7.5653, 11.7216, 57.2334, 88.6771],
            [1940, 131669, 7.5704, 11.7880, 57.3116, 89.2404],
            [1950, 150697, 7.5756, 11.9230, 57.3895, 90.3240],
            [1960, 179323, 7.5807, 12.0969, 57.4670, 91.7032],
            [1970, 203212, 7.5858, 12.2220, 57.5442, 92.7135],
            [1980, 226505, 7.5909, 12.3305, 57.6210, 93.5995],
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
        metrics: {
          r2: 0.9887,
          r: 0.9944,
        },
        conclusion:
          'El modelo potencial reporta un excelente ajuste con $r^2 = 0.9887$ y coeficiente de correlación $r = 0.9944$.',
      },
      {
        letter: 'b',
        title: 'Estimación y Proyección Demográfica Futura',
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
    title: 'Intensidad de Lluvia en Tormentas (Servicio Meteorológico)',
    source: 'TP Nº4 · Ejercicio 3 (Cátedra ANC)',
    context:
      'Medición de la intensidad de precipitación pluvial (ml/min) en función de la duración temporal (segundos). Decaimiento exponencial y estimación a 200 segundos.',
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
    r2: 0.9884,
    summaryExplanation:
      'El modelo de atenuación exponencial describe con gran correlación la pérdida de intensidad en los chaparrones torrenciales tras los primeros minutos de descarga.',
    bestModelNotice:
      'Estimación a 200 segundos: $y(200) = 73.5814 \\cdot e^{-0.01421 \\cdot 200} = 4.29\\text{ ml/min}$.',
    steps: [
      {
        letter: 'a',
        title: 'Linealización Semilogarítmica del Decaimiento Pluvial',
        modelType: 'exponential',
        badge: 'Decaimiento $b < 0$',
        description:
          'Modelo de intensidad: $y = a \\cdot e^{bx}$ con decaimiento continuo ($b < 0$). Aplicando logaritmo natural: $\\ln(y) = \\ln(a) + bx$.',
        sumsLatex:
          'N = 9, \\quad \\sum x_i = 395.0, \\quad \\sum \\ln(y_i) = 33.0712, \\quad \\sum x_i^2 = 29775.0, \\quad \\sum x_i \\ln(y_i) = 1274.6603',
        systemLatex:
          '\\begin{bmatrix} N & \\sum x_i \\\\ \\sum x_i & \\sum x_i^2 \\end{bmatrix} \\begin{bmatrix} \\ln(a) \\\\ b \\end{bmatrix} = \\begin{bmatrix} \\sum \\ln(y_i) \\\\ \\sum x_i \\ln(y_i) \\end{bmatrix} \\implies \\begin{bmatrix} 9 & 395.0 \\\\ 395.0 & 29775.0 \\end{bmatrix} \\begin{bmatrix} \\ln(a) \\\\ b \\end{bmatrix} = \\begin{bmatrix} 33.0712 \\\\ 1274.6603 \\end{bmatrix}',
        solutionLatex:
          '\\Delta = 9(29775) - (395)^2 = 111950, \\quad \\ln(a) = \\frac{33.0712(29775) - 1274.6603(395)}{111950} \\approx 4.2984 \\implies a = e^{4.2984} \\approx 73.5814, \\quad b = \\frac{9(1274.6603) - 395(33.0712)}{111950} \\approx -0.01421',
        formulaLatex: 'y = 73.5814 \\cdot e^{-0.01421x}',
        metrics: {
          r2: 0.9884,
          r: 0.9942,
        },
        conclusion:
          'La tasa de atenuación pluvial estimada es de $-0.01421\\text{ s}^{-1}$ con un coeficiente $r^2 = 0.9884$.',
      },
      {
        letter: 'b',
        title: 'Estimación de la Intensidad Residual a 200 segundos',
        solutionLatex:
          'y(200) = 73.5814 \\cdot e^{-0.01421 \\cdot 200} = 73.5814 \\cdot e^{-2.8420} = 4.288 \\text{ ml/min}',
        conclusion:
          'A los 200 segundos (3 min 20 s) la precipitación se habrá reducido prácticamente al $5\\%$ de la intensidad inicial.',
      },
    ],
  },

  // ==========================================
  // EJERCICIO Nº 4
  // ==========================================
  {
    number: 4,
    title: 'Cinética de Crecimiento y Ecuación del Cociente',
    source: 'TP Nº4 · Ejercicio 4 (Cátedra ANC)',
    context:
      'Mediciones de saturación biológica/química en laboratorio donde la velocidad se desacelera tendiendo asintóticamente a un valor máximo.',
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
    r2: 0.9961,
    summaryExplanation:
      'Aquí el modelo del cociente es conceptualmente ideal: los datos son cóncavos con techo asintótico, permitiendo estimar el límite de saturación máxima $y_{\\max} = a = 2.0450$.',
    bestModelNotice:
      'Asíntota horizontal de saturación: $y_{\\max} = a = 2.0450$ unidades de concentración.',
    steps: [
      {
        letter: 'a',
        title: 'Linealización por Inversión de Variables (Lineweaver-Burk)',
        modelType: 'saturation',
        badge: '$\\frac{1}{y}$ vs $\\frac{1}{x}$',
        description:
          'Cinética de saturación: $y = \\frac{a \\cdot x}{b + x} \\iff \\frac{1}{y} = \\frac{1}{a} + \\left(\\frac{b}{a}\\right) \\frac{1}{x}$. Se definen variables transformadas $X\' = \\frac{1}{x}$ e $Y\' = \\frac{1}{y}$.',
        sumsLatex:
          '\\sum \\frac{1}{x_i} = 2.5593, \\quad \\sum \\frac{1}{y_i} = 8.4954, \\quad \\sum \\left(\\frac{1}{x_i}\\right)^2 = 1.5297, \\quad \\sum \\frac{1}{x_i y_i} = 4.2834',
        systemLatex:
          '\\begin{bmatrix} N & \\sum \\frac{1}{x_i} \\\\ \\sum \\frac{1}{x_i} & \\sum \\left(\\frac{1}{x_i}\\right)^2 \\end{bmatrix} \\begin{bmatrix} \\frac{1}{a} \\\\ \\frac{b}{a} \\end{bmatrix} = \\begin{bmatrix} \\sum \\frac{1}{y_i} \\\\ \\sum \\frac{1}{x_i y_i} \\end{bmatrix} \\implies \\begin{bmatrix} 7 & 2.5593 \\\\ 2.5593 & 1.5297 \\end{bmatrix} \\begin{bmatrix} \\frac{1}{a} \\\\ \\frac{b}{a} \\end{bmatrix} = \\begin{bmatrix} 8.4954 \\\\ 4.2834 \\end{bmatrix}',
        solutionLatex:
          '\\Delta = 7(1.5297) - (2.5593)^2 \\approx 4.1579, \\quad \\frac{1}{a} = \\frac{8.4954(1.5297) - 4.2834(2.5593)}{4.1579} \\approx 0.4890 \\implies a = \\frac{1}{0.4890} \\approx 2.0450, \\quad \\frac{b}{a} = \\frac{7(4.2834) - 2.5593(8.4954)}{4.1579} \\approx 1.9819 \\implies b = 1.9819 \\cdot a \\approx 4.0530',
        formulaLatex: 'y = \\frac{2.0450x}{4.0530 + x}',
        metrics: {
          r2: 0.9961,
          r: 0.998,
        },
        conclusion:
          'El modelo reproduce fielmente el efecto de saturación con $r^2 = 0.9961$.',
      },
    ],
  },

  // ==========================================
  // EJERCICIO Nº 5
  // ==========================================
  {
    number: 5,
    title: 'Resistencia a la Compresión del Cemento según Días de Curado',
    source: 'TP Nº4 · Ejercicio 5 (Cátedra ANC)',
    context:
      'Ensayo de probetas de hormigón para medir la resistencia a compresión (kg/cm²) en función de la maduración (1 a 32 días).',
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
    modelType: 'saturation',
    bestFormula: 'y = \\frac{46.6767x}{2.4739 + x}',
    r2: 0.9873,
    summaryExplanation:
      'El fraguado del cemento presenta endurecimiento rápido en la primera semana y luego estabilización asintótica hacia una resistencia límite calculada en $46.68\\text{ kg/cm}^2$.',
    bestModelNotice:
      'Resistencia límite asintótica del hormigón: $y_{\\text{asíntota}} = a = 46.68\\text{ kg/cm}^2$.',
    steps: [
      {
        letter: 'a',
        title: 'Ajuste por Saturación Asintótica de Fraguado',
        modelType: 'saturation',
        badge: 'Resistencia Asintótica',
        description:
          'Ajuste mediante ecuación del cociente $y = \\frac{a \\cdot x}{b + x}$ con transformación $\\frac{1}{y} = \\frac{1}{a} + \\left(\\frac{b}{a}\\right) \\frac{1}{x}$.',
        sumsLatex:
          'N = 8, \\quad \\sum \\frac{1}{x_i} = 2.1765, \\quad \\sum \\frac{1}{y_i} = 0.2867, \\quad \\sum \\left(\\frac{1}{x_i}\\right)^2 = 1.3932, \\quad \\sum \\frac{1}{x_i y_i} = 0.1205',
        systemLatex:
          '\\begin{bmatrix} N & \\sum \\frac{1}{x_i} \\\\ \\sum \\frac{1}{x_i} & \\sum \\left(\\frac{1}{x_i}\\right)^2 \\end{bmatrix} \\begin{bmatrix} \\frac{1}{a} \\\\ \\frac{b}{a} \\end{bmatrix} = \\begin{bmatrix} \\sum \\frac{1}{y_i} \\\\ \\sum \\frac{1}{x_i y_i} \\end{bmatrix} \\implies \\begin{bmatrix} 8 & 2.1765 \\\\ 2.1765 & 1.3932 \\end{bmatrix} \\begin{bmatrix} \\frac{1}{a} \\\\ \\frac{b}{a} \\end{bmatrix} = \\begin{bmatrix} 0.2867 \\\\ 0.1205 \\end{bmatrix}',
        solutionLatex:
          '\\Delta = 8(1.3932) - (2.1765)^2 \\approx 6.4084, \\quad \\frac{1}{a} = \\frac{0.2867(1.3932) - 0.1205(2.1765)}{6.4084} \\approx 0.02142 \\implies a = \\frac{1}{0.02142} \\approx 46.6767, \\quad \\frac{b}{a} = \\frac{8(0.1205) - 2.1765(0.2867)}{6.4084} \\approx 0.05299 \\implies b = 0.05299 \\cdot a \\approx 2.4739',
        formulaLatex: 'y = \\frac{46.6767x}{2.4739 + x}',
        metrics: {
          r2: 0.9873,
          r: 0.9936,
        },
        conclusion:
          'Excelente ajuste con $r^2 = 0.9873$, validando una resistencia teórica final de $46.68\\text{ kg/cm}^2$ a maduración infinita.',
      },
    ],
  },

  // ==========================================
  // EJERCICIO Nº 6
  // ==========================================
  {
    number: 6,
    title: 'Producción Petrolera Mundial (1880 - 1990) y Curva de Hubbert',
    source: 'TP Nº4 · Ejercicio 6 (Cátedra ANC)',
    context:
      'Evolución histórica de extracción petrolera mundial. Discusión de modelos polinómicos vs límites físicos de agotamiento.',
    points: [
      { x: 1880, y: 30 },
      { x: 1900, y: 149 },
      { x: 1920, y: 689 },
      { x: 1940, y: 2150 },
      { x: 1960, y: 7674 },
      { x: 1970, y: 16669 },
      { x: 1980, y: 21732 },
      { x: 1990, y: 17153 },
    ],
    modelType: 'polynomial',
    degree: 3,
    bestFormula: 'y = \\text{Polinomio Cúbico de Grado 3}',
    r2: 0.9912,
    summaryExplanation:
      'La producción petrolera presenta un punto de inflexión y estancamiento propio de la campana de Hubbert, haciendo que un modelo polinómico cúbico supere a una exponencial infinita.',
    bestModelNotice:
      'Conclusión de cátedra: Ningún recurso finito puede crecer exponencialmente de forma indefinida; el modelo cúbico modela con fidelidad la fase de desaceleración posterior a 1980.',
    steps: [
      {
        letter: 'a',
        title: 'Ajuste Polinómico Cúbico y Análisis del Pico Petrolero',
        modelType: 'polynomial',
        degree: 3,
        badge: 'Grado $3$',
        description:
          'Ajuste polinómico de grado 3 con sistema de ecuaciones normales de orden $4 \\times 4$ para modelar la subida acelerada y la posterior desaceleración.',
        formulaLatex:
          'y = a_1 + a_2(t) + a_3(t^2) + a_4(t^3) \\quad \\text{con } t = \\text{año} - 1880',
        metrics: {
          r2: 0.9912,
        },
        conclusion:
          'El modelo cúbico alcanza $r^2 = 0.9912$ y permite simular fielmente el pico extractivo mundial registrado hacia fines de la década de 1970.',
      },
    ],
  },
];

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
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Table size={14} className="text-slate-500" />
                <span>Tabla de datos experimentales:</span>
              </div>
              <div className="overflow-x-auto touch-pan-x rounded-xl border border-slate-200 bg-slate-50/70 scrollbar-thin [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                <table className="w-full text-center text-xs border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-200 bg-slate-100 font-mono font-bold text-slate-700">
                      <td className="px-4 py-2 text-left font-black bg-slate-200/70 border-r border-slate-200 w-20">
                        X
                      </td>
                      {ex.points.map((p, idx) => (
                        <td key={idx} className="px-4 py-2 border-r border-slate-200 last:border-r-0">
                          {p.x}
                        </td>
                      ))}
                    </tr>
                    <tr className="font-mono text-slate-800">
                      <td className="px-4 py-2 text-left font-black bg-slate-100/70 border-r border-slate-200 w-20">
                        Y
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
                  <span className="font-black text-slate-900 block">{ex.r2.toFixed(4)}</span>
                </div>
                {ex.sr !== undefined && (
                  <div className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 font-mono shadow-2xs">
                    <span className="text-slate-500 text-[10px] font-bold flex items-center gap-1">
                      <span>RESIDUOS</span> <InlineMath math="S_r" />
                    </span>
                    <span className="font-black text-slate-900 block">{ex.sr.toFixed(4)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* DESARROLLO PASO A PASO DESPLEGABLE CON INCISOS */}
            <RegressionStepAccordion
              steps={ex.steps}
              isOpenDefault={false}
              bestModelNotice={ex.bestModelNotice}
              onLoadModel={(model, deg) =>
                onLoadExercise({
                  modelType: model,
                  degree: deg,
                  points: ex.points,
                  title: `${ex.title} (${model})`,
                  source: ex.source,
                })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegressionExercisesSection;
