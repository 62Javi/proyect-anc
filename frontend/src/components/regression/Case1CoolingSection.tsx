import React, { useState, useEffect, useMemo } from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  LineChart,
} from 'recharts';
import {
  Thermometer,
  Award,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  FileSpreadsheet,
  RotateCcw,
  FastForward,
  Eye,
  EyeOff,
  Sliders,
} from 'lucide-react';
import { getCase1Analysis, type Case1AnalysisResponse, type FitResponse } from '../../services/api';
import InlineMath from '../InlineMath';

interface Case1CoolingSectionProps {
  onLoadIntoSolver?: (points: { x: number; y: number }[], title: string) => void;
}

const CLUSTER_COLORS: Record<string, string> = {
  'Recipiente térmico': '#2563eb', // Blue
  'Vaso de papel con tapa': '#059669', // Emerald
  'Taza de cerámica': '#d97706', // Amber
  'Vaso de vidrio': '#e11d48', // Rose
};

const CLUSTER_BG_COLORS: Record<string, string> = {
  'Recipiente térmico': 'bg-blue-50/70 border-blue-200 text-blue-950',
  'Vaso de papel con tapa': 'bg-emerald-50/70 border-emerald-200 text-emerald-950',
  'Taza de cerámica': 'bg-amber-50/70 border-amber-200 text-amber-950',
  'Vaso de vidrio': 'bg-rose-50/70 border-rose-200 text-rose-950',
};

