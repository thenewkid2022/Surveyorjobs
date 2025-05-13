"use client";

import Link from "next/link";

export default function Impressum() {
  return (
    <main className="bg-light min-vh-100 font-sans">
      <div className="container py-5">
        <h1 className="display-5 fw-bold text-success mb-4">Impressum</h1>
        
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">Angaben gemäß § 5 TMG</h2>
            <p>
              SurveyorJobs<br />
              Musterstraße 123<br />
              12345 Musterstadt
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">Kontakt</h2>
            <p>
              Telefon: +49 (0) 123 456789<br />
              E-Mail: info@surveyorjobs.de
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p>
              Max Mustermann<br />
              Musterstraße 123<br />
              12345 Musterstadt
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">EU-Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="ms-1">
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
              Verbraucherschlichtungsstelle teilzunehmen.
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