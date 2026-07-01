import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Package, Heart, Settings, LogOut, 
  CreditCard, Clock, MapPin, ChevronRight, BarChart3
} from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('resumen');
  const { user, loading, logout } = useAuth();
  const { trendingProducts, bestSellers, products } = useProducts();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      supabase.from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          setOrders(data || []);
        });
    }
  }, [user]);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 pt-32 pb-20 flex justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name || "User"} className="w-12 h-12 rounded-full border border-slate-100" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">{user.email?.charAt(0).toUpperCase()}</div>
                )}
                <div>
                  <h3 className="font-bold text-slate-900 truncate w-32">{user.user_metadata?.full_name || user.email?.split('@')[0]}</h3>
                  <p className="text-xs text-slate-500">Miembro activo</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                <button 
                  onClick={() => setActiveTab('resumen')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'resumen' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Resumen
                </button>
                <button 
                  onClick={() => setActiveTab('pedidos')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'pedidos' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Package className="w-5 h-5" />
                  Mis Pedidos
                </button>
                <button 
                  onClick={() => setActiveTab('deseos')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'deseos' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Heart className="w-5 h-5" />
                  Lista de Deseos
                </button>
                <button 
                  onClick={() => setActiveTab('configuracion')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'configuracion' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Settings className="w-5 h-5" />
                  Configuración
                </button>
              </nav>
            </div>
            
            <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'resumen' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">Hola, {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]} 👋</h1>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                      <Package className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-slate-500 mb-1">Pedidos Activos</p>
                    <h3 className="text-2xl font-bold text-slate-900">2</h3>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
                      <Heart className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-slate-500 mb-1">En Lista de Deseos</p>
                    <h3 className="text-2xl font-bold text-slate-900">4</h3>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-4">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-slate-500 mb-1">Total Gastado</p>
                    <h3 className="text-2xl font-bold text-slate-900">$1,249.00</h3>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Category Chart */}
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      Intereses por Categoría
                    </h2>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-80 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Electrónica', value: 45, color: '#3b82f6' },
                              { name: 'Ropa', value: 25, color: '#10b981' },
                              { name: 'Hogar', value: 20, color: '#f59e0b' },
                              { name: 'Otros', value: 10, color: '#64748b' }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {[
                              { color: '#3b82f6' },
                              { color: '#10b981' },
                              { color: '#f59e0b' },
                              { color: '#64748b' }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ fontWeight: 'bold' }}
                          />
                          <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-slate-900">Actividad Reciente</h2>
                      <button onClick={() => setActiveTab('pedidos')} className="text-sm font-medium text-blue-600 hover:underline">
                        Ver todos
                      </button>
                    </div>
                    
                    {orders.length > 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                      {orders.slice(0, 3).map((order) => {
                        const product = products.find(p => parseInt(p.id!) === order.product_id);
                        if (!product) return null;
                        return (
                          <div key={order.id} className="p-4 sm:p-6 border-b border-slate-100 last:border-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                                <img src={product.image} className="w-10 h-10 object-cover mix-blend-multiply" alt={product.name} />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">Pedido #ORD-{order.id}</p>
                                <p className="text-sm text-slate-500 truncate w-32 sm:w-auto">{product.name} (x{order.quantity})</p>
                              </div>
                            </div>
                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                              <p className="font-bold text-slate-900">${(product.price * order.quantity).toFixed(2)}</p>
                              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md ${order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                {order.status === 'pending' ? <><Clock className="w-3.5 h-3.5" /> Pendiente</> : order.status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    ) : (
                      <div className="bg-slate-50 rounded-2xl p-6 text-center text-slate-500">
                        No hay actividad reciente.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'pedidos' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Mis Pedidos</h1>
                <p className="text-slate-500 mb-8">Aquí puedes ver el historial completo y estado de tus compras.</p>
                
                <div className="space-y-4">
                  {orders.length > 0 ? orders.map((order, i) => {
                    const product = products.find(p => parseInt(p.id!) === order.product_id);
                    if (!product) return null;
                    return (
                      <div key={order.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row gap-6">
                        <div className="w-24 h-24 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                          <img src={product.image} className="w-16 h-16 object-cover mix-blend-multiply" alt={product.name} />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-bold text-lg text-slate-900">{product.name} (x{order.quantity})</h3>
                              <p className="text-sm text-slate-500">{product.brand}</p>
                            </div>
                            <p className="font-extrabold text-slate-900 text-lg">${(product.price * order.quantity).toFixed(2)}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 mt-4 text-sm">
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Package className="w-4 h-4" />
                              Pedido #ORD-{order.id}
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Clock className="w-4 h-4" />
                              {new Date(order.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1.5 text-amber-600 font-medium bg-amber-50 px-2.5 py-1 rounded-md">
                              {order.status === 'pending' ? 'Pendiente' : order.status}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 justify-center">
                          <button className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors w-full md:w-auto text-center">
                            Comprar de nuevo
                          </button>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-slate-900 mb-2">No tienes pedidos</h3>
                      <p className="text-slate-500 mb-6">Aún no has realizado ninguna compra.</p>
                      <button onClick={() => setActiveTab('resumen')} className="text-blue-600 font-bold hover:underline">
                        Volver al inicio
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'deseos' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Lista de Deseos</h1>
                <p className="text-slate-500 mb-8">Tus productos guardados para comprar más tarde.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bestSellers.slice(0,4).map((product, i) => (
                    <ProductCard 
                      key={i} 
                      product={{...product, isWide: false}} 
                      isWishlisted={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'configuracion' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Configuración</h1>
                <p className="text-slate-500 mb-8">Administra los detalles de tu cuenta y preferencias.</p>
                
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-4">Información Personal</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                        <input type="text" defaultValue={user.user_metadata?.full_name || ''} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                        <input type="email" defaultValue={user.email || ''} readOnly className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-500 focus:outline-none" />
                      </div>
                    </div>
                    <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors">
                      Guardar Cambios
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Direcciones de Envío</h3>
                    <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-slate-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">Casa</p>
                        <p className="text-sm text-slate-500 mb-2">123 Calle Principal, Ciudad, CP 12345</p>
                        <div className="flex gap-3">
                          <button className="text-xs font-medium text-blue-600 hover:underline">Editar</button>
                          <button className="text-xs font-medium text-red-600 hover:underline">Eliminar</button>
                        </div>
                      </div>
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Predeterminada</span>
                    </div>
                    <button className="mt-4 w-full border border-dashed border-slate-300 rounded-xl py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                      + Agregar nueva dirección
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
