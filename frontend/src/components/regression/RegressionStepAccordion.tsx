import React, { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { ChevronDown, CheckCircle2, Play } from 'lucide-react';
import type { RegressionModelType } from '../../types/regression';
import InlineMath from '../InlineMath';
import MathText from '../MathText';

interface MathBlockProps {
  math: string;
  className?: string;
}

export const MathBlock: React.FC<MathBlockProps> = ({ math, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(math, containerRef.current, {
          throwOnError: false,
          displayMode: true,
        });
      } catch (err) {
        containerRef.current.innerText = math;
      }
    }
  }, [math]);

  return (
    <div
      ref={containerRef}
      className={`text-slate-900 font-sans w-max min-w-full text-left [&_.katex-display]:text-left [&_.katex-display]:my-0.5 [&_.katex]:inline-block print:overflow-visible ${className}`}
    />
  );
};

export interface DispersionBreakdown {
  meanLatex?: string;
  stLatex?: string;
  residualTable?: {
    headers: string[];
    rows: (string | number)[][];
  };
  srLatex?: string;
  r2Latex?: string;
  rLatex?: string;
  scaleNote?: string;
}

export interface RegressionExerciseStep {
  letter: string;
  title: string;
  consigna?: string;
  modelType?: RegressionModelType;
  degree?: number;
  badge?: string;
  description?: string;
  tableData?: {
    headers: string[];
    rows: (string | number)[][];
  };
  sumsLatex?: string;
  systemLatex?: string;
  solutionLatex?: string;
  formulaLatex?: string;
  dispersionBreakdown?: DispersionBreakdown;
  metrics?: {
    r2?: number;
    sr?: number;
    st?: number;
    r?: number;
    extraNote?: string;
  };
  conclusion?: string;
}

interface RegressionStepAccordionProps {
  steps: RegressionExerciseStep[];
  isOpenDefault?: boolean;
  onLoadModel?: (modelType: RegressionModelType, degree?: number) => void;
  bestModelNotice?: string;
}

