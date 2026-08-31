import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { PlotData } from '../services/api';

interface FourierChartProps {
  data: PlotData | null;
}

const FourierChart = ({ data }: FourierChartProps) => {
  if (!data) return (
    <div className="h-[300px] lg:h-[500px] flex flex-col items-center justify-center text-slate-300 font-bold uppercase tracking-[0.2em] text-center p-8 space-y-4">
      <div className="w-12 h-1.5 bg-slate-100 rounded-full animate-pulse" />
      <span className="text-[10px]">Cálculo Pendiente</span>
    </div>
  );

  const chartData = data.x.map((xVal, index) => ({
    x: Number(xVal.toFixed(3)),
    original: data.y_original[index],
    aproximacion: data.y_approx[index],
  }));

  return (
    <div className="w-full h-[350px] sm:h-[450px] lg:h-[550px] text-[10px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 10, left: -20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis 
            dataKey="x" 
            tick={{ fill: '#64748B' }} 
            axisLine={{ stroke: '#E2E8F0' }}
            tickLine={false}
            minTickGap={40}
          />
          <YAxis 
            tick={{ fill: '#64748B' }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="top" height={40} />
          <ReferenceLine y={0} stroke="#94A3B8" strokeWidth={1} />
          <Line 
            type="monotone" 
            dataKey="original" 
            name="Original" 
            stroke="#94A3B8" 
            strokeWidth={2} 
            dot={false} 
            activeDot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="aproximacion" 
            name="Fourier" 
            stroke="#0F172A" 
            strokeWidth={3} 
            dot={false} 
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FourierChart;