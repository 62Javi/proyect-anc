import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Activity, Calculator, Music, ChevronLeft, ChevronRight } from 'lucide-react';

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
    { path: '/roots', icon: <Calculator size={20} />, label: 'Método de Newton & Punto Fijo' },
    { path: '/fourier', icon: <Activity size={20} />, label: 'Fourier' },
    { path: '/harmonics', icon: <Music size={20} />, label: 'Armónicos' },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Elegant Collapsible Sidebar */}
      <aside
        className={`relative bg-white border-r border-slate-200 flex flex-col py-6 px-3 gap-8 shrink-0 z-50 shadow-sm transition-all duration-300 ${
          isCollapsed ? 'w-16 lg:w-20' : 'w-16 lg:w-72'
        }`}
      >
        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:scale-110 shadow-md transition-all cursor-pointer z-50"
          title={isCollapsed ? 'Expandir barra lateral' : 'Ocultar barra lateral (Modo Presentación)'}
        >
          {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>

        {/* Logo and Brand */}
        <div className="px-2 flex items-center gap-3">
          <Link to="/" className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200 shrink-0">
            <Calculator size={20} />
          </Link>
          {!isCollapsed && (
            <div className="hidden lg:block overflow-hidden">
              <span className="text-lg font-black tracking-tight text-slate-900 block leading-tight">Proyecto ANC</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Análisis & Métodos</span>
            </div>
          )}
        </div>
        
        {/* Nav Items */}
        <nav className="flex flex-col gap-1.5 w-full">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center p-3 rounded-2xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-sm font-bold' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title={item.label}
              >
                <div className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'} shrink-0`}>
                  {item.icon}
                </div>
                {!isCollapsed && (
                  <span className="ml-3 text-xs font-bold hidden lg:block truncate">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* GitHub link at the bottom */}
        <div className="mt-auto pt-4 border-t border-slate-100">
          <a
            href="https://github.com/62Javi/proyect-anc"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 rounded-2xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 group"
            title="Ver en GitHub"
          >
            <div className="text-slate-400 group-hover:text-slate-900 shrink-0">
              <GithubIcon size={20} />
            </div>
            {!isCollapsed && (
              <span className="ml-3 text-xs font-semibold hidden lg:block text-slate-500 group-hover:text-slate-900">
                Ver en GitHub
              </span>
            )}
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-slate-50/50">
        <Outlet />
      </main>
    </div>
  );
}
