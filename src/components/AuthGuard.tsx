
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AuthGuard = ({ children, requireAdmin = false }: AuthGuardProps) => {
  const { user, profile, loading } = useAuth();

  // Affichage du loader pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006be5] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Chargement...</p>
        </div>
      </div>
    );
  }

  // Redirection vers la page de connexion si non authentifié
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Vérification des droits admin si requis
  if (requireAdmin && (!profile || profile.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Accès non autorisé
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
