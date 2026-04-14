import { useState } from 'react';
import { calculateFourier } from './services/api';
import type { FourierResponse, FunctionInterval } from './services/api';
import FourierChart from './components/FourierChart';
import FormulaDisplay from './components/FormulaDisplay';
import { Calculator, Plus, Trash2, Sliders } from 'lucide-react';

function App() {
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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Controls */}
      <aside className="w-96 bg-white border-r p-6 flex flex-col gap-6 shadow-sm overflow-y-auto">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="text-indigo-600" size={24} />
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Análisis de Fourier</h1>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">Definición de Funciones</label>
          <div className="space-y-4">
            {functions.map((fn, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border rounded-lg space-y-2">
                <div className="flex gap-2">
                  <input
                    className="flex-1 text-sm border p-2 rounded bg-white"
                    placeholder="Expresión (e.g. x**2)"
                    value={fn.expression}
                    onChange={(e) => handleUpdate(idx, 'expression', e.target.value)}
                  />
                  <button 
                    onClick={() => removeInterval(idx)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                    disabled={functions.length === 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>De:</span>
                  <input
                    type="number"
                    className="w-full border p-1 rounded"
                    value={fn.start}
                    onChange={(e) => handleUpdate(idx, 'start', parseFloat(e.target.value))}
                  />
                  <span>Hasta:</span>
                  <input
                    type="number"
                    className="w-full border p-1 rounded"
                    value={fn.end}
                    onChange={(e) => handleUpdate(idx, 'end', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            ))}
            <button 
              onClick={addInterval}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm text-indigo-600 border border-dashed border-indigo-200 hover:border-indigo-400 rounded-lg"
            >
              <Plus size={16} /> Añadir Intervalo
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-semibold text-slate-700">Armónicos: {harmonics}</label>
              <Sliders size={16} className="text-slate-400" />
            </div>
            <input
              type="range"
              min="1"
              max="100"
              className="w-full accent-indigo-600"
              value={harmonics}
              onChange={(e) => setHarmonics(parseInt(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Densidad de puntos: {points}</label>
            <input
              type="number"
              className="w-full border p-2 rounded-lg"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value))}
            />
          </div>
        </div>

        <button
          onClick={onCalculate}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 disabled:bg-indigo-300"
        >
          {loading ? 'Calculando...' : 'Generar Serie'}
        </button>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          <section>
            <FourierChart data={result?.plot_data || null} />
          </section>

          {result && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Simetría</h3>
                <p className="text-2xl font-black text-slate-700">{result.symmetry}</p>
              </div>
              
              <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Coeficientes Analíticos</h3>
                <div className="space-y-4">
                  <FormulaDisplay label="a_0" formula={result.a0} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormulaDisplay label="a_n" formula={result.an} />
                    <FormulaDisplay label="b_n" formula={result.bn} />
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

export default App;
