"use client";
import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaBuilding, FaUser } from "react-icons/fa";
import { IconBaseProps } from "react-icons";
import Link from "next/link";
import { getApiUrl } from "@/utils/api";
import { kantone, kantonNamen } from "@shared/lib/kantone";

interface Job {
  _id: string;
  titel: string;
  standort: string;
  beschreibung: string;
  erstelltAm: string;
  unternehmen?: string;
  artDerStelle?: string;
  kategorie?: string;
}

interface Stellengesuch {
  _id: string;
  name?: string;
  berufswunsch?: string;
  position?: string;
  standort?: string;
  beschreibung?: string;
  erstelltAm: string;
  artDerStelle?: string;
  erfahrung?: string;
  kategorie?: string;
}

const kategorieTitel: { [key: string]: string } = {
  hochbau: "Hochbau",
  tiefbau: "Tiefbau",
  ausbau: "Ausbau",
  planung: "Planung & Technik",
  weitere: "Weitere Berufe"
};

export default function BerufskategoriePage({ 
  params,
  searchParams 
}: { 
  params: { kategorie: string },
  searchParams: { kanton?: string }
}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stellengesuche, setStellengesuche] = useState<Stellengesuch[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [gesucheLoading, setGesucheLoading] = useState(true);
  const [gesucheError, setGesucheError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setJobsLoading(true);
        setGesucheLoading(true);
        setJobsError(null);
        setGesucheError(null);

        const queryParams = new URLSearchParams();
        if (params.kategorie !== 'alle') {
          queryParams.append('kategorie', params.kategorie);
        }
        if (searchParams.kanton) {
          queryParams.append('kanton', searchParams.kanton);
        }

        const [jobsRes, gesucheRes] = await Promise.all([
          fetch(`${getApiUrl()}/api/stellenanzeigen-aufgeben?${queryParams}`),
          fetch(`${getApiUrl()}/api/suche-einen-job?${queryParams}`)
        ]);

        if (!jobsRes.ok) {
          throw new Error('Fehler beim Laden der Stellenangebote');
        }
        if (!gesucheRes.ok) {
          throw new Error('Fehler beim Laden der Stellengesuche');
        }

        const [jobsData, gesucheData] = await Promise.all([
          jobsRes.json(),
          gesucheRes.json()
        ]);
        
        setJobs(jobsData.stellenanzeigen || []);
        setStellengesuche(gesucheData.jobs || []);
      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
        setJobsError(error instanceof Error ? error.message : "Fehler beim Laden der Stellenangebote");
        setGesucheError(error instanceof Error ? error.message : "Fehler beim Laden der Stellengesuche");
      } finally {
        setJobsLoading(false);
        setGesucheLoading(false);
      }
    };

    fetchData();
  }, [params.kategorie, searchParams.kanton]);

  // Anpassung des Titels, wenn ein Kanton ausgewählt ist
  const pageTitle = searchParams.kanton 
    ? `${kategorieTitel[params.kategorie] || 'Alle Berufe'} in ${kantonNamen[searchParams.kanton as keyof typeof kantonNamen]}`
    : kategorieTitel[params.kategorie] || 'Berufskategorie';

  return (
    <main className="bg-white min-vh-100 font-sans">
      <div className="container py-5">
        <h1 className="display-5 fw-bold text-primary mb-4">{pageTitle}</h1>

        {/* Jobs Section */}
        <section className="mb-5">
          <h2 className="h3 fw-bold text-primary mb-4">Stellenangebote</h2>
          {jobsLoading && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Laden...</span>
              </div>
            </div>
          )}
          {jobsError && (
            <div className="alert alert-danger text-center" role="alert">
              {jobsError}
            </div>
          )}
          {!jobsLoading && !jobsError && jobs.length === 0 && (
            <div className="text-center text-secondary py-4">
              Zurzeit keine offene Stelle in dieser Kategorie.
            </div>
          )}
          <div className="row g-4">
            {jobs.map((job) => (
              <div className="col-12 col-md-4" key={job._id}>
                <div className="border rounded-3 p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="fw-bold mb-2">{job.titel}</h5>
                    <div className="mb-2 text-primary d-flex align-items-center gap-2">
                      <FaMapMarkerAlt size={16} />
                      <span>{job.standort}</span>
                    </div>
                    {job.unternehmen && (
                      <div className="mb-2 text-primary d-flex align-items-center gap-2">
                        <FaBuilding size={16} />
                        <span>{job.unternehmen}</span>
                      </div>
                    )}
                    <p className="text-secondary mb-2" style={{minHeight: 60}}>{job.beschreibung}</p>
                  </div>
                  <div>
                    <small className="text-muted">
                      Eingestellt am: {new Date(job.erstelltAm).toLocaleDateString('de-DE')}
                    </small>
                    {job.artDerStelle && (
                      <span className="badge bg-primary ms-2">{job.artDerStelle}</span>
                    )}
                    <div className="mt-3">
                      <Link href={`/berufe/${params.kategorie}/${job._id}`} className="btn btn-outline-primary w-100">
                        Details anzeigen
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stellengesuche Section */}
        <section>
          <h2 className="h3 fw-bold text-success mb-4">Stellengesuche</h2>
          {gesucheLoading && (
            <div className="text-center py-4">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Laden...</span>
              </div>
            </div>
          )}
          {gesucheError && (
            <div className="alert alert-danger text-center" role="alert">
              {gesucheError}
            </div>
          )}
          {!gesucheLoading && !gesucheError && stellengesuche.length === 0 && (
            <div className="text-center text-secondary py-4">
              Zurzeit keine Stellengesuche in dieser Kategorie.
            </div>
          )}
          <div className="row g-4">
            {stellengesuche.map((gesuch) => (
              <div className="col-12 col-md-4" key={gesuch._id}>
                <div className="border rounded-3 p-4 h-100 d-flex flex-column justify-content-between bg-light">
                  <div>
                    <h5 className="fw-bold mb-2">{gesuch.berufswunsch || gesuch.position}</h5>
                    <div className="mb-2 text-success d-flex align-items-center gap-2">
                      <FaMapMarkerAlt size={16} />
                      <span>{gesuch.standort}</span>
                    </div>
                    <p className="text-secondary mb-2" style={{minHeight: 60}}>{gesuch.beschreibung}</p>
                  </div>
                  <div>
                    <small className="text-muted">
                      Eingestellt am: {new Date(gesuch.erstelltAm).toLocaleDateString('de-DE')}
                    </small>
                    {gesuch.artDerStelle && (
                      <span className="badge bg-success ms-2">{gesuch.artDerStelle}</span>
                    )}
                    {gesuch.erfahrung && (
                      <span className="badge bg-secondary ms-2">{gesuch.erfahrung}</span>
                    )}
                    <div className="mt-3">
                      <Link 
                        href={`/berufe/${params.kategorie}/${gesuch._id}`} 
                        className="btn btn-outline-success w-100"
                      >
                        Details anzeigen
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
} 