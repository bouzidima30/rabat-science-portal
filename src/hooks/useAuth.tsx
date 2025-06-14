
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
        
        // Log successful login
        setTimeout(async () => {
          try {
            await supabase
              .from('activity_logs')
              .insert({
                user_id: userId,
                action: 'login',
                details: `Connexion réussie: ${profileData.full_name || profileData.email}`,
                ip_address: null,
                user_agent: navigator.userAgent
              });
            console.log('Login activity logged');
          } catch (error) {
            console.error('Error logging login:', error);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        
        console.log('Initial session:', session);
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
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
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    try {
      // Log logout before signing out
      if (user) {
        await logActivity('logout', `Déconnexion: ${profile?.full_name || profile?.email || 'Utilisateur'}`);
      }
      
      setUser(null);
      setSession(null);
      setProfile(null);
      
      await supabase.auth.signOut();
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
