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

        const mappedProducts: Product[] = (data || []).map((p: any) => ({
          id: p.id?.toString() || '',
          name: p.Product_name || p.Nombre || p.name || 'Sin nombre',
          price: typeof p.Precio === 'string' ? parseFloat(p.Precio) || 0 : (p.Precio || p.price || 0),
          precioStr: p.Precio, // keep string for display if needed
          originalPrice: p.originalPrice,
          image: p.Product_url_images || p.Imagen || p.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
          category: p.Categoria || p.category || 'General',
          brand: p.Vendedor || p.Marca || p.brand || 'Genérico',
          description: p.Product_descrip || p.Descripcion || p.description || 'Sin descripción',
          rating: p.rating || 5,
          reviews: p.reviews || 0,
          vendedorPhone: p['No Telefono'] || p['No Tel'] || '',
          dbId: p.id,
          stock: p.Cantidad_dispon || 0,
          sold: p.Cant_vendida || 0
        }));

        setProducts(mappedProducts);
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
