"use client";

import { FaArrowLeft } from "react-icons/fa";
import { IconBaseProps } from "react-icons";
import Link from "next/link";
import { getApiUrl } from "@/utils/api";
import { Job } from "@/types/job";
import JobDetailCard from "@/app/components/JobDetailCard";
import JobSearchDetailCard from "@/app/components/JobSearchDetailCard";
import { useState, useEffect } from "react";

interface JobSearchData {
  _id: string;
  beruf: string;
  berufswunsch?: string;
  position?: string;
  standort: string;
  beschreibung: string;
  erfahrung: string;
  ausbildung: string;
  faehigkeiten: string[];
  sprachen: string[];
  mobilitaet: string;
  artDerStelle: string;
  verfuegbarAb: string;
  kontaktEmail?: string;
  kontaktTelefon?: string;
  lebenslauf?: string;
  anschreiben?: string;
  erstelltAm: string;
  status: string;
}

export default function Page({
  params,
}: {
  params: Promise<{ id: string; kategorie: string }>;
}) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string; kategorie: string } | null>(null);
  const [entry, setEntry] = useState<{ type: 'job'; data: Job } | { type: 'gesuch'; data: JobSearchData } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const getEntry = async (id: string) => {
      try {
        // Versuche zuerst als Stellenangebot
        const jobRes = await fetch(`${getApiUrl()}/api/stellenanzeigen-aufgeben/${id}`);
        if (jobRes.ok) {
          const job = await jobRes.json();
          return { type: 'job', data: job };
        }

        // Wenn nicht gefunden, versuche als Stellengesuch
        const gesuchRes = await fetch(`${getApiUrl()}/api/suche-einen-job/${id}`);
        if (gesuchRes.ok) {
          const gesuch = await gesuchRes.json();
          return { type: 'gesuch', data: gesuch };
        }

        return null;
      } catch (error) {
        console.error('Fehler beim Laden des Eintrags:', error);
        return null;
      }
    };

    getEntry(resolvedParams.id)
      .then(result => {
        if (result) {
          setEntry(result);
        } else {
          setError('Eintrag nicht gefunden');
        }
      })
      .catch(err => {
        console.error(err);
        setError('Fehler beim Laden des Eintrags');
      })
      .finally(() => setLoading(false));
  }, [resolvedParams]);

  if (loading) {
    return (
      <div className="container-fluid py-5" style={{maxWidth: '900px', margin: '0 auto'}}>
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Laden...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !entry || !resolvedParams) {
    return (
      <div className="container-fluid py-5" style={{maxWidth: '900px', margin: '0 auto'}}>
        <div className="alert alert-danger" role="alert">
          {error || 'Eintrag nicht gefunden'}
        </div>
        <Link href={`/berufe/${resolvedParams?.kategorie || ''}`} className="btn btn-secondary">
          <FaArrowLeft {...{ style: { marginRight: "0.5rem" } } as IconBaseProps} />
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  return (
    <div className="detail-page-wrapper">
      <div className="container-fluid py-5" style={{maxWidth: '900px', margin: '0 auto'}}>
        <Link href={`/berufe/${resolvedParams.kategorie}`} className="btn btn-outline-secondary mb-4">
          <FaArrowLeft {...{ style: { marginRight: "0.5rem" } } as IconBaseProps} />
          Zurück zur Übersicht
        </Link>

        {entry.type === 'job' ? (
          <JobDetailCard job={entry.data} />
        ) : (
          <JobSearchDetailCard jobSearch={entry.data} showFullContact={false} />
        )}
      </div>
    </div>
  );
} 