import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface FormulaDisplayProps {
  label?: string;
  formula: string;
  className?: string;
}

const FormulaDisplay = ({ label, formula, className = '' }: FormulaDisplayProps) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      let cleanFormula = formula
        .replace(/\*\*/g, '^')
        .replace(/\*/g, ' ')
        .replace(/exp\(([^)]+)\)/g, 'e^{$1}');

      // If label is purely mathematical (functions or Fourier coefficients), prefix it nicely
      let mathToRender = cleanFormula;
      const mathPrefixes = [
        'f(x)',
        "f'(x)",
        'g(x)',
        "g'(x)",
        'y',
        'L_n(x)',
        'a_0',
        'a_n',
        'b_n',
        'c_n',
        'A_0',
        'A_n',
        'B_n',
      ];
      if (label && mathPrefixes.includes(label.trim())) {
        if (
          !cleanFormula.startsWith(label) &&
          !cleanFormula.startsWith(`${label} =`) &&
          !cleanFormula.startsWith(`${label}=`)
        ) {
          mathToRender = `${label} = ${cleanFormula}`;
        }
      }

      katex.render(mathToRender, containerRef.current, {
        throwOnError: false,
        displayMode: true,
      });
    }
  }, [label, formula]);

  useEffect(() => {
    if (labelRef.current && label) {
      katex.render(label, labelRef.current, {
        throwOnError: false,
        displayMode: false,
      });
    }
  }, [label]);

  const trimmedLabel = label?.trim() || '';
  const isFunctionLabel = ['f(x)', "f'(x)", 'g(x)', "g'(x)", 'y', 'L_n(x)'].includes(trimmedLabel);
  const isFourierCoeff = ['a_0', 'a_n', 'b_n', 'c_n', 'A_0', 'A_n', 'B_n'].includes(trimmedLabel);

  return (
    <div className={`p-3 sm:p-4 bg-slate-50/80 rounded-2xl w-full border border-slate-200 flex flex-col relative overflow-hidden ${className}`}>
      {trimmedLabel && !isFunctionLabel && (
        <div className="self-start mb-2 flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          {isFourierCoeff && (
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Coeficiente
            </span>
          )}
          <span ref={labelRef} className="text-xs font-bold text-slate-800"></span>
        </div>
      )}
      <div className="w-full overflow-x-auto touch-pan-x py-1 scrollbar-thin [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="min-w-full w-max flex justify-center [justify-content:safe_center] px-1">
          <span ref={containerRef} className="text-base sm:text-lg text-slate-900 font-medium whitespace-nowrap [&_.katex-display]:my-0 [&_.katex-display]:inline-block [&_.katex]:inline-block"></span>
        </div>
      </div>
    </div>
  );
};

export default FormulaDisplay;
