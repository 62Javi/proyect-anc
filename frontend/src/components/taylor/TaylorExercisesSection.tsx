import React from 'react';
import { FileCheck2, ArrowUpRight, CheckCircle2, Calculator } from 'lucide-react';
import type { TaylorPreset } from '../../types/taylor';
import InlineMath from '../InlineMath';

interface TaylorExercisesSectionProps {
  onLoadExercise: (preset: TaylorPreset) => void;
}

export const OFFICIAL_TAYLOR_EXERCISES: TaylorPreset[] = [
  {
    id: 'amiconi-1',
    title: 'Ejercicio Resuelto Nº 1 (Apunte Oficial Ing. Amiconi)',
    subtitle: 'Problema guía de la cátedra con desarrollo detallado paso a paso en 3 iteraciones.',
    expression: '2*x*y',
    x_var: 'x',
    y_var: 'y',
    x0: 1.0,
    y0: 1.0,
    xf: 1.3,
    h: 0.1,
    order: 2,
    exactFormula: 'y(x) = e^{x^2 - 1}',
    source: 'amiconi',
  },
  {
    id: 'tp5-1a',
    title: 'Ejercicio Nº 1 - Inciso a) (Práctica 05 EDO)',
    subtitle: 'Decaimiento cúbico con condición inicial en x=0. Hallar y(0.5) con paso h=0.1.',
    expression: '-3*x^2*y',
    x_var: 'x',
    y_var: 'y',
    x0: 0.0,
    y0: 3.0,
    xf: 0.5,
    h: 0.1,
    order: 2,
    exactFormula: 'y(x) = 3 \\cdot e^{-x^3}',
    source: 'tp5',
  },
  {
    id: 'tp5-1b',
    title: 'Ejercicio Nº 1 - Inciso b) (Práctica 05 EDO)',
    subtitle: 'Ecuación no lineal separable con derivada cuadrática en y. Hallar y(0.5).',
    expression: '(1/4)*(1 + y^2)',
    x_var: 'x',
    y_var: 'y',
    x0: 0.0,
    y0: 1.0,
    xf: 0.5,
    h: 0.1,
    order: 2,
    exactFormula: 'y(x) = \\tan\\left(\\frac{x}{4} + \\frac{\\pi}{4}\\right)',
    source: 'tp5',
  },
  {
    id: 'tp5-1c',
    title: 'Ejercicio Nº 1 - Inciso c) (Práctica 05 EDO)',
    subtitle: 'Misma ecuación que Amiconi: y\' = 2xy, y(1)=1, hallar y(1.3) con h=0.1.',
    expression: '2*x*y',
    x_var: 'x',
    y_var: 'y',
    x0: 1.0,
    y0: 1.0,
    xf: 1.3,
    h: 0.1,
    order: 2,
    exactFormula: 'y(x) = e^{x^2 - 1}',
    source: 'tp5',
  },
  {
    id: 'tp5-1d',
    title: 'Ejercicio Nº 1 - Inciso d) (Práctica 05 EDO)',
    subtitle: 'Variable independiente temporal t. 1 <= t <= 3 con h=0.5. ¿Cuántas iteraciones son necesarias?',
    expression: '(1/t)*(y^2 + y)',
    x_var: 't',
    y_var: 'y',
    x0: 1.0,
    y0: -2.0,
    xf: 3.0,
    h: 0.5,
    order: 2,
    exactFormula: 'y(t) = \\frac{-2}{2 - t}',
    source: 'tp5',
  },
];

export const TaylorExercisesSection: React.FC<TaylorExercisesSectionProps> = ({ onLoadExercise }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-slate-100 text-slate-900 rounded-xl">
            <FileCheck2 size={20} />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Ejercicios Resueltos de la Cátedra
            </h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Práctica Oficial Nº 05 y Apunte Teórico-Práctico de Ing. Amiconi
            </span>
          </div>
        </div>
        <p className="text-sm text-slate-600 font-medium">
          Selecciona cualquiera de los ejercicios de la guía para inspeccionar su desarrollo analítico y
          cargarlo instantáneamente en el simulador interactivo para comprobar sus resultados.
        </p>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {OFFICIAL_TAYLOR_EXERCISES.map((ex) => (
          <div
            key={ex.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      ex.source === 'amiconi'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {ex.source === 'amiconi' ? 'Apunte Amiconi' : 'Práctica 05'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Taylor Orden {ex.order}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {ex.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{ex.subtitle}</p>
              </div>

              <button
                onClick={() => onLoadExercise(ex)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 self-start sm:self-auto"
              >
                <Calculator size={14} />
                <span>Cargar en Simulador</span>
                <ArrowUpRight size={14} />
              </button>
            </div>

            {/* Formula and Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Ecuación Diferencial
                </span>
                <div className="font-mono font-bold text-slate-900 mt-0.5">
                  <InlineMath math={`${ex.y_var}' = ${ex.expression}`} />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Condición Inicial & Dominio
                </span>
                <div className="font-mono text-slate-700 mt-0.5">
                  <InlineMath
                    math={`${ex.y_var}(${ex.x0}) = ${ex.y0}, \\; [${ex.x0}, ${ex.xf}], \\; h=${ex.h}`}
                  />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Solución Analítica Exacta
                </span>
                <div className="font-mono text-emerald-800 font-bold mt-0.5">
                  {ex.exactFormula ? (
                    <InlineMath math={ex.exactFormula} />
                  ) : (
                    <span className="text-slate-400 italic">No elemental</span>
                  )}
                </div>
              </div>
            </div>

            {/* Note on number of iterations */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
              <span>
                Iteraciones requeridas:{' '}
                <strong className="text-slate-900">
                  N = ({ex.xf} - {ex.x0}) / {ex.h} = {Math.round((ex.xf - ex.x0) / ex.h)}
                </strong>
              </span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 size={13} />
                Verificado con apuntes de cátedra
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaylorExercisesSection;
