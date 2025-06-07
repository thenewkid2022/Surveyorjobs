import express, { Request, Response } from "express";
import { authenticateJWT, AuthRequest } from "../middleware/auth";
import { getAnalyticsData, trackEvent } from "../services/analyticsService";
import User from "../models/User";
import { withDB } from "../db/connection";

const router = express.Router();

// Middleware: Prüfe Analytics-Zugriff (Enterprise/Unlimited)
const requireAnalyticsAccess = async (req: AuthRequest, res: Response, next: any) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }

    const user = await withDB(async () => {
      return await User.findById(userId);
    });

    if (!user || user.accountTyp !== 'arbeitgeber') {
      return res.status(403).json({ message: "Zugriff nur für Arbeitgeber" });
    }

    // Prüfe Analytics-Berechtigung
    const hasAnalyticsAccess = user.premiumFeatures?.hasAnalytics && 
                              user.premiumFeatures?.premiumBis && 
                              new Date() <= user.premiumFeatures.premiumBis;

    if (!hasAnalyticsAccess) {
      return res.status(403).json({ 
        message: "Analytics-Dashboard nur für Enterprise/Unlimited-Pakete verfügbar",
        requiresUpgrade: true,
        currentPackage: user.premiumFeatures?.currentPackageId || 'none'
      });
    }

    req.user = { ...req.user, employer: user };
    next();
  } catch (error) {
    console.error("Fehler bei Analytics-Zugriffsprüfung:", error);
    return res.status(500).json({ message: "Fehler bei der Zugriffsprüfung" });
  }
};

// Analytics-Dashboard-Daten abrufen
router.get("/dashboard", authenticateJWT, requireAnalyticsAccess, async (req: AuthRequest, res: Response) => {
  try {
    const employerId = req.user?.userId!;
    const { dateFrom, dateTo, jobId } = req.query;

    // Standardzeitraum: letzte 30 Tage
    const defaultDateTo = new Date();
    const defaultDateFrom = new Date();
    defaultDateFrom.setDate(defaultDateFrom.getDate() - 30);

    const fromDate = dateFrom ? new Date(dateFrom as string) : defaultDateFrom;
    const toDate = dateTo ? new Date(dateTo as string) : defaultDateTo;

    // Validierung der Datumsangaben
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ message: "Ungültige Datumsangaben" });
    }

    if (fromDate >= toDate) {
      return res.status(400).json({ message: "Startdatum muss vor Enddatum liegen" });
    }

    const analyticsData = await getAnalyticsData(
      employerId,
      fromDate,
      toDate,
      jobId as string
    );

    return res.json({
      success: true,
      data: analyticsData,
      meta: {
        dateRange: {
          from: fromDate.toISOString(),
          to: toDate.toISOString()
        },
        totalDays: Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)),
        jobFilter: jobId || null
      }
    });

  } catch (error) {
    console.error("Fehler beim Abrufen der Analytics-Daten:", error);
    return res.status(500).json({ 
      message: "Fehler beim Abrufen der Analytics-Daten",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Event-Tracking Endpoint (für Frontend-Tracking)
router.post("/track", async (req: Request, res: Response) => {
  try {
    const { eventType, employerId, jobId, cvId } = req.body;

    if (!eventType || !employerId) {
      return res.status(400).json({ message: "eventType und employerId sind erforderlich" });
    }

    // Validiere Event-Typ
    const validEventTypes = ['job_view', 'cv_view', 'cv_click', 'application_started', 'application_completed'];
    if (!validEventTypes.includes(eventType)) {
      return res.status(400).json({ message: "Ungültiger Event-Typ" });
    }

    // DSGVO: Keine IP-Adresse speichern, nur Region ermitteln
    const userAgent = req.headers['user-agent'];
    const referrer = req.headers.referer;
    
    // Region aus Accept-Language Header (falls verfügbar)
    const acceptLanguage = req.headers['accept-language'];
    const region = acceptLanguage ? acceptLanguage.split(',')[0].split('-')[1] : undefined;

    await trackEvent(eventType, employerId, {
      jobId,
      cvId,
      userAgent,
      referrer,
      region
    });

    return res.json({ success: true, message: "Event erfolgreich getracked" });

  } catch (error) {
    console.error("Fehler beim Tracking des Events:", error);
    return res.status(500).json({ message: "Fehler beim Event-Tracking" });
  }
});

// Analytics-Übersicht für Dashboard-Widget
router.get("/summary", authenticateJWT, requireAnalyticsAccess, async (req: AuthRequest, res: Response) => {
  try {
    const employerId = req.user?.userId!;
    
    // Letzte 7 Tage
    const dateTo = new Date();
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - 7);

    const analyticsData = await getAnalyticsData(employerId, dateFrom, dateTo);

    return res.json({
      success: true,
      summary: analyticsData.summary,
      period: '7d'
    });

  } catch (error) {
    console.error("Fehler beim Abrufen der Analytics-Übersicht:", error);
    return res.status(500).json({ message: "Fehler beim Abrufen der Analytics-Übersicht" });
  }
});

// Export für bessere Testbarkeit
export { requireAnalyticsAccess };
export default router; 