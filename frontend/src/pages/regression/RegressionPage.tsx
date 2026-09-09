import React, { useState } from 'react';
import { Thermometer, Calculator, BookOpen, FileCheck2, Printer } from 'lucide-react';
import Case1CoolingSection from '../../components/regression/Case1CoolingSection';
import InteractiveRegressionSolver from '../../components/regression/InteractiveRegressionSolver';
import RegressionTheorySection from '../../components/regression/RegressionTheorySection';
import RegressionExercisesSection from '../../components/regression/RegressionExercisesSection';
import { useAppPrint } from '../../hooks/useAppPrint';
import type { RegressionSolverConfig } from '../../types/regression';

export const RegressionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'case1' | 'solver' | 'theory' | 'exercises'>('case1');
  const [solverConfig, setSolverConfig] = useState<RegressionSolverConfig | undefined>(undefined);

  const { printRef, handlePrint } = useAppPrint('Ajuste-Minimos-Cuadrados-ANC');

  const handleLoadExerciseOrData = (config: RegressionSolverConfig) => {
    setSolverConfig(config);
    setActiveTab('solver');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadFromCase1 = (points: { x: number; y: number }[], title: string) => {
    setSolverConfig({
      modelType: 'newton_cooling',
      points,
      title,
    });
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
              Ajuste por Mínimos Cuadrados
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-2xl font-medium">
              Estudio del Caso 1 (Enfriamiento de Bebidas), Calculadora Interactiva y Ejercicios del TP Nº4.
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

        {/* 4-Tab Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 bg-slate-200/70 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('case1')}
            className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
              activeTab === 'case1' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Thermometer size={18} className="shrink-0 text-amber-600" />
            <span>Caso 1: Enfriamiento</span>
          </button>

          <button
            onClick={() => setActiveTab('solver')}
            className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
              activeTab === 'solver' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator size={18} className="shrink-0" />
            <span>Calculadora Libre</span>
          </button>

          <button
            onClick={() => setActiveTab('theory')}
            className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${
              activeTab === 'theory' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen size={18} className="shrink-0" />
            <span>Teoría & Deducción</span>
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
      <div className="max-w-5xl mx-auto w-full flex-1">
        <div ref={printRef}>
          {activeTab === 'case1' && <Case1CoolingSection onLoadIntoSolver={handleLoadFromCase1} />}
          {activeTab === 'solver' && <InteractiveRegressionSolver initialConfig={solverConfig} />}
          {activeTab === 'theory' && <RegressionTheorySection />}
          {activeTab === 'exercises' && <RegressionExercisesSection onLoadExercise={handleLoadExerciseOrData} />}
        </div>
      </div>
    </div>
  );
};

export default RegressionPage;
