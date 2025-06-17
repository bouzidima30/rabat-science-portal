
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
}

// Cache global pour éviter les re-fetches
const authCache = {
  user: null as User | null,
  session: null as Session | null,
  profile: null as Profile | null,
  initialized: false
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(authCache.user);
  const [session, setSession] = useState<Session | null>(authCache.session);
  const [profile, setProfile] = useState<Profile | null>(authCache.profile);
  const [loading, setLoading] = useState(!authCache.initialized);
  const [initialized, setInitialized] = useState(authCache.initialized);
  const fetchingProfile = useRef(false);

  const fetchProfile = useCallback(async (userId: string) => {
    if (fetchingProfile.current) return authCache.profile;
    
    try {
      fetchingProfile.current = true;
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      authCache.profile = profileData;
      return profileData;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    } finally {
      fetchingProfile.current = false;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      // Clear cache first
      authCache.user = null;
      authCache.session = null;
      authCache.profile = null;
      authCache.initialized = true;
      
      setUser(null);
      setSession(null);
      setProfile(null);
      
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }, []);

  const updateAuthState = useCallback(async (newSession: Session | null) => {
    // Update cache
    authCache.session = newSession;
    authCache.user = newSession?.user ?? null;
    
    setSession(newSession);
    setUser(newSession?.user ?? null);
    
    if (newSession?.user && !authCache.profile) {
      try {
        const profileData = await fetchProfile(newSession.user.id);
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    } else if (!newSession?.user) {
      authCache.profile = null;
      setProfile(null);
    }
    
    if (!authCache.initialized) {
      authCache.initialized = true;
      setInitialized(true);
    }
    setLoading(false);
  }, [fetchProfile]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          setInitialized(true);
          return;
        }

        await updateAuthState(session);
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event);
        
        if (event === 'SIGNED_OUT') {
          authCache.user = null;
          authCache.session = null;
          authCache.profile = null;
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await updateAuthState(session);
        }
      }
    );

    // Si déjà initialisé, utiliser le cache
    if (authCache.initialized) {
      setUser(authCache.user);
      setSession(authCache.session);
      setProfile(authCache.profile);
      setLoading(false);
      setInitialized(true);
    } else {
      initializeAuth();
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [updateAuthState]);

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
