import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Store from './pages/Store';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';

import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';

export default function App() {
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        if (!buckets?.find(b => b.name === 'YourMarket')) {
          await supabase.storage.createBucket('YourMarket', { public: true });
        }

        const { data: products } = await supabase.from('Productos').select('Categoria');
        if (products) {
          const uniqueCategories = Array.from(new Set(products.map(p => p.Categoria).filter(Boolean)));
          
          for (const category of uniqueCategories) {
            const safeCategory = String(category).replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
            const keepPath = `Productos/Categorias/${safeCategory}/.keep`;
            
            const fileContent = new Blob([''], { type: 'text/plain' });
            await supabase.storage.from('YourMarket').upload(keepPath, fileContent, {
              upsert: false
            });
          }
        }
      } catch (error) {
        console.error('Error initializing storage:', error);
      }
    };
    
    initializeStorage();
  }, []);

  return (
    <AuthProvider>
      <ProductProvider>
        <Router>
          <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 pb-20 md:pb-0">
            <Toaster position="top-right" />
            <Navbar />
            
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tienda" element={<Store />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
            </Routes>

            <div id="contacto">
              <Footer />
            </div>
            <BottomNav />
          </div>
        </Router>
      </ProductProvider>
    </AuthProvider>
  );
}

