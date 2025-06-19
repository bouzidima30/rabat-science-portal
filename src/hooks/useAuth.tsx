
import { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authManager } from '@/lib/authManager';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
}

export const useAuth = () => {
  const [state, setState] = useState(() => authManager.getState());

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setState);
    return unsubscribe;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authManager.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }, []);

  const isAdmin = useMemo(() => authManager.isAdmin, [state.profile?.role]);

  return useMemo(() => ({
    user: state.user,
    session: state.session,
    profile: state.profile,
    loading: state.loading,
    signOut,
    isAdmin,
    initialized: state.initialized
  }), [state.user, state.session, state.profile, state.loading, signOut, isAdmin, state.initialized]);
};
