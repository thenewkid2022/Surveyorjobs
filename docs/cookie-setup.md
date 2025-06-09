# Cookie-Banner & Google Analytics Setup

## 🍪 Vollständige Cookie-Implementierung

### ✅ Was wurde implementiert:

1. **Cookie-Context & Management**
   - `CookieContext` für globales State-Management
   - Automatische Speicherung in localStorage
   - 12-Monats-Gültigkeitsdauer mit automatischer Erneuerung

2. **Cookie-Banner Komponente**
   - DSGVO-konformer Banner beim ersten Besuch
   - 3 Optionen: "Alle akzeptieren", "Nur notwendige", "Einstellungen"
   - Detaillierte Einstellungsmodal mit Cookie-Kategorien

3. **Google Analytics 4 Integration**
   - Conditional Loading basierend auf Cookie-Einwilligung
   - Consent Mode API für DSGVO-Compliance
   - IP-Anonymisierung und sichere Cookie-Flags

4. **Cookie-Einstellungen im Footer**
   - Permanent verfügbarer Link zur Änderung der Einstellungen
   - Reset-Funktion für erneute Einwilligung

## 🔧 Konfiguration

### 1. Google Analytics 4 einrichten

```bash
# Erstellen Sie die Datei: frontend/.env.local
NEXT_PUBLIC_GA_MEASUREMENT_ID=GA-XXXXXXXXX-X
```

**So erhalten Sie die Measurement ID:**
1. Gehen Sie zu [Google Analytics](https://analytics.google.com/)
2. Erstellen Sie ein neues Property (GA4)
3. Kopieren Sie die Measurement ID (Format: GA-XXXXXXXXX-X)

### 2. Cookie-Kategorien

| Kategorie | Status | Beschreibung | Deaktivierbar |
|-----------|--------|--------------|---------------|
| **Notwendig** | ✅ Immer aktiv | Session, CSRF, Login | ❌ Nein |
| **Funktional** | 🎛️ Optional | Spracheinstellungen, Filter | ✅ Ja |
| **Analytics** | 📊 Optional | Google Analytics | ✅ Ja |
| **Marketing** | 🚫 Inaktiv | Derzeit nicht verwendet | ✅ Ja |

### 3. Implementierte Komponenten

```
frontend/src/
├── contexts/
│   └── CookieContext.tsx      # Cookie State Management
├── app/components/
│   ├── CookieBanner.tsx       # Haupt-Cookie-Banner
│   ├── GoogleAnalytics.tsx    # GA4 mit Consent Mode
│   └── CookieSettings.tsx     # Footer-Link für Einstellungen
└── utils/
    └── enhancedAnalytics.ts   # Kombiniertes Analytics
```

## 🎯 Verwendung

### Basic Cookie-Management

```tsx
import { useCookies } from '@/contexts/CookieContext';

function MyComponent() {
  const { preferences, hasConsent, acceptAll, resetConsent } = useCookies();
  
  // Prüfen ob Analytics erlaubt ist
  if (preferences.analytics) {
    // Analytics-Code ausführen
  }
}
```

### Enhanced Analytics verwenden

```tsx
import { useEnhancedAnalytics } from '@/utils/enhancedAnalytics';

function JobComponent({ jobId, jobTitle }) {
  const analytics = useEnhancedAnalytics();
  
  const handleJobView = () => {
    // Trackt sowohl intern als auch Google Analytics (bei Einwilligung)
    analytics.trackJobView(jobId, jobTitle);
  };
}
```

## 🛡️ DSGVO/nDSG Compliance

### ✅ Implementierte Compliance-Features:

1. **Opt-in Mechanismus**
   - Keine Cookies ohne Einwilligung (außer notwendige)
   - Granulare Kontrolle über Cookie-Kategorien

2. **Transparenz**
   - Klare Beschreibung aller Cookie-Kategorien
   - Links zu Cookie-Richtlinie und Datenschutz

3. **Kontrolle**
   - Jederzeit änderbare Einstellungen
   - Einfache Widerrufsmöglichkeit

4. **Datenminimierung**
   - IP-Anonymisierung bei Google Analytics
   - Sichere Cookie-Flags
   - Begrenzte Speicherdauer

### 🔒 Google Analytics Sicherheit:

```javascript
gtag('config', 'GA-XXXXXXXXX-X', {
  anonymize_ip: true,              // IP-Anonymisierung
  cookie_flags: 'secure;samesite=strict',  // Sichere Cookies
  storage: 'none'                  // Minimaler Speicher
});
```

## 📋 Testing

### Cookie-Banner testen:

1. **Ersten Besuch simulieren:**
   ```javascript
   localStorage.removeItem('cookie-preferences');
   localStorage.removeItem('cookie-consent-date');
   location.reload();
   ```

2. **Verschiedene Einstellungen testen:**
   - Alle akzeptieren → GA sollte laden
   - Nur notwendige → GA sollte nicht laden
   - Einstellungen → Granulare Kontrolle

3. **Consent-Erneuerung testen:**
   ```javascript
   // Consent-Datum auf 13 Monate zurücksetzen
   const oldDate = new Date();
   oldDate.setMonth(oldDate.getMonth() - 13);
   localStorage.setItem('cookie-consent-date', oldDate.toISOString());
   location.reload();
   ```

## 🚀 Deployment

### Vercel Umgebungsvariablen:

```bash
# In Vercel Dashboard unter Settings > Environment Variables
NEXT_PUBLIC_GA_MEASUREMENT_ID=GA-XXXXXXXXX-X
```

### Build-Check:

```bash
cd frontend
npm run build
# Prüfen Sie auf Cookie-bezogene Fehler
```

## 📊 Analytics Dashboard

Nach der Implementierung können Sie in Google Analytics:

1. **Consent-Rate überwachen:**
   - Wie viele Benutzer Analytics akzeptieren

2. **Enhanced E-Commerce Events:**
   - Job Views (`view_item`)
   - Bewerbungen (`begin_checkout`, `purchase`)
   - CV-Kontakte (`contact`)

3. **Custom Dimensions:**
   - Job-Kategorien
   - Premium-Pakete
   - Benutzertypen

## 🔧 Anpassungen

### Cookie-Banner-Styling anpassen:

```scss
// In globals.css oder einem separaten Stylesheet
.cookie-banner {
  background: var(--bs-light);
  border-top: 3px solid var(--bs-success);
}
```

### Zusätzliche Cookie-Kategorien:

```typescript
// In CookieContext.tsx erweitern
interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  social: boolean;  // Neue Kategorie
}
```

---

**✅ Die Implementierung ist vollständig und produktionsbereit!**

Alle Cookie-Richtlinien werden jetzt korrekt umgesetzt und entsprechen den dokumentierten Praktiken. 