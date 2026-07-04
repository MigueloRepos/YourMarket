import React from 'react';
import { Home, Search, Compass, MessageCircle, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function BottomNav() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isStore = location.pathname === '/tienda';
  const isDashboard = location.pathname === '/dashboard';
  const { user, signInWithGoogle } = useAuth();

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 pb-safe">
      <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl">
        <div className="flex justify-around items-center px-4 py-3 relative">
          <Link to="/" className={`flex flex-col items-center gap-1 w-14 ${isHome ? 'text-blue-600 scale-110' : 'text-slate-500 hover:text-slate-900'} transition-all duration-300`}>
            <Home className="w-5 h-5" />
            <span className="text-[9px] font-bold tracking-wide">Inicio</span>
          </Link>
          <button className="flex flex-col items-center gap-1 w-14 text-slate-500 hover:text-slate-900 transition-all duration-300">
            <Search className="w-5 h-5" />
            <span className="text-[9px] font-bold tracking-wide">Buscar</span>
          </button>
          
          <Link to="/tienda" className={`flex flex-col items-center justify-center -mt-6 relative z-10 w-14 ${isStore ? 'scale-110' : 'hover:scale-105'} transition-all duration-300`}>
            <div className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg ${isStore ? 'bg-blue-700 shadow-blue-300/50' : 'bg-blue-600 shadow-blue-200'} text-white`}>
              <Compass className="w-6 h-6" />
            </div>
          </Link>
          
          <button className="flex flex-col items-center gap-1 w-14 text-slate-500 hover:text-slate-900 transition-all duration-300">
            <MessageCircle className="w-5 h-5" />
            <span className="text-[9px] font-bold tracking-wide">Pedidos</span>
          </button>
          
          {user ? (
            <Link to="/dashboard" className={`flex flex-col items-center gap-1 w-14 ${isDashboard ? 'text-blue-600 scale-110' : 'text-slate-500 hover:text-slate-900'} transition-all duration-300`}>
              <User className="w-5 h-5" />
              <span className="text-[9px] font-bold tracking-wide">Perfil</span>
            </Link>
          ) : (
            <button onClick={signInWithGoogle} className="flex flex-col items-center gap-1 w-14 text-slate-500 hover:text-slate-900 transition-all duration-300">
              <User className="w-5 h-5" />
              <span className="text-[9px] font-bold tracking-wide">Ingresar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
