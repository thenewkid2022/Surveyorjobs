"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getApiUrl } from '@/utils/api';
import PremiumFeatures from '@/app/components/PremiumFeatures';
import { FaCrown, FaCheck } from 'react-icons/fa';

interface PremiumPackage {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
}

const premiumPackages: PremiumPackage[] = [
  {
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
  },
  {
    id: "arbeitgeber",
    name: "Premium Arbeitgeber",
    price: 150,
    duration: 30,
    features: [
      "Zugriff auf alle Lebensläufe",
      "Erweiterte Suchfilter",
      "Premium-Listings",
      "Bewerber-Management",
      "Statistiken & Insights"
    ]
  }
];

export default function PremiumPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<PremiumPackage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpgrade = async (pkg: PremiumPackage) => {
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
          premiumTyp: user.accountTyp,
          lebenslaufHervorgehoben: true
        })
      });

      if (!response.ok) {
        throw new Error('Fehler beim Aktivieren der Premium-Features');
      }

      // Weiterleitung zum Zahlungsprozess
      router.push(`/payment?type=premium&packageId=${pkg.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const relevantPackage = premiumPackages.find(p => p.id === user.accountTyp);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <FaCrown className="text-warning mb-3" size={48} />
            <h1 className="h2 mb-3">Upgrade auf Premium</h1>
            <p className="lead text-muted">
              Entdecken Sie alle Vorteile eines Premium-Accounts
            </p>
          </div>

          {error && (
            <div className="alert alert-danger mb-4">
              {error}
            </div>
          )}

          <div className="row g-4">
            {/* Aktueller Status */}
            <div className="col-md-4">
              <PremiumFeatures showUpgradeButton={false} />
            </div>

            {/* Premium-Paket */}
            {relevantPackage && (
              <div className="col-md-8">
                <div className="card shadow-sm h-100">
                  <div className="card-body p-4">
                    <h2 className="h4 mb-4">{relevantPackage.name}</h2>
                    
                    <div className="mb-4">
                      <div className="display-4 fw-bold mb-2">
                        CHF {relevantPackage.price}
                      </div>
                      <div className="text-muted">
                        pro Monat
                      </div>
                    </div>

                    <ul className="list-unstyled mb-4">
                      {relevantPackage.features.map((feature, index) => (
                        <li key={index} className="mb-3">
                          <FaCheck className="text-success me-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleUpgrade(relevantPackage)}
                      className="btn btn-warning w-100"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Wird verarbeitet...' : 'Jetzt upgraden'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 