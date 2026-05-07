import { useState, useRef, useCallback, memo } from 'react';
import { calculateFourier } from '../services/api';
import type { FourierResponse, FunctionInterval } from '../services/api';
import FourierChart from '../components/FourierChart';
import FormulaDisplay from '../components/FormulaDisplay';
import UnifiedMathInput from '../components/UnifiedMathInput';
import { Calculator, Trash2, Activity, Sliders, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

interface FunctionWithId extends FunctionInterval {
  id: string;
}

const IntervalItem = memo(({ 
  fn, 
  idx, 
  onRemove, 
  onUpdate,
  isRemovable 
}: { 
  fn: FunctionWithId; 
  idx: number; 
  onRemove: (id: string) => void; 
  onUpdate: (id: string, field: keyof FunctionInterval, value: string | number) => void;
  isRemovable: boolean;
}) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-[24px] p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full">Tramo {idx + 1}</span>
        {isRemovable && (
          <button onClick={() => onRemove(fn.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
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
              .replace(/π/g, 'pi')
              .replace(/\\ /g, ' ');
            onUpdate(fn.id, 'expression', pyExpr);
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Desde (x)</label>
          <UnifiedMathInput 
            value={fn.start}
            hideMenu={true}
            onChange={(_, ascii) => {
              const pyExpr = ascii
                .replace(/·/g, '*')
                .replace(/÷/g, '/')
                .replace(/π/g, 'pi')
                .replace(/\\ /g, ' ');
              onUpdate(fn.id, 'start', pyExpr);
            }}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Hasta (x)</label>
          <UnifiedMathInput 
            value={fn.end}
            hideMenu={true}
            onChange={(_, ascii) => {
              const pyExpr = ascii
                .replace(/·/g, '*')
                .replace(/÷/g, '/')
                .replace(/π/g, 'pi')
                .replace(/\\ /g, ' ');
              onUpdate(fn.id, 'end', pyExpr);
            }}
          />
        </div>
      </div>
    </div>
  );
});

IntervalItem.displayName = 'IntervalItem';

function FourierPage() {
  const [functions, setFunctions] = useState<FunctionWithId[]>([
    { id: crypto.randomUUID(), expression: 'x', start: '-1', end: '1' },
  ]);
  const [harmonics, setHarmonics] = useState(10);
  const [points, setPoints] = useState(1000);
  const [periods, setPeriods] = useState(1);
  const [convPoints, setConvPoints] = useState<number[]>([0, 1, 1.5, 2]);
  const [newPoint, setNewPoint] = useState('');
  const [result, setResult] = useState<FourierResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [intervalsOpen, setIntervalsOpen] = useState(true);
  const [configOpen, setConfigOpen] = useState(false);
  const [visibleHarmonics, setVisibleHarmonics] = useState(1);
  const mainRef = useRef<HTMLElement>(null);

  const resetAll = () => {
    setFunctions([{ id: crypto.randomUUID(), expression: 'x', start: '-1', end: '1' }]);
    setHarmonics(10);
    setPoints(1000);
    setPeriods(1);
    setConvPoints([0, 1, 1.5, 2]);
    setResult(null);
    setError(null);
  };

  const handleUpdate = useCallback((id: string, field: keyof FunctionInterval, value: string | number) => {
    setFunctions(prev => prev.map(fn => 
      fn.id === id ? { ...fn, [field]: value } : fn
    ));
  }, []);

  const onCalculate = async () => {
    setLoading(true);
    setProgress(0);
    setError(null);
    setResult(null);

    // Animación de alta fidelidad que simula las etapas reales
    const stages = [
      { name: 'Simetría', start: 0, end: 15, duration: 200 },
      { name: 'Coeficientes', start: 15, end: 50, duration: 1200 },
      { name: 'Gráfica', start: 50, end: 85, duration: 800 },
      { name: 'Dirichlet', start: 85, end: 95, duration: 400 }
    ];

    let currentStage = 0;
    const animInterval = setInterval(() => {
      if (currentStage < stages.length) {
        const stage = stages[currentStage];
        setProgress(prev => {
          if (prev < stage.end) return prev + 1;
          currentStage++;
          return prev;
        });
      }
    }, 50);

    try {
      const apiFunctions = functions.map(({ id, ...rest }) => ({
        expression: rest.expression,
        start: String(rest.start),
        end: String(rest.end)
      }));

      let finalPoints = [...convPoints];
      const val = parseFloat(newPoint);
      if (!isNaN(val)) {
        finalPoints = [...new Set([...finalPoints, val])];
        setConvPoints(finalPoints);
        setNewPoint('');
      }

      const payload = { 
        functions: apiFunctions, 
        harmonics: Number(harmonics), 
        points: Number(points), 
        periods: Number(periods),
        convergence_points: finalPoints.map(p => Number(p))
      };

      const data = await calculateFourier(payload);
      
      clearInterval(animInterval);
      setProgress(100);
      setResult(data);
      
      setTimeout(() => {
        mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setLoading(false);
      }, 300);
    } catch (err) {
      clearInterval(animInterval);
      setError(err instanceof Error ? err.message : 'Calculation failed');
      setLoading(false);
    }
  };

  const addInterval = useCallback(() => {
    setFunctions(prev => [...prev, { 
      id: crypto.randomUUID(), 
      expression: '', 
      start: '', 
      end: ''
    }]);
  }, []);

  const removeInterval = useCallback((id: string) => {
    setFunctions(prev => {
      if (prev.length > 1) {
        return prev.filter(fn => fn.id !== id);
      }
      return prev;
    });
  }, []);

  return (
    <div className="flex flex-col lg:flex-row bg-slate-50 min-h-full">
      <aside className="w-full lg:w-[420px] bg-white border-b lg:border-r border-slate-200 p-6 flex flex-col gap-6 shrink-0 relative z-20 lg:h-full lg:overflow-y-auto lg:sticky lg:top-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
              <Calculator className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Fourier Analyzer</h1>
          </div>
          <button 
            onClick={resetAll}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
            title="Reiniciar"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <button 
              onClick={() => setIntervalsOpen(!intervalsOpen)}
              className="flex items-center justify-between w-full text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group"
            >
              Intervalos de Función
              {intervalsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            
            {intervalsOpen && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-6">
                  {functions.map((fn, idx) => (
                    <IntervalItem 
                      key={fn.id}
                      fn={fn}
                      idx={idx}
                      isRemovable={functions.length > 1}
                      onRemove={removeInterval}
                      onUpdate={handleUpdate}
                    />
                  ))}
                </div>
                
                <button 
                  onClick={addInterval}
                  className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-white hover:bg-indigo-50 rounded-xl border-2 border-dashed border-indigo-100 transition-all"
                >
                  + Añadir Tramo
                </button>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-900 rounded-[32px] text-white shadow-xl shadow-slate-200 overflow-hidden">
            <button 
              onClick={() => setConfigOpen(!configOpen)}
              className="flex items-center justify-between w-full mb-0 group"
            >
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Configuración</span>
              </div>
              {configOpen ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
            </button>

            {configOpen && (
              <div className="space-y-6 mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
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
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Periodos a Mostrar</label>
                    <span className="text-lg font-black text-indigo-400">{periods}</span>
                  </div>
                  <input
                    type="range" min="1" max="5"
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    value={periods}
                    onChange={(e) => setPeriods(parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Puntos de Muestreo (Máx. 1000)</label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-indigo-500 transition-all"
                    value={points}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (isNaN(val)) setPoints(0);
                      else setPoints(Math.min(1000, val));
                    }}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Puntos de Convergencia (Dirichlet)</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="number"
                      step="any"
                      placeholder="Valor de x"
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
                      value={newPoint}
                      onChange={(e) => setNewPoint(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = parseFloat(newPoint);
                          if (!isNaN(val)) {
                            setConvPoints(prev => [...new Set([...prev, val])]);
                            setNewPoint('');
                          }
                        }
                      }}
                    />
                    <button 
                      onClick={() => {
                        const val = parseFloat(newPoint);
                        if (!isNaN(val)) {
                          setConvPoints(prev => [...new Set([...prev, val])]);
                          setNewPoint('');
                        }
                      }}
                      className="px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-[10px] uppercase"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {convPoints.map((p, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-700 rounded-lg text-[10px] font-bold text-indigo-300 flex items-center gap-2">
                        x={p}
                        <button onClick={() => setConvPoints(prev => prev.filter(v => v !== p))} className="hover:text-red-400 text-slate-500 text-xs">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
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

      <main ref={mainRef} className="flex-1 p-4 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {loading && (
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={16} className="text-indigo-600 animate-pulse" />
                    Procesando Análisis
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Calculando coeficientes y convergencia...
                  </p>
                </div>
                <span className="text-xl font-black text-indigo-600 tabular-nums">
                  {Math.round(progress)}%
                </span>
              </div>
              
              <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-1">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] skew-x-[-20deg] w-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {['Simetría', 'Coeficientes', 'Gráfica', 'Dirichlet'].map((step, i) => {
                  const stepProgress = (i + 1) * 25;
                  const isDone = progress >= stepProgress;
                  const isCurrent = progress >= stepProgress - 25 && progress < stepProgress;
                  
                  return (
                    <div key={step} className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                      isDone ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 
                      isCurrent ? 'bg-white border-indigo-200 text-slate-600 animate-pulse' :
                      'bg-slate-50 border-slate-100 text-slate-300'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${isDone ? 'bg-indigo-600' : isCurrent ? 'bg-indigo-400' : 'bg-slate-200'}`} />
                      <span className="text-[9px] font-black uppercase tracking-widest">{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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

          {result?.harmonics && result.harmonics.length > 0 && (
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8 animate-in slide-in-from-bottom-4 duration-700 delay-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-4">
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Activity size={14} className="text-indigo-400" />
                  Tabla de Armónicos
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Mostrar:</label>
                  <input
                    type="range"
                    min="1"
                    max={result.harmonics.length}
                    value={Math.min(visibleHarmonics, result.harmonics.length)}
                    onChange={(e) => setVisibleHarmonics(parseInt(e.target.value))}
                    className="w-24 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <span className="text-xs font-black text-indigo-600 w-6 tabular-nums">{Math.min(visibleHarmonics, result.harmonics.length)}</span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase">n</th>
                      <th className="text-right px-4 py-3 text-[10px] font-black text-slate-400 uppercase">a<sub className="text-[8px] lowercase">n</sub></th>
                      <th className="text-right px-4 py-3 text-[10px] font-black text-slate-400 uppercase">b<sub className="text-[8px] lowercase">n</sub></th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.harmonics.slice(0, visibleHarmonics).map((harmonic, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                        <td className="px-4 py-3 text-sm font-bold text-slate-900">{harmonic.n}</td>
                        <td className="px-4 py-3 text-right text-sm font-bold text-indigo-600">{harmonic.an.toFixed(6)}</td>
                        <td className="px-4 py-3 text-right text-sm font-bold text-indigo-600">{harmonic.bn.toFixed(6)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8 animate-in slide-in-from-bottom-4 duration-700 delay-150">
            <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-indigo-400" />
                Teorema de Dirichlet (Convergencia)
              </div>
              {result?.convergence_results && result.convergence_results.length > 0 && (
                <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[9px] font-black">
                  {result.convergence_results.length} Puntos Analizados
                </span>
              )}
            </div>

            {result?.convergence_results && result.convergence_results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {result.convergence_results.map((res, i) => (
                  <div key={i} className="bg-slate-50 p-6 rounded-[24px] border border-slate-100 shadow-sm hover:border-indigo-200 transition-all">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Convergencia en x = {res.x}</div>
                      <div className="px-2 py-1 bg-white rounded-lg border border-slate-100 text-[10px] font-bold text-slate-400">Dirichlet</div>
                    </div>
                    <div className="space-y-4">
                      <div className="text-3xl font-black text-slate-900 tracking-tighter">
                        {Number(res.value).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                      </div>
                      <div className="pt-4 border-t border-slate-200/50">
                        <FormulaDisplay label="" formula={res.formula} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-50 rounded-[24px]">
                <Calculator size={32} className="opacity-20 mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Añade puntos en el panel lateral para ver la convergencia</p>
              </div>
            )}
          </div>

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
