import React, { useState } from 'react';
import { BookOpen, HelpCircle, Sparkles, AlertCircle } from 'lucide-react';
import InlineMath from '../InlineMath';
import MathText from '../MathText';

export const TaylorTheorySection: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: '¿Por qué Euler es en realidad un caso particular del método de Taylor?',
      a: 'El método de Euler es exactamente el método de Taylor de orden 1 ($p = 1$). Al truncar la serie de Taylor en el término lineal $h \\cdot y\'(x_n)$, se obtiene $y_{n+1} = y_n + h \\cdot f(x_n, y_n)$. Su error local de truncamiento es $O(h^2)$ y su error global es $O(h)$. Por eso, Taylor es el marco teórico unificador del que nacen los demás métodos.',
    },
    {
      q: '¿Por qué históricamente se preferían los métodos de Runge-Kutta sobre Taylor de orden superior?',
      a: 'Porque para órdenes mayores a 2, calcular analíticamente a mano las derivadas sucesivas $y\'\'$, $y\'\'\'$, $y^{(4)}$ mediante la regla de la cadena multivariada resulta extremadamente tedioso y propenso a error humano. Runge-Kutta aproxima la precisión de Taylor evaluando $f(x, y)$ en puntos intermedios sin requerir derivación analítica. Sin embargo, con herramientas simbólicas modernas como SymPy (integrada en esta plataforma), la desventaja de Taylor desaparece por completo.',
    },
    {
      q: '¿Cuál es la diferencia entre el error local de truncamiento y el error global acumulado?',
      a: 'El error local de truncamiento es el error cometido en un único paso suponiendo que el punto de partida es exacto. Para Taylor de orden $p$, el residuo de Lagrange es $R_p = \\frac{h^{p+1}}{(p+1)!} y^{(p+1)}(\\xi)$, es decir, $O(h^{p+1})$. El error global es la acumulación de estos errores a lo largo de los $N = \\frac{x_f - x_0}{h}$ pasos, por lo que se reduce en una potencia de $h$: $\\text{Error Global} = N \\cdot O(h^{p+1}) = O(h^p)$.',
    },
    {
      q: '¿Qué es una "Ordenada Genérica" según la cátedra de Amiconi?',
      a: 'Es la expresión algebraica general que relaciona $y_{n+1}$ en función de las variables discretas $(x_n, y_n)$ para cualquier iteración $n$. Una vez obtenida la Ordenada Genérica para el problema particular, sólo resta sustituir iterativamente los valores numéricos recorriendo el dominio de trabajo desde $x_0$ hasta $x_f$ con paso $h$.',
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-slate-800">
      {/* Intro Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-slate-100 text-slate-900 rounded-xl">
            <BookOpen size={20} />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Marco Teórico: Métodos de Taylor para P.V.I.
            </h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Cátedras de Modelos Numéricos y Cálculo Avanzado — UTN FRLP (Ing. Amiconi)
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          En problemas de ingeniería, la gran mayoría de las ecuaciones diferenciales ordinarias (EDO)
          no admiten solución analítica cerrada en términos de funciones elementales. Se recurre por lo
          tanto a <strong className="text-slate-900">métodos numéricos de paso simple</strong> para aproximar
          los valores de la función solución a lo largo de un dominio discreto.
        </p>
      </div>

      {/* 1. Definición del P.V.I. */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-center font-black">
            1
          </span>
          Estructura de un Problema de Valor Inicial (P.V.I.)
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed">
          Un Problema de Valor Inicial de primer orden se encuentra completamente determinado por cuatro elementos esenciales:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="font-bold text-slate-900 block">1. Ecuación diferencial:</span>
            <div className="py-1">
              <InlineMath math="y' = \frac{dy}{dx} = f(x, y(x))" block />
            </div>
            <p className="text-slate-500">
              Varía respecto de <InlineMath math="x" /> y de <InlineMath math="y" /> (la cual depende de <InlineMath math="x" />).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="font-bold text-slate-900 block">2. Condición inicial:</span>
            <div className="py-1">
              <InlineMath math="y(x_0) = y_0" block />
            </div>
            <p className="text-slate-500">Punto de partida conocido con certeza absoluta.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="font-bold text-slate-900 block">3. Dominio de trabajo:</span>
            <div className="py-1">
              <InlineMath math="x_0 \le x \le x_f" block />
            </div>
            <p className="text-slate-500">Intervalo acotado donde se busca la aproximación.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="font-bold text-slate-900 block flex items-center gap-1">
              <span>4. Paso de integración</span>
              <InlineMath math="h" />:
            </span>
            <div className="py-1">
              <InlineMath math="x_{n+1} = x_n + h \implies N = \frac{x_f - x_0}{h}" block />
            </div>
            <p className="text-slate-500">
              Determina la cantidad <InlineMath math="N" /> de iteraciones a realizar.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Deducción de la Serie de Taylor */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-center font-black">
            2
          </span>
          Deducción de la Serie de Taylor y la Ordenada Genérica
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed">
          Suponiendo que la solución analítica <InlineMath math="y(x)" /> posee derivadas continuas hasta orden <InlineMath math="p+1" />,
          podemos desarrollar <InlineMath math="y(x_{n+1}) = y(x_n + h)" /> mediante el teorema de Taylor alrededor de <InlineMath math="x_n" />:
        </p>

        <div className="p-4 rounded-2xl bg-slate-900 text-white overflow-x-auto text-xs sm:text-sm">
          <InlineMath
            math="y(x_n + h) = y(x_n) + h \, y'(x_n) + \frac{h^2}{2!} \, y''(x_n) + \frac{h^3}{3!} \, y'''(x_n) + \dots + \frac{h^p}{p!} \, y^{(p)}(x_n) + R_p"
            block
          />
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          Al despreciar el término del residuo <InlineMath math="R_p" />, definimos la <strong className="text-slate-900">Ordenada Genérica</strong>{' '}
          <InlineMath math="y_{n+1}" /> para el método de Taylor de orden <InlineMath math="p" />:
        </p>

        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 font-bold overflow-x-auto text-center text-sm">
          <InlineMath
            math="y_{n+1} = y_n + h \, y'_n + \frac{h^2}{2!} \, y''_n + \frac{h^3}{3!} \, y'''_n + \dots + \frac{h^p}{p!} \, y^{(p)}_n"
            block
          />
        </div>
      </div>

      {/* 3. Cálculo de Derivadas Sucesivas por Regla de la Cadena */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-center font-black">
            3
          </span>
          Cálculo Simbólico de Derivadas Sucesivas (Regla de la Cadena)
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed">
          Como <InlineMath math="y = y(x)" />, cada derivada total respecto a <InlineMath math="x" /> involucra derivación implícita multivariada:
        </p>

        <div className="space-y-2.5 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-slate-800">Orden 1 (Euler):</span>
            <div className="py-1">
              <InlineMath math="y' = f(x, y)" />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-slate-800">Orden 2:</span>
            <div className="py-1">
              <InlineMath math="y'' = \frac{d}{dx}[f(x, y)] = \frac{\partial f}{\partial x} + \frac{\partial f}{\partial y} \cdot y' = \frac{\partial f}{\partial x} + \frac{\partial f}{\partial y} \cdot f(x, y)" />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-slate-800">Orden 3:</span>
            <div className="py-1">
              <InlineMath math="y''' = \frac{d}{dx}[y''] = \frac{\partial y''}{\partial x} + \frac{\partial y''}{\partial y} \cdot f(x, y)" />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <AlertCircle size={18} className="shrink-0 mt-0.5 text-amber-600" />
          <p className="leading-relaxed">
            <strong>Dato de Cátedra:</strong> En el apunte de Amiconi, el ejercicio paradigmático analizado es{' '}
            <InlineMath math="y' = 2xy" />. Allí, <InlineMath math="\frac{\partial f}{\partial x} = 2y" /> y{' '}
            <InlineMath math="\frac{\partial f}{\partial y} = 2x" />, resultando en{' '}
            <InlineMath math="y'' = 2y + (2x)(2xy) = 2y + 4x^2y" />. Nuestra plataforma realiza esta deducción
            automáticamente mediante SymPy.
          </p>
        </div>
      </div>

      {/* 4. Orden de Convergencia y Error de Truncamiento */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-center font-black">
            4
          </span>
          Jerarquía de Órdenes y Error de Truncamiento
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-black">
                <th className="p-3">Método / Orden</th>
                <th className="p-3">Términos en la Ordenada</th>
                <th className="p-3">Error Local</th>
                <th className="p-3">Error Global</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-bold text-slate-900">Taylor Orden 1 (Euler)</td>
                <td className="p-3 font-mono text-slate-600">
                  <InlineMath math="y_n + h \cdot y'_n" />
                </td>
                <td className="p-3"><InlineMath math="O(h^2)" /></td>
                <td className="p-3 font-bold text-rose-600"><InlineMath math="O(h)" /></td>
              </tr>
              <tr className="bg-blue-50/40">
                <td className="p-3 font-bold text-blue-900">Taylor Orden 2 (Tema Grupo 1)</td>
                <td className="p-3 font-mono text-slate-600">
                  <InlineMath math="y_n + h \cdot y'_n + \frac{h^2}{2!} y''_n" />
                </td>
                <td className="p-3"><InlineMath math="O(h^3)" /></td>
                <td className="p-3 font-bold text-emerald-600"><InlineMath math="O(h^2)" /></td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">Taylor Orden 3</td>
                <td className="p-3 font-mono text-slate-600">
                  <InlineMath math="\dots + \frac{h^3}{3!} y'''_n" />
                </td>
                <td className="p-3"><InlineMath math="O(h^4)" /></td>
                <td className="p-3 font-bold text-emerald-700"><InlineMath math="O(h^3)" /></td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">Taylor Orden 4</td>
                <td className="p-3 font-mono text-slate-600">
                  <InlineMath math="\dots + \frac{h^4}{4!} y^{(4)}_n" />
                </td>
                <td className="p-3"><InlineMath math="O(h^5)" /></td>
                <td className="p-3 font-bold text-emerald-800"><InlineMath math="O(h^4)" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Preguntas Clave para el Coloquio y Rúbrica */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-emerald-100 text-emerald-900 rounded-xl">
            <Sparkles size={18} />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Preguntas Clave para la Rúbrica de Exposición (Grupo 1)
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Respuestas sólidas y estructuradas a las preguntas típicas de los profesores.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-slate-50/50"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle size={16} className="text-slate-400 shrink-0" />
                    <span>{faq.q}</span>
                  </div>
                  <span className="text-xs text-slate-400">{isOpen ? '▲' : '▼'}</span>
                </button>
                {isOpen && (
                  <div className="p-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                    <MathText text={faq.a} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TaylorTheorySection;
