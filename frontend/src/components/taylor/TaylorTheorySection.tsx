import React from 'react';
import {
  BookOpen,
  Printer,
  BookMarked,
  Download,
  ExternalLink,
  FileText,
  ChevronRight,
  Compass,
} from 'lucide-react';
import InlineMath from '../InlineMath';
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
    id: 'edo-amiconi',
    title: 'Ejemplos resueltos: Ecuaciones Diferenciales Ordinarias (Problemas de Valor Inicial)',
    originalName: '06 - Ejemplos resueltos (Ecuaciones diferenciales ordinarias) - Amiconi.pdf',
    author: 'Amiconi, D. F. • Cátedra de Modelos Numéricos / Cálculo Avanzado, UTN FRLP',
    category: 'Apunte Teórico-Práctico Oficial',
    description:
      'Guía conceptual principal: definición de los 4 elementos del P.V.I., deducción analítica de la Ordenada Genérica para Taylor de grado 2, derivación por reglas del producto, cadena y cociente, y resolución iterativa paso a paso.',
    fileSize: '362 KB',
    url: '/docs/06-edo-amiconi-ejemplos.pdf',
    downloadFilename: '06 - Ejemplos resueltos (Ecuaciones diferenciales ordinarias) - Amiconi.pdf',
  },
  {
    id: 'tp5-edo',
    title: 'Práctica de Ecuaciones Diferenciales Ordinarias (Problemas de Valor Inicial)',
    originalName: '05 - Práctica de Ecuaciones Diferenciales Ordinarias.pdf',
    author: 'Cátedra de Modelos Numéricos • UTN Facultad Regional La Plata',
    category: 'Guía Oficial de Trabajos Prácticos',
    description:
      'Enunciados de ejercitación práctica de P.V.I. para resolución por el Método de Taylor (Ejercicio 1 incisos a, b, c y d).',
    fileSize: '54 KB',
    url: '/docs/05-tp5-edo.pdf',
    downloadFilename: '05 - Práctica de Ecuaciones Diferenciales Ordinarias.pdf',
  },
];

