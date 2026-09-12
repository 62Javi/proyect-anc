import React, { useMemo } from 'react';
import InlineMath from '../InlineMath';
import type { FitResponse, RegressionDataPoint } from '../../services/api';
import type { RegressionModelType } from '../../types/regression';

interface DynamicRegressionStepByStepProps {
  modelType: RegressionModelType;
  degree?: number;
  points: RegressionDataPoint[];
  result?: FitResponse | null;
}

function fmt(val: number, decimals: number = 4): string {
  if (!Number.isFinite(val)) return '0';
  if (Math.abs(val) < 1e-12) return '0';
  // Si es un entero exacto (ej. 15, 55, -2, 5), mostrarlo sin decimales innecesarios
  if (Math.abs(val - Math.round(val)) < 1e-9) {
    return Math.round(val).toString();
  }
  // Si es un número muy pequeño en valor absoluto, formatear en notación científica KaTeX
  if (Math.abs(val) < 1e-4) {
    const expStr = val.toExponential(2);
    const [mantissa, exp] = expStr.split('e');
    return `${mantissa} \\times 10^{${parseInt(exp)}}`;
  }
  // Formatear hasta `decimals` dígitos y remover ceros sobrantes al final
  const fixed = val.toFixed(decimals);
  return fixed.replace(/\.?0+$/, '');
}

function eqOp(val: number, decimals: number = 4): string {
  if (!Number.isFinite(val)) return '=';
  if (Math.abs(val) < 1e-12) return '=';
  if (Math.abs(val - Math.round(val)) < 1e-9) return '=';
  const factor = Math.pow(10, decimals);
  const rounded = Math.round(val * factor) / factor;
  if (Math.abs(val - rounded) < 1e-9) return '=';
  return '\\approx';
}

function eq(val: number, decimals: number = 4): string {
  const op = eqOp(val, decimals);
  return `${op} ${fmt(val, decimals)}`;
}

function det2x2(a: number, b: number, c: number, d: number): number {
  return a * d - b * c;
}

function det3x3(m: number[][]): number {
  return (
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
  );
}

