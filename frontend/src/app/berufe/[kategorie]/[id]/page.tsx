import { FaMapMarkerAlt, FaBuilding, FaCalendarAlt, FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaBriefcase, FaGraduationCap, FaCar, FaFilePdf } from "react-icons/fa";
import { IconBaseProps } from "react-icons";
import Link from "next/link";
import { getApiUrl } from "@/utils/api";
import { Job } from "@/types/job";
import DownloadButton from "@/app/components/DownloadButton";

async function getEntry(id: string) {
  try {
    // Versuche zuerst als Stellenangebot
    const jobRes = await fetch(`${getApiUrl()}/api/stellenanzeigen-aufgeben/${id}`);
    if (jobRes.ok) {
      const job = await jobRes.json();
      return { type: 'job', data: job };
    }

    // Wenn nicht gefunden, versuche als Stellengesuch
    const gesuchRes = await fetch(`${getApiUrl()}/api/suche-einen-job/${id}`);
    if (gesuchRes.ok) {
      const gesuch = await gesuchRes.json();
      return { type: 'gesuch', data: gesuch };
    }

    return null;
  } catch (error) {
    console.error('Fehler beim Laden des Eintrags:', error);
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; kategorie: string }>;
}) {
  const resolvedParams = await params;
  const entry = await getEntry(resolvedParams.id);

  if (!entry) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          Eintrag nicht gefunden
        </div>
        <Link href={`/berufe/${resolvedParams.kategorie}`} className="btn btn-primary">
          <FaArrowLeft {...{ style: { marginRight: "0.5rem" } } as IconBaseProps} />
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <Link href={`/berufe/${resolvedParams.kategorie}`} className="btn btn-outline-primary mb-4">
        <FaArrowLeft {...{ style: { marginRight: "0.5rem" } } as IconBaseProps} />
        Zurück zur Übersicht
      </Link>

      <div className="card shadow-sm border-primary">
        <div className="card-body">
          {entry.type === 'job' ? (
            // Stellenangebot anzeigen
            <>
              <h1 className="card-title h2 mb-4 text-primary">{entry.data.titel}</h1>
              
              {/* Unternehmen und Kategorie */}
              {entry.data.unternehmen && (
                <div className="mb-3">
                  <FaBuilding {...{ size: 20, style: { marginRight: '0.5rem', color: '#0d6efd' } } as IconBaseProps} />
                  <span className="text-primary"><strong>Unternehmen:</strong> {entry.data.unternehmen}</span>
                </div>
              )}
              <div className="mb-3">
                <FaBuilding {...{ size: 20, style: { marginRight: '0.5rem', color: '#0d6efd' } } as IconBaseProps} />
                <span className="text-primary"><strong>Kategorie:</strong> {entry.data.kategorie}</span>
              </div>

              {/* Standort */}
              <div className="mb-3">
                <FaMapMarkerAlt {...{ size: 20, style: { marginRight: '0.5rem', color: '#0d6efd' } } as IconBaseProps} />
                <span className="text-primary"><strong>Standort:</strong> {entry.data.standort}</span>
              </div>

              {/* Anstellungsart und Erfahrung */}
              {entry.data.artDerStelle && (
                <div className="mb-3">
                  <FaUser {...{ size: 20, style: { marginRight: '0.5rem', color: '#0d6efd' } } as IconBaseProps} />
                  <span className="text-primary"><strong>Anstellungsart:</strong> {entry.data.artDerStelle}</span>
                </div>
              )}
              {entry.data.erfahrung && (
                <div className="mb-3">
                  <FaCalendarAlt {...{ size: 20, style: { marginRight: '0.5rem', color: '#0d6efd' } } as IconBaseProps} />
                  <span className="text-primary"><strong>Erfahrung:</strong> {entry.data.erfahrung}</span>
                </div>
              )}

              {/* Beschreibung */}
              <div className="mb-4">
                <h2 className="h4 mb-3 text-primary">Beschreibung</h2>
                <p className="text-secondary">{entry.data.beschreibung}</p>
              </div>

              {/* Kontakt */}
              <div className="card bg-light border-primary">
                <div className="card-body">
                  <h2 className="h4 mb-3 text-primary">Kontakt</h2>
                  {entry.data.kontaktName && (
                    <div className="mb-2">
                      <FaUser {...{ size: 20, style: { marginRight: '0.5rem', color: '#0d6efd' } } as IconBaseProps} />
                      <span className="text-primary"><strong>Ansprechpartner:</strong> {entry.data.kontaktName}</span>
                    </div>
                  )}
                  {entry.data.kontaktEmail && (
                    <div className="mb-2">
                      <FaEnvelope {...{ size: 20, style: { marginRight: '0.5rem', color: '#0d6efd' } } as IconBaseProps} />
                      <span className="text-primary">
                        <strong>E-Mail:</strong>{" "}
                        <a href={`mailto:${entry.data.kontaktEmail}`} className="text-primary">
                          {entry.data.kontaktEmail}
                        </a>
                      </span>
                    </div>
                  )}
                  {entry.data.kontaktTelefon && (
                    <div className="mb-0">
                      <FaPhone {...{ size: 20, style: { marginRight: '0.5rem', color: '#0d6efd' } } as IconBaseProps} />
                      <span className="text-primary">
                        <strong>Telefon:</strong>{" "}
                        <a href={`tel:${entry.data.kontaktTelefon}`} className="text-primary">
                          {entry.data.kontaktTelefon}
                        </a>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status und Datum */}
              <div className="mt-3">
                <small className="text-muted">
                  Eingestellt am: {new Date(entry.data.erstelltAm).toLocaleDateString("de-DE")}
                  {entry.data.status !== 'aktiv' && (
                    <span className="ms-2 badge bg-secondary">{entry.data.status}</span>
                  )}
                </small>
              </div>
            </>
          ) : (
            // Stellengesuch anzeigen
            <>
              <h1 className="card-title h2 mb-4 text-success">{entry.data.berufswunsch || entry.data.position}</h1>
              
              {/* Beruf und Ausbildung */}
              <div className="mb-3">
                <FaBriefcase {...{ size: 20, style: { marginRight: '0.5rem', color: '#198754' } } as IconBaseProps} />
                <span className="text-success"><strong>Beruf:</strong> {entry.data.beruf}</span>
              </div>
              <div className="mb-3">
                <FaGraduationCap {...{ size: 20, style: { marginRight: '0.5rem', color: '#198754' } } as IconBaseProps} />
                <span className="text-success"><strong>Ausbildung:</strong> {entry.data.ausbildung}</span>
              </div>

              {/* Standort und Mobilität */}
              <div className="mb-3">
                <FaMapMarkerAlt {...{ size: 20, style: { marginRight: '0.5rem', color: '#198754' } } as IconBaseProps} />
                <span className="text-success"><strong>Standort:</strong> {entry.data.standort}</span>
              </div>
              <div className="mb-3">
                <FaCar {...{ size: 20, style: { marginRight: '0.5rem', color: '#198754' } } as IconBaseProps} />
                <span className="text-success"><strong>Mobilität:</strong> {entry.data.mobilitaet}</span>
              </div>

              {/* Anstellungsart und Erfahrung */}
              <div className="mb-3">
                <FaBriefcase {...{ size: 20, style: { marginRight: '0.5rem', color: '#198754' } } as IconBaseProps} />
                <span className="text-success"><strong>Anstellungsart:</strong> {entry.data.artDerStelle}</span>
              </div>
              <div className="mb-3">
                <FaCalendarAlt {...{ size: 20, style: { marginRight: '0.5rem', color: '#198754' } } as IconBaseProps} />
                <span className="text-success"><strong>Erfahrung:</strong> {entry.data.erfahrung}</span>
              </div>

              {/* Beschreibung */}
              <div className="mb-4">
                <h2 className="h4 mb-3 text-success">Beschreibung</h2>
                <p className="text-secondary">{entry.data.beschreibung}</p>
              </div>

              {/* Kontakt */}
              <div className="card bg-light border-success">
                <div className="card-body">
                  <h2 className="h4 mb-3 text-success">Kontakt</h2>
                  {entry.data.kontaktEmail && (
                    <div className="mb-2">
                      <FaEnvelope {...{ size: 20, style: { marginRight: '0.5rem', color: '#198754' } } as IconBaseProps} />
                      <span className="text-success">
                        <strong>E-Mail:</strong>{" "}
                        <a href={`mailto:${entry.data.kontaktEmail}`} className="text-success">
                          {entry.data.kontaktEmail}
                        </a>
                      </span>
                    </div>
                  )}
                  {entry.data.kontaktTelefon && (
                    <div className="mb-0">
                      <FaPhone {...{ size: 20, style: { marginRight: '0.5rem', color: '#198754' } } as IconBaseProps} />
                      <span className="text-success">
                        <strong>Telefon:</strong>{" "}
                        <a href={`tel:${entry.data.kontaktTelefon}`} className="text-success">
                          {entry.data.kontaktTelefon}
                        </a>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Lebenslauf Download - nur für Stellengesuche */}
              {entry.data.lebenslauf && (
                <div className="mt-3">
                  <DownloadButton fileUrl={entry.data.lebenslauf} variant="view" />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 