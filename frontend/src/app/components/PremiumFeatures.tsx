"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getApiUrl } from '@/utils/api';
import { FaLock, FaCrown, FaChartBar, FaCheck, FaTimes, FaArrowRight } from 'react-icons/fa';

interface PremiumFeaturesProps {
  onUpgrade: () => void;
  showUpgradeButton?: boolean;
}

interface PremiumStatus {
  premiumFeatures: {
    lebenslaufHervorgehoben: boolean;
    premiumBis?: string;
    premiumTyp?: 'arbeitssuchender' | 'arbeitgeber';
  };
  accountTyp: 'arbeitgeber' | 'arbeitssuchender';
}

export default function PremiumFeatures({ onUpgrade, showUpgradeButton = true }: PremiumFeaturesProps) {
  const { user, token } = useAuth();
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPremiumStatus = async () => {
      if (!token || !user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${getApiUrl()}/api/premium/status`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setPremiumStatus(data);
        } else {
          throw new Error('Fehler beim Laden der Premium-Status');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPremiumStatus();
  }, [token, user]);

  if (!user) {
    return null;
  }

  // Für Arbeitgeber: Weiterleitung zu integrierten Paketen
  if (user.accountTyp === 'arbeitgeber') {
    return (
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex align-items-center mb-4">
            <FaCrown className="text-warning me-2" size={24} />
            <h2 className="h4 mb-0">Arbeitgeber-Pakete</h2>
          </div>

          <div className="mb-4">
            <p className="text-muted">
              Nutzen Sie unsere integrierten Pakete mit Stellenanzeigen und Lebenslauf-Zugriff.
            </p>
          </div>

          <div className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <FaCheck className="text-success me-2" />
              <div>
                <div className="fw-bold">Integrierte Pakete</div>
                <div className="text-muted small">Jobs + CV-Zugriff ab CHF 99/Monat</div>
              </div>
            </div>
            <div className="d-flex align-items-center mb-3">
              <FaCheck className="text-success me-2" />
              <div>
                <div className="fw-bold">Flexible Limits</div>
                <div className="text-muted small">Von 5 bis unbegrenzte Stellenanzeigen</div>
              </div>
            </div>
            <div className="d-flex align-items-center mb-3">
              <FaCheck className="text-success me-2" />
              <div>
                <div className="fw-bold">CV-Browser</div>
                <div className="text-muted small">Zugriff auf qualifizierte Bewerbende</div>
              </div>
            </div>
          </div>

          {showUpgradeButton && (
            <button
              onClick={() => window.location.href = '/stellenanzeigen-aufgeben'}
              className="btn btn-warning w-100"
            >
              <FaArrowRight className="me-2" />
              Zu den Paketen
            </button>
          )}
        </div>
      </div>
    );
  }

  // Für Arbeitssuchende: Bestehende Premium-Features
  const isPremium = premiumStatus?.premiumFeatures?.premiumBis && 
                   new Date() <= new Date(premiumStatus.premiumFeatures.premiumBis);

  const getPremiumFeatures = () => {
    return [
      {
        title: 'Lebenslauf hervorheben',
        description: 'Ihr Lebenslauf wird in Suchergebnissen hervorgehoben',
        active: premiumStatus?.premiumFeatures?.lebenslaufHervorgehoben || false
      },
      {
        title: 'Premium-Profil',
        description: 'Zugriff auf erweiterte Profilfunktionen',
        active: isPremium
      },
      {
        title: 'Direkter Kontakt',
        description: 'Arbeitgeber können Sie direkt kontaktieren',
        active: isPremium
      }
    ];
  };

  if (isLoading) {
    return <div className="text-center py-4">Lädt...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex align-items-center mb-4">
          <FaCrown className="text-warning me-2" size={24} />
          <h2 className="h4 mb-0">Premium-Features</h2>
        </div>

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-bold">Status:</span>
            <span className={`badge ${isPremium ? 'bg-success' : 'bg-secondary'}`}>
              {isPremium ? 'Premium aktiv' : 'Basis-Version'}
            </span>
          </div>
          {isPremium && premiumStatus?.premiumFeatures?.premiumBis && (
            <div className="text-muted small">
              Gültig bis: {new Date(premiumStatus.premiumFeatures.premiumBis).toLocaleDateString('de-CH')}
            </div>
          )}
        </div>

        <div className="mb-4">
          {getPremiumFeatures().map((feature, index) => (
            <div key={index} className="d-flex align-items-center mb-3">
              {feature.active ? (
                <FaCheck className="text-success me-2" />
              ) : (
                <FaTimes className="text-muted me-2" />
              )}
              <div>
                <div className="fw-bold">{feature.title}</div>
                <div className="text-muted small">{feature.description}</div>
              </div>
            </div>
          ))}
        </div>

        {showUpgradeButton && !isPremium && (
          <button
            onClick={onUpgrade}
            className="btn btn-warning w-100"
          >
            Premium für CHF 5/Monat
          </button>
        )}
      </div>
    </div>
  );
} 