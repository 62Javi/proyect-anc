import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Printer } from 'lucide-react';
import InlineMath from '../InlineMath';
import { useAppPrint } from '../../hooks/useAppPrint';

export const RegressionTheorySection: React.FC = () => {
  const { printRef, handlePrint } = useAppPrint('Guia-Teorica-Minimos-Cuadrados');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    fundamento: true,
    modelos: true,
    bondad: true,
    residuos: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner con botón de acción */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl shadow-slate-200 print:hidden">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
            Material de Estudio & Cátedra UTN
          </span>
          <h2 className="text-xl sm:text-2xl font-black">Guía Teórica de Análisis Numérico</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Descargá o imprimí este documento en PDF con todos los teoremas, fórmulas y deducciones paso a paso.
          </p>
        </div>

        <button
          onClick={() => handlePrint()}
          className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
        >
          <Printer size={16} />
          <span>Descargar / Imprimir PDF</span>
        </button>
      </div>

      {/* CONTENEDOR A IMPRIMIR */}
      <div ref={printRef} className="space-y-6 print-container">
        {/* 1. FUNDAMENTO ANALÍTICO */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:border-slate-300 print:shadow-none print:break-inside-avoid">
          <button
            onClick={() => toggleSection('fundamento')}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black shrink-0">
                1
              </span>
              <h3 className="text-base font-bold text-slate-900">
                El Principio de Mínimos Cuadrados & Deducción Analítica
              </h3>
            </div>
            {openSections.fundamento ? <ChevronDown size={20} className="text-slate-400 print:hidden" /> : <ChevronRight size={20} className="text-slate-400 print:hidden" />}
          </button>

          <div className={`p-6 pt-0 border-t border-slate-100 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed ${openSections.fundamento ? 'block' : 'hidden print:block'}`}>
            <p>
              El principio de mínimos cuadrados establece que de todas las rectas o curvas que representan a una nube de puntos experimentales <InlineMath math="(x_1, y_1), (x_2, y_2), \dots, (x_n, y_n)" />, la de mejor ajuste es aquella que minimiza la suma de los cuadrados de las desviaciones verticales:
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center font-mono">
              <InlineMath math="\delta(a_1, a_2, \dots, a_m) = \sum_{i=1}^n [f(x_i, a_1, \dots, a_m) - y_i]^2 \longrightarrow \text{Mínimo}" block />
            </div>
            <p>
              Se utilizan los cuadrados de las distancias para que no se cancelen las desviaciones positivas y negativas (puntos por arriba y por debajo de la curva).
            </p>
            <p>
              Para encontrar el valor mínimo de la función de varias variables <InlineMath math="\delta" />, se aplican las condiciones de extremo anulando simultáneamente todas las derivadas parciales respecto a cada coeficiente <InlineMath math="a_k" />:
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center font-mono">
              <InlineMath math="\frac{\partial \delta}{\partial a_1} = 0, \quad \frac{\partial \delta}{\partial a_2} = 0, \quad \dots, \quad \frac{\partial \delta}{\partial a_m} = 0" block />
            </div>
            <p>
              Si la función empírica es una combinación lineal de funciones base <InlineMath math="f(x) = \sum a_k \phi_k(x)" />, este sistema de derivadas conduce de manera exacta al <strong>Sistema de Ecuaciones Normales de Gauss</strong>:
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center font-mono">
              <InlineMath math="\sum_{k=1}^m a_k \left( \sum_{i=1}^n \phi_k(x_i) \phi_j(x_i) \right) = \sum_{i=1}^n y_i \phi_j(x_i), \quad \forall j=1,\dots,m" block />
            </div>
          </div>
      </div>

      {/* 2. MODELOS PARTICULARES Y LINEALIZACIONES */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:border-slate-300 print:shadow-none print:break-inside-avoid">
        <button
          onClick={() => toggleSection('modelos')}
          className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black shrink-0">
              2
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Modelos Estudiados y Procedimientos de Linealización
            </h3>
          </div>
          {openSections.modelos ? <ChevronDown size={20} className="text-slate-400 print:hidden" /> : <ChevronRight size={20} className="text-slate-400 print:hidden" />}
        </button>

        <div className={`p-6 pt-0 border-t border-slate-100 space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed ${openSections.modelos ? 'block' : 'hidden print:block'}`}>
            {/* A. Lineal */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">A. Ajuste Lineal: <InlineMath math="y = a_1 + a_2 x" /></h4>
              <p>Funciones base: <InlineMath math="\phi_1(x) = 1, \phi_2(x) = x" />. El sistema matricial de orden 2x2 queda:</p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 overflow-x-auto text-center font-mono">
                <InlineMath math="\begin{bmatrix} n & \sum x_i \\ \sum x_i & \sum x_i^2 \end{bmatrix} \begin{bmatrix} a_1 \\ a_2 \end{bmatrix} = \begin{bmatrix} \sum y_i \\ \sum x_i y_i \end{bmatrix}" block />
              </div>
            </div>

            {/* B. Polinómico */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">B. Ajuste Polinómico de Segundo Orden: <InlineMath math="y = a_1 + a_2 x + a_3 x^2" /></h4>
              <p>Funciones base: <InlineMath math="\phi_1(x) = 1, \phi_2(x) = x, \phi_3(x) = x^2" />. Sistema matricial de orden 3x3:</p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 overflow-x-auto text-center font-mono">
                <InlineMath math="\begin{bmatrix} n & \sum x_i & \sum x_i^2 \\ \sum x_i & \sum x_i^2 & \sum x_i^3 \\ \sum x_i^2 & \sum x_i^3 & \sum x_i^4 \end{bmatrix} \begin{bmatrix} a_1 \\ a_2 \\ a_3 \end{bmatrix} = \begin{bmatrix} \sum y_i \\ \sum x_i y_i \\ \sum x_i^2 y_i \end{bmatrix}" block />
              </div>
            </div>

            {/* C. Exponencial */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">C. Ajuste Exponencial: <InlineMath math="y = a \cdot e^{bx}" /></h4>
              <p>
                No es lineal respecto a los coeficientes. Se linealiza aplicando logaritmo natural (<InlineMath math="\ln" />) en ambos miembros:
              </p>
              <div className="p-2 bg-white rounded-xl border border-slate-200 text-center font-mono">
                <InlineMath math="\ln(y) = \ln(a) + bx \cdot \ln(e) \implies \ln(y) = \ln(a) + bx" block />
              </div>
              <p>Haciendo la analogía con la recta: <InlineMath math="Y = \ln(y), a_1 = \ln(a), a_2 = b, X = x" />:</p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 overflow-x-auto text-center font-mono">
                <InlineMath math="\begin{bmatrix} n & \sum x_i \\ \sum x_i & \sum x_i^2 \end{bmatrix} \begin{bmatrix} \ln(a) \\ b \end{bmatrix} = \begin{bmatrix} \sum \ln(y_i) \\ \sum x_i \ln(y_i) \end{bmatrix}" block />
              </div>
              <p className="text-[11px] text-slate-500">Luego se recupera <InlineMath math="a = e^{\ln(a)}" />.</p>
            </div>

            {/* D. Potencial */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">D. Ajuste Potencial: <InlineMath math="y = a \cdot x^b" /></h4>
              <p>Se linealiza aplicando logaritmo natural a ambos miembros:</p>
              <div className="p-2 bg-white rounded-xl border border-slate-200 text-center font-mono">
                <InlineMath math="\ln(y) = \ln(a) + b \cdot \ln(x)" block />
              </div>
              <p>Analogía con la recta: <InlineMath math="Y = \ln(y), a_1 = \ln(a), a_2 = b, X = \ln(x)" />:</p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 overflow-x-auto text-center font-mono">
                <InlineMath math="\begin{bmatrix} n & \sum \ln(x_i) \\ \sum \ln(x_i) & \sum (\ln(x_i))^2 \end{bmatrix} \begin{bmatrix} \ln(a) \\ b \end{bmatrix} = \begin{bmatrix} \sum \ln(y_i) \\ \sum \ln(x_i)\ln(y_i) \end{bmatrix}" block />
              </div>
            </div>

            {/* E. Cociente */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">E. Ajuste del Cociente (Crecimiento Saturado): <InlineMath math="y = a \frac{x}{b+x}" /></h4>
              <p>Se linealiza invirtiendo ambos miembros de la ecuación:</p>
              <div className="p-2 bg-white rounded-xl border border-slate-200 text-center font-mono">
                <InlineMath math="\frac{1}{y} = \frac{b+x}{a \cdot x} = \frac{1}{a} + \frac{b}{a} \cdot \frac{1}{x}" block />
              </div>
              <p>Analogía: <InlineMath math="Y = \frac{1}{y}, a_1 = \frac{1}{a}, a_2 = \frac{b}{a}, X = \frac{1}{x}" />:</p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 overflow-x-auto text-center font-mono">
                <InlineMath math="\begin{bmatrix} n & \sum \frac{1}{x_i} \\ \sum \frac{1}{x_i} & \sum (\frac{1}{x_i})^2 \end{bmatrix} \begin{bmatrix} \frac{1}{a} \\ \frac{b}{a} \end{bmatrix} = \begin{bmatrix} \sum \frac{1}{y_i} \\ \sum \frac{1}{x_i y_i} \end{bmatrix}" block />
              </div>
              <p className="text-[11px] text-slate-500">Parámetros finales: <InlineMath math="a = \frac{1}{a_1}, \quad b = a_2 \cdot a" />.</p>
            </div>
        </div>
      </div>

      {/* 3. BONDAD DE AJUSTE (r^2) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:border-slate-300 print:shadow-none print:break-inside-avoid">
        <button
          onClick={() => toggleSection('bondad')}
          className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black shrink-0">
              3
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Bondad del Ajuste: Coeficiente de Determinación (<InlineMath math="r^2" />)
            </h3>
          </div>
          {openSections.bondad ? <ChevronDown size={20} className="text-slate-400 print:hidden" /> : <ChevronRight size={20} className="text-slate-400 print:hidden" />}
        </button>

        <div className={`p-6 pt-0 border-t border-slate-100 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed ${openSections.bondad ? 'block' : 'hidden print:block'}`}>
            <p>
              El coeficiente de determinación <InlineMath math="r^2" /> estima si el ajuste respecto a los datos experimentales ha sido efectivo:
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center font-mono">
              <InlineMath math="r^2 = \frac{S_T - S_R}{S_T}" block />
            </div>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong><InlineMath math="S_T" /> (Suma Total):</strong> Mide la dispersión natural de los datos alrededor de su valor promedio.</li>
              <li><strong><InlineMath math="S_R" /> (Suma de Regresión / Residuos):</strong> Mide la dispersión cuadrática de los puntos respecto a la curva ajustada.</li>
              <li><strong>Criterio del Apunte:</strong> <InlineMath math="r^2 \in [0, 1]" />. Un valor <InlineMath math="r^2 > 0.85" /> se considera un buen ajuste representativo.</li>
            </ul>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-2">
              <span className="font-bold block">Fórmulas según el modelo (Apunte Ing. Amiconi pág. 8):</span>
              <div className="text-xs space-y-1 font-mono">
                <p>1. Lineal y Polinomios: <InlineMath math="S_T = \sum (y_i - \bar{y})^2, \quad S_R = \sum (y_i - \hat{y}_i)^2" /></p>
                <p>2. Exponencial y Potencial: <InlineMath math="S_T = \sum (\ln y_i - \bar{Y})^2, \quad S_R = \sum (\ln y_i - \ln \hat{y}_i)^2" /></p>
                <p>3. Cociente / Saturación: <InlineMath math="S_T = \sum (1/y_i - \bar{Y})^2, \quad S_R = \sum (1/y_i - 1/\hat{y}_i)^2" /></p>
              </div>
            </div>
        </div>
      </div>

      {/* 4. ANÁLISIS DE RESIDUOS */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:border-slate-300 print:shadow-none print:break-inside-avoid">
        <button
          onClick={() => toggleSection('residuos')}
          className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black shrink-0">
              4
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Análisis de Residuos: Por qué <InlineMath math="r^2" /> no basta
            </h3>
          </div>
          {openSections.residuos ? <ChevronDown size={20} className="text-slate-400 print:hidden" /> : <ChevronRight size={20} className="text-slate-400 print:hidden" />}
        </button>

        <div className={`p-6 pt-0 border-t border-slate-100 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed ${openSections.residuos ? 'block' : 'hidden print:block'}`}>
            <p>
              El profesor enfatiza en su consigna: <em>"No elegir el modelo de antemano ni confiarse por la forma aparente. La selección debe estar justificada mediante los residuos y la física del fenómeno."</em>
            </p>
            <p>
              El residuo de cada medición es la diferencia: <InlineMath math="e_i = y_i - \hat{y}_i" />.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1 text-xs">
                <span className="font-bold text-rose-900 block">❌ Patrón Sistemático (Curvatura en 'U')</span>
                <p className="text-rose-700">
                  Si los residuos forman una parábola o tendencia suave (como sucede al ajustar una recta a datos exponenciales de enfriamiento), el modelo es estructuralmente incorrecto, aunque <InlineMath math="r^2" /> sea 0.88.
                </p>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 text-xs">
                <span className="font-bold text-emerald-900 block">✅ Distribución Aleatoria (Ruido Blanco)</span>
                <p className="text-emerald-700">
                  En un modelo adecuado (como la Ley de Newton), los residuos oscilan al azar por encima y por debajo del cero sin ningún patrón discernible, reflejando únicamente ruido experimental.
                </p>
              </div>
            </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default RegressionTheorySection;
