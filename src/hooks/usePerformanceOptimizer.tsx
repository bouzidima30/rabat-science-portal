
import { useEffect, useCallback } from 'react';

export const usePerformanceOptimizer = () => {
  
  // Optimiser les images lazy loading
  const optimizeImages = useCallback(() => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
    
    return () => imageObserver.disconnect();
  }, []);

  // Préchargement des pages critiques
  const preloadCriticalPages = useCallback(() => {
    const criticalPages = ['/formations', '/recherche', '/contact'];
    
    criticalPages.forEach(page => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = page;
      document.head.appendChild(link);
    });
  }, []);

  // Nettoyage du DOM
  const cleanupDOM = useCallback(() => {
    // Supprimer les événements inutiles
    const removeUnusedEventListeners = () => {
      const elements = document.querySelectorAll('[data-cleanup]');
      elements.forEach(el => {
        el.removeAttribute('data-cleanup');
      });
    };

    // Optimiser les re-renders
    return removeUnusedEventListeners;
  }, []);

  // Débounce pour les requêtes
  const debounce = useCallback((func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  useEffect(() => {
    const cleanup = optimizeImages();
    preloadCriticalPages();
    const domCleanup = cleanupDOM();

    return () => {
      cleanup();
      domCleanup();
    };
  }, [optimizeImages, preloadCriticalPages, cleanupDOM]);

  return {
    debounce,
    optimizeImages,
    preloadCriticalPages
  };
};
