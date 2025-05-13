"use client";
import { useState, useEffect } from "react";
import { kategorien } from "@shared/lib/berufe";
import Link from "next/link";
import { getApiUrl } from "@/utils/api";
import { FaMapMarkerAlt, FaBuilding } from "react-icons/fa";

interface Job {
  _id: string;
  titel: string;
  unternehmen: string;
  standort: string;
  artDerStelle: string;
  erfahrung: string;
  berufId: string;
  kategorie: string;
  erstelltAm: string;
  beschreibung: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedKategorie, setSelectedKategorie] = useState<string>("");
  const [selectedKanton, setSelectedKanton] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (selectedKategorie) queryParams.append('kategorie', selectedKategorie);
        if (selectedKanton) queryParams.append('kanton', selectedKanton);

        const jobsRes = await fetch(`${getApiUrl()}/api/suche-einen-job?${queryParams}`);
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          setJobs(jobsData.jobs || []);
        }
      } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedKategorie, selectedKanton]);

  const handleKategorieChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedKategorie(e.target.value);
  };

  const handleKantonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedKanton(e.target.value);
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Laden...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white min-vh-100 font-sans">
      <section className="container py-4">
        <h1 className="h2 fw-bold text-primary mb-4 text-center">Alle Stellenangebote</h1>
        <div className="row mb-4">
          <div className="col-12 col-md-6 mb-3 mb-md-0">
            <select 
              className="form-select border-primary" 
              value={selectedKategorie} 
              onChange={handleKategorieChange}
            >
              <option value="">Alle Kategorien</option>
              {Object.entries(kategorien).map(([id, titel]) => (
                <option key={id} value={id}>{titel}</option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-6">
            <select 
              className="form-select border-primary" 
              value={selectedKanton} 
              onChange={handleKantonChange}
            >
              <option value="">Alle Kantone</option>
              <option value="AG">Aargau</option>
              <option value="AI">Appenzell Innerrhoden</option>
              <option value="AR">Appenzell Ausserrhoden</option>
              <option value="BE">Bern</option>
              <option value="BL">Basel-Landschaft</option>
              <option value="BS">Basel-Stadt</option>
              <option value="FR">Freiburg</option>
              <option value="GE">Genf</option>
              <option value="GL">Glarus</option>
              <option value="GR">Graubünden</option>
              <option value="JU">Jura</option>
              <option value="LU">Luzern</option>
              <option value="NE">Neuenburg</option>
              <option value="NW">Nidwalden</option>
              <option value="OW">Obwalden</option>
              <option value="SG">St. Gallen</option>
              <option value="SH">Schaffhausen</option>
              <option value="SO">Solothurn</option>
              <option value="SZ">Schwyz</option>
              <option value="TG">Thurgau</option>
              <option value="TI">Tessin</option>
              <option value="UR">Uri</option>
              <option value="VD">Waadt</option>
              <option value="VS">Wallis</option>
              <option value="ZG">Zug</option>
              <option value="ZH">Zürich</option>
            </select>
          </div>
        </div>
        <div className="row g-4">
          {jobs.length === 0 ? (
            <div className="col-12 text-center text-muted">Keine Stellenangebote gefunden.</div>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="col-12 col-md-6">
                <div className="card h-100 border-primary">
                  <div className="card-body">
                    <h5 className="card-title text-primary">{job.titel}</h5>
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
                    <p className="text-secondary mb-3">{job.beschreibung}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        Eingestellt am: {new Date(job.erstelltAm).toLocaleDateString('de-DE')}
                      </small>
                      <Link href={`/berufe/${job.kategorie}/${job._id}`} className="btn btn-outline-primary">
                        Details anzeigen
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
} 