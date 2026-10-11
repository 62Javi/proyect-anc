import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, CheckCircle2 } from 'lucide-react';
import type { TaylorResponse, TaylorStep } from '../../types/taylor';
import InlineMath from '../InlineMath';
import MathText from '../MathText';

interface TaylorStepAccordionProps {
  result: TaylorResponse;
}

export const TaylorStepAccordion: React.FC<TaylorStepAccordionProps> = ({ result }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // First open by default

  const toggleStep = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const { steps, derivatives, x_var, y_var, h } = result;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-slate-100 rounded-lg text-slate-800">
              <BookOpen size={16} />
            </span>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Resolución Paso a Paso (Metodología Amiconi)
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Sustitución analítica y numérica detallada de cada ordenada genérica iteración por iteración.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpandedIndex(expandedIndex === null ? 0 : null)}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer"
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

          return (
            <div
              key={step.step}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen ? 'bg-slate-50/80 border-slate-300 shadow-xs' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleStep(idx)}
                className="w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`px-2 py-1 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      isOpen
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <InlineMath math={`n=${idx}`} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-black text-slate-900 block truncate flex items-center gap-1.5 flex-wrap">
                      <span>Iteración</span>
                      <InlineMath math={`n = ${idx}`} />
                      <span>: de</span>
                      <InlineMath math={`${x_var}_{${idx}} = ${step.xn}`} />
                      <span>a</span>
                      <InlineMath math={`${x_var}_{${idx + 1}} = ${(step.xn + h).toFixed(4)}`} />
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 block truncate flex items-center gap-1.5 flex-wrap">
                      <InlineMath math={`${y_var}_{${idx + 1}} \\approx ${step.yn_plus_1}`} />
                      {step.error_abs !== undefined && step.error_abs !== null && (
                        <span className="ml-2 text-emerald-600 font-medium flex items-center gap-1">
                          <span>(Error:</span>
                          <InlineMath math={`E = ${step.error_abs.toFixed(5)}`} />
                          <span>)</span>
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isLast && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
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
                <div className="p-4 pt-0 border-t border-slate-200/60 mt-1 space-y-4 text-xs">
                  {/* Puntos y derivadas evaluadas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Estado Actual (Punto de Partida)
                      </span>
                      <div className="font-mono text-slate-800 font-medium space-y-1">
                        <div>
                          <InlineMath math={`${x_var}_{${idx}} = ${step.xn}`} />
                        </div>
                        <div>
                          <InlineMath math={`${y_var}_{${idx}} = ${step.yn}`} />
                        </div>
                        <div className="flex items-center gap-1">
                          <span>Paso</span>
                          <InlineMath math={`h = ${h}`} />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                        <span>Derivadas Evaluadas en</span>
                        <InlineMath math={`(${x_var}_{${idx}}, ${y_var}_{${idx}})`} />
                      </span>
                      <div className="space-y-1 font-mono text-slate-800">
                        {step.derivatives_values.map((val, dIdx) => (
                          <div key={dIdx} className="flex items-center justify-between">
                            <span className="text-slate-600">
                              <InlineMath math={`${derivatives[dIdx]?.order_label || "y'"} = ${derivatives[dIdx]?.latex}`} />:
                            </span>
                            <span className="font-bold text-slate-900">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sustitución en Ordenada Genérica */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Sustitución en la Ordenada Genérica
                    </span>
                    <div className="overflow-x-auto py-1">
                      <InlineMath math={step.explanation_latex} block={true} className="text-slate-900 font-bold" />
                    </div>
                  </div>

                  {/* Interpretación pedagógica estilo Cátedra */}
                  <div className="bg-blue-50/60 border border-blue-200/70 p-3.5 rounded-xl text-blue-950 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-blue-900 text-[11px] uppercase tracking-wider">
                      <span>Interpretación Cátedra UTN FRLP</span>
                    </div>
                    <div className="leading-relaxed whitespace-pre-line text-blue-900/90 text-[11px] sm:text-xs">
                      <MathText text={step.explanation_text} />
                    </div>
                  </div>

                  {/* Comparación con Exacta si existe */}
                  {step.y_exact !== undefined && step.y_exact !== null && (
                    <div className="flex items-center justify-between p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-950 flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-emerald-900">
                          Solución Exacta en <InlineMath math={`${x_var} = ${(step.xn + h).toFixed(4)}`} />:
                        </span>{' '}
                        <span className="font-mono font-bold">{step.y_exact}</span>
                      </div>
                      <div className="text-right font-medium text-emerald-800 flex items-center gap-1.5">
                        <span>Error Abs:</span>
                        <InlineMath math={`E = ${step.error_abs}`} />
                        {step.error_rel !== undefined && step.error_rel !== null && (
                          <span className="ml-1.5">({step.error_rel.toFixed(3)}%)</span>
                        )}
                      </div>
                    </div>
                  )}
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
