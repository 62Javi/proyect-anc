import { Link } from 'react-router-dom';
import { Activity, Beaker, Library } from 'lucide-react';

export default function HomePage() {
  const tools = [
    {
      title: 'FouriAnalyzer',
      description: 'Calcula y visualiza series de Fourier para funciones periódicas y a trozos.',
      icon: <Activity size={32} className="text-indigo-600" />,
      path: '/fourier',
      ready: true,
    },
    {
      title: 'Próximamente',
      description: 'Nuevas herramientas para Análisis Numérico y Cálculo están en camino.',
      icon: <Beaker size={32} className="text-slate-400" />,
      path: '#',
      ready: false,
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="space-y-4">
          <div className="flex items-center gap-3 text-indigo-600">
            <Library size={40} />
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Proyecto ANC
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl">
            Plataforma interactiva para Ampliación de Matemáticas, Análisis Numérico y Cálculo.
            Selecciona una herramienta para empezar.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
          {tools.map((tool, idx) => (
            <Link
              key={idx}
              to={tool.path}
              className={`block p-6 rounded-3xl border bg-white shadow-sm transition-all duration-300 ${
                tool.ready
                  ? 'hover:shadow-xl hover:-translate-y-1 border-indigo-100 hover:border-indigo-300'
                  : 'opacity-70 cursor-not-allowed border-slate-200'
              }`}
              onClick={(e) => !tool.ready && e.preventDefault()}
            >
              <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                {tool.icon}
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">{tool.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {tool.description}
              </p>
              
              {!tool.ready && (
                <div className="mt-6 inline-flex px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase tracking-wider">
                  En desarrollo
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}