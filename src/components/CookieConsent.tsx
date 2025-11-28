import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Cookie, Settings } from 'lucide-react';
import { useCookieConsent } from '@/hooks/useCookieConsent';

const CookieConsent = () => {
  const { showBanner, preferences, savePreferences, acceptAll, rejectAll } = useCookieConsent();
  const [showSettings, setShowSettings] = useState(false);
  const [tempPreferences, setTempPreferences] = useState(preferences);

  if (!showBanner) return null;

  const handleCustomize = () => {
    setTempPreferences(preferences);
    setShowSettings(true);
  };

  const handleSaveCustom = () => {
    savePreferences(tempPreferences);
    setShowSettings(false);
  };

  return (
    <>
      <Card className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 rounded-none shadow-lg">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">
                  Gestion des cookies
                </h3>
                <p className="text-xs text-muted-foreground">
                  Nous utilisons des cookies pour améliorer votre expérience de navigation, 
                  analyser le trafic du site et personnaliser le contenu. 
                  Vous pouvez choisir d'accepter tous les cookies ou personnaliser vos préférences.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Button 
                onClick={acceptAll}
                className="flex-1 sm:flex-none"
              >
                Tout accepter
              </Button>
              <Button 
                onClick={rejectAll}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                Tout refuser
              </Button>
              <Button 
                onClick={handleCustomize}
                variant="ghost"
                size="icon"
                className="flex-shrink-0"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Paramètres des cookies</DialogTitle>
            <DialogDescription>
              Choisissez les types de cookies que vous souhaitez autoriser
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex-1 space-y-1">
                <Label htmlFor="necessary" className="text-sm font-medium">
                  Cookies nécessaires
                </Label>
                <p className="text-xs text-muted-foreground">
                  Requis pour le fonctionnement du site
                </p>
              </div>
              <Switch
                id="necessary"
                checked={true}
                disabled
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="flex-1 space-y-1">
                <Label htmlFor="analytics" className="text-sm font-medium">
                  Cookies analytiques
                </Label>
                <p className="text-xs text-muted-foreground">
                  Nous aident à comprendre comment vous utilisez le site
                </p>
              </div>
              <Switch
                id="analytics"
                checked={tempPreferences.analytics}
                onCheckedChange={(checked) =>
                  setTempPreferences({ ...tempPreferences, analytics: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="flex-1 space-y-1">
                <Label htmlFor="marketing" className="text-sm font-medium">
                  Cookies marketing
                </Label>
                <p className="text-xs text-muted-foreground">
                  Utilisés pour personnaliser les publicités
                </p>
              </div>
              <Switch
                id="marketing"
                checked={tempPreferences.marketing}
                onCheckedChange={(checked) =>
                  setTempPreferences({ ...tempPreferences, marketing: checked })
                }
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveCustom}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieConsent;
