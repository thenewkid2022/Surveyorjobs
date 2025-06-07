'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getApiUrl } from '@/utils/api';
import { 
  FaChartLine, 
  FaEye, 
  FaFileAlt, 
  FaMousePointer, 
  FaUsers, 
  FaFilter,
  FaCalendarAlt,
  FaMobile,
  FaDesktop,
  FaTabletAlt,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';

interface AnalyticsData {
  summary: {
    totalJobViews: number;
    totalCVViews: number;
    totalCVClicks: number;
    totalApplicationsStarted: number;
    totalApplicationsCompleted: number;
    conversionRate: number;
  };
  jobPerformance: Array<{
    jobId: string;
    jobTitle: string;
    views: number;
    applications: number;
    conversionRate: number;
  }>;
  regionBreakdown: Array<{
    region: string;
    count: number;
  }>;
  deviceBreakdown: Array<{
    device: string;
    count: number;
  }>;
  timeChart: Array<{
    _id: { date: string; eventType: string };
    count: number;
  }>;
  dateRange: {
    from: Date;
    to: Date;
  };
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    if (user?.accountTyp !== 'arbeitgeber') {
      router.push('/dashboard');
      return;
    }

    // Standardzeitraum: letzte 30 Tage
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    setDateFrom(thirtyDaysAgo.toISOString().split('T')[0]);
    setDateTo(today.toISOString().split('T')[0]);

    fetchAnalyticsData();
  }, [token, user, router]);

  const fetchAnalyticsData = async (customDateFrom?: string, customDateTo?: string, jobId?: string) => {
    try {
      setIsLoading(true);
      setError('');

      const params = new URLSearchParams();
      if (customDateFrom || dateFrom) params.append('dateFrom', customDateFrom || dateFrom);
      if (customDateTo || dateTo) params.append('dateTo', customDateTo || dateTo);
      if (jobId || selectedJobId) params.append('jobId', jobId || selectedJobId);

      const response = await fetch(`${getApiUrl()}/api/analytics/dashboard?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Fehler beim Laden der Analytics-Daten');
      }

      const result = await response.json();
      setData(result.data);
    } catch (err: any) {
      console.error('Fehler beim Laden der Analytics-Daten:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = () => {
    fetchAnalyticsData(dateFrom, dateTo, selectedJobId);
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile': return <FaMobile className="me-2" />;
      case 'tablet': return <FaTabletAlt className="me-2" />;
      case 'desktop': return <FaDesktop className="me-2" />;
      default: return <FaDesktop className="me-2" />;
    }
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('de-CH').format(num);
  };

  const formatPercentage = (num: number): string => {
    return `${num.toFixed(1)}%`;
  };

  if (!token) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-vh-100 bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Laden...</span>
              </div>
              <h3 className="text-primary">Analytics-Daten werden geladen...</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="alert alert-danger">
                <h4 className="alert-heading">Fehler beim Laden der Analytics</h4>
                <p>{error}</p>
                {error.includes('Enterprise') && (
                  <div className="mt-3">
                    <button
                      onClick={() => router.push('/stellenanzeigen-aufgeben')}
                      className="btn btn-primary"
                    >
                      Auf Enterprise upgraden
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-vh-100 bg-light py-5">
        <div className="container">
          <div className="alert alert-info">
            <p className="mb-0">Keine Analytics-Daten verfügbar.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="display-6 fw-bold text-primary mb-2">
                  <FaChartLine className="me-3" />
                  Analytics-Dashboard
                </h1>
                <p className="text-muted">Detaillierte Statistiken zu Ihren Stellenanzeigen</p>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="btn btn-outline-primary"
              >
                Zurück zum Dashboard
              </button>
            </div>

            {/* Filter */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title">
                  <FaFilter className="me-2" />
                  Filter
                </h5>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Von</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Bis</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Stellenanzeige</label>
                    <select
                      className="form-select"
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                    >
                      <option value="">Alle Anzeigen</option>
                      {data.jobPerformance.map(job => (
                        <option key={job.jobId} value={job.jobId}>
                          {job.jobTitle}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  <button
                    onClick={handleFilterChange}
                    className="btn btn-primary"
                  >
                    <FaCalendarAlt className="me-2" />
                    Filter anwenden
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zusammenfassung */}
        <div className="row g-4 mb-5">
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <FaEye className="text-primary mb-3" size={32} />
                <h3 className="fw-bold text-primary">{formatNumber(data.summary.totalJobViews)}</h3>
                <p className="text-muted mb-0">Anzeigen-Aufrufe</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <FaFileAlt className="text-success mb-3" size={32} />
                <h3 className="fw-bold text-success">{formatNumber(data.summary.totalCVViews)}</h3>
                <p className="text-muted mb-0">Lebenslauf-Aufrufe</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <FaMousePointer className="text-warning mb-3" size={32} />
                <h3 className="fw-bold text-warning">{formatNumber(data.summary.totalCVClicks)}</h3>
                <p className="text-muted mb-0">Lebenslauf-Klicks</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <FaUsers className="text-info mb-3" size={32} />
                <h3 className="fw-bold text-info">{formatNumber(data.summary.totalApplicationsCompleted)}</h3>
                <p className="text-muted mb-0">Bewerbungen</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <FaChartLine className="text-success mb-3" size={32} />
                <h3 className="fw-bold text-success">{formatPercentage(data.summary.conversionRate)}</h3>
                <p className="text-muted mb-0">Conversion Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Job Performance */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Performance pro Stellenanzeige</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Stellenanzeige</th>
                        <th>Aufrufe</th>
                        <th>Bewerbungen</th>
                        <th>Conversion Rate</th>
                        <th>Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.jobPerformance.map((job, index) => (
                        <tr key={job.jobId}>
                          <td>
                            <strong>{job.jobTitle}</strong>
                          </td>
                          <td>{formatNumber(job.views)}</td>
                          <td>{formatNumber(job.applications)}</td>
                          <td>
                            <span className={`badge ${job.conversionRate > 5 ? 'bg-success' : job.conversionRate > 2 ? 'bg-warning' : 'bg-danger'}`}>
                              {formatPercentage(job.conversionRate)}
                            </span>
                          </td>
                          <td>
                            {job.conversionRate > 5 ? (
                              <FaArrowUp className="text-success" />
                            ) : job.conversionRate > 2 ? (
                              <span className="text-warning">→</span>
                            ) : (
                              <FaArrowDown className="text-danger" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Regionen & Geräte */}
        <div className="row mb-5">
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">Top Regionen</h5>
              </div>
              <div className="card-body">
                {data.regionBreakdown.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {data.regionBreakdown.slice(0, 5).map((region, index) => (
                      <div key={region.region} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{region.region || 'Unbekannt'}</span>
                        <span className="badge bg-info rounded-pill">{formatNumber(region.count)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">Keine Regionsdaten verfügbar</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">Geräte-Verteilung</h5>
              </div>
              <div className="card-body">
                {data.deviceBreakdown.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {data.deviceBreakdown.map((device, index) => (
                      <div key={device.device} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>
                          {getDeviceIcon(device.device)}
                          {device.device.charAt(0).toUpperCase() + device.device.slice(1)}
                        </span>
                        <span className="badge bg-success rounded-pill">{formatNumber(device.count)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">Keine Gerätedaten verfügbar</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hinweis */}
        <div className="alert alert-info">
          <h6 className="alert-heading">DSGVO-Hinweis</h6>
          <p className="mb-0">
            Alle Analytics-Daten sind anonymisiert und aggregiert. Es werden keine persönlichen Daten gespeichert oder angezeigt.
            Die Daten werden automatisch nach einem Jahr gelöscht.
          </p>
        </div>
      </div>
    </div>
  );
} 