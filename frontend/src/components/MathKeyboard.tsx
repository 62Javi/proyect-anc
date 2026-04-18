import React from 'react';

interface MathKey {
  label: string | React.ReactNode;
  value: string;
  cursorOffset?: number; // How much to move the cursor relative to the end of the inserted value. 0 means at the end.
  className?: string;
}

const keys: MathKey[] = [
  { label: 'x', value: 'x', className: 'font-serif italic text-indigo-600' },
  { label: 'π', value: 'pi', className: 'font-serif text-indigo-600' },
  { label: 'e', value: 'E', className: 'font-serif text-indigo-600' },
  { label: '+', value: '+' },
  { label: '-', value: '-' },
  { label: '*', value: '*' },
  { label: '/', value: '/' },
  { label: '^', value: '^' },
  { label: '√', value: 'sqrt()', cursorOffset: -1 },
  { label: 'sin', value: 'sin()', cursorOffset: -1 },
  { label: 'cos', value: 'cos()', cursorOffset: -1 },
  { label: 'tan', value: 'tan()', cursorOffset: -1 },
  { label: 'exp', value: 'exp()', cursorOffset: -1 },
  { label: 'log', value: 'log()', cursorOffset: -1 },
  { label: '(', value: '(' },
  { label: ')', value: ')' },
];

interface MathKeyboardProps {
  onInsert: (value: string, cursorOffset: number) => void;
  isVisible: boolean;
}

export default function MathKeyboard({ onInsert, isVisible }: MathKeyboardProps) {
  if (!isVisible) return null;

  return (
    <div className="bg-white/90 backdrop-blur-md border border-slate-200/50 p-2.5 rounded-2xl shadow-xl shadow-slate-200/50 mt-2 grid grid-cols-4 sm:grid-cols-8 gap-2 animate-in fade-in slide-in-from-top-2 duration-200 z-10 relative">
      {keys.map((key, idx) => (
        <button
          key={idx}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onInsert(key.value, key.cursorOffset || 0);
          }}
          className={`h-12 sm:h-10 min-w-[44px] flex items-center justify-center bg-white hover:bg-indigo-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:text-indigo-600 transition-all active:scale-[0.95] touch-manipulation shadow-sm ${key.className || ''}`}
        >
          {key.label}
        </button>
      ))}
    </div>
  );
}