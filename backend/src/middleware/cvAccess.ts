import { Request, Response, NextFunction } from "express";
import User from "../models/User";

export const requirePaidEmployer = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }

    const user = await User.findById(req.user.userId);
    
    if (!user || user.accountTyp !== 'arbeitgeber') {
      return res.status(403).json({ message: "Zugriff nur für Arbeitgeber" });
    }

    // Prüfe gültiges Paket
    if (!user.premiumFeatures?.premiumBis || new Date() > user.premiumFeatures.premiumBis) {
      return res.status(403).json({ 
        message: "Für den Zugriff auf Lebensläufe ist ein bezahltes Paket erforderlich",
        requiresUpgrade: true 
      });
    }

    req.user.premiumFeatures = user.premiumFeatures;
    next();
  } catch (error) {
    console.error("Fehler bei der CV-Zugriffsprüfung:", error);
    return res.status(500).json({ message: "Fehler bei der Zugriffsprüfung", error });
  }
}; 