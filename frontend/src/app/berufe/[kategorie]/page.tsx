"use client";
import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaBuilding, FaUser } from "react-icons/fa";
import { IconBaseProps } from "react-icons";
import Link from "next/link";
import { getApiUrl } from "@/utils/api";
import { kantone, kantonNamen } from "@shared/lib/kantone";
import JobCard from "../../components/JobCard";
import { Job } from "@/types/job";

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
              <div className="col-12 col-md-6 col-lg-4 col-xl-3" key={job._id}>
                <JobCard
                  id={job._id}
                  titel={job.titel}
                  standort={job.standort}
                  unternehmen={job.unternehmen}
                  artDerStelle={job.artDerStelle}
                  erstelltAm={job.erstelltAm}
                  kategorie={params.kategorie}
                  linkPrefix="berufe"
                  type="job"
                />
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
              <div className="col-12 col-md-6 col-lg-4 col-xl-3" key={gesuch._id}>
                <JobCard
                  id={gesuch._id}
                  berufswunsch={gesuch.berufswunsch}
                  position={gesuch.position}
                  standort={gesuch.standort || ""}
                  artDerStelle={gesuch.artDerStelle}
                  erstelltAm={gesuch.erstelltAm}
                  kategorie={params.kategorie}
                  linkPrefix="berufe"
                  type="search"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
} 