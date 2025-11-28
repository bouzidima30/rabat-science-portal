import { useState, useEffect } from 'react';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = 'cookie-consent-preferences';
const COOKIE_CONSENT_DATE_KEY = 'cookie-consent-date';

export const useCookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) {
      setShowBanner(true);
    } else {
      setPreferences(JSON.parse(stored));
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
    localStorage.setItem(COOKIE_CONSENT_DATE_KEY, new Date().toISOString());
    setPreferences(prefs);
    setShowBanner(false);
  };

  const acceptAll = () => {
    savePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const rejectAll = () => {
    savePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  const resetConsent = () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    localStorage.removeItem(COOKIE_CONSENT_DATE_KEY);
    setShowBanner(true);
  };

  return {
    showBanner,
    preferences,
    savePreferences,
    acceptAll,
    rejectAll,
    resetConsent,
  };
};
