'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getApiUrl } from '@/utils/api';
import { FaBriefcase, FaBookmark, FaSearch, FaUserEdit, FaCog, FaEnvelope, FaUser, FaPlus, FaQuestionCircle } from 'react-icons/fa';
import PremiumFeatures from '@/app/components/PremiumFeatures';

interface DashboardStats {
  totalJobs: number;
  activeApplications: number;
  savedJobs: number;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    activeApplications: 0,
    savedJobs: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await fetch(`${getApiUrl()}/api/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Fehler beim Laden der Dashboard-Daten');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Fehler beim Laden der Dashboard-Daten:', err);
        setError('Fehler beim Laden der Dashboard-Daten');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [token, router]);

  const handleCardClick = (route: string) => {
    if (!token) {
      router.push('/login');
      return;
    }

    if (route === '/suche-einen-job' && user?.accountTyp === 'arbeitgeber') {
      router.push('/stellenanzeigen-aufgeben');
      return;
    } else if (route === '/suche-einen-job' && user?.accountTyp === 'arbeitssuchender') {
      router.push('/suche-einen-job');
      return;
    }

    router.push(route);
  };

  if (!token) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container">
          <div className="animate-pulse">
            <div className="h-8 bg-secondary rounded w-1/4 mb-8 opacity-25"></div>
            <div className="row g-4 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="col-md-4">
                  <div className="card h-100">
                    <div className="card-body p-4">
                      <div className="h-6 bg-secondary rounded w-1/2 mb-4 opacity-25"></div>
                      <div className="h-8 bg-secondary rounded w-1/4 opacity-25"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8">
        <div className="container">
          <div className="alert alert-danger">
            <p className="mb-0">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-white">
      <div className="container">
        <h1 className="display-6 fw-bold text-primary mb-5">
          Willkommen zurück, {user?.vorname || 'Benutzer'}!
        </h1>

        {/* Statistiken */}
        <div className="row g-3 mb-5">
          <div className="col-12 col-md-4">
            <div
              className="card h-100 border-0 shadow-sm text-center py-3 cursor-pointer"
              onClick={() => handleCardClick(user?.accountTyp === 'arbeitgeber' ? '/meine-stellenanzeigen' : '/meine-stellengesuche')}
              role="button"
              tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleCardClick(user?.accountTyp === 'arbeitgeber' ? '/meine-stellenanzeigen' : '/meine-stellengesuche')}
            >
              <FaBriefcase className="text-primary mb-2" size={28} />
              <div className="fw-bold fs-3 mb-1">{stats.activeApplications}</div>
              <div className="text-secondary small">Aktive Inserate</div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div
              className="card h-100 border-0 shadow-sm text-center py-3 cursor-pointer"
              onClick={() => handleCardClick('/filter/berufsfeld')}
              role="button"
              tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleCardClick('/filter/berufsfeld')}
            >
              <FaBookmark className="text-primary mb-2" size={28} />
              <div className="fw-bold fs-3 mb-1">{stats.savedJobs}</div>
              <div className="text-secondary small">Gespeicherte Inserate</div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div
              className="card h-100 border-0 shadow-sm text-center py-3 cursor-pointer"
              onClick={() => handleCardClick('/filter/berufsfeld')}
              role="button"
              tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleCardClick('/filter/berufsfeld')}
            >
              <FaSearch className="text-primary mb-2" size={28} />
              <div className="fw-bold fs-3 mb-1">{stats.totalJobs}</div>
              <div className="text-secondary small">Verfügbare Inserate</div>
            </div>
          </div>
        </div>

        <div className="row g-4 mb-4">
          {/* Aktuelle Aktivitäten */}
          <div className="col-12 col-lg-6">
            <div className="card dashboard-section h-100 border-0 shadow-sm p-4">
              <h2 className="h5 mb-4 text-primary">Aktuelle Aktivitäten</h2>
              <button 
                className="btn btn-primary w-100 mb-3"
                onClick={() => handleCardClick('/filter/berufsfeld')}
              >
                <FaSearch className="me-2" /> Inserate finden
              </button>
              <button 
                className="btn btn-primary w-100"
                onClick={() => handleCardClick('/profile')}
              >
                <FaUser className="me-2" /> Profil bearbeiten
              </button>
            </div>
          </div>

          {/* Premium-Features */}
          <div className="col-12 col-lg-6">
            <PremiumFeatures 
              onUpgrade={() => router.push('/premium')}
            />
          </div>
        </div>

        {/* Schnellzugriff */}
        <div className="row g-4">
          <div className="col-12">
            <div className="card dashboard-section border-0 shadow-sm p-4">
              <h2 className="h5 mb-4 text-primary">Schnellzugriff</h2>
              <div className="row g-3">
                <div className="col-md-6">
                  <button 
                    className="btn btn-primary w-100 mb-3"
                    onClick={() => handleCardClick(user?.accountTyp === 'arbeitgeber' ? '/neue-stellenanzeige' : '/neues-stellengesuch')}
                  >
                    <FaPlus className="me-2" /> Inserat erstellen
                  </button>
                </div>
                <div className="col-md-6">
                  <button 
                    className="btn btn-primary w-100"
                    onClick={() => handleCardClick('/help')}
                  >
                    <FaQuestionCircle className="me-2" /> Hilfe & Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 