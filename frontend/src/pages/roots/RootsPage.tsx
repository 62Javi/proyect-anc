import React, { useState } from 'react';
import { Calculator, BookOpen, FileCheck2, Printer } from 'lucide-react';
import InteractiveSolver from './InteractiveSolver';
import TheorySection from './TheorySection';
import ExercisesSection from './ExercisesSection';
import { useAppPrint } from '../../hooks/useAppPrint';
import type { SolverConfig } from '../../types/roots';

export const RootsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'solver' | 'theory' | 'exercises'>('solver');
  
  // Reemplazamos 'any' por SolverConfig | undefined
  const [solverConfig, setSolverConfig] = useState<SolverConfig | undefined>(undefined);

  // Instanciamos el hook reutilizable para la simulación
  const { printRef: printSolverRef, handlePrint: handlePrintSolver } = 
    useAppPrint('Simulacion-Analisis-Numerico');

  // Tipamos el parámetro de entrada explícitamente
  const handleLoadExerciseOrCase = (config: SolverConfig) => {
    setSolverConfig(config);
    setActiveTab('solver');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-full bg-slate-50/50 p-4 sm:p-8 lg:p-12 flex flex-col">
      {/* Header Banner */}
      <div className="max-w-5xl mx-auto w-full space-y-6 mb-8 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Análisis Numérico
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Método de Newton & Punto Fijo
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-2xl font-medium">
              Cálculo de raíces para ecuaciones no lineales continuas.
            </p>
          </div>

          {activeTab === 'solver' && (
            <button
              onClick={() => handlePrintSolver()}
              className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer self-start sm:self-auto shrink-0"
            >
              <Printer size={16} />
              <span>Imprimir Simulación PDF</span>
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-200/70 rounded-2xl border border-slate-200 no-scrollbar">
          <button
            onClick={() => setActiveTab('solver')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'solver' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator size={18} /> Simulador Interactivo
          </button>
          <button
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'theory' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen size={18} /> Teoría & Teoremas
          </button>
          <button
            onClick={() => setActiveTab('exercises')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'exercises' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck2 size={18} /> Ejercicios Resueltos (TP2)
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="max-w-5xl mx-auto w-full flex-1">
        {activeTab === 'solver' && (
          <div ref={printSolverRef}>
            <InteractiveSolver initialConfig={solverConfig} />
          </div>
        )}
        {activeTab === 'theory' && <TheorySection />}
        {activeTab === 'exercises' && (
          <ExercisesSection onLoadExercise={handleLoadExerciseOrCase} />
        )}
      </div>
    </div>
  );
};

export default RootsPage;