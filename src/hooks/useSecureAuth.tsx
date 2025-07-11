import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Enhanced authentication hook with security features
export const useSecureAuth = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const cleanupAuthState = () => {
    // Remove all auth-related keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  const validatePassword = (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
      return { isValid: false, message: "Le mot de passe doit contenir au moins 8 caractères" };
    }
    
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { 
        isValid: false, 
        message: "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre" 
      };
    }
    
    return { isValid: true };
  };

  const secureSignUp = async (formData: {
    email: string;
    password: string;
    fullName: string;
  }) => {
    setLoading(true);
    
    try {
      // Validate input
      const sanitizedEmail = formData.email.trim().toLowerCase();
      const passwordValidation = validatePassword(formData.password);
      
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.message);
      }

      // Clean up existing auth state
      cleanupAuthState();

      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: formData.fullName.trim(),
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès.",
        });
        return { success: true, user: data.user };
      }
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const secureSignIn = async (email: string, password: string, loginAttempts: number = 0) => {
    setLoading(true);
    
    // Rate limiting check
    if (loginAttempts >= 5) {
      toast({
        title: "Trop de tentatives",
        description: "Veuillez attendre quelques minutes avant de réessayer",
        variant: "destructive",
      });
      setLoading(false);
      return { success: false, rateLimited: true };
    }

    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      const { error, data } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;

      toast({
        title: "Connexion réussie",
        description: "Redirection en cours...",
      });
      
      // Force page reload for clean state
      if (data.user) {
        window.location.href = '/';
      }
      
      return { success: true, user: data.user };
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
      return { success: false, error: error.message, incrementAttempts: true };
    } finally {
      setLoading(false);
    }
  };

  const secureSignOut = async () => {
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignore errors
      }
      
      // Force page reload for a clean state
      window.location.href = '/';
    } catch (error) {
      // Fallback: just reload the page
      window.location.reload();
    }
  };

  return {
    loading,
    secureSignUp,
    secureSignIn,
    secureSignOut,
    cleanupAuthState,
    validatePassword
  };
};