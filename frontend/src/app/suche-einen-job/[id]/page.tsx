import { FaMapMarkerAlt, FaUser, FaBriefcase, FaCalendarAlt, FaArrowLeft, FaGraduationCap, FaCar, FaClock, FaFilePdf, FaEnvelope, FaPhone } from "react-icons/fa";
import { IconBaseProps } from "react-icons";
import Link from "next/link";
import { getApiUrl } from "@/utils/api";
import DownloadButton from "@/app/components/DownloadButton";

interface SucheEinenJob {
  _id: string;
  beruf: string;
  standort: string;
  beschreibung: string;
  erfahrung: string;
  ausbildung: string;
  faehigkeiten: string[];
  sprachen: string[];
  mobilitaet: string;
  artDerStelle: string;
  verfuegbarAb: string;
  kontaktEmail: string;
  kontaktTelefon?: string;
  lebenslauf: string;
  anschreiben?: string;
  erstelltAm: string;
  expiresAt: string;
  status: string;
}

async function getSucheEinenJob(id: string): Promise<SucheEinenJob> {
  try {
    const response = await fetch(`${getApiUrl()}/api/suche-einen-job/${id}`, { 
      cache: "no-store" 
    });
    
    if (!response.ok) {
      throw new Error("Jobsuche nicht gefunden");
    }
    
    return response.json();
  } catch (error) {
    console.error("Fehler beim Laden der Jobsuche:", error);
    throw new Error("Jobsuche konnte nicht geladen werden");
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  let sucheEinenJob: SucheEinenJob | null = null;
  let error: string | null = null;

  try {
    sucheEinenJob = await getSucheEinenJob(resolvedParams.id);
  } catch (err) {
    error = "Jobsuche konnte nicht geladen werden";
    console.error(err);
  }

  if (error || !sucheEinenJob) {
    return (
      <div className="container-fluid py-5" style={{maxWidth: '700px', margin: '0 auto'}}>
        <div className="alert alert-danger" role="alert">
          {error || "Jobsuche nicht gefunden"}
        </div>
        <Link href="/" className="btn btn-primary">
          <FaArrowLeft {...{ style: { marginRight: "0.5rem" } } as IconBaseProps} />
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  return (
    <div className="detail-page-wrapper stellengesuch">
      <div className="container-fluid py-5" style={{maxWidth: '700px', margin: '0 auto'}}>
        <Link href="/" className="btn btn-outline-secondary mb-4">
          <FaArrowLeft {...{ style: { marginRight: "0.5rem" } } as IconBaseProps} />
          Zurück zur Übersicht
        </Link>

      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="card-title h2 mb-4 text-dark">{sucheEinenJob.beruf}</h1>
          
          {/* Beruf und Ausbildung */}
          <div className="mb-3">
            <FaBriefcase className="me-2 text-muted" size={20} />
            <span className="text-dark"><strong>Beruf:</strong> {sucheEinenJob.beruf}</span>
          </div>
          <div className="mb-3">
            <FaGraduationCap className="me-2 text-muted" size={20} />
            <span className="text-dark"><strong>Ausbildung:</strong> {sucheEinenJob.ausbildung}</span>
          </div>

          {/* Standort und Mobilität */}
          <div className="mb-3">
            <FaMapMarkerAlt className="me-2 text-muted" size={20} />
            <span className="text-dark"><strong>Standort:</strong> {sucheEinenJob.standort}</span>
          </div>
          <div className="mb-3">
            <FaCar className="me-2 text-muted" size={20} />
            <span className="text-dark"><strong>Mobilität:</strong> {sucheEinenJob.mobilitaet}</span>
          </div>

          {/* Anstellungsart und Erfahrung */}
          <div className="mb-3">
            <FaBriefcase className="me-2 text-muted" size={20} />
            <span className="text-dark"><strong>Anstellungsart:</strong> {sucheEinenJob.artDerStelle}</span>
          </div>
          <div className="mb-3">
            <FaCalendarAlt className="me-2 text-muted" size={20} />
            <span className="text-dark"><strong>Erfahrung:</strong> {sucheEinenJob.erfahrung}</span>
          </div>

          {/* Verfügbarkeit */}
          <div className="mb-3">
            <FaClock className="me-2 text-muted" size={20} />
            <span className="text-dark"><strong>Verfügbar ab:</strong> {new Date(sucheEinenJob.verfuegbarAb).toLocaleDateString("de-DE")}</span>
          </div>

          {/* Fähigkeiten und Sprachen */}
          {sucheEinenJob.faehigkeiten.length > 0 && (
            <div className="mb-3">
              <h3 className="h5 mb-2 text-dark">Fähigkeiten</h3>
              <div className="d-flex flex-wrap gap-2">
                {sucheEinenJob.faehigkeiten.map((faehigkeit, index) => (
                  <span key={index} className="badge bg-dark">{faehigkeit}</span>
                ))}
              </div>
            </div>
          )}
          
          {sucheEinenJob.sprachen.length > 0 && (
            <div className="mb-3">
              <h3 className="h5 mb-2 text-dark">Sprachen</h3>
              <div className="d-flex flex-wrap gap-2">
                {sucheEinenJob.sprachen.map((sprache, index) => (
                  <span key={index} className="badge bg-secondary">{sprache}</span>
                ))}
              </div>
            </div>
          )}

          {/* Beschreibung */}
          <div className="mb-4">
            <h2 className="h4 mb-3 text-dark">Beschreibung</h2>
            <p className="text-muted">{sucheEinenJob.beschreibung}</p>
          </div>

          {/* Anschreiben */}
          {sucheEinenJob.anschreiben && (
            <div className="mb-4">
              <h2 className="h4 mb-3 text-dark">Anschreiben</h2>
              <p className="text-muted">{sucheEinenJob.anschreiben}</p>
            </div>
          )}

          {/* Dokumente - Nur für eingeloggte Arbeitgeber */}
          <div className="mb-4">
            <h2 className="h4 mb-3 text-dark">Dokumente</h2>
            <div className="alert alert-light border">
              <FaFilePdf className="me-2 text-muted" size={20} />
              <strong>Lebenslauf verfügbar</strong>
              <p className="mb-2 mt-2 text-muted">
                Um den vollständigen Lebenslauf zu sehen, benötigen Sie ein Arbeitgeber-Account.
              </p>
              <div className="d-flex gap-2">
                <Link href="/login" className="btn btn-dark btn-sm">
                  <FaUser className="me-1" />
                  Anmelden
                </Link>
                <Link href="/register" className="btn btn-outline-dark btn-sm">
                  Account erstellen
                </Link>
              </div>
            </div>
          </div>

          {/* Kontakt - Nur für eingeloggte Arbeitgeber */}
          <div className="card bg-light">
            <div className="card-body">
              <h2 className="h4 mb-3 text-dark">Kontakt</h2>
              <div className="alert alert-light border-0 bg-transparent p-0">
                <FaEnvelope className="me-2 text-muted" size={20} />
                <strong>Kontaktdaten verfügbar</strong>
                <p className="mb-2 mt-2 text-muted">
                  Melden Sie sich als Arbeitgeber an, um direkten Kontakt mit diesem Kandidaten aufzunehmen.
                </p>
                <div className="d-flex gap-2">
                  <Link href="/login" className="btn btn-dark btn-sm">
                    <FaEnvelope className="me-1" />
                    Kontakt aufnehmen
                  </Link>
                  <Link href="/register" className="btn btn-outline-dark btn-sm">
                    Kostenlos registrieren
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Status und Datum */}
          <div className="mt-3">
            <small className="text-muted">
              Eingestellt am: {new Date(sucheEinenJob.erstelltAm).toLocaleDateString("de-DE")}
              {sucheEinenJob.status !== 'aktiv' && (
                <span className="ms-2 badge bg-secondary">{sucheEinenJob.status}</span>
              )}
            </small>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
} 