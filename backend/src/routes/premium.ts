import express, { Response } from "express";
import { authenticateJWT, AuthRequest } from "../middleware/auth";
import User from "../models/User";
import { withDB } from "../db/connection";

const router = express.Router();

// Premium-Status abrufen
router.get("/status", authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }

    const user = await withDB(async () => {
      return await User.findById(userId).select('premiumFeatures accountTyp');
    });

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    return res.json({
      premiumFeatures: user.premiumFeatures,
      accountTyp: user.accountTyp
    });
  } catch (error) {
    return res.status(500).json({ message: "Fehler beim Abrufen des Premium-Status", error });
  }
});

// Premium-Features aktivieren
router.post("/aktivieren", authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }

    const { premiumTyp, lebenslaufHervorgehoben } = req.body;

    // Validiere Premium-Typ
    if (!['arbeitssuchender', 'arbeitgeber'].includes(premiumTyp)) {
      return res.status(400).json({ message: "Ungültiger Premium-Typ" });
    }

    // Setze Ablaufdatum auf 30 Tage in der Zukunft
    const premiumBis = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const user = await withDB(async () => {
      return await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            'premiumFeatures.premiumTyp': premiumTyp,
            'premiumFeatures.premiumBis': premiumBis,
            'premiumFeatures.lebenslaufHervorgehoben': lebenslaufHervorgehoben || false
          }
        },
        { new: true }
      );
    });

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    return res.json({
      message: "Premium-Features erfolgreich aktiviert",
      premiumFeatures: user.premiumFeatures
    });
  } catch (error) {
    return res.status(500).json({ message: "Fehler beim Aktivieren der Premium-Features", error });
  }
});

// Lebenslauf-Sichtbarkeit aktualisieren
router.put("/lebenslauf-sichtbarkeit", authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }

    const { sichtbar } = req.body;

    const user = await withDB(async () => {
      return await User.findByIdAndUpdate(
        userId,
        { $set: { lebenslaufSichtbar: sichtbar } },
        { new: true }
      );
    });

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    return res.json({
      message: "Lebenslauf-Sichtbarkeit aktualisiert",
      lebenslaufSichtbar: user.lebenslaufSichtbar
    });
  } catch (error) {
    return res.status(500).json({ message: "Fehler beim Aktualisieren der Lebenslauf-Sichtbarkeit", error });
  }
});

export default router; 