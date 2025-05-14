import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import Stripe from "stripe";
import { withDB } from "../db/connection";
import { authenticateJWT, AuthRequest } from "../middleware/auth";
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail, sendAccountStatusEmail } from "../services/emailService";
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Überprüfe Stripe-Konfiguration
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("STRIPE_SECRET_KEY ist nicht definiert!");
} else {
  console.log("Stripe-Konfiguration gefunden");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: "2023-10-16"
});

// Rate Limiting für Login und Registrierung
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minuten
  max: 5, // 5 Versuche
  message: { message: "Zu viele Versuche. Bitte versuchen Sie es später erneut." }
});

// Registrierung
router.post("/register", authLimiter, async (req: Request, res: Response) => {
  const { email, password, vorname, nachname, telefon, firma, accountTyp } = req.body;
  
  try {
    const existingUser = await withDB(async () => {
      return await User.findOne({ email });
    });

    if (existingUser) {
      return res.status(400).json({ message: "E-Mail bereits registriert" });
    }

    const user = await withDB(async () => {
      const newUser = new User({
        email,
        password,
        vorname,
        nachname,
        telefon,
        firma,
        accountTyp
      });
      await newUser.save();
      return newUser;
    });

    // E-Mail-Verifizierung
    const token = await user.generateEmailVerificationToken();
    await sendVerificationEmail(email, token);
    await sendWelcomeEmail(email, vorname);

    return res.status(201).json({ message: "Registrierung erfolgreich" });
  } catch (error) {
    return res.status(500).json({ message: "Fehler bei der Registrierung", error });
  }
});

// Login
router.post("/login", authLimiter, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log('Login-Versuch für:', email);
  console.log('Eingegebenes Passwort:', password);
  
  try {
    const user = await withDB(async () => {
      const foundUser = await User.findOne({ email }) as IUser;
      console.log('Benutzer gefunden:', foundUser ? 'Ja' : 'Nein');
      if (foundUser) {
        console.log('Benutzer-Details:', {
          id: foundUser._id,
          email: foundUser.email,
          accountStatus: foundUser.accountStatus,
          emailVerifiziert: foundUser.emailVerifiziert
        });
      }
      return foundUser;
    });

    if (!user) {
      console.log('Benutzer nicht gefunden');
      return res.status(400).json({ message: "Ungültige Anmeldedaten" });
    }

    if (user.accountStatus === 'gesperrt') {
      console.log('Account ist gesperrt');
      return res.status(403).json({ message: "Account ist gesperrt" });
    }

    console.log('Vergleiche Passwort...');
    console.log('Gespeicherter Hash:', user.password);
    const isMatch = await user.comparePassword(password);
    console.log('Passwort-Match:', isMatch);

    if (!isMatch) {
      console.log('Passwort stimmt nicht überein');
      return res.status(400).json({ message: "Ungültige Anmeldedaten" });
    }

    // Update letzter Login
    user.letzterLogin = new Date();
    await user.save();
    console.log('Login erfolgreich, Token wird generiert');

    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        accountTyp: user.accountTyp
      }, 
      process.env.JWT_SECRET!, 
      { expiresIn: "1d" }
    );

    console.log('Login erfolgreich abgeschlossen');
    return res.json({ 
      token,
      user: {
        id: user._id,
        email: user.email,
        vorname: user.vorname,
        nachname: user.nachname,
        accountTyp: user.accountTyp,
        emailVerifiziert: user.emailVerifiziert
      }
    });
  } catch (error) {
    console.error('Fehler beim Login:', error);
    return res.status(500).json({ message: "Fehler beim Login", error });
  }
});

// E-Mail-Verifizierung
router.get("/verify-email/:token", async (req: Request, res: Response) => {
  try {
    const user = await withDB(async () => {
      return await User.findOne({
        emailVerifizierungsToken: req.params.token,
        emailVerifizierungsTokenAblauf: { $gt: Date.now() }
      });
    });

    if (!user) {
      return res.status(400).json({ message: "Ungültiger oder abgelaufener Token" });
    }

    user.emailVerifiziert = true;
    user.emailVerifizierungsToken = undefined;
    user.emailVerifizierungsTokenAblauf = undefined;
    user.accountStatus = 'aktiv';
    await user.save();

    await sendAccountStatusEmail(user.email, 'aktiv');

    return res.json({ message: "E-Mail erfolgreich verifiziert" });
  } catch (error) {
    return res.status(500).json({ message: "Fehler bei der E-Mail-Verifizierung", error });
  }
});

