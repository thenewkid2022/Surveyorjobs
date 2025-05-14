"use client";
import { useState, useEffect } from "react";
import { FaHardHat, FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { kategorien } from "@shared/lib/berufe";
import { getApiUrl } from "@/utils/api";
import JobCard from "./components/JobCard";
import { Job } from "@/types/job";

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
  const [stellenanzeigen, setStellenanzeigen] = useState<Job[]>([]);
  const [stellengesuche, setStellengesuche] = useState<Stellengesuch[]>([]);
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
      {/* Header mit Bild und Overlay */}
      <header className="position-relative w-100 mb-4 header-height" style={{overflow: 'hidden'}}>
        <Image
          src="/header-image.jpg"
          alt="Bauarbeiter bei der Arbeit"
          fill
          className="object-fit-cover object-position-center brightness-70"
          priority
        />
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center px-3" style={{zIndex: 2}}>
          <h1 className="display-4 display-lg-3 fw-bold text-white mb-2 mb-lg-3 shadow-text">Baujobs finden</h1>
          <p className="lead fs-5 fs-lg-4 text-white mb-3 mb-lg-4 shadow-text" style={{maxWidth: 'min(600px, 90%)'}}>
            Das moderne Jobboard für die Baubranche. Finde gezielt deinen nächsten Job als Bauarbeiter, Polier, Bauingenieur oder in anderen Bauberufen – einfach, schnell und ohne Umwege.
          </p>
        </div>
      </header>

      {/* Stellenanzeigen Section */}
      <section className="container py-5">
        <h2 className="h3 mb-4 text-primary">Aktuelle Stellenangebote</h2>
        <div className="row g-4">
          {stellenanzeigen.map((job: Job) => {
            console.log('Übergebe an JobCard:', {
              id: job._id,
              erstelltAm: job.erstelltAm,
              titel: job.titel
            });
            return (
              <div className="col-12 col-md-6 col-lg-3" key={job._id}>
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
            );
          })}
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
        <h2 className="h3 mb-4 text-primary">Aktuelle Stellengesuche</h2>
        <div className="row g-4">
          {stellengesuche.map((gesuch: Stellengesuch) => (
            <div className="col-12 col-md-6 col-lg-3" key={gesuch._id}>
              <JobCard
                id={gesuch._id}
                beruf={gesuch.beruf}
                standort={gesuch.standort || ""}
                artDerStelle={gesuch.artDerStelle}
                erstelltAm={gesuch.erstelltAm}
                linkPrefix="suche-einen-job"
                type="search"
              />
            </div>
          ))}
        </div>
        {hasMoreStellengesuche && (
          <div className="text-center mt-4">
            <button 
              className="btn btn-outline-primary"
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
    </main>
  );
}
