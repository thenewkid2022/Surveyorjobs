"use client";
import { useState, useEffect } from "react";
import { FaHardHat, FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { kategorien } from "@shared/lib/berufe";
import { getApiUrl } from "@/utils/api";

interface SucheEinenJob {
  _id: string;
  beruf: string;
  unternehmen: string;
  standort: string;
  artDerStelle: string;
  erfahrung: string;
  berufId: string;
  kategorie: string;
}

interface Stellenanzeige {
  _id: string;
  titel: string;
  standort: string;
  kategorie: string;
  beschreibung: string;
  erstelltAm: string;
  kontaktName: string;
  kontaktEmail: string;
  kontaktTelefon?: string;
}

export default function Home() {
  const [jobs, setJobs] = useState<SucheEinenJob[]>([]);
  const [stellenanzeigen, setStellenanzeigen] = useState<Stellenanzeige[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobsPage, setJobsPage] = useState(1);
  const [hasMoreJobs, setHasMoreJobs] = useState(true);
  const [loadingMoreJobs, setLoadingMoreJobs] = useState(false);

  const fetchJobs = async (pageNum: number, append: boolean = false) => {
    try {
      const jobsRes = await fetch(`${getApiUrl()}/api/suche-einen-job?page=${pageNum}&limit=6`);
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        const newJobs = jobsData.jobs || [];
        setJobs(prevJobs => append ? [...prevJobs, ...newJobs] : newJobs);
        setHasMoreJobs(pageNum < jobsData.pagination.pages);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Jobs:", error);
    } finally {
      setLoadingMoreJobs(false);
    }
  };

  const fetchStellenanzeigen = async () => {
    try {
      const stellenanzeigenRes = await fetch(`${getApiUrl()}/api/stellenanzeigen-aufgeben?limit=6`);
      if (stellenanzeigenRes.ok) {
        const stellenanzeigenData = await stellenanzeigenRes.json();
        setStellenanzeigen(stellenanzeigenData.stellenanzeigen || []);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Stellenanzeigen:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchJobs(1),
          fetchStellenanzeigen()
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLoadMoreJobs = () => {
    const nextPage = jobsPage + 1;
    setJobsPage(nextPage);
    setLoadingMoreJobs(true);
    fetchJobs(nextPage, true);
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
      {/* Optimierter Header mit Bild und Overlay */}
      <header className="position-relative w-100 mb-4" style={{height: 340, overflow: 'hidden'}}>
        <Image
          src="/header-image.jpg"
          alt="Bauarbeiter bei der Arbeit"
          fill
          style={{objectFit: 'cover', objectPosition: 'center', filter: 'brightness(0.7)'}}
          priority
        />
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center" style={{zIndex: 2}}>
          <h1 className="display-3 fw-bold text-white mb-3" style={{textShadow: '0 2px 8px rgba(0,0,0,0.4)'}}>Baujobs finden</h1>
          <p className="lead text-white mb-4" style={{maxWidth: 600, textShadow: '0 2px 8px rgba(0,0,0,0.4)'}}>
            Das moderne Jobboard für die Baubranche. Finde gezielt deinen nächsten Job als Bauarbeiter, Polier, Bauingenieur oder in anderen Bauberufen – einfach, schnell und ohne Umwege.
          </p>
        </div>
      </header>

      {/* Suche einen Job Section */}
      <section className="container py-5" id="suche-einen-job">
        <h2 className="h3 fw-bold text-primary mb-4 text-center">Suche einen Job</h2>
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="card-title mb-0">Aktuelle Gesuche</h2>
                </div>
                <div className="row g-4">
                  {jobs.length === 0 ? (
                    <div className="col-12 text-center text-muted">Keine Gesuche gefunden.</div>
                  ) : (
                    <>
                      {jobs.map((job) => (
                        <div key={job._id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                          <div className="card h-100">
                            <div className="card-body">
                              <h5 className="card-title">{job.beruf}</h5>
                              <h6 className="card-subtitle mb-2 text-muted">{job.unternehmen}</h6>
                              <p className="card-text">
                                <i className="bi bi-geo-alt"></i> {job.standort}<br />
                                <i className="bi bi-briefcase"></i> {job.artDerStelle}<br />
                                <i className="bi bi-clock-history"></i> {job.erfahrung}
                              </p>
                              <Link href={`/suche-einen-job/${job._id}`} className="btn btn-primary">
                                Details anzeigen
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                      {hasMoreJobs && (
                        <div className="col-12 text-center mt-4">
                          <button 
                            className="btn btn-outline-primary"
                            onClick={handleLoadMoreJobs}
                            disabled={loadingMoreJobs}
                          >
                            {loadingMoreJobs ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Lade...
                              </>
                            ) : (
                              'Mehr laden'
                            )}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stellenanzeigen aufgeben Section */}
      <section className="container py-5" id="stellenanzeigen-aufgeben">
        <h2 className="h3 fw-bold text-success mb-4 text-center">Aktuelle Stelleninserate</h2>
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="card-title mb-0">Aktuelle Inserate</h2>
                </div>
                <div className="row g-4">
                  {stellenanzeigen.length === 0 ? (
                    <div className="col-12 text-center text-muted">Keine Stellenanzeigen gefunden.</div>
                  ) : (
                    stellenanzeigen.map((stellenanzeige) => (
                      <div key={stellenanzeige._id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                        <div className="card h-100">
                          <div className="card-body">
                            <h5 className="card-title">{stellenanzeige.titel}</h5>
                            <p className="card-text">
                              <i className="bi bi-geo-alt"></i> {stellenanzeige.standort}<br />
                              <i className="bi bi-building"></i> {stellenanzeige.kategorie}<br />
                              <i className="bi bi-calendar"></i> Eingestellt am: {new Date(stellenanzeige.erstelltAm).toLocaleDateString('de-DE')}
                            </p>
                            <Link href={`/stellenanzeigen-aufgeben/${stellenanzeige._id}`} className="btn btn-success">
                              Details anzeigen
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
