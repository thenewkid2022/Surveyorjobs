"use client";
import { useState, useEffect } from "react";
import { FaHardHat, FaMapMarkerAlt, FaBuilding, FaEye, FaEnvelope, FaGraduationCap, FaUser, FaBriefcase, FaSearch } from "react-icons/fa";
import Link from "next/link";
import { getApiUrl } from "@/utils/api";
import JobDetailModal from "@/app/components/JobDetailModal";
import JobSearchDetailModal from "@/app/components/JobSearchDetailModal";
import { Job } from "@/types/job";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalytics } from '@/utils/analytics';

interface Stellengesuch {
  _id: string;
  name?: string;
  beruf: string;
  position?: string;
  standort?: string;
  beschreibung?: string;
  erstelltAm: string;
  artDerStelle: string;
  erfahrung?: string;
  kategorie?: string;
  // Zusätzliche Properties für Kompatibilität mit JobSearchData
  ausbildung?: string;
  faehigkeiten?: string[];
  sprachen?: string[];
  mobilitaet?: string;
  verfuegbarAb?: string;
  kontaktEmail?: string;
  kontaktTelefon?: string;
  lebenslauf?: string;
  anschreiben?: string;
  status?: string;
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
  artDerStelle: string;
  status: string;
}

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const { trackApplicationStarted } = useAnalytics(user?.id);
  const [stellenanzeigen, setStellenanzeigen] = useState<Job[]>([]);
  const [stellengesuche, setStellengesuche] = useState<Stellengesuch[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedJobSearch, setSelectedJobSearch] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [stellenanzeigenPage, setStellenanzeigenPage] = useState(1);
  const [stellengesuchePage, setStellengesuchePage] = useState(1);
  const [hasMoreStellenanzeigen, setHasMoreStellenanzeigen] = useState(true);
  const [hasMoreStellengesuche, setHasMoreStellengesuche] = useState(true);
  const [loadingMoreStellenanzeigen, setLoadingMoreStellenanzeigen] = useState(false);
  const [loadingMoreStellengesuche, setLoadingMoreStellengesuche] = useState(false);

  const fetchStellenanzeigen = async (pageNum: number, append: boolean = false) => {
    try {
      const stellenanzeigenRes = await fetch(`${getApiUrl()}/api/stellenanzeigen-aufgeben?page=${pageNum}&limit=6`);
      if (stellenanzeigenRes.ok) {
        const stellenanzeigenData = await stellenanzeigenRes.json();
        console.log('Stellenanzeigen von API:', stellenanzeigenData.stellenanzeigen);
        const newStellenanzeigen = stellenanzeigenData.stellenanzeigen || [];
        setStellenanzeigen(prevJobs => append ? [...prevJobs, ...newStellenanzeigen] : newStellenanzeigen);
        setHasMoreStellenanzeigen(pageNum < stellenanzeigenData.pagination.pages);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Stellenanzeigen:", error);
    } finally {
      setLoadingMoreStellenanzeigen(false);
    }
  };

  const fetchStellengesuche = async (pageNum: number, append: boolean = false) => {
    try {
      const stellengesucheRes = await fetch(`${getApiUrl()}/api/suche-einen-job?page=${pageNum}&limit=6`);
      if (stellengesucheRes.ok) {
        const stellengesucheData = await stellengesucheRes.json();
        const newStellengesuche = stellengesucheData.jobs || [];
        setStellengesuche(prevJobs => append ? [...prevJobs, ...newStellengesuche] : newStellengesuche);
        setHasMoreStellengesuche(pageNum < stellengesucheData.pagination.pages);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Stellengesuche:", error);
    } finally {
      setLoadingMoreStellengesuche(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchStellenanzeigen(1),
          fetchStellengesuche(1)
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLoadMoreStellenanzeigen = () => {
    const nextPage = stellenanzeigenPage + 1;
    setStellenanzeigenPage(nextPage);
    setLoadingMoreStellenanzeigen(true);
    fetchStellenanzeigen(nextPage, true);
  };

  const handleLoadMoreStellengesuche = () => {
    const nextPage = stellengesuchePage + 1;
    setStellengesuchePage(nextPage);
    setLoadingMoreStellengesuche(true);
    fetchStellengesuche(nextPage, true);
  };

  const openJobModal = (job: Job) => {
    setSelectedJob(job);
  };

  const closeJobModal = () => {
    setSelectedJob(null);
  };

  const openJobSearchModal = (gesuch: Stellengesuch) => {
    // Konvertiere Stellengesuch zu JobSearchData Format
    const jobSearchData = {
      _id: gesuch._id,
      beruf: gesuch.beruf || "Stellengesuch",
      standort: gesuch.standort || "Ort nicht angegeben",
      beschreibung: gesuch.beschreibung || "Stellengesuch verfügbar",
      erfahrung: gesuch.erfahrung || "Keine Angabe",
      ausbildung: gesuch.ausbildung || "Keine Angabe",
      faehigkeiten: gesuch.faehigkeiten || [],
      sprachen: gesuch.sprachen || [],
      mobilitaet: gesuch.mobilitaet || "Keine Angabe",
      artDerStelle: gesuch.artDerStelle || "Vollzeit",
      verfuegbarAb: gesuch.verfuegbarAb || new Date().toISOString(),
      kontaktEmail: gesuch.kontaktEmail,
      kontaktTelefon: gesuch.kontaktTelefon,
      lebenslauf: gesuch.lebenslauf,
      anschreiben: gesuch.anschreiben,
      erstelltAm: gesuch.erstelltAm,
      status: gesuch.status || "aktiv"
    };
    setSelectedJobSearch(jobSearchData);
  };

  const closeJobSearchModal = () => {
    setSelectedJobSearch(null);
  };

  const handleApplicationClick = (job: Job) => {
    trackApplicationStarted(job._id);
    window.location.href = `mailto:${job.kontaktEmail}`;
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
      {/* Professioneller Header mit besserer Lesbarkeit */}
      <header className="w-100 mb-4 py-5 bg-gradient-light text-center">
        <div className="container d-flex flex-column align-items-center justify-content-center" style={{minHeight: 220}}>
          <FaHardHat size={56} className="mb-3 text-brand-orange" />
          <h1 className="display-4 fw-bold mb-3 text-primary">Baujobs finden</h1>
          <p className="lead fs-5 mb-4 text-secondary" style={{maxWidth: 600, fontWeight: 500}}>
            Das moderne Jobboard für die Baubranche. Finde gezielt deinen nächsten Job als Bauarbeiter, Polier, Bauingenieur oder in anderen Bauberufen – einfach, schnell und ohne Umwege.
          </p>
          <Link href="/filter/berufsfeld" className="btn btn-primary btn-lg shadow-sm">
            Jetzt Job finden
          </Link>
        </div>
      </header>

      {/* Stellenanzeigen Section */}
      <section className="container py-5">
        <h2 className="h3 mb-4 text-brand-primary">Aktuelle Stellenangebote</h2>
        <div className="row g-4">
          {stellenanzeigen.map((job: Job) => (
            <div key={job._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{job.titel}</h5>
                  
                  {job.unternehmen && (
                    <div className="mb-2">
                      <FaBuilding className="me-2 text-muted" size={14} />
                      <small className="text-muted">{job.unternehmen}</small>
                    </div>
                  )}

                  <div className="mb-2">
                    <FaMapMarkerAlt className="me-2 text-muted" size={14} />
                    <small className="text-muted">{job.standort}</small>
                  </div>

                  {job.kategorie && (
                    <div className="mb-2">
                      <small className="badge bg-primary text-white">{job.kategorie}</small>
                    </div>
                  )}

                  <div className="mb-3">
                    <p className="card-text text-muted small">
                      {job.beschreibung.substring(0, 100)}...
                    </p>
                  </div>

                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-primary btn-sm flex-fill"
                      onClick={() => openJobModal(job)}
                    >
                      <FaEye className="me-1" />
                      Details
                    </button>
                    {job.kontaktEmail && (
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => handleApplicationClick(job)}
                      >
                        <FaEnvelope className="me-1" />
                        Bewerben
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {hasMoreStellenanzeigen && (
          <div className="text-center mt-4">
            <button 
              className="btn btn-outline-primary"
              onClick={handleLoadMoreStellenanzeigen}
              disabled={loadingMoreStellenanzeigen}
            >
              {loadingMoreStellenanzeigen ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Lade...
                </>
              ) : (
                'Mehr Stellenanzeigen laden'
              )}
            </button>
          </div>
        )}
      </section>

      {/* Stellengesuche Section */}
      <section className="container py-5">
        <h2 className="h3 mb-4 text-success">Aktuelle Stellengesuche</h2>
        <div className="row g-4">
          {stellengesuche.map((gesuch: Stellengesuch) => (
            <div key={gesuch._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{gesuch.beruf}</h5>
                  
                  {gesuch.name && (
                    <div className="mb-2">
                      <FaGraduationCap className="me-2 text-muted" size={14} />
                      <small className="text-muted">{gesuch.name}</small>
                    </div>
                  )}

                  <div className="mb-2">
                    <FaMapMarkerAlt className="me-2 text-muted" size={14} />
                    <small className="text-muted">{gesuch.standort}</small>
                  </div>

                  {gesuch.kategorie && (
                    <div className="mb-2">
                      <small className="badge bg-success text-white">{gesuch.kategorie}</small>
                    </div>
                  )}

                  <div className="mb-3">
                    <p className="card-text text-muted small">
                      {gesuch.beschreibung ? gesuch.beschreibung.substring(0, 100) + '...' : 'Keine Beschreibung verfügbar'}
                    </p>
                  </div>

                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-success btn-sm flex-fill"
                      onClick={() => openJobSearchModal(gesuch)}
                    >
                      <FaEye className="me-1" />
                      Details
                    </button>
                    <button 
                      className="btn btn-outline-success btn-sm"
                      onClick={() => window.location.href = `mailto:info@surveyjobs.ch?subject=Stellengesuch: ${gesuch.beruf}`}
                    >
                      <FaEnvelope className="me-1" />
                      Kontakt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {hasMoreStellengesuche && (
          <div className="text-center mt-4">
            <button 
              className="btn btn-outline-success"
              onClick={handleLoadMoreStellengesuche}
              disabled={loadingMoreStellengesuche}
            >
              {loadingMoreStellengesuche ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Lade...
                </>
              ) : (
                'Mehr Stellengesuche laden'
              )}
            </button>
          </div>
        )}
      </section>

      {/* Modals */}
      <JobDetailModal 
        job={selectedJob} 
        isOpen={!!selectedJob}
        onClose={closeJobModal} 
      />
      
      <JobSearchDetailModal 
        jobSearch={selectedJobSearch} 
        isOpen={!!selectedJobSearch}
        onClose={closeJobSearchModal} 
      />
    </main>
  );
}
