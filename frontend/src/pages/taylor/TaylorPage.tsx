import React, { useState } from 'react';
import { Sigma, BookOpen, FileCheck2, Printer } from 'lucide-react';
import TaylorInteractiveSolver from '../../components/taylor/TaylorInteractiveSolver';
import TaylorTheorySection from '../../components/taylor/TaylorTheorySection';
import TaylorExercisesSection from '../../components/taylor/TaylorExercisesSection';
import InlineMath from '../../components/InlineMath';
import { useAppPrint } from '../../hooks/useAppPrint';
import type { TaylorPreset } from '../../types/taylor';

export const TaylorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'solver' | 'theory' | 'exercises'>('solver');
  const [selectedPreset, setSelectedPreset] = useState<TaylorPreset | undefined>(undefined);

  const { printRef, handlePrint } = useAppPrint('Simulacion-Taylor-EDO-ANC');

  const handleLoadExercise = (preset: TaylorPreset) => {
    setSelectedPreset(preset);
    setActiveTab('solver');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-full bg-slate-50/50 p-3 sm:p-6 lg:p-10 flex flex-col w-full max-w-full min-w-0 overflow-x-hidden">
      {/* Header Banner */}
      <div className="max-w-5xl mx-auto w-full space-y-6 mb-8 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                Análisis Numérico · EDO
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-900 bg-blue-100/70 px-3 py-1 rounded-full border border-blue-200">
                Grupo 1 · Tema 1
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Método de Taylor para E.D.O. (P.V.I.)
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-2xl font-medium">
              Resolución numérica de Problemas de Valor Inicial mediante series de Taylor de órdenes <InlineMath math="p=1" /> a <InlineMath math="4" />,
              derivación analítica con SymPy, ordenada genérica y ejercicios de cátedra UTN FRLP.
            </p>
          </div>

          {activeTab === 'solver' && (
            <button
              onClick={() => handlePrint()}
              className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer self-start sm:self-auto shrink-0"
            >
              <Printer size={16} />
              <span>Imprimir Simulación PDF</span>
            </button>
          )}
        </div>

        {/* 3-Tab Navigation */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-200/70 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('solver')}
            className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
              activeTab === 'solver' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sigma size={18} className="shrink-0" />
            <span className="hidden sm:inline">Simulador Interactivo</span>
            <span className="sm:hidden">Simulador</span>
          </button>

          <button
            onClick={() => setActiveTab('theory')}
            className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
              activeTab === 'theory' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen size={18} className="shrink-0" />
            <span className="hidden sm:inline">Teoría & Cátedra</span>
            <span className="sm:hidden">Teoría</span>
          </button>

          <button
            onClick={() => setActiveTab('exercises')}
            className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
              activeTab === 'exercises' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck2 size={18} className="shrink-0" />
            <span className="hidden sm:inline">Ejercicios Resueltos</span>
            <span className="sm:hidden">Ejercicios</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="max-w-5xl mx-auto w-full flex-1 min-w-0">
        <div ref={printRef}>
          {activeTab === 'solver' && (
            <TaylorInteractiveSolver initialConfig={selectedPreset} />
          )}
          {activeTab === 'theory' && <TaylorTheorySection />}
          {activeTab === 'exercises' && (
            <TaylorExercisesSection onLoadExercise={handleLoadExercise} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TaylorPage;
