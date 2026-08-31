import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Activity, Calculator, Music } from 'lucide-react';

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

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Inicio' },
    { path: '/fourier', icon: <Activity size={20} />, label: 'Fourier' },
    { path: '/harmonics', icon: <Music size={20} />, label: 'Armónicos' },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Elegant Sidebar */}
      <nav className="w-16 lg:w-64 bg-white border-r border-slate-100 flex flex-col py-6 px-3 gap-8 shrink-0 z-50 shadow-sm">
        <div className="px-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
            <Calculator size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight hidden lg:block text-slate-900">Proyecto ANC</span>
        </div>
        
        <div className="flex flex-col gap-2 w-full">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center p-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
                title={item.label}
              >
                <div className={`${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-900'}`}>
                  {item.icon}
                </div>
                <span className="ml-3 text-sm font-semibold hidden lg:block">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* GitHub link at the bottom */}
        <div className="mt-auto pt-4 border-t border-slate-50">
          <a
            href="https://github.com/62Javi/proyect-anc"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 group"
            title="GitHub Repository"
          >
            <div className="text-slate-400 group-hover:text-slate-900">
              <GithubIcon size={20} />
            </div>
            <span className="ml-3 text-xs font-medium hidden lg:block text-slate-400 group-hover:text-slate-600">
              Ver en GitHub
            </span>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-slate-50/50">
        <Outlet />
      </main>
    </div>
  );
}