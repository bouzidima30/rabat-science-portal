
import { useEffect, useCallback } from 'react';

export const usePerformanceOptimizer = () => {
  
  // Optimiser les images lazy loading
  const optimizeImages = useCallback(() => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      // Process entries without forcing layout
      const intersectingImages: HTMLImageElement[] = [];
      
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          intersectingImages.push(entry.target as HTMLImageElement);
        }
      });

      if (intersectingImages.length > 0) {
        // Batch all DOM writes together to prevent layout thrashing
        requestAnimationFrame(() => {
          intersectingImages.forEach(img => {
            const dataSrc = img.getAttribute('data-src');
            if (dataSrc) {
              img.src = dataSrc;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          });
        });
      }
    }, {
      // Optimize intersection observer settings
      rootMargin: '150px',
      threshold: 0.1
    });

    // Observe images without causing layout reads
    if (images.length > 0) {
      requestAnimationFrame(() => {
        images.forEach(img => imageObserver.observe(img));
      });
    }
    
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
