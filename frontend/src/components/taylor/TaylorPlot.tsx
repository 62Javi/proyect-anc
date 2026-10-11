import React, { useState, useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ZoomIn, ZoomOut, RotateCcw, LineChart as ChartIcon } from 'lucide-react';
import type { TaylorResponse } from '../../types/taylor';
import InlineMath from '../InlineMath';

interface TaylorPlotProps {
  result: TaylorResponse;
}

export const TaylorPlot: React.FC<TaylorPlotProps> = ({ result }) => {
  const [showExact, setShowExact] = useState<boolean>(true);
  const [showEuler, setShowEuler] = useState<boolean>(false);
  const [showHeun, setShowHeun] = useState<boolean>(false);
  const [showRK2, setShowRK2] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'trajectory' | 'error'>('trajectory');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const { plot_data, comparison_methods, order, x_var, y_var, has_exact_solution } = result;

  // Combinar datos en una lista unificada ordenada por x
  const chartData = useMemo(() => {
    const map = new Map<number, any>();

    // 1. Puntos discretos de Taylor
    plot_data.discrete_points.forEach((p) => {
      const key = Number(p.x.toFixed(4));
      if (!map.has(key)) map.set(key, { x: key });
      const entry = map.get(key);
      entry.taylor_scatter = p.y;
      entry.taylor_line = p.y;
      entry.step = p.step;
    });

    // 2. Solución exacta densa
    if (plot_data.exact_x && plot_data.exact_y) {
      plot_data.exact_x.forEach((ex, idx) => {
        const key = Number(ex.toFixed(4));
        if (!map.has(key)) map.set(key, { x: key });
        map.get(key).exact_line = plot_data.exact_y![idx];
      });
    }

    // 3. Métodos comparativos
    comparison_methods.forEach((m) => {
      m.points_x.forEach((cx, idx) => {
        const key = Number(cx.toFixed(4));
        if (!map.has(key)) map.set(key, { x: key });
        const entry = map.get(key);
        if (m.name.includes('Euler (Taylor Ord 1)')) {
          entry.euler_line = m.points_y[idx];
        } else if (m.name.includes('Euler Mejorado')) {
          entry.heun_line = m.points_y[idx];
        } else if (m.name.includes('Runge-Kutta 2')) {
          entry.rk2_line = m.points_y[idx];
        }
      });
    });

    // 4. Datos de error
    result.steps.forEach((s) => {
      const key = Number(s.xn.toFixed(4));
      if (map.has(key) && s.error_abs !== undefined && s.error_abs !== null) {
        map.get(key).error_abs = s.error_abs;
      }
    });

    return Array.from(map.values()).sort((a, b) => a.x - b.x);
  }, [plot_data, comparison_methods, result.steps]);

  // Rangos de visualización
  const { xDomain, yDomain } = useMemo(() => {
    if (chartData.length === 0) return { xDomain: [0, 1], yDomain: [0, 1] };
    const xs = chartData.map((d) => d.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const spanX = Math.max(0.1, maxX - minX);

    let ys: number[] = [];
    chartData.forEach((d) => {
      if (d.taylor_line !== undefined) ys.push(d.taylor_line);
      if (showExact && d.exact_line !== undefined) ys.push(d.exact_line);
      if (showEuler && d.euler_line !== undefined) ys.push(d.euler_line);
      if (showHeun && d.heun_line !== undefined) ys.push(d.heun_line);
      if (showRK2 && d.rk2_line !== undefined) ys.push(d.rk2_line);
    });

    if (ys.length === 0) ys = [0, 1];
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const spanY = Math.max(0.1, maxY - minY);

    const padX = (spanX * 0.08) / zoomLevel;
    const padY = (spanY * 0.1) / zoomLevel;

    return {
      xDomain: [Number((minX - padX).toFixed(3)), Number((maxX + padX).toFixed(3))],
      yDomain: [Number((minY - padY).toFixed(3)), Number((maxY + padY).toFixed(3))],
    };
  }, [chartData, showExact, showEuler, showHeun, showRK2, zoomLevel]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-slate-100 rounded-lg text-slate-800">
              <ChartIcon size={16} />
            </span>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Gráfico de Trayectoria & Comparativa
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Evolución de {y_var}({x_var}) por Taylor de orden {order} frente a la solución real.
          </p>
        </div>

        {/* View Mode Toggle and Zoom */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => setViewMode('trajectory')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'trajectory' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Trayectoria
            </button>
            {has_exact_solution && (
              <button
                onClick={() => setViewMode('error')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'error' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Error Absoluto
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z * 1.3, 3))}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white transition-colors cursor-pointer"
              title="Acercar zoom"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z / 1.3, 0.7))}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white transition-colors cursor-pointer"
              title="Alejar zoom"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white transition-colors cursor-pointer"
              title="Restablecer vista"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Layer Toggles */}
      {viewMode === 'trajectory' && (
        <div className="flex items-center gap-2 flex-wrap text-xs font-semibold">
          <span className="text-slate-400 text-[11px] uppercase tracking-wider font-bold mr-1">
            Capas:
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 text-white text-[11px]">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            Taylor (Orden {order})
          </span>

          {has_exact_solution && (
            <button
              onClick={() => setShowExact(!showExact)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all cursor-pointer text-[11px] ${
                showExact
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Solución Exacta
            </button>
          )}

          <button
            onClick={() => setShowEuler(!showEuler)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all cursor-pointer text-[11px] ${
              showEuler
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Euler (Ord 1)
          </button>

          <button
            onClick={() => setShowHeun(!showHeun)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all cursor-pointer text-[11px] ${
              showHeun
                ? 'bg-purple-50 border-purple-300 text-purple-800'
                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Euler Mejorado
          </button>

          <button
            onClick={() => setShowRK2(!showRK2)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all cursor-pointer text-[11px] ${
              showRK2
                ? 'bg-rose-50 border-rose-300 text-rose-800'
                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Runge-Kutta 2
          </button>
        </div>
      )}

      {/* Chart Canvas */}
      <div className="w-full h-72 sm:h-88">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'trajectory' ? (
            <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="x"
                type="number"
                domain={xDomain}
                tickFormatter={(v) => Number(v).toFixed(2)}
                tick={{ fontSize: 11, fill: '#64748b' }}
                name={x_var}
              />
              <YAxis
                domain={yDomain}
                tickFormatter={(v) => Number(v).toFixed(2)}
                tick={{ fontSize: 11, fill: '#64748b' }}
                name={y_var}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900/95 backdrop-blur-sm text-white p-3 rounded-2xl shadow-xl text-xs space-y-1.5 border border-slate-800">
                        <p className="font-bold text-slate-300 border-b border-slate-800 pb-1">
                          {x_var} = {Number(label).toFixed(4)}
                        </p>
                        {payload.map((entry, idx) => {
                          if (entry.value === undefined || entry.value === null) return null;
                          return (
                            <div key={idx} className="flex items-center justify-between gap-4">
                              <span style={{ color: entry.color }} className="font-medium">
                                {entry.name}:
                              </span>
                              <span className="font-mono font-bold">
                                {Number(entry.value).toFixed(5)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} iconSize={10} wrapperStyle={{ fontSize: 11 }} />

              {/* Curva continua exacta */}
              {showExact && has_exact_solution && (
                <Line
                  type="monotone"
                  dataKey="exact_line"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  name="Solución Exacta"
                  connectNulls
                />
              )}

              {/* Euler */}
              {showEuler && (
                <Line
                  type="monotone"
                  dataKey="euler_line"
                  stroke="#f59e0b"
                  strokeWidth={1.8}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#f59e0b' }}
                  name="Euler (Ord 1)"
                  connectNulls
                />
              )}

              {/* Heun */}
              {showHeun && (
                <Line
                  type="monotone"
                  dataKey="heun_line"
                  stroke="#a855f7"
                  strokeWidth={1.8}
                  strokeDasharray="3 3"
                  dot={{ r: 3, fill: '#a855f7' }}
                  name="Euler Mejorado"
                  connectNulls
                />
              )}

              {/* RK2 */}
              {showRK2 && (
                <Line
                  type="monotone"
                  dataKey="rk2_line"
                  stroke="#f43f5e"
                  strokeWidth={1.8}
                  dot={{ r: 3, fill: '#f43f5e' }}
                  name="Runge-Kutta 2"
                  connectNulls
                />
              )}

              {/* Curva de Taylor */}
              <Line
                type="linear"
                dataKey="taylor_line"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={false}
                name={`Taylor (Orden ${order})`}
                connectNulls
              />

              {/* Puntos discretos de Taylor */}
              <Scatter
                dataKey="taylor_scatter"
                fill="#1e40af"
                stroke="#ffffff"
                strokeWidth={2}
                name="Iteraciones (xn, yn)"
              />
            </ComposedChart>
          ) : (
            <ComposedChart data={chartData.filter((d) => d.error_abs !== undefined)} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="x"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(v) => Number(v).toFixed(2)}
              />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900/95 text-white p-3 rounded-2xl shadow-xl text-xs space-y-1">
                        <p className="font-bold text-slate-300">x = {Number(label).toFixed(4)}</p>
                        <p className="font-mono text-rose-400">
                          Error Absoluto: {Number(payload[0].value).toExponential(4)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="error_abs"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4, fill: '#ef4444' }}
                name="Error Absoluto"
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer Info Pill */}
      {has_exact_solution && result.exact_solution_latex && (
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Solución Analítica Cerrada:</span>
            <InlineMath math={result.exact_solution_latex} className="text-slate-900 font-bold" />
          </div>
          {result.final_error_rel !== undefined && result.final_error_rel !== null && (
            <div className="text-slate-500 font-medium">
              Error Relativo Final: <span className="font-bold text-slate-900">{result.final_error_rel.toFixed(3)}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaylorPlot;
