"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getApiUrl } from '@/utils/api';
import { FaLock, FaCrown, FaChartBar } from 'react-icons/fa';

interface CVAccessGateProps {
  children: React.ReactNode;
  resumeId?: string;
}

interface AccessInfo {
  limit: number;
  used: number;
  anonymizedOnly: boolean;
  packageId?: string;
  expiresAt?: string;
}

export default function CVAccessGate({ children, resumeId }: CVAccessGateProps) {
  const { user, token } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accessInfo, setAccessInfo] = useState<AccessInfo | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      if (!token || user?.accountTyp !== 'arbeitgeber') {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${getApiUrl()}/api/cv-access/check`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setHasAccess(true);
          setAccessInfo(data.accessInfo);
        } else {
          const errorData = await response.json();
          setHasAccess(false);
          console.log('CV Access Error:', errorData.message);
        }
      } catch (error) {
        console.error('CV Access Check Error:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [token, user]);

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Prüfe Zugriff...</span>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="card border-warning">
        <div className="card-body text-center py-5">
          <FaLock className="text-warning mb-3" size={48} />
          <h3 className="h4 mb-3">Premium-Zugriff erforderlich</h3>
          <p className="text-muted mb-4">
            Um Lebensläufe einzusehen, benötigen Sie ein bezahltes Arbeitgeber-Paket.
          </p>
          <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
            <button 
              className="btn btn-warning"
              onClick={() => window.location.href = '/stellenanzeigen-aufgeben'}
            >
              <FaCrown className="me-2" />
              Paket wählen
            </button>
            <button 
              className="btn btn-outline-primary"
              onClick={() => window.location.href = '/premium'}
            >
              Mehr erfahren
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getProgressPercentage = () => {
    if (!accessInfo || accessInfo.limit === -1) return 0;
    return Math.min((accessInfo.used / accessInfo.limit) * 100, 100);
  };

  const getProgressColor = () => {
    const percentage = getProgressPercentage();
    if (percentage >= 90) return 'bg-danger';
    if (percentage >= 70) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div>
      {accessInfo && (
        <div className="alert alert-info border-0 shadow-sm mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center">
              <FaChartBar className="me-2 text-primary" />
              <strong>CV-Zugriffe:</strong>
              <span className="ms-2">
                {accessInfo.used} / {accessInfo.limit === -1 ? '∞' : accessInfo.limit}
              </span>
            </div>
            <div className="d-flex gap-2">
              {accessInfo.anonymizedOnly && (
                <span className="badge bg-secondary">Nur anonymisiert</span>
              )}
              {accessInfo.packageId && (
                <span className="badge bg-primary text-capitalize">
                  {accessInfo.packageId}
                </span>
              )}
            </div>
          </div>
          
          {accessInfo.limit !== -1 && (
            <div className="progress" style={{ height: '6px' }}>
              <div 
                className={`progress-bar ${getProgressColor()}`}
                role="progressbar" 
                style={{ width: `${getProgressPercentage()}%` }}
                aria-valuenow={accessInfo.used}
                aria-valuemin={0}
                aria-valuemax={accessInfo.limit}
              ></div>
            </div>
          )}
          
          {accessInfo.expiresAt && (
            <div className="mt-2">
              <small className="text-muted">
                Paket läuft ab: {new Date(accessInfo.expiresAt).toLocaleDateString('de-CH')}
              </small>
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
} 