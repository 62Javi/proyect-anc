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
          <input
            type="number"
            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-indigo-500/10 transition-all"
            value={fn.start}
            onChange={(e) => onUpdate(fn.id, 'start', parseFloat(e.target.value))}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Hasta (x)</label>
          <input
            type="number"
            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-indigo-500/10 transition-all"
            value={fn.end}
            onChange={(e) => onUpdate(fn.id, 'end', parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
});

IntervalItem.displayName = 'IntervalItem';

function FourierPage() {
  const [functions, setFunctions] = useState<FunctionWithId[]>([
    { id: crypto.randomUUID(), expression: 'x', start: -1, end: 1 },
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
...
  const onCalculate = async () => {
    setLoading(true);
    setProgress(0);
    setError(null);
    
    // Simulación de progreso suave para mejorar la percepción
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        const jump = Math.random() * 5;
        return Math.min(90, prev + jump);
      });
    }, 400);

    try {
...
      const data = await calculateFourier(payload);
      clearInterval(progressInterval);
      setProgress(100);
      setResult(data);
      setTimeout(() => {
        mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : 'Calculation failed');
    } finally {
      setLoading(false);
    }
  };
...
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
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50 pb-4 flex items-center gap-2">
                <Activity size={14} className="text-indigo-400" />
                Primeros 10 Armónicos
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase">n</th>
                      <th className="text-right px-4 py-3 text-[10px] font-black text-slate-400 uppercase">a_n</th>
                      <th className="text-right px-4 py-3 text-[10px] font-black text-slate-400 uppercase">b_n</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.harmonics.map((harmonic, i) => (
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
