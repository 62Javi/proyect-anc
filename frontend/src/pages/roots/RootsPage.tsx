import React, { useState } from 'react';
import {
  Calculator,
  BookOpen,
  FileCheck2,
  Printer,
} from 'lucide-react';
import InteractiveSolver from './InteractiveSolver';
import TheorySection from './TheorySection';
import ExercisesSection from './ExercisesSection';

export const RootsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'solver' | 'theory' | 'exercises'>('solver');

  const [solverConfig, setSolverConfig] = useState<{
    method: 'newton' | 'fixed-point';
    expression: string;
    x0: number;
    tolerance: number;
    maxIterations: number;
  } | undefined>(undefined);

  const handleLoadExerciseOrCase = (config: {
    method: 'newton' | 'fixed-point';
    expression: string;
    x0: number;
    tolerance: number;
    maxIterations: number;
  }) => {
    setSolverConfig(config);
    setActiveTab('solver');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  const tabs = [
    {
      id: 'solver' as const,
      label: 'Simulador Interactivo',
      icon: <Calculator size={18} />,
    },
    {
      id: 'theory' as const,
      label: 'Teoría & Teoremas',
      icon: <BookOpen size={18} />,
    },
    {
      id: 'exercises' as const,
      label: 'Ejercicios Resueltos (TP2)',
      icon: <FileCheck2 size={18} />,
    },
  ];

  return (
    <div className="min-h-full bg-slate-50/50 p-4 sm:p-8 lg:p-12 flex flex-col">
      {/* Top Banner Header */}
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
              Cálculo de raíces para ecuaciones no lineales continuas con rectas tangentes y diagramas de telaraña.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer self-start sm:self-auto"
            title="Imprimir o guardar la guía en PDF"
          >
            <Printer size={16} />
            <span>Descargar / Imprimir PDF</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-200/70 rounded-2xl border border-slate-200 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="max-w-5xl mx-auto w-full flex-1">
        {activeTab === 'solver' && (
          <InteractiveSolver initialConfig={solverConfig} />
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
