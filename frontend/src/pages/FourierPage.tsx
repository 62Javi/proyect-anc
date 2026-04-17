import { useState } from 'react';
import { calculateFourier } from '../services/api';
import type { FourierResponse, FunctionInterval } from '../services/api';
import FourierChart from '../components/FourierChart';
import FormulaDisplay from '../components/FormulaDisplay';
import { Calculator, Plus, Trash2, Sliders, Activity } from 'lucide-react';

function FourierPage() {
  const [functions, setFunctions] = useState<FunctionInterval[]>([
    { expression: 'x', start: -1, end: 1 },
  ]);
  const [harmonics, setHarmonics] = useState(10);
  const [points, setPoints] = useState(1000);
  const [result, setResult] = useState<FourierResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addInterval = () => {
    const last = functions[functions.length - 1];
    setFunctions([...functions, { expression: '0', start: last.end, end: last.end + 1 }]);
  };

  const removeInterval = (index: number) => {
    if (functions.length > 1) {
      setFunctions(functions.filter((_, i) => i !== index));
    }
  };

  const handleUpdate = (index: number, field: keyof FunctionInterval, value: string | number) => {
    const next = [...functions];
    next[index] = { ...next[index], [field]: value } as FunctionInterval;
    setFunctions(next);
  };

  const onCalculate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await calculateFourier({ functions, harmonics, points });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden bg-background">
      {/* Sidebar Controls - Phone-First Sticky Bottom on Mobile */}
      <aside className="w-full lg:w-[400px] bg-white border-b-4 lg:border-b-0 lg:border-r-4 border-border p-4 lg:p-8 flex flex-col gap-6 h-auto lg:h-full lg:overflow-y-auto shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-xl border-2 border-primary/20">
            <Calculator className="text-primary" size={24} />
          </div>
          <h1 className="text-xl lg:text-3xl font-black text-foreground tracking-tighter uppercase font-heading">FouriAnalyzer</h1>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Intervalos</label>
              <span className="px-3 py-1 bg-indigo-50 text-primary rounded-full text-[10px] font-black border-2 border-primary/10 tracking-wider">{functions.length} DEFINIDOS</span>
            </div>
            
            <div className="space-y-4">
              {functions.map((fn, idx) => (
                <div key={idx} className="p-4 bg-white border-2 border-border rounded-3xl space-y-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] relative group animate-in zoom-in-95 duration-300">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase italic">f(x)=</span>
                      <input
                        className="w-full text-sm bg-indigo-50/30 border-2 border-transparent focus:border-primary focus:bg-white p-2 pl-12 rounded-xl outline-none transition-all font-bold text-indigo-900"
                        placeholder="x**2"
                        value={fn.expression}
                        onChange={(e) => handleUpdate(idx, 'expression', e.target.value)}
                      />
                    </div>
                    {functions.length > 1 && (
                      <button 
                        onClick={() => removeInterval(idx)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <span className="absolute -top-2 left-3 bg-white px-1 text-[8px] font-black text-slate-400 uppercase tracking-tighter">Desde</span>
                      <input
                        type="number"
                        className="w-full bg-indigo-50/30 border-2 border-transparent focus:border-primary focus:bg-white p-2 rounded-xl text-xs font-bold outline-none"
                        value={fn.start}
                        onChange={(e) => handleUpdate(idx, 'start', parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute -top-2 left-3 bg-white px-1 text-[8px] font-black text-slate-400 uppercase tracking-tighter">Hasta</span>
                      <input
                        type="number"
                        className="w-full bg-indigo-50/30 border-2 border-transparent focus:border-primary focus:bg-white p-2 rounded-xl text-xs font-bold outline-none"
                        value={fn.end}
                        onChange={(e) => handleUpdate(idx, 'end', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={addInterval}
              className="w-full flex items-center justify-center gap-2 py-3 text-xs font-black text-primary bg-indigo-50 hover:bg-indigo-100 border-2 border-dashed border-primary/30 rounded-2xl transition-all active:scale-[0.98] uppercase tracking-widest"
            >
              <Plus size={16} /> Añadir Intervalo
            </button>
          </div>

          <div className="p-6 bg-primary rounded-[32px] text-white space-y-6 shadow-lg border-b-8 border-indigo-900">
            <div className="flex items-center gap-2 mb-2">
              <Sliders size={16} className="text-indigo-200" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-100">Parámetros</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Armónicos: <span className="text-white text-base ml-1">{harmonics}</span></label>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  className="w-full h-2 bg-indigo-800 rounded-lg appearance-none cursor-pointer accent-white"
                  value={harmonics}
                  onChange={(e) => setHarmonics(parseInt(e.target.value))}
                />
              </div>

              <div className="relative">
                <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-100 mb-2">Puntos de Resolución</label>
                <input
                  type="number"
                  className="w-full bg-indigo-800/50 border-2 border-white/10 text-white p-3 rounded-2xl font-black text-sm focus:bg-indigo-800 outline-none transition-all"
                  value={points}
                  onChange={(e) => setPoints(parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 lg:mt-auto pt-4">
          <button
            onClick={onCalculate}
            disabled={loading}
            className="w-full clay-button-accent py-4 font-black text-lg uppercase tracking-tighter disabled:opacity-50 disabled:translate-y-0"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                Calculando
              </span>
            ) : 'Generar Serie'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 border-2 border-red-100 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-bounce">
              <div className="w-2 h-2 bg-red-500 rounded-full shrink-0" />
              {error}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8 pb-10">
          <section className="bg-white p-2 lg:p-4 rounded-[40px] shadow-clay border-4 border-border overflow-hidden min-h-[350px]">
            <FourierChart data={result?.plot_data || null} />
          </section>

          {result && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="bg-white p-6 rounded-[32px] border-4 border-border shadow-clay flex flex-col items-center justify-center text-center space-y-2 md:col-span-1">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Simetría</h3>
                <span className="text-2xl font-black text-primary uppercase tracking-tighter">{result.symmetry}</span>
              </div>
              
              <div className="md:col-span-3 bg-white p-6 lg:p-8 rounded-[32px] border-4 border-border shadow-clay space-y-6">
                <h3 className="text-[10px] font-black text-foreground uppercase tracking-widest flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  Coeficientes Simbólicos
                </h3>
                
                <div className="space-y-6 font-body">
                  <div className="p-1 bg-indigo-50/50 rounded-2xl border-2 border-indigo-100/50 overflow-x-auto">
                    <FormulaDisplay label="a_0" formula={result.a0} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-1 bg-indigo-50/50 rounded-2xl border-2 border-indigo-100/50 overflow-x-auto">
                      <FormulaDisplay label="a_n" formula={result.an} />
                    </div>
                    <div className="p-1 bg-indigo-50/50 rounded-2xl border-2 border-indigo-100/50 overflow-x-auto">
                      <FormulaDisplay label="b_n" formula={result.bn} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {!result && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300 space-y-4">
              <Activity size={64} className="opacity-20" />
              <p className="font-black text-xs uppercase tracking-[0.3em]">Esperando Datos...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default FourierPage;