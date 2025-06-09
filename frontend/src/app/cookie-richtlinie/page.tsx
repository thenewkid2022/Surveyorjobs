"use client";

import Link from "next/link";

export default function CookieRichtlinie() {
  return (
    <main className="bg-light min-vh-100 font-sans">
      <div className="container py-5">
        <h1 className="display-5 fw-bold text-success mb-4">Cookie-Richtlinie</h1>
        
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">Einleitung</h2>
            <p>
              Diese Cookie-Richtlinie erklärt, wie <strong>SurveyorJobs</strong> Cookies und ähnliche 
              Technologien auf unserer Website verwendet. Diese Richtlinie ergänzt unsere 
              <Link href="/datenschutz" className="text-success">Datenschutzerklärung</Link> und 
              ist gemäss dem neuen Schweizer Datenschutzgesetz (nDSG) erstellt.
            </p>
            <p>
              Durch die Nutzung unserer Website stimmen Sie der Verwendung von Cookies gemäss 
              dieser Richtlinie zu. Sie können Ihre Cookie-Einstellungen jederzeit über unser 
              Cookie-Banner verwalten oder in Ihren Browser-Einstellungen ändern.
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">Was sind Cookies?</h2>
            <p>
              Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden, wenn Sie 
              eine Website besuchen. Sie ermöglichen es der Website, Ihr Gerät zu erkennen und 
              bestimmte Informationen über Ihre Nutzung zu speichern.
            </p>
            <p>
              Cookies verbessern die Funktionalität und Benutzerfreundlichkeit unserer Website. 
              Sie helfen uns auch dabei, zu verstehen, wie unsere Website genutzt wird, damit 
              wir sie kontinuierlich verbessern können.
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">Arten von Cookies</h2>
            
            <h5 className="mt-4 mb-3 text-success">1. Notwendige Cookies (Technisch erforderlich)</h5>
            <p>
              Diese Cookies sind für das ordnungsgemässe Funktionieren unserer Website unerlässlich. 
              Sie können nicht deaktiviert werden, da die Website ohne sie nicht funktionieren würde.
            </p>
            <ul>
              <li><strong>Session-Cookies:</strong> Ermöglichen die Navigation auf der Website</li>
              <li><strong>Sicherheits-Cookies:</strong> Schutz vor Cross-Site-Request-Forgery (CSRF)</li>
              <li><strong>Login-Cookies:</strong> Speichern Ihren Anmeldestatus</li>
              <li><strong>Cookie-Einstellungen:</strong> Speichern Ihre Cookie-Präferenzen</li>
            </ul>
            <p className="text-muted">
              <em>Rechtsgrundlage:</em> Berechtigtes Interesse zur Bereitstellung der Website-Funktionalität
            </p>

            <h5 className="mt-4 mb-3 text-success">2. Funktionale Cookies</h5>
            <p>
              Diese Cookies verbessern die Funktionalität und Personalisierung der Website. 
              Sie speichern Ihre Präferenzen und Einstellungen.
            </p>
            <ul>
              <li><strong>Spracheinstellungen:</strong> Speichern Ihre bevorzugte Sprache</li>
              <li><strong>Filter-Einstellungen:</strong> Merken sich Ihre Suchfilter bei Stellenangeboten</li>
              <li><strong>Layout-Präferenzen:</strong> Speichern Ihre Anzeigeeinstellungen</li>
              <li><strong>Formular-Daten:</strong> Zwischenspeichern von Formulareingaben</li>
            </ul>
            <p className="text-muted">
              <em>Rechtsgrundlage:</em> Ihre Einwilligung über das Cookie-Banner
            </p>

            <h5 className="mt-4 mb-3 text-success">3. Analyse-Cookies (Analytics)</h5>
            <p>
              Diese Cookies helfen uns zu verstehen, wie Besucher unsere Website nutzen. 
              Alle gesammelten Daten sind anonymisiert und werden für statistische Zwecke verwendet.
            </p>
            <ul>
              <li><strong>Website-Performance:</strong> Seitenaufrufe, Verweildauer, Absprungrate</li>
              <li><strong>Nutzerverhalten:</strong> Klickpfade und beliebteste Inhalte</li>
              <li><strong>Technische Daten:</strong> Browser, Betriebssystem, Bildschirmauflösung</li>
              <li><strong>Referrer-Informationen:</strong> Woher Besucher auf unsere Seite kommen</li>
            </ul>
            <p className="text-muted">
              <em>Rechtsgrundlage:</em> Ihre Einwilligung über das Cookie-Banner
            </p>

            <h5 className="mt-4 mb-3 text-success">4. Marketing-Cookies</h5>
            <p>
              Diese Cookies werden derzeit nicht verwendet. Sollten wir in Zukunft Marketing-Cookies 
              einsetzen, werden wir Sie darüber informieren und Ihre Einwilligung einholen.
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">Zwecke der Cookie-Verwendung</h2>
            
            <h5 className="mt-4 mb-2">Website-Performance und -Stabilität</h5>
            <ul>
              <li>Gewährleistung der ordnungsgemässen Funktionalität der Website</li>
              <li>Optimierung der Ladezeiten und Server-Performance</li>
              <li>Erkennung und Behebung technischer Probleme</li>
            </ul>

            <h5 className="mt-4 mb-2">Nutzeranalyse und Website-Optimierung</h5>
            <ul>
              <li>Analyse des Nutzerverhaltens zur Verbesserung der Benutzerfreundlichkeit</li>
              <li>Identifikation beliebter Inhalte und Funktionen</li>
              <li>Optimierung der Navigation und des Website-Designs</li>
            </ul>

            <h5 className="mt-4 mb-2">Personalisierung der Nutzererfahrung</h5>
            <ul>
              <li>Speicherung Ihrer Präferenzen und Einstellungen</li>
              <li>Anzeige relevanter Stellenangebote basierend auf Ihren Suchkriterien</li>
              <li>Vereinfachung wiederkehrender Besuche</li>
            </ul>

            <h5 className="mt-4 mb-2">Sicherheit und Schutz</h5>
            <ul>
              <li>Schutz vor Missbrauch und Sicherheitsbedrohungen</li>
              <li>Erkennung und Verhinderung von Spam und Betrug</li>
              <li>Sichere Authentifizierung von Benutzern</li>
            </ul>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">Drittanbieter und Datenübermittlung</h2>
            
            <h5 className="mt-4 mb-3 text-success">Google Analytics</h5>
            <p>
              Wir verwenden Google Analytics (Google LLC, USA) zur Analyse der Website-Nutzung. 
              Google Analytics verwendet Cookies zur Erfassung anonymisierter Nutzungsdaten.
            </p>
            <ul>
              <li><strong>Anbieter:</strong> Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA</li>
              <li><strong>Zweck:</strong> Website-Analyse und Optimierung</li>
              <li><strong>Datenübermittlung:</strong> Anonymisierte Daten werden in die USA übermittelt</li>
              <li><strong>IP-Anonymisierung:</strong> Aktiviert - Ihre IP-Adresse wird gekürzt</li>
              <li><strong>Opt-Out:</strong> Möglich über Browser-Add-on oder Cookie-Einstellungen</li>
            </ul>

            <h5 className="mt-4 mb-3 text-success">Rechtliche Grundlage für Datenübermittlung in die USA</h5>
            <p>
              Die Übermittlung von Daten in die USA erfolgt auf Basis von:
            </p>
            <ul>
              <li><strong>EU-Standardvertragsklauseln (SCCs):</strong> Gewährleisten angemessenen Datenschutz</li>
              <li><strong>EU-US Data Privacy Framework:</strong> Soweit anwendbar und verfügbar</li>
              <li><strong>Zusätzliche Schutzmaßnahmen:</strong> Technische und organisatorische Maßnahmen</li>
              <li><strong>Ihre Einwilligung:</strong> Durch Akzeptieren des Cookie-Banners</li>
            </ul>

            <p className="alert alert-info">
              <strong>Wichtiger Hinweis:</strong> Sie können der Datenübermittlung jederzeit widersprechen, 
              indem Sie Analyse-Cookies in unseren Cookie-Einstellungen deaktivieren.
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">Cookie-Banner und Einwilligung</h2>
            
            <h5 className="mt-4 mb-2">Einwilligung erteilen</h5>
            <p>
              Beim ersten Besuch unserer Website erscheint ein Cookie-Banner. Sie können wählen:
            </p>
            <ul>
              <li><strong>"Alle akzeptieren":</strong> Stimmen allen Cookie-Kategorien zu</li>
              <li><strong>"Nur notwendige":</strong> Nur technisch erforderliche Cookies</li>
              <li><strong>"Einstellungen":</strong> Individuelle Auswahl der Cookie-Kategorien</li>
            </ul>

            <h5 className="mt-4 mb-2">Einwilligung widerrufen</h5>
            <p>
              Sie können Ihre Cookie-Einwilligung jederzeit widerrufen:
            </p>
            <ul>
              <li><strong>Cookie-Einstellungen:</strong> Link im Footer der Website</li>
              <li><strong>Browser-Einstellungen:</strong> Löschen oder Blockieren von Cookies</li>
              <li><strong>E-Mail:</strong> Kontakt über <a href="mailto:kontakt@surveyjobs.ch" className="text-success">kontakt@surveyjobs.ch</a></li>
            </ul>

            <p className="alert alert-warning">
              <strong>Hinweis:</strong> Das Deaktivieren bestimmter Cookies kann die Funktionalität 
              der Website beeinträchtigen.
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">Speicherdauer von Cookies</h2>
            
            <div className="table-responsive">
              <table className="table table-striped">
                <thead className="table-success">
                  <tr>
                    <th>Cookie-Typ</th>
                    <th>Speicherdauer</th>
                    <th>Beschreibung</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Session-Cookies</strong></td>
                    <td>Bis Ende der Browser-Sitzung</td>
                    <td>Werden automatisch gelöscht, wenn Sie den Browser schließen</td>
                  </tr>
                  <tr>
                    <td><strong>Technische Cookies</strong></td>
                    <td>30 Tage</td>
                    <td>Login-Status, Sicherheitseinstellungen</td>
                  </tr>
                  <tr>
                    <td><strong>Funktionale Cookies</strong></td>
                    <td>12 Monate</td>
                    <td>Spracheinstellungen, Filter-Präferenzen</td>
                  </tr>
                  <tr>
                    <td><strong>Analyse-Cookies</strong></td>
                    <td>24 Monate</td>
                    <td>Google Analytics und Website-Statistiken</td>
                  </tr>
                  <tr>
                    <td><strong>Cookie-Einstellungen</strong></td>
                    <td>12 Monate</td>
                    <td>Ihre Cookie-Präferenzen und Einwilligungen</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">Browser-Einstellungen und Cookie-Kontrolle</h2>
            
            <p>
              Sie können Cookies in Ihrem Browser verwalten und kontrollieren. Hier finden Sie 
              Anleitungen für die gängigsten Browser:
            </p>

            <h5 className="mt-4 mb-2">Google Chrome</h5>
            <p>
              Einstellungen → Datenschutz und Sicherheit → Cookies und andere Websitedaten
            </p>

            <h5 className="mt-4 mb-2">Mozilla Firefox</h5>
            <p>
              Einstellungen → Datenschutz & Sicherheit → Cookies und Website-Daten
            </p>

            <h5 className="mt-4 mb-2">Safari</h5>
            <p>
              Einstellungen → Datenschutz → Cookies und Website-Daten verwalten
            </p>

            <h5 className="mt-4 mb-2">Microsoft Edge</h5>
            <p>
              Einstellungen → Cookies und Websiteberechtigungen → Cookies und gespeicherte Daten verwalten und löschen
            </p>

            <div className="alert alert-info mt-3">
              <strong>Tipp:</strong> Die meisten Browser bieten auch einen "Inkognito-" oder "Privat-Modus", 
              in dem keine Cookies gespeichert werden.
            </div>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">Kontakt und weitere Informationen</h2>
            <p>
              Bei Fragen zu unserer Cookie-Richtlinie oder zum Datenschutz kontaktieren Sie uns:
            </p>
            
            <div className="row">
              <div className="col-md-6">
                <h5>Kontaktdaten</h5>
                <p>
                  <strong>E-Mail:</strong> <a href="mailto:kontakt@surveyjobs.ch" className="text-success">kontakt@surveyjobs.ch</a><br />
                  <strong>Betreff:</strong> Cookie-Richtlinie / Datenschutz
                </p>
              </div>
              <div className="col-md-6">
                <h5>Weitere Informationen</h5>
                <ul className="list-unstyled">
                  <li><Link href="/datenschutz" className="text-success">→ Datenschutzerklärung</Link></li>
                  <li><Link href="/impressum" className="text-success">→ Impressum</Link></li>
                  <li><Link href="/agb" className="text-success">→ Allgemeine Geschäftsbedingungen</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">Änderungen dieser Cookie-Richtlinie</h2>
            <p>
              Wir behalten uns das Recht vor, diese Cookie-Richtlinie von Zeit zu Zeit zu aktualisieren, 
              um Änderungen in unseren Praktiken oder aus rechtlichen, betrieblichen oder 
              regulatorischen Gründen widerzuspiegeln.
            </p>
            <p>
              <strong>Bei wesentlichen Änderungen</strong> werden wir Sie durch eine Mitteilung auf 
              unserer Website oder per E-Mail (sofern Sie ein Benutzerkonto haben) informieren.
            </p>
            <p>
              <strong>Letzte Aktualisierung:</strong> <span className="text-success fw-bold">{new Date().toLocaleDateString('de-CH')}</span>
            </p>
            <p className="text-muted">
              Wir empfehlen Ihnen, diese Richtlinie regelmäßig zu überprüfen, um über 
              unsere Cookie-Praktiken informiert zu bleiben.
            </p>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="btn btn-success me-3">
            Zurück zur Startseite
          </Link>
          <button className="btn btn-outline-success" onClick={() => window.history.back()}>
            Zurück
          </button>
        </div>
      </div>
    </main>
  );
}