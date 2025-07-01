
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useSecurityLogger } from './useSecurityLogger';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { logAuthenticationEvent, logSecurityEvent } = useSecurityLogger();

  useEffect(() => {
    console.log('AuthProvider: Setting up auth listener');
    
    // Listen for auth changes first
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Log authentication events for security monitoring
      if (event === 'SIGNED_IN' && session?.user) {
        setTimeout(() => {
          logAuthenticationEvent(true, session.user.email, 'Successful login');
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        setTimeout(() => {
          logAuthenticationEvent(true, user?.email, 'User logged out');
        }, 0);
      } else if (event === 'TOKEN_REFRESHED') {
        setTimeout(() => {
          logSecurityEvent({
            action: 'token_refreshed',
            severity: 'info',
            category: 'authentication',
            details: 'User session token refreshed successfully'
          });
        }, 0);
      }
    });

    // Then get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          console.log('Initial session:', session?.user?.email);
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error in getSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
    } catch (error) {
      console.error('Error in signOut:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  console.log('AuthProvider render:', { user: user?.email, loading });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
