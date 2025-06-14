
import { useToast } from "@/hooks/use-toast";

export const useToastNotifications = () => {
  const { toast } = useToast();

  const showSuccess = (title: string, description?: string) => {
    toast({
      title,
      description,
      duration: 3000,
    });
  };

  const showError = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive",
      duration: 5000,
    });
  };

  const showWarning = (title: string, description?: string) => {
    toast({
      title,
      description,
      className: "bg-yellow-50 border-yellow-200 text-yellow-800",
      duration: 4000,
    });
  };

  const showInfo = (title: string, description?: string) => {
    toast({
      title,
      description,
      className: "bg-blue-50 border-blue-200 text-blue-800",
      duration: 4000,
    });
  };

  const showLoading = (title: string, description?: string) => {
    return toast({
      title,
      description,
      duration: Infinity, // Keep until manually dismissed
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    toast
  };
};
