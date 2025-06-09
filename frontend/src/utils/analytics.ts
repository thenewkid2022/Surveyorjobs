import { getApiUrl } from './api';

/**
 * ✅ KORRIGIERTE Analytics-Implementierung für Enterprise-Pakete
 * 
 * 🎯 WIE ES JETZT RICHTIG FUNKTIONIERT:
 * 
 * 1. JOB-EVENTS (für alle Benutzer → Job-Besitzer bekommt die Statistiken):
 *    - job_view: Wenn JEDER (Bewerber/Arbeitgeber) einen Job anschaut
 *    - application_started: Wenn JEDER auf "Bewerben" klickt
 *    → Diese Events werden automatisch dem JOB-BESITZER zugeordnet
 *    → Der Arbeitgeber sieht, wie oft SEINE Jobs angeschaut/beworben werden
 * 
 * 2. EMPLOYER-EVENTS (nur für Arbeitgeber → eigene Aktivität):
 *    - cv_view: Wenn der ARBEITGEBER CVs anschaut
 *    - cv_click: Wenn der ARBEITGEBER Kontakt zu CV-Erstellern aufnimmt
 *    → Diese Events zeigen die eigene Aktivität des Arbeitgebers
 * 
 * 📊 BEISPIEL für einen Arbeitgeber mit Enterprise-Paket:
 *    - Seine Job-Anzeige wird 50x angeschaut (von verschiedenen Bewerbern)
 *    - 5 Bewerber klicken auf "Bewerben" (conversion rate: 10%)
 *    - Er schaut sich 20 CVs an
 *    - Er kontaktiert 8 Kandidaten
 * 
 * 🔒 ZUGRIFF: Nur Arbeitgeber mit Enterprise/Unlimited-Paketen sehen diese Daten
 * 🛡️ DSGVO: Keine persönlichen Daten, nur anonymisierte Metriken
 */

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

  // Job-Event tracking (wird dem Job-Besitzer zugeordnet, egal wer es auslöst)
  async trackJobEvent(
    eventType: 'job_view' | 'application_started' | 'application_completed',
    jobId: string
  ): Promise<void> {
    try {
      const response = await fetch(`${getApiUrl()}/api/analytics/track-job`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventType,
          jobId
        })
      });

      if (!response.ok) {
        throw new Error(`Job analytics tracking failed: ${response.status}`);
      }

      console.log(`Analytics: Job Event "${eventType}" tracked for job ${jobId}`);
    } catch (error) {
      console.error('Job analytics tracking error:', error);
      // Fehler nicht nach oben propagieren, um UX nicht zu beeinträchtigen
    }
  }

  // Employer-Event tracking (nur für Arbeitgeber, für ihre eigene Aktivität)
  async trackEmployerEvent(
    eventType: 'cv_view' | 'cv_click',
    options: {
      cvId?: string;
      employerId?: string;
    } = {}
  ): Promise<void> {
    try {
      const finalEmployerId = options.employerId || this.employerId;
      
      if (!finalEmployerId) {
        console.warn('Analytics: Keine Employer-ID verfügbar für Employer-Event-Tracking');
        return;
      }

      const response = await fetch(`${getApiUrl()}/api/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventType,
          employerId: finalEmployerId,
          cvId: options.cvId
        })
      });

      if (!response.ok) {
        throw new Error(`Employer analytics tracking failed: ${response.status}`);
      }

      console.log(`Analytics: Employer Event "${eventType}" tracked successfully`);
    } catch (error) {
      console.error('Employer analytics tracking error:', error);
      // Fehler nicht nach oben propagieren, um UX nicht zu beeinträchtigen
    }
  }

  // Job-View tracking (für alle Benutzer)
  trackJobView(jobId: string): void {
    this.trackJobEvent('job_view', jobId);
  }

  // Application tracking (für alle Benutzer)
  trackApplicationStarted(jobId: string): void {
    this.trackJobEvent('application_started', jobId);
  }

  trackApplicationCompleted(jobId: string): void {
    this.trackJobEvent('application_completed', jobId);
  }

  // CV-Tracking (nur für Arbeitgeber)
  trackCVView(cvId: string, employerId?: string): void {
    this.trackEmployerEvent('cv_view', { cvId, employerId });
  }

  trackCVClick(cvId: string, employerId?: string): void {
    this.trackEmployerEvent('cv_click', { cvId, employerId });
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
    // Job-Events (für alle Benutzer, werden dem Job-Besitzer zugeordnet)
    trackJobView: (jobId: string) => analytics.trackJobView(jobId),
    trackApplicationStarted: (jobId: string) => analytics.trackApplicationStarted(jobId),
    trackApplicationCompleted: (jobId: string) => analytics.trackApplicationCompleted(jobId),
    // Employer-Events (nur für Arbeitgeber, für ihre eigene Aktivität)
    trackCVView: (cvId: string) => analytics.trackCVView(cvId, employerId),
    trackCVClick: (cvId: string) => analytics.trackCVClick(cvId, employerId)
  };
} 