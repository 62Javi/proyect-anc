import React from 'react';
import FormulaDisplay from '../FormulaDisplay';
import InlineMath from '../InlineMath';
import {
  BookOpen,
  CheckCircle,
  TrendingUp,
  FileText,
  Printer,
  BookMarked,
  Download,
  ExternalLink,
} from 'lucide-react';
import { useAppPrint } from '../../hooks/useAppPrint';

interface BibliographyDoc {
  id: string;
  title: string;
  originalName: string;
  author: string;
  category: string;
  description: string;
  fileSize: string;
  url: string;
  downloadFilename: string;
}

const BIBLIOGRAPHY_DOCS: BibliographyDoc[] = [
  {
    id: 'tp4-minimos-cuadrados',
    title: 'Trabajo Práctico Nº 4: Mínimos Cuadrados',
    originalName: '04 - Trabajo Práctico Nº4 (Mínimos cuadrados).pdf',
    author: 'Cátedra de Análisis Numérico',
    category: 'Trabajo Práctico',
    description:
      'Guía oficial de problemas prácticos con tablas experimentales: ajustes lineal, exponencial, potencial, polinómico, ecuación del cociente y cálculo de bondad de ajuste.',
    fileSize: '51 KB',
    url: '/docs/04-tp4-minimos-cuadrados.pdf',
    downloadFilename: '04 - Trabajo Práctico Nº4 (Mínimos cuadrados).pdf',
  },
  {
    id: 'teoria-minimos-cuadrados',
    title: 'Teoría de Ajuste por Mínimos Cuadrados',
    originalName: '04 - Teoría de Ajuste por Mínimos Cuadrados.pdf',
    author: 'Cátedra de Análisis Numérico',
    category: 'Apunte Teórico',
    description:
      'Apunte conceptual oficial de la cátedra con deducción analítica del principio de Gauss, condición de extremo con derivadas parciales, linealizaciones y fórmulas de bondad de ajuste.',
    fileSize: '239 KB',
    url: '/docs/04-teoria-ajuste-minimos-cuadrados.pdf',
    downloadFilename: '04 - Teoría de Ajuste por Mínimos Cuadrados.pdf',
  },
];

