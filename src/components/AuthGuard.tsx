
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AuthGuard = React.memo(({ children, requireAdmin = false }: AuthGuardProps) => {
  const { user, profile, loading, initialized } = useAuth();

  // Attendre que l'authentification soit complètement initialisée
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006be5]"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && (!profile || profile.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
});

AuthGuard.displayName = 'AuthGuard';

export default AuthGuard;
