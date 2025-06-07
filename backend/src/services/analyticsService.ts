import { AnalyticsEvent, AnalyticsAggregated, IAnalyticsEvent } from '../models/Analytics';
import { withDB } from '../db/connection';
import StellenanzeigenAufgeben from '../models/stellenanzeigen-aufgeben';

// Event tracking (DSGVO-konform)
export async function trackEvent(
  eventType: IAnalyticsEvent['eventType'],
  employerId: string,
  options: {
    jobId?: string;
    cvId?: string;
    userAgent?: string;
    referrer?: string;
    region?: string;
  }
) {
  try {
    // Device-Type aus User-Agent ermitteln
    const deviceType = getDeviceType(options.userAgent);
    
    await withDB(async () => {
      const event = new AnalyticsEvent({
        eventType,
        jobId: options.jobId,
        cvId: options.cvId,
        employerId,
        timestamp: new Date(),
        metadata: {
          userAgent: options.userAgent,
          referrer: options.referrer,
          region: options.region,
          deviceType
        }
      });

      await event.save();
    });

    console.log(`Analytics Event tracked: ${eventType} for employer ${employerId}`);
  } catch (error) {
    console.error('Fehler beim Tracking von Analytics Event:', error);
  }
}

// Device-Type ermitteln
function getDeviceType(userAgent?: string): 'mobile' | 'desktop' | 'tablet' {
  if (!userAgent) return 'desktop';
  
  const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const tablet = /iPad|Android(?=.*Tablet)/i.test(userAgent);
  
  if (tablet) return 'tablet';
  if (mobile) return 'mobile';
  return 'desktop';
}

// Analytics-Daten für Dashboard abrufen
export async function getAnalyticsData(
  employerId: string,
  dateFrom: Date,
  dateTo: Date,
  jobId?: string
) {
  try {
    return await withDB(async () => {
      // Base filter
      const baseFilter: any = {
        employerId,
        timestamp: { $gte: dateFrom, $lte: dateTo }
      };

      if (jobId) {
        baseFilter.jobId = jobId;
      }

      // Gesamtstatistiken
      const totalStats = await AnalyticsEvent.aggregate([
        { $match: baseFilter },
        {
          $group: {
            _id: '$eventType',
            count: { $sum: 1 }
          }
        }
      ]);

      // Job-spezifische Statistiken
      const jobStats = await AnalyticsEvent.aggregate([
        { $match: { ...baseFilter, jobId: { $exists: true } } },
        {
          $group: {
            _id: '$jobId',
            views: {
              $sum: { $cond: [{ $eq: ['$eventType', 'job_view'] }, 1, 0] }
            },
            applications: {
              $sum: { $cond: [{ $eq: ['$eventType', 'application_completed'] }, 1, 0] }
            }
          }
        },
        {
          $lookup: {
            from: 'stellenanzeigenaufgaben',
            localField: '_id',
            foreignField: '_id',
            as: 'jobInfo'
          }
        }
      ]);

      // Region-Statistiken
      const regionStats = await AnalyticsEvent.aggregate([
        { $match: baseFilter },
        { $match: { 'metadata.region': { $exists: true, $ne: null } } },
        {
          $group: {
            _id: '$metadata.region',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      // Device-Statistiken
      const deviceStats = await AnalyticsEvent.aggregate([
        { $match: baseFilter },
        {
          $group: {
            _id: '$metadata.deviceType',
            count: { $sum: 1 }
          }
        }
      ]);

      // Zeitbasierte Statistiken (letzte 7 Tage)
      const timeStats = await AnalyticsEvent.aggregate([
        { $match: baseFilter },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
              eventType: '$eventType'
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.date': 1 } }
      ]);

      // Conversion Rate berechnen
      const totalJobViews = totalStats.find(s => s._id === 'job_view')?.count || 0;
      const totalApplications = totalStats.find(s => s._id === 'application_completed')?.count || 0;
      const conversionRate = totalJobViews > 0 ? (totalApplications / totalJobViews) * 100 : 0;

      return {
        summary: {
          totalJobViews,
          totalCVViews: totalStats.find(s => s._id === 'cv_view')?.count || 0,
          totalCVClicks: totalStats.find(s => s._id === 'cv_click')?.count || 0,
          totalApplicationsStarted: totalStats.find(s => s._id === 'application_started')?.count || 0,
          totalApplicationsCompleted: totalApplications,
          conversionRate: Math.round(conversionRate * 100) / 100
        },
        jobPerformance: jobStats.map((job: any) => ({
          jobId: job._id,
          jobTitle: job.jobInfo[0]?.titel || 'Unbekannt',
          views: job.views,
          applications: job.applications,
          conversionRate: job.views > 0 ? Math.round((job.applications / job.views) * 10000) / 100 : 0
        })),
        regionBreakdown: regionStats.map((region: any) => ({
          region: region._id,
          count: region.count
        })),
        deviceBreakdown: deviceStats.map((device: any) => ({
          device: device._id || 'unknown',
          count: device.count
        })),
        timeChart: timeStats,
        dateRange: {
          from: dateFrom,
          to: dateTo
        }
      };
    });

  } catch (error) {
    console.error('Fehler beim Abrufen der Analytics-Daten:', error);
    throw error;
  }
}

// Aggregierte Daten für bessere Performance berechnen (Cron-Job)
export async function aggregateAnalyticsData(date: Date) {
  try {
    await withDB(async () => {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Alle Employer mit Events an diesem Tag
      const employersWithEvents = await AnalyticsEvent.distinct('employerId', {
        timestamp: { $gte: startOfDay, $lte: endOfDay }
      });

      for (const employerId of employersWithEvents) {
        const analyticsData = await getAnalyticsData(employerId, startOfDay, endOfDay);

        // Upsert aggregierte Daten
        await AnalyticsAggregated.findOneAndUpdate(
          { employerId, date: startOfDay },
          {
            $set: {
              metrics: analyticsData.summary,
              jobBreakdown: analyticsData.jobPerformance,
              regionBreakdown: analyticsData.regionBreakdown
            }
          },
          { upsert: true, new: true }
        );
      }
    });

    console.log(`Analytics-Daten für ${date.toISOString().split('T')[0]} aggregiert`);
  } catch (error) {
    console.error('Fehler beim Aggregieren der Analytics-Daten:', error);
  }
} 