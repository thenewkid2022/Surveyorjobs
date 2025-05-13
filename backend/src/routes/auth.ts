import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import Stripe from "stripe";

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

// Registrierung
router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "E-Mail bereits registriert" });
    }
    const user = new User({ email, password });
    await user.save();
    return res.status(201).json({ message: "Registrierung erfolgreich" });
  } catch (error) {
    return res.status(500).json({ message: "Fehler bei der Registrierung", error });
  }
});

// Login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }) as IUser;
    if (!user) {
      return res.status(400).json({ message: "Ungültige Anmeldedaten" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Ungültige Anmeldedaten" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "1d" });
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Fehler beim Login", error });
  }
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