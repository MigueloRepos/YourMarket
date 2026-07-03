import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

// Extend the Auth context to support our custom user from the 'Usuarios' table
type CustomUser = {
  id: string;
  Usuario: string;
  [key: string]: any;
};

interface AuthContextType {
  user: SupabaseUser | CustomUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setCustomUser: (user: CustomUser) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | CustomUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const customUserStr = localStorage.getItem('custom_user');
    if (customUserStr) {
      try {
        setUser(JSON.parse(customUserStr));
        setLoading(false);
      } catch (e) {
        console.error('Error parsing custom user');
      }
    } else {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });
    }

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!localStorage.getItem('custom_user')) {
        setUser(session?.user ?? null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const setCustomUser = (user: CustomUser) => {
    localStorage.setItem('custom_user', JSON.stringify(user));
    setUser(user);
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('custom_user');
      setUser(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout, setCustomUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
