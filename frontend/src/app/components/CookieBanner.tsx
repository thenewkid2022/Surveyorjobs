"use client";

import { useState } from 'react';
import { useCookies, CookiePreferences } from '@/contexts/CookieContext';
import { FaCookie, FaCog, FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';

export default function CookieBanner() {
  const {
    showBanner,
    preferences,
    acceptAll,
    acceptNecessaryOnly,
    updatePreferences,
    hideBanner
  } = useCookies();

  const [showSettings, setShowSettings] = useState(false);
  const [tempPreferences, setTempPreferences] = useState<CookiePreferences>(preferences);

  if (!showBanner) return null;

  const handleShowSettings = () => {
    setTempPreferences(preferences);
    setShowSettings(true);
  };

  const handleSaveSettings = () => {
    updatePreferences(tempPreferences);
    setShowSettings(false);
  };

  const handleTempPreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return; // Notwendige Cookies können nicht deaktiviert werden
    setTempPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (showSettings) {
    return (
      <>
        {/* Backdrop */}
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" style={{ zIndex: 9998 }}></div>
        
        {/* Settings Modal */}
        <div className="position-fixed top-50 start-50 translate-middle bg-white rounded shadow-lg p-4" style={{ zIndex: 9999, maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0 text-success">
              <FaCog className="me-2" />
              Cookie-Einstellungen
            </h4>
            <button 
              className="btn-close" 
              onClick={() => setShowSettings(false)}
              aria-label="Schließen"
            ></button>
          </div>

          <div className="mb-4">
            <p className="text-muted">
              Wählen Sie, welche Cookies Sie akzeptieren möchten. Notwendige Cookies sind erforderlich 
              für die Grundfunktionen der Website und können nicht deaktiviert werden.
            </p>
          </div>

          {/* Notwendige Cookies */}
          <div className="card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1 text-success">Notwendige Cookies</h6>
                  <small className="text-muted">
                    Erforderlich für die Grundfunktionen der Website
                  </small>
                </div>
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    checked={true} 
                    disabled 
                  />
                  <span className="badge bg-success ms-2">Immer aktiv</span>
                </div>
              </div>
              <div className="mt-2">
                <small className="text-muted">
                  Session-Cookies, Sicherheits-Cookies, Login-Status
                </small>
              </div>
            </div>
          </div>

          {/* Funktionale Cookies */}
          <div className="card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1 text-primary">Funktionale Cookies</h6>
                  <small className="text-muted">
                    Verbessern die Funktionalität und Personalisierung
                  </small>
                </div>
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    checked={tempPreferences.functional}
                    onChange={(e) => handleTempPreferenceChange('functional', e.target.checked)}
                  />
                </div>
              </div>
              <div className="mt-2">
                <small className="text-muted">
                  Spracheinstellungen, Filter-Präferenzen, Layout-Einstellungen
                </small>
              </div>
            </div>
          </div>

          {/* Analyse-Cookies */}
          <div className="card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1 text-warning">Analyse-Cookies</h6>
                  <small className="text-muted">
                    Helfen uns, die Website-Nutzung zu verstehen
                  </small>
                </div>
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    checked={tempPreferences.analytics}
                    onChange={(e) => handleTempPreferenceChange('analytics', e.target.checked)}
                  />
                </div>
              </div>
              <div className="mt-2">
                <small className="text-muted">
                  Google Analytics (anonymisiert), Website-Performance, Nutzerverhalten
                </small>
              </div>
            </div>
          </div>

          {/* Marketing-Cookies */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1 text-info">Marketing-Cookies</h6>
                  <small className="text-muted">
                    Derzeit nicht verwendet
                  </small>
                </div>
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    checked={tempPreferences.marketing}
                    onChange={(e) => handleTempPreferenceChange('marketing', e.target.checked)}
                    disabled
                  />
                  <span className="badge bg-secondary ms-2">Inaktiv</span>
                </div>
              </div>
              <div className="mt-2">
                <small className="text-muted">
                  Aktuell werden keine Marketing-Cookies eingesetzt
                </small>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex flex-wrap gap-2">
            <button 
              className="btn btn-success"
              onClick={handleSaveSettings}
            >
              <FaCheck className="me-1" />
              Einstellungen speichern
            </button>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => setShowSettings(false)}
            >
              Abbrechen
            </button>
          </div>

          <div className="mt-3 pt-3 border-top">
            <small className="text-muted">
              <FaInfoCircle className="me-1" />
              Weitere Informationen finden Sie in unserer{' '}
              <a href="/cookie-richtlinie" className="text-success">Cookie-Richtlinie</a>
              {' '}und{' '}
              <a href="/datenschutz" className="text-success">Datenschutzerklärung</a>.
            </small>
          </div>
        </div>
      </>
    );
  }

  return (
    <div 
      className="position-fixed bottom-0 start-0 end-0 bg-white border-top shadow-lg p-4"
      style={{ zIndex: 9999 }}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-8 col-md-7 mb-3 mb-md-0">
            <div className="d-flex align-items-start">
              <FaCookie className="text-warning me-3 mt-1" size={24} />
              <div>
                <h6 className="mb-2 text-success">
                  Wir verwenden Cookies
                </h6>
                <p className="mb-2 small">
                  Diese Website verwendet Cookies, um Ihnen die bestmögliche Nutzererfahrung zu bieten. 
                  Notwendige Cookies sind für die Grundfunktionen erforderlich. Mit Ihrer Einwilligung 
                  verwenden wir auch Analyse-Cookies zur Verbesserung unserer Website.
                </p>
                <p className="mb-0 small text-muted">
                  Weitere Informationen finden Sie in unserer{' '}
                  <a href="/cookie-richtlinie" className="text-success text-decoration-none">
                    Cookie-Richtlinie
                  </a>.
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4 col-md-5">
            <div className="d-flex flex-column flex-md-row gap-2">
              <button 
                className="btn btn-success btn-sm flex-fill"
                onClick={acceptAll}
              >
                <FaCheck className="me-1" />
                Alle akzeptieren
              </button>
              <button 
                className="btn btn-outline-secondary btn-sm flex-fill"
                onClick={acceptNecessaryOnly}
              >
                Nur notwendige
              </button>
              <button 
                className="btn btn-outline-primary btn-sm flex-fill"
                onClick={handleShowSettings}
              >
                <FaCog className="me-1" />
                Einstellungen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 