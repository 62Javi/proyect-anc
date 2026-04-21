import { useEffect, useRef } from 'react';
import 'mathlive';

interface UnifiedMathInputProps {
  value: string; // We can use this for the initial value or programmatic overrides, but not strictly bound on every keystroke
  onChange: (latex: string, ascii: string) => void;
  className?: string;
}

export default function UnifiedMathInput({ value, onChange, className = "" }: UnifiedMathInputProps) {
  const mfRef = useRef<any>(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (mfRef.current) {
      // Set initial value only if empty or explicitly forced
      if (!mfRef.current.value) {
        mfRef.current.value = value;
      }
      
      mfRef.current.mathVirtualKeyboardPolicy = "auto"; 
      mfRef.current.addEventListener('input', (e: any) => {
        isInternalChange.current = true;
        const latex = e.target.value;
        const ascii = e.target.getValue('ascii-math');
        const sanitizedAscii = ascii.replace(/\^/g, '**');
        onChange(latex, sanitizedAscii);
      });
    }
  }, []);

  // Only update from external value if it wasn't an internal keystroke
  // This prevents destroying the LaTeX formatting when the parent component saves the ASCII version
  useEffect(() => {
    if (mfRef.current) {
      if (isInternalChange.current) {
        isInternalChange.current = false;
      } else if (mfRef.current.value !== value) {
        mfRef.current.value = value;
      }
    }
  }, [value]);

  const MathField = 'math-field' as any;

  return (
    <div className={`w-full ${className}`}>
      <MathField
        ref={mfRef}
        style={{
          width: '100%',
          padding: '8px',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          fontSize: '1.2rem',
          outline: 'none',
          backgroundColor: 'white'
        }}
      ></MathField>
    </div>
  );
}