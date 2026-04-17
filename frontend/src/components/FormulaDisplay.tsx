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
    <div className="p-4 bg-white/40 backdrop-blur-sm rounded-2xl flex items-center min-w-max">
      <span ref={containerRef} className="text-xl lg:text-2xl text-primary font-bold"></span>
    </div>
  );
};

export default FormulaDisplay;