export const TaylorTheorySection: React.FC = () => {
  const { printRef, handlePrint } = useAppPrint('Guia-Teorica-Taylor-EDO');

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto text-slate-800 pb-16">
      {/* Top Banner de Cátedra */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl shadow-slate-200 print:hidden">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              Exposición N° 3 · Grupo 1
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-300 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-800">
              Apunte 06 · Ing. Diego F. Amiconi (UTN FRLP)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Método de Taylor para Ecuaciones Diferenciales Ordinarias (P.V.I.)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Enfoque conceptual y operativo de cátedra: los 4 elementos de un P.V.I., concepto de Ordenada Genérica y deducción analítica de <InlineMath math="y''" /> aplicando derivación por regla de la cadena, producto o cociente.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handlePrint()}
          className="flex items-center justify-center gap-2 px-5 py-3.5 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
        >
          <Printer size={16} />
          <span>Imprimir Guía PDF</span>
        </button>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div ref={printRef} className="space-y-8 print-container">
        {/* Intro Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-blue-50 text-blue-900 rounded-2xl border border-blue-100">
              <BookOpen size={22} />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Resolución Numérica de E.D.O. por el Método de Taylor
              </h2>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Modelos Numéricos / Cálculo Avanzado — UTN Facultad Regional La Plata
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            Muchos problemas de ingeniería no pueden resolverse analíticamente en términos de funciones elementales. Se recurre entonces a métodos numéricos para la resolución de <strong>Ecuaciones Diferenciales Ordinarias en Problemas de Valor Inicial (P.V.I.)</strong>. En este desarrollo seguimos estrictamente la estructura didáctica del apunte oficial del <strong>Ing. Diego F. Amiconi</strong>.
          </p>
        </div>

        {/* 1. LOS 4 ELEMENTOS FUNDAMENTALES DEL P.V.I. */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="w-8 h-8 rounded-xl bg-slate-900 text-white text-sm flex items-center justify-center font-black shrink-0">
              1
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Los 4 Elementos Fundamentales de un P.V.I.
              </h3>
              <p className="text-xs text-slate-400 font-semibold">
                Información inicial requerida para definir y resolver el problema
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            Tal como lo formula el Ing. Amiconi en su apunte, un Problema de Valor Inicial se presenta a través de cuatro componentes indispensables:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* 1. Ecuación diferencial */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-blue-900 block">
                1) Una Ecuación Diferencial
              </span>
              <div className="py-1">
                <InlineMath math="y' = f(x, y(x)) = \frac{dy}{dx}" block />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Es una ecuación que varía respecto de <InlineMath math="x" /> y que varía respecto de <InlineMath math="y" /> (que a su vez depende de la variación en <InlineMath math="x" /> también).
              </p>
            </div>

            {/* 2. Condición inicial */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-900 block">
                2) Una Condición Inicial
              </span>
              <div className="py-1">
                <InlineMath math="y(x_0) = y_0" block />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Condición que debe satisfacer la solución en el punto de partida. Por ejemplo, si el enunciado indica <InlineMath math="y(-1) = -2.5" />, esto quiere decir que <InlineMath math="x_0 = -1" /> e <InlineMath math="y_0 = -2.5" />.
              </p>
            </div>

            {/* 3. Dominio de trabajo */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-purple-900 block">
                3) Un Dominio de Trabajo en el Eje <InlineMath math="x" />
              </span>
              <div className="py-1">
                <InlineMath math="x_0 \le x \le x_f" block />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Donde <InlineMath math="x_0" /> es el <strong className="text-slate-800">valor inicial</strong> y <InlineMath math="x_f" /> es el <strong className="text-slate-800">valor final</strong> donde se desea hallar la solución numérica aproximada <InlineMath math="y(x_f)" />.
              </p>
            </div>

            {/* 4. Paso h */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900 block">
                4) Un Paso <InlineMath math="h" /> para Recorrer el Dominio
              </span>
              <div className="py-1">
                <InlineMath math="x_{n+1} = x_n + h \implies h = x_{n+1} - x_n" block />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Genera la sucesión de abscisas discretas: <InlineMath math="x_1 = x_0 + h" />, <InlineMath math="x_2 = x_1 + h" />, <InlineMath math="x_3 = x_2 + h" />, hasta cubrir el dominio.
              </p>
            </div>
          </div>
        </section>

        {/* 2. CONCEPTO DE ORDENADA GENÉRICA Y ALGORITMOS DE PASO SIMPLE */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="w-8 h-8 rounded-xl bg-slate-900 text-white text-sm flex items-center justify-center font-black shrink-0">
              2
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                El Concepto de "Ordenada Genérica" (<InlineMath math="y_{n+1}" />)
              </h3>
              <p className="text-xs text-slate-400 font-semibold">
                Algoritmos de un solo paso o paso simple
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>
              Dado el P.V.I., el objetivo de la cátedra es hallar una <strong className="text-slate-900">"Ordenada Genérica" <InlineMath math="y_{n+1}" /></strong> que nos permita calcular una sucesión de valores aproximados:
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-900 text-white text-center font-mono text-xs sm:text-sm">
              <InlineMath math="y_1, \, y_2, \, y_3, \, \dots, \, y_n" />
              <span className="mx-2 text-slate-400">que aproximan a los valores exactos</span>
              <InlineMath math="y(x_1), \, y(x_2), \, y(x_3), \, \dots, \, y(x_n)" />
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-200 text-blue-950 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                <Compass size={16} />
                <span>¿Qué es un Algoritmo de Paso Simple?</span>
              </span>
              <p className="text-xs sm:text-sm text-blue-900/90 leading-relaxed font-medium">
                Son aquellos algoritmos en los que, para el cálculo de la ordenada genérica <InlineMath math="y_{n+1}" />, se requiere únicamente información correspondiente a un solo intervalo <InlineMath math="[x_n, x_{n+1}]" />: generalmente los valores de <InlineMath math="y_n" /> y de <InlineMath math="f(x_n, y_n)" /> en el punto <InlineMath math="x = x_n" />.
              </p>
            </div>
          </div>
        </section>

        {/* 3. DEDUCCIÓN ANALÍTICA DE y'' POR REGLA DE LA CADENA */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white text-sm flex items-center justify-center font-black shrink-0">
              3
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Método de Taylor de Grado 2 y Deducción Analítica de <InlineMath math="y''_n" />
              </h3>
              <p className="text-xs text-slate-400 font-semibold">
                Fórmula general de cátedra, derivación ordinaria (cadena, producto o cociente) y armado de la Ordenada Genérica
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>
              Para el Método de Taylor de grado 2, la fórmula general adoptada en el apunte de Amiconi es:
            </p>

            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 text-center font-bold text-sm sm:text-base">
              <InlineMath math="y_{n+1} = y_n + h \cdot y'_n + \frac{h^2}{2!} \, y''_n" block />
            </div>

            <div className="space-y-3 text-xs sm:text-sm pt-1">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                  <ChevronRight size={16} className="text-blue-600 shrink-0" />
                  <span>Primera Derivada (<InlineMath math="y'_n" />):</span>
                </span>
                <p className="text-slate-600">
                  Se reemplaza directamente por la función del enunciado de la ecuación diferencial evaluada en el punto discreto:
                </p>
                <div className="py-1">
                  <InlineMath math="y'_n = f(x_n, y(x_n))" block />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                  <ChevronRight size={16} className="text-blue-600 shrink-0" />
                  <span>Segunda Derivada (<InlineMath math="y''_n" />) derivando miembro a miembro respecto de <InlineMath math="x" />:</span>
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Para hallar <InlineMath math="y''" />, derivamos directamente <InlineMath math="y' = f(x, y)" /> respecto de la variable independiente <InlineMath math="x" /> (o <InlineMath math="t" />), recordando siempre que <InlineMath math="y" /> es una función de <InlineMath math="x" /> (<InlineMath math="y = y(x)" />). Según la estructura de la función, aplicamos las reglas estándar del cálculo de una variable:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-blue-900 block">1. Regla de la Cadena Estándar</span>
                    <p className="text-slate-500 text-[11px]">Si <InlineMath math="f" /> es una función compuesta de <InlineMath math="y" />:</p>
                    <div className="font-mono text-slate-900 font-semibold py-0.5">
                      <InlineMath math="\frac{d}{dx}[g(y)] = g'(y) \cdot y'" />
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-emerald-900 block">2. Regla del Producto</span>
                    <p className="text-slate-500 text-[11px]">Si <InlineMath math="f" /> es producto de términos en <InlineMath math="x" /> e <InlineMath math="y" />:</p>
                    <div className="font-mono text-slate-900 font-semibold py-0.5">
                      <InlineMath math="(u \cdot v)' = u' \cdot v + u \cdot v'" />
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-amber-900 block">3. Regla del Cociente</span>
                    <p className="text-slate-500 text-[11px]">Si <InlineMath math="f" /> contiene una fracción o cociente:</p>
                    <div className="font-mono text-slate-900 font-semibold py-0.5">
                      <InlineMath math="\left(\frac{u}{v}\right)' = \frac{u' \cdot v - u \cdot v'}{v^2}" />
                    </div>
                  </div>
                </div>

                <p className="text-slate-600 text-xs pt-1">
                  Una vez aplicada la derivada, se sustituye <InlineMath math="y'" /> por su expresión original <InlineMath math="f(x, y)" />, obteniendo la segunda derivada puramente en términos de <InlineMath math="x" /> e <InlineMath math="y" /> para evaluarla en <InlineMath math="(x_n, y_n)" />.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
              <span className="font-bold text-slate-900 block">
                Procedimiento Operativo de Cátedra:
              </span>
              <p className="leading-relaxed">
                1. Se reemplazan las expresiones analíticas de <InlineMath math="y'_n" /> e <InlineMath math="y''_n" /> en la fórmula general de Taylor de grado 2 para obtener la <strong>Ordenada Genérica Particular</strong> del problema.
              </p>
              <p className="leading-relaxed">
                2. Se deducen todas las expresiones en los puntos genéricos <InlineMath math="n" />-ésimos para obtener una única fórmula cerrada.
              </p>
              <p className="leading-relaxed">
                3. Con esa Ordenada Genérica, se recorre el dominio de trabajo realizando las iteraciones sucesivas (<InlineMath math="n = 0, 1, 2\dots" />) sustituyendo numéricamente en cada paso sin necesidad de volver a derivar.
              </p>
            </div>
          </div>
        </section>

        {/* 4. BIBLIOGRAFÍA OFICIAL DE CÁTEDRA */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 print:hidden">
                <BookMarked size={20} />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Bibliografía Oficial de Cátedra
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Materiales de Referencia Académica UTN FRLP
                </p>
              </div>
            </div>
            <span className="self-start sm:self-auto text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full print:hidden">
              {BIBLIOGRAPHY_DOCS.length} fuentes oficiales
            </span>
          </div>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Podés consultar los documentos oficiales provistos por la cátedra para el tema <strong>P.V.I. y Método de Taylor</strong>:
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
