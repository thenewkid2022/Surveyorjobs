"use client";
import { useState, useEffect } from "react";
import { kategorien } from "@shared/lib/berufe";
import Link from "next/link";
import { getApiUrl } from "@/utils/api";
import { FaMapMarkerAlt, FaBuilding } from "react-icons/fa";
import JobCard from "@/app/components/JobCard";
import { Job } from "@/types/job";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedKategorie, setSelectedKategorie] = useState<string>("");
  const [selectedKanton, setSelectedKanton] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

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
            <>
              {jobs.map((job) => (
                <div key={job._id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                  <JobCard
                    id={job._id}
                    titel={job.titel}
                    standort={job.standort}
                    unternehmen={job.unternehmen}
                    artDerStelle={job.artDerStelle}
                    erstelltAm={job.erstelltAm}
                    kategorie={job.kategorie}
                    linkPrefix="berufe"
                    type="job"
                  />
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
      </section>
    </main>
  );
} 