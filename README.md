# BauJobs - Das moderne Jobboard für die Baubranche

BauJobs ist eine moderne Webplattform, die speziell für die Baubranche entwickelt wurde. Sie ermöglicht es Arbeitssuchenden, gezielt nach Jobs zu suchen, und Unternehmen, ihre Stellenangebote zu veröffentlichen.

## 🌟 Features

- **Stellenangebote & Stellengesuche**: Veröffentlichen und finden Sie Jobs in der Baubranche
- **Berufsfeld-Filterung**: Gezielte Suche nach spezifischen Berufsfeldern
- **Kantonale Filterung**: Jobs nach Region/Kanton filtern
- **Responsive Design**: Optimiert für Desktop und mobile Geräte
- **Moderne UI**: Benutzerfreundliches Interface mit Bootstrap und Tailwind CSS
- **Dark Mode**: Unterstützung für helles und dunkles Farbschema

## 🛠️ Technologie-Stack

- **Frontend**:
  - Next.js 14 (React Framework)
  - TypeScript
  - Bootstrap 5
  - Tailwind CSS
  - React Icons

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB
  - TypeScript

## 📋 Voraussetzungen

- Node.js (v18 oder höher)
- npm oder yarn
- MongoDB (lokal oder Atlas)

## 🚀 Installation

1. Repository klonen:
   ```bash
   git clone https://github.com/ihr-username/baujobs.git
   cd baujobs
   ```

2. Frontend-Abhängigkeiten installieren:
   ```bash
   cd frontend
   npm install
   ```

3. Backend-Abhängigkeiten installieren:
   ```bash
   cd ../backend
   npm install
   ```

4. Umgebungsvariablen konfigurieren:
   - Erstellen Sie eine `.env`-Datei im Backend-Verzeichnis
   - Erstellen Sie eine `.env.local`-Datei im Frontend-Verzeichnis
   - Siehe `.env.example` für die erforderlichen Variablen

## 💻 Entwicklung

1. Backend-Server starten:
   ```bash
   cd backend
   npm run dev
   ```

2. Frontend-Entwicklungsserver starten:
   ```bash
   cd frontend
   npm run dev
   ```

Die Anwendung ist dann verfügbar unter:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 🏗️ Projektstruktur

```
baujobs/
├── frontend/                # Next.js Frontend
│   ├── src/
│   │   ├── app/            # Next.js App Router
│   │   ├── components/     # React Komponenten
│   │   ├── styles/         # Globale Styles
│   │   └── utils/          # Hilfsfunktionen
│   └── public/             # Statische Assets
│
├── backend/                 # Express.js Backend
│   ├── src/
│   │   ├── controllers/    # API Controller
│   │   ├── models/         # MongoDB Modelle
│   │   ├── routes/         # API Routen
│   │   └── utils/          # Hilfsfunktionen
│   └── tests/              # Backend Tests
│
└── shared/                  # Gemeinsam genutzte Typen und Utilities
```

## 📝 API-Endpunkte

### Stellenangebote
- `GET /api/stellenanzeigen-aufgeben` - Alle Stellenangebote abrufen
- `POST /api/stellenanzeigen-aufgeben` - Neues Stellenangebot erstellen
- `GET /api/stellenanzeigen-aufgeben/:id` - Einzelnes Stellenangebot abrufen

### Stellengesuche
- `GET /api/suche-einen-job` - Alle Stellengesuche abrufen
- `POST /api/suche-einen-job` - Neues Stellengesuch erstellen
- `GET /api/suche-einen-job/:id` - Einzelnes Stellengesuch abrufen

## 🧪 Tests

Backend-Tests ausführen:
```bash
cd backend
npm test
```

## 📦 Deployment

### Frontend
```bash
cd frontend
npm run build
npm start
```

### Backend
```bash
cd backend
npm run build
npm start
```

## 🤝 Beitragen

1. Fork erstellen
2. Feature Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m 'Add some AmazingFeature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request erstellen

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) für Details.

## 👥 Kontakt

- Website: [www.baujobs.org](https://www.baujobs.org)
- E-Mail: info@baujobs.org
- Telefon: +41 79 123 45 67

## 🙏 Danksagung

- [Next.js](https://nextjs.org/)
- [Bootstrap](https://getbootstrap.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)

## 🆕 Cookie-Management & Analytics

### Cookie-Banner & Einwilligung
- **DSGVO-konformer Cookie-Banner** beim ersten Besuch
- **Granulare Cookie-Kontrolle**: Notwendige, Funktionale, Analyse- und Marketing-Cookies
- **Cookie-Einstellungen** über Footer-Link verfügbar
- **Automatische Consent-Erneuerung** nach 12 Monaten

### Google Analytics Integration
- **Conditional Loading**: Lädt nur bei erteilter Einwilligung
- **IP-Anonymisierung** aktiviert
- **Consent Mode API** für datenschutzkonforme Implementierung
- **Event-Tracking** für Job-Views, Bewerbungen etc.

### Konfiguration

1. **Google Analytics 4 einrichten**:
   ```bash
   # In frontend/.env.local
   NEXT_PUBLIC_GA_MEASUREMENT_ID=GA-XXXXXXXXX-X
   ```

2. **Cookie-Kategorien**:
   - ✅ **Notwendig**: Session, CSRF, Login (immer aktiv)
   - 🎛️ **Funktional**: Spracheinstellungen, Filter-Präferenzen  
   - 📊 **Analytics**: Google Analytics (nur mit Einwilligung)
   - 📈 **Marketing**: Derzeit nicht verwendet

3. **Implementierte Komponenten**:
   - `CookieContext` - Cookie-State-Management
   - `CookieBanner` - Banner mit Einstellungen
   - `GoogleAnalytics` - GA4 mit Consent Mode
   - `CookieSettings` - Footer-Link für Einstellungen

### Rechtliche Compliance

- **Schweizer nDSG** konform
- **DSGVO/GDPR** konform
- **Cookie-Richtlinie** vollständig implementiert
- **Opt-in/Opt-out** Mechanismen
- **Datenübertragung in USA** mit SCCs dokumentiert 