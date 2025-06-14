
import { useState, useCallback } from "react";
import { useToastNotifications } from "./useToastNotifications";

interface AsyncOperationOptions {
  successMessage?: string;
  errorMessage?: string;
  loadingMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

export const useAsyncOperation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError, showLoading } = useToastNotifications();

  const execute = useCallback(async <T,>(
    operation: () => Promise<T>,
    options: AsyncOperationOptions = {}
  ): Promise<T | null> => {
    const {
      successMessage = "Opération réussie",
      errorMessage = "Une erreur est survenue",
      loadingMessage,
      showSuccessToast = true,
      showErrorToast = true
    } = options;

    setLoading(true);
    setError(null);

    let loadingToast: any = null;
    if (loadingMessage) {
      loadingToast = showLoading("En cours...", loadingMessage);
    }

    try {
      const result = await operation();
      
      if (loadingToast) {
        loadingToast.dismiss();
      }
      
      if (showSuccessToast) {
        showSuccess(successMessage);
      }
      
      return result;
    } catch (err: any) {
      if (loadingToast) {
        loadingToast.dismiss();
      }
      
      const errorMsg = err?.message || errorMessage;
      setError(errorMsg);
      
      if (showErrorToast) {
        showError("Erreur", errorMsg);
      }
      
      console.error('Async operation failed:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError, showLoading]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    clearError
  };
};
