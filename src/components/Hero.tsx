import React from 'react';
import { Star, Truck, ShieldCheck, ChevronRight } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-[#f8fafc] pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Abstract Background Elements */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-blue-100 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-[80px] opacity-60 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100/50 text-amber-700 text-sm font-semibold mb-6 border border-amber-200/50">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Marketplace #1</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Compra, Vende y Descubre Productos Increíbles <span className="text-blue-600 relative whitespace-nowrap">
                en un Solo Lugar
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-200/60" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
                </svg>
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
              Marketplace moderno donde encuentras compradores y vendedores con una experiencia premium, segura y confiable.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-medium transition-all shadow-lg shadow-blue-200 flex items-center gap-2 group">
                Comprar Ahora
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-3.5 rounded-full font-medium transition-colors">
                Explorar Categorías
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-6 border-t border-slate-200/60">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                    <span className="text-slate-700 font-bold">🛒</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-900">25K+</span>
                </div>
                <p className="text-sm text-slate-500 font-medium ml-10">Productos</p>
              </div>
              
              <div className="w-px h-12 bg-slate-200"></div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                    <span className="text-slate-700 font-bold">👥</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-900">12K+</span>
                </div>
                <p className="text-sm text-slate-500 font-medium ml-10">Vendedores</p>
              </div>

              <div className="hidden sm:block w-px h-12 bg-slate-200"></div>
              
              <div className="hidden sm:block">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-2xl font-bold text-slate-900">98%</span>
                </div>
                <p className="text-sm text-slate-500 font-medium ml-10">Satisfacción</p>
              </div>
            </div>
          </div>

          {/* Right Image Composition */}
          <div className="relative mt-12 lg:mt-0 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] aspect-square">
              {/* Main Headphones Image */}
              <img 
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&fm=webp" 
                alt="Premium Headphones" 
                className="w-full h-full object-cover rounded-[40px] shadow-2xl rotate-[-5deg] hover:rotate-0 transition-transform duration-700"
              />
              
              {/* Floating Badge 1: Offer */}
              <div className="absolute -top-6 -right-6 sm:top-4 sm:-right-12 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 w-[180px] animate-bounce" style={{ animationDuration: '4s' }}>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Oferta del día</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-3xl font-bold text-slate-900 leading-none">40%</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">dto. en App</p>
                  </div>
                  <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&q=80" alt="Watch" className="w-12 h-12 rounded-lg object-cover" />
                </div>
              </div>

              {/* Floating Badge 2: Shipping */}
              <div className="absolute bottom-1/4 -left-6 sm:-left-12 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Envío Rápido</p>
                  <p className="text-xs text-slate-500">1-5 días reales</p>
                </div>
              </div>

              {/* Floating Badge 3: Rating */}
              <div className="absolute -bottom-6 right-10 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-white/50">
                <div className="flex gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-amber-400 text-amber-400' : 'fill-amber-400 text-amber-400'}`} />
                  ))}
                  <span className="ml-2 font-bold text-slate-900 text-sm">4.9 <span className="text-slate-500 font-normal">(136)</span></span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Calificación</p>
              </div>

              {/* Decorative Rings */}
              <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[120%] aspect-[3/1] border-[3px] border-blue-200/30 rounded-full blur-[2px]"></div>
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[100%] aspect-[3/1] border-[2px] border-blue-300/40 rounded-full blur-[1px]"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
