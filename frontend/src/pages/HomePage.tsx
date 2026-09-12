import { Link } from 'react-router-dom';
import { Activity, Calculator, Music, LineChart } from 'lucide-react';

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
      title: 'Ajuste por Mínimos Cuadrados',
      description: 'Estudio térmico del Caso 1 (Enfriamiento de Bebidas), cálculo de residuos, bondad de ajuste r² y simulador interactivo para modelos lineales y no lineales.',
      icon: <LineChart size={24} />,
      path: '/regression',
      ready: true,
      tag: 'Regresión & Ajuste',
    },
    {
      title: 'Cálculo de Raíces',
      description: 'Métodos de Newton y Punto Fijo para ecuaciones no lineales continuas con duelo en vivo, diagramas de tangentes y telaraña.',
      icon: <Calculator size={24} />,
      path: '/roots',
      ready: true,
      tag: 'Ecuaciones No Lineales',
    },
    {
      title: 'Analizador de Fourier',
      description: 'Calcula y visualiza series de Fourier para funciones periódicas y a trozos.',
      icon: <Activity size={24} />,
      path: '/fourier',
      ready: true,
      tag: 'Series & Frecuencias',
    },
    {
      title: 'Análisis de Armónicos',
      description: 'Análisis de frecuencia en tiempo real (FFT) mediante grabaciones de audio.',
      icon: <Music size={24} />,
      path: '/harmonics',
      ready: true,
      tag: 'Procesamiento de Señales',
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-slate-50/50 p-4 sm:p-8 lg:p-16 flex flex-col">
      <div className="max-w-5xl mx-auto space-y-10 sm:space-y-14 flex-1 w-full">
        
        <header className="flex flex-col items-center text-center space-y-4 pt-4 sm:pt-0">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200 mb-2">
            <Calculator size={32} />
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">Proyecto ANC</h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-500 max-w-xl font-medium px-4">
            Plataforma interactiva para Análisis, Métodos Numéricos y Cálculo.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pb-12">
          {tools.map((tool, idx) => (
            <Link
              key={idx}
              to={tool.path}
              className={`flex flex-col justify-between h-full p-6 sm:p-8 rounded-3xl border transition-all duration-300 group ${
                tool.ready
                  ? 'bg-white border-slate-200 hover:border-slate-400 hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-1'
                  : 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed'
              }`}
              onClick={(e) => !tool.ready && e.preventDefault()}
            >
              <div className="space-y-4">
                {/* Card Top: Icon + Category Badge */}
                <div className="flex items-center justify-between gap-3">
                  <div className={`p-3.5 rounded-2xl w-fit ${tool.ready ? 'bg-slate-100 text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-200' : 'bg-slate-200 text-slate-400'}`}>
                    {tool.icon}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shrink-0 ${tool.ready ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-200 text-slate-500'}`}>
                    {tool.tag}
                  </span>
                </div>

                {/* Card Title */}
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  {tool.title}
                </h2>

                {/* Description */}
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                  {tool.description}
                </p>
              </div>

              {/* Card Footer */}
              {tool.ready && (
                <div className="pt-5 mt-6 border-t border-slate-100 text-slate-900 font-bold text-xs uppercase tracking-widest flex items-center justify-between group-hover:text-slate-600 transition-colors">
                  <span>Abrir Herramienta</span>
                  <span className="text-sm transition-transform duration-200 group-hover:translate-x-1">→</span>
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