export const DynamicRegressionStepByStep: React.FC<DynamicRegressionStepByStepProps> = ({
  modelType,
  degree = 2,
  points,
  result,
}) => {
  const stepData = useMemo(() => {
    if (!points || points.length < 2) return null;
    const n = points.length;

    // 1. LINEAL
    if (modelType === 'linear') {
      const xs = points.map((p) => p.x);
      const ys = points.map((p) => p.y);

      const sumX = xs.reduce((acc, v) => acc + v, 0);
      const sumY = ys.reduce((acc, v) => acc + v, 0);
      const sumX2 = xs.reduce((acc, v) => acc + v * v, 0);
      const sumXY = points.reduce((acc, p) => acc + p.x * p.y, 0);

      const delta = det2x2(n, sumX, sumX, sumX2);
      const deltaA1 = det2x2(sumY, sumX, sumXY, sumX2);
      const deltaA2 = det2x2(n, sumY, sumX, sumXY);

      const a1 = delta !== 0 ? deltaA1 / delta : 0;
      const a2 = delta !== 0 ? deltaA2 / delta : 0;

      const yMean = sumY / n;
      const st = ys.reduce((acc, v) => acc + Math.pow(v - yMean, 2), 0);
      const sr = points.reduce((acc, p) => {
        const pred = a1 + a2 * p.x;
        return acc + Math.pow(p.y - pred, 2);
      }, 0);
      const r2 = st > 1e-12 ? Math.max(0, (st - sr) / st) : 1;

      return {
        step2Title: '2. Sumatorias calculadas para el sistema lineal:',
        sumsLatex: `N = ${n}, \\quad \\sum x_i = ${fmt(sumX)}, \\quad \\sum y_i = ${fmt(sumY)}, \\quad \\sum x_i^2 = ${fmt(sumX2)}, \\quad \\sum x_i y_i = ${fmt(sumXY)}`,
        step3Title: '3. Sistema de ecuaciones normales y sustitución numérica:',
        matrixLatex: `\\begin{bmatrix} N & \\sum x_i \\\\ \\sum x_i & \\sum x_i^2 \\end{bmatrix} \\begin{bmatrix} a_1 \\\\ a_2 \\end{bmatrix} = \\begin{bmatrix} \\sum y_i \\\\ \\sum x_i y_i \\end{bmatrix} \\implies \\begin{bmatrix} ${n} & ${fmt(sumX, 2)} \\\\ ${fmt(sumX, 2)} & ${fmt(sumX2, 2)} \\end{bmatrix} \\begin{bmatrix} a_1 \\\\ a_2 \\end{bmatrix} = \\begin{bmatrix} ${fmt(sumY, 2)} \\\\ ${fmt(sumXY, 2)} \\end{bmatrix}`,
        step4Title: '4. Resolución analítica de los coeficientes (Regla de Cramer):',
        cramerLatex: `\\Delta = ${n}(${fmt(sumX2, 2)}) - (${fmt(sumX, 2)})^2 ${eq(delta, 4)} \\\\[6pt] a_1 = \\frac{(${fmt(sumY, 2)})(${fmt(sumX2, 2)}) - (${fmt(sumXY, 2)})(${fmt(sumX, 2)})}{${fmt(delta, 4)}} ${eq(a1, 4)} \\\\[6pt] a_2 = \\frac{${n}(${fmt(sumXY, 2)}) - (${fmt(sumX, 2)})(${fmt(sumY, 2)})}{${fmt(delta, 4)}} ${eq(a2, 4)}`,
        step5Title: '5. Sustitución de coeficientes en el modelo lineal:',
        formulaLatex: `y = ${fmt(a1, 4)} ${a2 >= 0 ? '+' : '-'} ${fmt(Math.abs(a2), 4)}x`,
        r2Val: r2,
        meanLabel: 'PROMEDIO ORIGINAL:',
        meanLatex: `y_{\\text{media}} = \\frac{\\sum y_i}{N} = \\frac{${fmt(sumY)}}{${n}} ${eq(yMean, 4)}`,
        stLatex: `ST = \\sum (y_i - y_{\\text{media}})^2 ${eq(st, 6)}`,
        srLatex: `SR = \\sum (y_i - \\hat{y}_i)^2 ${eq(sr, 6)}`,
        r2Latex: `r^2 = \\frac{ST - SR}{ST} = \\frac{${fmt(st, 4)} - ${fmt(sr, 4)}}{${fmt(st, 4)}} ${eq(r2, 4)}`,
      };
    }

    // 2. EXPONENCIAL y = a * e^(bx)  ==> ln(y) = ln(a) + b x
    if (modelType === 'exponential') {
      const validPoints = points.filter((p) => p.y > 0);
      if (validPoints.length < 2) return null;
      const count = validPoints.length;

      const xs = validPoints.map((p) => p.x);
      const lnYs = validPoints.map((p) => Math.log(p.y));

      const sumX = xs.reduce((acc, v) => acc + v, 0);
      const sumLnY = lnYs.reduce((acc, v) => acc + v, 0);
      const sumX2 = xs.reduce((acc, v) => acc + v * v, 0);
      const sumXLnY = validPoints.reduce((acc, p) => acc + p.x * Math.log(p.y), 0);

      const delta = det2x2(count, sumX, sumX, sumX2);
      const deltaLnA = det2x2(sumLnY, sumX, sumXLnY, sumX2);
      const deltaB = det2x2(count, sumLnY, sumX, sumXLnY);

      const lnA = delta !== 0 ? deltaLnA / delta : 0;
      const b = delta !== 0 ? deltaB / delta : 0;
      const a = Math.exp(lnA);

      const meanLnY = sumLnY / count;
      const st = lnYs.reduce((acc, v) => acc + Math.pow(v - meanLnY, 2), 0);
      const sr = validPoints.reduce((acc, p) => {
        const predLn = lnA + b * p.x;
        return acc + Math.pow(Math.log(p.y) - predLn, 2);
      }, 0);
      const r2 = st > 1e-12 ? Math.max(0, (st - sr) / st) : 1;

      return {
        step2Title: '2. Sumatorias calculadas para el sistema linealizado [ln(y) = ln(a) + bx]:',
        sumsLatex: `N = ${count}, \\quad \\sum x_i = ${fmt(sumX)}, \\quad \\sum \\ln(y_i) = ${fmt(sumLnY)}, \\quad \\sum x_i^2 = ${fmt(sumX2)}, \\quad \\sum x_i \\ln(y_i) = ${fmt(sumXLnY)}`,
        step3Title: '3. Sistema de ecuaciones normales y sustitución numérica:',
        matrixLatex: `\\begin{bmatrix} N & \\sum x_i \\\\ \\sum x_i & \\sum x_i^2 \\end{bmatrix} \\begin{bmatrix} \\ln(a) \\\\ b \\end{bmatrix} = \\begin{bmatrix} \\sum \\ln(y_i) \\\\ \\sum x_i \\ln(y_i) \\end{bmatrix} \\implies \\begin{bmatrix} ${count} & ${fmt(sumX, 2)} \\\\ ${fmt(sumX, 2)} & ${fmt(sumX2, 2)} \\end{bmatrix} \\begin{bmatrix} \\ln(a) \\\\ b \\end{bmatrix} = \\begin{bmatrix} ${fmt(sumLnY, 2)} \\\\ ${fmt(sumXLnY, 2)} \\end{bmatrix}`,
        step4Title: '4. Resolución analítica de los coeficientes (Regla de Cramer):',
        cramerLatex: `\\Delta = ${count}(${fmt(sumX2, 2)}) - (${fmt(sumX, 2)})^2 ${eq(delta, 4)} \\\\[6pt] \\ln(a) = \\frac{(${fmt(sumLnY, 2)})(${fmt(sumX2, 2)}) - (${fmt(sumXLnY, 2)})(${fmt(sumX, 2)})}{${fmt(delta, 4)}} ${eq(lnA, 4)} \\implies a = e^{${fmt(lnA, 4)}} ${eq(a, 4)} \\\\[6pt] b = \\frac{${count}(${fmt(sumXLnY, 2)}) - (${fmt(sumX, 2)})(${fmt(sumLnY, 2)})}{${fmt(delta, 4)}} ${eq(b, 5)}`,
        step5Title: '5. Sustitución de coeficientes en el modelo exponencial:',
        formulaLatex: `y = ${fmt(a, 4)} \\cdot e^{${fmt(b, 5)}x}`,
        r2Val: r2,
        meanLabel: 'PROMEDIO LINEALIZADO:',
        meanLatex: `y_{\\text{media}} = \\frac{\\sum \\ln(y_i)}{N} = \\frac{${fmt(sumLnY)}}{${count}} ${eq(meanLnY, 4)}`,
        stLatex: `ST = \\sum (\\ln(y_i) - y_{\\text{media}})^2 ${eq(st, 6)}`,
        srLatex: `SR = \\sum (\\ln(y_i) - \\ln(\\hat{y}_i))^2 ${eq(sr, 6)}`,
        r2Latex: `r^2 = \\frac{ST - SR}{ST} = \\frac{${fmt(st, 4)} - ${fmt(sr, 4)}}{${fmt(st, 4)}} ${eq(r2, 4)}`,
      };
    }

    // 3. POTENCIAL y = a * x^b ==> ln(y) = ln(a) + b * ln(x)
    if (modelType === 'power') {
      const validPoints = points.filter((p) => p.x > 0 && p.y > 0);
      if (validPoints.length < 2) return null;
      const count = validPoints.length;

      const lnXs = validPoints.map((p) => Math.log(p.x));
      const lnYs = validPoints.map((p) => Math.log(p.y));

      const sumLnX = lnXs.reduce((acc, v) => acc + v, 0);
      const sumLnY = lnYs.reduce((acc, v) => acc + v, 0);
      const sumLnX2 = lnXs.reduce((acc, v) => acc + v * v, 0);
      const sumLnXLnY = validPoints.reduce((acc, p) => acc + Math.log(p.x) * Math.log(p.y), 0);

      const delta = det2x2(count, sumLnX, sumLnX, sumLnX2);
      const deltaLnA = det2x2(sumLnY, sumLnX, sumLnXLnY, sumLnX2);
      const deltaB = det2x2(count, sumLnY, sumLnX, sumLnXLnY);

      const lnA = delta !== 0 ? deltaLnA / delta : 0;
      const b = delta !== 0 ? deltaB / delta : 0;
      const a = Math.exp(lnA);

      const meanLnY = sumLnY / count;
      const st = lnYs.reduce((acc, v) => acc + Math.pow(v - meanLnY, 2), 0);
      const sr = validPoints.reduce((acc, p) => {
        const predLn = lnA + b * Math.log(p.x);
        return acc + Math.pow(Math.log(p.y) - predLn, 2);
      }, 0);
      const r2 = st > 1e-12 ? Math.max(0, (st - sr) / st) : 1;

      return {
        step2Title: '2. Sumatorias calculadas para el sistema linealizado [ln(y) = ln(a) + b·ln(x)]:',
        sumsLatex: `N = ${count}, \\quad \\sum \\ln(x_i) = ${fmt(sumLnX)}, \\quad \\sum \\ln(y_i) = ${fmt(sumLnY)}, \\quad \\sum (\\ln(x_i))^2 = ${fmt(sumLnX2)}, \\quad \\sum \\ln(x_i)\\ln(y_i) = ${fmt(sumLnXLnY)}`,
        step3Title: '3. Sistema de ecuaciones normales y sustitución numérica:',
        matrixLatex: `\\begin{bmatrix} N & \\sum \\ln(x_i) \\\\ \\sum \\ln(x_i) & \\sum (\\ln(x_i))^2 \\end{bmatrix} \\begin{bmatrix} \\ln(a) \\\\ b \\end{bmatrix} = \\begin{bmatrix} \\sum \\ln(y_i) \\\\ \\sum \\ln(x_i)\\ln(y_i) \\end{bmatrix} \\implies \\begin{bmatrix} ${count} & ${fmt(sumLnX, 2)} \\\\ ${fmt(sumLnX, 2)} & ${fmt(sumLnX2, 2)} \\end{bmatrix} \\begin{bmatrix} \\ln(a) \\\\ b \\end{bmatrix} = \\begin{bmatrix} ${fmt(sumLnY, 2)} \\\\ ${fmt(sumLnXLnY, 2)} \\end{bmatrix}`,
        step4Title: '4. Resolución analítica de los coeficientes (Regla de Cramer):',
        cramerLatex: `\\Delta = ${count}(${fmt(sumLnX2, 2)}) - (${fmt(sumLnX, 2)})^2 ${eq(delta, 4)} \\\\[6pt] \\ln(a) = \\frac{(${fmt(sumLnY, 2)})(${fmt(sumLnX2, 2)}) - (${fmt(sumLnXLnY, 2)})(${fmt(sumLnX, 2)})}{${fmt(delta, 4)}} ${eq(lnA, 4)} \\implies a = e^{${fmt(lnA, 4)}} ${eq(a, 4)} \\\\[6pt] b = \\frac{${count}(${fmt(sumLnXLnY, 2)}) - (${fmt(sumLnX, 2)})(${fmt(sumLnY, 2)})}{${fmt(delta, 4)}} ${eq(b, 5)}`,
        step5Title: '5. Sustitución de coeficientes en el modelo potencial:',
        formulaLatex: `y = ${fmt(a, 4)} \\cdot x^{${fmt(b, 5)}}`,
        r2Val: r2,
        meanLabel: 'PROMEDIO LINEALIZADO:',
        meanLatex: `y_{\\text{media}} = \\frac{\\sum \\ln(y_i)}{N} = \\frac{${fmt(sumLnY)}}{${count}} ${eq(meanLnY, 4)}`,
        stLatex: `ST = \\sum (\\ln(y_i) - y_{\\text{media}})^2 ${eq(st, 6)}`,
        srLatex: `SR = \\sum (\\ln(y_i) - \\ln(\\hat{y}_i))^2 ${eq(sr, 6)}`,
        r2Latex: `r^2 = \\frac{ST - SR}{ST} = \\frac{${fmt(st, 4)} - ${fmt(sr, 4)}}{${fmt(st, 4)}} ${eq(r2, 4)}`,
      };
    }

    // 4. COCIENTE / SATURACIÓN y = (a*x)/(b + x) ==> 1/y = 1/a + (b/a)*(1/x)
    if (modelType === 'saturation') {
      const validPoints = points.filter((p) => p.x !== 0 && p.y !== 0);
      if (validPoints.length < 2) return null;
      const count = validPoints.length;

      const invXs = validPoints.map((p) => 1 / p.x);
      const invYs = validPoints.map((p) => 1 / p.y);

      const sumInvX = invXs.reduce((acc, v) => acc + v, 0);
      const sumInvY = invYs.reduce((acc, v) => acc + v, 0);
      const sumInvX2 = invXs.reduce((acc, v) => acc + v * v, 0);
      const sumInvXY = validPoints.reduce((acc, p) => acc + (1 / p.x) * (1 / p.y), 0);

      const delta = det2x2(count, sumInvX, sumInvX, sumInvX2);
      const deltaA1 = det2x2(sumInvY, sumInvX, sumInvXY, sumInvX2);
      const deltaA2 = det2x2(count, sumInvY, sumInvX, sumInvXY);

      const a1 = delta !== 0 ? deltaA1 / delta : 0; // 1/a
      const a2 = delta !== 0 ? deltaA2 / delta : 0; // b/a

      const a = a1 !== 0 ? 1 / a1 : 0;
      const b = a2 * a;

      const meanInvY = sumInvY / count;
      const st = invYs.reduce((acc, v) => acc + Math.pow(v - meanInvY, 2), 0);
      const sr = validPoints.reduce((acc, p) => {
        const predInv = a1 + a2 * (1 / p.x);
        return acc + Math.pow(1 / p.y - predInv, 2);
      }, 0);
      const r2 = st > 1e-12 ? Math.max(0, (st - sr) / st) : 1;

      return {
        step2Title: '2. Sumatorias calculadas para el sistema linealizado:',
        sumsLatex: `N = ${count}, \\quad \\sum \\frac{1}{x_i} = ${fmt(sumInvX)}, \\quad \\sum \\frac{1}{y_i} = ${fmt(sumInvY)}, \\quad \\sum \\left(\\frac{1}{x_i}\\right)^2 = ${fmt(sumInvX2)}, \\quad \\sum \\frac{1}{x_i y_i} = ${fmt(sumInvXY)}`,
        step3Title: '3. Sistema de ecuaciones normales y sustitución numérica:',
        matrixLatex: `\\begin{bmatrix} N & \\sum \\frac{1}{x_i} \\\\ \\sum \\frac{1}{x_i} & \\sum \\left(\\frac{1}{x_i}\\right)^2 \\end{bmatrix} \\begin{bmatrix} a_1 \\\\ a_2 \\end{bmatrix} = \\begin{bmatrix} \\sum \\frac{1}{y_i} \\\\ \\sum \\frac{1}{x_i y_i} \\end{bmatrix} \\implies \\begin{bmatrix} ${count} & ${fmt(sumInvX, 4)} \\\\ ${fmt(sumInvX, 4)} & ${fmt(sumInvX2, 4)} \\end{bmatrix} \\begin{bmatrix} a_1 \\\\ a_2 \\end{bmatrix} = \\begin{bmatrix} ${fmt(sumInvY, 4)} \\\\ ${fmt(sumInvXY, 4)} \\end{bmatrix}`,
        step4Title: '4. Resolución analítica de los coeficientes (Regla de Cramer):',
        cramerLatex: `\\Delta = ${count}(${fmt(sumInvX2, 4)}) - (${fmt(sumInvX, 4)})^2 ${eq(delta, 4)} \\\\[6pt] a_1 = \\frac{1}{a} = \\frac{(${fmt(sumInvY, 4)})(${fmt(sumInvX2, 4)}) - (${fmt(sumInvXY, 4)})(${fmt(sumInvX, 4)})}{${fmt(delta, 4)}} ${eq(a1, 5)} \\implies a = \\frac{1}{${fmt(a1, 5)}} ${eq(a, 4)} \\\\[6pt] a_2 = \\frac{b}{a} = \\frac{${count}(${fmt(sumInvXY, 4)}) - (${fmt(sumInvX, 4)})(${fmt(sumInvY, 4)})}{${fmt(delta, 4)}} ${eq(a2, 5)} \\implies b = ${fmt(a2, 5)} \\cdot a ${eq(b, 4)}`,
        step5Title: '5. Sustitución de coeficientes en el modelo del cociente:',
        formulaLatex: `y = \\frac{a \\cdot x}{b + x} = \\frac{${fmt(a, 4)} \\cdot x}{${fmt(b, 4)} + x}`,
        r2Val: r2,
        meanLabel: 'PROMEDIO LINEALIZADO:',
        meanLatex: `y_{\\text{media}} = \\frac{\\sum (1/y_i)}{N} = \\frac{${fmt(sumInvY)}}{${count}} ${eq(meanInvY, 4)}`,
        stLatex: `ST = \\sum (Y_i - y_{\\text{media}})^2 ${eq(st, 6)}`,
        srLatex: `SR = \\sum (Y_i - Y_{\\text{ajuste}})^2 ${eq(sr, 6)}`,
        r2Latex: `r^2 = \\frac{ST - SR}{ST} = \\frac{${fmt(st, 6)} - ${fmt(sr, 6)}}{${fmt(st, 6)}} ${eq(r2, 4)}`,
      };
    }

    // 5. POLINÓMICO (Grado 2 o superior)
    if (modelType === 'polynomial') {
      const xs = points.map((p) => p.x);
      const ys = points.map((p) => p.y);

      if (degree === 2) {
        const sumX = xs.reduce((acc, v) => acc + v, 0);
        const sumX2 = xs.reduce((acc, v) => acc + v * v, 0);
        const sumX3 = xs.reduce((acc, v) => acc + Math.pow(v, 3), 0);
        const sumX4 = xs.reduce((acc, v) => acc + Math.pow(v, 4), 0);

        const sumY = ys.reduce((acc, v) => acc + v, 0);
        const sumXY = points.reduce((acc, p) => acc + p.x * p.y, 0);
        const sumX2Y = points.reduce((acc, p) => acc + p.x * p.x * p.y, 0);

        const matA = [
          [n, sumX, sumX2],
          [sumX, sumX2, sumX3],
          [sumX2, sumX3, sumX4],
        ];

        const matA1 = [
          [sumY, sumX, sumX2],
          [sumXY, sumX2, sumX3],
          [sumX2Y, sumX3, sumX4],
        ];

        const matA2 = [
          [n, sumY, sumX2],
          [sumX, sumXY, sumX3],
          [sumX2, sumX2Y, sumX4],
        ];

        const matA3 = [
          [n, sumX, sumY],
          [sumX, sumX2, sumXY],
          [sumX2, sumX3, sumX2Y],
        ];

        const delta = det3x3(matA);
        const deltaA1 = det3x3(matA1);
        const deltaA2 = det3x3(matA2);
        const deltaA3 = det3x3(matA3);

        const a1 = delta !== 0 ? deltaA1 / delta : 0;
        const a2 = delta !== 0 ? deltaA2 / delta : 0;
        const a3 = delta !== 0 ? deltaA3 / delta : 0;

        const yMean = sumY / n;
        const st = ys.reduce((acc, v) => acc + Math.pow(v - yMean, 2), 0);
        const sr = points.reduce((acc, p) => {
          const pred = a1 + a2 * p.x + a3 * p.x * p.x;
          return acc + Math.pow(p.y - pred, 2);
        }, 0);
        const r2 = st > 1e-12 ? Math.max(0, (st - sr) / st) : 1;

        return {
          step2Title: '2. Sumatorias calculadas para el sistema polinómico de grado 2:',
          sumsLatex: `N = ${n}, \\quad \\sum x_i = ${fmt(sumX)}, \\quad \\sum x_i^2 = ${fmt(sumX2)}, \\quad \\sum x_i^3 = ${fmt(sumX3)}, \\quad \\sum x_i^4 = ${fmt(sumX4)}, \\quad \\sum y_i = ${fmt(sumY)}, \\quad \\sum x_i y_i = ${fmt(sumXY)}, \\quad \\sum x_i^2 y_i = ${fmt(sumX2Y)}`,
          step3Title: '3. Sistema de ecuaciones normales y sustitución numérica:',
          matrixLatex: `\\begin{bmatrix} N & \\sum x_i & \\sum x_i^2 \\\\ \\sum x_i & \\sum x_i^2 & \\sum x_i^3 \\\\ \\sum x_i^2 & \\sum x_i^3 & \\sum x_i^4 \\end{bmatrix} \\begin{bmatrix} a_1 \\\\ a_2 \\\\ a_3 \\end{bmatrix} = \\begin{bmatrix} \\sum y_i \\\\ \\sum x_i y_i \\\\ \\sum x_i^2 y_i \\end{bmatrix} \\implies \\begin{bmatrix} ${n} & ${fmt(sumX, 1)} & ${fmt(sumX2, 1)} \\\\ ${fmt(sumX, 1)} & ${fmt(sumX2, 1)} & ${fmt(sumX3, 1)} \\\\ ${fmt(sumX2, 1)} & ${fmt(sumX3, 1)} & ${fmt(sumX4, 1)} \\end{bmatrix} \\begin{bmatrix} a_1 \\\\ a_2 \\\\ a_3 \\end{bmatrix} = \\begin{bmatrix} ${fmt(sumY, 1)} \\\\ ${fmt(sumXY, 1)} \\\\ ${fmt(sumX2Y, 1)} \\end{bmatrix}`,
          step4Title: '4. Resolución analítica de los coeficientes (Regla de Cramer):',
          cramerLatex: `\\Delta = \\det(\\mathbf{A}) ${eq(delta, 2)} \\\\[6pt] a_1 = \\frac{\\Delta_{a_1}}{\\Delta} ${eq(a1, 4)}, \\quad a_2 = \\frac{\\Delta_{a_2}}{\\Delta} ${eq(a2, 4)}, \\quad a_3 = \\frac{\\Delta_{a_3}}{\\Delta} ${eq(a3, 4)}`,
          step5Title: '5. Sustitución de coeficientes en la parábola cuadrática:',
          formulaLatex: `y = ${fmt(a1, 4)} ${a2 >= 0 ? '+' : '-'} ${fmt(Math.abs(a2), 4)}x ${a3 >= 0 ? '+' : '-'} ${fmt(Math.abs(a3), 4)}x^2`,
          r2Val: r2,
          meanLabel: 'PROMEDIO:',
          meanLatex: `y_{\\text{media}} = \\frac{\\sum y_i}{N} = \\frac{${fmt(sumY)}}{${n}} ${eq(yMean, 4)}`,
          stLatex: `ST = \\sum (y_i - y_{\\text{media}})^2 ${eq(st, 6)}`,
          srLatex: `SR = \\sum (y_i - \\hat{y}_i)^2 ${eq(sr, 6)}`,
          r2Latex: `r^2 = \\frac{ST - SR}{ST} = \\frac{${fmt(st, 4)} - ${fmt(sr, 4)}}{${fmt(st, 4)}} ${eq(r2, 5)}`,
        };
      } else {
        const yMean = ys.reduce((acc, v) => acc + v, 0) / n;
        const st = result?.metrics?.st ?? 0;
        const sr = result?.metrics?.sr ?? 0;
        const r2 = result?.metrics?.r2 ?? 0;

        return {
          step2Title: `2. Sumatorias calculadas para el sistema polinómico de grado ${degree}:`,
          sumsLatex: `N = ${n}, \\quad \\sum x_i = ${fmt(xs.reduce((a, b) => a + b, 0))}, \\quad \\sum y_i = ${fmt(ys.reduce((a, b) => a + b, 0))}`,
          step3Title: '3. Sistema de ecuaciones normales y sustitución numérica:',
          matrixLatex: result?.normal_equations?.matrix_latex ?? '',
          step4Title: '4. Resolución analítica de los coeficientes:',
          cramerLatex: result?.normal_equations?.solution_latex ?? '',
          step5Title: `5. Sustitución de coeficientes en el polinomio de grado ${degree}:`,
          formulaLatex: result?.formula_latex ?? '',
          r2Val: r2,
          meanLabel: 'PROMEDIO:',
          meanLatex: `y_{\\text{media}} = \\frac{\\sum y_i}{N} ${eq(yMean, 4)}`,
          stLatex: `ST = \\sum (y_i - y_{\\text{media}})^2 ${eq(st, 6)}`,
          srLatex: `SR = \\sum (y_i - \\hat{y}_i)^2 ${eq(sr, 6)}`,
          r2Latex: `r^2 = \\frac{ST - SR}{ST} ${eq(r2, 5)}`,
        };
      }
    }

    return null;
  }, [points, modelType, degree, result]);

  if (!stepData) return null;

  return (
    <div className="space-y-6 pt-2">
      {/* 2. Sumatorias */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-slate-800 tracking-tight">
          {stepData.step2Title}
        </h4>
        <div className="p-4 sm:p-6 bg-slate-50/90 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs overflow-x-auto max-w-full scrollbar-thin">
          <div className="text-center text-xs sm:text-sm font-mono text-slate-800">
            <InlineMath math={stepData.sumsLatex} />
          </div>
        </div>
      </div>

      {/* 3. Sistema de Ecuaciones Normales */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-slate-800 tracking-tight">
          {stepData.step3Title}
        </h4>
        <div className="p-4 sm:p-6 bg-slate-50/90 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs overflow-x-auto max-w-full scrollbar-thin">
          <div className="text-center text-xs sm:text-sm font-mono text-slate-800">
            <InlineMath math={stepData.matrixLatex} />
          </div>
        </div>
      </div>

      {/* 4. Cramer */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-slate-800 tracking-tight">
          {stepData.step4Title}
        </h4>
        <div className="p-4 sm:p-6 bg-slate-50/90 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs overflow-x-auto max-w-full scrollbar-thin">
          <div className="text-center text-xs sm:text-sm font-mono text-slate-800 leading-loose">
            <InlineMath math={stepData.cramerLatex} />
          </div>
        </div>
      </div>

      {/* 5. Modelo Ajustado Obtenido */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-slate-800 tracking-tight">
          {stepData.step5Title}
        </h4>
        <div className="p-4 sm:p-5 bg-slate-50/90 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="text-center text-base sm:text-lg font-mono font-bold text-slate-900 overflow-x-auto overflow-y-hidden py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <InlineMath math={stepData.formulaLatex} />
          </div>
        </div>
      </div>

      {/* 6. Dispersión, Residuos y Bondad de Ajuste */}
      <div className="space-y-3 pt-2">
        <div className="space-y-0.5">
          <h4 className="text-sm font-bold text-slate-900 tracking-tight">
            6. Evaluación de la bondad de ajuste y análisis de varianza:
          </h4>
          <p className="text-xs text-slate-500">
            Desglose analítico entre la dispersión total (<InlineMath math="ST" />), el error residual no explicado (<InlineMath math="SR" />) y el coeficiente de determinación (<InlineMath math="r^2" />).
          </p>
        </div>

        {/* HERO CARD: COEFICIENTE DE DETERMINACIÓN r² */}
        <div className="p-5 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                BONDAD DE AJUSTE GLOBAL · COEFICIENTE DE DETERMINACIÓN
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Proporción de varianza explicada por el modelo respecto a la media
              </span>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 font-mono">
                {(stepData.r2Val * 100).toFixed(2)}% varianza explicada
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900 text-white">
                {stepData.r2Val >= 0.90
                  ? 'Ajuste Muy Alto'
                  : stepData.r2Val >= 0.80
                  ? 'Ajuste Aceptable'
                  : 'Ajuste Regular / Débil'}
              </span>
            </div>
          </div>

          <div className="text-sm sm:text-base md:text-lg font-mono font-bold text-slate-900 overflow-x-auto overflow-y-hidden py-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <InlineMath math={stepData.r2Latex} />
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {stepData.r2Val >= 0.90
              ? `El modelo ajustado reproduce de manera óptima la tendencia física experimental, explicando el ${(stepData.r2Val * 100).toFixed(2)}% de la variación total observada.`
              : `El modelo explica el ${(stepData.r2Val * 100).toFixed(2)}% de la variación muestral. Una discrepancia residual considerable puede indicar no linealidad o un comportamiento asintótico distinto.`}
          </p>
        </div>

        {/* 3 VARIANCE METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Card 1: Promedio Muestral */}
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                {stepData.meanLabel}
              </span>
              <span className="text-[11px] text-slate-400 font-medium block">
                Línea base horizontal de referencia
              </span>
            </div>
            <div className="text-xs sm:text-sm font-mono text-slate-900 overflow-x-auto overflow-y-hidden py-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <InlineMath math={stepData.meanLatex} />
            </div>
            <p className="text-[11px] text-slate-500 leading-snug pt-1 border-t border-slate-100">
              Media de las respuestas experimentales observadas.
            </p>
          </div>

          {/* Card 2: Dispersión Total ST */}
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                DISPERSIÓN TOTAL (<InlineMath math="ST" />)
              </span>
              <span className="text-[11px] text-slate-400 font-medium block">
                Variabilidad total respecto a la media
              </span>
            </div>
            <div className="text-xs sm:text-sm font-mono text-slate-900 overflow-x-auto overflow-y-hidden py-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <InlineMath math={stepData.stLatex} />
            </div>
            <p className="text-[11px] text-slate-500 leading-snug pt-1 border-t border-slate-100">
              Suma de cuadrados total sin considerar el efecto de <InlineMath math="x" />.
            </p>
          </div>

          {/* Card 3: Suma de Residuos Cuadráticos SR */}
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                SUMA DE RESIDUOS (<InlineMath math="SR" />)
              </span>
              <span className="text-[11px] text-slate-400 font-medium block">
                Error residual no explicado
              </span>
            </div>
            <div className="text-xs sm:text-sm font-mono text-slate-900 overflow-x-auto overflow-y-hidden py-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <InlineMath math={stepData.srLatex} />
            </div>
            <p className="text-[11px] text-slate-500 leading-snug pt-1 border-t border-slate-100">
              Discrepancia cuadrática minimizada por el ajuste.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicRegressionStepByStep;
