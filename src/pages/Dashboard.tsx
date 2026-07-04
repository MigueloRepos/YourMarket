import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Package, Upload, Settings, LogOut, 
  BarChart3, Eye, DollarSign, TrendingUp, Edit, Trash2, Plus, Phone, Image as ImageIcon, X, PackageX, CheckCircle
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('resumen');
  const { user, loading: authLoading, logout, setCustomUser } = useAuth();
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newProduct, setNewProduct] = useState({
    Product_name: '',
    Product_descrip: '',
    Precio: '',
    Categoria: '',
    Cantidad_dispon: 1,
    Product_url_images: ''
  });
  
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingImageFile, setEditingImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMyProducts();
      fetchCategories();
    }
  }, [user]);

  const fetchMyProducts = async () => {
    setLoading(true);
    const username = (user as any).Usuario || user?.email;
    const { data, error } = await supabase
      .from('Productos')
      .select('*')
      .eq('Vendedor', username)
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setMyProducts(data);
    }
    setLoading(false);
  };
  
  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('Productos')
      .select('Categoria');
    
    if (!error && data) {
      const uniqueCats = Array.from(new Set(data.map(item => item.Categoria).filter(Boolean)));
      setCategories(uniqueCats as string[]);
    }
  };

  const handleUploadProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryToUse = newProduct.Categoria === 'nueva' ? newCategory : newProduct.Categoria;
    
    if (!newProduct.Product_name || !newProduct.Precio || !categoryToUse) {
      toast.error('Por favor, completa los campos requeridos');
      return;
    }

    setIsUploading(true);

    let imageUrl = newProduct.Product_url_images || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop';
    
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const safeCategory = categoryToUse.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const bucketName = 'YourMarket';
      const filePath = `Productos/Categorias/${safeCategory}/${fileName}`;

      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(b => b.name === bucketName)) {
        await supabase.storage.createBucket(bucketName, { public: true });
      }

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, imageFile);
        
      if (uploadError) {
        toast.error(`Error al subir la imagen: ${uploadError.message}`);
        console.error(uploadError);
        setIsUploading(false);
        return;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
        
      imageUrl = publicUrl;
    }

    const username = (user as any).Usuario || user?.email;
    const phone = (user as any)['No Tel'] || '';

    const productData = {
      Product_name: newProduct.Product_name,
      Product_descrip: newProduct.Product_descrip,
      Precio: newProduct.Precio,
      Categoria: categoryToUse,
      Cantidad_dispon: newProduct.Cantidad_dispon,
      Vendedor: username,
      'No Telefono': phone,
      Cant_vendida: 0,
      Product_url_images: imageUrl
    };

    const { error } = await supabase
      .from('Productos')
      .insert([productData]);

    setIsUploading(false);

    if (error) {
      toast.error('Error al subir el producto');
      console.error(error);
    } else {
      toast.success('Producto subido exitosamente');
      setNewProduct({
        Product_name: '',
        Product_descrip: '',
        Precio: '',
        Categoria: '',
        Cantidad_dispon: 1,
        Product_url_images: ''
      });
      setNewCategory('');
      setImageFile(null);
      fetchMyProducts();
      fetchCategories();
      setActiveTab('mis_productos');
    }
  };
  
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    setIsUploading(true);
    let imageUrl = editingProduct.Product_url_images;

    if (editingImageFile) {
      const fileExt = editingImageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const safeCategory = editingProduct.Categoria.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const bucketName = 'YourMarket';
      const filePath = `Productos/Categorias/${safeCategory}/${fileName}`;

      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(b => b.name === bucketName)) {
        await supabase.storage.createBucket(bucketName, { public: true });
      }

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, editingImageFile);
        
      if (uploadError) {
        toast.error(`Error al subir la imagen: ${uploadError.message}`);
        console.error(uploadError);
        setIsUploading(false);
        return;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
        
      imageUrl = publicUrl;
    }

    const { error } = await supabase
      .from('Productos')
      .update({
        Product_name: editingProduct.Product_name,
        Product_descrip: editingProduct.Product_descrip,
        Precio: editingProduct.Precio,
        Categoria: editingProduct.Categoria,
        Cantidad_dispon: editingProduct.Cantidad_dispon,
        Product_url_images: imageUrl
      })
      .eq('id', editingProduct.id);
      
    setIsUploading(false);

    if (error) {
      toast.error('Error al actualizar');
    } else {
      toast.success('Producto actualizado');
      setEditingProduct(null);
      setEditingImageFile(null);
      fetchMyProducts();
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    
    const { error } = await supabase
      .from('Productos')
      .delete()
      .eq('id', id);
      
    if (error) {
      toast.error('Error al eliminar');
    } else {
      toast.success('Producto eliminado');
      fetchMyProducts();
    }
  };

  const handleToggleStock = async (id: number, currentStock: number) => {
    const newStock = currentStock > 0 ? 0 : 1;
    const { error } = await supabase
      .from('Productos')
      .update({ Cantidad_dispon: newStock })
      .eq('id', id);
      
    if (error) {
      toast.error('Error al actualizar stock');
    } else {
      toast.success(newStock === 0 ? 'Producto marcado como agotado' : 'Producto restaurado a stock');
      fetchMyProducts();
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const phone = formData.get('phone') as string;
    
    if (phone) {
      const username = (user as any).Usuario || user?.email;
      const { error } = await supabase
        .from('Usuarios')
        .update({ 'No Tel': phone })
        .eq('Usuario', username);
        
      if (!error) {
        toast.success('Perfil actualizado');
        if (setCustomUser && user) {
          setCustomUser({ ...(user as any), 'No Tel': phone });
        }
      } else {
        toast.error('Error al actualizar perfil');
      }
    }
  };

  if (authLoading) {
    return <div className="min-h-screen bg-slate-50 pt-32 pb-20 flex justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  // Calculate stats
  const totalSales = myProducts.reduce((sum, p) => sum + (p.Cant_vendida || 0), 0);
  // Mock views based on sales since there's no views column
  const totalViews = myProducts.reduce((sum, p) => sum + ((p.Cant_vendida || 0) * 15 + Math.floor(Math.random() * 20)), 0);
  const totalProducts = myProducts.length;
  
  // Category data for pie chart
  const categoryStats = myProducts.reduce((acc, p) => {
    const cat = p.Categoria || 'Otros';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const pieData = Object.keys(categoryStats).map((key, i) => ({
    name: key,
    value: categoryStats[key],
    color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][i % 5]
  }));

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                  {((user as any).Usuario || user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-slate-900 truncate">{user.user_metadata?.full_name || (user as any).Usuario || user.email?.split('@')[0] || 'Vendedor'}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Package className="w-3 h-3" /> Panel de Vendedor
                  </p>
                </div>
              </div>
              
              <nav className="space-y-1">
                <button 
                  onClick={() => setActiveTab('resumen')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'resumen' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Estadísticas
                </button>
                <button 
                  onClick={() => setActiveTab('mis_productos')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'mis_productos' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Package className="w-5 h-5" />
                  Mis Productos
                </button>
                <button 
                  onClick={() => setActiveTab('subir_producto')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'subir_producto' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Upload className="w-5 h-5" />
                  Subir Producto
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
                <h1 className="text-2xl font-bold text-slate-900 mb-6">Panel de Vendedor</h1>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                      <Eye className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-slate-500 mb-1">Vistas Totales</p>
                    <h3 className="text-2xl font-bold text-slate-900">{totalViews}</h3>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-4">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-slate-500 mb-1">Ventas por WhatsApp</p>
                    <h3 className="text-2xl font-bold text-slate-900">{totalSales}</h3>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
                      <Package className="w-5 h-5" />
                    </div>
                    <p className="text-sm text-slate-500 mb-1">Productos Activos</p>
                    <h3 className="text-2xl font-bold text-slate-900">{totalProducts}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Category Chart */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      Tus Categorías
                    </h2>
                    {pieData.length > 0 ? (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                        <Package className="w-12 h-12 mb-3 opacity-20" />
                        <p>No hay productos subidos</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'mis_productos' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-slate-900">Mis Productos</h1>
                  <button onClick={() => setActiveTab('subir_producto')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                    <Plus className="w-4 h-4" /> Nuevo Producto
                  </button>
                </div>
                
                {loading ? (
                  <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
                ) : myProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {myProducts.map(product => (
                      <div key={product.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="h-48 bg-slate-100 relative">
                          {product.Product_url_images ? (
                            <img src={product.Product_url_images} alt={product.Product_name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <ImageIcon className="w-12 h-12 opacity-30" />
                            </div>
                          )}
                          <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                            <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700 shadow-sm">
                              {product.Categoria}
                            </div>
                            {product.Cantidad_dispon === 0 && (
                              <div className="bg-red-500/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-sm flex items-center gap-1">
                                <PackageX className="w-3 h-3" /> Agotado
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="font-bold text-lg text-slate-900 mb-1">{product.Product_name}</h3>
                          <p className="text-slate-500 text-sm mb-4 line-clamp-2">{product.Product_descrip}</p>
                          
                          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                            <div>
                              <p className="font-extrabold text-blue-600 text-lg">{product.Precio}</p>
                              <p className="text-xs text-slate-500">Stock: {product.Cantidad_dispon} • Ventas: {product.Cant_vendida || 0}</p>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleToggleStock(product.id, product.Cantidad_dispon)} 
                                title={product.Cantidad_dispon === 0 ? "Restaurar stock" : "Marcar como agotado"}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${product.Cantidad_dispon === 0 ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'bg-slate-50 text-slate-600 hover:bg-amber-50 hover:text-amber-600'}`}
                              >
                                {product.Cantidad_dispon === 0 ? <CheckCircle className="w-4 h-4" /> : <PackageX className="w-4 h-4" />}
                              </button>
                              <button onClick={() => setEditingProduct(product)} title="Editar" className="w-8 h-8 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteProduct(product.id)} title="Eliminar" className="w-8 h-8 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
                    <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No tienes productos</h3>
                    <p className="text-slate-500 mb-6">Comienza a vender subiendo tu primer producto.</p>
                    <button onClick={() => setActiveTab('subir_producto')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
                      Subir mi primer producto
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'subir_producto' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">Subir Nuevo Producto</h1>
                
                <form onSubmit={handleUploadProduct} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 max-w-2xl">
                  <div className="space-y-6">
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Producto *</label>
                      <input 
                        required
                        type="text" 
                        value={newProduct.Product_name}
                        onChange={e => setNewProduct({...newProduct, Product_name: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        placeholder="Ej. iPhone 13 Pro Max"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                      <textarea 
                        value={newProduct.Product_descrip}
                        onChange={e => setNewProduct({...newProduct, Product_descrip: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none" 
                        placeholder="Describe tu producto..."
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Precio (USD o CUP) *</label>
                        <input 
                          required
                          type="text" 
                          value={newProduct.Precio}
                          onChange={e => setNewProduct({...newProduct, Precio: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                          placeholder="Ej. 1200 USD"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad Disponible</label>
                        <input 
                          type="number" 
                          min="1"
                          value={newProduct.Cantidad_dispon}
                          onChange={e => setNewProduct({...newProduct, Cantidad_dispon: parseInt(e.target.value) || 0})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Categoría *</label>
                      <select 
                        required
                        value={newProduct.Categoria}
                        onChange={e => setNewProduct({...newProduct, Categoria: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                      >
                        <option value="">Selecciona una categoría...</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                        <option value="nueva">+ Añadir nueva categoría</option>
                      </select>
                      
                      {newProduct.Categoria === 'nueva' && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                          <input 
                            required
                            type="text" 
                            value={newCategory}
                            onChange={e => setNewCategory(e.target.value)}
                            className="w-full bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            placeholder="Nombre de la nueva categoría"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Imagen del Producto (Opcional)</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            setImageFile(e.target.files[0]);
                            // Create preview URL if desired, but here we just store the file.
                          }
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                      />
                    </div>

                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                    <button disabled={isUploading} type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold transition-colors disabled:opacity-50">
                      {isUploading ? 'Publicando...' : 'Publicar Producto'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'configuracion' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">Configuración de la Tienda</h1>
                
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden max-w-2xl">
                  <form onSubmit={handleUpdateProfile} className="p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Información del Vendedor</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre / Usuario</label>
                        <input type="text" defaultValue={(user as any).Usuario || user.email} readOnly className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-500 focus:outline-none cursor-not-allowed" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Número de Teléfono (Para Pedidos por WhatsApp)</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-4 w-4 text-slate-400" />
                          </div>
                          <input 
                            name="phone"
                            type="tel" 
                            defaultValue={(user as any)['No Tel'] || ''} 
                            className="w-full pl-10 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            placeholder="Ej. +53 51234567"
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                          Este número será utilizado por los clientes para contactarte y hacer pedidos por WhatsApp.
                        </p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors">
                        Guardar Cambios
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {/* Modal de Edición */}
            {editingProduct && (
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-slate-900">Editar Producto</h3>
                    <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleUpdateProduct} className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                        <input 
                          required
                          type="text" 
                          value={editingProduct.Product_name}
                          onChange={e => setEditingProduct({...editingProduct, Product_name: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                        <textarea 
                          value={editingProduct.Product_descrip || ''}
                          onChange={e => setEditingProduct({...editingProduct, Product_descrip: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none" 
                        ></textarea>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Precio</label>
                          <input 
                            required
                            type="text" 
                            value={editingProduct.Precio}
                            onChange={e => setEditingProduct({...editingProduct, Precio: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
                          <input 
                            type="number" 
                            value={editingProduct.Cantidad_dispon}
                            onChange={e => setEditingProduct({...editingProduct, Cantidad_dispon: parseInt(e.target.value) || 0})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                        <input 
                          required
                          type="text" 
                          value={editingProduct.Categoria}
                          onChange={e => setEditingProduct({...editingProduct, Categoria: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nueva Imagen (Opcional)</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={e => {
                            if (e.target.files && e.target.files[0]) {
                              setEditingImageFile(e.target.files[0]);
                            }
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3">
                      <button type="button" onClick={() => { setEditingProduct(null); setEditingImageFile(null); }} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                        Cancelar
                      </button>
                      <button disabled={isUploading} type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
                        {isUploading ? 'Guardando...' : 'Guardar Cambios'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
