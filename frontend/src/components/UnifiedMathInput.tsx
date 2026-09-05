import { useEffect, useRef, useState } from 'react';
import 'mathlive';
import InlineMath from './InlineMath';

interface UnifiedMathInputProps {
  value: string; // We can use this for the initial value or programmatic overrides, but not strictly bound on every keystroke
  onChange: (latex: string, ascii: string) => void;
  className?: string;
  hideMenu?: boolean;
}

const formatForMathField = (str: string) =>
  (str || '')
    .replace(/\*\*/g, '^')
    .replace(/(\d+)\s*[*·]\s*([a-zA-Z(])/g, '$1$2')
    .replace(/([a-zA-Z])\s*[*·]\s*([a-zA-Z(])/g, '$1$2');

const normalizeMath = (str: string) =>
  (str || '')
    .replace(/\*\*/g, '^')
    .replace(/·/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'pi')
    .replace(/(\d+)\s*\*\s*([a-zA-Z(])/g, '$1$2')
    .replace(/([a-zA-Z])\s*\*\s*([a-zA-Z(])/g, '$1$2')
    .replace(/\s+/g, '')
    .trim();

export default function UnifiedMathInput({ value, onChange, className = "", hideMenu = false }: UnifiedMathInputProps) {
  const mfRef = useRef<any>(null);
  const lastEmittedValue = useRef<string>('');
  const [currentLatex, setCurrentLatex] = useState<string>(value || '');

  useEffect(() => {
    if (mfRef.current) {
      // Force hide menu by setting the property directly
      if (hideMenu) {
        mfRef.current.menuToggleVisibility = 'hidden';
      }
      
      mfRef.current.mathVirtualKeyboardPolicy = "auto"; 
      mfRef.current.addEventListener('input', (e: any) => {
        const latex = e.target.value;
        const ascii = e.target.getValue('ascii-math');
        const sanitizedAscii = ascii.replace(/\^/g, '**');
        lastEmittedValue.current = sanitizedAscii;
        setCurrentLatex(latex);
        onChange(latex, sanitizedAscii);
      });

      // Initial programmatic value sync on mount
      if (value) {
        const formattedValue = formatForMathField(value);
        mfRef.current.setValue(formattedValue, { format: 'ascii-math' });
        setCurrentLatex(mfRef.current.value || formattedValue);
        lastEmittedValue.current = value;
      }
    }
  }, []);

  // Sync external changes (e.g. presets, exercise loader) without interfering with active user keystrokes
  useEffect(() => {
    if (mfRef.current) {
      if (hideMenu) {
        mfRef.current.menuToggleVisibility = 'hidden';
      }

      // If this incoming value originated from the user typing in this input, skip setValue to preserve cursor
      if (normalizeMath(value) === normalizeMath(lastEmittedValue.current)) {
        return;
      }

      const formattedValue = formatForMathField(value);
      mfRef.current.setValue(formattedValue, { format: 'ascii-math' });
      setCurrentLatex(mfRef.current.value || formattedValue);
      lastEmittedValue.current = value;
    }
  }, [value, hideMenu]);

  const MathField = 'math-field' as any;

  return (
    <div className={`w-full ${className}`}>
      <style>{`
        math-field[menu-toggle-visibility="hidden"]::part(menu-toggle) {
          display: none !important;
        }
        @media print {
          math-field {
            display: none !important;
          }
        }
      `}</style>
      <div className="print:hidden">
        <MathField
          ref={mfRef}
          menu-toggle-visibility={hideMenu ? "hidden" : "visible"}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            fontSize: '1.2rem',
            outline: 'none',
            backgroundColor: 'white'
          }}
        />
      </div>
      <div className="hidden print:flex items-center px-4 py-2 border border-slate-300 rounded-xl bg-white min-h-[42px]">
        <InlineMath math={currentLatex || value.replace(/\*\*/g, '^')} />
      </div>
    </div>
  );
}