
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
    }
  }, []);

  const logActivity = useCallback(async (action: string, details?: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          action,
          details,
          ip_address: null,
          user_agent: navigator.userAgent
        });

      if (error) {
        console.error('Error logging activity:', error);
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }, [user]);

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event, session);
        
        // Mettre à jour l'état immédiatement
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setLoading(false);
          return;
        }
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Différer les appels Supabase pour éviter les conflits
          setTimeout(async () => {
            if (mounted) {
              try {
                await fetchProfile(session.user.id);
                
                // Log d'activité différé
                setTimeout(async () => {
                  try {
                    await logActivity('login', `Connexion réussie: ${session.user.email}`);
                  } catch (error) {
                    console.error('Error logging login:', error);
                  }
                }, 2000);
              } catch (error) {
                console.error('Error in post-login actions:', error);
              } finally {
                setLoading(false);
              }
            }
          }, 500);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Pour les rafraîchissements de token, ne pas recharger le profil
          if (!profile) {
            setTimeout(() => {
              if (mounted) {
                fetchProfile(session.user.id).finally(() => setLoading(false));
              }
            }, 100);
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      }
    );

    // Initialisation
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        
        console.log('Initial session:', session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            if (mounted) {
              fetchProfile(session.user.id).finally(() => setLoading(false));
            }
          }, 100);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, logActivity, profile]);

  const signOut = useCallback(async () => {
    try {
      // Log de déconnexion avant de se déconnecter
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
