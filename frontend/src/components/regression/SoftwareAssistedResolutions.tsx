import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Info,
  ChevronDown,
  Sparkles,
  BarChart2,
  Calendar,
} from 'lucide-react';
import InlineMath from '../InlineMath';
import { MathBlock } from './RegressionStepAccordion';

interface ExercisePoint {
  x: number;
  y: number;
}

// =========================================================================
// EJERCICIO Nº 5: RESISTENCIA DEL CEMENTO
// =========================================================================
export const Exercise5VisualResolution: React.FC<{ points: ExercisePoint[] }> = ({ points }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // Saturation formula: y = (46.6767 * x) / (2.4739 + x)
  // Asymptote: a = 46.6767
  const chartData = useMemo(() => {
    const data: {
      x: number;
      actual?: number;
      curve?: number;
      isPrediction?: boolean;
    }[] = [];

    const expMap = new Map<number, number>();
    points.forEach((p) => expMap.set(p.x, p.y));

    for (let day = 0; day <= 42; day += 1) {
      const pred = (46.6767 * day) / (2.4739 + day);
      const actualVal = expMap.get(day);

      data.push({
        x: day,
        actual: actualVal !== undefined ? actualVal : undefined,
        curve: Math.round(pred * 100) / 100,
        isPrediction: day === 40,
      });
    }

    return data;
  }, [points]);

  return (
    <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-4 print:bg-white print:border-none print:p-0">
      {/* Cabecera Desplegable */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left cursor-pointer select-none group print:hidden"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-black text-slate-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
            <BarChart2 size={15} className="text-blue-600" />
            <span>Resolución con Nube de Puntos y Análisis Asistido</span>
          </span>
          <span className="text-[11px] font-semibold text-blue-700 font-mono bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200">
            2 incisos resueltos (a - b)
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors shrink-0">
          <span>{isOpen ? 'Ocultar resolución' : 'Ver resolución detallada'}</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="space-y-6 pt-3 border-t border-slate-200 print:border-none print:pt-0">
          {/* GRÁFICO INTERACTIVO: NUBE DE PUNTOS EXPERIMENTAL + CURVA DE SATURACIÓN */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                  <TrendingUp size={16} className="text-blue-600" />
                  <span>Nube de Puntos Experimental y Curva de Fraguado (Ecuación del Cociente)</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Visualización de la resistencia a compresión vs. edad en días con asíntota límite
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
                <span>Asíntota teórica:</span>
                <strong className="text-slate-900">46.68 kg/cm²</strong>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 15, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="x"
                    type="number"
                    domain={[0, 42]}
                    stroke="#94a3b8"
                    fontSize={11}
                    tickCount={9}
                    label={{
                      value: 'Edad del Cemento (días)',
                      position: 'insideBottom',
                      offset: -12,
                      fontSize: 11,
                      fill: '#64748b',
                    }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    domain={[0, 50]}
                    label={{
                      value: 'Resistencia (kg/cm²)',
                      angle: -90,
                      position: 'insideLeft',
                      offset: 5,
                      fontSize: 11,
                      fill: '#64748b',
                    }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs space-y-1 shadow-lg border border-slate-700">
                            <p className="font-mono font-bold text-slate-200">Día {data.x}</p>
                            {data.actual !== undefined && (
                              <p className="text-emerald-400 font-mono">
                                Experimental: <strong>{data.actual} kg/cm²</strong>
                              </p>
                            )}
                            <p className="text-blue-400 font-mono">
                              Ajuste Cociente: <strong>{data.curve} kg/cm²</strong>
                            </p>
                            {data.x === 40 && (
                              <p className="text-amber-400 font-mono font-bold text-[11px] pt-0.5 border-t border-slate-700">
                                ★ Estimación solicitada en b)
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                  />
                  {/* Línea de asíntota horizontal */}
                  <ReferenceLine
                    y={46.6767}
                    stroke="#ef4444"
                    strokeDasharray="4 4"
                    label={{
                      value: 'Límite Asintótico (a = 46.68 kg/cm²)',
                      fill: '#dc2626',
                      fontSize: 10,
                      position: 'top',
                    }}
                  />
                  {/* Línea vertical en día 40 */}
                  <ReferenceLine
                    x={40}
                    stroke="#10b981"
                    strokeDasharray="3 3"
                    label={{
                      value: 'Día 40 (y ≈ 43.96)',
                      fill: '#059669',
                      fontSize: 10,
                      position: 'insideTopLeft',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="curve"
                    name="Curva Ajustada (Cociente)"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Scatter
                    dataKey="actual"
                    name="Puntos Experimentales"
                    fill="#0f172a"
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-500 italic text-center">
              Se observa claramente la convergencia asintótica hacia el límite teórico horizontal de saturación.
            </p>
          </div>

          {/* INCISO A: NUBE DE PUNTOS Y JUSTIFICACIÓN DEL COCIENTE */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center uppercase shrink-0 mt-0.5">
                a
              </span>
              <div className="space-y-1 flex-1">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Realizar la nube de puntos de la resistencia en función de la edad. ¿Parece presentar una tendencia lineal? Si la respuesta es no, ¿qué tipo de función podría ajustarse a la nube de puntos?
                </h4>
              </div>
            </div>

            {/* Respuesta Directa */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-black uppercase rounded-md border border-rose-200">
                  Diagnóstico Visual
                </span>
                <span className="font-black text-slate-900 text-xs">
                  ¿Presenta tendencia lineal? NO.
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Al observar la nube de puntos trazada con los datos de la tabla, la resistencia a compresión experimenta un <strong>crecimiento muy acelerado durante la primera semana</strong> (subiendo de <InlineMath math="13.0\text{ kg/cm}^2" /> en el día 1 a <InlineMath math="32.4\text{ kg/cm}^2" /> en el día 7). A partir de allí, la tasa de aumento decrece fuertemente, curvándose suavemente y <strong>estabilizándose de forma horizontal</strong> hacia un valor asintótico constante entre los 20 y 32 días (<InlineMath math="38.9 \to 43.6\text{ kg/cm}^2" />).
              </p>
              <p className="text-xs text-slate-700 leading-relaxed">
                Una recta lineal posee derivada constante (<InlineMath math="\frac{dy}{dx} = \text{cte}" />), por lo que sería completamente incapaz de modelar la desaceleración y generaría un error sistemático grosero. Por consiguiente, el tipo de función matemática que mejor se ajusta es una <strong>Función de Saturación Asintótica (Ecuación del Cociente)</strong>:
              </p>
              <div className="py-1">
                <MathBlock math="y = \frac{a \cdot x}{b + x}" className="text-sm font-bold" />
              </div>
            </div>

            {/* TARJETA ESPECIAL: JUSTIFICACIÓN PROFUNDA DE POR QUÉ USAMOS EL COCIENTE */}
            <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-3">
              <div className="flex items-center gap-2 text-blue-950 font-black text-xs uppercase tracking-wider">
                <Sparkles size={16} className="text-blue-600" />
                <span>¿Por qué terminamos usando la Ecuación del Cociente? (Justificación Teórica y Física)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* Punto 1: Física del Fraguado */}
                <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1.5 shadow-2xs">
                  <span className="font-bold text-blue-900 block flex items-center gap-1">
                    <span>1. Física del Fraguado</span>
                  </span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    El fraguado es una reacción química de hidratación del clinker con el agua. Al inicio hay abundancia de agua y reactivo sin hidratar, por lo que la resistencia se dispara. Con el paso de los días los poros se colmatan y el reactivo se agota: <strong>el cemento no puede ganar resistencia infinitamente</strong>; posee un límite mecánico máximo de saturación.
                  </p>
                </div>

                {/* Punto 2: Propiedad Asintótica */}
                <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1.5 shadow-2xs">
                  <span className="font-bold text-blue-900 block flex items-center gap-1">
                    <span>2. Asíntota Matemática</span>
                  </span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Matemáticamente, cuando el tiempo <InlineMath math="x \to \infty" />:
                    <span className="block my-1 font-mono text-center text-slate-900 font-bold">
                      <InlineMath math="\lim_{x \to \infty} \frac{ax}{b+x} = a" />
                    </span>
                    El parámetro <InlineMath math="a" /> representa exactamente la <strong>resistencia última de saturación</strong> (<InlineMath math="a = 46.68\text{ kg/cm}^2" />), y <InlineMath math="b = 2.47\text{ días}" /> es la edad en la que se alcanza la mitad de dicha resistencia (<InlineMath math="y = a/2" />).
                  </p>
                </div>

                {/* Punto 3: Por qué fallan los otros */}
                <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1.5 shadow-2xs">
                  <span className="font-bold text-blue-900 block flex items-center gap-1">
                    <span>3. Inviabilidad de Otros Modelos</span>
                  </span>
                  <ul className="text-slate-600 leading-relaxed text-[11px] space-y-1">
                    <li>• <strong>Lineal (<InlineMath math="y = mx+n" />)</strong>: Predice resistencia infinita al cabo de meses (absurdo).</li>
                    <li>• <strong>Polinómico cuadrático</strong>: Al ser una parábola cóncava, luego del vértice la resistencia caería hacia cero (absurdo).</li>
                    <li>• <strong>Exponencial / Potencial</strong>: No poseen asíntota horizontal finita no nula partiendo de cero.</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-blue-100/70 rounded-xl border border-blue-200 text-blue-900 text-xs">
                <CheckCircle2 size={16} className="text-blue-700 shrink-0" />
                <p className="leading-snug">
                  <strong>Conclusión:</strong> La ecuación del cociente no sólo maximiza la bondad estadística (<InlineMath math="r^2 = 0.9781" />), sino que es el <strong>único modelo matemáticamente coherente con las leyes de la física de materiales</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* INCISO B: AJUSTE, BONDAD Y ESTIMACIÓN A 40 DÍAS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center uppercase shrink-0 mt-0.5">
                b
              </span>
              <div className="space-y-1 flex-1">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Realizar el ajuste adecuado y calcular la Bondad del Ajuste. Estimar cuál será la resistencia obtenida a los 40 días de elaborado el cemento.
                </h4>
              </div>
            </div>

            {/* Desarrollo del ajuste */}
            <div className="space-y-3">
              <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1 shadow-sm">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block">
                  Ecuación del Modelo Ajustado (Cociente):
                </span>
                <MathBlock math="y = \frac{46.6767 \cdot x}{2.4739 + x}" className="text-sm sm:text-base font-bold text-white [&_.katex]:text-white" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Linealización por Doble Recíproco:
                  </span>
                  <MathBlock math="\frac{1}{y} = \frac{1}{a} + \left(\frac{b}{a}\right) \frac{1}{x} \iff Y = a_1 + a_2 X" className="text-xs" />
                  <p className="text-[11px] text-slate-600 pt-1">
                    Con <InlineMath math="a_1 = 0.02142 \implies a = 46.6767" /> y <InlineMath math="a_2 = 0.05299 \implies b = 2.4739" />.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Bondad del Ajuste Obtenida:
                  </span>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-2xl font-black font-mono text-slate-900">0.9781</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                      <InlineMath math="r^2 = 97.81\%" />
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    El modelo explica el 97.81% de la variabilidad experimental observada.
                  </p>
                </div>
              </div>

              {/* Estimación a 40 días */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 block">
                  Cálculo de la Estimación a 40 días (<InlineMath math="x = 40" />):
                </span>
                <div className="p-2 bg-white rounded-lg border border-emerald-100 overflow-x-auto">
                  <MathBlock
                    math="y(40) = \frac{46.6767 \times 40}{2.4739 + 40} = \frac{1867.068}{42.4739} \approx 43.9579 \approx 43.96 \text{ kg/cm}^2"
                    className="text-xs sm:text-sm font-bold text-emerald-950"
                  />
                </div>
                <div className="flex items-start gap-2 text-xs text-emerald-900 pt-1">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Reflexión física:</strong> A los 40 días, la resistencia estimada es de <strong><InlineMath math="43.96\text{ kg/cm}^2" /></strong>, lo que representa exactamente el <strong>94.17%</strong> de la resistencia límite teórica final (<InlineMath math="a = 46.68\text{ kg/cm}^2" />). Esto coincide con los ensayos reglamentarios de hormigón (normas IRAM 1534 / ASTM C39), donde a los 28-40 días se alcanza entre el 90% y 95% de la resistencia estructural de diseño.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// EJERCICIO Nº 6: PRODUCCIÓN DE PETRÓLEO (ONU 1880 - 1990)
// =========================================================================
export const Exercise6VisualResolution: React.FC<{ points: ExercisePoint[] }> = ({ points }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [curveMode, setCurveMode] = useState<'both' | 'cubic' | 'deg4'>('both');
  const [extrapolate, setExtrapolate] = useState<boolean>(true);

  // Formulas with centered variable t = year - 1880:
  // Cubic: y(t) = 1834.5958 - 232.9276*t + 4.893324*t^2 - 0.0085394*t^3
  // Deg4:  y(t) = -1556.1033 + 592.4031*t - 29.8608*t^2 + 0.477524*t^3 - 0.0022304*t^4
  const evalCubic = (yr: number): number => {
    const t = yr - 1880;
    return 1834.5958 - 232.9276 * t + 4.893324 * Math.pow(t, 2) - 0.0085394 * Math.pow(t, 3);
  };

  const evalDeg4 = (yr: number): number => {
    const t = yr - 1880;
    return (
      -1556.1033 +
      592.4031 * t -
      29.8608 * Math.pow(t, 2) +
      0.477524 * Math.pow(t, 3) -
      0.0022304 * Math.pow(t, 4)
    );
  };

  const chartData = useMemo(() => {
    const data: {
      year: number;
      actual?: number;
      cubic?: number;
      deg4?: number;
      isExtrapolation?: boolean;
    }[] = [];

    const expMap = new Map<number, number>();
    points.forEach((p) => expMap.set(p.x, p.y));

    const endYear = extrapolate ? 2006 : 1990;

    for (let yr = 1880; yr <= endYear; yr += 2) {
      const actualVal = expMap.get(yr);
      const cVal = evalCubic(yr);
      const d4Val = evalDeg4(yr);

      data.push({
        year: yr,
        actual: actualVal !== undefined ? actualVal : undefined,
        cubic: Math.round(cVal),
        deg4: Math.round(d4Val),
        isExtrapolation: yr > 1990,
      });
    }

    // Ensure 1995, 2000, 2006 are explicitly present if extrapolating
    if (extrapolate) {
      [1995, 2000, 2006].forEach((keyYr) => {
        if (!data.some((d) => d.year === keyYr)) {
          data.push({
            year: keyYr,
            cubic: Math.round(evalCubic(keyYr)),
            deg4: Math.round(evalDeg4(keyYr)),
            isExtrapolation: true,
          });
        }
      });
      data.sort((a, b) => a.year - b.year);
    }

    return data;
  }, [points, extrapolate]);

  return (
    <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-4 print:bg-white print:border-none print:p-0">
      {/* Cabecera Desplegable */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left cursor-pointer select-none group print:hidden"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-black text-slate-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
            <BarChart2 size={15} className="text-amber-600" />
            <span>Resolución Asistida por Software (Excel) y Análisis de Nube de Puntos</span>
          </span>
          <span className="text-[11px] font-semibold text-amber-700 font-mono bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
            2 incisos resueltos (a - b) · 28 observaciones
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors shrink-0">
          <span>{isOpen ? 'Ocultar resolución' : 'Ver resolución detallada'}</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="space-y-6 pt-3 border-t border-slate-200 print:border-none print:pt-0">
          {/* GRÁFICO INTERACTIVO: NUBE DE PUNTOS COMPLETA + CURVAS DE AJUSTE */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                  <TrendingUp size={16} className="text-amber-600" />
                  <span>Nube de Puntos Mundial (1880 - 1990) y Modelos Polinómicos de Software</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Producción en billones de barriles con pico histórico en 1978-1980 y zona de extrapolación a 2006
                </p>
              </div>

              {/* Controles interactivos del gráfico */}
              <div className="flex items-center gap-2 flex-wrap text-xs print:hidden">
                <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setCurveMode('both')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                      curveMode === 'both' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Ambos Polinomios
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurveMode('cubic')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                      curveMode === 'cubic' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Grado 3 (Cúbico)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurveMode('deg4')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                      curveMode === 'deg4' ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Grado 4
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setExtrapolate(!extrapolate)}
                  className={`px-2.5 py-1.5 rounded-xl border text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    extrapolate
                      ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Eye size={12} />
                  <span>{extrapolate ? 'Mostrando Extrapolación (hasta 2006)' : 'Solo Datos (hasta 1990)'}</span>
                </button>
              </div>
            </div>

            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 15, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="year"
                    type="number"
                    domain={[1880, extrapolate ? 2006 : 1990]}
                    stroke="#94a3b8"
                    fontSize={11}
                    tickCount={extrapolate ? 9 : 7}
                    label={{
                      value: 'Año',
                      position: 'insideBottom',
                      offset: -12,
                      fontSize: 11,
                      fill: '#64748b',
                    }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    domain={[0, 36000]}
                    label={{
                      value: 'Producción (Billones de Barriles)',
                      angle: -90,
                      position: 'insideLeft',
                      offset: 5,
                      fontSize: 11,
                      fill: '#64748b',
                    }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs space-y-1 shadow-lg border border-slate-700">
                            <p className="font-mono font-bold text-slate-200 flex items-center justify-between gap-3">
                              <span>Año {data.year}</span>
                              {data.isExtrapolation && (
                                <span className="text-[10px] bg-amber-500/30 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/40">
                                  Extrapolación
                                </span>
                              )}
                            </p>
                            {data.actual !== undefined && (
                              <p className="text-emerald-400 font-mono">
                                Experimental ONU: <strong>{data.actual.toLocaleString()} billones</strong>
                              </p>
                            )}
                            {(curveMode === 'both' || curveMode === 'cubic') && (
                              <p className="text-blue-400 font-mono">
                                Polinomio Grado 3: <strong>{data.cubic?.toLocaleString()} billones</strong>
                              </p>
                            )}
                            {(curveMode === 'both' || curveMode === 'deg4') && (
                              <p className="text-purple-400 font-mono">
                                Polinomio Grado 4: <strong>{data.deg4?.toLocaleString()} billones</strong>
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                  />
                  {/* Línea de corte de la muestra histórica */}
                  <ReferenceLine
                    x={1990}
                    stroke="#64748b"
                    strokeDasharray="4 4"
                    label={{
                      value: 'Fin de datos reales (1990)',
                      fill: '#64748b',
                      fontSize: 10,
                      position: 'insideTopLeft',
                    }}
                  />
                  {/* Pico histórico de Hubbert */}
                  <ReferenceLine
                    x={1978}
                    stroke="#d97706"
                    strokeDasharray="3 3"
                    label={{
                      value: 'Pico Histórico (1978 ~21.922)',
                      fill: '#d97706',
                      fontSize: 10,
                      position: 'top',
                    }}
                  />
                  {(curveMode === 'both' || curveMode === 'cubic') && (
                    <Line
                      type="monotone"
                      dataKey="cubic"
                      name="Ajuste Polinomio Cúbico (r² = 0.9125)"
                      stroke="#2563eb"
                      strokeWidth={2.2}
                      dot={false}
                    />
                  )}
                  {(curveMode === 'both' || curveMode === 'deg4') && (
                    <Line
                      type="monotone"
                      dataKey="deg4"
                      name="Ajuste Polinomio Grado 4 (r² = 0.9532)"
                      stroke="#9333ea"
                      strokeWidth={2.2}
                      dot={false}
                    />
                  )}
                  <Scatter
                    dataKey="actual"
                    name="Datos ONU (28 observaciones)"
                    fill="#0f172a"
                    stroke="#ffffff"
                    strokeWidth={1.5}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-500 italic text-center">
              Nótese el contraste post-1990: el Grado 3 vuelve a subir al infinito mientras que el Grado 4 cae violentamente.
            </p>
          </div>

          {/* INCISO A: NUBE DE PUNTOS Y SELECCIÓN DE FUNCIÓN */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center uppercase shrink-0 mt-0.5">
                a
              </span>
              <div className="space-y-1 flex-1">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Utilizar el Microsoft Excel u otra herramienta de software para realizar la nube de puntos de la producción en función del año. ¿Qué tipo de función podría ajustarse a la nube de puntos?
                </h4>
              </div>
            </div>

            {/* Análisis de la nube de puntos */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700 leading-relaxed">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black uppercase rounded-md border border-amber-200">
                  Comportamiento de la Serie Histórica
                </span>
                <span className="font-black text-slate-900">
                  Análisis Físico y Fenomenológico de la ONU
                </span>
              </div>
              <p>
                Al graficar las <strong>28 observaciones experimentales</strong> en el software (Excel), se distinguen tres fases bien marcadas:
              </p>
              <ol className="list-decimal list-inside space-y-1 pl-1 text-slate-800">
                <li>
                  <strong>1880 a 1970 (Crecimiento Acelerado):</strong> Producción explosiva impulsada por la segunda revolución industrial y la masificación automotriz (de $30$ a $16.669$ billones de barriles).
                </li>
                <li>
                  <strong>1970 a 1980 (Punto de Inflexión y Máximo Histórico):</strong> El ritmo de crecimiento frena abruptamente hasta alcanzar un <strong>pico máximo en 1978</strong> ($21.922$ billones de barriles) y 1980 ($21.732$ billones), coincidiendo con las crisis geopolíticas del petróleo de 1973 y 1979.
                </li>
                <li>
                  <strong>1980 a 1990 (Fase de Declive):</strong> La producción retrocede sostenidamente hasta $17.153$ billones en 1990.
                </li>
              </ol>

              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 space-y-1 text-amber-950">
                <span className="font-bold block flex items-center gap-1.5">
                  <Info size={15} className="text-amber-700" />
                  <span>Fenómeno Geológico: La Campana de Hubbert</span>
                </span>
                <p className="text-[11px] leading-relaxed">
                  Esta curva no monótona representa el ciclo de agotamiento postulado por el geofísico <strong>M. King Hubbert</strong>: para cualquier recurso natural finito no renovable, la tasa de extracción sigue una curva con forma de campana (primero crece exponencialmente, hace una cima o meseta cuando se agota la mitad de las reservas accesibles, y luego declina irreversiblemente).
                </p>
              </div>

              {/* Qué tipo de función puede ajustarse */}
              <div className="pt-2 space-y-1.5">
                <span className="font-bold text-slate-900 block">
                  ¿Qué tipo de función podría ajustarse a la nube de puntos?
                </span>
                <p>
                  Las funciones monótonas simples (como la recta lineal <InlineMath math="y = mx+b" /> o la exponencial <InlineMath math="y = a e^{bx}" />) quedan <strong>descartadas</strong> porque son incapaces de cambiar de sentido o reproducir una cima con declive. Por lo tanto, en software se requiere una función no lineal que admita punto de inflexión y curvatura:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-[11px]">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
                    <strong className="text-blue-900 block">Opción 1: Polinomio Cúbico (Grado 3)</strong>
                    <p className="text-slate-600">
                      <InlineMath math="y = a_1 + a_2 t + a_3 t^2 + a_4 t^3" />. Es el modelo polinómico mínimo que posee un punto de inflexión, permitiendo pasar de aceleración a desaceleración (<InlineMath math="r^2 \approx 0.9125" />).
                    </p>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
                    <strong className="text-purple-900 block">Opción 2: Polinomio de Grado 4</strong>
                    <p className="text-slate-600">
                      <InlineMath math="y = a_1 + a_2 t + a_3 t^2 + a_4 t^3 + a_5 t^4" />. Provee mayor flexibilidad para aplanar la cima del pico petrolero entre 1974 y 1980 y reproducir la caída posterior con mayor precisión (<InlineMath math="r^2 \approx 0.9532" />).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* INCISO B: AJUSTE, ESTIMACIONES Y REFLEXIÓN */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center uppercase shrink-0 mt-0.5">
                b
              </span>
              <div className="space-y-1 flex-1">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Realizar el ajuste adecuado y estimar cuál habrá sido la producción de petróleo en los años 1995, 2000 y 2006. ¿Qué reflexión puede realizar de acuerdo a los datos obtenidos?
                </h4>
              </div>
            </div>

            {/* Modelos ajustados */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Ecuación Cúbica */}
                <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-black tracking-widest text-blue-400">
                      Ajuste Polinomio Cúbico (Grado 3)
                    </span>
                    <span className="text-[10px] font-mono text-slate-300">r² = 0.9125</span>
                  </div>
                  <div className="text-white [&_.katex]:text-white">
                    <MathBlock
                      math="y(t) = 1834.60 - 232.93\,t + 4.8933\,t^2 - 0.008539\,t^3"
                      className="text-xs font-bold"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    con variable centrada <InlineMath math="t = \text{año} - 1880" />
                  </span>
                </div>

                {/* Ecuación Grado 4 */}
                <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-black tracking-widest text-purple-400">
                      Ajuste Polinomio de Grado 4
                    </span>
                    <span className="text-[10px] font-mono text-slate-300">r² = 0.9532</span>
                  </div>
                  <div className="text-white [&_.katex]:text-white">
                    <MathBlock
                      math="y(t) = -1556.10 + 592.40\,t - 29.861\,t^2 + 0.4775\,t^3 - 0.00223\,t^4"
                      className="text-xs font-bold"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    con variable centrada <InlineMath math="t = \text{año} - 1880" />
                  </span>
                </div>
              </div>

              {/* TABLA DE ESTIMACIONES: 1995, 2000, 2006 */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Tabla de Estimaciones de Producción Petrolera (Billones de Barriles):
                </span>
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-center text-xs border-collapse font-mono">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                        <th className="px-3 py-2 text-left font-bold font-sans">Año de Estimación</th>
                        <th className="px-3 py-2 font-bold">Variable <InlineMath math="t = \text{Año} - 1880" /></th>
                        <th className="px-3 py-2 font-bold text-blue-900">Polinomio Cúbico (<InlineMath math="r^2=0.9125" />)</th>
                        <th className="px-3 py-2 font-bold text-purple-900">Polinomio Grado 4 (<InlineMath math="r^2=0.9532" />)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      <tr className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-left font-bold font-sans text-slate-900 flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-400" />
                          <span>Año 1995</span>
                        </td>
                        <td className="px-3 py-2 text-slate-500"><InlineMath math="t = 115" /></td>
                        <td className="px-3 py-2 font-bold text-blue-700">26.775 billones</td>
                        <td className="px-3 py-2 font-bold text-purple-700">18.338 billones</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-left font-bold font-sans text-slate-900 flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-400" />
                          <span>Año 2000</span>
                        </td>
                        <td className="px-3 py-2 text-slate-500"><InlineMath math="t = 120" /></td>
                        <td className="px-3 py-2 font-bold text-blue-700">29.591 billones</td>
                        <td className="px-3 py-2 font-bold text-purple-700">14.681 billones</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-left font-bold font-sans text-slate-900 flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-400" />
                          <span>Año 2006</span>
                        </td>
                        <td className="px-3 py-2 text-slate-500"><InlineMath math="t = 126" /></td>
                        <td className="px-3 py-2 font-bold text-blue-700">33.090 billones</td>
                        <td className="px-3 py-2 font-bold text-purple-700">7.253 billones</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* REFLEXIÓN CRÍTICA PEDAGÓGICA (PREGUNTA CLAVE DE CÁTEDRA) */}
              <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-amber-950 font-black text-xs uppercase tracking-wider">
                  <AlertTriangle size={16} className="text-amber-600" />
                  <span>¿Qué reflexión puede realizar de acuerdo a los datos obtenidos? (Dictamen de Cátedra)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Trampa de la extrapolación */}
                  <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-1.5 shadow-2xs">
                    <span className="font-bold text-amber-950 block">
                      1. La trampa de la extrapolación polinómica
                    </span>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      Dentro del rango histórico (1880 - 1990) ambos modelos ajustan con gran precisión (<InlineMath math="r^2 > 0.91" />). Sin embargo, al proyectar a futuro, ambos fallan físicamente de manera opuesta:
                    </p>
                    <ul className="text-slate-600 leading-relaxed text-[11px] space-y-1 pl-1">
                      <li>
                        • El <strong>Polinomio Cúbico</strong> vuelve a subir con fuerza ($33.090$ en 2006) y divergerá a $+\infty$, ignorando que el petróleo no es un recurso infinito.
                      </li>
                      <li>
                        • El <strong>Polinomio Grado 4</strong> se desploma en caída libre ($7.253$ en 2006) y poco después de 2008 cruza el eje cero, prediciendo <strong>producción negativa</strong>, lo cual es físicamente absurdo.
                      </li>
                    </ul>
                  </div>

                  {/* Finitud geológica */}
                  <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-1.5 shadow-2xs">
                    <span className="font-bold text-amber-950 block">
                      2. El software no conoce las leyes físicas
                    </span>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      Herramientas como Excel calculan coeficientes por mínimos cuadrados para minimizar el error en la muestra, pero una función puramente algebraica no impone cotas geológicas ni termodinámicas.
                    </p>
                    <div className="p-2 bg-amber-100/60 rounded-lg border border-amber-200 text-amber-900 text-[11px] font-semibold">
                      Regla de Oro en Métodos Numéricos: Un coeficiente <InlineMath math="r^2" /> alto dentro del intervalo experimental NO garantiza validez predictiva fuera de él.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2.5 bg-white rounded-xl border border-amber-200 text-amber-950 text-xs">
                  <CheckCircle2 size={16} className="text-amber-700 shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    <strong>Conclusión final:</strong> Los polinomios son excelentes para interpolar dentro de la muestra, pero peligrosos para extrapolar. En la industria energética real, para modelar después de 1990 se utilizan <strong>modelos logísticos de Hubbert</strong> o modelos basados en reservas probadas y descubrimientos tecnológicos (como shale oil y perforación en aguas profundas).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
