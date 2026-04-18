import { useEffect, useRef } from 'react';
import 'mathlive';

interface UnifiedMathInputProps {
  value: string;
  onChange: (latex: string, ascii: string) => void;
  className?: string;
}

export default function UnifiedMathInput({ value, onChange, className = "" }: UnifiedMathInputProps) {
  const mfRef = useRef<any>(null);

  useEffect(() => {
    if (mfRef.current) {
      // Set initial value
      mfRef.current.value = value;
      
      // Configuration for a GeoGebra-like experience
      mfRef.current.mathVirtualKeyboardPolicy = "auto"; 
      mfRef.current.addEventListener('input', (e: any) => {
        const latex = e.target.value;
        const ascii = e.target.getValue('ascii-math');
        // Simple sanitization to ensure double asterisks for exponents which SymPy/Python likes
        const sanitizedAscii = ascii.replace(/\^/g, '**');
        onChange(latex, sanitizedAscii);
      });
    }
  }, []);

  // Update value from external changes if necessary
  useEffect(() => {
    if (mfRef.current && mfRef.current.value !== value) {
      mfRef.current.value = value;
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