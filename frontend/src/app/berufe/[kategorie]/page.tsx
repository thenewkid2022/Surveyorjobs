"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalytics } from '@/utils/analytics';
import { FaMapMarkerAlt, FaBuilding, FaUser, FaEye, FaEnvelope, FaGraduationCap } from "react-icons/fa";
import { getApiUrl } from "@/utils/api";
import { kantone, kantonNamen } from "@shared/lib/kantone";
import JobDetailModal from "../../components/JobDetailModal";
import JobSearchDetailModal from "../../components/JobSearchDetailModal";
import { Job } from "@/types/job";

interface Stellengesuch {
  _id: string;
  name?: string;
  berufswunsch?: string;
  beruf?: string;
  position?: string;
  standort?: string;
  beschreibung?: string;
  erstelltAm: string;
  artDerStelle?: string;
  erfahrung?: string;
  kategorie?: string;
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
  const router = useRouter();
  const { user } = useAuth();
  const { trackApplicationStarted } = useAnalytics(user?.id);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stellengesuche, setStellengesuche] = useState<Stellengesuch[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedJobSearch, setSelectedJobSearch] = useState<any | null>(null);
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
        
        console.log('🔍 Frontend DEBUG - API Response:', {
          stellenanzeigen: jobsData.stellenanzeigen?.length || 0,
          stellengesuche: gesucheData.jobs?.length || 0,
          kategorie: params.kategorie
        });

        setJobs(jobsData.stellenanzeigen || []);
        setStellengesuche(gesucheData.jobs || []);

        console.log('🔍 Frontend DEBUG - State nach Update:', {
          jobsLength: (jobsData.stellenanzeigen || []).length,
          gesucheLength: (gesucheData.jobs || []).length
        });
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
      beruf: gesuch.beruf || gesuch.berufswunsch || "Stellengesuch",
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

  // Anpassung des Titels, wenn ein Kanton ausgewählt ist
  const pageTitle = searchParams.kanton 
    ? `${kategorieTitel[params.kategorie] || 'Alle Berufe'} in ${kantonNamen[searchParams.kanton as keyof typeof kantonNamen]}`
    : kategorieTitel[params.kategorie] || 'Berufskategorie';

  return (
    <main className="bg-white min-vh-100 font-sans">
      <div className="container-fluid py-5" style={{maxWidth: '1200px', margin: '0 auto'}}>
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
              <div key={gesuch._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{gesuch.berufswunsch || gesuch.beruf || "Stellengesuch"}</h5>
                    
                    <div className="mb-2">
                      <FaMapMarkerAlt className="me-2 text-muted" size={14} />
                      <small className="text-muted">{gesuch.standort || "Ort nicht angegeben"}</small>
                    </div>

                    {gesuch.erfahrung && (
                      <div className="mb-2">
                        <FaGraduationCap className="me-2 text-muted" size={14} />
                        <small className="text-muted">{gesuch.erfahrung}</small>
                      </div>
                    )}

                    <div className="mb-2">
                      <small className="badge bg-success text-white">{gesuch.artDerStelle || "Vollzeit"}</small>
                    </div>

                    <div className="mb-3">
                      <p className="card-text text-muted small">
                        {gesuch.beschreibung ? gesuch.beschreibung.substring(0, 100) + "..." : "Stellengesuch verfügbar"}
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
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
          showFullContact={false}
        />
      </div>
    </main>
  );
} 