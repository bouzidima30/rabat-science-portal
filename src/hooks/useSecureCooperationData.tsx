import { useAuth } from "@/hooks/useAuth";

// Hook to filter sensitive cooperation data based on authentication status
export const useSecureCooperationData = () => {
  const { user } = useAuth();

  const filterCooperationData = (cooperation: any) => {
    if (!cooperation) return cooperation;
    
    // If user is not authenticated, remove sensitive email information
    // This provides defense-in-depth even though database policies should prevent this
    if (!user) {
      return {
        ...cooperation,
        email_coordinateur: null // Hide email for non-authenticated users
      };
    }
    
    // If user is authenticated, return full data
    return cooperation;
  };

  const filterCooperationsList = (cooperations: any[]) => {
    if (!cooperations) return cooperations;
    
    return cooperations.map(filterCooperationData);
  };

  const canViewCoordinatorEmail = () => {
    return !!user;
  };

  // Enhanced filtering for cooperation versions
  const filterCooperationVersionData = (version: any) => {
    if (!version) return version;
    
    // If user is not authenticated, remove sensitive email information
    if (!user) {
      return {
        ...version,
        email_coordinateur: null
      };
    }
    
    return version;
  };

  const filterCooperationVersionsList = (versions: any[]) => {
    if (!versions) return versions;
    
    return versions.map(filterCooperationVersionData);
  };

  return {
    filterCooperationData,
    filterCooperationsList,
    filterCooperationVersionData,
    filterCooperationVersionsList,
    canViewCoordinatorEmail,
    isAuthenticated: !!user
  };
};