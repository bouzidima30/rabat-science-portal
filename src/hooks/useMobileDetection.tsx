
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
    const updateDeviceInfo = () => {
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
    };

    // Initial detection
    updateDeviceInfo();

    // Listen for resize events
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
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
