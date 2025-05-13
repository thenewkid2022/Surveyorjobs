import { FaMapMarkerAlt, FaBuilding, FaCalendarAlt, FaArrowLeft, FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import { IconBaseProps } from "react-icons";
import Link from "next/link";
import { getApiUrl } from "@/utils/api";

interface Stellenanzeige {
  _id: string;
  titel: string;
  beschreibung: string;
  standort: string;
  kategorie: string;
  erstelltAm: string;
  expiresAt: string;
  kontaktName: string;
  kontaktEmail: string;
  kontaktTelefon?: string;
  status: string;
  unternehmen?: string;
  artDerStelle?: string;
  erfahrung?: string;
}

async function getStellenanzeige(id: string): Promise<Stellenanzeige> {
  const res = await fetch(`${getApiUrl()}/api/stellenanzeigen-aufgeben/${id}`, {
    cache: 'no-store'
  });
  
  if (!res.ok) {
    throw new Error('Stellenanzeige konnte nicht geladen werden');
  }
  
  return res.json();
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  let stellenanzeige: Stellenanzeige | null = null;
  let error: string | null = null;

  try {
    stellenanzeige = await getStellenanzeige(resolvedParams.id);
  } catch (err) {
    error = "Stellenanzeige konnte nicht geladen werden";
    console.error(err);
  }

  if (error || !stellenanzeige) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error || "Stellenanzeige nicht gefunden"}
        </div>
        <Link href="/" className="btn btn-primary">
          <FaArrowLeft {...{ style: { marginRight: "0.5rem" } } as IconBaseProps} />
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <Link href="/" className="btn btn-outline-primary mb-4">
        <FaArrowLeft {...{ style: { marginRight: "0.5rem" } } as IconBaseProps} />
        Zurück zur Übersicht
      </Link>

      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="card-title h2 mb-4 text-primary">{stellenanzeige.titel}</h1>
          
          {/* Unternehmen und Kategorie */}
          {stellenanzeige.unternehmen && (
            <div className="mb-3">
              <FaBuilding {...{ size: 20, style: { marginRight: '0.5rem', color: '#0d6efd' } } as IconBaseProps} />
              <span><strong>Unternehmen:</strong> {stellenanzeige.unternehmen}</span>
            </div>
          )}
          <div className="mb-3">
            <FaBuilding {...{ size: 20, style: { marginRight: '0.5rem', color: '#0d6efd' } } as IconBaseProps} />
            <span><strong>Kategorie:</strong> {stellenanzeige.kategorie}</span>
          </div>

          {/* Standort */}
          <div className="mb-3">
            <FaMapMarkerAlt {...{ size: 20, style: { marginRight: '0.5rem', color: '#0d6efd' } } as IconBaseProps} />
            <span><strong>Standort:</strong> {stellenanzeige.standort}</span>
          </div>

          {/* Anstellungsart und Erfahrung */}
          {stellenanzeige.artDerStelle && (
            <div className="mb-3">
              <FaUser {...{ size: 20, style: { marginRight: '0.5rem', color: '#0d6efd' } } as IconBaseProps} />
              <span><strong>Anstellungsart:</strong> {stellenanzeige.artDerStelle}</span>
            </div>
          )}
          {stellenanzeige.erfahrung && (
            <div className="mb-3">
              <FaCalendarAlt {...{ size: 20, style: { marginRight: '0.5rem', color: '#0d6efd' } } as IconBaseProps} />
              <span><strong>Erfahrung:</strong> {stellenanzeige.erfahrung}</span>
            </div>
          )}

          {/* Beschreibung */}
          <div className="mb-4">
            <h2 className="h4 mb-3">Beschreibung</h2>
            <p className="text-secondary">{stellenanzeige.beschreibung}</p>
          </div>

          {/* Kontakt */}
          <div className="card bg-light">
            <div className="card-body">
              <h2 className="h4 mb-3">Kontakt</h2>
              <div className="mb-2">
                <FaUser {...{ size: 20, style: { marginRight: '0.5rem', color: '#0d6efd' } } as IconBaseProps} />
                <span><strong>Ansprechpartner:</strong> {stellenanzeige.kontaktName}</span>
              </div>
              {stellenanzeige.kontaktEmail && (
                <div className="mb-2">
                  <FaEnvelope {...{ size: 20, style: { marginRight: '0.5rem', color: '#0d6efd' } } as IconBaseProps} />
                  <span>
                    <strong>E-Mail:</strong>{" "}
                    <a href={`mailto:${stellenanzeige.kontaktEmail}`} className="text-primary">
                      {stellenanzeige.kontaktEmail}
                    </a>
                  </span>
                </div>
              )}
              {stellenanzeige.kontaktTelefon && (
                <div className="mb-0">
                  <FaPhone {...{ size: 20, style: { marginRight: '0.5rem', color: '#0d6efd' } } as IconBaseProps} />
                  <span>
                    <strong>Telefon:</strong>{" "}
                    <a href={`tel:${stellenanzeige.kontaktTelefon}`} className="text-primary">
                      {stellenanzeige.kontaktTelefon}
                    </a>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Status und Datum */}
          <div className="mt-3">
            <small className="text-muted">
              Eingestellt am: {new Date(stellenanzeige.erstelltAm).toLocaleDateString("de-DE")}
              {stellenanzeige.status !== 'aktiv' && (
                <span className="ms-2 badge bg-secondary">{stellenanzeige.status}</span>
              )}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
