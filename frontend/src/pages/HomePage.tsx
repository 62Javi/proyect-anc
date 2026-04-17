import { Link } from 'react-router-dom';
import { Activity, Beaker, GraduationCap } from 'lucide-react';

export default function HomePage() {
  const tools = [
    {
      title: 'FouriAnalyzer',
      description: 'Calcula y visualiza series de Fourier para funciones periódicas y a trozos.',
      icon: <Activity size={36} className="text-primary" />,
      path: '/fourier',
      ready: true,
      color: 'bg-indigo-50 border-primary/20'
    },
    {
      title: 'Próximamente',
      description: 'Nuevas herramientas para Análisis Numérico y Cálculo están en camino.',
      icon: <Beaker size={36} className="text-slate-400" />,
      path: '#',
      ready: false,
      color: 'bg-slate-50 border-slate-200'
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-background p-6 lg:p-12 font-body">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Academic Header */}
        <header className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-4 bg-white px-6 py-3 rounded-[24px] border-4 border-primary shadow-clay">
            <GraduationCap size={40} className="text-primary" />
            <h1 className="text-3xl lg:text-5xl font-black tracking-tighter text-foreground uppercase">
              Proyect ANC
            </h1>
          </div>
          <div className="bg-white/50 p-6 rounded-[32px] border-2 border-dashed border-primary/20 max-w-2xl">
            <p className="text-lg lg:text-xl text-slate-700 leading-relaxed font-medium">
              Plataforma académica interactiva para el estudio de <span className="text-primary font-bold">Análisis Matemático</span>, <span className="text-primary font-bold">Métodos Numéricos</span> y <span className="text-primary font-bold">Cálculo</span>.
            </p>
          </div>
        </header>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {tools.map((tool, idx) => (
            <Link
              key={idx}
              to={tool.path}
              className={`group block p-8 rounded-[40px] border-4 transition-all duration-300 relative overflow-hidden ${
                tool.ready
                  ? 'bg-white border-primary shadow-clay hover:-translate-y-2 hover:shadow-clay-hover active:scale-[0.98]'
                  : 'bg-slate-100 border-slate-200 opacity-80 cursor-not-allowed'
              }`}
              onClick={(e) => !tool.ready && e.preventDefault()}
            >
              {/* Decorative circle */}
              {tool.ready && (
                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
              )}
              
              <div className={`w-20 h-20 rounded-[24px] flex items-center justify-center mb-8 border-4 ${
                tool.ready ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-200 border-slate-300'
              }`}>
                {tool.icon}
              </div>
              
              <h2 className={`text-2xl font-black mb-4 tracking-tight ${
                tool.ready ? 'text-foreground' : 'text-slate-500'
              }`}>
                {tool.title}
              </h2>
              
              <p className="text-slate-600 leading-relaxed font-medium text-sm">
                {tool.description}
              </p>
              
              {!tool.ready && (
                <div className="mt-8 inline-flex px-4 py-2 bg-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-slate-300">
                  En desarrollo
                </div>
              )}

              {tool.ready && (
                <div className="mt-8 flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                  Explorar Herramienta <span className="text-xl">→</span>
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Info Footer */}
        <footer className="pt-12 border-t-2 border-dashed border-primary/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            <span>UTN FRLP - 2026</span>
            <div className="flex gap-6">
              <span className="hover:text-primary cursor-help">Privacidad</span>
              <span className="hover:text-primary cursor-help">Términos</span>
              <span className="hover:text-primary cursor-help">Documentación</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}