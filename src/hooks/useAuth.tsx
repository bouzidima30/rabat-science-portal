
import { useState, useEffect, useCallback } from 'react';
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

  // Éviter les requêtes simultanées
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(false);

  const fetchProfile = useCallback(async (userId: string) => {
    if (fetchingProfile) return;
    setFetchingProfile(true);
    
    console.log('Fetching profile for user:', userId);
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
      } else if (profileData) {
        console.log('Profile loaded:', profileData);
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setFetchingProfile(false);
    }
  }, [fetchingProfile]);

  const logActivity = useCallback(async (action: string, details?: string) => {
    if (!user) return;

    try {
      // Vérification simple de session avant de logger
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession?.user) {
        console.warn('No valid session for activity logging');
        return;
      }

      await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          action,
          details: details || action,
          ip_address: null,
          user_agent: navigator.userAgent
        });

      console.log('Activity logged:', action);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }, [user]);

  useEffect(() => {
    let mounted = true;
    let authListener: any = null;

    const initializeAuth = async () => {
      try {
        // Configuration du listener d'état d'authentification
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;
            
            console.log('Auth state change:', event, session?.user?.email);
            
            // Éviter les rafraîchissements multiples
            if (event === 'TOKEN_REFRESHED' && isRefreshing) {
              console.log('Token refresh already in progress, skipping...');
              return;
            }

            if (event === 'TOKEN_REFRESHED') {
              setIsRefreshing(true);
              setTimeout(() => setIsRefreshing(false), 1000);
            }
            
            setSession(session);
            setUser(session?.user ?? null);
            
            if (event === 'SIGNED_OUT') {
              setProfile(null);
              setLoading(false);
              return;
            }
            
            if (session?.user && !profile && !fetchingProfile) {
              // Délai pour éviter les conflits
              setTimeout(() => {
                if (mounted) {
                  fetchProfile(session.user.id);
                }
              }, 500);
            }
            
            if (event === 'SIGNED_IN' && session?.user) {
              // Log d'activité avec délai plus long
              setTimeout(() => {
                if (mounted) {
                  logActivity('login', `Connexion: ${session.user.email}`);
                }
              }, 2000);
            }
            
            setLoading(false);
          }
        );

        authListener = subscription;

        // Vérification de session initiale
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (!mounted) return;
        
        console.log('Initial session check:', initialSession?.user?.email);
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user && !profile) {
          setTimeout(() => {
            if (mounted) {
              fetchProfile(initialSession.user.id);
            }
          }, 100);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, [fetchProfile, logActivity, profile, fetchingProfile, isRefreshing]);

  const signOut = useCallback(async () => {
    try {
      console.log('Signing out...');
      
      // Log de déconnexion avant la déconnexion
      if (user && profile) {
        try {
          await logActivity('logout', `Déconnexion: ${profile.full_name || profile.email || 'Utilisateur'}`);
        } catch (error) {
          console.error('Error logging logout:', error);
        }
      }
      
      // Nettoyer l'état local
      setUser(null);
      setSession(null);
      setProfile(null);
      
      // Déconnexion de Supabase
      await supabase.auth.signOut();
      
      // Redirection
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [user, profile, logActivity]);

  return {
    user,
    session,
    profile,
    loading,
    signOut,
    isAdmin: profile?.role === 'admin'
  };
};
