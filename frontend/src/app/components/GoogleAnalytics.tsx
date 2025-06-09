"use client";

import Script from 'next/script';
import { useEffect } from 'react';
import { useCookies } from '@/contexts/CookieContext';

interface GoogleAnalyticsProps {
  gaId: string;
}

export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  const { preferences, hasConsent } = useCookies();

  useEffect(() => {
    if (typeof window !== 'undefined' && hasConsent) {
      // Google Analytics Consent Mode konfigurieren
      if ((window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          'analytics_storage': preferences.analytics ? 'granted' : 'denied',
          'ad_storage': preferences.marketing ? 'granted' : 'denied',
        });
      }
    }
  }, [preferences, hasConsent]);

  // Nur laden wenn Analytics-Cookies akzeptiert wurden
  if (!hasConsent || !preferences.analytics) {
    return null;
  }

  return (
    <>
      {/* Google Analytics gtag.js */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Default consent to 'denied' 
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied'
            });
            
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              anonymize_ip: true,
              cookie_flags: 'secure;samesite=strict',
              storage: 'none'
            });
            
            // Update consent based on user preferences
            gtag('consent', 'update', {
              'analytics_storage': 'granted',
              'ad_storage': 'denied'
            });
          `,
        }}
      />
    </>
  );
}

// Hook für Analytics Events
export function useGoogleAnalytics() {
  const { preferences, hasConsent } = useCookies();

  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (hasConsent && preferences.analytics && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, parameters);
    }
  };

  const trackPageView = (pagePath: string) => {
    if (hasConsent && preferences.analytics && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: pagePath,
      });
    }
  };

  return {
    trackEvent,
    trackPageView,
    isEnabled: hasConsent && preferences.analytics,
  };
} 