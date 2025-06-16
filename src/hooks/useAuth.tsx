
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

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (profileData) {
        console.log('Profile loaded:', profileData);
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Vérifier la session existante
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (currentSession?.user) {
          console.log('Session existante trouvée:', currentSession.user.email);
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Charger le profil après un délai
          setTimeout(() => {
            if (mounted) {
              fetchProfile(currentSession.user.id);
            }
          }, 500);
        }

        // Configurer le listener d'état d'authentification
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;
            
            console.log('Auth state change:', event, session?.user?.email);
            
            setSession(session);
            setUser(session?.user ?? null);
            
            if (event === 'SIGNED_OUT') {
              setProfile(null);
            }
            
            if (event === 'SIGNED_IN' && session?.user && !profile) {
              // Charger le profil après connexion avec un délai plus long
              setTimeout(() => {
                if (mounted) {
                  fetchProfile(session.user.id);
                }
              }, 1000);
            }
          }
        );

        setLoading(false);

        return () => {
          subscription.unsubscribe();
        };
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
    };
  }, [fetchProfile, profile]);

  const signOut = useCallback(async () => {
    try {
      console.log('Déconnexion en cours...');
      
      // Nettoyer l'état local immédiatement
      setUser(null);
      setSession(null);
      setProfile(null);
      
      // Déconnexion de Supabase
      await supabase.auth.signOut();
      
      // Redirection forcée
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      // Forcer la redirection même en cas d'erreur
      window.location.href = '/';
    }
  }, []);

  return {
    user,
    session,
    profile,
    loading,
    signOut,
    isAdmin: profile?.role === 'admin'
  };
};
