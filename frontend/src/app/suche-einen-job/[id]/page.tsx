"use client";

import { FaArrowLeft } from "react-icons/fa";
import { IconBaseProps } from "react-icons";
import Link from "next/link";
import { getApiUrl } from "@/utils/api";
import JobSearchDetailCard from "@/app/components/JobSearchDetailCard";
import { useState, useEffect } from "react";

interface SucheEinenJob {
  _id: string;
  beruf: string;
  standort: string;
  beschreibung: string;
  erfahrung: string;
  ausbildung: string;
  faehigkeiten: string[];
  sprachen: string[];
  mobilitaet: string;
  artDerStelle: string;
  verfuegbarAb: string;
  kontaktEmail: string;
  kontaktTelefon?: string;
  lebenslauf: string;
  anschreiben?: string;
  erstelltAm: string;
  expiresAt: string;
  status: string;
}

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [sucheEinenJob, setSucheEinenJob] = useState<SucheEinenJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const getSucheEinenJob = async (id: string): Promise<SucheEinenJob> => {
      try {
        const response = await fetch(`${getApiUrl()}/api/suche-einen-job/${id}`, { 
          cache: "no-store" 
        });
        
        if (!response.ok) {
          throw new Error("Jobsuche nicht gefunden");
        }
        
        return response.json();
      } catch (error) {
        console.error("Fehler beim Laden der Jobsuche:", error);
        throw new Error("Jobsuche konnte nicht geladen werden");
      }
    };

    getSucheEinenJob(resolvedParams.id)
      .then(setSucheEinenJob)
      .catch(err => {
        setError("Jobsuche konnte nicht geladen werden");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [resolvedParams]);

  if (loading) {
    return (
      <div className="container-fluid py-5" style={{maxWidth: '700px', margin: '0 auto'}}>
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Laden...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !sucheEinenJob) {
    return (
      <div className="container-fluid py-5" style={{maxWidth: '700px', margin: '0 auto'}}>
        <div className="alert alert-danger" role="alert">
          {error || "Jobsuche nicht gefunden"}
        </div>
        <Link href="/" className="btn btn-secondary">
          <FaArrowLeft {...{ style: { marginRight: "0.5rem" } } as IconBaseProps} />
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  return (
    <div className="detail-page-wrapper stellengesuch">
      <div className="container-fluid py-5" style={{maxWidth: '700px', margin: '0 auto'}}>
        <Link href="/" className="btn btn-outline-secondary mb-4">
          <FaArrowLeft {...{ style: { marginRight: "0.5rem" } } as IconBaseProps} />
          Zurück zur Übersicht
        </Link>

        <JobSearchDetailCard jobSearch={sucheEinenJob} showFullContact={false} />
      </div>
    </div>
  );
} 