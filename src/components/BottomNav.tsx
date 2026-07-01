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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe">
      <div className="flex justify-between items-center px-6 py-3">
        <Link to="/" className={`flex flex-col items-center gap-1 ${isHome ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900 transition-colors'}`}>
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">Inicio</span>
        </Link>
        <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-900 transition-colors">
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-medium">Buscar</span>
        </button>
        <Link to="/tienda" className={`flex flex-col items-center gap-1 relative -top-4 ${isStore ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900 transition-colors'}`}>
          <div className="bg-blue-600 text-white p-3 rounded-full shadow-lg shadow-blue-200">
            <Compass className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-medium mt-1">Explorar</span>
        </Link>
        <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-900 transition-colors relative">
          <MessageCircle className="w-6 h-6" />
          <span className="text-[10px] font-medium">Pedidos</span>
        </button>
        {user ? (
          <Link to="/dashboard" className={`flex flex-col items-center gap-1 ${isDashboard ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900 transition-colors'}`}>
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium">Perfil</span>
          </Link>
        ) : (
          <button onClick={signInWithGoogle} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-900 transition-colors">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium">Ingresar</span>
          </button>
        )}
      </div>
    </div>
  );
}
