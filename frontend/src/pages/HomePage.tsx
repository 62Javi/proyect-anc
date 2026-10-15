import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Calculator, Music, LineChart, Sigma, ArrowUpRight } from 'lucide-react';

interface ToolItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  tag: string;
  features: string[];
}

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
  const tools: ToolItem[] = [
    {
      id: '01',
      title: 'Método de Taylor',
      subtitle: 'Problemas de Valor Inicial (P.V.I.) en EDO',
      description: 'Resolución de Problemas de Valor Inicial mediante series de Taylor con deducción analítica de derivadas sucesivas.',
      icon: <Sigma size={20} />,
      path: '/taylor',
      tag: 'Ecuaciones Diferenciales',
      features: ['Taylor Grado 2', 'Deducción Analítica', 'Solución Exacta'],
    },
    {
      id: '02',
      title: 'Ajuste por Mínimos Cuadrados',
      subtitle: 'Modelos Lineales & No Lineales',
      description: 'Estudio térmico del Caso 1 (Ley de Enfriamiento de Newton), cálculo matricial de residuos, coeficiente de determinación y contrastes experimentales.',
      icon: <LineChart size={20} />,
      path: '/regression',
      tag: 'Ajuste & Optimización',
      features: ['Caso 1 Térmico', 'Residuos & Bondad', 'Presets TP4'],
    },
    {
      id: '03',
      title: 'Cálculo de Raíces',
      subtitle: 'Ecuaciones No Lineales Continuas',
      description: 'Métodos iterativos de Newton-Raphson y Punto Fijo con duelo comparativo en vivo, diagramas de tangentes dinámicas y visualización cobweb.',
      icon: <Calculator size={20} />,
      path: '/roots',
      tag: 'Cálculo Numérico',
      features: ['Newton-Raphson', 'Punto Fijo', 'Gráficos Cobweb'],
    },
    {
      id: '04',
      title: 'Analizador de Fourier',
      subtitle: 'Series & Reconstrucción Espectral',
      description: 'Cálculo simbólico y numérico de coeficientes trigonométricos, detección automática de simetría y síntesis armónica de funciones periódicas.',
      icon: <Activity size={20} />,
      path: '/fourier',
      tag: 'Series & Frecuencias',
      features: ['Coeficientes Trigonométricos', 'Detección Simetría', 'Espectro'],
    },
    {
      id: '05',
      title: 'Análisis de Armónicos',
      subtitle: 'Procesamiento de Señales en Tiempo Real',
      description: 'Transformada Rápida de Fourier (FFT) para análisis de señales, detección de frecuencias fundamentales y visualización espectral.',
      icon: <Music size={20} />,
      path: '/harmonics',
      tag: 'Procesamiento de Señales',
      features: ['Análisis Espectral', 'FFT en Tiempo Real', 'Detección Fundamental'],
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-slate-50/50 p-4 sm:p-8 lg:p-14 flex flex-col">
      <div className="max-w-5xl mx-auto space-y-10 sm:space-y-12 flex-1 w-full">
        
        {/* Header Limpio Original */}
        <header className="flex flex-col items-center text-center space-y-3 pt-3 sm:pt-0">
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-md shadow-slate-200 mb-1">
            <Calculator size={28} />
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
            Proyecto ANC
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-slate-500 max-w-xl font-medium px-4">
            Plataforma interactiva para Análisis, Métodos Numéricos y Cálculo.
          </p>
        </header>

        {/* Grid de Módulos (Formato limpio de tarjetas sin fórmulas) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pb-8">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/50 transition-all duration-200"
            >
              <div className="space-y-3.5">
                {/* Cabecera: número + tag + flecha de enlace */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-xs font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
                      {tool.id}
                    </span>
                    <span className="text-slate-300">/</span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                      {tool.tag}
                    </span>
                  </div>

                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-slate-900 group-hover:bg-slate-100 transition-all">
                    <ArrowUpRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Título & Subtítulo */}
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-200">
                      {tool.icon}
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight group-hover:text-blue-950 transition-colors">
                      {tool.title}
                    </h2>
                  </div>
                  <p className="text-xs font-medium text-slate-400">
                    {tool.subtitle}
                  </p>
                </div>

                {/* Descripción */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {tool.description}
                </p>
              </div>

              {/* Tags de Capacidades Técnicas */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                {tool.features.map((feat, fIdx) => (
                  <span
                    key={fIdx}
                    className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-100"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer sobrio */}
      <footer className="mt-auto pt-10 pb-6 flex flex-col items-center gap-3 text-center">
        <div className="h-px w-12 bg-slate-200" />
        <a 
          href="https://github.com/62Javi/proyect-anc" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors"
        >
          <GithubIcon size={16} />
          <span className="text-xs font-semibold tracking-wider uppercase">Repositorio del Proyecto</span>
        </a>
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
          Desarrollado con fines académicos
        </p>
      </footer>
    </div>
  );
}
