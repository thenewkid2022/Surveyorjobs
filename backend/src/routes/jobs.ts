import express, { Request, Response } from "express";
import Job from "../models/Job";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();

// Alle Jobs abrufen
router.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const kategorie = req.query.kategorie as string;
    const kanton = req.query.kanton as string;

    // Erstelle Filter-Objekt
    const filter: any = {
      status: 'aktiv',
      expiresAt: { $gt: new Date() }
    };

    if (kategorie) {
      filter.kategorie = new RegExp(`^${kategorie}$`, 'i');
    }

    if (kanton) {
      filter.standort = new RegExp(kanton, 'i');
    }

    // Hole Jobs mit Pagination
    const jobs = await Job
      .find(filter)
      .sort({ erstelltAm: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Zähle Gesamtanzahl
    const totalJobs = await Job.countDocuments(filter);

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
    return res.status(500).json({ message: "Fehler beim Abrufen der Jobs", error });
  }
});

// Einzelnen Job abrufen
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
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
    const { 
      titel, 
      standort, 
      beschreibung, 
      unternehmen, 
      artDerStelle, 
      kontaktEmail, 
      kontaktTelefon,
      erfahrung 
    } = req.body;

    // Setze Ablaufdatum auf 30 Tage in der Zukunft
    const erstelltAm = new Date();
    const expiresAt = new Date(erstelltAm.getTime() + 30 * 24 * 60 * 60 * 1000);

    const job = new Job({
      titel,
      standort,
      beschreibung,
      unternehmen,
      artDerStelle,
      kontaktEmail,
      kontaktTelefon,
      erfahrung,
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
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job nicht gefunden" });
    }
    return res.json({ message: "Job erfolgreich gelöscht" });
  } catch (error) {
    return res.status(500).json({ message: "Fehler beim Löschen des Jobs", error });
  }
});

export default router; 