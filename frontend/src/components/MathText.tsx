import React from 'react';
import InlineMath from './InlineMath';

interface MathTextProps {
  text?: string;
  className?: string;
}

/**
 * Renders text containing LaTeX math formulas formatted as $...$ or $$...$$.
 * Also automatically recognizes standalone tokens like S_r, S_t, r², r^2, Sy/x, Sr, St,
 * Taylor terms (x_n, y_n, y_{n+1}, x_0, y_0, x_f, h, O(h^p), etc.),
 * and unicode math variants, rendering them gracefully using KaTeX.
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

        // Auto-detect common math metrics, variables, and unicode subscripts in plain text segments
        const subParts = part.split(
          /(\bS_r\b|\bSr\b|\bS_t\b|\bSt\b|\br²\b|\br\^2\b|\bS_{y\/x}\b|\bSy\/x\b|\bxᵢ\b|\byᵢ\b|\ba₀\b|\ba₁\b|\ba₂\b|\ba₃\b|\ba₄\b|\bx₀\b|\by₀\b|\bx₁\b|\by₁\b|\bxₙ\b|\byₙ\b|\bxₙ₊₁\b|\byₙ₊₁\b|\bΔx\b|\bΔt\b|\bO\(h\^?\d*\)|\bO\(h²\b|\bO\(h³\b|\bO\(h⁴\b|\by_\{n\+1\}\b|\bx_\{n\+1\}\b|\by_n\b|\bx_n\b|\bx_0\b|\by_0\b|\bx_f\b|\by_f\b|\bt_0\b|\bt_f\b|\by'''\b|\by''\b|\by'\b)/g
        );
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
                if (sub === 'x₀' || sub === 'x_0') return <InlineMath key={j} math="x_0" />;
                if (sub === 'y₀' || sub === 'y_0') return <InlineMath key={j} math="y_0" />;
                if (sub === 'x₁' || sub === 'x_1') return <InlineMath key={j} math="x_1" />;
                if (sub === 'y₁' || sub === 'y_1') return <InlineMath key={j} math="y_1" />;
                if (sub === 'xₙ' || sub === 'x_n') return <InlineMath key={j} math="x_n" />;
                if (sub === 'yₙ' || sub === 'y_n') return <InlineMath key={j} math="y_n" />;
                if (sub === 'xₙ₊₁' || sub === 'x_{n+1}') return <InlineMath key={j} math="x_{n+1}" />;
                if (sub === 'yₙ₊₁' || sub === 'y_{n+1}') return <InlineMath key={j} math="y_{n+1}" />;
                if (sub === 'x_f') return <InlineMath key={j} math="x_f" />;
                if (sub === 'y_f') return <InlineMath key={j} math="y_f" />;
                if (sub === 't_0') return <InlineMath key={j} math="t_0" />;
                if (sub === 't_f') return <InlineMath key={j} math="t_f" />;
                if (sub === 'Δx') return <InlineMath key={j} math="\\Delta x" />;
                if (sub === 'Δt') return <InlineMath key={j} math="\\Delta t" />;
                if (sub === "y'") return <InlineMath key={j} math="y'" />;
                if (sub === "y''") return <InlineMath key={j} math="y''" />;
                if (sub === "y'''") return <InlineMath key={j} math="y'''" />;
                if (sub.startsWith('O(h')) {
                  const cleaned = sub.replace('²', '^2').replace('³', '^3').replace('⁴', '^4');
                  return <InlineMath key={j} math={cleaned} />;
                }
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
