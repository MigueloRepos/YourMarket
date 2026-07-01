import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types';
import { supabase } from '../lib/supabase';

interface ProductContextType {
  products: Product[];
  trendingProducts: Product[];
  bestSellers: Product[];
  loading: boolean;
  error: string | null;
}

const ProductContext = createContext<ProductContextType | null>(null);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('Productos')
          .select('*');

        if (error) {
          throw error;
        }

        setProducts(data || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const trendingProducts = products.filter(p => p.category === 'trending');
  const bestSellers = products.filter(p => p.category === 'bestseller');

  return (
    <ProductContext.Provider value={{ products, trendingProducts, bestSellers, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
