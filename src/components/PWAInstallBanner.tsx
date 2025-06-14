
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Smartphone } from 'lucide-react';
import { usePWA } from '@/utils/pwaUtils';

const PWAInstallBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const { isInstallable, isStandalone, installApp } = usePWA();

  useEffect(() => {
    // Show banner if app is installable and not already installed
    if (isInstallable && !isStandalone) {
      const bannerDismissed = localStorage.getItem('pwa-banner-dismissed');
      if (!bannerDismissed) {
        setShowBanner(true);
      }
    }
  }, [isInstallable, isStandalone]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Smartphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Installer l'application
            </h3>
            <p className="text-xs text-blue-700 dark:text-blue-200 mt-1">
              Ajoutez FSR à votre écran d'accueil pour un accès rapide
            </p>
            <div className="mt-3 flex space-x-2">
              <Button 
                size="sm" 
                onClick={handleInstall}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="h-4 w-4 mr-1" />
                Installer
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleDismiss}
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Plus tard
              </Button>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
            className="flex-shrink-0 text-blue-700 hover:bg-blue-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PWAInstallBanner;
