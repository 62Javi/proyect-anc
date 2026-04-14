import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { PlotData } from '../services/api';

interface FourierChartProps {
  data: PlotData | null;
}

const FourierChart = ({ data }: FourierChartProps) => {
  if (!data) return (
    <div className="h-[250px] lg:h-[500px] flex items-center justify-center text-slate-400 font-medium italic text-center p-4">
      La visualización aparecerá aquí después del cálculo
    </div>
  );

  // Transform data for recharts
  const chartData = data.x.map((xVal, index) => ({
    x: Number(xVal.toFixed(3)),
    original: data.y_original[index],
    aproximacion: data.y_approx[index],
  }));

  return (
    <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 10,
            left: -20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis 
            dataKey="x" 
            tick={{ fill: '#94a3b8' }} 
            tickLine={false} 
            axisLine={{ stroke: '#e2e8f0' }}
            minTickGap={30}
          />
          <YAxis 
            tick={{ fill: '#94a3b8' }} 
            tickLine={false} 
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ fontWeight: 'bold', color: '#475569', marginBottom: '4px' }}
          />
          <Legend 
            verticalAlign="top" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}
          />
          <ReferenceLine y={0} stroke="#cbd5e1" strokeOpacity={0.5} />
          <Line 
            type="monotone" 
            dataKey="original" 
            name="Función Original" 
            stroke="#0ea5e9" 
            strokeWidth={3} 
            dot={false} 
            activeDot={{ r: 6, strokeWidth: 0, fill: '#0ea5e9' }}
          />
          <Line 
            type="monotone" 
            dataKey="aproximacion" 
            name="Aproximación" 
            stroke="#6366f1" 
            strokeWidth={2} 
            dot={false} 
            activeDot={{ r: 5, strokeWidth: 0, fill: '#6366f1' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FourierChart;
