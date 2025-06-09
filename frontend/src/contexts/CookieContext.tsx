"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CookiePreferences {
  necessary: boolean; // Immer true, kann nicht deaktiviert werden
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface CookieContextType {
  preferences: CookiePreferences;
  hasConsent: boolean;
  showBanner: boolean;
  updatePreferences: (prefs: Partial<CookiePreferences>) => void;
  acceptAll: () => void;
  acceptNecessaryOnly: () => void;
  showSettings: () => void;
  hideBanner: () => void;
  resetConsent: () => void;
}

const defaultPreferences: CookiePreferences = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export function useCookies() {
  const context = useContext(CookieContext);
  if (context === undefined) {
    throw new Error('useCookies must be used within a CookieProvider');
  }
  return context;
}

export function CookieProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [hasConsent, setHasConsent] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Cookie-Einstellungen aus localStorage laden
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cookie-preferences');
      const consentDate = localStorage.getItem('cookie-consent-date');
      
      if (saved && consentDate) {
        // Prüfen ob Consent älter als 12 Monate ist
        const consentAge = new Date().getTime() - new Date(consentDate).getTime();
        const maxAge = 12 * 30 * 24 * 60 * 60 * 1000; // 12 Monate in ms
        
        if (consentAge < maxAge) {
          try {
            const parsed = JSON.parse(saved);
            setPreferences({ ...defaultPreferences, ...parsed });
            setHasConsent(true);
            setShowBanner(false);
          } catch (error) {
            console.error('Fehler beim Laden der Cookie-Einstellungen:', error);
            setShowBanner(true);
          }
        } else {
          // Consent abgelaufen, neu anzeigen
          setShowBanner(true);
        }
      } else {
        // Kein Consent vorhanden, Banner anzeigen
        setShowBanner(true);
      }
    }
  }, []);

  // Cookie-Einstellungen speichern
  const savePreferences = (prefs: CookiePreferences) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cookie-preferences', JSON.stringify(prefs));
      localStorage.setItem('cookie-consent-date', new Date().toISOString());
    }
    setPreferences(prefs);
    setHasConsent(true);
    setShowBanner(false);

    // Google Analytics basierend auf Analytics-Einstellung aktivieren/deaktivieren
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': prefs.analytics ? 'granted' : 'denied',
        'ad_storage': prefs.marketing ? 'granted' : 'denied',
      });
    }
  };

  const updatePreferences = (newPrefs: Partial<CookiePreferences>) => {
    const updated = { ...preferences, ...newPrefs, necessary: true };
    savePreferences(updated);
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
  };

  const acceptNecessaryOnly = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    savePreferences(necessaryOnly);
  };

  const showSettings = () => {
    setShowBanner(true);
  };

  const hideBanner = () => {
    setShowBanner(false);
  };

  const resetConsent = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cookie-preferences');
      localStorage.removeItem('cookie-consent-date');
    }
    setPreferences(defaultPreferences);
    setHasConsent(false);
    setShowBanner(true);
  };

  return (
    <CookieContext.Provider
      value={{
        preferences,
        hasConsent,
        showBanner,
        updatePreferences,
        acceptAll,
        acceptNecessaryOnly,
        showSettings,
        hideBanner,
        resetConsent,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
} 