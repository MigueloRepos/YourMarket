import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Store from './pages/Store';
import Dashboard from './pages/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';

import { Toaster } from 'react-hot-toast';

export default function App() {
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

