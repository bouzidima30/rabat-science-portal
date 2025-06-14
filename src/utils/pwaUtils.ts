
import { useState, useEffect } from 'react';

// PWA Service Worker registration and utilities
interface PWAInstallPrompt {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

class PWAManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstallable = false;

  constructor() {
    this.init();
  }

  private init() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.isInstallable = true;
      console.log('PWA install prompt available');
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      this.deferredPrompt = null;
      this.isInstallable = false;
    });
  }

  async installApp(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.log('No install prompt available');
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted PWA install');
        return true;
      } else {
        console.log('User dismissed PWA install');
        return false;
      }
    } catch (error) {
      console.error('Error during PWA install:', error);
      return false;
    } finally {
      this.deferredPrompt = null;
      this.isInstallable = false;
    }
  }

  getInstallability(): boolean {
    return this.isInstallable;
  }

  // Check if app is running in standalone mode (PWA)
  isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches || 
           (window.navigator as any).standalone === true;
  }

  // Register service worker
  async registerServiceWorker(): Promise<boolean> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        return true;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return false;
      }
    }
    return false;
  }
}

export const pwaManager = new PWAManager();

// Hook for PWA functionality
export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsInstallable(pwaManager.getInstallability());
    setIsStandalone(pwaManager.isStandalone());

    // Update installability when beforeinstallprompt fires
    const handleBeforeInstall = () => {
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    const success = await pwaManager.installApp();
    if (success) {
      setIsInstallable(false);
    }
    return success;
  };

  return {
    isInstallable,
    isStandalone,
    installApp,
    registerServiceWorker: pwaManager.registerServiceWorker
  };
};