export const RegressionTheorySection: React.FC = () => {
  const { printRef, handlePrint } = useAppPrint('Guia-Teorica-Minimos-Cuadrados');

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      {/* Top Banner con botón de acción */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl shadow-slate-200 print:hidden">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
            Material de Estudio • Cátedra de Análisis Numérico
          </span>
          <h2 className="text-xl sm:text-2xl font-black">
            Guía Teórica de Mínimos Cuadrados y Regresión
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Descargá o imprimí este documento en PDF con todos los fundamentos, deducciones del sistema de Gauss, linealizaciones y evaluación de bondad de ajuste paso a paso.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handlePrint()}
          className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
        >
          <Printer size={16} />
          <span>Descargar / Imprimir PDF</span>
        </button>
      </div>

      {/* CONTENEDOR A IMPRIMIR (Vinculado a la ref del hook) */}
      <div ref={printRef} className="space-y-10 print-container">
        {/* =========================================================================
            SECCIÓN 1: FUNDAMENTOS DEL AJUSTE POR MÍNIMOS CUADRADOS
            ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-4 print:border-none print:shadow-none print:p-0">
          <div className="flex items-center gap-3 text-slate-900">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center print:hidden">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Fundamentos: El Principio de Mínimos Cuadrados
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Conceptos iniciales & Planteo Matemático
              </p>
            </div>
          </div>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            En muchas áreas de la ingeniería es necesario investigar la existencia de una relación entre dos o más variables apoyada en fundamentos teóricos que establezcan una relación causa-efecto. La búsqueda de dicha relación se realiza mediante dos herramientas principales:
          </p>

          <ul className="text-xs sm:text-sm text-slate-700 space-y-2 list-disc list-inside leading-relaxed">
            <li>
              <strong>Regresión:</strong> Se refiere a la obtención de la ecuación matemática que permite relacionar a la variable dependiente <InlineMath math="y" /> con una o más variables independientes <InlineMath math="x" /> conocidas, posibilitando estimar o pronosticar valores de <InlineMath math="y" />.
            </li>
            <li>
              <strong>Correlación:</strong> Mide o cuantifica el grado de dependencia o asociación entre la variable dependiente y las variables independientes mediante el coeficiente de correlación.
            </li>
            <li>
              <strong>Diagrama de Dispersión:</strong> Es la representación gráfica en el plano cartesiano <InlineMath math="xy" /> de los pares experimentales observados, permitiendo detectar si los datos siguen una tendencia lineal o no lineal e identificar posibles valores atípicos.
            </li>
          </ul>

          <p className="text-slate-600 text-sm leading-relaxed pt-2">
            Dado un conjunto de <InlineMath math="n" /> observaciones experimentales <InlineMath math="\{(x_1, y_1), (x_2, y_2), \dots, (x_n, y_n)\}" /> y propuesta una función empírica <InlineMath math="y = f(x, a_1, a_2, \dots, a_m)" />, la desviación en cada punto se expresa como:
          </p>

          <FormulaDisplay formula="\varepsilon_i = f(x_i, a_1, a_2, \dots, a_m) - y_i" />

          <p className="text-slate-600 text-sm leading-relaxed">
            El principio de mínimos cuadrados establece que de todas las curvas que representan a una nube de puntos, la de mejor ajuste es aquella que minimiza la suma del cuadrado de las desviaciones:
          </p>

          <FormulaDisplay formula="\delta(a_1, a_2, \dots, a_m) = \sum_{i=1}^n [f(x_i, a_1, \dots, a_m) - y_i]^2 \longrightarrow \text{Mínimo}" />

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 print:bg-white print:p-0">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">
              ¿Por qué se elevan las desviaciones al cuadrado?
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Se utilizan los cuadrados de las distancias para que los errores de signos opuestos no se anulen entre sí (evitando que puntos por encima y por debajo de la curva se cancelen mutuamente), asegurando además una función cuadrática continua y diferenciable en todos sus parámetros.
            </p>
          </div>
        </section>

        {/* =========================================================================
            SECCIÓN 2: DEDUCCIÓN ANALÍTICA DE LAS ECUACIONES NORMALES DE GAUSS
            ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
          <div className="flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center print:hidden">
              <TrendingUp size={20} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                1. Sistema de Ecuaciones Normales de Gauss
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Deducción Analítica & Condiciones de Extremo
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Para encontrar el valor mínimo de la función de varias variables <InlineMath math="\delta(a_1, a_2, \dots, a_m)" />, se aplican las condiciones necesarias de extremo anulando simultáneamente todas las derivadas parciales respecto a cada coeficiente:
            </p>

            <FormulaDisplay formula="\frac{\partial \delta}{\partial a_1} = 0, \quad \frac{\partial \delta}{\partial a_2} = 0, \quad \dots, \quad \frac{\partial \delta}{\partial a_m} = 0" />

            <p className="text-slate-600 text-sm leading-relaxed">
              Si la función empírica es lineal respecto a los coeficientes, se expresa como combinación de funciones base conocidas <InlineMath math="\phi_k(x)" />:
            </p>

            <FormulaDisplay formula="f(x, a_1, \dots, a_m) = a_1 \phi_1(x) + a_2 \phi_2(x) + \dots + a_m \phi_m(x)" />
          </div>

          {/* Recuadro de Demostración Fundamental */}
          <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-3 print:bg-slate-100 print:text-slate-900 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 print:hidden" />
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 print:text-slate-900">
                Demostración Fundamental
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-black">
              Deducción de las Ecuaciones Normales
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 print:text-slate-800 leading-relaxed">
              Derivando la suma cuadrática <InlineMath math="\delta" /> respecto a cada coeficiente <InlineMath math="a_j" />:
            </p>

            <div className="bg-slate-800 print:bg-slate-200 p-2 rounded-xl text-white print:text-slate-900">
              <FormulaDisplay formula="\frac{\partial \delta}{\partial a_j} = 2 \sum_{i=1}^n \left[ a_1 \phi_1(x_i) + \dots + a_m \phi_m(x_i) - y_i \right] \cdot \phi_j(x_i) = 0" />
            </div>

            <p className="text-xs sm:text-sm text-slate-300 print:text-slate-800 leading-relaxed">
              Desarrollando e igualando a cero, se obtiene el sistema lineal de ecuaciones algebraicas normales:
            </p>

            <div className="bg-slate-800 print:bg-slate-200 p-2 rounded-xl text-white print:text-slate-900">
              <FormulaDisplay formula="\sum_{k=1}^m a_k \left( \sum_{i=1}^n \phi_k(x_i) \phi_j(x_i) \right) = \sum_{i=1}^n y_i \phi_j(x_i), \quad \forall j=1,\dots,m" />
            </div>

            <p className="text-xs text-slate-400 print:text-slate-700 leading-relaxed">
              Este sistema lineal posee solución única y determinada siempre que las funciones base sean linealmente independientes sobre el conjunto de puntos evaluados.
            </p>
          </div>
        </section>

        {/* =========================================================================
            SECCIÓN 3: MODELOS ESTUDIADOS Y LINEALIZACIONES
            ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
          <div className="flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center print:hidden">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                2. Modelos de Ajuste y Linealización
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Casos Particulares Analizados por la Cátedra
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Modelo 1: Lineal */}
            <div className="border border-slate-200 rounded-3xl p-6 space-y-3 bg-slate-50/50 print:bg-white print:p-0">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-900 bg-slate-200 px-3 py-1 rounded-full print:bg-slate-100">
                  Caso 1 · Recta Lineal
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  <InlineMath math="\phi_1(x)=1, \; \phi_2(x)=x" />
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Ajuste Lineal: <InlineMath math="y = a_1 + a_2 x" />
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                El sistema de ecuaciones normales de orden <InlineMath math="2 \times 2" /> resulta directamente:
              </p>
              <FormulaDisplay formula="\begin{bmatrix} n & \sum x_i \\ \sum x_i & \sum x_i^2 \end{bmatrix} \begin{bmatrix} a_1 \\ a_2 \end{bmatrix} = \begin{bmatrix} \sum y_i \\ \sum x_i y_i \end{bmatrix}" />
            </div>

            {/* Modelo 2: Polinómico de Segundo Orden y Grado k */}
            <div className="border border-slate-200 rounded-3xl p-6 space-y-3 bg-slate-50/50 print:bg-white print:p-0">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-900 bg-slate-200 px-3 py-1 rounded-full print:bg-slate-100">
                  Caso 2 · Polinomios
                </span>
                <span className="text-xs font-bold text-slate-500 font-mono">
                  <InlineMath math="\phi_1=1, \; \phi_2=x, \; \phi_3=x^2, \dots" />
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Ajuste Polinómico de Segundo Grado: <InlineMath math="y = a_1 + a_2 x + a_3 x^2" />
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                El sistema matricial de orden <InlineMath math="3 \times 3" /> se expresa mediante:
              </p>
              <FormulaDisplay formula="\begin{bmatrix} n & \sum x_i & \sum x_i^2 \\ \sum x_i & \sum x_i^2 & \sum x_i^3 \\ \sum x_i^2 & \sum x_i^3 & \sum x_i^4 \end{bmatrix} \begin{bmatrix} a_1 \\ a_2 \\ a_3 \end{bmatrix} = \begin{bmatrix} \sum y_i \\ \sum x_i y_i \\ \sum x_i^2 y_i \end{bmatrix}" />
              <p className="text-xs text-slate-500 leading-relaxed">
                Para un polinomio de grado <InlineMath math="k" />, la matriz del sistema es de orden <InlineMath math="(k+1) \times (k+1)" /> conteniendo las potencias sucesivas de <InlineMath math="x_i" /> hasta <InlineMath math="\sum x_i^{2k}" />.
              </p>
            </div>

            {/* Modelo 3: Exponencial */}
            <div className="border border-slate-200 rounded-3xl p-6 space-y-3 bg-slate-50/50 print:bg-white print:p-0">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-900 bg-slate-200 px-3 py-1 rounded-full print:bg-slate-100">
                  Caso 3 · Exponencial
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Linealización Semilogarítmica
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Ajuste Exponencial: <InlineMath math="y = a \cdot e^{bx}" />
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Al no ser lineal en los parámetros, se linealiza aplicando logaritmo natural en ambos miembros:
              </p>
              <FormulaDisplay formula="\ln(y) = \ln(a) + bx \cdot \ln(e) \iff \ln(y) = \ln(a) + bx" />
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Comparando con la recta (<InlineMath math="Y = \ln(y), \; a_1 = \ln(a), \; a_2 = b, \; X = x" />):
              </p>
              <FormulaDisplay formula="\begin{bmatrix} n & \sum x_i \\ \sum x_i & \sum x_i^2 \end{bmatrix} \begin{bmatrix} \ln(a) \\ b \end{bmatrix} = \begin{bmatrix} \sum \ln(y_i) \\ \sum x_i \ln(y_i) \end{bmatrix}" />
              <p className="text-xs text-slate-600 font-sans">
                Obtenidos los coeficientes del sistema, se recupera el parámetro original: <InlineMath math="a = e^{\ln(a)}" />.
              </p>
            </div>

            {/* Modelo 4: Potencial */}
            <div className="border border-slate-200 rounded-3xl p-6 space-y-3 bg-slate-50/50 print:bg-white print:p-0">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-900 bg-slate-200 px-3 py-1 rounded-full print:bg-slate-100">
                  Caso 4 · Potencial
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Linealización Bilogarítmica
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Ajuste Potencial: <InlineMath math="y = a \cdot x^b" />
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Se linealiza aplicando logaritmo natural en ambos miembros:
              </p>
              <FormulaDisplay formula="\ln(y) = \ln(a) + b \cdot \ln(x)" />
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Haciendo la analogía (<InlineMath math="Y = \ln(y), \; X = \ln(x), \; a_1 = \ln(a), \; a_2 = b" />):
              </p>
              <FormulaDisplay formula="\begin{bmatrix} n & \sum \ln(x_i) \\ \sum \ln(x_i) & \sum [\ln(x_i)]^2 \end{bmatrix} \begin{bmatrix} \ln(a) \\ b \end{bmatrix} = \begin{bmatrix} \sum \ln(y_i) \\ \sum \ln(x_i)\ln(y_i) \end{bmatrix}" />
              <p className="text-xs text-slate-600 font-sans">
                Parámetros finales: <InlineMath math="a = e^{\ln(a)}" /> y exponente <InlineMath math="b" />.
              </p>
            </div>

            {/* Modelo 5: Cociente */}
            <div className="border border-slate-200 rounded-3xl p-6 space-y-3 bg-slate-50/50 print:bg-white print:p-0">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-900 bg-slate-200 px-3 py-1 rounded-full print:bg-slate-100">
                  Caso 5 · Ecuación del Cociente
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Inversión de Variables
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Ajuste del Cociente (Crecimiento Saturado): <InlineMath math="y = a \cdot \frac{x}{b + x}" />
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Se linealiza invirtiendo ambos miembros de la ecuación:
              </p>
              <FormulaDisplay formula="\frac{1}{y} = \frac{b + x}{a \cdot x} = \frac{1}{a} + \frac{b}{a} \cdot \frac{1}{x}" />
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Comparando con la función lineal:
              </p>
              <FormulaDisplay formula="\begin{bmatrix} n & \sum \frac{1}{x_i} \\ \sum \frac{1}{x_i} & \sum \left(\frac{1}{x_i}\right)^2 \end{bmatrix} \begin{bmatrix} \frac{1}{a} \\ \frac{b}{a} \end{bmatrix} = \begin{bmatrix} \sum \frac{1}{y_i} \\ \sum \frac{1}{x_i y_i} \end{bmatrix}" />
              <p className="text-xs text-slate-600 font-sans">
                Despeje final: <InlineMath math="a = \frac{1}{1/a}" /> y <InlineMath math="b = \left(\frac{b}{a}\right) \cdot a" />.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECCIÓN 4: BONDAD DE AJUSTE (r²)
            ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
          <div className="flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center print:hidden">
              <CheckCircle size={20} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                3. Bondad de Ajuste: Coeficiente de Determinación (<InlineMath math="r^2" />)
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Evaluación de Efectividad del Ajuste
              </p>
            </div>
          </div>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            La <strong>bondad del ajuste</strong> es un parámetro que permite estimar si el ajuste realizado con respecto a los datos experimentales ha sido efectivo. Si se obtiene arbitrariamente un ajuste para una nube de puntos, mediante el cálculo de <InlineMath math="r^2" /> se verifica cuantitativamente su representatividad:
          </p>

          <FormulaDisplay formula="r^2 = \frac{S_t - S_r}{S_t}" />

          {/* Definiciones Formales en Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="font-bold text-slate-900 block font-mono">
                <InlineMath math="S_t" /> (Dispersión Total respecto a la Media)
              </span>
              <p className="text-slate-600 leading-relaxed">
                Cuantifica la variabilidad global de los datos experimentales antes de aplicar cualquier modelo, tomando como referencia su promedio muestral <InlineMath math="\bar{y}" />:
              </p>
              <div className="pt-1">
                <FormulaDisplay formula="S_t = \sum_{i=1}^n (y_i - \bar{y})^2 \quad \text{con} \quad \bar{y} = \frac{1}{n}\sum_{i=1}^n y_i" />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="font-bold text-slate-900 block font-mono">
                <InlineMath math="S_r" /> (Suma de Residuos Cuadráticos)
              </span>
              <p className="text-slate-600 leading-relaxed">
                Mide la variabilidad residual no explicada por el modelo de ajuste. Suma el cuadrado de las discrepancias verticales entre cada valor real y su predicción:
              </p>
              <div className="pt-1">
                <FormulaDisplay formula="S_r = \sum_{i=1}^n e_i^2 = \sum_{i=1}^n (y_i - \hat{y}_i)^2" />
              </div>
            </div>
          </div>

          {/* Coeficientes r² y r */}
          <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                Fórmulas Canónicas de Bondad y Correlación
              </span>
              <span className="text-[11px] font-mono text-slate-300">
                Balance de Varianzas: S_t = (S_t - S_r) + S_r
              </span>
            </div>
            <FormulaDisplay
              formula="r^2 = \frac{S_t - S_r}{S_t}, \qquad r = \operatorname{signo}(a_2) \cdot \sqrt{r^2}"
            />
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              El coeficiente de determinación <InlineMath math="r^2" /> indica el porcentaje de la dispersión de los datos que queda capturado por el modelo propuesto. El coeficiente de correlación <InlineMath math="r" /> refleja además el sentido o signo de la pendiente en regresiones lineales.
            </p>
          </div>

          {/* Tabla oficial de fórmulas según apunte de cátedra */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 print:bg-white print:p-0">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Fórmulas de Cálculo según el Tipo de Ajuste:
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-700">
                    <th className="py-2.5 px-3 font-bold font-sans">Modelo</th>
                    <th className="py-2.5 px-3 font-bold"><InlineMath math="S_t" /> (Media)</th>
                    <th className="py-2.5 px-3 font-bold"><InlineMath math="S_r" /> (Ajuste)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-semibold">1) Lineal y Polinómicos</td>
                    <td className="py-2.5 px-3"><InlineMath math="S_t = \sum (y_i - \bar{y})^2" /></td>
                    <td className="py-2.5 px-3"><InlineMath math="S_r = \sum (y_i - \hat{y}_i)^2" /></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-semibold">2) Exponencial y Potencial</td>
                    <td className="py-2.5 px-3"><InlineMath math="S_t = \sum (\ln y_i - \bar{Y})^2" /></td>
                    <td className="py-2.5 px-3"><InlineMath math="S_r = \sum (\ln y_i - \ln \hat{y}_i)^2" /></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-semibold">3) Ecuación del Cociente</td>
                    <td className="py-2.5 px-3"><InlineMath math="S_t = \sum (1/y_i - \bar{Y})^2" /></td>
                    <td className="py-2.5 px-3"><InlineMath math="S_r = \sum (1/y_i - 1/\hat{y}_i)^2" /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Análisis Metodológico: Escala Original vs Escala Transformada */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700 font-sans leading-relaxed">
              <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">
                Distinción Metodológica: Escala Original vs. Escala Transformada
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>
                  <strong>Ajustes Lineales / Polinómicos:</strong> Minimizan las distancias geométricas directas <InlineMath math="e_i = y_i - \hat{y}_i" />. El cálculo de <InlineMath math="S_t" /> y <InlineMath math="S_r" /> opera enteramente en la escala física de las observaciones.
                </li>
                <li>
                  <strong>Modelos Transformados (Linealización):</strong> Al resolver el sistema de Gauss sobre variables transformadas (<InlineMath math="Y = \ln(y)" /> o <InlineMath math="Y = 1/y" />), los mínimos cuadrados minimizan los residuos en el espacio transformado (<InlineMath math="S_{r,\text{transf}}" />). El <InlineMath math="r^2" /> obtenido mide la calidad del ajuste de la recta transformada. Para comparar dicho modelo de forma imparcial con polinomios en escala física, deben re-transformarse los valores predichos (<InlineMath math="\hat{y}_i = e^{\hat{Y}_i}" /> o <InlineMath math="\hat{y}_i = 1/\hat{Y}_i" />) y calcular los residuos reales <InlineMath math="S_r = \sum (y_i - \hat{y}_i)^2" />.
                </li>
                <li>
                  <strong>Efecto de Ponderación Implícita:</strong> La derivada de la transformación deforma el peso de los errores: el logaritmo (<InlineMath math="\frac{d}{dy}\ln y = 1/y" />) penaliza con fuerza los valores pequeños de <InlineMath math="y" />, mientras que la transformación recíproca (<InlineMath math="\frac{d}{dy}(1/y) = -1/y^2" />) sobrerrepresenta drásticamente los puntos cercanos a cero.
                </li>
              </ul>
            </div>

            <div className="pt-2 text-xs text-slate-700 space-y-1 font-sans">
              <p>
                <strong>Rango numérico:</strong> <InlineMath math="r^2 \in [0, 1]" />.
              </p>
              <p>
                <strong>Criterio de Cátedra:</strong> Se considera que una bondad de ajuste mayor a <strong>0.85</strong> (<InlineMath math="r^2 > 0.85" />) representa un buen ajuste que describe adecuadamente los datos analizados.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECCIÓN 5: BIBLIOGRAFÍA Y MATERIAL DE CÁTEDRA
            ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 print:hidden">
                <BookMarked size={20} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  4. Bibliografía y Material de Cátedra
                </h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Documentos Oficiales en PDF
                </p>
              </div>
            </div>
            <span className="self-start sm:self-auto text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full print:hidden">
              2 documentos oficiales
            </span>
          </div>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Podés consultar los apuntes teóricos y las guías de trabajos prácticos provistos por la cátedra para la unidad de <strong>Ajuste por Mínimos Cuadrados</strong>. Hacé clic para visualizarlos directamente en el navegador o descargarlos en tu dispositivo.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {BIBLIOGRAPHY_DOCS.map((doc) => (
              <div
                key={doc.id}
                className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all duration-200 group shadow-xs hover:shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/70 rounded-lg">
                      <FileText size={12} />
                      <span>PDF • {doc.category}</span>
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200 print:hidden">
                      {doc.fileSize}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {doc.title}
                    </h4>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">{doc.author}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {doc.description}
                  </p>
                </div>

                {/* Acciones de visualización y descarga */}
                <div className="pt-3 border-t border-slate-200 flex items-center gap-2 print:hidden">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs cursor-pointer"
                    title={`Abrir ${doc.title} en una pestaña nueva`}
                  >
                    <ExternalLink size={14} />
                    <span>Ver PDF</span>
                  </a>

                  <a
                    href={doc.url}
                    download={doc.downloadFilename}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs cursor-pointer"
                    title={`Descargar ${doc.downloadFilename}`}
                  >
                    <Download size={14} />
                    <span>Descargar</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RegressionTheorySection;
