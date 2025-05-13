import { FaMapMarkerAlt, FaBuilding, FaCalendarAlt, FaArrowLeft, FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import { IconBaseProps } from "react-icons";
import Link from "next/link";

interface Job {
  _id: string;
  titel: string;
  standort: string;
  beschreibung: string;
  erstelltAm: string;
  unternehmen?: string;
  artDerStelle?: string;
  kontaktEmail?: string;
  kontaktTelefon?: string;
}

async function getJob(id: string): Promise<Job> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${id}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Job nicht gefunden");
  return response.json();
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  let job: Job | null = null;
  let error: string | null = null;

  try {
    job = await getJob(resolvedParams.id);
  } catch (err) {
    error = "Job konnte nicht geladen werden";
    console.error(err);
  }

  if (error || !job) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error || "Job nicht gefunden"}
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
      <Link href="/" className="btn btn-outline-primary mb-4">
        <FaArrowLeft {...{ style: { marginRight: "0.5rem" } } as IconBaseProps} />
        Zurück zur Übersicht
      </Link>

      <div className="card shadow-sm border-primary">
        <div className="card-body">
          <h1 className="card-title h2 mb-4 text-primary">{job.titel}</h1>
          
          {/* Unternehmen und Standort */}
          {job.unternehmen && (
            <div className="mb-3">
              <FaBuilding {...{ size: 20, style: { marginRight: '0.5rem', color: '#0d6efd' } } as IconBaseProps} />
              <span className="text-primary"><strong>Unternehmen:</strong> {job.unternehmen}</span>
            </div>
          )}
          <div className="mb-3">
            <FaMapMarkerAlt {...{ size: 20, style: { marginRight: '0.5rem', color: '#0d6efd' } } as IconBaseProps} />
            <span className="text-primary"><strong>Standort:</strong> {job.standort}</span>
          </div>

          {/* Anstellungsart */}
          {job.artDerStelle && (
            <div className="mb-3">
              <FaUser {...{ size: 20, style: { marginRight: '0.5rem', color: '#0d6efd' } } as IconBaseProps} />
              <span className="text-primary"><strong>Anstellungsart:</strong> {job.artDerStelle}</span>
            </div>
          )}

          {/* Beschreibung */}
          <div className="mb-4">
            <h2 className="h4 mb-3 text-primary">Beschreibung</h2>
            <p className="text-secondary">{job.beschreibung}</p>
          </div>

          {/* Kontakt */}
          {(job.kontaktEmail || job.kontaktTelefon) && (
            <div className="card bg-light border-primary">
              <div className="card-body">
                <h2 className="h4 mb-3 text-primary">Kontakt</h2>
                {job.kontaktEmail && (
                  <div className="mb-2">
                    <FaEnvelope {...{ size: 20, style: { marginRight: '0.5rem', color: '#0d6efd' } } as IconBaseProps} />
                    <span className="text-primary">
                      <strong>E-Mail:</strong>{" "}
                      <a href={`mailto:${job.kontaktEmail}`} className="text-primary">
                        {job.kontaktEmail}
                      </a>
                    </span>
                  </div>
                )}
                {job.kontaktTelefon && (
                  <div className="mb-0">
                    <FaPhone {...{ size: 20, style: { marginRight: '0.5rem', color: '#0d6efd' } } as IconBaseProps} />
                    <span className="text-primary">
                      <strong>Telefon:</strong>{" "}
                      <a href={`tel:${job.kontaktTelefon}`} className="text-primary">
                        {job.kontaktTelefon}
                      </a>
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Datum */}
          <div className="mt-3">
            <small className="text-muted">
              Eingestellt am: {new Date(job.erstelltAm).toLocaleDateString("de-DE")}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
