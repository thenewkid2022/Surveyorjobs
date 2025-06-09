import { useGoogleAnalytics } from '@/app/components/GoogleAnalytics';
import { analytics } from './analytics';

// Enhanced Analytics - kombiniert internes System mit Google Analytics
export class EnhancedAnalytics {
  private googleAnalytics: ReturnType<typeof useGoogleAnalytics> | null = null;

  constructor(googleAnalytics?: ReturnType<typeof useGoogleAnalytics>) {
    this.googleAnalytics = googleAnalytics || null;
  }

  // Job View Tracking
  trackJobView(jobId: string, jobTitle?: string) {
    // Internes System (für Enterprise Analytics)
    analytics.trackJobView(jobId);
    
    // Google Analytics (nur wenn Einwilligung erteilt)
    if (this.googleAnalytics?.isEnabled) {
      this.googleAnalytics.trackEvent('view_item', {
        item_id: jobId,
        item_name: jobTitle || 'Job',
        item_category: 'job_listing',
        content_type: 'job'
      });
    }
  }

  // Application Started
  trackApplicationStarted(jobId: string, jobTitle?: string) {
    // Internes System
    analytics.trackApplicationStarted(jobId);
    
    // Google Analytics
    if (this.googleAnalytics?.isEnabled) {
      this.googleAnalytics.trackEvent('begin_checkout', {
        item_id: jobId,
        item_name: jobTitle || 'Job',
        item_category: 'job_application',
        content_type: 'application'
      });
    }
  }

  // Application Completed
  trackApplicationCompleted(jobId: string, jobTitle?: string) {
    // Internes System
    analytics.trackApplicationCompleted(jobId);
    
    // Google Analytics
    if (this.googleAnalytics?.isEnabled) {
      this.googleAnalytics.trackEvent('purchase', {
        transaction_id: `app_${jobId}_${Date.now()}`,
        item_id: jobId,
        item_name: jobTitle || 'Job',
        item_category: 'job_application',
        content_type: 'application'
      });
    }
  }

  // CV View (nur für Arbeitgeber)
  trackCVView(cvId: string, employerId?: string) {
    // Internes System
    analytics.trackCVView(cvId, employerId);
    
    // Google Analytics
    if (this.googleAnalytics?.isEnabled) {
      this.googleAnalytics.trackEvent('view_item', {
        item_id: cvId,
        item_category: 'cv',
        content_type: 'cv_view'
      });
    }
  }

  // CV Contact (nur für Arbeitgeber)
  trackCVClick(cvId: string, employerId?: string) {
    // Internes System
    analytics.trackCVClick(cvId, employerId);
    
    // Google Analytics
    if (this.googleAnalytics?.isEnabled) {
      this.googleAnalytics.trackEvent('contact', {
        item_id: cvId,
        item_category: 'cv',
        content_type: 'cv_contact'
      });
    }
  }

  // Page Views
  trackPageView(pagePath: string, pageTitle?: string) {
    if (this.googleAnalytics?.isEnabled) {
      this.googleAnalytics.trackPageView(pagePath);
      
      if (pageTitle) {
        this.googleAnalytics.trackEvent('page_view', {
          page_title: pageTitle,
          page_location: window.location.href,
          page_path: pagePath
        });
      }
    }
  }

  // Search Events
  trackSearch(searchTerm: string, category?: string) {
    if (this.googleAnalytics?.isEnabled) {
      this.googleAnalytics.trackEvent('search', {
        search_term: searchTerm,
        content_category: category || 'jobs'
      });
    }
  }

  // User Engagement
  trackEngagement(eventName: string, parameters?: Record<string, any>) {
    if (this.googleAnalytics?.isEnabled) {
      this.googleAnalytics.trackEvent(eventName, {
        engagement_time_msec: 1000,
        ...parameters
      });
    }
  }
}

// Hook für Enhanced Analytics
export function useEnhancedAnalytics() {
  const googleAnalytics = useGoogleAnalytics();
  
  return new EnhancedAnalytics(googleAnalytics);
} 