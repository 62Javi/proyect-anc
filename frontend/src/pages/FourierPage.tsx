import { useState } from 'react';
import { calculateFourier } from '../services/api';
import type { FourierResponse, FunctionInterval } from '../services/api';
import FourierChart from '../components/FourierChart';
import FormulaDisplay from '../components/FormulaDisplay';
import { Calculator, Plus, Trash2 } from 'lucide-react';

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
    setResult(null); // Limpiar resultado anterior para forzar re-render
    try {
      console.log('Enviando petición con:', { functions, harmonics, points });
      const data = await calculateFourier({ functions, harmonics, points });
      console.log('Datos recibidos:', data);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden bg-slate-50">
      {/* Sidebar Controls */}
      <aside className="w-full lg:w-[400px] bg-white border-b lg:border-r p-4 lg:p-8 flex flex-col gap-6 h-auto lg:h-full lg:overflow-y-auto shrink-0">
        <div className="flex items-center justify-between lg:justify-start gap-3">
          <div className="flex items-center gap-2">
            <Calculator className="text-indigo-600" size={28} />
            <h1 className="text-xl lg:text-2xl font-extrabold text-slate-800 tracking-tight">FouriAnalyzer</h1>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Intervalos</label>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold">{functions.length} DEFINIDOS</span>
            </div>
            
            <div className="space-y-3">
              {functions.map((fn, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 transition-all">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 italic">f(x)=</span>
                      <input
                        className="w-full text-sm border-none bg-white p-2 pl-10 rounded-lg focus:ring-1 focus:ring-indigo-500 shadow-sm"
                        placeholder="x**2"
                        value={fn.expression}
                        onChange={(e) => handleUpdate(idx, 'expression', e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={() => removeInterval(idx)}
                      className="p-2 text-red-400 hover:text-red-600 rounded-lg"
                      disabled={functions.length === 1}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      className="w-full border-none bg-white p-1.5 rounded-lg text-xs shadow-sm focus:ring-1 focus:ring-indigo-500"
                      value={fn.start}
                      onChange={(e) => handleUpdate(idx, 'start', parseFloat(e.target.value))}
                    />
                    <input
                      type="number"
                      className="w-full border-none bg-white p-1.5 rounded-lg text-xs shadow-sm focus:ring-1 focus:ring-indigo-500"
                      value={fn.end}
                      onChange={(e) => handleUpdate(idx, 'end', parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={addInterval}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 border border-dashed border-indigo-200 rounded-xl"
            >
              <Plus size={14} /> Añadir Intervalo
            </button>
          </div>

          <div className="p-4 bg-indigo-900 rounded-2xl text-white space-y-4 shadow-lg shadow-indigo-100">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Armónicos: {harmonics}</label>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                className="w-full h-1 bg-indigo-800 rounded-lg appearance-none cursor-pointer accent-white"
                value={harmonics}
                onChange={(e) => setHarmonics(parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-indigo-200">Puntos: {points}</label>
              <input
                type="number"
                className="w-full bg-indigo-800 border-none text-white p-2 rounded-lg font-bold text-xs"
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 lg:mt-auto pt-4 border-t lg:border-none">
          <button
            onClick={onCalculate}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black text-base hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:bg-indigo-300 transform active:scale-[0.98]"
          >
            {loading ? 'Calculando...' : 'Generar Serie'}
          </button>

          {error && (
            <div className="mt-2 p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-bold flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
              {error}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          <section className="bg-white p-2 lg:p-4 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden min-h-[300px]">
            <FourierChart data={result?.plot_data || null} />
          </section>

          {result && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in duration-500">
              <div className="bg-white p-4 rounded-2xl shadow border border-slate-100 flex flex-col items-center justify-center text-center space-y-1 md:col-span-1">
                <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Simetría</h3>
                <span className="text-xl font-black text-indigo-600">{result.symmetry}</span>
              </div>
              
              <div className="md:col-span-3 bg-white p-4 lg:p-6 rounded-2xl shadow border border-slate-100 space-y-4">
                <h3 className="text-[8px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-0.5 h-3 bg-indigo-600 rounded-full" />
                  Coeficientes
                </h3>
                
                <div className="space-y-4">
                  <div className="p-0.5 bg-slate-50 rounded-xl border border-slate-100 overflow-x-auto">
                    <FormulaDisplay label="a_0" formula={result.a0} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-0.5 bg-slate-50 rounded-xl border border-slate-100 overflow-x-auto">
                      <FormulaDisplay label="a_n" formula={result.an} />
                    </div>
                    <div className="p-0.5 bg-slate-50 rounded-xl border border-slate-100 overflow-x-auto">
                      <FormulaDisplay label="b_n" formula={result.bn} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default FourierPage;