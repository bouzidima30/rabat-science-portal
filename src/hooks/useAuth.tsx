
import { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return profileData;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setUser(null);
      setSession(null);
      setProfile(null);
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Auth: Starting initialization');
        
        // Obtenir la session actuelle
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
        } else {
          console.log('Auth: Session retrieved', { hasSession: !!session });
          setSession(session);
          setUser(session?.user ?? null);
          
          // Charger le profil si l'utilisateur est connecté
          if (session?.user) {
            try {
              const profileData = await fetchProfile(session.user.id);
              if (mounted) {
                setProfile(profileData);
              }
            } catch (error) {
              console.error('Error fetching profile:', error);
            }
          }
        }
        
        if (mounted) {
          setInitialized(true);
          setLoading(false);
          console.log('Auth: Initialization complete');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setInitialized(true);
          setLoading(false);
        }
      }
    };

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change event:', event);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setLoading(false);
          return;
        }
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            // Utiliser setTimeout pour éviter les deadlocks
            setTimeout(async () => {
              try {
                const profileData = await fetchProfile(session.user.id);
                if (mounted) {
                  setProfile(profileData);
                }
              } catch (error) {
                console.error('Error fetching profile:', error);
              }
              setLoading(false);
            }, 0);
          } else {
            setLoading(false);
          }
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const isAdmin = useMemo(() => profile?.role === 'admin', [profile?.role]);

  return useMemo(() => ({
    user,
    session,
    profile,
    loading,
    signOut,
    isAdmin,
    initialized
  }), [user, session, profile, loading, signOut, isAdmin, initialized]);
};
