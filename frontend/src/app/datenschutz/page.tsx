"use client";

import Link from "next/link";

export default function Datenschutz() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Datenschutzerklärung</h1>
      
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h4 mb-3">Verantwortlicher</h2>
          <p>
            Max Mustermann<br />
            Musterweg 1<br />
            1234 Musterstadt<br />
            Schweiz<br />
            E-Mail: <a href="mailto:kontakt@surveyjobs.org">kontakt@surveyjobs.org</a>
          </p>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h4 mb-3">Allgemeines</h2>
          <p>
            Der Schutz Ihrer personenbezogenen Daten ist uns wichtig. Diese Datenschutzerklärung erläutert, 
            welche Daten wir auf www.surveyjobs.org erheben, wie wir sie verwenden und welche Rechte Ihnen 
            gemäß dem Schweizer Datenschutzgesetz (nDSG) zustehen.
          </p>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h4 mb-3">Erhobene Daten</h2>
          <p>Wir erheben und verarbeiten folgende Daten:</p>
          <ul>
            <li><strong>Nutzungsdaten</strong>: IP-Adresse, Browser, Betriebssystem, Zeitpunkt des Zugriffs (bei Website-Besuch).</li>
            <li><strong>Jobinserate/Bewerbungen</strong>: Name, E-Mail, hochgeladene Dokumente (falls Nutzer Inserate oder Bewerbungen einreichen).</li>
            <li><strong>Cookies</strong>: Wir verwenden Cookies für Analysezwecke (z. B. Google Analytics) und zur Verbesserung der Nutzererfahrung. Sie können Cookies über Ihren Browser oder unser Cookie-Banner ablehnen.</li>
          </ul>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h4 mb-3">Zweck der Datenverarbeitung</h2>
          <ul>
            <li>Bereitstellung und Optimierung der Website.</li>
            <li>Vermittlung von Stellenangeboten und Bewerbungen.</li>
            <li>Analyse des Nutzerverhaltens (anonymisiert).</li>
          </ul>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h4 mb-3">Drittanbieter</h2>
          <p>Wir nutzen folgende Drittanbieter:</p>
          <ul>
            <li><strong>Hosting-Provider</strong>: [Name des Hosters, z. B. Hostpoint], Schweiz, für Serverdienste.</li>
            <li><strong>Google Analytics</strong> (falls genutzt): Analyse von Nutzungsdaten (anonymisiert), betrieben von Google LLC, USA.</li>
          </ul>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h4 mb-3">Datenweitergabe</h2>
          <p>Ihre Daten werden nur weitergegeben, wenn:</p>
          <ul>
            <li>Sie eingewilligt haben (z. B. Bewerbungen an Arbeitgeber).</li>
            <li>Es gesetzlich erforderlich ist.</li>
            <li>Drittanbieter (z. B. Hoster) im Auftrag für uns tätig sind.</li>
          </ul>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h4 mb-3">Speicherdauer</h2>
          <p>
            Daten werden gelöscht, sobald sie für den Zweck nicht mehr benötigt werden, es sei denn, 
            gesetzliche Aufbewahrungspflichten bestehen. Nutzungsdaten (z. B. Logs) werden in der Regel 
            nach 6 Monaten gelöscht.
          </p>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h4 mb-3">Ihre Rechte</h2>
          <p>Gemäß nDSG haben Sie folgende Rechte:</p>
          <ul>
            <li>Auskunft über gespeicherte Daten.</li>
            <li>Berichtigung oder Löschung Ihrer Daten.</li>
            <li>Widerspruch gegen die Verarbeitung.</li>
          </ul>
          <p>Kontaktieren Sie uns unter <a href="mailto:kontakt@surveyjobs.org">kontakt@surveyjobs.org</a>.</p>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h4 mb-3">Cookies und Analysetools</h2>
          <p>
            Unsere Website nutzt Cookies. Beim ersten Besuch können Sie über das Cookie-Banner zustimmen 
            oder ablehnen. Details zu Cookies finden Sie in unserer Cookie-Richtlinie (falls verfügbar).
          </p>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h4 mb-3">Änderungen</h2>
          <p>
            Wir können diese Datenschutzerklärung anpassen. Die aktuelle Version ist auf der Website einsehbar.
          </p>
          <p><strong>Stand</strong>: 8. Mai 2025</p>
        </div>
      </div>

      <div className="text-center mt-4">
        <Link href="/" className="btn btn-primary">
          Zurück zur Startseite
        </Link>
      </div>
    </div>
  );
} 