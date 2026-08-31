import React from 'react';
import FormulaDisplay from '../../components/FormulaDisplay';
import InlineMath from '../../components/InlineMath';
import { BookOpen, CheckCircle, AlertTriangle, Sparkles, FileText, Printer } from 'lucide-react';

export const TheorySection: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      {/* Top Banner with PDF Print Action */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl shadow-slate-200 print:hidden">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
            Material de Estudio & Resumen
          </span>
          <h2 className="text-xl sm:text-2xl font-black">Guía Teórica de Análisis Numérico</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Descarga o imprime este documento en PDF con todos los teoremas, fórmulas y deducciones paso a paso.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
        >
          <Printer size={16} />
          <span>Descargar / Imprimir PDF</span>
        </button>
      </div>

      {/* Introduction Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-slate-900">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <BookOpen size={20} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Fundamentos: Raíces de Funciones Continuas</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Conceptos iniciales</p>
          </div>
        </div>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Dada una función continua <InlineMath math="f(x)" /> en un dominio real, se denominan <strong>raíces o ceros</strong> de la función a todos aquellos valores <InlineMath math="r" /> que anulan la expresión:
        </p>
        <FormulaDisplay formula="f(r) = 0" />
        <p className="text-slate-600 text-sm leading-relaxed">
          Cuando las ecuaciones son no lineales o trascendentes (por ejemplo <InlineMath math="x = \cos(x)" /> o <InlineMath math="e^x + 2x = 6" />), no existen fórmulas analíticas cerradas. Por ello, recurrimos a <strong>métodos numéricos iterativos</strong> que construyen una sucesión de aproximaciones <InlineMath math="\{x_n\}" /> que converge a la raíz buscada.
        </p>
      </section>

      {/* Newton Method Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">1. Método de Newton</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Deducción Geométrica</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            En cada iteración, se reemplaza la curva <InlineMath math="f(x)" /> por su <strong>recta tangente</strong> <InlineMath math="L_n(x)" /> trazada en el punto actual <InlineMath math="(x_n, f(x_n))" />:
          </p>
          <FormulaDisplay formula="y - f(x_n) = f'(x_n) \cdot (x - x_n)" />
          <p className="text-slate-600 text-sm leading-relaxed">
            El siguiente valor <InlineMath math="x_{n+1}" /> se define como el punto exacto donde esta recta tangente corta al eje horizontal (<InlineMath math="y = 0" />):
          </p>
          <FormulaDisplay formula="0 - f(x_n) = f'(x_n) \cdot (x_{n+1} - x_n)" />
          <p className="text-slate-600 text-sm leading-relaxed">
            Despejando algebraicamente <InlineMath math="x_{n+1}" /> obtenemos la <strong>fórmula recursiva de Newton</strong>:
          </p>
          <FormulaDisplay formula="x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}" />
        </div>

        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Criterios de Paro Computacionales</h4>
          <ul className="text-xs sm:text-sm text-slate-700 space-y-2 list-disc list-inside">
            <li>
              <strong>Por Cota de Error:</strong> Se detiene cuando <InlineMath math="|x_{n+1} - x_n| < \varepsilon" /> (ej. <InlineMath math="\varepsilon = 10^{-4}" />).
            </li>
            <li>
              <strong>Por Máximo de Iteraciones:</strong> Límite de seguridad <InlineMath math="N_{\text{max}}" /> para abortar si el método cae en indeterminación o divergencia.
            </li>
          </ul>
        </div>
      </section>

      {/* Fixed Point Method Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">2. Método de Iteración de Punto Fijo</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Teoría General</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Cualquier ecuación <InlineMath math="f(x) = 0" /> puede reformularse algebraicamente despejando <InlineMath math="x" /> de forma equivalente:
          </p>
          <FormulaDisplay formula="x = g(x)" />
          <p className="text-slate-600 text-sm leading-relaxed">
            A partir de una semilla inicial <InlineMath math="x_0" />, se calcula la sucesión recurrente:
          </p>
          <FormulaDisplay formula="x_{n+1} = g(x_n), \quad \forall n \ge 0" />
          <p className="text-slate-600 text-sm leading-relaxed">
            Si la sucesión converge a un número <InlineMath math="p" />, entonces <InlineMath math="p = g(p)" /> y por lo tanto <InlineMath math="p" /> es la raíz de la ecuación original.
          </p>
        </div>

        {/* Newton as Fixed Point */}
        <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles size={16} /> Demostración Fundamental
          </div>
          <h4 className="text-base sm:text-lg font-black">¿Por qué Newton es el Punto Fijo Óptimo?</h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            El Método de Newton es un caso especial de Punto Fijo con la función de iteración:
          </p>
          <div className="bg-slate-800 p-2 rounded-xl text-white">
            <FormulaDisplay formula="g(x) = x - \frac{f(x)}{f'(x)}" />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Al derivar esta <InlineMath math="g(x)" />, obtenemos <InlineMath math="g'(x) = \frac{f(x)f''(x)}{[f'(x)]^2}" />. En la raíz <InlineMath math="p" />, dado que <InlineMath math="f(p) = 0" />, se cumple exactamente <strong><InlineMath math="g'(p) = 0" /></strong>. Esta anulación de la derivada en la raíz es lo que le otorga su velocidad <strong>cuadrática</strong>.
          </p>
        </div>
      </section>

      {/* Convergence Theorems Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <CheckCircle size={20} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">3. Teoremas de Convergencia de la Cátedra</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Demostraciones y Condiciones</p>
          </div>
        </div>

        {/* Teorema 1 */}
        <div className="border border-slate-200 rounded-3xl p-6 space-y-3 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-900 bg-slate-200 px-3 py-1 rounded-full">
              Teorema 1
            </span>
            <span className="text-xs font-bold text-slate-500">Existencia y Unicidad</span>
          </div>
          <h4 className="text-base font-bold text-slate-900">Existencia y Unicidad de Punto Fijo</h4>
          <div className="text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed">
            <p>
              <strong>a) Existencia:</strong> Si <InlineMath math="g(x)" /> es continua en <InlineMath math="[a, b]" /> y <InlineMath math="g(x) \in [a, b]" /> para todo <InlineMath math="x \in [a, b]" />, entonces <InlineMath math="g(x)" /> tiene al menos un punto fijo en dicho intervalo.
            </p>
            <p>
              <strong>b) Unicidad:</strong> Si además <InlineMath math="g'(x)" /> existe en <InlineMath math="(a, b)" /> y existe una constante positiva <InlineMath math="k < 1" /> tal que:
            </p>
            <FormulaDisplay formula="|g'(x)| \le k < 1, \quad \forall x \in (a, b)" />
            <p>
              Entonces el punto fijo <InlineMath math="p \in [a, b]" /> es estrictamente <strong>único</strong>.
            </p>
          </div>
        </div>

        {/* Teorema 2 */}
        <div className="border border-slate-200 rounded-3xl p-6 space-y-3 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-900 bg-slate-200 px-3 py-1 rounded-full">
              Teorema 2
            </span>
            <span className="text-xs font-bold text-slate-500">Convergencia Global</span>
          </div>
          <h4 className="text-base font-bold text-slate-900">Teorema de Convergencia de Punto Fijo</h4>
          <div className="text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed">
            <p>
              Cumplidas las condiciones del Teorema 1, para cualquier valor inicial <InlineMath math="x_0 \in [a, b]" />, la sucesión <InlineMath math="x_{n+1} = g(x_n)" /> converge al único punto fijo <InlineMath math="p" /> con la siguiente cota de error:
            </p>
            <FormulaDisplay formula="|x_n - p| \le k^n |x_0 - p| \xrightarrow{n \to \infty} 0" />
          </div>
        </div>

        {/* Teorema 3 */}
        <div className="border border-slate-200 rounded-3xl p-6 space-y-3 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-900 bg-slate-200 px-3 py-1 rounded-full">
              Teorema 3
            </span>
            <span className="text-xs font-bold text-slate-500">Rapidez de Convergencia</span>
          </div>
          <h4 className="text-base font-bold text-slate-900">Convergencia Cuadrática de Newton</h4>
          <div className="text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed">
            <p>
              Sea <InlineMath math="f \in C^2[a, b]" />. Si <InlineMath math="f(p) = 0" /> y <InlineMath math="f'(p) \ne 0" />, existe un entorno donde la sucesión de Newton converge con orden cuadrático (<InlineMath math="p = 2" />):
            </p>
            <FormulaDisplay formula="\lim_{n \to \infty} \frac{|x_{n+1} - p|}{|x_n - p|^2} = \left| \frac{f''(p)}{2 f'(p)} \right|" />
            <p className="text-slate-600 font-medium">
              Esto demuestra matemáticamente por qué el número de decimales exactos se duplica en cada iteración de Newton.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-slate-900">Comparativa Directa: Newton vs Punto Fijo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle size={18} /> Ventajas de Newton
            </h4>
            <ul className="space-y-2 text-slate-700 list-disc list-inside">
              <li>Convergencia extraordinariamente rápida (orden cuadrático).</li>
              <li>Solo requiere un valor inicial <InlineMath math="x_0" /> en vez de un intervalo acotado.</li>
              <li>Ideal para ingeniería donde se requieren tolerancias estrictas (<InlineMath math="10^{-6}" />).</li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle size={18} /> Limitaciones y Casos de Cuidado
            </h4>
            <ul className="space-y-2 text-slate-700 list-disc list-inside">
              <li>Si <InlineMath math="f'(x_n) = 0" />, el método falla por división por cero.</li>
              <li>Requiere calcular la derivada analítica <InlineMath math="f'(x)" />.</li>
              <li>Si <InlineMath math="x_0" /> está lejos, puede diverger o caer en ciclos oscilatorios.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Print PDF Footer */}
      <div className="p-6 bg-slate-100 rounded-3xl text-center space-y-3 border border-slate-200 print:hidden">
        <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider">¿Deseas llevarte esta teoría en PDF?</h4>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Pulsa el botón para generar el archivo imprimible con todos los teoremas y esquemas listos.
        </p>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
        >
          <Printer size={15} />
          <span>Generar PDF Imprimible</span>
        </button>
      </div>
    </div>
  );
};
export default TheorySection;
