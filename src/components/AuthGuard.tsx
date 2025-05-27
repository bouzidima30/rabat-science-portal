
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AuthGuard = ({ children, requireAdmin = false }: AuthGuardProps) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006be5]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  //if (requireAdmin && (!profile || profile.role !== 'admin')) {
  //  return <Navigate to="/" replace />;
  //}

  return <>{children}</>;
};

export default AuthGuard;