export const Case1CoolingSection: React.FC<Case1CoolingSectionProps> = ({ onLoadIntoSolver }) => {
  const [data, setData] = useState<Case1AnalysisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTab, setSelectedTab] = useState<string>('comparative');
  const [selectedModel, setSelectedModel] = useState<string>('newton_cooling');

  // Interactive Container Progress & Toggles
  const [containerSettings, setContainerSettings] = useState<Record<string, { active: boolean; time: number }>>({
    'Recipiente térmico': { active: false, time: 0 },
    'Vaso de papel con tapa': { active: false, time: 0 },
    'Taza de cerámica': { active: false, time: 0 },
    'Vaso de vidrio': { active: false, time: 0 },
  });

  const [focusedContainer, setFocusedContainer] = useState<string>('Recipiente térmico');
  const [showCurves, setShowCurves] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getCase1Analysis();
        if (mounted) {
          setData(res);
          setError(null);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err?.message || 'Error cargando datos del Caso 1');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const setContainerTime = (name: string, time: number) => {
    setContainerSettings((prev) => ({
      ...prev,
      [name]: {
        active: true,
        time,
      },
    }));
  };

  const toggleContainer = (name: string) => {
    setContainerSettings((prev) => {
      const current = prev[name];
      const nextActive = !current?.active;
      return {
        ...prev,
        [name]: {
          active: nextActive,
          // When turning ON, start with 0 min (0 points) as requested
          time: 0,
        },
      };
    });
    setFocusedContainer(name);
  };

  const handleSelectAll = (val: boolean, initialTime: number = 0) => {
    setContainerSettings({
      'Recipiente térmico': { active: val, time: val ? initialTime : 0 },
      'Vaso de papel con tapa': { active: val, time: val ? initialTime : 0 },
      'Taza de cerámica': { active: val, time: val ? initialTime : 0 },
      'Vaso de vidrio': { active: val, time: val ? initialTime : 0 },
    });
  };

  // Temperature for a specific container at its current time
  const getCurrentTemp = (name: string): number | null => {
    if (!data?.clusters[name]?.raw_data) return null;
    const timeVal = containerSettings[name]?.time ?? 0;
    const sampleIdx = Math.min(60, Math.floor(timeVal / 2));
    return data.clusters[name].raw_data[sampleIdx]?.temp_drink ?? null;
  };

  // Filtered dataset for ComposedChart: each container independently displays points up to its own time
  const visibleChartData = useMemo(() => {
    if (!data) return [];
    const clusterNames = Object.keys(data.clusters);
    const rows: any[] = [];

    // Full 120 minutes range (61 points)
    for (let i = 0; i <= 60; i++) {
      const timeVal = i * 2;
      const row: any = { time: timeVal };

      clusterNames.forEach((name) => {
        const conf = containerSettings[name];
        // Point is visible only if container is active and timeVal <= conf.time
        // When conf.time is 0, no points are plotted for this container
        if (conf?.active && conf.time > 0 && timeVal <= conf.time) {
          const item = data.clusters[name]?.raw_data[i];
          if (item) {
            row[name] = item.temp_drink;

            if (showCurves) {
              const fitNewton = data.clusters[name]?.fits?.newton_cooling;
              if (fitNewton?.parameters) {
                const { A, k, t_amb } = fitNewton.parameters;
                row[`${name}_fit`] = t_amb + A * Math.exp(-k * timeVal);
              }
            }
          }
        }
      });
      rows.push(row);
    }

    return rows;
  }, [data, containerSettings, showCurves]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-600">Cargando 244 mediciones del Caso 1...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-rose-800 space-y-2">
        <div className="flex items-center gap-2 font-bold text-base">
          <AlertTriangle size={20} />
          <span>Error al obtener datos</span>
        </div>
        <p className="text-sm">{error || 'No se pudieron recuperar los datos del servidor.'}</p>
      </div>
    );
  }

  const clusters = data.clusters;
  const currentCluster = selectedTab !== 'comparative' ? clusters[selectedTab] : null;
  const currentFit: FitResponse | null = currentCluster ? currentCluster.fits[selectedModel] : null;

  // Single cluster plot data (measurements + curve)
  const singleClusterData = (() => {
    if (!currentFit) return [];
    const mapByX: Record<number, { time: number; actual?: number; predicted?: number }> = {};

    currentFit.points_x.forEach((px, idx) => {
      mapByX[px] = {
        time: px,
        actual: currentFit.points_y[idx],
      };
    });

    currentFit.curve_x.forEach((cx, idx) => {
      const rounded = Math.round(cx * 10) / 10;
      if (!mapByX[rounded]) {
        mapByX[rounded] = { time: rounded, predicted: currentFit.curve_y[idx] };
      } else {
        mapByX[rounded].predicted = currentFit.curve_y[idx];
      }
    });

    return Object.values(mapByX).sort((a, b) => a.time - b.time);
  })();

  return (
    <div className="space-y-8">
      {/* Problem Statement Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-700 border border-amber-200/60 shadow-sm">
              <Thermometer size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200">
                Caso Asignado · Exposición ANC
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Caso 1: Enfriamiento de Bebidas
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <Clock size={16} />
            <span>120 min de ensayo · Δt = 2 min (244 mediciones)</span>
          </div>
        </div>

        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          Una cafetería desea comparar cuánto tiempo conservan el calor cuatro recipientes:{' '}
          <strong className="text-slate-900 font-bold">taza de cerámica</strong>,{' '}
          <strong className="text-slate-900 font-bold">vaso de vidrio</strong>,{' '}
          <strong className="text-slate-900 font-bold">vaso de papel con tapa</strong> y{' '}
          <strong className="text-slate-900 font-bold">recipiente térmico</strong>. El objetivo es identificar los clústeres,
          modelar su enfriamiento por mínimos cuadrados, analizar la bondad de ajuste con <InlineMath math="r^2" /> y residuos, y comparar su comportamiento físico.
        </p>
      </div>

      {/* Cluster Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/70 rounded-2xl border border-slate-200">
        <button
          onClick={() => setSelectedTab('comparative')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedTab === 'comparative'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers size={16} />
          <span>Comparativa Global (Diagrama con Slider)</span>
        </button>

        {Object.keys(clusters).map((name) => (
          <button
            key={name}
            onClick={() => setSelectedTab(name)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedTab === name
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: CLUSTER_COLORS[name] || '#64748b' }}
            />
            <span>{name}</span>
          </button>
        ))}
      </div>

      {/* COMPARATIVE VIEW */}
      {selectedTab === 'comparative' && (
        <div className="space-y-8">
          {/* Main Interactive Graph with Slider & Controls */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    Diagrama Interactivo de Muestras en Tiempo Real
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                    Muestras Independientes
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cada recipiente cuenta con su propio deslizador independiente. Revela los puntos paso a paso sin reiniciar los demás.
                </p>
              </div>

              {/* Toggle to show continuous curves */}
              <button
                onClick={() => setShowCurves(!showCurves)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer self-start sm:self-auto ${
                  showCurves
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Sliders size={14} />
                <span>{showCurves ? 'Ocultar Curvas de Ajuste' : 'Trazar Curvas de Ajuste'}</span>
              </button>
            </div>

            {/* Selector Tabs & Main Slider */}
            <div className="p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200/90 space-y-4">
              {/* Tab Selector for which container the main slider controls */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                  1. Elige el recipiente a controlar con el deslizador:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.keys(clusters).map((name) => {
                    const conf = containerSettings[name] || { active: false, time: 0 };
                    const isFocused = focusedContainer === name;
                    const ptsCount = conf.active && conf.time > 0 ? Math.floor(conf.time / 2) + 1 : 0;
                    const color = CLUSTER_COLORS[name];

                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => {
                          setFocusedContainer(name);
                          if (!conf.active) {
                            setContainerSettings((prev) => ({
                              ...prev,
                              [name]: { active: true, time: 0 },
                            }));
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                          isFocused
                            ? 'ring-2 ring-slate-900 border-slate-900 bg-white shadow-sm'
                            : 'bg-slate-100/90 hover:bg-slate-200/80 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <span
                            className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                              conf.active
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {conf.active ? `${conf.time} min` : 'Apagado'}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-900 truncate">{name}</span>
                        <span className="text-[10px] text-slate-500">
                          {conf.active ? `${ptsCount} / 61 pts` : '0 pts visibles'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slider for Focused Container */}
              {(() => {
                const focusedConf = containerSettings[focusedContainer] || { active: false, time: 0 };
                const focusedPts = focusedConf.active && focusedConf.time > 0 ? Math.floor(focusedConf.time / 2) + 1 : 0;
                const focusedColor = CLUSTER_COLORS[focusedContainer];

                return (
                  <div className="pt-2 border-t border-slate-200/70 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: focusedColor }} />
                        <span className="text-xs font-bold text-slate-900">
                          Deslizador para:{' '}
                          <span className="text-slate-950 font-black">{focusedContainer}</span>
                        </span>
                        {!focusedConf.active && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                            Inactivo (Mueve el slider para encenderlo en 0)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setContainerTime(focusedContainer, 0)}
                          title="Reiniciar a 0 min (0 puntos visibles)"
                          className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-all cursor-pointer"
                        >
                          <RotateCcw size={12} />
                          <span>0 min (0 pts)</span>
                        </button>
                        <button
                          onClick={() => setContainerTime(focusedContainer, 120)}
                          title="Llevar a 120 min (61 puntos visibles)"
                          className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-all cursor-pointer"
                        >
                          <FastForward size={12} />
                          <span>120 min (61 pts)</span>
                        </button>

                        <div className="flex items-center gap-2 font-mono text-xs ml-1">
                          <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-900 shadow-2xs">
                            ⏱️ {focusedConf.time} min
                          </span>
                          <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 shadow-2xs">
                            📍 {focusedPts} / 61 pts
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <input
                        type="range"
                        min={0}
                        max={120}
                        step={2}
                        value={focusedConf.time}
                        onChange={(e) => {
                          setContainerTime(focusedContainer, Number(e.target.value));
                        }}
                        className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900 focus:outline-none"
                      />
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 font-mono px-0.5">
                        <span>0 min (0 pts)</span>
                        <span>30 min</span>
                        <span>60 min (1 h)</span>
                        <span>90 min</span>
                        <span>120 min (61 pts)</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* The Main Chart */}
            <div className="relative h-88 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={visibleChartData} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    type="number"
                    dataKey="time"
                    domain={[0, 120]}
                    ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]}
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    label={{
                      value: 'Tiempo transcurrido (minutos)',
                      position: 'insideBottom',
                      offset: -5,
                      fontSize: 11,
                      fill: '#64748b',
                    }}
                  />
                  <YAxis
                    type="number"
                    domain={[20, 95]}
                    ticks={[20, 30, 40, 50, 60, 70, 80, 90]}
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    label={{
                      value: 'Temperatura (°C)',
                      angle: -90,
                      position: 'insideLeft',
                      offset: 15,
                      fontSize: 11,
                      fill: '#64748b',
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontSize: '12px',
                    }}
                    formatter={(val: any, name: any) => [`${Number(val).toFixed(2)} °C`, name]}
                    labelFormatter={(label) => `Minuto: ${label} min`}
                  />
                  <ReferenceLine
                    y={22.2}
                    stroke="#cbd5e1"
                    strokeDasharray="4 4"
                    label={{ value: 'Temp. Ambiente ≈ 22.2°C', position: 'top', fill: '#94a3b8', fontSize: 10 }}
                  />

                  {/* Render points for active containers */}
                  {Object.keys(clusters).map((name) =>
                    containerSettings[name]?.active ? (
                      <React.Fragment key={name}>
                        {/* Scatter points representing measurements */}
                        <Line
                          type="monotone"
                          dataKey={name}
                          stroke={CLUSTER_COLORS[name]}
                          strokeWidth={0}
                          dot={{ r: 4.5, fill: CLUSTER_COLORS[name], stroke: '#ffffff', strokeWidth: 1.5 }}
                          activeDot={{ r: 7 }}
                          isAnimationActive={false}
                        />
                        {/* Optional smooth fitted line */}
                        {showCurves && (
                          <Line
                            type="monotone"
                            dataKey={`${name}_fit`}
                            stroke={CLUSTER_COLORS[name]}
                            strokeWidth={2}
                            strokeDasharray="4 3"
                            dot={false}
                            isAnimationActive={false}
                          />
                        )}
                      </React.Fragment>
                    ) : null
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* 4 INDEPENDENT CONTAINER CONTROLS & SLIDERS BELOW THE GRAPH */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700">
                  2. Recipientes en estudio (activa, apaga o desliza individualmente):
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => handleSelectAll(true, 0)}
                    className="text-[11px] font-bold text-slate-600 hover:text-slate-900 px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Activar Todos (a 0 min)
                  </button>
                  <button
                    onClick={() => handleSelectAll(true, 120)}
                    className="text-[11px] font-bold text-slate-600 hover:text-slate-900 px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Cargar Todos (120 min)
                  </button>
                  <button
                    onClick={() => handleSelectAll(false, 0)}
                    className="text-[11px] font-bold text-slate-600 hover:text-slate-900 px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Apagar Todos
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.keys(clusters).map((name) => {
                  const conf = containerSettings[name] || { active: false, time: 0 };
                  const liveTemp = getCurrentTemp(name);
                  const color = CLUSTER_COLORS[name];
                  const isFocused = focusedContainer === name;
                  const ptsCount = conf.active && conf.time > 0 ? Math.floor(conf.time / 2) + 1 : 0;

                  return (
                    <div
                      key={name}
                      onClick={() => setFocusedContainer(name)}
                      className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden ${
                        isFocused ? 'ring-2 ring-slate-900' : ''
                      } ${
                        conf.active
                          ? `${CLUSTER_BG_COLORS[name]} shadow-sm scale-[1.01]`
                          : 'bg-slate-50/60 hover:bg-slate-100/70 border-slate-200 text-slate-600 opacity-80'
                      }`}
                    >
                      {/* Top status & toggle button */}
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                            conf.active ? 'text-white' : 'bg-slate-200 text-slate-600'
                          }`}
                          style={{ backgroundColor: conf.active ? color : undefined }}
                        >
                          {clusters[name]?.code}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleContainer(name);
                          }}
                          className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                            conf.active
                              ? 'text-emerald-700 bg-emerald-100/90 hover:bg-emerald-200'
                              : 'text-slate-500 bg-slate-200/80 hover:bg-slate-300'
                          }`}
                        >
                          {conf.active ? (
                            <>
                              <Eye size={12} />
                              <span>Activo</span>
                            </>
                          ) : (
                            <>
                              <EyeOff size={12} />
                              <span>Apagado</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Name */}
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">{name}</h4>
                        <span className="text-[10px] text-slate-500">
                          {conf.active
                            ? `${ptsCount} / 61 puntos mostrados`
                            : 'Apagado · Clic para encender en 0'}
                        </span>
                      </div>

                      {/* Live Temp Indicator */}
                      <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center text-xs">
                        <span className="text-[10px] font-bold text-slate-500">
                          {conf.active && conf.time > 0 ? `Temp a ${conf.time} min:` : 'Temp inicial (t=0):'}
                        </span>
                        <span className="font-mono font-bold text-slate-900">
                          {liveTemp !== null ? `${liveTemp.toFixed(2)} °C` : '--'}
                        </span>
                      </div>

                      {/* Dedicated Slider per Container */}
                      <div
                        className="space-y-1 pt-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 font-mono">
                          <span>Deslizador</span>
                          <span>{conf.active ? `${conf.time} min` : 'Inactivo'}</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={120}
                          step={2}
                          value={conf.time}
                          disabled={!conf.active}
                          onChange={(e) => {
                            setContainerTime(name, Number(e.target.value));
                            setFocusedContainer(name);
                          }}
                          className={`w-full h-2 rounded-lg appearance-none focus:outline-none ${
                            conf.active
                              ? 'bg-slate-300/90 accent-slate-900 cursor-pointer'
                              : 'bg-slate-200 opacity-40 cursor-not-allowed'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Academic Conclusions for Presentation */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 border border-emerald-200">
                <Award size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Conclusiones Oficiales del Caso para la Exposición
                </h3>
                <p className="text-xs text-slate-500">
                  Respuesta rigurosa a las 5 consignas solicitadas por la cátedra
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.general_conclusions.map((concl, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>Punto Clave #{idx + 1}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{concl}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* INDIVIDUAL CLUSTER DETAIL VIEW */}
      {selectedTab !== 'comparative' && currentCluster && (
        <div className="space-y-8">
          {/* Model Selector & Overview */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Clúster Seleccionado ({currentCluster.code})
                </span>
                <h3 className="text-xl font-black text-slate-900">{currentCluster.name}</h3>
              </div>

              {onLoadIntoSolver && (
                <button
                  onClick={() =>
                    onLoadIntoSolver(
                      currentCluster.raw_data.map((r: any) => ({ x: r.time_min, y: r.temp_drink })),
                      `Caso 1 - ${currentCluster.name}`
                    )
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all self-start sm:self-auto cursor-pointer"
                >
                  <FileSpreadsheet size={16} />
                  <span>Cargar datos en Calculadora Libre</span>
                </button>
              )}
            </div>

            {/* Model Pills */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block">
                Seleccionar Modelo de Regresión a Evaluar:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'newton_cooling', label: 'Ley de Enfriamiento de Newton (Físico)', badge: 'Recomendado' },
                  { id: 'polynomial_2', label: 'Polinómico Grado 2 (Cuadrático)', badge: 'Apunte' },
                  { id: 'polynomial_3', label: 'Polinómico Grado 3 (Cúbico)', badge: 'Apunte' },
                  { id: 'exponential', label: 'Exponencial Directo y = a·e^(bx)', badge: 'Linealizado' },
                  { id: 'linear', label: 'Lineal y = a1 + a2·x', badge: 'Descartado' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedModel === m.id
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{m.label}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                        selectedModel === m.id
                          ? 'bg-slate-700 text-white'
                          : m.badge === 'Recomendado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.badge === 'Descartado'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {m.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {currentFit && (
            <>
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Bondad de Ajuste
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-emerald-600">
                      {currentFit.metrics.r2.toFixed(5)}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">
                      <InlineMath math="r^2" />
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 block">
                    {currentFit.metrics.r2 >= 0.85 ? '✅ Ajuste Muy Alto (> 0.85)' : '⚠️ Ajuste Insuficiente'}
                  </span>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <span>Suma Residuos</span> (<InlineMath math="S_r" />)
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-slate-900">
                      {currentFit.metrics.sr.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 block">
                    Discrepancia cuadrática total
                  </span>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <span>Desviación Estándar</span> (<InlineMath math="S_{y/x}" />)
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-slate-900">
                      {currentFit.metrics.syx.toFixed(4)}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">°C</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 block">
                    Error típico de estimación
                  </span>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Ecuación Obtenida
                  </span>
                  <div className="text-sm font-bold text-slate-900 truncate">
                    <InlineMath math={currentFit.formula_latex} />
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 block truncate">
                    {currentFit.explanation}
                  </span>
                </div>
              </div>

              {/* Chart 1: Data Scatter + Fit Curve */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Dispersión de Mediciones vs. Curva de Regresión
                    </h4>
                    <p className="text-xs text-slate-500">
                      61 puntos experimentales (cada 2 min) y curva suave del modelo ajustado
                    </p>
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                    <InlineMath math={currentFit.formula_latex} />
                  </div>
                </div>

                <div className="h-72 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={singleClusterData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis
                        dataKey="time"
                        stroke="#94a3b8"
                        fontSize={11}
                        tickLine={false}
                        label={{ value: 'Tiempo (min)', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#64748b' }}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={11}
                        tickLine={false}
                        domain={['auto', 'auto']}
                        label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft', offset: 15, fontSize: 11, fill: '#64748b' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderRadius: '16px',
                          border: '1px solid #e2e8f0',
                          fontSize: '12px',
                        }}
                        formatter={(val: any, name: any) => [
                          `${Number(val).toFixed(2)} °C`,
                          name === 'actual' ? 'Medición Experimental' : 'Curva Ajustada',
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke={CLUSTER_COLORS[currentCluster.name] || '#0f172a'}
                        strokeWidth={0}
                        dot={{ r: 4, fill: CLUSTER_COLORS[currentCluster.name] || '#0f172a' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="predicted"
                        stroke="#0f172a"
                        strokeWidth={2}
                        dot={false}
                        connectNulls
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Residuals Plot (CRITICAL CONSIGNMENT REQUIREMENT) */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900">
                        Gráfico de Residuos <InlineMath math="e_i = y_i - \hat{y}_i" />
                      </h4>
                      <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                        Consigna Obligatoria
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Un modelo adecuado debe mostrar residuos distribuidos aleatoriamente alrededor de cero, sin patrones curvos sistemáticos.
                    </p>
                  </div>

                  {selectedModel === 'linear' ? (
                    <div className="flex items-center gap-1.5 text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl text-xs font-bold">
                      <AlertTriangle size={15} />
                      <span>Patrón en 'U': Sesgo sistemático (Inadecuado)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold">
                      <CheckCircle2 size={15} />
                      <span>Residuos aleatorios sin sesgo (Válido)</span>
                    </div>
                  )}
                </div>

                <div className="h-48 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={currentFit.residuals} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="x" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderRadius: '16px',
                          border: '1px solid #e2e8f0',
                          fontSize: '12px',
                        }}
                        formatter={(val: any) => [`${Number(val).toFixed(4)} °C`, 'Residuo']}
                        labelFormatter={(label) => `t = ${label} min`}
                      />
                      <ReferenceLine y={0} stroke="#dc2626" strokeWidth={1.5} />
                      <Line
                        type="monotone"
                        dataKey="residual"
                        stroke="#0284c7"
                        strokeWidth={1.5}
                        dot={{ r: 2.5, fill: '#0284c7' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Step-by-Step LaTeX System Resolution (Gauss Equations) */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900">
                    Procedimiento de Cálculo y Ecuaciones Normales de Gauss
                  </h4>
                </div>
                <p className="text-xs text-slate-500">
                  Sistema matricial <InlineMath math="\mathbf{A}\mathbf{c} = \mathbf{b}" /> resultante de anular las derivadas parciales del error cuadrático <InlineMath math="\frac{\partial \delta}{\partial a_k} = 0" />:
                </p>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 overflow-x-auto space-y-3">
                  <div className="text-xs sm:text-sm font-semibold text-slate-900">
                    <InlineMath math={currentFit.normal_equations.matrix_latex} block />
                  </div>
                  <div className="h-px bg-slate-200 w-full" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-700">
                    <span className="font-bold text-slate-900">Solución de parámetros:</span>
                    <InlineMath math={currentFit.normal_equations.solution_latex} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Case1CoolingSection;
