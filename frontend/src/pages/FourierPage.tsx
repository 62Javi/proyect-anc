import { useState } from 'react';
import { calculateFourier } from '../services/api';
import type { FourierResponse, FunctionInterval } from '../services/api';
import FourierChart from '../components/FourierChart';
import FormulaDisplay from '../components/FormulaDisplay';
import UnifiedMathInput from '../components/UnifiedMathInput';
import { Calculator, Trash2, Activity, Sliders } from 'lucide-react';

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
      <aside className="w-full lg:w-[420px] bg-white border-b lg:border-r border-slate-200 p-6 flex flex-col gap-6 h-auto lg:h-full lg:overflow-y-auto shrink-0 relative z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
            <Calculator className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Fourier Analyzer</h1>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Intervalos de Función</label>
            </div>
            
            <div className="space-y-6">
              {functions.map((fn, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-[24px] p-5 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full">Tramo {idx + 1}</span>
                    {functions.length > 1 && (
                      <button onClick={() => removeInterval(idx)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Expresión Matemática</label>
                    <UnifiedMathInput 
                      value={fn.expression}
                      onChange={(_, ascii) => {
                        const pyExpr = ascii
                          .replace(/·/g, '*')
                          .replace(/÷/g, '/')
                          .replace(/π/g, 'pi');
                        handleUpdate(idx, 'expression', pyExpr);
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Desde (x)</label>
                      <input
                        type="number"
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-indigo-500/10 transition-all"
                        value={fn.start}
                        onChange={(e) => handleUpdate(idx, 'start', parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Hasta (x)</label>
                      <input
                        type="number"
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-indigo-500/10 transition-all"
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
              className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-white hover:bg-indigo-50 rounded-xl border-2 border-dashed border-indigo-100 transition-all"
            >
              + Añadir Tramo
            </button>
          </div>

          <div className="p-6 bg-slate-900 rounded-[32px] text-white shadow-xl shadow-slate-200">
            <div className="flex items-center gap-2 mb-6">
              <Sliders size={16} className="text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Configuración</span>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Armónicos</label>
                  <span className="text-lg font-black text-indigo-400">{harmonics}</span>
                </div>
                <input
                  type="range" min="1" max="50"
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  value={harmonics}
                  onChange={(e) => setHarmonics(parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Puntos de Muestreo</label>
                <input
                  type="number"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-indigo-500 transition-all"
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
            className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Calculando...' : 'Analizar Función'}
          </button>
          {error && <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold border border-red-100 uppercase tracking-widest leading-loose">{error}</div>}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm min-h-[400px]">
            <FourierChart data={result?.plot_data || null} />
          </div>

          {result && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-700">
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Simetría</span>
                <span className="text-2xl font-black text-indigo-600 tracking-tighter">{result.symmetry}</span>
              </div>
              <div className="md:col-span-3 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50 pb-4">Resultados Analíticos</div>
                <div className="space-y-6">
                  <FormulaDisplay label="a_0" formula={result.a0} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormulaDisplay label="a_n" formula={result.an} />
                    <FormulaDisplay label="b_n" formula={result.bn} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {!result && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-200">
              <Activity size={64} className="opacity-10 mb-6" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 text-center">Introduce una función para visualizar</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default FourierPage;
