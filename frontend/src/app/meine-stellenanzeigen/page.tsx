'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getApiUrl } from '@/utils/api';
import JobCard from '../components/JobCard';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

interface Stellenanzeige {
  _id: string;
  titel: string;
  standort: string;
  kategorie: string;
  beschreibung: string;
  erstelltAm: string;
  expiresAt: string;
  status: string;
  artDerStelle: string;
}

export default function MeineStellenanzeigen() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [stellenanzeigen, setStellenanzeigen] = useState<Stellenanzeige[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchStellenanzeigen = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await fetch(`${getApiUrl()}/api/stellenanzeigen-aufgeben/meine`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Fehler beim Laden der Stellenanzeigen');
        }

        const data = await response.json();
        setStellenanzeigen(data.stellenanzeigen);
      } catch (err) {
        console.error('Fehler beim Laden der Stellenanzeigen:', err);
        setError('Fehler beim Laden der Stellenanzeigen');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStellenanzeigen();
  }, [token, router]);

  if (!token) {
    return null;
  }

  if (isLoading) {
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
        <div className="alert alert-danger">
          <p className="mb-0">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Link href="/dashboard" className="btn btn-outline-primary mb-3">
            <FaArrowLeft className="me-2" />
            Zurück zum Dashboard
          </Link>
          <h1 className="h2 mb-0">Meine Stellenanzeigen</h1>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => router.push('/stellenanzeigen-aufgeben')}
        >
          <FaPlus className="me-2" />
          Neue Stellenanzeige
        </button>
      </div>

      {stellenanzeigen.length === 0 ? (
        <div className="alert alert-info">
          Sie haben noch keine Stellenanzeigen erstellt.
          <div className="mt-3">
            <button 
              className="btn btn-primary"
              onClick={() => router.push('/stellenanzeigen-aufgeben')}
            >
              <FaPlus className="me-2" />
              Erste Stellenanzeige erstellen
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {stellenanzeigen.map((stellenanzeige) => (
            <div key={stellenanzeige._id} className="col-12 col-md-6 col-lg-4">
              <JobCard
                id={stellenanzeige._id}
                titel={stellenanzeige.titel}
                standort={stellenanzeige.standort}
                artDerStelle={stellenanzeige.artDerStelle}
                erstelltAm={stellenanzeige.erstelltAm}
                kategorie={stellenanzeige.kategorie}
                linkPrefix="berufe"
                type="job"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 