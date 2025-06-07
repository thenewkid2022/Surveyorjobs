import express, { Request, Response } from "express";
import SucheEinenJob from "../models/suche-einen-job";
import User from "../models/User";
import { authenticateJWT, AuthRequest } from "../middleware/auth";
import { ortschaftZuKanton } from "@shared/lib/kantone";
import { berufe } from "@shared/lib/berufe";
import { withDB } from "../db/connection";

const router = express.Router();

// Kategorie-Mapping von URL-Schlüsseln zu vollständigen Namen
const kategorieMapping: { [key: string]: string } = {
  'hochbau': 'Hochbau',
  'tiefbau': 'Tiefbau',
  'ausbau': 'Ausbau',
  'planung': 'Planung & Technik',
  'weitere': 'Weitere Berufe'
};

// Alle Jobs abrufen (öffentlich)
router.get("/", async (req: Request, res: Response) => {
  try {
    console.log("Abrufen aller 'Suche einen Job' Einträge");
    
    const jobs = await withDB(async () => {
      // Für öffentliche Ansicht: Lebensläufe und Kontaktdaten ausblenden
      // Nur Arbeitgeber mit bezahltem Paket können diese Daten sehen
      return await SucheEinenJob.find(
        { 
          status: 'aktiv',
          expiresAt: { $gt: new Date() }
        },
        {
          // Sensible Daten ausblenden für öffentliche Ansicht
          lebenslauf: 0,
          kontaktEmail: 0, 
          kontaktTelefon: 0,
          anschreiben: 0
        }
      ).sort({ erstelltAm: -1 });
    });

    console.log(`${jobs.length} 'Suche einen Job' Einträge gefunden`);
    return res.json({
      jobs,
      message: "Kontaktdaten und Lebensläufe nur für Arbeitgeber mit bezahltem Paket sichtbar"
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der 'Suche einen Job' Einträge:", error);
    return res.status(500).json({ message: "Fehler beim Abrufen der Jobs", error });
  }
});

// Eigene Stellengesuche abrufen (authentifiziert)
router.get("/meine", authenticateJWT, async (req: AuthRequest, res: Response) => {
  console.log('Anfrage an /meine Route erhalten');
  console.log('Request Headers:', req.headers);
  console.log('Auth Token:', req.headers.authorization);

  try {
    const userId = req.user?.userId;
    console.log('Extrahierte User ID:', userId);
    
    if (!userId) {
      console.log('Keine User ID gefunden, sende 401');
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }

    console.log('Suche Stellengesuche für Benutzer:', userId);

    const result = await withDB(async () => {
      // Zuerst alle Stellengesuche des Benutzers finden
      const alleStellengesuche = await SucheEinenJob.find({ ersteller: userId });
      console.log('Alle Stellengesuche des Benutzers:', {
        anzahl: alleStellengesuche.length,
        stellengesuche: alleStellengesuche.map(s => ({
          id: s._id,
          beruf: s.beruf,
          status: s.status,
          expiresAt: s.expiresAt,
          erstelltAm: s.erstelltAm
        }))
      });

      // Dann die gefilterten Stellengesuche
      const stellengesuche = await SucheEinenJob
        .find({
          ersteller: userId,
          status: 'aktiv',
          expiresAt: { $gt: new Date() }
        })
        .sort({ erstelltAm: -1 });

      console.log('Gefilterte Stellengesuche (aktiv und nicht abgelaufen):', {
        anzahl: stellengesuche.length,
        stellengesuche: stellengesuche.map(s => ({
          id: s._id,
          beruf: s.beruf,
          status: s.status,
          expiresAt: s.expiresAt,
          erstelltAm: s.erstelltAm
        }))
      });

      // Zähle Stellengesuche nach Status
      const statusCounts = await SucheEinenJob.aggregate([
        { $match: { ersteller: userId } },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]);
      console.log('Stellengesuche nach Status:', statusCounts);

      // Zähle abgelaufene Stellengesuche
      const abgelaufeneCount = await SucheEinenJob.countDocuments({
        ersteller: userId,
        expiresAt: { $lte: new Date() }
      });
      console.log('Anzahl abgelaufener Stellengesuche:', abgelaufeneCount);

      return {
        stellengesuche,
        total: stellengesuche.length,
        stats: {
          total: alleStellengesuche.length,
          active: stellengesuche.length,
          expired: abgelaufeneCount,
          byStatus: statusCounts
        }
      };
    });

    return res.json(result);
  } catch (error) {
    console.error('Fehler beim Abrufen der Stellengesuche:', error);
    return res.status(500).json({ message: "Fehler beim Abrufen der Stellengesuche", error });
  }
});

// Einzelnen Job abrufen
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const job = await withDB(async () => {
      return await SucheEinenJob.findById(req.params.id);
    });

    if (!job) {
      return res.status(404).json({ message: "Job nicht gefunden" });
    }
    return res.json(job);
  } catch (error) {
    return res.status(500).json({ message: "Fehler beim Abrufen des Jobs", error });
  }
});

