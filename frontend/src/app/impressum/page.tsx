"use client";

import Link from "next/link";

export default function Impressum() {
  return (
    <main className="bg-light min-vh-100 font-sans">
      <div className="container py-5">
        <h1 className="display-5 fw-bold text-success mb-4">Impressum</h1>
        
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">Angaben gemäss Art. 3 Abs. 1 lit. s UWG</h2>
            <p>
              <strong>Firmenname:</strong><br />
              SurveyorJobs<br /><br />
              
              <strong>Betreiber:</strong><br />
              Max Mustermann<br /><br />
              
              <strong>Adresse:</strong><br />
              Musterstrasse 123<br />
              CH-1234 Musterstadt<br />
              Schweiz
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">Kontakt</h2>
            <p>
              <strong>Telefon:</strong> +41 123 456 789<br />
              <strong>E-Mail:</strong> info@surveyorjobs.ch
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">Handelsregister und Mehrwertsteuer</h2>
            <p>
              <strong>Handelsregisternummer:</strong> CHE-XXX.XXX.XXX (Platzhalter)<br />
              <strong>Mehrwertsteuernummer:</strong> CHE-XXX.XXX.XXX MWST (Platzhalter)
            </p>
            <p className="text-muted small">
              Die definitiven Nummern werden nach der Registrierung ergänzt.
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">Haftungsausschluss</h2>
            <p>
              Die Inhalte unserer Seiten wurden mit grösster Sorgfalt erstellt. Für die Richtigkeit, 
              Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. 
              Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen 
              Gesetzen verantwortlich.
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