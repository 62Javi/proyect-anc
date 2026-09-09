import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Activity, Calculator, Music, LineChart, ChevronLeft, ChevronRight } from 'lucide-react';

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

export default function Layout() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Inicio' },
    { path: '/regression', icon: <LineChart size={20} />, label: 'Mínimos Cuadrados' },
    { path: '/roots', icon: <Calculator size={20} />, label: 'Método de Newton' },
    { path: '/fourier', icon: <Activity size={20} />, label: 'Fourier' },
    { path: '/harmonics', icon: <Music size={20} />, label: 'Armónicos' },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Elegant Collapsible Sidebar */}
      <aside
        className={`relative bg-white border-slate-200 flex flex-col py-6 shrink-0 z-50 shadow-sm transition-[width,padding] duration-300 ease-in-out ${
          isCollapsed
            ? 'w-0 px-0 border-r-0 lg:w-20 lg:px-3 lg:border-r'
            : 'w-20 px-3 border-r lg:w-72 lg:px-4'
        }`}
      >
        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute top-1/2 -translate-y-1/2 z-50 flex items-center justify-center bg-white border border-slate-200 shadow-md transition-all duration-300 ease-in-out cursor-pointer text-slate-600 hover:text-slate-900 hover:scale-105 active:scale-95 ${
            isCollapsed
              ? '-right-5 lg:-right-3.5 w-7 h-11 rounded-r-xl lg:w-7 lg:h-7 lg:rounded-full border-l-0 lg:border-l'
              : '-right-3.5 w-7 h-7 rounded-full'
          }`}
          title={isCollapsed ? 'Expandir barra lateral' : 'Ocultar barra lateral'}
        >
          {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>

        {/* Sidebar Content */}
        <div className={`flex flex-col h-full w-full gap-8 transition-opacity duration-200 ${isCollapsed ? 'hidden lg:flex' : 'flex'}`}>
          {/* Logo and Brand */}
          <div className={`flex items-center gap-3.5 w-full ${isCollapsed ? 'justify-center' : 'justify-center lg:justify-start px-1'}`}>
            <Link 
              to="/" 
              className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-md shadow-slate-200 shrink-0 hover:scale-105 transition-transform"
              title="Proyecto ANC"
            >
              <Calculator size={20} />
            </Link>
            {!isCollapsed && (
              <div className="hidden lg:flex flex-col justify-center overflow-hidden whitespace-nowrap">
                <span className="text-base font-black tracking-tight text-slate-900 block leading-tight">Proyecto ANC</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Análisis & Métodos</span>
              </div>
            )}
          </div>
          
          {/* Nav Items */}
          <nav className="flex flex-col gap-2 w-full">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center rounded-2xl transition-colors duration-200 group ${
                    isCollapsed 
                      ? 'w-11 h-11 justify-center mx-auto' 
                      : 'w-11 h-11 justify-center mx-auto lg:w-full lg:h-11 lg:px-3 lg:justify-start'
                  } ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-sm font-bold' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title={item.label}
                >
                  <div className={`flex items-center justify-center shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'}`}>
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <span className="ml-3 text-xs font-bold hidden lg:block truncate whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* GitHub link at the bottom */}
          <div className="mt-auto pt-4 border-t border-slate-100 w-full">
            <a
              href="https://github.com/62Javi/proyect-anc"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center rounded-2xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors duration-200 group ${
                isCollapsed
                  ? 'w-11 h-11 justify-center mx-auto'
                  : 'w-11 h-11 justify-center mx-auto lg:w-full lg:h-11 lg:px-3 lg:justify-start'
              }`}
              title="Ver en GitHub"
            >
              <div className="text-slate-400 group-hover:text-slate-900 shrink-0 flex items-center justify-center">
                <GithubIcon size={20} />
              </div>
              {!isCollapsed && (
                <span className="ml-3 text-xs font-semibold hidden lg:block text-slate-500 group-hover:text-slate-900 truncate whitespace-nowrap">
                  Ver en GitHub
                </span>
              )}
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-slate-50/50">
        <Outlet />
      </main>
    </div>
  );
}
