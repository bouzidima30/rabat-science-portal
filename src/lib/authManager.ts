
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
}

type AuthListener = (state: AuthState) => void;

class AuthManager {
  private state: AuthState = {
    user: null,
    session: null,
    profile: null,
    loading: true,
    initialized: false,
  };

  private listeners: Set<AuthListener> = new Set();
  private profileFetchPromise: Promise<Profile | null> | null = null;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.performInitialize();
    return this.initPromise;
  }

  private async performInitialize() {
    try {
      // Set up auth state listener first
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('AuthManager: Auth state change event:', event);
        
        // Update session and user immediately
        this.state.session = session;
        this.state.user = session?.user ?? null;
        
        // Handle profile fetch for signed in users
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user && !this.profileFetchPromise) {
            this.profileFetchPromise = this.fetchProfile(session.user.id);
            try {
              this.state.profile = await this.profileFetchPromise;
            } catch (error) {
              console.error('Error fetching profile:', error);
              this.state.profile = null;
            } finally {
              this.profileFetchPromise = null;
            }
          }
        } else if (event === 'SIGNED_OUT') {
          this.state.profile = null;
          this.profileFetchPromise = null;
        }
        
        this.state.loading = false;
        this.notifyListeners();
      });

      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting initial session:', error);
      } else {
        this.state.session = session;
        this.state.user = session?.user ?? null;
        
        if (session?.user) {
          try {
            this.state.profile = await this.fetchProfile(session.user.id);
          } catch (error) {
            console.error('Error fetching initial profile:', error);
          }
        }
      }
      
      this.state.initialized = true;
      this.state.loading = false;
      this.notifyListeners();
      
    } catch (error) {
      console.error('Auth initialization error:', error);
      this.state.initialized = true;
      this.state.loading = false;
      this.notifyListeners();
    }
  }

  private async fetchProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener({ ...this.state });
      } catch (error) {
        console.error('Error in auth listener:', error);
      }
    });
  }

  public subscribe(listener: AuthListener): () => void {
    this.listeners.add(listener);
    
    // Immediately notify with current state if initialized
    if (this.state.initialized) {
      listener({ ...this.state });
    }
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): AuthState {
    return { ...this.state };
  }

  public async signOut(): Promise<void> {
    try {
      this.state.user = null;
      this.state.session = null;
      this.state.profile = null;
      this.profileFetchPromise = null;
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  public get isAdmin(): boolean {
    return this.state.profile?.role === 'admin';
  }
}

// Create singleton instance
export const authManager = new AuthManager();
