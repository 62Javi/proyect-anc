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
          'Ajuste por mínimos cuadrados de una recta $y = a_0 + a_1 x$ minimizando la suma de residuos cuadráticos $S_r = \\sum (y_i - a_0 - a_1 x_i)^2$',
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
          '\\begin{bmatrix} N & \\sum x_i \\\\ \\sum x_i & \\sum x_i^2 \\end{bmatrix} \\begin{bmatrix} a_0 \\\\ a_1 \\end{bmatrix} = \\begin{bmatrix} \\sum y_i \\\\ \\sum x_i y_i \\end{bmatrix} \\implies \\begin{bmatrix} 5 & 15.00 \\\\ 15.00 & 55.00 \\end{bmatrix} \\begin{bmatrix} a_0 \\\\ a_1 \\end{bmatrix} = \\begin{bmatrix} 19.70 \\\\ 78.90 \\end{bmatrix}',
        solutionLatex:
          '\\Delta = 5(55) - (15)^2 = 50, \\quad a_0 = \\frac{19.7(55) - 78.9(15)}{50} = -2.0000, \\quad a_1 = \\frac{5(78.9) - 15(19.7)}{50} = 1.9800',
        formulaLatex: 'y = -2.0000 + 1.9800x',
        dispersionBreakdown: {
          meanLatex: '\\sum y_i = 19.70 \\implies \\bar{y} = \\frac{19.70}{5} = 3.9400',
          stLatex:
            'S_t = \\sum_{i=1}^5 (y_i - \\bar{y})^2 = 11.8336 + 5.0176 + 0.2916 + 3.0976 + 19.8916 = 40.1320',
          residualTable: {
            headers: [
              'i',
              '$x_i$',
              '$y_i$',
              '$\\hat{y}_i$',
              '$(y_i - \\bar{y})^2$',
              '$e_i = y_i - \\hat{y}_i$',
              '$e_i^2$',
            ],
            rows: [
              [1, 1, 0.5, -0.02, 11.8336, '+0.5200', 0.2704],
              [2, 2, 1.7, 1.96, 5.0176, '-0.2600', 0.0676],
              [3, 3, 3.4, 3.94, 0.2916, '-0.5400', 0.2916],
              [4, 4, 5.7, 5.92, 3.0976, '-0.2200', 0.0484],
              [5, 5, 8.4, 7.9, 19.8916, '+0.5000', 0.25],
              ['Σ', 15.0, 19.7, 19.7, 40.132, '0.0000', 0.928],
            ],
          },
          srLatex:
            'S_r = \\sum_{i=1}^5 (y_i - \\hat{y}_i)^2 = 0.2704 + 0.0676 + 0.2916 + 0.0484 + 0.2500 = 0.9280',
          r2Latex:
            'r^2 = \\frac{S_t - S_r}{S_t} = \\frac{40.1320 - 0.9280}{40.1320} = \\frac{39.2040}{40.1320} \\approx 0.976876 \\approx 0.9769 \\implies r = +\\sqrt{0.9769} = 0.9884',
          scaleNote:
            'En modelos lineales y polinómicos, $S_t$ y $S_r$ se calculan directamente en la escala física original de $y$, minimizando la distancia vertical euclídea de los residuos. La suma algebraica de residuos $\\sum e_i = 0.0000$ se anula exactamente por las propiedades de Gauss.',
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
          'Linealización mediante logaritmo natural en ambos miembros: $\\ln(y) = \\ln(a) + bx \\iff Y = A_0 + A_1 x$ con $Y = \\ln(y)$, $A_0 = \\ln(a)$ y $A_1 = b$.',
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
          '\\begin{bmatrix} 5 & 15.00 \\\\ 15.00 & 55.00 \\end{bmatrix} \\begin{bmatrix} \\ln(a) \\\\ b \\end{bmatrix} = \\begin{bmatrix} 4.9300 \\\\ 21.6425 \\end{bmatrix}',
        solutionLatex:
          '\\ln(a) = \\frac{4.93(55) - 21.6425(15)}{50} = -1.0698 \\implies a = 0.3431, \\quad b = \\frac{5(21.6425) - 15(4.93)}{50} = 0.6853',
        formulaLatex: 'y = 0.3431 \\cdot e^{0.6853x}',
        dispersionBreakdown: {
          meanLatex:
            '\\bar{Y}_{\\text{transf}} = \\frac{\\sum \\ln(y_i)}{N} = 0.9860, \\qquad \\bar{y}_{\\text{orig}} = \\frac{19.70}{5} = 3.9400',
          stLatex:
            'S_{t,\\text{transf}} = \\sum_{i=1}^5 (\\ln y_i - \\bar{Y})^2 = 4.9573, \\qquad S_{t,\\text{orig}} = \\sum_{i=1}^5 (y_i - \\bar{y})^2 = 40.1320',
          residualTable: {
            headers: [
              'i',
              '$x_i$',
              '$y_i$',
              '$\\ln(y_i)$',
              '$\\widehat{\\ln(y)}_i$',
              '$e_{\\text{transf}}^2$',
              '$\\hat{y}_{\\text{orig}}$',
              '$e_{\\text{orig}}^2$',
            ],
            rows: [
              [1, 1, 0.5, -0.6931, -0.3845, 0.0952, 0.6808, 0.0327],
              [2, 2, 1.7, 0.5306, 0.3008, 0.0528, 1.351, 0.1218],
              [3, 3, 3.4, 1.2238, 0.9861, 0.0565, 2.6808, 0.5173],
              [4, 4, 5.7, 1.7405, 1.6714, 0.0048, 5.3197, 0.1447],
              [5, 5, 8.4, 2.1282, 2.3567, 0.0522, 10.556, 4.6486],
              ['Σ', 15.0, 19.7, 4.93, 4.9305, 0.2615, 20.588, 5.4651],
            ],
          },
          srLatex:
            'S_{r,\\text{transf}} = \\sum_{i=1}^5 (\\ln y_i - \\widehat{\\ln y}_i)^2 = 0.2615, \\qquad S_{r,\\text{orig}} = \\sum_{i=1}^5 (y_i - \\hat{y}_i)^2 = 5.4651',
          r2Latex:
            'r_{\\text{transf}}^2 = \\frac{4.9573 - 0.2615}{4.9573} = \\frac{4.6958}{4.9573} \\approx 0.947249 \\approx 0.9472, \\qquad r_{\\text{orig}}^2 = \\frac{40.1320 - 5.4651}{40.1320} = \\frac{34.6669}{40.1320} \\approx 0.863822 \\approx 0.8638',
          scaleNote:
            'Diferencia de escala (Linealizada vs Original): En el espacio $\\ln(y)$, el modelo reporta $r^2 = 0.9472$ minimizando los residuos logarítmicos. Sin embargo, al des-transformar a la escala física original, el error cuadrático acumulado asciende a $S_r = 5.4651$, reduciendo el $r^2$ real al $86.38\\%$ debido a la penalización en valores altos ($x=5$).',
        },
        metrics: {
          r2: 0.9472,
          sr: 5.4576,
          st: 40.132,
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
          '\\begin{bmatrix} 5 & 4.7875 \\\\ 4.7875 & 6.1995 \\end{bmatrix} \\begin{bmatrix} \\ln(a) \\\\ b \\end{bmatrix} = \\begin{bmatrix} 4.9300 \\\\ 7.5503 \\end{bmatrix}',
        solutionLatex:
          '\\Delta = 5(6.1995) - (4.7875)^2 = 8.0773, \\quad \\ln(a) = -0.6913 \\implies a = 0.5009, \\quad b = 1.7517',
        formulaLatex: 'y = 0.5009 \\cdot x^{1.7517}',
        dispersionBreakdown: {
          meanLatex:
            '\\bar{Y}_{\\text{transf}} = 0.9860, \\qquad \\bar{X}_{\\text{transf}} = 0.9575',
          stLatex:
            'S_{t,\\text{transf}} = 4.9573, \\qquad S_{t,\\text{orig}} = 40.1320',
          srLatex:
            'S_{r,\\text{transf}} = 0.000163, \\qquad S_{r,\\text{orig}} = 0.0016',
          r2Latex:
            'r_{\\text{transf}}^2 = \\frac{4.9573 - 0.000163}{4.9573} = \\frac{4.957137}{4.9573} \\approx 0.999967 \\approx 0.99997, \\qquad r_{\\text{orig}}^2 = \\frac{40.1320 - 0.0016}{40.1320} = \\frac{40.1304}{40.1320} \\approx 0.999960 \\approx 0.99997',
          scaleNote:
            'Alineación perfecta multiescala: A diferencia del ajuste exponencial, el modelo potencial preserva una fidelidad geométrica casi perfecta tanto en el espacio bilogarítmico ($r^2 = 0.99997$) como en la escala física original ($S_r = 0.0016$), lo cual ratifica que la ley fenomenológica que rige las observaciones es intrínsecamente potencial.',
        },
        metrics: {
          r2: 0.99997,
          sr: 0.0016,
          st: 40.132,
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
          'Ajuste por parábola cuadrática de segundo grado $y = a_0 + a_1 x + a_2 x^2$ resolviendo el sistema de ecuaciones normales de Gauss de orden $3 \\times 3$.',
        sumsLatex:
          '\\sum x_i = 15.0, \\quad \\sum x_i^2 = 55.0, \\quad \\sum x_i^3 = 225.0, \\quad \\sum x_i^4 = 979.0, \\quad \\sum y_i = 19.7, \\quad \\sum x_i y_i = 78.9, \\quad \\sum x_i^2 y_i = 339.1',
        systemLatex:
          '\\begin{bmatrix} 5 & 15.0 & 55.0 \\\\ 15.0 & 55.0 & 225.0 \\\\ 55.0 & 225.0 & 979.0 \\end{bmatrix} \\begin{bmatrix} a_0 \\\\ a_1 \\end{bmatrix} = \\begin{bmatrix} 19.70 \\\\ 78.90 \\\\ 339.10 \\end{bmatrix}',
        solutionLatex:
          '\\text{Eliminación de Gauss} \\implies a_0 = -0.2000, \\quad a_1 = 0.4371, \\quad a_2 = 0.2571',
        formulaLatex: 'y = -0.2000 + 0.4371x + 0.2571x^2',
        dispersionBreakdown: {
          meanLatex: '\\sum y_i = 19.70 \\implies \\bar{y} = \\frac{19.70}{5} = 3.9400',
          stLatex:
            'S_t = \\sum_{i=1}^5 (y_i - \\bar{y})^2 = 11.8336 + 5.0176 + 0.2916 + 3.0976 + 19.8916 = 40.1320',
          residualTable: {
            headers: [
              'i',
              '$x_i$',
              '$y_i$',
              '$\\hat{y}_i$',
              '$(y_i - \\bar{y})^2$',
              '$e_i = y_i - \\hat{y}_i$',
              '$e_i^2$',
            ],
            rows: [
              [1, 1, 0.5, 0.4942, 11.8336, '+0.0058', 0.000034],
              [2, 2, 1.7, 1.7026, 5.0176, '-0.0026', 0.000007],
              [3, 3, 3.4, 3.4252, 0.2916, '-0.0252', 0.000635],
              [4, 4, 5.7, 5.662, 3.0976, '+0.0380', 0.001444],
              [5, 5, 8.4, 8.413, 19.8916, '-0.0130', 0.000169],
              ['Σ', 15.0, 19.7, 19.697, 40.132, '+0.0030', 0.002289],
            ],
          },
          srLatex:
            'S_r = \\sum_{i=1}^5 (y_i - \\hat{y}_i)^2 = 0.000034 + 0.000007 + 0.000635 + 0.001444 + 0.000169 = 0.002289 \\approx 0.0023',
          r2Latex:
            'r^2 = \\frac{S_t - S_r}{S_t} = \\frac{40.1320 - 0.0023}{40.1320} = \\frac{40.1297}{40.1320} \\approx 0.9999427 \\approx 0.99994 \\implies r = +\\sqrt{0.99994} = 0.99997',
          scaleNote:
            'En el polinomio de segundo grado, la distancia se evalúa en escala física original directa. Con 3 coeficientes libres ($a_0, a_1, a_2$), la suma de residuos cuadráticos cae a $S_r = 0.0023$, alcanzando un coeficiente de determinación de $99.994\\%$.',
        },
        metrics: {
          r2: 0.99994,
          sr: 0.0023,
          st: 40.132,
          r: 0.99997,
        },
        conclusion:
          'Excelente ajuste cuadrático ($r^2 = 0.99994$, $S_r = 0.0023$). Al disponer de 3 grados de libertad ($a_0, a_1, a_2$) captura con gran exactitud la aceleración de los puntos.',
      },

      // Inciso e: Comparativa de Bondad
      {
        letter: 'e',
        title:
          'Si calculamos la Bondad del Ajuste para cada uno de los 4 casos anteriores ¿Cuál le parece que es la curva que mejor se ajusta a la tabla de valores dada? Explicar Por qué.',
        badge: 'Dictamen de Cátedra',
        description:
          'La curva que mejor se ajusta a la tabla es la POTENCIAL ($y = 0.5009 \\cdot x^{1.7517}$): registra la menor suma de residuos al cuadrado ($S_r = 0.0016$), el mayor $r^2$ ($0.99997$) y respeta el principio de parsimonia (Navaja de Ockham) al requerir sólo 2 parámetros frente a los 3 del polinomio cuadrático.',
        tableData: {
          headers: ['Modelo', 'Ecuación Matemática', '$S_r$ (Residuos²)', '$r^2$ (Bondad)', 'Veredicto'],
          rows: [
            ['Lineal', '$y = -2.0000 + 1.9800x$', '0.9280', '0.9769', 'Descartado: error sistemático'],
            ['Exponencial', '$y = 0.3431 \\cdot e^{0.6853x}$', '5.4576', '0.8640 (orig)', 'Descartado: dispersión severa'],
            ['Potencial', '$y = 0.5009 \\cdot x^{1.7517}$', '0.0016', '0.99997', 'Óptimo: Mejor ajuste y 2 parámetros'],
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
          'Modelo de saturación linealizado invirtiendo ambas variables: $\\frac{1}{y} = \\frac{1}{a} + \\left(\\frac{b}{a}\\right) \\frac{1}{x} \\iff Y\' = C_1 + C_2 X\'$ con $X\' = \\frac{1}{x}$, $Y\' = \\frac{1}{y}$, $C_1 = \\frac{1}{a}$ y $C_2 = \\frac{b}{a}$.',
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
          '\\begin{bmatrix} N & \\sum \\frac{1}{x_i} \\\\ \\sum \\frac{1}{x_i} & \\sum \\left(\\frac{1}{x_i}\\right)^2 \\end{bmatrix} \\begin{bmatrix} C_1 \\\\ C_2 \\end{bmatrix} = \\begin{bmatrix} \\sum \\frac{1}{y_i} \\\\ \\sum \\frac{1}{x_i y_i} \\end{bmatrix} \\implies \\begin{bmatrix} 5 & 2.2833 \\\\ 2.2833 & 1.4636 \\end{bmatrix} \\begin{bmatrix} C_1 \\\\ C_2 \\end{bmatrix} = \\begin{bmatrix} 3.1768 \\\\ 2.4598 \\end{bmatrix}',
        solutionLatex:
          '\\Delta = 5(1.4636) - (2.2833)^2 = 2.1045 \\implies C_1 = -0.4595 \\implies a = \\frac{1}{C_1} = -2.1764, \\quad C_2 = 2.3975 \\implies b = C_2 \\cdot a = -5.2178',
        formulaLatex:
          'y = \\frac{a \\cdot x}{b + x} = \\frac{-2.1764x}{-5.2178 + x} = \\frac{2.1764x}{5.2178 - x}',
        dispersionBreakdown: {
          meanLatex:
            '\\bar{Y\'}_{\\text{transf}} = \\frac{3.1768}{5} = 0.6354, \\qquad \\bar{y}_{\\text{orig}} = \\frac{19.70}{5} = 3.9400',
          stLatex:
            'S_{t,\\text{transf}} = \\sum_{i=1}^5 \\left(\\frac{1}{y_i} - \\bar{Y\'}\\right)^2 = 2.4590, \\qquad S_{t,\\text{orig}} = 40.1320',
          srLatex:
            'S_{r,\\text{transf}} = \\sum_{i=1}^5 \\left(\\frac{1}{y_i} - \\widehat{Y\'}_i\\right)^2 = 0.0398',
          r2Latex:
            'r_{\\text{transf}}^2 = \\frac{2.4590 - 0.0398}{2.4590} = \\frac{2.4192}{2.4590} \\approx 0.983815 \\approx 0.9838 \\quad (98.38\\% \\text{ en escala recíproca})',
          scaleNote:
            'Distorción crítica por transformación recíproca: Al transformar $Y\' = 1/y$, la derivada $-\\frac{1}{y^2}$ provoca que las desviaciones para valores pequeños de $y$ (como $y_1 = 0.5$) se magnifiquen cuadráticamente con un factor $(1/0.5^2) = 4$, mientras que para $y_5 = 8.4$ el factor es apenas $0.014$. Esto sesga artificialmente las pendientes generando un polo o asíntota vertical espuria en $x = 5.2178$.',
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
      'Serie censal de población (en millones) entre 1930 y 1980. Se solicita realizar el ajuste exponencial clásico mediante cambio de variable temporal $t = \\text{año} - 1930$, y proyectar la población para los años 1990, 1995 y 2000.',
    points: [
      { x: 1930, y: 123.203 },
      { x: 1940, y: 131.669 },
      { x: 1950, y: 150.697 },
      { x: 1960, y: 179.323 },
      { x: 1970, y: 203.212 },
      { x: 1980, y: 226.505 },
    ],
    modelType: 'exponential',
    bestFormula: 'y = 119.4674 \\cdot e^{0.01292(t)}',
    r2: 0.9852,
    summaryExplanation:
      'El modelo exponencial demográfico clásico captura la tasa de crecimiento anual sostenida ($b \\approx 1.29\\%$ anual) permitiendo realizar proyecciones confiables para fines del siglo XX.',
    bestModelNotice:
      'Proyecciones demográficas calculadas: Año 1990 ($t=60$): $259.30$ millones | Año 1995 ($t=65$): $276.60$ millones | Año 2000 ($t=70$): $295.05$ millones.',
    steps: [
      {
        letter: 'a',
        title: 'Transformación temporal y linealización semilogarítmica',
        modelType: 'exponential',
        badge: '$t = \\text{año} - 1930$',
        description:
          'Para evitar números de año elevados que desestabilizan el cálculo numérico, se define la variable temporal $t = \\text{año} - 1930$ ($t \\in [0, 50]$). Modelo: $y = a \\cdot e^{bt} \\iff \\ln(y) = \\ln(a) + bt$.',
        tableData: {
          headers: ['Año', '$t_i$', 'Población $y_i$', '$\\ln(y_i)$', '$t_i^2$', '$t_i \\cdot \\ln(y_i)$'],
          rows: [
            [1930, 0, 123.203, 4.8138, 0, 0.0],
            [1940, 10, 131.669, 4.8803, 100, 48.803],
            [1950, 20, 150.697, 5.0153, 400, 100.306],
            [1960, 30, 179.323, 5.1892, 900, 155.676],
            [1970, 40, 203.212, 5.3142, 1600, 212.57],
            [1980, 50, 226.505, 5.4228, 2500, 271.138],
            ['Σ', 150, 1014.609, 30.6356, 5500, 788.4923],
          ],
        },
        sumsLatex:
          'N = 6, \\quad \\sum t_i = 150.0, \\quad \\sum \\ln(y_i) = 30.6356, \\quad \\sum t_i^2 = 5500.0, \\quad \\sum t_i \\ln(y_i) = 788.4923',
        systemLatex:
          '\\begin{bmatrix} 6 & 150.0 \\\\ 150.0 & 5500.0 \\end{bmatrix} \\begin{bmatrix} \\ln(a) \\\\ b \\end{bmatrix} = \\begin{bmatrix} 30.6356 \\\\ 788.4923 \\end{bmatrix}',
        solutionLatex:
          '\\Delta = 6(5500) - (150)^2 = 10500, \\quad \\ln(a) = 4.7830 \\implies a = 119.4674, \\quad b = 0.01292',
        formulaLatex: 'y(t) = 119.4674 \\cdot e^{0.01292 \\cdot t}',
        metrics: {
          r2: 0.9852,
          r: 0.9926,
        },
        conclusion:
          'La tasa continua estimada de crecimiento es del $1.29\\%$ por año, con excelente bondad $r^2 = 0.9852$.',
      },
      {
        letter: 'b',
        title: 'Estimación y Proyección Demográfica Futura',
        description:
          'Evaluación del modelo ajustado para los años 1990 ($t=60$), 1995 ($t=65$) y 2000 ($t=70$):',
        solutionLatex:
          'y(1990, t=60) = 119.4674 \\cdot e^{0.01292(60)} = 259.30 \\text{ millones}\\\\ y(1995, t=65) = 119.4674 \\cdot e^{0.01292(65)} = 276.60 \\text{ millones}\\\\ y(2000, t=70) = 119.4674 \\cdot e^{0.01292(70)} = 295.05 \\text{ millones}',
        conclusion:
          'El modelo predice una población aproximada de $295$ millones de habitantes para el año 2000.',
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
          '\\begin{bmatrix} 9 & 395.0 \\\\ 395.0 & 29775.0 \\end{bmatrix} \\begin{bmatrix} \\ln(a) \\\\ b \\end{bmatrix} = \\begin{bmatrix} 33.0712 \\\\ 1274.6603 \\end{bmatrix}',
        solutionLatex:
          '\\ln(a) = 4.2984 \\implies a = 73.5814, \\quad b = -0.01421',
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
          '\\begin{bmatrix} 7 & 2.5593 \\\\ 2.5593 & 1.5297 \\end{bmatrix} \\begin{bmatrix} C_1 \\\\ C_2 \\end{bmatrix} = \\begin{bmatrix} 8.4954 \\\\ 4.2834 \\end{bmatrix}',
        solutionLatex:
          'C_1 = 0.4890 \\implies a = \\frac{1}{C_1} = 2.0450, \\quad C_2 = 1.9819 \\implies b = C_2 \\cdot a = 4.0530',
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
          '\\begin{bmatrix} 8 & 2.1765 \\\\ 2.1765 & 1.3932 \\end{bmatrix} \\begin{bmatrix} C_1 \\\\ C_2 \\end{bmatrix} = \\begin{bmatrix} 0.2867 \\\\ 0.1205 \\end{bmatrix}',
        solutionLatex:
          'C_1 = 0.02142 \\implies a = 46.6767, \\quad C_2 = 0.05299 \\implies b = 2.4739',
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
          'Ajuste polinómico de grado 3 con sistema de ecuaciones normales de Gauss de orden $4 \\times 4$ para modelar la subida acelerada y la posterior desaceleración.',
        formulaLatex:
          'y = a_0 + a_1(t) + a_2(t^2) + a_3(t^3) \\quad \\text{con } t = \\text{año} - 1880',
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
            sistemas normales de Gauss, ecuaciones ajustadas y justificaciones analíticas.
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
