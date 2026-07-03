import React from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { categories, features, topSellers, testimonials } from '../data';
import { 
  Smartphone, Shirt, Sofa, Laptop, ChevronRight, ChevronLeft, 
  ShieldCheck, Rocket, Lock, Award, Heart, Star, CheckCircle2, MessageCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';

const IconMap: Record<string, React.ElementType> = {
  Smartphone, Shirt, Sofa, Laptop, ShieldCheck, Rocket, Lock, Award, MessageCircle
};

function SectionHeader({ title, actionText, actionLink }: { title: string, actionText?: string, actionLink?: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      {actionText && (
        <div className="flex items-center gap-4">
          {actionLink ? (
            <Link to={actionLink} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1 group">
              {actionText} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <button className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1 group">
              {actionText} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-2">
            <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-400">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-800">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const { products, trendingProducts, bestSellers, loading } = useProducts();

  const availableCategories = React.useMemo(() => {
    const categoryCounts: Record<string, number> = {};
    products.forEach(p => {
      const cat = p.category || 'General';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    return Object.entries(categoryCounts).map(([cat, count], index) => {
      const icons = ['Smartphone', 'Shirt', 'Sofa', 'Laptop'];
      const bgColors = ['bg-blue-50', 'bg-indigo-50', 'bg-amber-50', 'bg-emerald-50'];
      const textColors = ['text-blue-600', 'text-indigo-600', 'text-amber-600', 'text-emerald-600'];
      
      return {
        id: cat,
        name: cat,
        count: `${count} Productos`,
        icon: icons[index % icons.length],
        bgColor: bgColors[index % bgColors.length],
        iconColor: textColors[index % textColors.length]
      };
    });
  }, [products]);

  return (
    <main>
      <Hero />
      
      {/* Categorías Destacadas */}
      <section id="categorias" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Categorías Destacadas" actionText="Ver todas las categorías" actionLink="/tienda" />
        {loading ? (
          <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
        ) : availableCategories.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No existen categorías disponibles aún.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {availableCategories.map((category) => {
              const Icon = IconMap[category.icon] || Smartphone;
              return (
                <Link to={`/tienda?categoria=${category.name.toLowerCase()}`} key={category.id} className="group bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 rounded-2xl p-6 transition-all duration-300 cursor-pointer flex items-center justify-between shadow-sm hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${category.bgColor} ${category.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{category.name}</h3>
                      <p className="text-sm text-slate-500">{category.count}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Productos en Tendencia */}
      <section id="productos" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
        <SectionHeader title="Productos en Tendencia" actionText="Ver todos" actionLink="/tienda" />
        {loading ? (
          <div className="flex justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
        ) : trendingProducts.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No existen productos disponibles aún.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Value Props / Features */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = IconMap[feature.icon];
            return (
              <div key={feature.id} className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${feature.bgColor} ${feature.iconColor} mb-4`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Productos Más Vendidos */}
      <section id="ofertas" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50/50">
        <SectionHeader title="Productos Más Vendidos" actionText="Ver todos" actionLink="/tienda" />
        {loading ? (
          <div className="flex justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
        ) : bestSellers.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No existen productos disponibles aún.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Cómo Funciona */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Cómo Funciona</h2>
        </div>
        
        <div className="relative">
          {/* Dashed line connecting steps (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-blue-200 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6 relative z-10">
            {[
              { step: 1, title: 'Crear Cuenta', desc: 'Regístrate gratis en unos simples minutos' },
              { step: 2, title: 'Explorar Tienda', desc: 'Encuentra los productos que más te gustan' },
              { step: 3, title: 'Pedir por WhatsApp', desc: 'Envía tu pedido directamente y fácil' },
              { step: 4, title: 'Recibir Pedido', desc: 'Recibe tu producto en la puerta de tu casa' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-blue-50 border-8 border-white shadow-xl flex items-center justify-center mb-6 relative">
                  <span className="text-2xl font-bold text-blue-600">{item.step}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 px-4">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vendedores Top */}
      <section id="vendedores" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
        <SectionHeader title="Vendedores Top" actionText="Ver todos" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topSellers.map((seller) => (
            <div key={seller.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
              <div className="relative">
                <img src={seller.avatar} alt={seller.name} className="w-16 h-16 rounded-full object-cover" />
                {seller.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 fill-white" />
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-slate-900">{seller.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold">{seller.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-2">Vendedor Verificado</p>
                <div className="flex gap-4 text-xs font-medium text-slate-700">
                  <div><span className="text-blue-600">{seller.sales}</span> Ventas</div>
                  <div><span className="text-blue-600">{seller.products}</span> Productos</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <SectionHeader title="Lo que dicen nuestros usuarios" actionText="Ver todos" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow relative">
              <Heart className="absolute top-8 right-8 w-5 h-5 text-slate-300 hover:text-red-500 transition-colors cursor-pointer" />
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed font-medium mb-8">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-3">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
                <span className="font-bold text-slate-900">{testimonial.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
