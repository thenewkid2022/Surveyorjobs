import { FaMapMarkerAlt, FaBuilding, FaCalendarAlt, FaArrowLeft } from "react-icons/fa";
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

      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="card-title h2 mb-4">{job.titel}</h1>
          {job.unternehmen && (
            <div className="mb-3">
              <FaBuilding {...{ size: 20, style: { marginRight: '0.5rem', color: '#2563eb' } } as IconBaseProps} />
              <span>{job.unternehmen}</span>
            </div>
          )}
          <div className="mb-3">
            <FaMapMarkerAlt {...{ size: 20, style: { marginRight: '0.5rem', color: '#2563eb' } } as IconBaseProps} />
            <span>{job.standort}</span>
          </div>
          {job.artDerStelle && (
            <div className="mb-3">
              <span className="badge bg-primary fs-6">{job.artDerStelle}</span>
            </div>
          )}
          <div className="mb-3">
            <FaCalendarAlt {...{ size: 20, style: { marginRight: '0.5rem', color: '#2563eb' } } as IconBaseProps} />
            <span>Eingestellt am: {new Date(job.erstelltAm).toLocaleDateString("de-DE")}</span>
          </div>
          <div className="mb-4">
            <h2 className="h4 mb-3">Beschreibung</h2>
            <p className="text-secondary">{job.beschreibung}</p>
          </div>
          {(job.kontaktEmail || job.kontaktTelefon) && (
            <div className="card bg-light">
              <div className="card-body">
                <h2 className="h4 mb-3">Kontakt</h2>
                {job.kontaktEmail && (
                  <p className="mb-2">
                    <strong>E-Mail:</strong>{" "}
                    <a href={`mailto:${job.kontaktEmail}`} className="text-primary">
                      {job.kontaktEmail}
                    </a>
                  </p>
                )}
                {job.kontaktTelefon && (
                  <p className="mb-0">
                    <strong>Telefon:</strong>{" "}
                    <a href={`tel:${job.kontaktTelefon}`} className="text-primary">
                      {job.kontaktTelefon}
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
