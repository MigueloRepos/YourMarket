import React from 'react';
import { Hexagon, Instagram, Facebook, Twitter, Youtube, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img src="/logo_your_market.png" alt="MarketX Logo" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold text-slate-900 tracking-tight">MarketX</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 pr-4">
              El marketplace moderno donde compras y vendes en un solo lugar, con envíos seguros y rápidos.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Marketplace</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 hover:text-blue-600 text-sm">Sobre Nosotros</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-600 text-sm">Blog</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-600 text-sm">Contacto</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-600 text-sm">Centro de Ayuda</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Categorías</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 hover:text-blue-600 text-sm">Electrónica</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-600 text-sm">Moda</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-600 text-sm">Hogar</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-600 text-sm">Tecnología</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-600 text-sm">Deportes</a></li>
            </ul>
          </div>

          {/* Links 3 */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 hover:text-blue-600 text-sm">Términos y Condiciones</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-600 text-sm">Política de Privacidad</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-600 text-sm">Política de Cookies</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-600 text-sm">Protección al Comprador</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-slate-900 mb-6">Suscríbete</h4>
            <p className="text-slate-500 text-sm mb-4">
              Recibe ofertas exclusivas y novedades.
            </p>
            <form className="relative">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                type="submit" 
                className="absolute right-1 top-1 bottom-1 aspect-square bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-center text-center">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} MarketX. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
