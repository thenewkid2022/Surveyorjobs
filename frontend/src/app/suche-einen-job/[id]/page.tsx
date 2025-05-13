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
      <div className="container py-5">
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
    <div className="container py-5">
      <Link href="/" className="btn btn-outline-success mb-4">
        <FaArrowLeft {...{ style: { marginRight: "0.5rem" } } as IconBaseProps} />
        Zurück zur Übersicht
      </Link>

      <div className="card shadow-sm border-success">
        <div className="card-body">
          <h1 className="card-title h2 mb-4 text-success">{sucheEinenJob.beruf}</h1>
          
          {/* Beruf und Ausbildung */}
          <div className="mb-3">
            <FaBriefcase {...{ size: 20, style: { marginRight: '0.5rem', color: '#198754' } } as IconBaseProps} />
            <span className="text-success"><strong>Beruf:</strong> {sucheEinenJob.beruf}</span>
          </div>
          <div className="mb-3">
            <FaGraduationCap {...{ size: 20, style: { marginRight: '0.5rem', color: '#198754' } } as IconBaseProps} />
            <span className="text-success"><strong>Ausbildung:</strong> {sucheEinenJob.ausbildung}</span>
          </div>

          {/* Standort und Mobilität */}
          <div className="mb-3">
            <FaMapMarkerAlt {...{ size: 20, style: { marginRight: '0.5rem', color: '#198754' } } as IconBaseProps} />
            <span className="text-success"><strong>Standort:</strong> {sucheEinenJob.standort}</span>
          </div>
          <div className="mb-3">
            <FaCar {...{ size: 20, style: { marginRight: '0.5rem', color: '#198754' } } as IconBaseProps} />
            <span className="text-success"><strong>Mobilität:</strong> {sucheEinenJob.mobilitaet}</span>
          </div>

          {/* Anstellungsart und Erfahrung */}
          <div className="mb-3">
            <FaBriefcase {...{ size: 20, style: { marginRight: '0.5rem', color: '#198754' } } as IconBaseProps} />
            <span className="text-success"><strong>Anstellungsart:</strong> {sucheEinenJob.artDerStelle}</span>
          </div>
          <div className="mb-3">
            <FaCalendarAlt {...{ size: 20, style: { marginRight: '0.5rem', color: '#198754' } } as IconBaseProps} />
            <span className="text-success"><strong>Erfahrung:</strong> {sucheEinenJob.erfahrung}</span>
          </div>

          {/* Verfügbarkeit */}
          <div className="mb-3">
            <FaClock {...{ size: 20, style: { marginRight: '0.5rem', color: '#198754' } } as IconBaseProps} />
            <span className="text-success"><strong>Verfügbar ab:</strong> {new Date(sucheEinenJob.verfuegbarAb).toLocaleDateString("de-DE")}</span>
          </div>

          {/* Fähigkeiten und Sprachen */}
          {sucheEinenJob.faehigkeiten.length > 0 && (
            <div className="mb-3">
              <h3 className="h5 mb-2 text-success">Fähigkeiten</h3>
              <div className="d-flex flex-wrap gap-2">
                {sucheEinenJob.faehigkeiten.map((faehigkeit, index) => (
                  <span key={index} className="badge bg-success">{faehigkeit}</span>
                ))}
              </div>
            </div>
          )}
          
          {sucheEinenJob.sprachen.length > 0 && (
            <div className="mb-3">
              <h3 className="h5 mb-2 text-success">Sprachen</h3>
              <div className="d-flex flex-wrap gap-2">
                {sucheEinenJob.sprachen.map((sprache, index) => (
                  <span key={index} className="badge bg-info">{sprache}</span>
                ))}
              </div>
            </div>
          )}

          {/* Beschreibung */}
          <div className="mb-4">
            <h2 className="h4 mb-3 text-success">Beschreibung</h2>
            <p className="text-secondary">{sucheEinenJob.beschreibung}</p>
          </div>

          {/* Anschreiben */}
          {sucheEinenJob.anschreiben && (
            <div className="mb-4">
              <h2 className="h4 mb-3 text-success">Anschreiben</h2>
              <p className="text-secondary">{sucheEinenJob.anschreiben}</p>
            </div>
          )}

          {/* Dokumente */}
          <div className="mb-4">
            <h2 className="h4 mb-3 text-success">Dokumente</h2>
            <div className="d-flex gap-3">
              <DownloadButton fileUrl={sucheEinenJob.lebenslauf} variant="view" />
            </div>
          </div>

          {/* Kontakt */}
          <div className="card bg-light border-success">
            <div className="card-body">
              <h2 className="h4 mb-3 text-success">Kontakt</h2>
              {sucheEinenJob.kontaktEmail && (
                <div className="mb-2">
                  <FaEnvelope {...{ size: 20, style: { marginRight: '0.5rem', color: '#198754' } } as IconBaseProps} />
                  <span className="text-success">
                    <strong>E-Mail:</strong>{" "}
                    <a href={`mailto:${sucheEinenJob.kontaktEmail}`} className="text-success">
                      {sucheEinenJob.kontaktEmail}
                    </a>
                  </span>
                </div>
              )}
              {sucheEinenJob.kontaktTelefon && (
                <div className="mb-0">
                  <FaPhone {...{ size: 20, style: { marginRight: '0.5rem', color: '#198754' } } as IconBaseProps} />
                  <span className="text-success">
                    <strong>Telefon:</strong>{" "}
                    <a href={`tel:${sucheEinenJob.kontaktTelefon}`} className="text-success">
                      {sucheEinenJob.kontaktTelefon}
                    </a>
                  </span>
                </div>
              )}
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
  );
} 