// Neuen Job anlegen (authentifiziert)
router.post("/", authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }

    const data = req.body;
    const erstelltAm = new Date();
    const expiresAt = new Date(erstelltAm.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Wenn ein Benutzer authentifiziert ist, prüfe Premium-Status
    const user = await User.findById(userId);
    if (user) {
      // Wenn der Benutzer Premium ist, setze Hervorhebung
      if (user.premiumFeatures?.lebenslaufHervorgehoben) {
        data.hervorgehoben = true;
      }
      
      // Wenn der Benutzer einen gespeicherten Lebenslauf hat, verwende diesen
      if (user.lebenslauf && !data.lebenslauf) {
        data.lebenslauf = user.lebenslauf;
      }
    }

    // Finde die Kategorie basierend auf dem Beruf
    if (data.beruf) {
      const beruf = berufe.find(b => b.titel === data.beruf);
      if (beruf) {
        data.kategorie = beruf.kategorie;
      } else {
        return res.status(400).json({ message: "Ungültiger Beruf" });
      }
    }

    // Wenn keine Kategorie gefunden wurde, versuche die übergebene Kategorie zu verwenden
    if (!data.kategorie && req.body.kategorie) {
      const kategorieKey = req.body.kategorie.toLowerCase();
      const kategorie = kategorieMapping[kategorieKey];
      if (kategorie) {
        data.kategorie = kategorie;
      } else {
        return res.status(400).json({ message: "Ungültige Kategorie" });
      }
    }

    // Setze titel automatisch auf die Berufsbezeichnung
    data.titel = data.beruf;

    const result = await withDB(async () => {
      // Erstelle den neuen Job
      const newJob = new SucheEinenJob({
        ...data,
        erstelltAm,
        expiresAt,
        ersteller: userId,
        status: 'aktiv'
      });

      // Speichere den Job
      const savedJob = await newJob.save();

      // Aktualisiere den Benutzer
      await User.findByIdAndUpdate(userId, {
        $push: { erstellteSucheJobs: savedJob._id }
      });

      return savedJob;
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error("Fehler beim Anlegen des Jobs:", error);
    return res.status(500).json({ message: "Fehler beim Anlegen des Jobs", error });
  }
});

// Job aktualisieren (authentifiziert)
router.put("/:id", authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }

    const job = await withDB(async () => {
      const existingJob = await SucheEinenJob.findById(req.params.id);
      
      if (!existingJob) {
        return null;
      }

      // Prüfe, ob der Benutzer der Ersteller ist
      if (existingJob.ersteller.toString() !== userId) {
        throw new Error("Nicht autorisiert");
      }

      return await SucheEinenJob.findByIdAndUpdate(req.params.id, req.body, { new: true });
    });

    if (!job) {
      return res.status(404).json({ message: "Job nicht gefunden" });
    }
    return res.json(job);
  } catch (error) {
    if (error instanceof Error && error.message === "Nicht autorisiert") {
      return res.status(403).json({ message: "Nicht autorisiert" });
    }
    return res.status(400).json({ message: "Fehler beim Aktualisieren des Jobs", error });
  }
});

// Job löschen (authentifiziert)
router.delete("/:id", authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }

    const result = await withDB(async () => {
      const job = await SucheEinenJob.findById(req.params.id);
      
      if (!job) {
        return null;
      }

      // Prüfe, ob der Benutzer der Ersteller ist
      if (job.ersteller.toString() !== userId) {
        throw new Error("Nicht autorisiert");
      }

      // Lösche den Job
      await job.deleteOne();

      // Aktualisiere den Benutzer
      await User.findByIdAndUpdate(userId, {
        $pull: { erstellteSucheJobs: job._id }
      });

      return { message: "Job erfolgreich gelöscht" };
    });

    if (!result) {
      return res.status(404).json({ message: "Job nicht gefunden" });
    }
    return res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "Nicht autorisiert") {
      return res.status(403).json({ message: "Nicht autorisiert" });
    }
    return res.status(500).json({ message: "Fehler beim Löschen des Jobs", error });
  }
});

export default router; 