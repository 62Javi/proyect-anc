import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Activity } from 'lucide-react';

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: <Home size={24} />, label: 'Inicio' },
    { path: '/fourier', icon: <Activity size={24} />, label: 'Fourier' },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* App Navigation Sidebar */}
      <nav className="w-20 bg-indigo-900 flex flex-col items-center py-8 gap-8 shrink-0 z-50 shadow-xl">
        <div className="text-white font-black text-xl mb-4 tracking-tighter">ANC</div>
        <div className="flex flex-col gap-4 w-full px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50' 
                    : 'text-indigo-300 hover:bg-indigo-800 hover:text-white'
                }`}
                title={item.label}
              >
                {item.icon}
                <span className="text-[9px] font-bold mt-1.5 uppercase tracking-wider">{item.label}</span>
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