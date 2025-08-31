
import { useState, useEffect } from 'react';

interface MobileDetectionHook {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenSize: 'mobile' | 'tablet' | 'desktop';
  orientation: 'portrait' | 'landscape';
}

export const useMobileDetection = (): MobileDetectionHook => {
  const [deviceInfo, setDeviceInfo] = useState<MobileDetectionHook>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenSize: 'desktop',
    orientation: 'landscape'
  });

  useEffect(() => {
    let rafId: number | null = null;
    let timeoutId: NodeJS.Timeout | null = null;
    let isUpdating = false;

    const updateDeviceInfo = () => {
      // Prevent multiple simultaneous updates to avoid forced reflows
      if (isUpdating) return;
      
      // Cancel any pending animation frame
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      // Use double requestAnimationFrame to ensure layout is stable
      rafId = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isUpdating = true;
          
          // Read layout properties in a single batch to minimize reflows
          const width = window.innerWidth;
          const height = window.innerHeight;
          
          const isMobile = width < 768;
          const isTablet = width >= 768 && width < 1024;
          const isDesktop = width >= 1024;
          
          const screenSize: 'mobile' | 'tablet' | 'desktop' = 
            isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
          
          const orientation: 'portrait' | 'landscape' = 
            height > width ? 'portrait' : 'landscape';

          setDeviceInfo({
            isMobile,
            isTablet,
            isDesktop,
            screenSize,
            orientation
          });

          isUpdating = false;
          rafId = null;
        });
      });
    };

    // More aggressive debouncing to reduce layout thrashing
    const debouncedUpdate = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(updateDeviceInfo, 150);
    };

    // Initial detection with delay to avoid early layout reads
    setTimeout(updateDeviceInfo, 0);

    // Use passive listeners to avoid blocking main thread
    window.addEventListener('resize', debouncedUpdate, { passive: true });
    window.addEventListener('orientationchange', debouncedUpdate, { passive: true });

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener('resize', debouncedUpdate);
      window.removeEventListener('orientationchange', debouncedUpdate);
    };
  }, []);

  return deviceInfo;
};

// Hook for responsive image sizing
export const useResponsiveImageSize = () => {
  const { screenSize } = useMobileDetection();
  
  return {
    cardImageSize: screenSize === 'mobile' ? 'h-48' : screenSize === 'tablet' ? 'h-56' : 'h-64',
    heroImageSize: screenSize === 'mobile' ? 'h-64' : screenSize === 'tablet' ? 'h-80' : 'h-96',
    avatarSize: screenSize === 'mobile' ? 'h-12 w-12' : 'h-16 w-16'
  };
};
