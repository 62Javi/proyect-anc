import React, { useState } from 'react';
import {
  Calculator,
  BookOpen,
  FileCheck2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Zap,
} from 'lucide-react';
import InteractiveSolver from './InteractiveSolver';
import MethodBattleSection from './MethodBattleSection';
import TheorySection from './TheorySection';
import ExercisesSection from './ExercisesSection';
import FailureCasesSection from './FailureCasesSection';
import QuizSection from './QuizSection';

export const RootsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'solver' | 'battle' | 'theory' | 'exercises' | 'failures' | 'quiz'
  >('battle');

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

  const tabs = [
    {
      id: 'battle' as const,
      label: 'Duelo en Vivo (Newton vs Punto Fijo)',
      icon: <Zap size={17} />,
    },
    {
      id: 'solver' as const,
      label: 'Simulador Interactivo',
      icon: <Calculator size={17} />,
    },
    {
      id: 'theory' as const,
      label: 'Teoría & Teoremas',
      icon: <BookOpen size={17} />,
    },
    {
      id: 'exercises' as const,
      label: 'Ejercicios TP2 (Cátedra)',
      icon: <FileCheck2 size={17} />,
    },
    {
      id: 'failures' as const,
      label: 'Casos de Fallo & Sabotaje',
      icon: <AlertTriangle size={17} />,
    },
    {
      id: 'quiz' as const,
      label: 'Dinámica de Clase (Quiz)',
      icon: <HelpCircle size={17} />,
    },
  ];

  return (
    <div className="min-h-full bg-slate-50/50 p-4 sm:p-8 lg:p-12 flex flex-col">
      {/* Top Banner Header */}
      <div className="max-w-5xl mx-auto w-full space-y-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                Grupo 1 • Análisis Numérico
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Exposición 07/09/2026
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Método de Newton & Punto Fijo
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-2xl font-medium">
              Plataforma interactiva para el cálculo de raíces no lineales, teoremas de convergencia de la cátedra, visualización geométrica de tangentes y diagramas de telaraña.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-200">
              <Sparkles size={24} />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-200/70 rounded-2xl border border-slate-200 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
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
        {activeTab === 'battle' && <MethodBattleSection />}
        {activeTab === 'solver' && (
          <InteractiveSolver initialConfig={solverConfig} />
        )}
        {activeTab === 'theory' && <TheorySection />}
        {activeTab === 'exercises' && (
          <ExercisesSection onLoadExercise={handleLoadExerciseOrCase} />
        )}
        {activeTab === 'failures' && (
          <FailureCasesSection onLoadExample={handleLoadExerciseOrCase} />
        )}
        {activeTab === 'quiz' && <QuizSection />}
      </div>
    </div>
  );
};
export default RootsPage;
