
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
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

  // For admin requirement, we'll check the email domain for now
  if (requireAdmin && !user.email?.includes('@um5.ac.ma')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
