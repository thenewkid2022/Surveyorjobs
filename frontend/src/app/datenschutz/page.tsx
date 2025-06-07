"use client";

import Link from "next/link";

export default function Datenschutz() {
  return (
    <main className="bg-light min-vh-100 font-sans">
      <div className="container py-5">
        <h1 className="display-5 fw-bold text-success mb-4">Datenschutzerklärung</h1>
        
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">1. Verantwortlicher</h2>
            <p>
              <strong>Verantwortlich für die Datenbearbeitung:</strong><br />
              Max Mustermann<br />
              Musterweg 1<br />
              CH-1234 Musterstadt<br />
              Schweiz<br />
              E-Mail: <a href="mailto:kontakt@surveyjobs.ch" className="text-success">kontakt@surveyjobs.ch</a>
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">2. Allgemeines zur Datenbearbeitung</h2>
            <p>
              Der Schutz Ihrer Personendaten ist uns wichtig. Diese Datenschutzerklärung informiert Sie darüber, 
              welche Personendaten wir auf unserer Website <strong>SurveyorJobs</strong> erheben, zu welchen Zwecken 
              wir sie verwenden und welche Rechte Ihnen gemäss dem neuen Schweizer Datenschutzgesetz (nDSG) zustehen.
            </p>
            <p>
              Personendaten sind alle Angaben, die sich auf eine bestimmte oder bestimmbare Person beziehen.
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">3. Erhobene Daten</h2>
            <p>Wir erheben und bearbeiten folgende Kategorien von Personendaten:</p>
            
            <h5 className="mt-4 mb-2">3.1 Nutzungsdaten</h5>
            <ul>
              <li>IP-Adresse (anonymisiert)</li>
              <li>Browser-Typ und -Version</li>
              <li>Betriebssystem</li>
              <li>Referrer-URL</li>
              <li>Datum und Uhrzeit des Zugriffs</li>
              <li>Aufgerufene Seiten und Dateien</li>
            </ul>

            <h5 className="mt-4 mb-2">3.2 Bewerbungsdaten</h5>
            <ul>
              <li>Name und Vorname</li>
              <li>E-Mail-Adresse</li>
              <li>Telefonnummer</li>
              <li>Lebenslauf und Bewerbungsunterlagen</li>
              <li>Berufserfahrung und Qualifikationen</li>
              <li>Weitere freiwillige Angaben</li>
            </ul>

            <h5 className="mt-4 mb-2">3.3 Cookies und ähnliche Technologien</h5>
            <ul>
              <li>Session-Cookies für die Website-Funktionalität</li>
              <li>Analyse-Cookies für Website-Optimierung</li>
              <li>Marketing-Cookies (nur mit Einwilligung)</li>
            </ul>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">4. Zwecke der Datenbearbeitung</h2>
            <p>Wir bearbeiten Ihre Personendaten zu folgenden Zwecken:</p>
            <ul>
              <li><strong>Website-Optimierung:</strong> Verbesserung der Benutzerfreundlichkeit und Funktionalität</li>
              <li><strong>Stellenvermittlung:</strong> Vermittlung zwischen Arbeitgebern und Arbeitnehmern in der Baubranche</li>
              <li><strong>Nutzeranalyse:</strong> Analyse des Nutzerverhaltens zur Optimierung unserer Dienste</li>
              <li><strong>Kommunikation:</strong> Beantwortung von Anfragen und Kundenbetreuung</li>
              <li><strong>Rechtliche Verpflichtungen:</strong> Erfüllung gesetzlicher Aufbewahrungs- und Meldepflichten</li>
            </ul>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">5. Rechtsgrundlagen</h2>
            <p>Die Bearbeitung Ihrer Personendaten stützt sich auf folgende Rechtsgrundlagen:</p>
            <ul>
              <li><strong>Einwilligung:</strong> Sie haben ausdrücklich in die Datenbearbeitung eingewilligt (Art. 6 Abs. 1 nDSG)</li>
              <li><strong>Vertragserfüllung:</strong> Die Bearbeitung ist zur Erfüllung eines Vertrags mit Ihnen erforderlich</li>
              <li><strong>Berechtigtes Interesse:</strong> Die Bearbeitung ist zur Wahrung unserer berechtigten Interessen erforderlich</li>
              <li><strong>Gesetzliche Verpflichtung:</strong> Die Bearbeitung ist zur Erfüllung einer rechtlichen Verpflichtung erforderlich</li>
            </ul>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">6. Drittanbieter und Auftragsbearbeiter</h2>
            <p>Wir arbeiten mit folgenden Drittanbietern zusammen:</p>
            
            <h5 className="mt-4 mb-2">6.1 Hosting und Infrastruktur</h5>
            <ul>
              <li><strong>Vercel Inc.</strong> (USA) - Frontend-Hosting und Deployment</li>
              <li><strong>Render Services Inc.</strong> (USA) - Backend-Hosting und Server-Infrastruktur</li>
            </ul>

            <h5 className="mt-4 mb-2">6.2 Datenbank-Services</h5>
            <ul>
              <li><strong>MongoDB Inc.</strong> (USA) - Datenbank-Hosting über MongoDB Atlas</li>
            </ul>

            <h5 className="mt-4 mb-2">6.3 Cloud-Speicher</h5>
            <ul>
              <li><strong>Amazon Web Services (AWS)</strong> (USA) - Speicherung von Bewerbungsunterlagen und Lebensläufen über Amazon S3</li>
            </ul>

            <h5 className="mt-4 mb-2">6.4 Analyse-Tools</h5>
            <ul>
              <li><strong>Google Analytics</strong> (Google LLC, USA) - Website-Analyse mit IP-Anonymisierung</li>
            </ul>

            <p className="mt-3">
              <strong>Rechtliche Grundlage:</strong> Alle Datenübertragungen in die USA erfolgen auf Basis von:
            </p>
            <ul>
              <li>EU-Standardvertragsklauseln (SCCs)</li>
              <li>Angemessenheitsbeschlüssen (EU-US Data Privacy Framework, soweit verfügbar)</li>
              <li>Zusätzlichen technischen und organisatorischen Massnahmen</li>
            </ul>

            <p className="mt-3">
              Alle Drittanbieter sind vertraglich verpflichtet, Ihre Daten nur in unserem Auftrag und gemäss 
              unseren Weisungen zu bearbeiten. Sie haben entsprechende Auftragsverarbeitungsverträge (AVV) 
              mit uns abgeschlossen.
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">7. Datenübermittlung ins Ausland</h2>
            <p>
              Teilweise werden Ihre Daten an Drittanbieter in Ländern ohne angemessenes Datenschutzniveau übermittelt, 
              insbesondere in die <strong>USA</strong>.
            </p>
            <p>
              Diese Übermittlungen erfolgen auf Basis von:
            </p>
            <ul>
              <li>EU-Standardvertragsklauseln</li>
              <li>Angemessenheitsbeschlüssen der EU-Kommission</li>
              <li>Ihrer ausdrücklichen Einwilligung</li>
            </ul>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">8. Speicherdauer</h2>
            <p>Wir speichern Ihre Daten nur so lange, wie es für den jeweiligen Zweck erforderlich ist:</p>
            <ul>
              <li><strong>Nutzungsdaten:</strong> 6 Monate nach Erhebung</li>
              <li><strong>Bewerbungsdaten:</strong> 6 Monate nach Abschluss des Bewerbungsverfahrens</li>
              <li><strong>Cookies:</strong> Je nach Cookie-Typ zwischen Session-Ende und 24 Monaten</li>
              <li><strong>Rechtliche Aufbewahrungspflichten:</strong> Bis zum Ablauf der gesetzlichen Fristen</li>
            </ul>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">9. Ihre Rechte</h2>
            <p>Gemäss nDSG haben Sie folgende Rechte bezüglich Ihrer Personendaten:</p>
            <ul>
              <li><strong>Recht auf Auskunft:</strong> Information über die Bearbeitung Ihrer Daten</li>
              <li><strong>Recht auf Berichtigung:</strong> Korrektur unrichtiger Daten</li>
              <li><strong>Recht auf Löschung:</strong> Löschung nicht mehr benötigter Daten</li>
              <li><strong>Recht auf Widerspruch:</strong> Widerspruch gegen die weitere Bearbeitung</li>
              <li><strong>Recht auf Datenübertragbarkeit:</strong> Herausgabe Ihrer Daten in strukturiertem Format</li>
              <li><strong>Recht auf Beschwerde:</strong> Beschwerde beim Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB)</li>
            </ul>
            <p>
              Zur Ausübung Ihrer Rechte kontaktieren Sie uns unter: 
              <a href="mailto:kontakt@surveyjobs.ch" className="text-success">kontakt@surveyjobs.ch</a>
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">10. Cookie-Banner und Einwilligung</h2>
            <p>
              Beim ersten Besuch unserer Website erscheint ein Cookie-Banner, über das Sie Ihre Einwilligung 
              zur Verwendung von Cookies erteilen oder verweigern können.
            </p>
            <p>
              Sie können Ihre Einstellungen jederzeit über den "Cookie-Einstellungen"-Link am Ende der Website 
              verwalten oder Cookies direkt in Ihrem Browser deaktivieren.
            </p>
            <p>
              <strong>Hinweis:</strong> Ohne bestimmte Cookies kann die Funktionalität unserer Website 
              eingeschränkt sein.
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">11. Änderungen der Datenschutzerklärung</h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen, um sie an 
              geänderte Rechtslage oder geänderte Leistungen anzupassen.
            </p>
            <p>
              Über wesentliche Änderungen werden wir Sie informieren durch:
            </p>
            <ul>
              <li>Hinweis auf der Website</li>
              <li>E-Mail-Benachrichtigung (falls vorhanden)</li>
            </ul>
            <p>
              <strong>Stand dieser Datenschutzerklärung:</strong> Januar 2024
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">12. Kontakt</h2>
            <p>
              Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte können Sie sich jederzeit an uns wenden:
            </p>
            <p>
              <strong>E-Mail:</strong> <a href="mailto:kontakt@surveyjobs.ch" className="text-success">kontakt@surveyjobs.ch</a><br />
              <strong>Adresse:</strong> Max Mustermann, Musterweg 1, CH-1234 Musterstadt
            </p>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="btn btn-success">
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    </main>
  );
} 