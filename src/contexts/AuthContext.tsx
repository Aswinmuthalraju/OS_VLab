import React, { createContext, useState, useEffect, useContext } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/supabase';
import type { AppUser, CurrentUser } from '@/types';

function mapUser(user: User): AppUser {
  return {
    uid: user.id,
    email: user.email,
    displayName: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
    photoURL: user.user_metadata?.avatar_url ?? null,
  };
}

interface AuthContextType {
  currentUser: CurrentUser;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ? mapUser(session.user) : null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ? mapUser(session.user) : null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    loading,
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#e0e5ec]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#babecc] border-t-[#ff4757]" />
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#4a5568]">Initializing System…</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};