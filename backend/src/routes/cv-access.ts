import express, { Response } from "express";
import { authenticateJWT, AuthRequest } from "../middleware/auth";
import User from "../models/User";
import SucheEinenJob from "../models/suche-einen-job";
import { withDB } from "../db/connection";

const router = express.Router();

// Lebensläufe abrufen (nur für bezahlte Arbeitgeber)
router.get("/resumes", authenticateJWT, async (req: AuthRequest, res: Response) => {
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

    // Prüfe, ob Benutzer ein gültiges Paket hat
    if (!user.premiumFeatures?.premiumBis || new Date() > user.premiumFeatures.premiumBis) {
      return res.status(403).json({ 
        message: "Kein gültiges Paket. Bitte upgraden Sie Ihr Konto.",
        requiresUpgrade: true 
      });
    }

    // Prüfe CV-Zugriffs-Limit
    if (user.premiumFeatures.cvAccessLimit !== -1 && 
        user.premiumFeatures.cvAccessCount >= user.premiumFeatures.cvAccessLimit) {
      return res.status(403).json({ 
        message: "CV-Zugriff-Limit erreicht",
        limit: user.premiumFeatures.cvAccessLimit,
        used: user.premiumFeatures.cvAccessCount
      });
    }

    // Hole Lebensläufe basierend auf Paket-Typ
    const query: any = { 
      status: 'aktiv',
      expiresAt: { $gt: new Date() }
    };

    // Anonymisierte vs. vollständige Lebensläufe
    const projection = user.premiumFeatures.anonymizedCVOnly 
      ? { 
          titel: 1, beruf: 1, erfahrung: 1, mobilitaet: 1, 
          kategorie: 1, standort: 1, beschreibung: 1,
          // Kontaktdaten ausblenden für anonymisierte Ansicht
          lebenslauf: 0, kontaktEmail: 0, kontaktTelefon: 0
        }
      : {}; // Vollständige Daten

    const resumes = await withDB(async () => {
      return await SucheEinenJob.find(query, projection)
        .sort({ erstelltAm: -1 })
        .limit(50)
        .populate('ersteller', 'vorname nachname');
    });

    return res.json({
      resumes,
      accessInfo: {
        limit: user.premiumFeatures.cvAccessLimit,
        used: user.premiumFeatures.cvAccessCount,
        anonymizedOnly: user.premiumFeatures.anonymizedCVOnly
      }
    });

  } catch (error) {
    console.error("Fehler beim Abrufen der Lebensläufe:", error);
    return res.status(500).json({ message: "Fehler beim Abrufen der Lebensläufe", error });
  }
});

// Vollständigen Lebenslauf abrufen (erhöht Counter)
router.get("/resume/:id", authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const resumeId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }

    const user = await withDB(async () => {
      return await User.findById(userId);
    });

    if (!user || user.accountTyp !== 'arbeitgeber') {
      return res.status(403).json({ message: "Zugriff nur für Arbeitgeber" });
    }

    // Prüfe gültiges Paket
    if (!user.premiumFeatures?.premiumBis || new Date() > user.premiumFeatures.premiumBis) {
      return res.status(403).json({ 
        message: "Kein gültiges Paket",
        requiresUpgrade: true 
      });
    }

    // Prüfe CV-Zugriffs-Limit
    if (user.premiumFeatures.cvAccessLimit !== -1 && 
        user.premiumFeatures.cvAccessCount >= user.premiumFeatures.cvAccessLimit) {
      return res.status(403).json({ 
        message: "CV-Zugriff-Limit erreicht"
      });
    }

    // Hole vollständigen Lebenslauf
    const resume = await withDB(async () => {
      return await SucheEinenJob.findById(resumeId)
        .populate('ersteller', 'vorname nachname email');
    });

    if (!resume) {
      return res.status(404).json({ message: "Lebenslauf nicht gefunden" });
    }

    // Erhöhe Counter nur bei vollständigem Zugriff
    if (!user.premiumFeatures.anonymizedCVOnly) {
      user.premiumFeatures.cvAccessCount += 1;
      await user.save();
    }

    return res.json({
      resume,
      accessInfo: {
        limit: user.premiumFeatures.cvAccessLimit,
        used: user.premiumFeatures.cvAccessCount,
        remainingAccess: user.premiumFeatures.cvAccessLimit === -1 
          ? -1 
          : user.premiumFeatures.cvAccessLimit - user.premiumFeatures.cvAccessCount
      }
    });

  } catch (error) {
    console.error("Fehler beim Abrufen des Lebenslaufs:", error);
    return res.status(500).json({ message: "Fehler beim Abrufen des Lebenslaufs", error });
  }
});

// Zugriffsstatus prüfen
router.get("/check", authenticateJWT, async (req: AuthRequest, res: Response) => {
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

    // Prüfe gültiges Paket
    const hasValidPackage = user.premiumFeatures?.premiumBis && 
                           new Date() <= user.premiumFeatures.premiumBis;

    if (!hasValidPackage) {
      return res.status(403).json({ 
        message: "Kein gültiges Paket",
        requiresUpgrade: true 
      });
    }

    return res.json({
      hasAccess: true,
      accessInfo: {
        limit: user.premiumFeatures.cvAccessLimit,
        used: user.premiumFeatures.cvAccessCount,
        anonymizedOnly: user.premiumFeatures.anonymizedCVOnly,
        packageId: user.premiumFeatures.currentPackageId,
        expiresAt: user.premiumFeatures.premiumBis
      }
    });

  } catch (error) {
    console.error("Fehler bei der Zugriffsprüfung:", error);
    return res.status(500).json({ message: "Fehler bei der Zugriffsprüfung", error });
  }
});

export default router; 