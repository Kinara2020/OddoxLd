import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    // Restore session from localStorage on mount
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signOut = () => supabase.auth.signOut();

  /** One-click demo login — used by the landing page CTA */
  const demoLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'demo@globetrotter.io',
      password: 'demo123',
    });
    if (data?.user) setUser(data.user);
    return { data, error };
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, demoLogin, currency, setCurrency }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);