// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Obtener sesión inicial
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          // No bloqueamos el loading inicial con el perfil
          fetchProfile(session.user.id);
        }
      } catch (err) {
        console.error("AuthContext: Error getting initial session", err);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // 2. Escuchar cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setProfile(null);
        localStorage.removeItem("auth-token");
        localStorage.removeItem("userRole");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // maybeSingle es más seguro que single()

      if (!error && data) {
        setProfile(data);
        localStorage.setItem("auth-token", "supabase-active");
        localStorage.setItem("userRole", data.role || "patient");
      }
    } catch (err) {
      console.error("AuthContext: Error in fetchProfile", err);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("auth-token");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
