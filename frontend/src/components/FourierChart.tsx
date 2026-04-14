import Plot from 'react-plotly.js';
import { PlotData } from '../services/api';

interface FourierChartProps {
  data: PlotData | null;
}

const FourierChart = ({ data }: FourierChartProps) => {
  if (!data) return <div className="h-96 flex items-center justify-center bg-gray-50 border rounded">No data to display</div>;

  return (
    <div className="w-full bg-white p-4 rounded shadow">
      <Plot
        data={[
          {
            x: data.x,
            y: data.y_original,
            type: 'scatter',
            mode: 'lines',
            name: 'Original',
            line: { color: '#10b981', width: 2 },
          },
          {
            x: data.x,
            y: data.y_approx,
            type: 'scatter',
            mode: 'lines',
            name: 'Aproximación',
            line: { color: '#6366f1', width: 2 },
          },
        ]}
        layout={{
          title: 'Serie de Fourier vs Función Original',
          autosize: true,
          margin: { t: 50, r: 30, l: 50, b: 50 },
          legend: { orientation: 'h', y: -0.2 },
          xaxis: { title: 'x' },
          yaxis: { title: 'f(x)' },
        }}
        useResizeHandler={true}
        className="w-full h-96"
      />
    </div>
  );
};

export default FourierChart;
