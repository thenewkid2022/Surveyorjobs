import { AnalyticsEvent } from '../models/Analytics';
import { withDB } from '../db/connection';
import User from '../models/User';
import StellenanzeigenAufgeben from '../models/stellenanzeigen-aufgeben';

async function createAnalyticsTestData() {
  try {
    console.log("🔧 Erstelle Analytics-Testdaten...");

    await withDB(async () => {
      // Finde einen Arbeitgeber mit Enterprise-Paket
      const employer = await User.findOne({
        accountTyp: 'arbeitgeber',
        'premiumFeatures.hasAnalytics': true
      });

      if (!employer) {
        console.log("❌ Kein Arbeitgeber mit Analytics-Zugriff gefunden");
        console.log("   Tipp: Erstelle einen Arbeitgeber und buche das Enterprise-Paket");
        return;
      }

      console.log(`✅ Arbeitgeber gefunden: ${employer.firmenname || employer.email}`);

      // Finde Stellenanzeigen des Arbeitgebers
      const jobs = await StellenanzeigenAufgeben.find({
        ersteller: employer._id,
        status: 'aktiv'
      }).limit(3);

      if (jobs.length === 0) {
        console.log("❌ Keine aktiven Stellenanzeigen gefunden");
        return;
      }

      console.log(`✅ ${jobs.length} Stellenanzeigen gefunden`);

      // Erstelle Testdaten für die letzten 30 Tage
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const events = [];

      // Generiere zufällige Events
      for (let i = 0; i < 30; i++) {
        const eventDate = new Date(thirtyDaysAgo);
        eventDate.setDate(eventDate.getDate() + i);

        // Job-Views (5-20 pro Tag)
        const jobViews = Math.floor(Math.random() * 15) + 5;
        for (let j = 0; j < jobViews; j++) {
          const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
          events.push({
            eventType: 'job_view',
            jobId: randomJob._id.toString(),
            employerId: employer._id.toString(),
            timestamp: new Date(eventDate.getTime() + Math.random() * 24 * 60 * 60 * 1000),
            metadata: {
              region: ['ZH', 'BE', 'LU', 'SG', 'AG'][Math.floor(Math.random() * 5)],
              deviceType: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)]
            }
          });
        }

        // CV-Views (2-8 pro Tag)
        const cvViews = Math.floor(Math.random() * 6) + 2;
        for (let j = 0; j < cvViews; j++) {
          events.push({
            eventType: 'cv_view',
            cvId: `cv_${Math.random().toString(36).substr(2, 9)}`,
            employerId: employer._id.toString(),
            timestamp: new Date(eventDate.getTime() + Math.random() * 24 * 60 * 60 * 1000),
            metadata: {
              region: ['ZH', 'BE', 'LU', 'SG', 'AG'][Math.floor(Math.random() * 5)],
              deviceType: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)]
            }
          });
        }

        // CV-Clicks (1-4 pro Tag)
        const cvClicks = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < cvClicks; j++) {
          events.push({
            eventType: 'cv_click',
            cvId: `cv_${Math.random().toString(36).substr(2, 9)}`,
            employerId: employer._id.toString(),
            timestamp: new Date(eventDate.getTime() + Math.random() * 24 * 60 * 60 * 1000),
            metadata: {
              region: ['ZH', 'BE', 'LU', 'SG', 'AG'][Math.floor(Math.random() * 5)],
              deviceType: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)]
            }
          });
        }

        // Applications (0-3 pro Tag)
        const applications = Math.floor(Math.random() * 3);
        for (let j = 0; j < applications; j++) {
          const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
          
          // Application started
          events.push({
            eventType: 'application_started',
            jobId: randomJob._id.toString(),
            employerId: employer._id.toString(),
            timestamp: new Date(eventDate.getTime() + Math.random() * 24 * 60 * 60 * 1000),
            metadata: {
              region: ['ZH', 'BE', 'LU', 'SG', 'AG'][Math.floor(Math.random() * 5)],
              deviceType: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)]
            }
          });

          // 80% der gestarteten Bewerbungen werden auch abgeschlossen
          if (Math.random() > 0.2) {
            events.push({
              eventType: 'application_completed',
              jobId: randomJob._id.toString(),
              employerId: employer._id.toString(),
              timestamp: new Date(eventDate.getTime() + Math.random() * 24 * 60 * 60 * 1000),
              metadata: {
                region: ['ZH', 'BE', 'LU', 'SG', 'AG'][Math.floor(Math.random() * 5)],
                deviceType: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)]
              }
            });
          }
        }
      }

      // Lösche alte Testdaten
      await AnalyticsEvent.deleteMany({
        employerId: employer._id.toString()
      });

      // Füge neue Testdaten hinzu
      await AnalyticsEvent.insertMany(events);

      console.log(`✅ ${events.length} Analytics-Events erstellt`);
      console.log("\n📊 Übersicht der erstellten Events:");
      
      const eventSummary = events.reduce((acc: any, event) => {
        acc[event.eventType] = (acc[event.eventType] || 0) + 1;
        return acc;
      }, {});

      Object.entries(eventSummary).forEach(([type, count]) => {
        console.log(`   ${type}: ${count} Events`);
      });

      console.log(`\n🎯 Analytics-Dashboard URL: /dashboard/analytics`);
      console.log(`📧 Arbeitgeber-Email: ${employer.email}`);
    });

    console.log("\n🎉 Analytics-Testdaten erfolgreich erstellt!");
    process.exit(0);

  } catch (error) {
    console.error("❌ Fehler beim Erstellen der Analytics-Testdaten:", error);
    process.exit(1);
  }
}

// Skript ausführen, wenn direkt aufgerufen
if (require.main === module) {
  createAnalyticsTestData();
}

export default createAnalyticsTestData; 