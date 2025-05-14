import express, { Request, Response } from "express";
import Job from "../models/Job";
import User from "../models/User";
import { authenticateJWT, AuthRequest } from "../middleware/auth";
import { withDB } from "../db/connection";

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

    const result = await withDB(async () => {
      // Hole Jobs mit Pagination
      const jobs = await Job
        .find(filter)
        .sort({ erstelltAm: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      // Zähle Gesamtanzahl
      const totalJobs = await Job.countDocuments(filter);

      return {
        jobs,
        pagination: {
          total: totalJobs,
          page,
          limit,
          pages: Math.ceil(totalJobs / limit)
        }
      };
    });

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: "Fehler beim Abrufen der Jobs", error });
  }
});

// Einzelnen Job abrufen
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const job = await withDB(async () => {
      return await Job.findById(req.params.id);
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

    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }

    // Setze Ablaufdatum auf 30 Tage in der Zukunft
    const erstelltAm = new Date();
    const expiresAt = new Date(erstelltAm.getTime() + 30 * 24 * 60 * 60 * 1000);

    const result = await withDB(async () => {
      // Erstelle den neuen Job
      const newJob = new Job({
        titel,
        standort,
        beschreibung,
        unternehmen,
        artDerStelle,
        kontaktEmail,
        kontaktTelefon,
        erfahrung,
        erstelltAm,
        expiresAt,
        ersteller: userId
      });

      // Speichere den Job
      const savedJob = await newJob.save();

      // Aktualisiere den Benutzer
      await User.findByIdAndUpdate(userId, {
        $push: { erstellteJobs: savedJob._id }
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
      const existingJob = await Job.findById(req.params.id);
      
      if (!existingJob) {
        return null;
      }

      // Prüfe, ob der Benutzer der Ersteller ist
      if (existingJob.ersteller.toString() !== userId) {
        throw new Error("Nicht autorisiert");
      }

      return await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
      const job = await Job.findById(req.params.id);
      
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
        $pull: { erstellteJobs: job._id }
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