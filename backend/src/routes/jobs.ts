import express from "express";
import Job from "../models/Job";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();

// Alle Jobs abrufen
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ erstelltAm: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Abrufen der Jobs", error });
  }
});

// Einzelnen Job abrufen
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job nicht gefunden" });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Abrufen des Jobs", error });
  }
});

// Neuen Job anlegen (authentifiziert)
router.post("/", authenticateJWT, async (req, res) => {
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
    res.status(201).json(job);
  } catch (error) {
    console.error("Fehler beim Anlegen des Jobs:", error);
    res.status(500).json({ message: "Fehler beim Anlegen des Jobs", error });
  }
});

// Job aktualisieren (authentifiziert)
router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) {
      return res.status(404).json({ message: "Job nicht gefunden" });
    }
    res.json(job);
  } catch (error) {
    res.status(400).json({ message: "Fehler beim Aktualisieren des Jobs", error });
  }
});

// Job löschen (authentifiziert)
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job nicht gefunden" });
    }
    res.json({ message: "Job erfolgreich gelöscht" });
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Löschen des Jobs", error });
  }
});

export default router; 