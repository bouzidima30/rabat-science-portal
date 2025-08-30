import { useAuth } from "@/hooks/useAuth";

// Hook to filter sensitive cooperation data based on authentication status
export const useSecureCooperationData = () => {
  const { user } = useAuth();

  const filterCooperationData = (cooperation: any) => {
    if (!cooperation) return cooperation;
    
    // If user is not authenticated, remove sensitive email information
    if (!user) {
      return {
        ...cooperation,
        email_coordinateur: undefined // Hide email for non-authenticated users
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

  return {
    filterCooperationData,
    filterCooperationsList,
    canViewCoordinatorEmail,
    isAuthenticated: !!user
  };
};