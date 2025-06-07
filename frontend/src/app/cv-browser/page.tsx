"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getApiUrl } from '@/utils/api';
import CVAccessGate from '@/app/components/CVAccessGate';
import { FaUser, FaMapMarkerAlt, FaCalendarAlt, FaGraduationCap, FaDownload, FaEye } from 'react-icons/fa';

interface Resume {
  _id: string;
  titel: string;
  beruf: string;
  standort: string;
  erfahrung: string;
  ausbildung: string;
  beschreibung: string;
  kategorie: string;
  mobilitaet: string;
  artDerStelle: string;
  verfuegbarAb: string;
  faehigkeiten: string[];
  sprachen: string[];
  erstelltAm: string;
  // Vollständige Daten (nur für Premium)
  kontaktEmail?: string;
  kontaktTelefon?: string;
  lebenslauf?: string;
  ersteller?: {
    vorname: string;
    nachname: string;
  };
}

interface AccessInfo {
  limit: number;
  used: number;
  anonymizedOnly: boolean;
}

export default function CVBrowser() {
  const { user, token } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accessInfo, setAccessInfo] = useState<AccessInfo | null>(null);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  useEffect(() => {
    if (!token || user?.accountTyp !== 'arbeitgeber') {
      setLoading(false);
      return;
    }

    fetchResumes();
  }, [token, user]);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${getApiUrl()}/api/cv-access/resumes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Fehler beim Laden der Lebensläufe');
      }

      const data = await response.json();
      setResumes(data.resumes);
      setAccessInfo(data.accessInfo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const viewFullResume = async (resumeId: string) => {
    try {
      const response = await fetch(`${getApiUrl()}/api/cv-access/resume/${resumeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Fehler beim Laden des Lebenslaufs');
      }

      const data = await response.json();
      setSelectedResume(data.resume);
      setAccessInfo(data.accessInfo);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    }
  };

  if (!user || user.accountTyp !== 'arbeitgeber') {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h1 className="h3 mb-3">Zugriff verweigert</h1>
          <p>Diese Seite ist nur für Arbeitgeber verfügbar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <CVAccessGate>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0">Lebenslauf-Browser</h1>
          <button 
            className="btn btn-outline-primary"
            onClick={fetchResumes}
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
              <span className="visually-hidden">Lade Lebensläufe...</span>
            </div>
          </div>
        ) : (
          <div className="row">
            {resumes.length === 0 ? (
              <div className="col-12 text-center py-5">
                <p className="text-muted">Keine Lebensläufe verfügbar.</p>
              </div>
            ) : (
              resumes.map((resume) => (
                <div key={resume._id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title text-primary">{resume.beruf}</h5>
                      
                      <div className="mb-2">
                        <FaMapMarkerAlt className="me-2 text-muted" size={14} />
                        <small className="text-muted">{resume.standort}</small>
                      </div>

                      <div className="mb-2">
                        <FaCalendarAlt className="me-2 text-muted" size={14} />
                        <small className="text-muted">Erfahrung: {resume.erfahrung}</small>
                      </div>

                      <div className="mb-2">
                        <FaGraduationCap className="me-2 text-muted" size={14} />
                        <small className="text-muted">Verfügbar ab: {new Date(resume.verfuegbarAb).toLocaleDateString('de-CH')}</small>
                      </div>

                      <div className="mb-3">
                        <p className="card-text text-muted small">
                          {resume.beschreibung.substring(0, 100)}...
                        </p>
                      </div>

                      {resume.faehigkeiten.length > 0 && (
                        <div className="mb-3">
                          <div className="d-flex flex-wrap gap-1">
                            {resume.faehigkeiten.slice(0, 3).map((skill, index) => (
                              <span key={index} className="badge bg-secondary text-xs">
                                {skill}
                              </span>
                            ))}
                            {resume.faehigkeiten.length > 3 && (
                              <span className="badge bg-light text-dark text-xs">
                                +{resume.faehigkeiten.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="d-flex gap-2">
                        {accessInfo?.anonymizedOnly ? (
                          <button 
                            className="btn btn-outline-primary btn-sm flex-fill"
                            onClick={() => viewFullResume(resume._id)}
                            disabled={accessInfo.used >= accessInfo.limit && accessInfo.limit !== -1}
                          >
                            <FaEye className="me-1" />
                            Details
                          </button>
                        ) : (
                          <>
                            <button 
                              className="btn btn-primary btn-sm flex-fill"
                              onClick={() => viewFullResume(resume._id)}
                              disabled={Boolean(accessInfo && accessInfo.used >= accessInfo.limit && accessInfo.limit !== -1)}
                            >
                              <FaEye className="me-1" />
                              Vollständig
                            </button>
                            {resume.kontaktEmail && (
                              <button 
                                className="btn btn-success btn-sm"
                                onClick={() => window.location.href = `mailto:${resume.kontaktEmail}`}
                              >
                                Kontakt
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal für vollständigen Lebenslauf */}
        {selectedResume && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {selectedResume.ersteller ? 
                      `${selectedResume.ersteller.vorname} ${selectedResume.ersteller.nachname}` :
                      selectedResume.beruf
                    }
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setSelectedResume(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <strong>Beruf:</strong> {selectedResume.beruf}
                    </div>
                    <div className="col-md-6">
                      <strong>Standort:</strong> {selectedResume.standort}
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <strong>Erfahrung:</strong> {selectedResume.erfahrung}
                    </div>
                    <div className="col-md-6">
                      <strong>Verfügbar ab:</strong> {new Date(selectedResume.verfuegbarAb).toLocaleDateString('de-CH')}
                    </div>
                  </div>

                  <div className="mb-3">
                    <strong>Ausbildung:</strong>
                    <p>{selectedResume.ausbildung}</p>
                  </div>

                  <div className="mb-3">
                    <strong>Beschreibung:</strong>
                    <p>{selectedResume.beschreibung}</p>
                  </div>

                  {selectedResume.faehigkeiten.length > 0 && (
                    <div className="mb-3">
                      <strong>Fähigkeiten:</strong>
                      <div className="d-flex flex-wrap gap-1 mt-2">
                        {selectedResume.faehigkeiten.map((skill, index) => (
                          <span key={index} className="badge bg-primary">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedResume.sprachen.length > 0 && (
                    <div className="mb-3">
                      <strong>Sprachen:</strong>
                      <div className="d-flex flex-wrap gap-1 mt-2">
                        {selectedResume.sprachen.map((sprache, index) => (
                          <span key={index} className="badge bg-secondary">
                            {sprache}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedResume.kontaktEmail && (
                    <div className="mb-3">
                      <strong>Kontakt:</strong>
                      <p>
                        E-Mail: <a href={`mailto:${selectedResume.kontaktEmail}`}>{selectedResume.kontaktEmail}</a>
                        {selectedResume.kontaktTelefon && (
                          <><br />Telefon: <a href={`tel:${selectedResume.kontaktTelefon}`}>{selectedResume.kontaktTelefon}</a></>
                        )}
                      </p>
                    </div>
                  )}

                  {selectedResume.lebenslauf && (
                    <div className="mb-3">
                      <strong>Lebenslauf:</strong>
                      <div className="mt-2">
                        <a 
                          href={selectedResume.lebenslauf} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary"
                        >
                          <FaDownload className="me-2" />
                          PDF herunterladen
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setSelectedResume(null)}
                  >
                    Schließen
                  </button>
                  {selectedResume.kontaktEmail && (
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={() => window.location.href = `mailto:${selectedResume.kontaktEmail}`}
                    >
                      Kontaktieren
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CVAccessGate>
    </div>
  );
} 