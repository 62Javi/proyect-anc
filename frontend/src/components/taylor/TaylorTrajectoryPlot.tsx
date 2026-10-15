import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { TaylorPlotData } from '../../types/taylor';
import InlineMath from '../InlineMath';
import { formatCleanNumber } from '../../utils/numberFormat';

interface TaylorTrajectoryPlotProps {
  plotData: TaylorPlotData;
  xVar: string;
  yVar: string;
}

export const TaylorTrajectoryPlot: React.FC<TaylorTrajectoryPlotProps> = ({
  plotData,
  xVar,
  yVar,
}) => {
  if (!plotData || !plotData.discrete_points || plotData.discrete_points.length === 0) {
    return null;
  }

  // Prepare data points for recharts
  const chartData = plotData.discrete_points.map((pt) => ({
    step: pt.step,
    x: pt.x,
    y: pt.y,
    formattedX: formatCleanNumber(pt.x, 4),
    formattedY: formatCleanNumber(pt.y, 6),
  }));

  // Find min/max for padding
  const yValues = chartData.map((d) => d.y);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  const yRange = maxY - minY || 1;
  const yDomain = [
    Number((minY - yRange * 0.08).toFixed(4)),
    Number((maxY + yRange * 0.08).toFixed(4)),
  ];

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-slate-100 text-slate-900 rounded-lg">
              <TrendingUp size={16} />
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
              Trayectoria Numérica de la Solución Aproximada
            </h3>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
            Visualización interactiva de la curva calculada y los nodos de iteración{' '}
            <InlineMath math={`(${xVar}_n, ${yVar}_n)`} /> en el plano.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 self-start sm:self-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-900 inline-block" />
          <span>Nodos de Taylor ({chartData.length} puntos)</span>
        </div>
      </div>

      <div className="w-full h-64 sm:h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="x"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(v) => formatCleanNumber(v, 2)}
              tick={{ fontSize: 11, fill: '#64748b' }}
              stroke="#cbd5e1"
              label={{
                value: xVar,
                position: 'insideBottomRight',
                offset: -4,
                fontSize: 11,
                fill: '#475569',
              }}
            />
            <YAxis
              type="number"
              domain={yDomain}
              tickFormatter={(v) => formatCleanNumber(v, 2)}
              tick={{ fontSize: 11, fill: '#64748b' }}
              stroke="#cbd5e1"
              label={{
                value: yVar,
                angle: -90,
                position: 'insideLeft',
                offset: 10,
                fontSize: 11,
                fill: '#475569',
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-lg space-y-1">
                    <div className="font-bold border-b border-slate-700 pb-1 text-slate-300">
                      Iteración {d.step === 0 ? 'Inicial (P.V.I.)' : `n = ${d.step - 1}`}
                    </div>
                    <div className="font-mono text-[11px] space-y-0.5">
                      <div>
                        {xVar}: <span className="font-bold text-white">{d.formattedX}</span>
                      </div>
                      <div>
                        {yVar}: <span className="font-bold text-white">{d.formattedY}</span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="y"
              stroke="#0f172a"
              strokeWidth={2.5}
              dot={{
                r: 4.5,
                fill: '#0f172a',
                stroke: '#ffffff',
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6.5,
                fill: '#2563eb',
                stroke: '#ffffff',
                strokeWidth: 2,
              }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaylorTrajectoryPlot;
