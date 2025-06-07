import mongoose, { Schema, Document } from 'mongoose';

// Analytics Event für Tracking
export interface IAnalyticsEvent extends Document {
  eventType: 'job_view' | 'cv_view' | 'cv_click' | 'application_started' | 'application_completed';
  jobId?: string;
  cvId?: string;
  employerId: string;
  timestamp: Date;
  metadata: {
    userAgent?: string;
    referrer?: string;
    region?: string;
    deviceType?: 'mobile' | 'desktop' | 'tablet';
  };
  // DSGVO: Keine persönlichen Daten, nur anonymisierte Metriken
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>({
  eventType: {
    type: String,
    required: true,
    enum: ['job_view', 'cv_view', 'cv_click', 'application_started', 'application_completed']
  },
  jobId: {
    type: String,
    ref: 'StellenanzeigenAufgeben'
  },
  cvId: {
    type: String,
    ref: 'SucheEinenJob'
  },
  employerId: {
    type: String,
    required: true,
    ref: 'User'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 365 * 24 * 60 * 60 // Auto-delete nach 1 Jahr (DSGVO)
  },
  metadata: {
    userAgent: String,
    referrer: String,
    region: String,
    deviceType: {
      type: String,
      enum: ['mobile', 'desktop', 'tablet']
    }
  }
}, {
  timestamps: true,
  collection: 'analytics_events'
});

// Indexes für Performance
AnalyticsEventSchema.index({ employerId: 1, timestamp: -1 });
AnalyticsEventSchema.index({ jobId: 1, timestamp: -1 });
AnalyticsEventSchema.index({ eventType: 1, timestamp: -1 });

// Aggregierte Analytics-Daten für bessere Performance
export interface IAnalyticsAggregated extends Document {
  employerId: string;
  date: Date;
  metrics: {
    totalJobViews: number;
    totalCVViews: number;
    totalCVClicks: number;
    totalApplicationsStarted: number;
    totalApplicationsCompleted: number;
    conversionRate: number; // applications_completed / job_views
    uniqueJobViews: number;
  };
  jobBreakdown: Array<{
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
}

const AnalyticsAggregatedSchema = new Schema<IAnalyticsAggregated>({
  employerId: {
    type: String,
    required: true,
    ref: 'User'
  },
  date: {
    type: Date,
    required: true
  },
  metrics: {
    totalJobViews: { type: Number, default: 0 },
    totalCVViews: { type: Number, default: 0 },
    totalCVClicks: { type: Number, default: 0 },
    totalApplicationsStarted: { type: Number, default: 0 },
    totalApplicationsCompleted: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    uniqueJobViews: { type: Number, default: 0 }
  },
  jobBreakdown: [{
    jobId: String,
    jobTitle: String,
    views: Number,
    applications: Number,
    conversionRate: Number
  }],
  regionBreakdown: [{
    region: String,
    count: Number
  }]
}, {
  timestamps: true,
  collection: 'analytics_aggregated'
});

// Compound Index für Employer + Date
AnalyticsAggregatedSchema.index({ employerId: 1, date: -1 }, { unique: true });

export const AnalyticsEvent = mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);
export const AnalyticsAggregated = mongoose.model<IAnalyticsAggregated>('AnalyticsAggregated', AnalyticsAggregatedSchema); 