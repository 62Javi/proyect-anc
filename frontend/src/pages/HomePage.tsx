import { Link } from 'react-router-dom';
import { Activity, Beaker, Calculator, Music } from 'lucide-react';

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function HomePage() {
  const tools = [
    {
      title: 'Analizador de Fourier',
      description: 'Calcula y visualiza series de Fourier para funciones periódicas y a trozos.',
      icon: <Activity size={24} />,
      path: '/fourier',
      ready: true,
      tag: 'Análisis Numérico'
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
      title: 'Cálculo de Raíces',
      description: 'Métodos de Newton y Punto Fijo para ecuaciones no lineales continuas con duelo en vivo, diagramas de tangentes y telaraña.',
      icon: <Beaker size={24} />,
      path: '/roots',
      ready: true,
      tag: 'Análisis Numérico'
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-slate-50/50 p-8 lg:p-24 flex flex-col">
      <div className="max-w-5xl mx-auto space-y-16 flex-1">
        
        <header className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200 mb-4">
            <Calculator size={32} />
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight">Proyecto ANC</h1>
          <p className="text-lg text-slate-500 max-w-xl font-medium">Plataforma interactiva para Análisis, Métodos Numéricos y Cálculo.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
          {tools.map((tool, idx) => (
            <Link
              key={idx}
              to={tool.path}
              className={`p-8 rounded-[32px] border transition-all duration-300 ${
                tool.ready
                  ? 'bg-white border-slate-200 hover:border-slate-400 hover:shadow-2xl hover:shadow-slate-100 hover:-translate-y-1'
                  : 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed'
              }`}
              onClick={(e) => !tool.ready && e.preventDefault()}
            >
              <div className={`p-4 rounded-xl w-fit mb-6 ${tool.ready ? 'bg-slate-100 text-slate-900' : 'bg-slate-200 text-slate-400'}`}>
                {tool.icon}
              </div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-900">{tool.title}</h2>
                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${tool.ready ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {tool.tag}
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">{tool.description}</p>
              {tool.ready && (
                <div className="text-slate-900 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                  Abrir Herramienta <span>→</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      <footer className="mt-auto pt-12 flex flex-col items-center gap-4">
        <div className="h-px w-12 bg-slate-200" />
        <a 
          href="https://github.com/62Javi/proyect-anc" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors duration-200 grayscale hover:grayscale-0 opacity-60 hover:opacity-100"
        >
          <GithubIcon size={16} />
          <span className="text-xs font-semibold tracking-widest uppercase">Repositorio del Proyecto</span>
        </a>
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em] mb-8">
          Desarrollado con fines académicos
        </p>
      </footer>
    </div>
  );
}
