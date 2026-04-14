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
    <div className="p-2 bg-slate-50 border rounded-lg overflow-x-auto">
      <span ref={containerRef} className="text-lg"></span>
    </div>
  );
};

export default FormulaDisplay;
