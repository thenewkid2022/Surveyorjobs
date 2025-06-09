"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { kategorien } from "@shared/lib/berufe";
import { getApiUrl } from "@/utils/api";
import { useAnalytics } from '@/utils/analytics';
import { useAuth } from '@/contexts/AuthContext';
import { FaMapMarkerAlt, FaBuilding, FaEye, FaEnvelope } from "react-icons/fa";
import JobDetailModal from "@/app/components/JobDetailModal";
import { Job } from "@/types/job";

export default function JobsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { trackApplicationStarted } = useAnalytics(user?.id);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedKategorie, setSelectedKategorie] = useState<string>("");
  const [selectedKanton, setSelectedKanton] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async (pageNum: number, append: boolean = false) => {
    try {
      const queryParams = new URLSearchParams();
      if (selectedKategorie) queryParams.append('kategorie', selectedKategorie);
      if (selectedKanton) queryParams.append('kanton', selectedKanton);
      queryParams.append('page', pageNum.toString());
      queryParams.append('limit', '6');

      const jobsRes = await fetch(`${getApiUrl()}/api/jobs?${queryParams}`);
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        const newJobs = jobsData.jobs || [];
        setJobs(prevJobs => append ? [...prevJobs, ...newJobs] : newJobs);
        setHasMore(pageNum < jobsData.pagination.pages);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Daten:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchData(1);
  }, [selectedKategorie, selectedKanton]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    fetchData(nextPage, true);
  };

  const handleKategorieChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedKategorie(e.target.value);
  };

  const handleKantonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedKanton(e.target.value);
  };

  const openJobModal = (job: Job) => {
    setSelectedJob(job);
  };

  const closeJobModal = () => {
    setSelectedJob(null);
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
      <section className="container-fluid py-4" style={{maxWidth: '1200px', margin: '0 auto'}}>
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
            <>
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
                          <small className="badge bg-light text-dark">{job.kategorie}</small>
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
              {hasMore && (
                <div className="col-12 text-center mt-4">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
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

        {/* Job Detail Modal */}
        <JobDetailModal
          job={selectedJob}
          isOpen={!!selectedJob}
          onClose={closeJobModal}
        />
      </section>
    </main>
  );
} 