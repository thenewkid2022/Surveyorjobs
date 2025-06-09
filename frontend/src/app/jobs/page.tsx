"use client";

import { useState, useEffect } from 'react';
import { Job } from "@/types/job";
import JobDetailModal from "@/app/components/JobDetailModal";
import { FaMapMarkerAlt, FaBuilding, FaCalendarAlt, FaEye } from "react-icons/fa";
import { getApiUrl } from "@/utils/api";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${getApiUrl()}/api/jobs`, {
        cache: "no-store"
      });
      
      if (!response.ok) {
        throw new Error("Jobs konnten nicht geladen werden");
      }
      
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const openJobModal = (job: Job) => {
    setSelectedJob(job);
  };

  const closeJobModal = () => {
    setSelectedJob(null);
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Stellenangebote</h1>
        <button 
          className="btn btn-outline-primary"
          onClick={fetchJobs}
          disabled={loading}
        >
          Aktualisieren
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Lade Stellenangebote...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {jobs.length === 0 ? (
            <div className="col-12 text-center py-5">
              <p className="text-muted">Keine Stellenangebote verfügbar.</p>
            </div>
          ) : (
            jobs.map((job) => (
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
                        <FaCalendarAlt className="me-2 text-muted" size={14} />
                        <small className="text-muted">{job.kategorie}</small>
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
                          onClick={() => window.location.href = `mailto:${job.kontaktEmail}`}
                        >
                          Bewerben
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Job Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={closeJobModal}
      />
    </div>
  );
} 