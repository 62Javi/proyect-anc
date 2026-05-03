import { Link } from 'react-router-dom';
import { Activity, Beaker, Calculator, Music } from 'lucide-react';

export default function HomePage() {
  const tools = [
    {
      title: 'Fourier Analyzer',
      description: 'Calcula y visualiza series de Fourier para funciones periódicas y a trozos.',
      icon: <Activity size={24} />,
      path: '/fourier',
      ready: true,
      tag: 'Matemática Superior'
    },
    {
      title: 'Análisis de Armónicos',
      description: 'Análisis de frecuencia en tiempo real (FFT) mediante grabaciones de audio.',
      icon: <Music size={24} />,
      path: '/harmonics',
      ready: true,
      tag: 'Procesamiento de Señales'
    },
    {
      title: 'Métodos Numéricos',
      description: 'Solución numérica de ecuaciones y sistemas complejos.',
      icon: <Beaker size={24} />,
      path: '#',
      ready: false,
      tag: 'Próximamente'
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-slate-50/50 p-8 lg:p-24">
      <div className="max-w-5xl mx-auto space-y-16">
        
        <header className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 mb-4">
            <Calculator size={32} />
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight">Proyecto ANC</h1>
          <p className="text-lg text-slate-500 max-w-xl font-medium">Plataforma interactiva para Análisis, Métodos Numéricos y Cálculo.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool, idx) => (
            <Link
              key={idx}
              to={tool.path}
              className={`p-8 rounded-[32px] border transition-all duration-300 ${
                tool.ready
                  ? 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-50 hover:-translate-y-1'
                  : 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed'
              }`}
              onClick={(e) => !tool.ready && e.preventDefault()}
            >
              <div className={`p-4 rounded-xl w-fit mb-6 ${tool.ready ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-400'}`}>
                {tool.icon}
              </div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-900">{tool.title}</h2>
                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${tool.ready ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {tool.tag}
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">{tool.description}</p>
              {tool.ready && (
                <div className="text-indigo-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                  Abrir Herramienta <span>→</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}