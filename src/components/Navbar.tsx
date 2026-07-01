import React, { useState } from 'react';
import { Search, MessageCircle, Menu, X, Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signInWithGoogle } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <img src="/logo_your_market.png" alt="MarketX Logo" className="h-10 w-auto object-contain md:h-12" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/tienda" className="text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors">Tienda</Link>
            <a href="/#categorias" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Categorías</a>
            <a href="/#ofertas" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Ofertas</a>
            <a href="/#productos" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Productos</a>
            <a href="/#vendedores" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Vendedores</a>
            <a href="/#contacto" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Contacto</a>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-slate-500 hover:text-slate-900 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-slate-500 hover:text-slate-900 transition-colors relative">
              <MessageCircle className="w-5 h-5" />
            </button>
            
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                <button className="text-slate-500 hover:text-slate-900 transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name || "Profile"} className="w-8 h-8 rounded-full border border-slate-200" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">{user.email?.charAt(0).toUpperCase()}</div>
                  )}
                  <span className="text-sm font-bold text-slate-900">{user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}</span>
                </Link>
              </div>
            ) : (
              <button onClick={signInWithGoogle} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm shadow-blue-200">
                <User className="w-4 h-4" />
                Iniciar sesión / Registro
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-900 p-2 -mr-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 max-h-[70vh] overflow-y-auto">
          <div className="px-4 pt-4 pb-20 space-y-2 shadow-inner">
            <Link to="/tienda" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-slate-900 bg-slate-50 rounded-xl">Tienda</Link>
            <a href="/#categorias" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 rounded-xl">Categorías</a>
            <a href="/#ofertas" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 rounded-xl">Ofertas</a>
            <a href="/#productos" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 rounded-xl">Productos</a>
            <a href="/#vendedores" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 rounded-xl">Vendedores</a>
            <a href="/#contacto" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 rounded-xl">Contacto</a>
            <div className="mt-6 px-2 pb-4">
              {user ? (
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 w-full bg-slate-100 hover:bg-slate-200 text-slate-900 px-6 py-3.5 rounded-xl font-bold transition-colors">
                  <User className="w-5 h-5" /> Mi Cuenta
                </Link>
              ) : (
                <button onClick={() => { signInWithGoogle(); setIsOpen(false); }} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-bold transition-colors">
                  <User className="w-5 h-5" /> Iniciar sesión / Registro
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
