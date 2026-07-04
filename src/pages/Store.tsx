import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import SkeletonProductCard from '../components/SkeletonProductCard';
import { Product } from '../types';
import { Filter, SlidersHorizontal, Search } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import { toast } from 'react-hot-toast';

export default function Store() {
  const { products, loading } = useProducts();
  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [showFilters, setShowFilters] = useState(false);

  const toggleWishlist = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Prevent opening the modal
    const isNowWishlisted = !wishlist[product.id];
    setWishlist(prev => ({
      ...prev,
      [product.id]: isNowWishlisted
    }));
    
    if (isNowWishlisted) {
      toast.success(`${product.name} agregado a favoritos`);
    } else {
      toast.success(`${product.name} eliminado de favoritos`);
    }
  };

  // Combine all products for the store
  const allProducts: Product[] = products;
  
  // Sort by most sold (using reviews as a proxy for sales)
  const sortedProducts = [...allProducts].sort((a, b) => b.reviews - a.reviews);

  // Extract unique categories from actual products
  const realCategories = Array.from(new Set(allProducts.map(p => p.category).filter(Boolean))) as string[];

  const filteredProducts = sortedProducts.filter(p => {
    const matchesCategory = activeCategory === 'Todas' || p.category === activeCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchLower) || 
                          p.brand.toLowerCase().includes(searchLower) ||
                          (p.category && p.category.toLowerCase().includes(searchLower)) ||
                          (p.description && p.description.toLowerCase().includes(searchLower));
    const matchesPrice = p.price <= maxPrice;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Tienda</h1>
            <p className="text-slate-500">Encuentra los mejores productos, organizados por los más vendidos.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64 lg:w-80">
              <input 
                type="text" 
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 border px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${showFilters ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <Filter className="w-4 h-4" />
                Filtros
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          {showFilters && (
            <div className="w-full lg:w-64 shrink-0 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-in slide-in-from-left-4 duration-300">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" /> Filtros
                </h3>
                <button onClick={() => {
                  setSearchQuery('');
                  setMaxPrice(2000);
                  setActiveCategory('Todas');
                }} className="text-xs text-blue-600 font-medium hover:underline">Limpiar</button>
              </div>

              {/* Category Filter */}
              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-900 mb-3">Categorías</h4>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => setActiveCategory('Todas')}
                    className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${activeCategory === 'Todas' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    Todas
                  </button>
                  {realCategories.map((cat) => (
                    <button 
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${activeCategory === cat ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-900">Precio máximo</h4>
                  <span className="text-sm font-medium text-blue-600">${maxPrice}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="2000" 
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>$0</span>
                  <span>$2000+</span>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Categories Tabs (if filters are hidden) */}
            {!showFilters && (
              <div className="flex overflow-x-auto hide-scrollbar gap-3 mb-8 pb-2">
                <button 
                  onClick={() => setActiveCategory('Todas')}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                    activeCategory === 'Todas' 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Todas
                </button>
                {realCategories.map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                      activeCategory === cat 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Products Grid */}
            <motion.div layout className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${showFilters ? 'lg:grid-cols-3 xl:grid-cols-4' : 'lg:grid-cols-4 xl:grid-cols-5'} gap-6`}>
              <AnimatePresence mode="popLayout">
              {loading ? (
                // Skeletons
                Array.from({ length: 10 }).map((_, idx) => (
                  <motion.div
                    key={`skeleton-${idx}`}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SkeletonProductCard />
                  </motion.div>
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
                    key={product.id} 
                    className="relative"
                  >
                    {/* Add ranking badge for top 3 */}
                    {index < 3 && activeCategory === 'Todas' && !searchQuery && maxPrice === 2000 && (
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-amber-400 text-amber-900 rounded-full flex items-center justify-center font-bold z-20 shadow-lg border-2 border-white">
                        #{index + 1}
                      </div>
                    )}
                    <ProductCard 
                      product={product} 
                      onClick={() => setSelectedProduct(product)}
                      isWishlisted={!!wishlist[product.id]}
                      onToggleWishlist={(e) => toggleWishlist(e, product)}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  key="no-products"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="col-span-full text-center py-20 bg-white rounded-2xl border border-slate-100"
                >
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No hay productos</h3>
                  <p className="text-slate-500">Intenta ajustar los filtros o el término de búsqueda.</p>
                </motion.div>
              )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

      </div>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          isOpen={!!selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          isWishlisted={!!wishlist[selectedProduct.id]}
          onToggleWishlist={() => {
            setWishlist(prev => ({
              ...prev,
              [selectedProduct.id]: !prev[selectedProduct.id]
            }));
          }}
        />
      )}
    </div>
  );
}
