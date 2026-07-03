import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, LogIn, Chrome, ArrowRight, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle, setCustomUser } = useAuth();
  const navigate = useNavigate();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !phone)) {
      toast.error('Por favor, completa todos los campos requeridos');
      return;
    }
    
    if (!isLogin) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error('Por favor, ingresa un correo electrónico válido');
        return;
      }
      
      const phoneRegex = /^\d+$/;
      if (!phoneRegex.test(phone)) {
        toast.error('El número de teléfono solo debe contener números');
        return;
      }
      
      if (password.length < 6) {
        toast.error('La contraseña debe tener al menos 6 caracteres');
        return;
      }
    }
    
    setLoading(true);
    try {
      if (isLogin) {
        const { data, error } = await supabase
          .from('Usuarios')
          .select('*')
          .eq('Usuario', email)
          .eq('Contraseña', password)
          .single();

        if (error || !data) {
          throw new Error('Credenciales incorrectas');
        }
        
        // Actualizar la última fecha de acceso
        await supabase
          .from('Usuarios')
          .update({ Fecha_ult_acc: new Date().toISOString() })
          .eq('Usuario', email);
        
        setCustomUser({ id: data.id?.toString() || data.Usuario, Usuario: data.Usuario, ...data });
        toast.success('Login exitoso');
        navigate('/dashboard');
      } else {
        const { data: existingUser } = await supabase
          .from('Usuarios')
          .select('*')
          .eq('Usuario', email)
          .single();
          
        if (existingUser) {
          throw new Error('El usuario ya existe');
        }

        const { data, error } = await supabase
          .from('Usuarios')
          .insert([{ 
            Usuario: email, 
            Contraseña: password,
            'No Tel': phone,
            Fecha_Regis: new Date().toISOString(),
            Fecha_ult_acc: new Date().toISOString()
          }])
          .select()
          .single();

        if (error) {
          if (error.code === '42501') {
            throw new Error('Error de permisos: RLS activado en Supabase. Por favor, configura las políticas de inserción o desactiva RLS en la tabla Usuarios.');
          }
          throw error;
        }

        // The user might be able to insert but not select depending on RLS. If data is null but no error:
        const userData = data || { id: Date.now().toString(), Usuario: email, 'No Tel': phone };
        setCustomUser({ id: userData.id?.toString() || userData.Usuario, Usuario: userData.Usuario, ...userData });
        toast.success('Cuenta creada exitosamente');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error de autenticación');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle();
      // Google Auth redirects, so we don't need to navigate here
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión con Google');
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isLogin ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            {isLogin ? 'Inicia sesión para continuar comprando' : 'Únete a miles de compradores y vendedores'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleEmailAuth}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Usuario / Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all sm:text-sm bg-slate-50 focus:bg-white"
                  placeholder="Tu usuario o correo"
                />
              </div>
            </div>
            
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">No. Teléfono</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all sm:text-sm bg-slate-50 focus:bg-white"
                    placeholder="Tu número de teléfono"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all sm:text-sm bg-slate-50 focus:bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {isLogin && (
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">O continuar con</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleAuth}
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-xl shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
            >
              <Chrome className="w-5 h-5 text-red-500" />
              Google
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-slate-600">
          {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 font-bold text-blue-600 hover:text-blue-500 transition-colors"
          >
            {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
          </button>
        </div>
      </div>
    </main>
  );
}
