import React, { useState } from 'react';
import {
  BookOpen,
  HelpCircle,
  Sparkles,
  AlertCircle,
  Printer,
  BookMarked,
  Download,
  ExternalLink,
  FileText,
} from 'lucide-react';
import InlineMath from '../InlineMath';
import MathText from '../MathText';
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
    id: 'tp5-edo',
    title: 'Trabajo Práctico Nº 5: Ecuaciones Diferenciales Ordinarias',
    originalName: '05 - Práctica de Ecuaciones Diferenciales Ordinarias.pdf',
    author: 'Cátedra de Análisis Numérico • UTN FRLP',
    category: 'Trabajo Práctico',
    description:
      'Guía oficial con enunciados prácticos sobre Problemas de Valor Inicial (P.V.I.), Método de Taylor, Euler, Heun y Runge-Kutta.',
    fileSize: '54 KB',
    url: '/docs/05-tp5-edo.pdf',
    downloadFilename: '05 - Práctica de Ecuaciones Diferenciales Ordinarias.pdf',
  },
  {
    id: 'edo-amiconi',
    title: 'Ejemplos Resueltos de EDO (Método de Taylor y P.V.I.)',
    originalName: '06 - Ejemplos resueltos (Ecuaciones diferenciales ordinarias) - Amiconi.pdf',
    author: 'Cátedra ANC • Prof. Ing. Amiconi',
    category: 'Apunte de Cátedra',
    description:
      'Apunte oficial con deducción paso a paso de la Ordenada Genérica para Taylor de orden 2 a 4, regla de la cadena multivariada, tabulaciones y comparativa de métodos numéricos.',
    fileSize: '362 KB',
    url: '/docs/06-edo-amiconi-ejemplos.pdf',
    downloadFilename: '06 - Ejemplos resueltos (Ecuaciones diferenciales ordinarias) - Amiconi.pdf',
  },
  {
    id: 'tp6-contorno',
    title: 'Trabajo Práctico Nº 6: EDO y Problemas de Contorno',
    originalName: '06 - Práctica de EDO y Contorno.pdf',
    author: 'Cátedra de Análisis Numérico • UTN FRLP',
    category: 'Trabajo Práctico',
    description:
      'Guía de ejercitación complementaria para problemas de valores en la frontera y ecuaciones diferenciales de orden superior.',
    fileSize: '39 KB',
    url: '/docs/06-tp6-edo-contorno.pdf',
    downloadFilename: '06 - Práctica de EDO y Contorno.pdf',
  },
  {
    id: 'contorno-amiconi',
    title: 'Ejemplos Resueltos: Problemas de Contorno',
    originalName: '07 - Ejemplos resueltos (Problemas de Contorno) - Amiconi.pdf',
    author: 'Cátedra ANC • Prof. Ing. Amiconi',
    category: 'Apunte de Cátedra',
    description:
      'Resolución práctica y analítica desarrollada por el Ing. Amiconi para condiciones de contorno y diferencias finitas.',
    fileSize: '307 KB',
    url: '/docs/07-contorno-amiconi-ejemplos.pdf',
    downloadFilename: '07 - Ejemplos resueltos (Problemas de Contorno) - Amiconi.pdf',
  },
];

export const TaylorTheorySection: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const { printRef, handlePrint } = useAppPrint('Guia-Teorica-Taylor-EDO');

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
    <div className="space-y-8 max-w-4xl mx-auto text-slate-800 pb-16">
      {/* Top Banner con botón de acción */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl shadow-slate-200 print:hidden">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
            Material de Estudio • Cátedra de Modelos Numéricos (UTN FRLP)
          </span>
          <h2 className="text-xl sm:text-2xl font-black">
            Guía Teórica de Taylor para E.D.O.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Descargá o imprimí este documento en PDF con el desarrollo analítico del método de Taylor, deducción de la Ordenada Genérica, regla de la cadena multivariada y análisis de cotas de error.
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
      <div ref={printRef} className="space-y-8 print-container">
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

      {/* 6. Bibliografía y Material de la Cátedra */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 print:hidden">
              <BookMarked size={20} />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                6. Bibliografía y Material de Cátedra
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Documentos Oficiales en PDF
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full print:hidden">
            {BIBLIOGRAPHY_DOCS.length} documentos oficiales
          </span>
        </div>

        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          Podés consultar los apuntes teóricos y las guías de trabajos prácticos provistos por la cátedra para la unidad de <strong>Ecuaciones Diferenciales Ordinarias (E.D.O.)</strong>. Hacé clic para visualizarlos directamente en el navegador o descargarlos en tu dispositivo.
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

export default TaylorTheorySection;
