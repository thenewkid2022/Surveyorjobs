import express from "express";
import { authenticateJWT, AuthRequest } from "../middleware/auth";
import { withDB } from "../db/connection";
import StellenanzeigenAufgeben from "../models/stellenanzeigen-aufgeben";
import SucheEinenJob from "../models/suche-einen-job";

const router = express.Router();

// Dashboard-Statistiken abrufen
router.get("/stats", authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }

    const stats = await withDB(async () => {
      // Zähle aktive Stellenanzeigen des Benutzers
      const activeJobs = await StellenanzeigenAufgeben.countDocuments({
        ersteller: userId,
        status: 'aktiv',
        expiresAt: { $gt: new Date() }
      });

      // Zähle aktive "Suche einen Job" Inserate des Benutzers
      const activeSucheJobs = await SucheEinenJob.countDocuments({
        ersteller: userId,
        status: 'aktiv',
        expiresAt: { $gt: new Date() }
      });

      // Zähle alle verfügbaren Jobs (nicht abgelaufen)
      const totalAvailableJobs = await StellenanzeigenAufgeben.countDocuments({
        status: 'aktiv',
        expiresAt: { $gt: new Date() }
      });

      // Zähle alle verfügbaren "Suche einen Job" Inserate
      const totalAvailableSucheJobs = await SucheEinenJob.countDocuments({
        status: 'aktiv',
        expiresAt: { $gt: new Date() }
      });

      console.log('Dashboard Stats für Benutzer', userId, {
        activeJobs,
        activeSucheJobs,
        totalAvailableJobs,
        totalAvailableSucheJobs
      });

      return {
        activeApplications: activeJobs + activeSucheJobs,
        savedJobs: 0, // TODO: Implementiere gespeicherte Jobs
        totalJobs: totalAvailableJobs + totalAvailableSucheJobs
      };
    });

    return res.json(stats);
  } catch (error) {
    console.error("Fehler beim Abrufen der Dashboard-Statistiken:", error);
    return res.status(500).json({ message: "Fehler beim Abrufen der Dashboard-Statistiken", error });
  }
});

export default router; 