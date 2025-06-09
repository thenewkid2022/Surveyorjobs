import { FaMapMarkerAlt, FaBuilding, FaUser, FaEnvelope, FaPhone, FaTimes } from "react-icons/fa";
import { Job } from "@/types/job";

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function JobDetailModal({ job, isOpen, onClose }: JobDetailModalProps) {
  if (!isOpen || !job) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-scrollable modal-lg modal-fullscreen-sm-down">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title h4 text-dark">{job.titel}</h1>
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
                {/* Unternehmen und Standort */}
                {job.unternehmen && (
                  <div className="mb-3">
                    <FaBuilding className="me-2 text-muted" size={20} />
                    <span className="text-dark"><strong>Unternehmen:</strong> {job.unternehmen}</span>
                  </div>
                )}
                <div className="mb-3">
                  <FaMapMarkerAlt className="me-2 text-muted" size={20} />
                  <span className="text-dark"><strong>Standort:</strong> {job.standort}</span>
                </div>

                {/* Kategorie */}
                {job.kategorie && (
                  <div className="mb-3">
                    <FaUser className="me-2 text-muted" size={20} />
                    <span className="text-dark"><strong>Kategorie:</strong> {job.kategorie}</span>
                  </div>
                )}

                {/* Anstellungsart */}
                {job.artDerStelle && (
                  <div className="mb-3">
                    <FaUser className="me-2 text-muted" size={20} />
                    <span className="text-dark"><strong>Anstellungsart:</strong> {job.artDerStelle}</span>
                  </div>
                )}

                {/* Erfahrung */}
                {job.erfahrung && (
                  <div className="mb-3">
                    <FaUser className="me-2 text-muted" size={20} />
                    <span className="text-dark"><strong>Erfahrung:</strong> {job.erfahrung}</span>
                  </div>
                )}

                {/* Beschreibung */}
                <div className="mb-4">
                  <h2 className="h5 mb-3 text-dark">Beschreibung</h2>
                  <p className="text-muted">{job.beschreibung}</p>
                </div>

                {/* Kontakt */}
                <div className="card bg-light">
                  <div className="card-body">
                    <h2 className="h5 mb-3 text-dark">Kontakt</h2>
                    {job.kontaktName && (
                      <div className="mb-2">
                        <FaUser className="me-2 text-muted" size={20} />
                        <span className="text-dark"><strong>Ansprechpartner:</strong> {job.kontaktName}</span>
                      </div>
                    )}
                    {job.kontaktEmail && (
                      <div className="mb-2">
                        <FaEnvelope className="me-2 text-muted" size={20} />
                        <span className="text-dark">
                          <strong>E-Mail:</strong>{" "}
                          <a href={`mailto:${job.kontaktEmail}`} className="text-dark">
                            {job.kontaktEmail}
                          </a>
                        </span>
                      </div>
                    )}
                    {job.kontaktTelefon && (
                      <div className="mb-0">
                        <FaPhone className="me-2 text-muted" size={20} />
                        <span className="text-dark">
                          <strong>Telefon:</strong>{" "}
                          <a href={`tel:${job.kontaktTelefon}`} className="text-dark">
                            {job.kontaktTelefon}
                          </a>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status und Datum */}
                <div className="mt-3">
                  <small className="text-muted">
                    Eingestellt am: {new Date(job.erstelltAm).toLocaleDateString("de-DE")}
                    {job.status !== 'aktiv' && (
                      <span className="ms-2 badge bg-secondary">{job.status}</span>
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
            {job.kontaktEmail && (
              <a 
                href={`mailto:${job.kontaktEmail}`} 
                className="btn btn-primary"
              >
                <FaEnvelope className="me-1" />
                Bewerben
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 