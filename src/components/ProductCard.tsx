import React from 'react';
import { Product } from '../types';
import { Heart, MessageCircle, Star } from 'lucide-react';

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
      className={`bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100 flex flex-col h-full relative cursor-pointer ${product.isWide ? 'md:col-span-2 md:flex-row md:items-center gap-6' : ''}`}
    >
      
      {/* Badges and Actions */}
      <div className={`absolute top-4 ${product.isWide ? 'left-4 right-auto' : 'left-4 right-4'} flex justify-between z-10 w-[calc(100%-32px)]`}>
        {product.badge ? (
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-md">
            {product.badge}
          </span>
        ) : (
          <div></div> // Spacer
        )}
        <button 
          onClick={onToggleWishlist}
          className={`transition-colors p-1.5 backdrop-blur-sm rounded-full shadow-sm ${isWishlisted ? 'text-red-500 bg-red-50 opacity-100' : 'text-slate-400 hover:text-red-500 bg-white/80 opacity-0 group-hover:opacity-100'}`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
        </button>
      </div>

      {/* Image */}
      <div className={`relative ${product.isWide ? 'w-full md:w-1/2 aspect-square md:aspect-auto md:h-full' : 'w-full aspect-[4/3]'} rounded-xl bg-slate-50 mb-4 overflow-hidden flex items-center justify-center`}>
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.discount && (
          <div className="absolute bottom-3 right-3 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full border border-blue-200">
            {product.discount}
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-col flex-grow ${product.isWide ? 'w-full md:w-1/2 py-2' : ''}`}>
        <h3 className="font-bold text-slate-900 text-lg mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-slate-500 mb-3">{product.brand}</p>
        
        <div className="flex items-center gap-1 mb-4">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-bold text-slate-700">{product.rating}</span>
          <span className="text-xs text-slate-400">({product.reviews})</span>
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-xl font-extrabold text-slate-900">${product.price}</span>
            {product.oldPrice && (
              <span className="text-sm text-slate-400 line-through ml-2">${product.oldPrice}</span>
            )}
          </div>
          
          <button className={`bg-slate-100 hover:bg-green-600 hover:text-white text-slate-700 p-2.5 rounded-xl transition-colors ${product.isWide ? 'px-6 flex items-center gap-2' : ''}`}>
            {product.isWide ? (
              <span className="text-sm font-bold">Pedir por WhatsApp</span>
            ) : (
              <MessageCircle className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
