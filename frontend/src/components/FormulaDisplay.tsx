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

  useEffect(() => {
    if (containerRef.current) {
      let cleanFormula = formula
        .replace(/\*\*/g, '^')
        .replace(/\*/g, ' ')
        .replace(/exp\(([^)]+)\)/g, 'e^{$1}');

      // If label is purely mathematical (like 'f(x)', 'f\'(x)', 'g(x)'), prefix it nicely
      let mathToRender = cleanFormula;
      if (label && ['f(x)', "f'(x)", 'g(x)', "g'(x)", 'y', 'L_n(x)'].includes(label.trim())) {
        if (!cleanFormula.startsWith(label)) {
          mathToRender = `${label} = ${cleanFormula}`;
        }
      }

      katex.render(mathToRender, containerRef.current, {
        throwOnError: false,
        displayMode: true,
      });
    }
  }, [label, formula]);

  const isMathLabel = label && ['f(x)', "f'(x)", 'g(x)', "g'(x)", 'y', 'L_n(x)'].includes(label.trim());

  return (
    <div className={`p-4 bg-slate-50/80 rounded-2xl overflow-x-auto w-full border border-slate-200 flex flex-col items-center justify-center ${className}`}>
      {label && !isMathLabel && (
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 self-start">
          {label}
        </span>
      )}
      <span ref={containerRef} className="text-base sm:text-lg text-slate-900 font-medium whitespace-nowrap"></span>
    </div>
  );
};

export default FormulaDisplay;
