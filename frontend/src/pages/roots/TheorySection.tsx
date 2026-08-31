import React from 'react';
import FormulaDisplay from '../../components/FormulaDisplay';
import { BookOpen, CheckCircle, AlertTriangle, Sparkles, FileText } from 'lucide-react';

export const TheorySection: React.FC = () => {
  return (
    <div className="space-y-12 max-w-4xl mx-auto pb-12">
      {/* Introduction Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-slate-900">
          <BookOpen size={24} />
          <h2 className="text-xl font-bold text-slate-900">Fundamentos: Raíces de Funciones Continuas</h2>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
          Dada una función continua <span className="font-mono font-bold">f(x)</span> en un entorno, se denominan <strong>raíces o ceros</strong> de la función a todos aquellos valores <span className="font-mono font-bold">xᵢ</span> tales que:
        </p>
        <FormulaDisplay label="Condición de Raíz" formula="f(x_i) = 0" />
        <p className="text-slate-600 text-sm leading-relaxed">
          Cuando las ecuaciones son no lineales o trascendentes (por ejemplo polinomios de grado mayor a 4, o expresiones como <span className="font-mono">x = \cos(x)</span> o <span className="font-mono">eˣ + 2x = 6</span>), no existen métodos analíticos exactos, por lo que recurrimos a <strong>métodos iterativos numéricos</strong>.
        </p>
      </section>

      {/* Newton Method Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-4">
          <Sparkles size={24} />
          <h2 className="text-xl font-bold text-slate-900">1. Método de Newton</h2>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-800">Deducción Geométrica por Recta Tangente</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            En cada iteración, se aproxima la curva de la función <span className="font-mono">f(x)</span> mediante su recta tangente <span className="font-mono">Lₙ(x)</span> en el punto <span className="font-mono">(xₙ, f(xₙ))</span>:
          </p>
          <FormulaDisplay label="Ecuación de la Tangente" formula="L_n(x) = f(x_n) + f'(x_n) \cdot (x - x_n)" />
          <p className="text-slate-600 text-sm leading-relaxed">
            El siguiente valor <span className="font-mono">xₙ₊₁</span> de la sucesión se define como la intersección de dicha recta tangente con el eje horizontal <span className="font-mono">y = 0</span>:
          </p>
          <FormulaDisplay label="Intersección" formula="L_n(x_{n+1}) = f(x_n) + f'(x_n) \cdot (x_{n+1} - x_n) = 0" />
          <p className="text-slate-600 text-sm leading-relaxed">
            Despejando <span className="font-mono">xₙ₊₁</span> obtenemos la <strong>fórmula recursiva de Newton</strong>:
          </p>
          <FormulaDisplay label="Fórmula de Newton" formula="x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}" />
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Criterios de Paro</h4>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
            <li>
              <strong>Por cota de error:</strong> Se detiene cuando <span className="font-mono">|xₙ₊₁ - xₙ| &lt; \varepsilon</span> (donde <span className="font-mono">\varepsilon</span> es un valor pequeño como <span className="font-mono">10⁻⁴</span> o <span className="font-mono">10⁻⁶</span>).
            </li>
            <li>
              <strong>Por número máximo de iteraciones:</strong> Límite de seguridad <span className="font-mono">N_{'{max}'}</span> para evitar bucles infinitos en caso de no convergencia.
            </li>
          </ul>
        </div>
      </section>

      {/* Fixed Point Method Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-4">
          <FileText size={24} />
          <h2 className="text-xl font-bold text-slate-900">2. Método de Iteración de Punto Fijo</h2>
        </div>

        <div className="space-y-3">
          <p className="text-slate-600 text-sm leading-relaxed">
            Cualquier ecuación <span className="font-mono">f(x) = 0</span> se puede transformar algebraicamente a la forma equivalente:
          </p>
          <FormulaDisplay label="Ecuación de Punto Fijo" formula="x = g(x)" />
          <p className="text-slate-600 text-sm leading-relaxed">
            A partir de un valor inicial <span className="font-mono">x₀</span>, se genera la sucesión recursiva:
          </p>
          <FormulaDisplay label="Sucesión Iterativa" formula="x_{n+1} = g(x_n), \quad n \ge 0" />
          <p className="text-slate-600 text-sm leading-relaxed">
            Si la sucesión converge a un número <span className="font-mono">p</span>, entonces <span className="font-mono">p = g(p)</span> y por lo tanto <span className="font-mono">p</span> es la raíz buscada.
          </p>
        </div>

        {/* Newton as a Fixed Point special case */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <h4 className="text-sm font-bold text-slate-900">Newton como caso particular de Punto Fijo</h4>
          <p className="text-xs text-slate-700 leading-relaxed">
            El método de Newton es una técnica de punto fijo donde la función de iteración se define específicamente como:
          </p>
          <FormulaDisplay label="Función g(x) de Newton" formula="g(x) = x - \frac{f(x)}{f'(x)}" />
        </div>
      </section>

      {/* Theorems of the Syllabus */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 text-slate-900 border-b border-slate-100 pb-4">
          <CheckCircle size={24} />
          <h2 className="text-xl font-bold text-slate-900">3. Teoremas de Convergencia de la Cátedra</h2>
        </div>

        {/* Teorema 1 */}
        <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Teorema 1
            </span>
            <span className="text-xs font-medium text-slate-400">Existencia y Unicidad</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900">Existencia y Unicidad de Punto Fijo</h4>
          <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
            <p>
              <strong>Parte a) Existencia:</strong> Si <span className="font-mono">g(x)</span> es continua en <span className="font-mono">[a, b]</span> y <span className="font-mono">g(x) \in [a, b]</span> para todo <span className="font-mono">x \in [a, b]</span>, entonces <span className="font-mono">g(x)</span> tiene al menos un punto fijo en <span className="font-mono">[a, b]</span>.
            </p>
            <p>
              <strong>Parte b) Unicidad:</strong> Si además <span className="font-mono">g'(x)</span> existe para todo <span className="font-mono">x \in (a, b)</span> y existe una constante positiva <span className="font-mono">k &lt; 1</span> tal que:
            </p>
            <FormulaDisplay label="Condición de Unicidad" formula="|g'(x)| \le k < 1, \quad \forall x \in (a, b)" />
            <p>
              Entonces el punto fijo <span className="font-mono">p \in [a, b]</span> es <strong>único</strong>.
            </p>
          </div>
        </div>

        {/* Teorema 2 */}
        <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Teorema 2
            </span>
            <span className="text-xs font-medium text-slate-400">Convergencia Global</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900">Teorema del Punto Fijo (Convergencia de la Sucesión)</h4>
          <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
            <p>
              Bajo las hipótesis del Teorema 1 (<span className="font-mono">g(x) \in [a, b]</span> y <span className="font-mono">|g'(x)| \le k &lt; 1</span>), para cualquier valor inicial <span className="font-mono">x₀ \in [a, b]</span>, la sucesión <span className="font-mono">xₙ₊₁ = g(xₙ)</span> converge al único punto fijo <span className="font-mono">p</span>:
            </p>
            <FormulaDisplay label="Cota de Error" formula="|x_n - p| \le k^n |x_0 - p| \xrightarrow{n \to \infty} 0" />
          </div>
        </div>

        {/* Teorema 3 */}
        <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Teorema 3
            </span>
            <span className="text-xs font-medium text-slate-400">Convergencia Cuadrática</span>
          </div>
          <h4 className="text-sm font-bold text-slate-900">Rapidez de Convergencia de Newton</h4>
          <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
            <p>
              Sea <span className="font-mono">f \in C²[a, b]</span>. Si <span className="font-mono">p \in [a, b]</span> es una raíz (<span className="font-mono">f(p) = 0</span>) y la primera derivada no es nula (<span className="font-mono">f'(p) \ne 0</span>), existe un entorno <span className="font-mono">[p - \delta, p + \delta]</span> tal que la sucesión de Newton converge <strong>cuadráticamente</strong>:
            </p>
            <FormulaDisplay label="Orden Cuadrático" formula="\lim_{n \to \infty} \frac{|x_{n+1} - p|}{|x_n - p|^2} = \left| \frac{f''(p)}{2 f'(p)} \right|" />
            <p className="text-slate-500">
              Esto significa que el número de cifras decimales correctas aproximadamente se <strong>duplica en cada iteración</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table: Advantages and Limitations */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900">Comparativa: Ventajas y Desventajas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle size={16} /> Ventajas de Newton
            </h4>
            <ul className="space-y-1.5 text-slate-700 list-disc list-inside">
              <li>Convergencia extraordinariamente rápida (orden 2 / cuadrática).</li>
              <li>Requiere únicamente una estimación inicial <span className="font-mono">x₀</span> en lugar de un intervalo cerrado.</li>
              <li>Fácil de programar y evaluar computacionalmente.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle size={16} /> Limitaciones y Desventajas
            </h4>
            <ul className="space-y-1.5 text-slate-700 list-disc list-inside">
              <li>Si <span className="font-mono">f'(xₙ) = 0</span>, el método se indetermina por división por cero.</li>
              <li>No garantiza convergencia si <span className="font-mono">x₀</span> está lejos de la raíz.</li>
              <li>Requiere calcular analíticamente la derivada <span className="font-mono">f'(x)</span>.</li>
              <li>Puede caer en ciclos oscilatorios infinitos.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bibliography */}
      <footer className="p-6 bg-slate-100 rounded-3xl text-xs text-slate-500 space-y-2 border border-slate-200">
        <h4 className="font-bold uppercase tracking-wider text-slate-700">Referencias y Bibliografía</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Apunte Teórico y Guía de Trabajos Prácticos Nº 2 (Raíces de Ecuaciones No Lineales).</li>
          <li>Burden, R. L., & Faires, J. D. <em>Análisis Numérico</em> (9ª Edición). Cengage Learning.</li>
          <li>Chapra, S. C., & Canale, R. P. <em>Métodos Numéricos para Ingenieros</em> (7ª Edición). McGraw-Hill.</li>
        </ul>
      </footer>
    </div>
  );
};
export default TheorySection;
