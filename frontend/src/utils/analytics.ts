import { getApiUrl } from './api';

// DSGVO-konformes Event-Tracking
export class AnalyticsTracker {
  private static instance: AnalyticsTracker;
  private employerId: string | null = null;

  private constructor() {}

  static getInstance(): AnalyticsTracker {
    if (!AnalyticsTracker.instance) {
      AnalyticsTracker.instance = new AnalyticsTracker();
    }
    return AnalyticsTracker.instance;
  }

  // Employer ID setzen (nach Login)
  setEmployer(employerId: string) {
    this.employerId = employerId;
  }

  // Event tracking
  async trackEvent(
    eventType: 'job_view' | 'cv_view' | 'cv_click' | 'application_started' | 'application_completed',
    options: {
      jobId?: string;
      cvId?: string;
      employerId?: string;
    } = {}
  ): Promise<void> {
    try {
      const finalEmployerId = options.employerId || this.employerId;
      
      if (!finalEmployerId) {
        console.warn('Analytics: Keine Employer-ID verfügbar für Event-Tracking');
        return;
      }

      // Nur für bestimmte Events tracken
      const response = await fetch(`${getApiUrl()}/api/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventType,
          employerId: finalEmployerId,
          jobId: options.jobId,
          cvId: options.cvId
        })
      });

      if (!response.ok) {
        throw new Error(`Analytics tracking failed: ${response.status}`);
      }

      console.log(`Analytics: Event "${eventType}" tracked successfully`);
    } catch (error) {
      console.error('Analytics tracking error:', error);
      // Fehler nicht nach oben propagieren, um UX nicht zu beeinträchtigen
    }
  }

  // Job-View tracking
  trackJobView(jobId: string, employerId?: string): void {
    this.trackEvent('job_view', { jobId, employerId });
  }

  // CV-View tracking
  trackCVView(cvId: string, employerId?: string): void {
    this.trackEvent('cv_view', { cvId, employerId });
  }

  // CV-Click tracking
  trackCVClick(cvId: string, employerId?: string): void {
    this.trackEvent('cv_click', { cvId, employerId });
  }

  // Application tracking
  trackApplicationStarted(jobId: string, employerId?: string): void {
    this.trackEvent('application_started', { jobId, employerId });
  }

  trackApplicationCompleted(jobId: string, employerId?: string): void {
    this.trackEvent('application_completed', { jobId, employerId });
  }
}

// Singleton-Export
export const analytics = AnalyticsTracker.getInstance();

// Hook für React-Komponenten
export function useAnalytics(employerId?: string) {
  if (employerId) {
    analytics.setEmployer(employerId);
  }
  
  return {
    trackJobView: (jobId: string) => analytics.trackJobView(jobId, employerId),
    trackCVView: (cvId: string) => analytics.trackCVView(cvId, employerId),
    trackCVClick: (cvId: string) => analytics.trackCVClick(cvId, employerId),
    trackApplicationStarted: (jobId: string) => analytics.trackApplicationStarted(jobId, employerId),
    trackApplicationCompleted: (jobId: string) => analytics.trackApplicationCompleted(jobId, employerId)
  };
} 