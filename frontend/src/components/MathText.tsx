import React from 'react';
import InlineMath from './InlineMath';

interface MathTextProps {
  text?: string;
  className?: string;
}

/**
 * Renders text containing LaTeX math formulas formatted as $...$ or $$...$$.
 * Also automatically recognizes standalone tokens like S_r, S_t, r², r^2, Sy/x, Sr, St
 * and renders them gracefully using KaTeX.
 */
export const MathText: React.FC<MathTextProps> = ({ text = '', className = '' }) => {
  if (!text) return null;

  // Split by explicit LaTeX blocks ($$...$$ or $...$)
  const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (!part) return null;

        if (part.startsWith('$$') && part.endsWith('$$')) {
          const math = part.slice(2, -2);
          return (
            <span key={i} className="my-1 block overflow-x-auto">
              <InlineMath math={math} block={true} />
            </span>
          );
        }

        if (part.startsWith('$') && part.endsWith('$')) {
          const math = part.slice(1, -1);
          return <InlineMath key={i} math={math} />;
        }

        // Auto-detect common math metrics in plain text segments
        const subParts = part.split(/(\bS_r\b|\bSr\b|\bS_t\b|\bSt\b|\br²\b|\br\^2\b|\bS_{y\/x}\b|\bSy\/x\b|\bxᵢ\b|\byᵢ\b|\ba₀\b|\ba₁\b|\ba₂\b|\ba₃\b|\ba₄\b)/g);
        if (subParts.length > 1) {
          return (
            <React.Fragment key={i}>
              {subParts.map((sub, j) => {
                if (sub === 'S_r' || sub === 'Sr') return <InlineMath key={j} math="S_r" />;
                if (sub === 'S_t' || sub === 'St') return <InlineMath key={j} math="S_t" />;
                if (sub === 'r²' || sub === 'r^2') return <InlineMath key={j} math="r^2" />;
                if (sub === 'Sy/x' || sub === 'S_{y/x}') return <InlineMath key={j} math="S_{y/x}" />;
                if (sub === 'xᵢ') return <InlineMath key={j} math="x_i" />;
                if (sub === 'yᵢ') return <InlineMath key={j} math="y_i" />;
                if (sub === 'a₀') return <InlineMath key={j} math="a_0" />;
                if (sub === 'a₁') return <InlineMath key={j} math="a_1" />;
                if (sub === 'a₂') return <InlineMath key={j} math="a_2" />;
                if (sub === 'a₃') return <InlineMath key={j} math="a_3" />;
                if (sub === 'a₄') return <InlineMath key={j} math="a_4" />;
                return <span key={j}>{sub}</span>;
              })}
            </React.Fragment>
          );
        }

        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

export default MathText;
