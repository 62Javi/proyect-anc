import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Activity } from 'lucide-react';

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: <Home size={24} />, label: 'Inicio' },
    { path: '/fourier', icon: <Activity size={24} />, label: 'Fourier' },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* App Navigation Sidebar - Phone-First Design */}
      <nav className="w-16 lg:w-24 bg-primary flex flex-col items-center py-6 gap-6 shrink-0 z-50 shadow-[4px_0_15px_rgba(0,0,0,0.1)] border-r-4 border-indigo-800/20">
        <div className="text-white font-heading font-black text-xl lg:text-2xl mb-2 tracking-tighter bg-indigo-800/30 p-2 rounded-xl border-2 border-white/20">
          ANC
        </div>
        <div className="flex flex-col gap-3 w-full px-2 lg:px-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center p-2 lg:p-3 rounded-2xl transition-all duration-300 border-2 ${
                  isActive 
                    ? 'bg-white text-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] border-white scale-105 shadow-md' 
                    : 'text-indigo-100 border-transparent hover:bg-white/10 hover:border-white/10'
                }`}
                title={item.label}
              >
                {item.icon}
                <span className="hidden lg:block text-[10px] font-bold mt-1.5 uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <Outlet />
      </main>
    </div>
  );
}