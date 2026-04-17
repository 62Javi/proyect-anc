import { useState } from 'react';
import { calculateFourier } from '../services/api';
import type { FourierResponse, FunctionInterval } from '../services/api';
import FourierChart from '../components/FourierChart';
import FormulaDisplay from '../components/FormulaDisplay';
import { Calculator, Plus, Trash2, Activity, Sliders } from 'lucide-react';

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
    <div className="h-full flex flex-col lg:flex-row overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full lg:w-[380px] bg-white border-b lg:border-r border-slate-200 p-6 flex flex-col gap-6 h-auto lg:h-full lg:overflow-y-auto shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Calculator className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Fourier Analyzer</h1>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Intervalos</label>
            </div>
            
            <div className="space-y-4">
              {functions.map((fn, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">f(x)=</span>
                      <input
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 pl-10 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        value={fn.expression}
                        onChange={(e) => handleUpdate(idx, 'expression', e.target.value)}
                      />
                    </div>
                    {functions.length > 1 && (
                      <button onClick={() => removeInterval(idx)} className="p-2 text-slate-400 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold"
                      value={fn.start}
                      onChange={(e) => handleUpdate(idx, 'start', parseFloat(e.target.value))}
                    />
                    <input
                      type="number"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold"
                      value={fn.end}
                      onChange={(e) => handleUpdate(idx, 'end', parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={addInterval}
              className="w-full py-2.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-dashed border-indigo-200 transition-all"
            >
              + Añadir Intervalo
            </button>
          </div>

          <div className="p-5 bg-slate-900 rounded-2xl text-white space-y-5">
            <div className="flex items-center gap-2">
              <Sliders size={14} className="text-indigo-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Parámetros</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-2">Armónicos: {harmonics}</label>
                <input
                  type="range" min="1" max="50"
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  value={harmonics}
                  onChange={(e) => setHarmonics(parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Resolución</label>
                <input
                  type="number"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs font-bold text-white outline-none focus:border-indigo-500"
                  value={points}
                  onChange={(e) => setPoints(parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <button
            onClick={onCalculate}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Calculando...' : 'Generar Serie'}
          </button>
          {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold border border-red-100 uppercase tracking-wider">{error}</div>}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm min-h-[400px]">
            <FourierChart data={result?.plot_data || null} />
          </div>

          {result && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in duration-500">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Simetría</span>
                <span className="text-xl font-black text-indigo-600">{result.symmetry}</span>
              </div>
              <div className="md:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Resultados Analíticos</div>
                <div className="space-y-4">
                  <FormulaDisplay label="a_0" formula={result.a0} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormulaDisplay label="a_n" formula={result.an} />
                    <FormulaDisplay label="b_n" formula={result.bn} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {!result && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
              <Activity size={48} className="opacity-20 mb-4" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-40 text-center">Configure la función para comenzar</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default FourierPage;