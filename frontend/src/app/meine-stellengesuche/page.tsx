"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaPlus, FaBriefcase, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaClock } from "react-icons/fa";
import { IconBaseProps } from "react-icons";
import Link from "next/link";
import { getApiUrl } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";

interface Stellengesuch {
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
  kategorie: string;
}

export default function MeineStellengesuche() {
  const router = useRouter();
  const { token } = useAuth();
  const [stellengesuche, setStellengesuche] = useState<Stellengesuch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStellengesuche = async () => {
      try {
        const response = await fetch(`${getApiUrl()}/api/suche-einen-job/meine`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Fehler beim Laden der Stellengesuche');
        }

        const data = await response.json();
        setStellengesuche(data.stellengesuche || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStellengesuche();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Laden...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Link href="/dashboard" className="btn btn-primary">
          <FaArrowLeft {...{ style: { marginRight: "0.5rem" } } as IconBaseProps} />
          Zurück zum Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link href="/dashboard" className="btn btn-outline-primary">
          <FaArrowLeft {...{ style: { marginRight: "0.5rem" } } as IconBaseProps} />
          Zurück zum Dashboard
        </Link>
        <Link href="/suche-einen-job" className="btn btn-success">
          <FaPlus {...{ style: { marginRight: "0.5rem" } } as IconBaseProps} />
          Neues Stellengesuch
        </Link>
      </div>

      <h1 className="h2 mb-4">Meine Stellengesuche</h1>

      {stellengesuche.length === 0 ? (
        <div className="alert alert-info">
          Sie haben noch keine Stellengesuche erstellt. Klicken Sie auf "Neues Stellengesuch" um eines zu erstellen.
        </div>
      ) : (
        <div className="row g-4">
          {stellengesuche.map((gesuch) => (
            <div key={gesuch._id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h2 className="h5 card-title text-success mb-3">{gesuch.beruf}</h2>
                  
                  <div className="mb-2">
                    <FaMapMarkerAlt {...{ size: 16, style: { marginRight: "0.5rem", color: "#198754" } } as IconBaseProps} />
                    <small className="text-muted">{gesuch.standort}</small>
                  </div>
                  
                  <div className="mb-2">
                    <FaBriefcase {...{ size: 16, style: { marginRight: "0.5rem", color: "#198754" } } as IconBaseProps} />
                    <small className="text-muted">{gesuch.artDerStelle}</small>
                  </div>
                  
                  <div className="mb-2">
                    <FaUser {...{ size: 16, style: { marginRight: "0.5rem", color: "#198754" } } as IconBaseProps} />
                    <small className="text-muted">{gesuch.erfahrung}</small>
                  </div>
                  
                  <div className="mb-2">
                    <FaClock {...{ size: 16, style: { marginRight: "0.5rem", color: "#198754" } } as IconBaseProps} />
                    <small className="text-muted">
                      Verfügbar ab: {new Date(gesuch.verfuegbarAb).toLocaleDateString("de-DE")}
                    </small>
                  </div>
                  
                  <div className="mb-3">
                    <FaCalendarAlt {...{ size: 16, style: { marginRight: "0.5rem", color: "#198754" } } as IconBaseProps} />
                    <small className="text-muted">
                      Eingestellt am: {new Date(gesuch.erstelltAm).toLocaleDateString("de-DE")}
                    </small>
                  </div>

                  {gesuch.status !== 'aktiv' && (
                    <div className="mb-3">
                      <span className="badge bg-secondary">{gesuch.status}</span>
                    </div>
                  )}

                  <div className="mt-auto">
                    <Link 
                      href={`/suche-einen-job/${gesuch._id}`}
                      className="btn btn-outline-success w-100"
                    >
                      Details anzeigen
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 