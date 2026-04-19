import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface FormulaDisplayProps {
  label: string;
  formula: string;
}

const FormulaDisplay = ({ label, formula }: FormulaDisplayProps) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      katex.render(`${label} = ${formula}`, containerRef.current, {
        throwOnError: false,
        displayMode: false,
      });
    }
  }, [label, formula]);

  return (
    <div className="p-3 bg-slate-50/50 rounded-xl overflow-x-auto w-full border border-slate-100 flex items-center">
      <span ref={containerRef} className="text-lg text-indigo-900 font-medium whitespace-nowrap"></span>
    </div>
  );
};

export default FormulaDisplay;