import { useEffect, useRef } from 'react';
import 'mathlive';

// Simplified and more compatible way to bypass TS for custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

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
      mfRef.current.mathVirtualKeyboardPolicy = "manual"; // We'll trigger it ourselves or use system
      mfRef.current.addEventListener('input', (e: any) => {
        const latex = e.target.value;
        // MathLive can export to various formats. 'ascii-math' is closer to what SymPy likes
        const ascii = e.target.getValue('ascii-math');
        onChange(latex, ascii);
      });
    }
  }, []);

  // Update value from external changes if necessary
  useEffect(() => {
    if (mfRef.current && mfRef.current.value !== value) {
      mfRef.current.value = value;
    }
  }, [value]);

  return (
    <div className={`w-full ${className}`}>
      <math-field
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
      ></math-field>
    </div>
  );
}