import express, { Request, Response } from "express";
import StellenanzeigenAufgeben from "../models/stellenanzeigen-aufgeben";
import { ortschaftZuKanton } from "@shared/lib/kantone";
import { authenticateJWT } from "../middleware/auth";
import { berufe } from "@shared/lib/berufe";
import { withDB } from "../db/connection";

const router = express.Router();

// Alle Stellenanzeigen abrufen mit Filterung und Pagination
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
      // Suche nach Stellenanzeigen, deren Titel Berufe aus der gewählten Kategorie enthält
      const berufeInKategorie = berufe.filter(b => b.kategorie === kategorie);
      const berufsTitel = berufeInKategorie.map(b => b.titel);
      
      filter.titel = {
        $regex: new RegExp(`(${berufsTitel.join('|')})`, 'i')
      };
    }

    if (kanton) {
      // Finde alle Orte für den gewählten Kanton
      const orteImKanton = Object.entries(ortschaftZuKanton)
        .filter(([_, k]) => k === kanton)
        .map(([ort, _]) => ort);
      
      filter.standort = { $in: orteImKanton };
    }

    const result = await withDB(async () => {
      // Hole Stellenanzeigen mit Pagination
      const stellenanzeigen = await StellenanzeigenAufgeben
        .find(filter)
        .sort({ erstelltAm: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      // Zähle Gesamtanzahl
      const totalStellenanzeigen = await StellenanzeigenAufgeben.countDocuments(filter);

      return {
        stellenanzeigen,
        pagination: {
          total: totalStellenanzeigen,
          page,
          limit,
          pages: Math.ceil(totalStellenanzeigen / limit)
        }
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Abrufen der Stellenanzeigen", error });
  }
});

// Einzelne Stellenanzeige abrufen
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const stellenanzeige = await withDB(async () => {
      return await StellenanzeigenAufgeben.findById(req.params.id);
    });

    if (!stellenanzeige) {
      res.status(404).json({ message: "Stellenanzeige nicht gefunden" });
      return;
    }
    res.json(stellenanzeige);
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Abrufen der Stellenanzeige", error });
  }
});

// Neue Stellenanzeige erstellen (authentifiziert)
router.post("/", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const data = req.body;
    
    // Validierung der Pflichtfelder (ohne kategorie)
    if (!data.titel || !data.beschreibung || !data.standort || !data.kontaktName || !data.kontaktEmail) {
      return res.status(400).json({ message: "Fehlende Pflichtfelder" });
    }

    // Finde die Kategorie basierend auf dem Titel
    const beruf = berufe.find(b => 
      data.titel.toLowerCase().includes(b.titel.toLowerCase())
    );
    
    if (!beruf) {
      return res.status(400).json({ 
        message: "Der Stellentitel muss eine gültige Berufsbezeichnung enthalten" 
      });
    }

    // Setze die Kategorie automatisch
    data.kategorie = beruf.kategorie;

    // Paket-Laufzeit in Tagen (default: 30)
    const duration = data.duration || 30;
    const erstelltAm = new Date();
    const expiresAt = new Date(erstelltAm.getTime() + duration * 24 * 60 * 60 * 1000);

    const stellenanzeige = await withDB(async () => {
      const newStellenanzeige = new StellenanzeigenAufgeben({
        ...data,
        erstelltAm,
        expiresAt
      });
      return await newStellenanzeige.save();
    });

    return res.status(201).json(stellenanzeige);
  } catch (error) {
    return res.status(500).json({ message: "Fehler beim Erstellen der Stellenanzeige", error });
  }
});

// Stellenanzeige aktualisieren (authentifiziert)
router.put("/:id", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const stellenanzeige = await withDB(async () => {
      return await StellenanzeigenAufgeben.findByIdAndUpdate(req.params.id, req.body, { new: true });
    });

    if (!stellenanzeige) {
      return res.status(404).json({ message: "Stellenanzeige nicht gefunden" });
    }
    return res.json(stellenanzeige);
  } catch (error) {
    return res.status(400).json({ message: "Fehler beim Aktualisieren der Stellenanzeige", error });
  }
});

// Stellenanzeige löschen (authentifiziert)
router.delete("/:id", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const stellenanzeige = await withDB(async () => {
      return await StellenanzeigenAufgeben.findByIdAndDelete(req.params.id);
    });

    if (!stellenanzeige) {
      return res.status(404).json({ message: "Stellenanzeige nicht gefunden" });
    }
    return res.json({ message: "Stellenanzeige erfolgreich gelöscht" });
  } catch (error) {
    return res.status(500).json({ message: "Fehler beim Löschen der Stellenanzeige", error });
  }
});

export default router; 