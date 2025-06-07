"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getApiUrl } from '@/utils/api';
import { FaCrown, FaCheck, FaArrowRight } from 'react-icons/fa';

interface PremiumPackage {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
}

// Nur noch Premium für Arbeitssuchende
const jobseekerPremium: PremiumPackage = {
  id: "arbeitssuchender",
  name: "Premium Arbeitssuchender",
  price: 5,
  duration: 30,
  features: [
    "Lebenslauf hervorheben",
    "Premium-Profil",
    "Direkter Kontakt",
    "Erweiterte Suchfilter",
    "Bewerbungs-Tracking"
  ]
};

export default function PremiumPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpgrade = async () => {
    if (!token || !user) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${getApiUrl()}/api/premium/aktivieren`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          premiumTyp: 'arbeitssuchender',
          lebenslaufHervorgehoben: true
        })
      });

      if (!response.ok) {
        throw new Error('Fehler beim Aktivieren der Premium-Features');
      }

      // Weiterleitung zum Zahlungsprozess
      router.push(`/payment?type=premium&packageId=${jobseekerPremium.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  // Arbeitgeber zu den integrierten Paketen weiterleiten
  if (user.accountTyp === 'arbeitgeber') {
    return (
      <div className="min-vh-100 bg-dark text-white">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <FaCrown className="text-warning mb-4" size={64} />
              <h1 className="display-4 mb-4">Premium für Arbeitgeber</h1>
              <p className="lead mb-4">
                Für Arbeitgeber haben wir integrierte Pakete, die sowohl Stellenanzeigen als auch Lebenslauf-Zugriff beinhalten.
              </p>
              <div className="alert alert-info d-inline-block mb-4">
                <FaArrowRight className="me-2" />
                Nutzen Sie unsere neuen Arbeitgeber-Pakete mit CV-Zugriff!
              </div>
              <div className="d-grid gap-2 d-md-block">
                <button
                  onClick={() => router.push('/stellenanzeigen-aufgeben')}
                  className="btn btn-warning btn-lg me-md-2"
                >
                  Zu den Arbeitgeber-Paketen
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="btn btn-outline-light btn-lg"
                >
                  Zurück zum Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Premium nur für Arbeitssuchende
  return (
    <div className="min-vh-100 bg-dark text-white">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <h1 className="display-4 text-center mb-5">
              <FaCrown className="text-warning me-3" />
              Premium-Features
            </h1>
            
            {error && (
              <div className="alert alert-danger mb-4">{error}</div>
            )}

            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="card shadow-lg border-0 bg-dark text-white">
                  <div className="card-body p-5">
                    <h2 className="h3 mb-4 text-center">{jobseekerPremium.name}</h2>
                    
                    <div className="text-center mb-4">
                      <div className="display-3 fw-bold mb-2 text-warning">
                        CHF {jobseekerPremium.price}
                      </div>
                      <div className="text-white-50 fs-5">
                        pro Monat
                      </div>
                    </div>

                    <ul className="list-unstyled mb-4">
                      {jobseekerPremium.features.map((feature, index) => (
                        <li key={index} className="mb-3 d-flex align-items-center">
                          <FaCheck className="text-success me-3 flex-shrink-0" />
                          <span className="fs-5">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={handleUpgrade}
                      className="btn btn-warning btn-lg w-100 fw-bold"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Wird verarbeitet...' : 'Jetzt Premium werden'}
                    </button>

                    <div className="text-center mt-3">
                      <small className="text-white-50">
                        Monatlich kündbar • Sofort verfügbar
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 