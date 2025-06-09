import { FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaCar, FaCalendarAlt, FaClock, FaFilePdf, FaEnvelope, FaUser } from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface JobSearchData {
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
  kontaktEmail?: string;
  kontaktTelefon?: string;
  lebenslauf?: string;
  anschreiben?: string;
  erstelltAm: string;
  status: string;
}

interface JobSearchDetailModalProps {
  jobSearch: JobSearchData | null;
  isOpen: boolean;
  onClose: () => void;
  showFullContact?: boolean;
}

export default function JobSearchDetailModal({ jobSearch, isOpen, onClose, showFullContact = false }: JobSearchDetailModalProps) {
  const { user } = useAuth();
  const isEmployer = user?.accountTyp === 'arbeitgeber';

  if (!isOpen || !jobSearch) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-scrollable modal-lg modal-fullscreen-sm-down">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title h4 text-dark">{jobSearch.beruf}</h1>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Schließen"
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="card border-0 shadow-none">
              <div className="card-body p-0">
                {/* Beruf und Ausbildung */}
                <div className="mb-3">
                  <FaBriefcase className="me-2 text-muted" size={20} />
                  <span className="text-dark"><strong>Beruf:</strong> {jobSearch.beruf}</span>
                </div>
                <div className="mb-3">
                  <FaGraduationCap className="me-2 text-muted" size={20} />
                  <span className="text-dark"><strong>Ausbildung:</strong> {jobSearch.ausbildung}</span>
                </div>

                {/* Standort und Mobilität */}
                <div className="mb-3">
                  <FaMapMarkerAlt className="me-2 text-muted" size={20} />
                  <span className="text-dark"><strong>Standort:</strong> {jobSearch.standort}</span>
                </div>
                <div className="mb-3">
                  <FaCar className="me-2 text-muted" size={20} />
                  <span className="text-dark"><strong>Mobilität:</strong> {jobSearch.mobilitaet}</span>
                </div>

                {/* Anstellungsart und Erfahrung */}
                <div className="mb-3">
                  <FaBriefcase className="me-2 text-muted" size={20} />
                  <span className="text-dark"><strong>Anstellungsart:</strong> {jobSearch.artDerStelle}</span>
                </div>
                <div className="mb-3">
                  <FaCalendarAlt className="me-2 text-muted" size={20} />
                  <span className="text-dark"><strong>Erfahrung:</strong> {jobSearch.erfahrung}</span>
                </div>

                {/* Verfügbarkeit */}
                <div className="mb-3">
                  <FaClock className="me-2 text-muted" size={20} />
                  <span className="text-dark"><strong>Verfügbar ab:</strong> {new Date(jobSearch.verfuegbarAb).toLocaleDateString("de-DE")}</span>
                </div>

                {/* Fähigkeiten und Sprachen */}
                {jobSearch.faehigkeiten && jobSearch.faehigkeiten.length > 0 && (
                  <div className="mb-3">
                    <h3 className="h6 mb-2 text-dark">Fähigkeiten</h3>
                    <div className="d-flex flex-wrap gap-2">
                      {jobSearch.faehigkeiten.map((faehigkeit, index) => (
                        <span key={index} className="badge bg-dark">{faehigkeit}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {jobSearch.sprachen && jobSearch.sprachen.length > 0 && (
                  <div className="mb-3">
                    <h3 className="h6 mb-2 text-dark">Sprachen</h3>
                    <div className="d-flex flex-wrap gap-2">
                      {jobSearch.sprachen.map((sprache, index) => (
                        <span key={index} className="badge bg-secondary">{sprache}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Beschreibung */}
                <div className="mb-4">
                  <h2 className="h5 mb-3 text-dark">Beschreibung</h2>
                  <p className="text-muted">{jobSearch.beschreibung}</p>
                </div>

                {/* Anschreiben */}
                {jobSearch.anschreiben && (
                  <div className="mb-4">
                    <h2 className="h5 mb-3 text-dark">Anschreiben</h2>
                    <p className="text-muted">{jobSearch.anschreiben}</p>
                  </div>
                )}

                {/* Dokumente */}
                <div className="mb-4">
                  <h2 className="h5 mb-3 text-dark">Dokumente</h2>
                  {showFullContact && isEmployer && jobSearch.lebenslauf ? (
                    <div className="d-flex gap-3">
                      <Link href={jobSearch.lebenslauf} target="_blank" className="btn btn-dark">
                        <FaFilePdf className="me-2" />
                        PDF herunterladen
                      </Link>
                    </div>
                  ) : (
                    <div className="alert alert-light border">
                      <FaFilePdf className="me-2 text-muted" size={20} />
                      <strong>Lebenslauf verfügbar</strong>
                      <p className="mb-2 mt-2 text-muted">
                        Um den vollständigen Lebenslauf zu sehen, benötigen Sie ein Arbeitgeber-Account.
                      </p>
                      <div className="d-flex gap-2">
                        <Link href="/login" className="btn btn-dark btn-sm">
                          <FaUser className="me-1" />
                          Anmelden
                        </Link>
                        <Link href="/register" className="btn btn-outline-dark btn-sm">
                          Account erstellen
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Kontakt */}
                <div className="card bg-light">
                  <div className="card-body">
                    <h2 className="h5 mb-3 text-dark">Kontakt</h2>
                    {showFullContact && isEmployer && (jobSearch.kontaktEmail || jobSearch.kontaktTelefon) ? (
                      <>
                        {jobSearch.kontaktEmail && (
                          <div className="mb-2">
                            <FaEnvelope className="me-2 text-muted" size={20} />
                            <span className="text-dark">
                              <strong>E-Mail:</strong>{" "}
                              <a href={`mailto:${jobSearch.kontaktEmail}`} className="text-dark">
                                {jobSearch.kontaktEmail}
                              </a>
                            </span>
                          </div>
                        )}
                        {jobSearch.kontaktTelefon && (
                          <div className="mb-0">
                            <FaUser className="me-2 text-muted" size={20} />
                            <span className="text-dark">
                              <strong>Telefon:</strong>{" "}
                              <a href={`tel:${jobSearch.kontaktTelefon}`} className="text-dark">
                                {jobSearch.kontaktTelefon}
                              </a>
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="alert alert-light border-0 bg-transparent p-0">
                        <FaEnvelope className="me-2 text-muted" size={20} />
                        <strong>Kontaktdaten verfügbar</strong>
                        <p className="mb-2 mt-2 text-muted">
                          Melden Sie sich als Arbeitgeber an, um direkten Kontakt mit diesem Kandidaten aufzunehmen.
                        </p>
                        <div className="d-flex gap-2">
                          <Link href="/login" className="btn btn-dark btn-sm">
                            <FaEnvelope className="me-1" />
                            Kontakt aufnehmen
                          </Link>
                          <Link href="/register" className="btn btn-outline-dark btn-sm">
                            Kostenlos registrieren
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status und Datum */}
                <div className="mt-3">
                  <small className="text-muted">
                    Eingestellt am: {new Date(jobSearch.erstelltAm).toLocaleDateString("de-DE")}
                    {jobSearch.status !== 'aktiv' && (
                      <span className="ms-2 badge bg-secondary">{jobSearch.status}</span>
                    )}
                  </small>
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Schließen
            </button>
            {showFullContact && isEmployer && jobSearch.kontaktEmail && (
              <a 
                href={`mailto:${jobSearch.kontaktEmail}`} 
                className="btn btn-primary"
              >
                <FaEnvelope className="me-1" />
                Kontakt aufnehmen
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 