// Passwort zurücksetzen anfordern
router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await withDB(async () => {
      return await User.findOne({ email });
    });

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    const token = await user.generatePasswordResetToken();
    await sendPasswordResetEmail(email, token);

    return res.json({ message: "E-Mail zum Zurücksetzen des Passworts wurde versendet" });
  } catch (error) {
    return res.status(500).json({ message: "Fehler beim Anfordern des Passwort-Resets", error });
  }
});

// Passwort zurücksetzen
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    const user = await withDB(async () => {
      return await User.findOne({
        resetPasswordToken: token,
        resetPasswordTokenAblauf: { $gt: Date.now() }
      });
    });

    if (!user) {
      return res.status(400).json({ message: "Ungültiger oder abgelaufener Token" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenAblauf = undefined;
    await user.save();

    return res.json({ message: "Passwort erfolgreich zurückgesetzt" });
  } catch (error) {
    return res.status(500).json({ message: "Fehler beim Zurücksetzen des Passworts", error });
  }
});

// Profil abrufen
router.get("/profile", authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const user = await withDB(async () => {
      return await User.findById(req.user.userId).select('-password');
    });

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Fehler beim Abrufen des Profils", error });
  }
});

// Profil aktualisieren
router.put("/profile", authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const { vorname, nachname, telefon, firma, profilbild } = req.body;
    const user = await withDB(async () => {
      return await User.findById(req.user.userId);
    });

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    // Aktualisiere nur die erlaubten Felder
    if (vorname) user.vorname = vorname;
    if (nachname) user.nachname = nachname;
    if (telefon) user.telefon = telefon;
    if (firma) user.firma = firma;
    if (profilbild) user.profilbild = profilbild;

    await user.save();

    return res.json({ message: "Profil erfolgreich aktualisiert" });
  } catch (error) {
    return res.status(500).json({ message: "Fehler beim Aktualisieren des Profils", error });
  }
});

// Passwort ändern
router.put("/change-password", authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await withDB(async () => {
      return await User.findById(req.user.userId);
    });

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Aktuelles Passwort ist falsch" });
    }

    user.password = newPassword;
    await user.save();

    return res.json({ message: "Passwort erfolgreich geändert" });
  } catch (error) {
    return res.status(500).json({ message: "Fehler beim Ändern des Passworts", error });
  }
});

// Account löschen
router.delete("/account", authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const user = await withDB(async () => {
      return await User.findById(req.user.userId);
    });

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    await user.deleteOne();

    return res.json({ message: "Account erfolgreich gelöscht" });
  } catch (error) {
    return res.status(500).json({ message: "Fehler beim Löschen des Accounts", error });
  }
});

// Logout (Client-seitig, Token wird ungültig gemacht)
router.post("/logout", authenticateJWT, async (_req: AuthRequest, res: Response) => {
  // Da wir JWT verwenden, gibt es keinen Server-seitigen Logout
  // Der Client muss den Token löschen
  return res.json({ message: "Erfolgreich ausgeloggt" });
});

// Temporärer Token nach erfolgreicher Zahlung
router.post("/temp-token", async (req: Request, res: Response) => {
  console.log("Temp-Token Anfrage erhalten:", req.body);
  const { paymentId } = req.body;
  
  if (!paymentId) {
    console.error("Keine paymentId in der Anfrage");
    return res.status(400).json({ message: "paymentId ist erforderlich" });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET ist nicht definiert!");
    return res.status(500).json({ message: "Server-Konfigurationsfehler" });
  }

  try {
    console.log("Überprüfe Payment Intent:", paymentId);
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
    console.log("Payment Intent Details:", {
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      metadata: paymentIntent.metadata
    });

    if (paymentIntent.status === 'succeeded') {
      console.log("Zahlung erfolgreich, generiere Token");
      const token = jwt.sign(
        { 
          paymentId,
          purpose: 'publish',
          type: 'temp',
          metadata: paymentIntent.metadata // Speichere Metadaten im Token
        }, 
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      console.log("Token erfolgreich generiert");
      return res.json({ token });
    } else {
      console.error("Zahlung nicht erfolgreich:", paymentIntent.status);
      return res.status(400).json({ 
        message: "Zahlung nicht erfolgreich",
        status: paymentIntent.status
      });
    }
  } catch (error) {
    console.error("Fehler bei der Token-Generierung:", error);
    if (error instanceof Stripe.errors.StripeError) {
      return res.status(400).json({ 
        message: `Stripe-Fehler: ${error.message}`,
        type: error.type
      });
    } else {
      return res.status(500).json({ 
        message: "Interner Server-Fehler",
        error: error instanceof Error ? error.message : 'Unbekannter Fehler'
      });
    }
  }
});

export default router; 