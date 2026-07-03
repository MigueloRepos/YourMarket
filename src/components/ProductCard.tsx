import React from 'react';
import { Product } from '../types';
import { Heart, MessageCircle, Star, Package, TrendingUp } from 'lucide-react';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onClick?: () => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (e: React.MouseEvent) => void;
}

export default function ProductCard({ product, onClick, isWishlisted, onToggleWishlist }: ProductCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white/60 backdrop-blur-xl rounded-[24px] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group border border-white/80 flex flex-col h-full relative cursor-pointer overflow-hidden ${product.isWide ? 'md:col-span-2 md:flex-row md:items-center gap-6' : ''}`}
    >
      {/* Decorative gradient blob for glass effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl -z-10 group-hover:bg-blue-400/20 transition-colors duration-500"></div>
      
      {/* Badges and Actions */}
      <div className={`absolute top-5 ${product.isWide ? 'left-5 right-auto' : 'left-5 right-5'} flex justify-between z-10 w-[calc(100%-40px)]`}>
        {product.badge ? (
          <span className="bg-amber-100/80 backdrop-blur-md text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-amber-200/50">
            {product.badge}
          </span>
        ) : (
          <span className="bg-white/70 backdrop-blur-md text-slate-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-white/50">
            {product.category || 'General'}
          </span>
        )}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist?.(e);
          }}
          className={`transition-all p-2 backdrop-blur-md rounded-full shadow-sm border border-white/50 ${isWishlisted ? 'text-red-500 bg-red-50/80 opacity-100 scale-100' : 'text-slate-400 hover:text-red-500 bg-white/70 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'}`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
        </button>
      </div>

      {/* Image */}
      <div className={`relative ${product.isWide ? 'w-full md:w-1/2 aspect-square md:aspect-auto md:h-full' : 'w-full aspect-[4/3]'} rounded-[18px] bg-white/40 mb-4 overflow-hidden flex items-center justify-center border border-white/50 shadow-inner`}>
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {product.discount && (
          <div className="absolute bottom-3 right-3 bg-blue-100/90 backdrop-blur-md text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-200/50 shadow-sm">
            {product.discount}
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-col flex-grow z-10 ${product.isWide ? 'w-full md:w-1/2 py-2' : ''}`}>
        <h3 className="font-extrabold text-slate-900 text-lg mb-1 line-clamp-1">{product.name}</h3>
        
        <p className="text-xs text-slate-500 mb-2 font-medium flex justify-between items-center">
          <span>Por: {product.brand}</span>
          <span className="flex items-center gap-1 text-slate-600 bg-slate-100/50 px-2 py-0.5 rounded-md border border-slate-200/50">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {product.rating} ({product.reviews})
          </span>
        </p>

        <p className="text-sm text-slate-600 line-clamp-2 mb-3 leading-relaxed opacity-90">
          {product.description}
        </p>
        
        <div className="flex items-center gap-3 mb-4 text-xs font-semibold">
          <div className="flex items-center gap-1 text-green-700 bg-green-50/80 border border-green-100/50 px-2.5 py-1 rounded-md backdrop-blur-sm">
            <Package className="w-3 h-3" />
            Stock: {product.stock || 0}
          </div>
          <div className="flex items-center gap-1 text-blue-700 bg-blue-50/80 border border-blue-100/50 px-2.5 py-1 rounded-md backdrop-blur-sm">
            <TrendingUp className="w-3 h-3" />
            Vendidos: {product.sold || 0}
          </div>
        </div>
        
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{product.precioStr || `$${product.price}`}</span>
            {product.oldPrice && (
              <span className="text-xs text-slate-400 line-through font-medium ml-1">${product.oldPrice}</span>
            )}
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            className={`bg-slate-900/5 hover:bg-slate-900 hover:text-white backdrop-blur-md text-slate-700 p-3 rounded-full transition-all duration-300 shadow-sm border border-slate-200/50 ${product.isWide ? 'px-6 flex items-center gap-2 rounded-2xl' : ''}`}
          >
            {product.isWide ? (
              <span className="text-sm font-bold">Ver Detalles</span>
            ) : (
              <MessageCircle className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