export const RegressionStepAccordion: React.FC<RegressionStepAccordionProps> = ({
  steps,
  isOpenDefault = false,
  onLoadModel,
  bestModelNotice,
}) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  return (
    <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-4 print:bg-white print:border-none print:p-0">
      {/* Cabecera Principal del Acordeón */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left cursor-pointer select-none group print:hidden"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-black text-slate-900 uppercase tracking-wider text-xs">
            Desarrollo Paso a Paso
          </span>
          <span className="text-[11px] font-semibold text-slate-600 font-mono bg-slate-200/80 px-2.5 py-0.5 rounded-full">
            {steps.length} incisos resueltos (a - {steps[steps.length - 1]?.letter || 'f'})
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors shrink-0">
          <span>{isOpen ? 'Ocultar resolución' : 'Ver resolución detallada'}</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Contenido desplegable con todos los incisos */}
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } print:!block space-y-4 pt-3 border-t border-slate-200 print:border-none print:pt-0`}
      >
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3.5 print:border-slate-300 print:p-3"
          >
            {/* Encabezado del Inciso: Letra + Consigna */}
            <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
              <div className="flex items-start sm:items-center gap-2.5 flex-1 min-w-[200px]">
                <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center uppercase shrink-0 mt-0.5 sm:mt-0">
                  {step.letter}
                </span>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                  <MathText text={step.title} />
                </h4>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {step.badge && (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full">
                    <MathText text={step.badge} />
                  </span>
                )}
                {onLoadModel && step.modelType && (
                  <button
                    type="button"
                    onClick={() => onLoadModel(step.modelType!, step.degree)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer print:hidden"
                    title="Simular este modelo interactivo"
                  >
                    <Play size={11} />
                    <span>Simular</span>
                  </button>
                )}
              </div>
            </div>

            {/* Descripción técnica / Planteo del inciso */}
            {step.description && (
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                <MathText text={step.description} />
              </p>
            )}

            {/* Tabla de datos / transformaciones (si aplica) */}
            {step.tableData && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Tabla de observaciones y transformaciones:
                </span>
                <div className="overflow-x-auto touch-pan-x rounded-xl border border-slate-200 bg-slate-50/50 scrollbar-thin [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                        {step.tableData.headers.map((h, hIdx) => (
                          <th key={hIdx} className="px-3 py-2 font-bold font-mono">
                            <MathText text={h} />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {step.tableData.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-100/50">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="px-3 py-1.5 font-mono text-slate-800">
                              <MathText text={String(cell)} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sumatorias de Gauss */}
            {step.sumsLatex && (
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700 block">
                  1. Sumatorias calculadas para el sistema:
                </span>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto touch-pan-x scrollbar-thin [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                  <MathBlock math={step.sumsLatex} className="text-xs sm:text-sm" />
                </div>
              </div>
            )}

            {/* Sistema de ecuaciones normales */}
            {step.systemLatex && (
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700 block">
                  2. Sistema de ecuaciones normales y sustitución numérica:
                </span>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto touch-pan-x scrollbar-thin [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                  <MathBlock math={step.systemLatex} className="text-xs sm:text-sm" />
                </div>
              </div>
            )}

            {/* Resolución algebraica / coeficientes */}
            {step.solutionLatex && (
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700 block">
                  3. Resolución analítica de los coeficientes:
                </span>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto touch-pan-x scrollbar-thin [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                  <MathBlock math={step.solutionLatex} className="text-xs sm:text-sm" />
                </div>
              </div>
            )}

            {/* Ecuación final de ajuste */}
            {step.formulaLatex && (
              <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1 shadow-sm overflow-x-auto touch-pan-x scrollbar-thin [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-800 [&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block">
                  Ecuación ajustada obtenida:
                </span>
                <div className="text-white [&_.katex]:text-white">
                  <MathBlock math={step.formulaLatex} className="text-sm sm:text-base font-bold" />
                </div>
              </div>
            )}

            {/* 4. Cálculo de dispersión, residuos y bondad de ajuste */}
            {step.dispersionBreakdown && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">
                  4. Cálculo de dispersión (<InlineMath math="S_t" />), residuos (<InlineMath math="S_r" />) y bondad de ajuste (<InlineMath math="r^2" />):
                </span>

                {/* Cuadrado: Promedio muestral */}
                {step.dispersionBreakdown.meanLatex && (
                  <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto touch-pan-x scrollbar-thin">
                    <MathBlock math={step.dispersionBreakdown.meanLatex} className="text-xs sm:text-sm" />
                  </div>
                )}

                {/* Cuadrado: Dispersión total ST */}
                {step.dispersionBreakdown.stLatex && (
                  <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto touch-pan-x scrollbar-thin">
                    <MathBlock math={step.dispersionBreakdown.stLatex} className="text-xs sm:text-sm" />
                  </div>
                )}

                {/* Cuadrado: Residuos cuadráticos SR */}
                {step.dispersionBreakdown.srLatex && (
                  <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto touch-pan-x scrollbar-thin">
                    <MathBlock math={step.dispersionBreakdown.srLatex} className="text-xs sm:text-sm" />
                  </div>
                )}

                {/* Cuadrado: Coeficientes r² y r */}
                {step.dispersionBreakdown.r2Latex && (
                  <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto touch-pan-x scrollbar-thin">
                    <MathBlock math={step.dispersionBreakdown.r2Latex} className="text-xs sm:text-sm font-semibold" />
                  </div>
                )}

                {/* Cuadrado independiente: Tabla de residuos punto a punto */}
                {step.dispersionBreakdown.residualTable && (
                  <div className="pt-1 space-y-1">
                    <span className="text-[10.5px] font-bold text-slate-600 block font-mono">
                      Tabla de residuos punto a punto (<InlineMath math="e_i = y_i - \hat{y}_i" />):
                    </span>
                    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                      <table className="w-full text-left text-xs border-collapse font-mono">
                        <thead>
                          <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700">
                            {step.dispersionBreakdown.residualTable.headers.map((h, hIdx) => (
                              <th key={hIdx} className="px-2.5 py-1.5 font-bold">
                                <MathText text={h} />
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-800">
                          {step.dispersionBreakdown.residualTable.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="px-2.5 py-1">
                                  <MathText text={String(cell)} />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Métricas del ajuste */}
            {step.metrics && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                {step.metrics.r2 !== undefined && (
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                      <span>Coeficiente</span> <InlineMath math="r^2" />
                    </span>
                    <span className="font-mono font-black text-slate-900">
                      {step.metrics.r2.toFixed(4)}
                    </span>
                  </div>
                )}
                {step.metrics.sr !== undefined && (
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                      <InlineMath math="S_r" /> <span>(Residuos)</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {step.metrics.sr.toFixed(4)}
                    </span>
                  </div>
                )}
                {step.metrics.st !== undefined && (
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                      <InlineMath math="S_t" /> <span>(Dispersión)</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {step.metrics.st.toFixed(4)}
                    </span>
                  </div>
                )}
                {step.metrics.r !== undefined && (
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                      <span>Correlación</span> <InlineMath math="r" />
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {step.metrics.r.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Noticia / Conclusión General del Ejercicio */}
        {bestModelNotice && (
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-emerald-900">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-black text-emerald-950 block">
                Dictamen Final del Ejercicio:
              </span>
              <p className="leading-relaxed"><MathText text={bestModelNotice} /></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegressionStepAccordion;
