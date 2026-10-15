import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface InlineMathProps {
  math: string;
  className?: string;
  block?: boolean;
}

export const InlineMath: React.FC<InlineMathProps> = ({ math, className = '', block = false }) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (spanRef.current) {
      // Clean standard raw python notation into LaTeX if needed
      let formatted = math.replace(/\*\*/g, '^');
      // Implicit algebraic multiplication (e.g. -3*x^2*y -> -3x^2y, 2*x*y -> 2xy, (1/4)*(...) -> (1/4)(...))
      while (/([0-9a-zA-Z_)}\]])\s*\*\s*([a-zA-Z(])/.test(formatted)) {
        formatted = formatted.replace(/([0-9a-zA-Z_)}\]])\s*\*\s*([a-zA-Z(])/g, '$1$2');
      }
      formatted = formatted
        .replace(/\*/g, ' \\cdot ')
        .replace(/(?<!\\)exp\(([^)]+)\)/g, (_m, p1) => `e^{${p1}}`)
        .replace(/(?<!\\)sin\(([^)]+)\)/g, (_m, p1) => `\\sin(${p1})`)
        .replace(/(?<!\\)cos\(([^)]+)\)/g, (_m, p1) => `\\cos(${p1})`)
        .replace(/(?<!\\)tan\(([^)]+)\)/g, (_m, p1) => `\\tan(${p1})`)
        .replace(/(?<!\\)sqrt\(([^)]+)\)/g, (_m, p1) => `\\sqrt{${p1}}`);

      try {
        katex.render(formatted, spanRef.current, {
          throwOnError: false,
          displayMode: block,
        });
      } catch (err) {
        spanRef.current.innerText = math;
      }
    }
  }, [math, block]);

  return <span ref={spanRef} className={`inline whitespace-nowrap align-baseline px-0.5 ${className}`} />;
};

export default InlineMath;
