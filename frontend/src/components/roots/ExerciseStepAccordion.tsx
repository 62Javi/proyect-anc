import React, { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import InlineMath from '../InlineMath';

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
      className={`text-slate-900 font-sans print:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`} 
    />
  );
};

export type StepIteration = string | { formula: string; error?: string };

interface ExerciseStepAccordionProps {
  iterations: StepIteration[];
  expectedRoot: number;
  isOpenDefault?: boolean;
  preliminarySteps?: React.ReactNode;
}

export const ExerciseStepAccordion: React.FC<ExerciseStepAccordionProps> = ({
  iterations,
  expectedRoot,
  isOpenDefault = false,
  preliminarySteps,
}) => {
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  return (
    <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-3 print:bg-white print:border-none print:p-0">
      {/* Cabecera desplegable */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left cursor-pointer select-none group print:hidden"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <span className="font-black text-slate-900 uppercase tracking-wider text-xs">
            Desarrollo Paso a Paso
          </span>
          <span className="text-[11px] font-semibold text-slate-500 font-mono bg-slate-200/70 px-2 py-0.5 rounded-full">
            {iterations.length} iteraciones
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
          <span>{isOpen ? 'Ocultar' : 'Ver'}</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Contenido desplegable con las iteraciones en LaTeX */}
      <div className={`${isOpen ? 'block' : 'hidden'} print:!block space-y-3 pt-2 border-t border-slate-200 print:border-none print:pt-0`}>
        {preliminarySteps && (
          <div className="space-y-3 pb-1">
            {preliminarySteps}
          </div>
        )}

        {iterations.map((item, idx) => {
          const formula = typeof item === 'string' ? item : item.formula;
          const error = typeof item === 'object' ? item.error : undefined;

          return (
            <div key={idx} className="space-y-1">
              <span className="text-xs font-bold text-slate-800 block">
                Iteración {idx + 1}:
              </span>
              <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-slate-200 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shadow-2xs print:overflow-visible print:shadow-none print:border-slate-200/60 print:p-2 space-y-2">
                <MathBlock math={formula} className="text-xs sm:text-sm print:text-xs print:overflow-visible" />
                {error && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-center print:pt-1">
                    <MathBlock math={error} className="text-xs sm:text-sm text-slate-700 print:text-xs print:overflow-visible" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pie del recuadro */}
      <div className="pt-3 border-t border-slate-200 flex items-center justify-end text-slate-700">
        <span className="font-sans font-bold text-slate-900 flex items-center gap-1.5">
          <CheckCircle2 size={16} /> Raíz Calculada: <InlineMath math={`r \\approx ${expectedRoot}`} />
        </span>
      </div>
    </div>
  );
};

export default ExerciseStepAccordion;
