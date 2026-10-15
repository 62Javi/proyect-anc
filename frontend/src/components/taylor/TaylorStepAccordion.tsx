import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, CheckCircle2 } from 'lucide-react';
import type { TaylorResponse, TaylorStep } from '../../types/taylor';
import InlineMath from '../InlineMath';
import { formatCleanNumber } from '../../utils/numberFormat';

interface TaylorStepAccordionProps {
  result: TaylorResponse;
}

export const TaylorStepAccordion: React.FC<TaylorStepAccordionProps> = ({ result }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // First step open by default

  const toggleStep = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const { steps, derivatives, x_var, y_var, h } = result;

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-7 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-slate-100 rounded-lg text-slate-800">
              <BookOpen size={16} />
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
              Resolución Analítica Paso a Paso
            </h3>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
            Sustitución analítica y numérica detallada en la ordenada genérica iteración por iteración.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setExpandedIndex(expandedIndex === null ? 0 : null)}
            className="text-[11px] sm:text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer"
          >
            {expandedIndex === null ? 'Expandir primer paso' : 'Colapsar todo'}
          </button>
        </div>
      </div>

      {/* Accordion Steps List */}
      <div className="space-y-3">
        {steps.map((step: TaylorStep, idx: number) => {
          const isOpen = expandedIndex === idx;
          const isLast = idx === steps.length - 1;
          const xnClean = formatCleanNumber(step.xn, 4);
          const xNextClean = formatCleanNumber(step.xn + h, 4);
          const ynClean = formatCleanNumber(step.yn, 6);
          const ynNextClean = formatCleanNumber(step.yn_plus_1, 6);
          const hClean = formatCleanNumber(h, 4);

          return (
            <div
              key={step.step}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-white border-slate-300 shadow-xs'
                  : 'bg-white border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleStep(idx)}
                className="w-full p-3.5 sm:p-4 flex items-center justify-between gap-2.5 text-left cursor-pointer transition-colors hover:bg-slate-50/50"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      isOpen
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 flex-wrap leading-snug">
                      <span>Iteración</span>
                      <InlineMath math={`n = ${idx}`} />
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-600 font-medium font-mono text-xs">
                        <InlineMath math={`[${xnClean}, ${xNextClean}]`} />
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 flex-wrap mt-0.5">
                      <span>Aproximación calculada:</span>
                      <span className="font-mono text-slate-800 font-bold">
                        <InlineMath math={`\\hat{${y_var}}_{${idx + 1}} = ${ynNextClean}`} />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isLast && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 size={12} />
                      Final
                    </span>
                  )}
                  <span className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </div>
              </button>

              {/* Accordion Body */}
              {isOpen && (
                <div className="px-4 sm:px-6 py-4 border-t border-slate-100 bg-white space-y-4 text-xs">
                  {/* Punto de Partida y Derivadas Evaluadas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Punto de Partida */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        Punto de Partida del Intervalo
                      </span>
                      <div className="grid grid-cols-3 gap-2 font-mono text-slate-900 font-bold text-xs">
                        <div className="bg-white p-2 rounded-lg border border-slate-200/60 text-center">
                          <span className="text-[10px] text-slate-400 block font-sans font-normal">
                            <InlineMath math={`${x_var}_${idx}`} />
                          </span>
                          {xnClean}
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200/60 text-center">
                          <span className="text-[10px] text-slate-400 block font-sans font-normal">
                            <InlineMath math={`${y_var}_${idx}`} />
                          </span>
                          {ynClean}
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200/60 text-center">
                          <span className="text-[10px] text-slate-400 block font-sans font-normal">
                            <InlineMath math="h" />
                          </span>
                          {hClean}
                        </div>
                      </div>
                    </div>

                    {/* Derivadas Evaluadas */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                        Derivadas Evaluadas en <InlineMath math={`(${xnClean}, ${ynClean})`} />
                      </span>
                      <div className="grid grid-cols-2 gap-2 font-mono text-slate-900 font-bold text-xs">
                        {step.derivatives_values.map((val, dIdx) => (
                          <div
                            key={dIdx}
                            className="bg-white p-2 rounded-lg border border-slate-200/60 flex items-center justify-between px-2.5"
                          >
                            <span className="text-slate-500 font-sans font-semibold text-[11px]">
                              <InlineMath math={`${derivatives[dIdx]?.order_label || "y'"} = `} />
                            </span>
                            <span className="text-slate-900">{formatCleanNumber(val, 6)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sustitución en Ordenada Genérica */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Sustitución en la Ordenada Genérica
                    </span>
                    <div className="p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl overflow-x-auto overflow-y-hidden text-slate-900 font-bold text-center scrollbar-none">
                      <InlineMath math={step.explanation_latex} block={true} />
                    </div>
                  </div>

                  {/* Conclusión del Paso */}
                  <div className="p-3 bg-slate-100/70 border border-slate-200/80 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="text-slate-600 font-medium">
                      Aproximación en el extremo superior del subintervalo:
                    </span>
                    <div className="font-mono font-bold text-slate-900 text-sm">
                      <InlineMath math={`\\hat{${y_var}}(${xNextClean}) \\approx ${ynNextClean}`} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaylorStepAccordion;
