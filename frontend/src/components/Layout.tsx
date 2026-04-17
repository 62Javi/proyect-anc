import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Activity, Calculator } from 'lucide-react';

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Inicio' },
    { path: '/fourier', icon: <Activity size={20} />, label: 'Fourier' },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Elegant Sidebar */}
      <nav className="w-16 lg:w-64 bg-white border-r border-slate-100 flex flex-col py-6 px-3 gap-8 shrink-0 z-50 shadow-sm">
        <div className="px-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
            <Calculator size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight hidden lg:block">ANC Platform</span>
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

        <div className="mt-auto px-4 hidden lg:block">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estado</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-slate-600">Local Host Online</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative bg-slate-50/50">
        <Outlet />
      </main>
    </div>
  );
}