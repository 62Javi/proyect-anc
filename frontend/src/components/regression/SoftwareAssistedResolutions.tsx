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
  Eye,
  ChevronDown,
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
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-xs">
                  ¿Presenta tendencia lineal? No.
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                La resistencia crece rápidamente en la primera semana (de <InlineMath math="13.0" /> a <InlineMath math="32.4\text{ kg/cm}^2" />) y luego se desacelera progresivamente hasta estabilizarse en torno a <InlineMath math="43.6\text{ kg/cm}^2" /> al día 32.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Una recta tiene pendiente constante y no modela esta saturación. Por ello, la función adecuada es una de saturación asintótica (ecuación del cociente):
              </p>
              <div className="py-0.5">
                <MathBlock math="y = \frac{a \cdot x}{b + x}" className="text-sm font-semibold" />
              </div>
            </div>

            {/* JUSTIFICACIÓN DE LA ECUACIÓN DEL COCIENTE */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block">
                ¿Por qué usar la Ecuación del Cociente? (Justificación teórica y física)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                {/* Punto 1: Física del Fraguado */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1 shadow-2xs">
                  <span className="font-semibold text-slate-800 block">
                    1. Física del fraguado
                  </span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    La hidratación del cemento es rápida al inicio y decae a medida que reacciona el material. La resistencia no crece de forma indefinida, sino que converge a un límite de saturación.
                  </p>
                </div>

                {/* Punto 2: Propiedad Asintótica */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1 shadow-2xs">
                  <span className="font-semibold text-slate-800 block">
                    2. Asíntota matemática
                  </span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Cuando el tiempo <InlineMath math="x \to \infty" />:
                    <span className="block my-1 font-mono text-center text-slate-800 font-medium">
                      <InlineMath math="\lim_{x \to \infty} \frac{ax}{b+x} = a" />
                    </span>
                    El parámetro <InlineMath math="a" /> fija la resistencia máxima (<InlineMath math="46.68\text{ kg/cm}^2" />) y <InlineMath math="b" /> (<InlineMath math="2.47\text{ días}" />) el tiempo en que se alcanza la mitad (<InlineMath math="a/2" />).
                  </p>
                </div>

                {/* Punto 3: Por qué fallan los otros */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1 shadow-2xs">
                  <span className="font-semibold text-slate-800 block">
                    3. Descarte de otros modelos
                  </span>
                  <ul className="text-slate-600 leading-relaxed text-[11px] space-y-1">
                    <li>• <strong>Lineal:</strong> Crecería indefinidamente sin tope físico.</li>
                    <li>• <strong>Cuadrático:</strong> Al ser una parábola cóncava, decaería tras el vértice.</li>
                    <li>• <strong>Exponencial / Potencial:</strong> No tienen asíntota horizontal finita partiendo de cero.</li>
                  </ul>
                </div>
              </div>

              <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-200 text-slate-700 text-xs">
                <p className="leading-snug">
                  <strong>Conclusión:</strong> El modelo del cociente ofrece el mejor ajuste estadístico (<InlineMath math="r^2 = 0.9781" />) y respeta la cota física de resistencia del material.
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

            {/* Desarrollo del ajuste paso a paso detallado */}
            <div className="space-y-4">
              {/* 1. Tabla de observaciones y transformaciones */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 block">
                  1. Tabla de observaciones y transformaciones recíprocas:
                </span>
                <div className="overflow-x-auto touch-pan-x rounded-xl border border-slate-200 bg-slate-50/50 scrollbar-thin">
                  <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                        <th className="px-3 py-2 font-bold font-sans">i</th>
                        <th className="px-3 py-2 font-bold font-sans">Edad (<InlineMath math="x_i" />)</th>
                        <th className="px-3 py-2 font-bold font-sans">Resistencia (<InlineMath math="y_i" />)</th>
                        <th className="px-3 py-2 font-bold"><InlineMath math="1/x_i" /></th>
                        <th className="px-3 py-2 font-bold"><InlineMath math="1/y_i" /></th>
                        <th className="px-3 py-2 font-bold"><InlineMath math="(1/x_i)^2" /></th>
                        <th className="px-3 py-2 font-bold"><InlineMath math="1/(x_i \cdot y_i)" /></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800">
                      <tr className="hover:bg-slate-100/50">
                        <td className="px-3 py-1.5 font-sans font-bold text-slate-500">1</td>
                        <td className="px-3 py-1.5">1</td>
                        <td className="px-3 py-1.5 font-bold">13.0</td>
                        <td className="px-3 py-1.5">1.0000</td>
                        <td className="px-3 py-1.5">0.0769</td>
                        <td className="px-3 py-1.5">1.0000</td>
                        <td className="px-3 py-1.5">0.0769</td>
                      </tr>
                      <tr className="hover:bg-slate-100/50">
                        <td className="px-3 py-1.5 font-sans font-bold text-slate-500">2</td>
                        <td className="px-3 py-1.5">2</td>
                        <td className="px-3 py-1.5 font-bold">21.9</td>
                        <td className="px-3 py-1.5">0.5000</td>
                        <td className="px-3 py-1.5">0.0457</td>
                        <td className="px-3 py-1.5">0.2500</td>
                        <td className="px-3 py-1.5">0.0228</td>
                      </tr>
                      <tr className="hover:bg-slate-100/50">
                        <td className="px-3 py-1.5 font-sans font-bold text-slate-500">3</td>
                        <td className="px-3 py-1.5">3</td>
                        <td className="px-3 py-1.5 font-bold">29.8</td>
                        <td className="px-3 py-1.5">0.3333</td>
                        <td className="px-3 py-1.5">0.0336</td>
                        <td className="px-3 py-1.5">0.1111</td>
                        <td className="px-3 py-1.5">0.0112</td>
                      </tr>
                      <tr className="hover:bg-slate-100/50">
                        <td className="px-3 py-1.5 font-sans font-bold text-slate-500">4</td>
                        <td className="px-3 py-1.5">7</td>
                        <td className="px-3 py-1.5 font-bold">32.4</td>
                        <td className="px-3 py-1.5">0.1429</td>
                        <td className="px-3 py-1.5">0.0309</td>
                        <td className="px-3 py-1.5">0.0204</td>
                        <td className="px-3 py-1.5">0.0044</td>
                      </tr>
                      <tr className="hover:bg-slate-100/50">
                        <td className="px-3 py-1.5 font-sans font-bold text-slate-500">5</td>
                        <td className="px-3 py-1.5">12</td>
                        <td className="px-3 py-1.5 font-bold">36.8</td>
                        <td className="px-3 py-1.5">0.0833</td>
                        <td className="px-3 py-1.5">0.0272</td>
                        <td className="px-3 py-1.5">0.0069</td>
                        <td className="px-3 py-1.5">0.0023</td>
                      </tr>
                      <tr className="hover:bg-slate-100/50">
                        <td className="px-3 py-1.5 font-sans font-bold text-slate-500">6</td>
                        <td className="px-3 py-1.5">20</td>
                        <td className="px-3 py-1.5 font-bold">38.9</td>
                        <td className="px-3 py-1.5">0.0500</td>
                        <td className="px-3 py-1.5">0.0257</td>
                        <td className="px-3 py-1.5">0.0025</td>
                        <td className="px-3 py-1.5">0.0013</td>
                      </tr>
                      <tr className="hover:bg-slate-100/50">
                        <td className="px-3 py-1.5 font-sans font-bold text-slate-500">7</td>
                        <td className="px-3 py-1.5">28</td>
                        <td className="px-3 py-1.5 font-bold">41.8</td>
                        <td className="px-3 py-1.5">0.0357</td>
                        <td className="px-3 py-1.5">0.0239</td>
                        <td className="px-3 py-1.5">0.0013</td>
                        <td className="px-3 py-1.5">0.0009</td>
                      </tr>
                      <tr className="hover:bg-slate-100/50">
                        <td className="px-3 py-1.5 font-sans font-bold text-slate-500">8</td>
                        <td className="px-3 py-1.5">32</td>
                        <td className="px-3 py-1.5 font-bold">43.6</td>
                        <td className="px-3 py-1.5">0.0312</td>
                        <td className="px-3 py-1.5">0.0229</td>
                        <td className="px-3 py-1.5">0.0010</td>
                        <td className="px-3 py-1.5">0.0007</td>
                      </tr>
                      <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                        <td className="px-3 py-2 font-sans font-black">Σ</td>
                        <td className="px-3 py-2">105.0</td>
                        <td className="px-3 py-2">258.4</td>
                        <td className="px-3 py-2 text-blue-700">2.1765</td>
                        <td className="px-3 py-2 text-blue-700">0.2867</td>
                        <td className="px-3 py-2 text-blue-700">1.3932</td>
                        <td className="px-3 py-2 text-blue-700">0.1205</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Sumatorias calculadas */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700 block">
                  2. Sumatorias calculadas para el sistema linealizado:
                </span>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto touch-pan-x scrollbar-thin">
                  <MathBlock
                    math="N = 8, \quad \sum \frac{1}{x_i} = 2.1765, \quad \sum \frac{1}{y_i} = 0.2867, \quad \sum \left(\frac{1}{x_i}\right)^2 = 1.3932, \quad \sum \frac{1}{x_i y_i} = 0.1205"
                    className="text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* 3. Sistema de ecuaciones normales */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700 block">
                  3. Sistema de ecuaciones normales y sustitución numérica:
                </span>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto touch-pan-x scrollbar-thin">
                  <MathBlock
                    math="\begin{bmatrix} N & \sum \frac{1}{x_i} \\ \sum \frac{1}{x_i} & \sum \left(\frac{1}{x_i}\right)^2 \end{bmatrix} \begin{bmatrix} a_1 \\ a_2 \end{bmatrix} = \begin{bmatrix} \sum \frac{1}{y_i} \\ \sum \frac{1}{x_i y_i} \end{bmatrix} \implies \begin{bmatrix} 8 & 2.1765 \\ 2.1765 & 1.3932 \end{bmatrix} \begin{bmatrix} a_1 \\ a_2 \end{bmatrix} = \begin{bmatrix} 0.2867 \\ 0.1205 \end{bmatrix}"
                    className="text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* 4. Resolución analítica */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700 block">
                  4. Resolución analítica de los coeficientes (Regla de Cramer):
                </span>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto touch-pan-x scrollbar-thin space-y-1">
                  <MathBlock
                    math="\Delta = 8(1.3932) - (2.1765)^2 = 11.1456 - 4.7371 \approx 6.4085"
                    className="text-xs sm:text-sm"
                  />
                  <MathBlock
                    math="a_1 = \frac{1}{a} = \frac{0.2867(1.3932) - 0.1205(2.1765)}{6.4085} \approx 0.02142 \implies a = \frac{1}{0.02142} \approx 46.6767 \text{ kg/cm}^2"
                    className="text-xs sm:text-sm"
                  />
                  <MathBlock
                    math="a_2 = \frac{b}{a} = \frac{8(0.1205) - 2.1765(0.2867)}{6.4085} \approx 0.05300 \implies b = 0.05300 \cdot a \approx 2.4739 \text{ días}"
                    className="text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* 5. Ecuación final de ajuste */}
              <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1 shadow-sm overflow-x-auto touch-pan-x scrollbar-thin">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block">
                  5. Ecuación ajustada obtenida (Modelo del Cociente):
                </span>
                <div className="text-white [&_.katex]:text-white">
                  <MathBlock
                    math="y = \frac{a \cdot x}{b + x} = \frac{46.6767 \cdot x}{2.4739 + x}"
                    className="text-sm sm:text-base font-bold"
                  />
                </div>
              </div>

              {/* 6. Dispersión, residuos y bondad de ajuste */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">
                  6. Cálculo de dispersión (<InlineMath math="ST" />), residuos cuadráticos (<InlineMath math="SR" />) y bondad de ajuste (<InlineMath math="r^2" />):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Promedio Linealizado:</span>
                    <MathBlock math="y_{\text{media}} = \frac{\sum (1/y_i)}{N} = \frac{0.2867}{8} \approx 0.03584" className="text-xs" />
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Dispersión Total:</span>
                    <MathBlock math="ST = \sum (Y_i - y_{\text{media}})^2 \approx 0.002301" className="text-xs" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Suma de Residuos Cuadráticos:</span>
                    <MathBlock math="SR = \sum (Y_i - Y_{\text{ajuste}})^2 \approx 0.0000503" className="text-xs" />
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Coeficiente de Determinación:</span>
                    <MathBlock math="r^2 = \frac{ST - SR}{ST} = \frac{0.002301 - 0.0000503}{0.002301} \approx 0.9781" className="text-xs font-bold" />
                  </div>
                </div>

                {/* Tabla de cálculo de residuos */}
                <div className="pt-1 space-y-1">
                  <span className="text-[10.5px] font-bold text-slate-600 block font-mono">
                    Tabla de cálculo de dispersión y residuos linealizados:
                  </span>
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-left text-xs border-collapse font-mono">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                          <th className="px-2.5 py-1.5 font-bold">i</th>
                          <th className="px-2.5 py-1.5 font-bold"><InlineMath math="x_i" /></th>
                          <th className="px-2.5 py-1.5 font-bold"><InlineMath math="y_i" /></th>
                          <th className="px-2.5 py-1.5 font-bold"><InlineMath math="Y_i = 1/y_i" /></th>
                          <th className="px-2.5 py-1.5 font-bold"><InlineMath math="Y_{\text{ajuste}}" /></th>
                          <th className="px-2.5 py-1.5 font-bold"><InlineMath math="(Y_i - y_{\text{med}})^2" /></th>
                          <th className="px-2.5 py-1.5 font-bold"><InlineMath math="(Y_i - Y_{\text{aj}})^2" /></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        <tr className="hover:bg-slate-50">
                          <td className="px-2.5 py-1 text-slate-500">1</td>
                          <td className="px-2.5 py-1">1</td>
                          <td className="px-2.5 py-1 font-bold">13.0</td>
                          <td className="px-2.5 py-1">0.0769</td>
                          <td className="px-2.5 py-1">0.0744</td>
                          <td className="px-2.5 py-1">0.001688</td>
                          <td className="px-2.5 py-1">0.000006</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-2.5 py-1 text-slate-500">2</td>
                          <td className="px-2.5 py-1">2</td>
                          <td className="px-2.5 py-1 font-bold">21.9</td>
                          <td className="px-2.5 py-1">0.0457</td>
                          <td className="px-2.5 py-1">0.0479</td>
                          <td className="px-2.5 py-1">0.000097</td>
                          <td className="px-2.5 py-1">0.000005</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-2.5 py-1 text-slate-500">3</td>
                          <td className="px-2.5 py-1">3</td>
                          <td className="px-2.5 py-1 font-bold">29.8</td>
                          <td className="px-2.5 py-1">0.0336</td>
                          <td className="px-2.5 py-1">0.0391</td>
                          <td className="px-2.5 py-1">0.000005</td>
                          <td className="px-2.5 py-1">0.000030</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-2.5 py-1 text-slate-500">4</td>
                          <td className="px-2.5 py-1">7</td>
                          <td className="px-2.5 py-1 font-bold">32.4</td>
                          <td className="px-2.5 py-1">0.0309</td>
                          <td className="px-2.5 py-1">0.0290</td>
                          <td className="px-2.5 py-1">0.000025</td>
                          <td className="px-2.5 py-1">0.000003</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-2.5 py-1 text-slate-500">5</td>
                          <td className="px-2.5 py-1">12</td>
                          <td className="px-2.5 py-1 font-bold">36.8</td>
                          <td className="px-2.5 py-1">0.0272</td>
                          <td className="px-2.5 py-1">0.0258</td>
                          <td className="px-2.5 py-1">0.000075</td>
                          <td className="px-2.5 py-1">0.000002</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-2.5 py-1 text-slate-500">6</td>
                          <td className="px-2.5 py-1">20</td>
                          <td className="px-2.5 py-1 font-bold">38.9</td>
                          <td className="px-2.5 py-1">0.0257</td>
                          <td className="px-2.5 py-1">0.0241</td>
                          <td className="px-2.5 py-1">0.000103</td>
                          <td className="px-2.5 py-1">0.000003</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-2.5 py-1 text-slate-500">7</td>
                          <td className="px-2.5 py-1">28</td>
                          <td className="px-2.5 py-1 font-bold">41.8</td>
                          <td className="px-2.5 py-1">0.0239</td>
                          <td className="px-2.5 py-1">0.0233</td>
                          <td className="px-2.5 py-1">0.000142</td>
                          <td className="px-2.5 py-1">0.000000</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-2.5 py-1 text-slate-500">8</td>
                          <td className="px-2.5 py-1">32</td>
                          <td className="px-2.5 py-1 font-bold">43.6</td>
                          <td className="px-2.5 py-1">0.0229</td>
                          <td className="px-2.5 py-1">0.0231</td>
                          <td className="px-2.5 py-1">0.000166</td>
                          <td className="px-2.5 py-1">0.000000</td>
                        </tr>
                        <tr className="bg-slate-100 font-bold text-slate-900 border-t border-slate-300">
                          <td className="px-2.5 py-1.5 font-sans font-black">Σ</td>
                          <td className="px-2.5 py-1.5">105.0</td>
                          <td className="px-2.5 py-1.5">258.4</td>
                          <td className="px-2.5 py-1.5">0.2867</td>
                          <td className="px-2.5 py-1.5">0.2867</td>
                          <td className="px-2.5 py-1.5">0.002301</td>
                          <td className="px-2.5 py-1.5">0.000050</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* 7. Estimación a 40 días */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 block">
                  7. Estimación de Resistencia a los 40 días (<InlineMath math="x = 40" />):
                </span>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 overflow-x-auto">
                  <MathBlock
                    math="y(40) = \frac{46.6767 \times 40}{2.4739 + 40} = \frac{1867.068}{42.4739} \approx 43.9579 \approx 43.96 \text{ kg/cm}^2"
                    className="text-xs sm:text-sm font-bold text-slate-900"
                  />
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
            <BarChart2 size={15} className="text-slate-700" />
            <span>Resolución Asistida por Software (Excel) y Análisis de Nube de Puntos</span>
          </span>
          <span className="text-[11px] font-semibold text-slate-700 font-mono bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
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
                  <TrendingUp size={16} className="text-slate-700" />
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
                      ? 'bg-slate-900 border-slate-900 text-white shadow-2xs'
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
                  {/* Pico histórico */}
                  <ReferenceLine
                    x={1978}
                    stroke="#64748b"
                    strokeDasharray="3 3"
                    label={{
                      value: 'Pico Histórico (1978 ~21.922)',
                      fill: '#475569',
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
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
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

            {/* Respuesta concisa Inciso A */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs text-slate-700 leading-relaxed">
              <p>
                La nube de puntos crece sostenidamente hasta un valor máximo en 1978-1980 (aprox. 21.922 billones de barriles) y luego decrece hacia 1990. Al no ser monótona, se descartan rectas y exponenciales, y se ajusta adecuadamente con un <strong>polinomio cúbico (grado 3)</strong> o de <strong>grado 4</strong>:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block font-bold">Polinomio Cúbico (Grado 3)</strong>
                  <p className="text-slate-600">
                    <InlineMath math="y = a_1 + a_2 t + a_3 t^2 + a_4 t^3" /> (<InlineMath math="r^2 \approx 0.9125" />). Modelo mínimo con punto de inflexión.
                  </p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
                  <strong className="text-slate-900 block font-bold">Polinomio de Grado 4</strong>
                  <p className="text-slate-600">
                    <InlineMath math="y = a_1 + a_2 t + a_3 t^2 + a_4 t^3 + a_5 t^4" /> (<InlineMath math="r^2 \approx 0.9532" />). Mayor flexibilidad en la cima y el descenso.
                  </p>
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
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Ecuación Cúbica */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-slate-800">
                      Ajuste Polinomio Cúbico (Grado 3)
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-600">r² = 0.9125</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 overflow-x-auto text-slate-900">
                    <MathBlock
                      math="y(t) = 1834.60 - 232.93\,t + 4.8933\,t^2 - 0.008539\,t^3"
                      className="text-xs font-semibold"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 block font-mono">
                    con variable centrada <InlineMath math="t = \text{año} - 1880" />
                  </span>
                </div>

                {/* Ecuación Grado 4 */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-slate-800">
                      Ajuste Polinomio de Grado 4
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-600">r² = 0.9532</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 overflow-x-auto text-slate-900">
                    <MathBlock
                      math="y(t) = -1556.10 + 592.40\,t - 29.861\,t^2 + 0.4775\,t^3 - 0.00223\,t^4"
                      className="text-xs font-semibold"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 block font-mono">
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
                        <th className="px-3 py-2 font-bold font-mono">Variable <InlineMath math="t = \text{Año} - 1880" /></th>
                        <th className="px-3 py-2 font-bold font-sans text-slate-800">Polinomio Cúbico (<InlineMath math="r^2=0.9125" />)</th>
                        <th className="px-3 py-2 font-bold font-sans text-slate-800">Polinomio Grado 4 (<InlineMath math="r^2=0.9532" />)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      <tr className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-left font-bold font-sans text-slate-900 flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-400" />
                          <span>Año 1995</span>
                        </td>
                        <td className="px-3 py-2 text-slate-500"><InlineMath math="t = 115" /></td>
                        <td className="px-3 py-2 font-semibold text-slate-800">26.775 billones</td>
                        <td className="px-3 py-2 font-semibold text-slate-800">18.338 billones</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-left font-bold font-sans text-slate-900 flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-400" />
                          <span>Año 2000</span>
                        </td>
                        <td className="px-3 py-2 text-slate-500"><InlineMath math="t = 120" /></td>
                        <td className="px-3 py-2 font-semibold text-slate-800">29.591 billones</td>
                        <td className="px-3 py-2 font-semibold text-slate-800">14.681 billones</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-left font-bold font-sans text-slate-900 flex items-center gap-1.5">
                          <Calendar size={13} className="text-slate-400" />
                          <span>Año 2006</span>
                        </td>
                        <td className="px-3 py-2 text-slate-500"><InlineMath math="t = 126" /></td>
                        <td className="px-3 py-2 font-semibold text-slate-800">33.090 billones</td>
                        <td className="px-3 py-2 font-semibold text-slate-800">7.253 billones</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* REFLEXIÓN CRÍTICA CONCISA */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs text-slate-800">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs uppercase tracking-wider">
                  <AlertTriangle size={15} className="text-slate-700" />
                  <span>Reflexión sobre los resultados obtenidos</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 text-slate-700 leading-relaxed text-[11px]">
                  <p>
                    Aunque ambos modelos ajustan muy bien dentro de la muestra histórica (<InlineMath math="r^2 > 0.91" />), al extrapolar a futuro fallan:
                  </p>
                  <ul className="space-y-1 pl-1 text-slate-700">
                    <li>
                      • El <strong>polinomio cúbico</strong> vuelve a subir hacia infinito (33.090 billones en 2006).
                    </li>
                    <li>
                      • El <strong>polinomio de grado 4</strong> se desploma (7.253 billones en 2006) y poco después predice producción negativa.
                    </li>
                  </ul>
                  <p className="font-semibold text-slate-900 pt-1 border-t border-slate-100">
                    Conclusión: Un <InlineMath math="r^2" /> alto en el intervalo experimental no garantiza validez predictiva fuera de él. Los polinomios sirven para interpolar, no para extrapolar.
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
