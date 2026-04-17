import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { PlotData } from '../services/api';

interface FourierChartProps {
  data: PlotData | null;
}

const FourierChart = ({ data }: FourierChartProps) => {
  if (!data) return (
    <div className="h-[250px] lg:h-[500px] flex flex-col items-center justify-center text-slate-300 font-black uppercase tracking-[0.3em] text-center p-8 space-y-4">
      <div className="w-16 h-1 bg-slate-100 rounded-full animate-pulse" />
      <span className="text-[10px]">Esperando Serie</span>
    </div>
  );

  // Transform data for recharts
  const chartData = data.x.map((xVal, index) => ({
    x: Number(xVal.toFixed(3)),
    original: data.y_original[index],
    aproximacion: data.y_approx[index],
  }));

  return (
    <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] text-[10px] font-bold">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 10,
            left: -10,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="6 6" stroke="#C7D2FE" vertical={false} strokeOpacity={0.3} />
          <XAxis 
            dataKey="x" 
            tick={{ fill: '#818CF8' }} 
            tickLine={false} 
            axisLine={{ stroke: '#C7D2FE', strokeWidth: 2 }}
            minTickGap={40}
          />
          <YAxis 
            tick={{ fill: '#818CF8' }} 
            tickLine={false} 
            axisLine={{ stroke: '#C7D2FE', strokeWidth: 2 }}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '20px', 
              border: '4px solid #C7D2FE', 
              boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.1)',
              padding: '12px' 
            }}
            labelStyle={{ fontWeight: '900', color: '#1E1B4B', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
          />
          <Legend 
            verticalAlign="top" 
            height={48} 
            iconType="circle"
            wrapperStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4F46E5' }}
          />
          <ReferenceLine y={0} stroke="#4F46E5" strokeWidth={2} strokeOpacity={0.2} />
          <Line 
            type="monotone" 
            dataKey="original" 
            name="Original" 
            stroke="#EA580C" 
            strokeWidth={4} 
            dot={false} 
            activeDot={{ r: 8, strokeWidth: 4, stroke: '#fff', fill: '#EA580C' }}
            animationDuration={1500}
          />
          <Line 
            type="monotone" 
            dataKey="aproximacion" 
            name="Serie de Fourier" 
            stroke="#4F46E5" 
            strokeWidth={3} 
            dot={false} 
            activeDot={{ r: 6, strokeWidth: 3, stroke: '#fff', fill: '#4F46E5' }}
            animationDuration={2000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FourierChart;