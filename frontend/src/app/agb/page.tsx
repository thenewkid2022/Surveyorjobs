"use client";

import Link from "next/link";

export default function AGB() {
  return (
    <main className="bg-light min-vh-100 font-sans">
      <div className="container py-5">
        <h1 className="display-5 fw-bold text-success mb-4">Allgemeine Geschäftsbedingungen (AGB)</h1>
        
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">1. Vertragsgegenstand und Geltungsbereich</h2>
            
            <h5 className="mt-4 mb-2">1.1 Plattform</h5>
            <p>
              SurveyorJobs betreibt eine Online-Plattform für Stelleninserate und Lebenslauf-Zugriff in der Schweiz. 
              Die Plattform ermöglicht es Arbeitgebern, Stellenausschreibungen zu veröffentlichen und auf Lebensläufe 
              von Bewerbern zuzugreifen.
            </p>

            <h5 className="mt-4 mb-2">1.2 Keine Vermittlungsgarantie</h5>
            <p>
              SurveyorJobs übernimmt keine Verantwortung für das Zustandekommen von Arbeitsverhältnissen. 
              Die Plattform stellt lediglich ein Werkzeug zur Verfügung, um Arbeitgeber und potenzielle 
              Arbeitnehmer zu verbinden. Alle Einstellungsentscheidungen liegen ausschliesslich bei den Arbeitgebern.
            </p>

            <h5 className="mt-4 mb-2">1.3 Geltungsbereich</h5>
            <p>
              Diese AGB gelten für alle Nutzer der Plattform SurveyorJobs. Mit der Registrierung oder Nutzung 
              der Plattform erkennen Sie diese AGB als verbindlich an.
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">2. Nutzungsbedingungen</h2>
            
            <h5 className="mt-4 mb-2">2.1 Registrierung und Verifizierung</h5>
            <p>
              Arbeitgeber müssen sich registrieren und verifizieren lassen, bevor sie Stelleninserate aufgeben können. 
              Die Angaben müssen vollständig und wahrheitsgemäss sein. SurveyorJobs behält sich das Recht vor, 
              Registrierungen abzulehnen oder zu überprüfen.
            </p>

            <h5 className="mt-4 mb-2">2.2 Verbot von Missbrauch</h5>
            <p>
              Folgende Handlungen sind untersagt:
            </p>
            <ul>
              <li>Veröffentlichung rechtswidriger, diskriminierender oder beleidigender Inhalte</li>
              <li>Spam oder automatisierte Massensendungen</li>
              <li>Umgehung von Zahlungssystemen oder technischen Beschränkungen</li>
              <li>Missbrauch von Bewerberdaten oder Kontaktinformationen</li>
              <li>Falsche oder irreführende Stellenausschreibungen</li>
            </ul>

            <h5 className="mt-4 mb-2">2.3 Laufzeit der Inserate</h5>
            <p>
              Stelleninserate sind standardmässig 30 Tage aktiv, sofern nicht anders vereinbart. 
              Nach Ablauf werden die Inserate automatisch deaktiviert und müssen neu erstellt werden.
            </p>

            <h5 className="mt-4 mb-2">2.4 Moderation</h5>
            <p>
              SurveyorJobs behält sich das Recht vor, Inhalte zu moderieren, zu bearbeiten oder zu entfernen, 
              die gegen diese AGB oder geltendes Recht verstossen.
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">3. Preise und Zahlungsbedingungen</h2>
            
            <h5 className="mt-4 mb-2">3.1 Paketübersicht</h5>
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="border p-3 rounded">
                  <h6 className="fw-bold text-primary">Basic - CHF 99/Monat</h6>
                  <ul className="mb-0">
                    <li>1 Stelleninserat</li>
                    <li>1 anonymisierter Lebenslauf</li>
                    <li>Standard-Sichtbarkeit</li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="border p-3 rounded">
                  <h6 className="fw-bold text-primary">Pro - CHF 249/Monat</h6>
                  <ul className="mb-0">
                    <li>3 Stelleninserate</li>
                    <li>10 vollständige Lebensläufe</li>
                    <li>Hervorgehobene Anzeigen</li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="border p-3 rounded">
                  <h6 className="fw-bold text-primary">Enterprise - CHF 499/Monat</h6>
                  <ul className="mb-0">
                    <li>10 Stelleninserate</li>
                    <li>50 vollständige Lebensläufe</li>
                    <li>Analytics-Dashboard</li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="border p-3 rounded">
                  <h6 className="fw-bold text-primary">Unlimited - CHF 799/Monat</h6>
                  <ul className="mb-0">
                    <li>Unbegrenzte Stelleninserate</li>
                    <li>Unbegrenzter CV-Zugriff</li>
                    <li>API-Zugang</li>
                  </ul>
                </div>
              </div>
            </div>

            <h5 className="mt-4 mb-2">3.2 Zahlungsbedingungen</h5>
            <ul>
              <li><strong>Zahlungsweise:</strong> Monatliche Zahlung via Stripe</li>
              <li><strong>Währung:</strong> Alle Preise verstehen sich in Schweizer Franken (CHF) inklusive Mehrwertsteuer</li>
              <li><strong>Fälligkeit:</strong> Zahlung erfolgt im Voraus bei Paketbuchung</li>
              <li><strong>Zahlungsmethoden:</strong> Kreditkarte, Debitkarte über Stripe</li>
            </ul>

            <h5 className="mt-4 mb-2">3.3 Rückerstattungen</h5>
            <p>
              Rückerstattungen sind grundsätzlich ausgeschlossen, es sei denn, es liegt ein technischer Fehler 
              unsererseits vor oder gesetzliche Bestimmungen schreiben eine Rückerstattung vor.
            </p>

            <h5 className="mt-4 mb-2">3.4 Preisänderungen</h5>
            <p>
              SurveyorJobs behält sich das Recht vor, Preise zu ändern. Bestehende Abonnements bleiben für 
              die laufende Abrechnungsperiode von Preisänderungen unberührt.
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">4. Datenschutz und Bewerbereinwilligung</h2>
            
            <h5 className="mt-4 mb-2">4.1 Bewerber-Einwilligung</h5>
            <p>
              Lebensläufe werden nur mit expliziter Einwilligung der Bewerber zugänglich gemacht. 
              Bewerber können ihre Einwilligung jederzeit widerrufen.
            </p>

            <h5 className="mt-4 mb-2">4.2 Anonymisierte vs. vollständige Lebensläufe</h5>
            <ul>
              <li><strong>Basic-Paket:</strong> Nur anonymisierte Lebensläufe (ohne Kontaktdaten)</li>
              <li><strong>Pro/Enterprise/Unlimited:</strong> Vollständige Lebensläufe mit Kontaktdaten</li>
            </ul>

            <h5 className="mt-4 mb-2">4.3 Datensicherheit</h5>
            <p>
              Alle Daten werden verschlüsselt gespeichert. Der Zugriff auf Lebensläufe wird protokolliert. 
              Detaillierte Informationen finden Sie in unserer 
              <Link href="/datenschutz" className="text-success">Datenschutzerklärung</Link>.
            </p>

            <h5 className="mt-4 mb-2">4.4 Datenlöschung</h5>
            <p>
              Bewerberdaten werden nach Ablauf der gesetzlichen Aufbewahrungsfristen oder auf Verlangen 
              des Bewerbers gelöscht.
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">5. Haftungsausschluss</h2>
            
            <h5 className="mt-4 mb-2">5.1 Haftungsbeschränkung</h5>
            <p>
              SurveyorJobs haftet nicht für:
            </p>
            <ul>
              <li>Inhalte von Stelleninseraten oder Lebensläufen</li>
              <li>Wahrheitsgehalt der Angaben von Arbeitgebern oder Bewerbern</li>
              <li>Zustandekommen oder Scheitern von Arbeitsverhältnissen</li>
              <li>Schäden aus der Nutzung der Plattform, soweit gesetzlich zulässig</li>
            </ul>

            <h5 className="mt-4 mb-2">5.2 Moderation unzulässiger Inhalte</h5>
            <p>
              SurveyorJobs entfernt unverzüglich Inserate oder Inhalte, die gegen geltendes Recht verstossen, 
              nachdem wir davon Kenntnis erhalten haben. Nutzer können Verstösse über unser Kontaktformular melden.
            </p>

            <h5 className="mt-4 mb-2">5.3 Verfügbarkeit</h5>
            <p>
              Wir bemühen uns um eine hohe Verfügbarkeit der Plattform, können jedoch keine 100%ige Erreichbarkeit garantieren. 
              Wartungsarbeiten werden nach Möglichkeit angekündigt.
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">6. Rechte und Pflichten der Vertragsparteien</h2>
            
            <h5 className="mt-4 mb-2">6.1 Pflichten der Arbeitgeber</h5>
            <ul>
              <li>Verantwortung für Richtigkeit und Rechtmässigkeit der Stelleninserate</li>
              <li>Einhaltung arbeitsrechtlicher Bestimmungen</li>
              <li>Respektvoller Umgang mit Bewerberdaten</li>
              <li>Einhaltung der Paket-Limits (Anzahl Inserate, CV-Zugriffe)</li>
            </ul>

            <h5 className="mt-4 mb-2">6.2 Rechte der Bewerber</h5>
            <ul>
              <li>Widerruf der Einwilligung zur Datennutzung jederzeit möglich</li>
              <li>Recht auf Auskunft, Berichtigung und Löschung ihrer Daten</li>
              <li>Kostenlose Nutzung der Plattform als Bewerber</li>
            </ul>

            <h5 className="mt-4 mb-2">6.3 Rechte von SurveyorJobs</h5>
            <ul>
              <li>Sperrung oder Löschung von Nutzerkonten bei Verstössen</li>
              <li>Bearbeitung oder Entfernung von Inhalten</li>
              <li>Anpassung der Plattform und Services</li>
            </ul>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">7. Vertragslaufzeit und Kündigung</h2>
            
            <h5 className="mt-4 mb-2">7.1 Laufzeit</h5>
            <p>
              Verträge laufen auf monatlicher Basis mit automatischer Verlängerung, sofern nicht gekündigt wird.
            </p>

            <h5 className="mt-4 mb-2">7.2 Kündigung</h5>
            <ul>
              <li><strong>Ordentliche Kündigung:</strong> Möglich per Ende jedes Kalendermonats mit einer Kündigungsfrist von 30 Tagen</li>
              <li><strong>Ausserordentliche Kündigung:</strong> Bei schwerwiegenden Vertragsverletzungen</li>
              <li><strong>Kündigungsform:</strong> Schriftlich per E-Mail an kontakt@surveyjobs.ch</li>
            </ul>

            <h5 className="mt-4 mb-2">7.3 Folgen der Kündigung</h5>
            <p>
              Nach Kündigung oder Nichtzahlung werden Stelleninserate deaktiviert und der Zugriff auf 
              Premium-Features eingestellt. Bereits veröffentlichte Inserate können bis zum Ende der 
              bezahlten Periode aktiv bleiben.
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">8. Anwendbares Recht und Gerichtsstand</h2>
            
            <h5 className="mt-4 mb-2">8.1 Anwendbares Recht</h5>
            <p>
              Auf diese AGB und alle sich daraus ergebenden Rechtsverhältnisse findet ausschliesslich 
              Schweizer Recht Anwendung, insbesondere:
            </p>
            <ul>
              <li>Schweizerisches Obligationenrecht (OR)</li>
              <li>Schweizerisches Datenschutzgesetz (DSG)</li>
              <li>Weitere anwendbare Schweizer Gesetze</li>
            </ul>

            <h5 className="mt-4 mb-2">8.2 Gerichtsstand</h5>
            <p>
              Ausschliesslicher Gerichtsstand für alle Streitigkeiten ist Zürich, Schweiz.
            </p>

            <h5 className="mt-4 mb-2">8.3 EU-DSGVO</h5>
            <p>
              Soweit die EU-Datenschutz-Grundverordnung (DSGVO) anwendbar ist, gelten zusätzlich deren Bestimmungen.
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">9. Änderung der AGB</h2>
            
            <h5 className="mt-4 mb-2">9.1 Änderungsvorbehalt</h5>
            <p>
              SurveyorJobs behält sich das Recht vor, diese AGB bei Bedarf zu ändern.
            </p>

            <h5 className="mt-4 mb-2">9.2 Ankündigung</h5>
            <p>
              Änderungen werden den Nutzern mindestens 14 Tage vor Inkrafttreten per E-Mail mitgeteilt 
              und auf der Website veröffentlicht.
            </p>

            <h5 className="mt-4 mb-2">9.3 Widerspruchsrecht</h5>
            <p>
              Nutzer können Änderungen innerhalb von 14 Tagen widersprechen. Bei Widerspruch endet 
              das Vertragsverhältnis zum Zeitpunkt des Inkrafttretens der neuen AGB.
            </p>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h4 mb-3">10. Schlussbestimmungen</h2>
            
            <h5 className="mt-4 mb-2">10.1 Salvatorische Klausel</h5>
            <p>
              Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, berührt dies nicht 
              die Wirksamkeit der übrigen Bestimmungen.
            </p>

            <h5 className="mt-4 mb-2">10.2 Kontakt</h5>
            <p>
              Bei Fragen zu diesen AGB wenden Sie sich an:<br />
              <strong>E-Mail:</strong> <a href="mailto:kontakt@surveyjobs.ch" className="text-success">kontakt@surveyjobs.ch</a><br />
              <strong>Adresse:</strong> [Ihre Geschäftsadresse]
            </p>

            <h5 className="mt-4 mb-2">10.3 Inkrafttreten</h5>
            <p>
              Diese AGB treten am [Datum] in Kraft und ersetzen alle vorherigen Versionen.
            </p>
          </div>
        </div>

        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          <strong>Stand:</strong> [Aktualisierungsdatum] - Version 1.0
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="btn btn-success me-3">
            Zurück zur Startseite
          </Link>
          <Link href="/datenschutz" className="btn btn-outline-success">
            Datenschutzerklärung
          </Link>
        </div>
      </div>
    </main>
  );
}