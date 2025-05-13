import express, { Request, Response } from "express";
import SucheEinenJob from "../models/suche-einen-job";
import { authenticateJWT } from "../middleware/auth";
import { ortschaftZuKanton } from "@shared/lib/kantone";
import { berufe } from "@shared/lib/berufe";

const router = express.Router();

// Kategorie-Mapping von URL-Schlüsseln zu vollständigen Namen
const kategorieMapping: { [key: string]: string } = {
  'hochbau': 'Hochbau',
  'tiefbau': 'Tiefbau',
  'ausbau': 'Ausbau',
  'planung': 'Planung & Technik',
  'weitere': 'Weitere Berufe'
};

// Alle Jobs abrufen
router.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const kategorieKey = req.query.kategorie as string;
    const kanton = req.query.kanton as string;

    // Erstelle Filter-Objekt
    const filter: any = {
      status: 'aktiv',
      expiresAt: { $gt: new Date() }
    };

    if (kategorieKey) {
      // Übersetze den URL-Schlüssel in den vollständigen Kategorienamen
      const kategorie = kategorieMapping[kategorieKey];
      if (kategorie) {
        // Case-insensitive Suche mit RegExp
        filter.kategorie = new RegExp(`^${kategorie}$`, 'i');
      }
    }

    if (kanton) {
      // Finde alle Orte für den gewählten Kanton
      const orteImKanton = Object.entries(ortschaftZuKanton)
        .filter(([_, k]) => k === kanton)
        .map(([ort, _]) => ort);
      
      // Verwende $in für exakte Übereinstimmungen
      filter.standort = { $in: orteImKanton };
    }

    // Hole Jobs mit Pagination
    const jobs = await SucheEinenJob
      .find(filter)
      .sort({ erstelltAm: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Zähle Gesamtanzahl
    const totalJobs = await SucheEinenJob.countDocuments(filter);

    res.json({
      jobs,
      pagination: {
        total: totalJobs,
        page,
        limit,
        pages: Math.ceil(totalJobs / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Abrufen der Jobs", error });
  }
});

// Einzelnen Job abrufen
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const job = await SucheEinenJob.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job nicht gefunden" });
    }
    return res.json(job);
  } catch (error) {
    return res.status(500).json({ message: "Fehler beim Abrufen des Jobs", error });
  }
});

// Neuen Job anlegen (authentifiziert)
router.post("/", authenticateJWT, async (req: Request, res: Response) => {
  try {
    // Setze Ablaufdatum auf 30 Tage in der Zukunft
    const erstelltAm = new Date();
    const expiresAt = new Date(erstelltAm.getTime() + 30 * 24 * 60 * 60 * 1000);

    const data = req.body;

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

    const job = new SucheEinenJob({
      ...data,
      erstelltAm,
      expiresAt
    });

    await job.save();
    return res.status(201).json(job);
  } catch (error) {
    console.error("Fehler beim Anlegen des Jobs:", error);
    return res.status(500).json({ message: "Fehler beim Anlegen des Jobs", error });
  }
});

// Job aktualisieren (authentifiziert)
router.put("/:id", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const job = await SucheEinenJob.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) {
      return res.status(404).json({ message: "Job nicht gefunden" });
    }
    return res.json(job);
  } catch (error) {
    return res.status(400).json({ message: "Fehler beim Aktualisieren des Jobs", error });
  }
});

// Job löschen (authentifiziert)
router.delete("/:id", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const job = await SucheEinenJob.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job nicht gefunden" });
    }
    return res.json({ message: "Job erfolgreich gelöscht" });
  } catch (error) {
    return res.status(500).json({ message: "Fehler beim Löschen des Jobs", error });
  }
});

export default router; 