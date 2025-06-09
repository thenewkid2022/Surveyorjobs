import express, { Request, Response } from "express";
import Stripe from "stripe";
import { authenticateJWT, AuthRequest } from "../middleware/auth";
import User from "../models/User";
import { withDB } from "../db/connection";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16"
});

// Package-Konfiguration mit Preisen
const packageConfigs: { [key: string]: any } = {
  basic: {
    price: 99, // CHF
    jobLimit: 1,
    cvAccessLimit: 1,
    anonymizedCVOnly: true,
    hasPriorityListing: false,
    hasAnalytics: false,
    hasApiAccess: false
  },
  pro: {
    price: 249, // CHF
    jobLimit: 3,
    cvAccessLimit: 10,
    anonymizedCVOnly: false,
    hasPriorityListing: true,
    hasAnalytics: false,
    hasApiAccess: false
  },
  enterprise: {
    price: 499, // CHF
    jobLimit: 10,
    cvAccessLimit: 50,
    anonymizedCVOnly: false,
    hasPriorityListing: true,
    hasAnalytics: true,
    hasApiAccess: false
  },
  unlimited: {
    price: 799, // CHF
    jobLimit: -1,
    cvAccessLimit: -1,
    anonymizedCVOnly: false,
    hasPriorityListing: true,
    hasAnalytics: true,
    hasApiAccess: true
  },
  // Jobsuche-Pakete (bestehend)
  "basic-job": {
    price: 29, // CHF
    duration: 30
  },
  "plus-job": {
    price: 39, // CHF
    duration: 60
  },
  "premium-job": {
    price: 49, // CHF
    duration: 90
  }
};

router.post("/create-payment-intent", async (req: Request, res: Response) => {
  try {
    const { packageId, packageName, type } = req.body;
    
    // Validierung des Typs
    if (type !== 'stellenanzeigen-aufgeben' && type !== 'suche-einen-job') {
      return res.status(400).json({ message: "Ungültiger Typ" });
    }

    // Bestimme den korrekten Preis basierend auf Paket und Typ
    let amount = 1000; // Standard-Fallback
    let packageConfig: any = null;

    if (type === 'stellenanzeigen-aufgeben') {
      // Arbeitgeber-Pakete
      packageConfig = packageConfigs[packageId];
      if (packageConfig && packageConfig.price) {
        amount = packageConfig.price * 100; // Konvertiere zu Rappen
      }
    } else if (type === 'suche-einen-job') {
      // Jobsuche-Pakete
      const jobPackageKey = `${packageId}-job`;
      packageConfig = packageConfigs[jobPackageKey];
      if (packageConfig && packageConfig.price) {
        amount = packageConfig.price * 100; // Konvertiere zu Rappen
      }
    }

    console.log(`Payment Intent erstellen: ${packageName} (${packageId}) - ${amount / 100} CHF`);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "chf",
      metadata: {
        packageId,
        packageName,
        type,
        priceChf: (amount / 100).toString()
      },
    });

    return res.json({ 
      clientSecret: paymentIntent.client_secret,
      amount: amount,
      currency: "chf"
    });
  } catch (error) {
    console.error("Fehler beim Erstellen des Payment Intents:", error);
    return res.status(500).json({ message: "Fehler beim Erstellen des Payment Intents", error });
  }
});

// Package aktivieren nach erfolgreicher Zahlung
router.post("/activate-package", authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { packageId, paymentIntentId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Nicht authentifiziert" });
    }

    if (!packageId || !paymentIntentId) {
      return res.status(400).json({ message: "PackageId und PaymentIntentId sind erforderlich" });
    }

    // Prüfe Payment Intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: "Zahlung nicht erfolgreich" });
    }

    // Hole Package-Konfiguration
    const packageConfig = packageConfigs[packageId];
    if (!packageConfig) {
      return res.status(400).json({ message: "Ungültiges Paket" });
    }

    // Setze Ablaufdatum auf 30 Tage in der Zukunft
    const premiumBis = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Aktualisiere Benutzer
    const user = await withDB(async () => {
      return await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            'premiumFeatures.currentPackageId': packageId,
            'premiumFeatures.premiumTyp': 'arbeitgeber',
            'premiumFeatures.premiumBis': premiumBis,
            'premiumFeatures.jobPostingLimit': packageConfig.jobLimit,
            'premiumFeatures.jobPostingCount': 0, // Reset counter
            'premiumFeatures.cvAccessLimit': packageConfig.cvAccessLimit,
            'premiumFeatures.cvAccessCount': 0, // Reset counter
            'premiumFeatures.cvAccessResetDate': premiumBis,
            'premiumFeatures.hasAnalytics': packageConfig.hasAnalytics,
            'premiumFeatures.hasApiAccess': packageConfig.hasApiAccess,
            'premiumFeatures.hasPriorityListing': packageConfig.hasPriorityListing,
            'premiumFeatures.anonymizedCVOnly': packageConfig.anonymizedCVOnly
          }
        },
        { new: true }
      );
    });

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    return res.json({
      message: "Paket erfolgreich aktiviert",
      package: {
        id: packageId,
        expiresAt: premiumBis,
        features: packageConfig
      }
    });

  } catch (error) {
    console.error("Fehler beim Aktivieren des Pakets:", error);
    return res.status(500).json({ message: "Fehler beim Aktivieren des Pakets", error });
  }
});

// Webhook für erfolgreiche Zahlungen
router.post("/webhook", express.raw({ type: "application/json" }), async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("Webhook Event empfangen:", event.type);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      console.log("Erfolgreiche Zahlung:", {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        metadata: paymentIntent.metadata
      });
      return res.json({ received: true });
    }
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook-Fehler:", error);
    const errorMessage = error instanceof Error ? error.message : "Unbekannter Fehler";
    return res.status(400).send(`Webhook Error: ${errorMessage}`);
  }
});

// Verfügbare Pakete und Preise abrufen
router.get("/packages", async (req: Request, res: Response) => {
  try {
    const { type } = req.query;

    if (type === 'stellenanzeigen-aufgeben') {
      // Arbeitgeber-Pakete
      const employerPackages = {
        basic: {
          id: 'basic',
          name: 'Basic',
          price: packageConfigs.basic.price,
          duration: 30,
          features: [
            '1 Stellenanzeige',
            '1 anonymisierter Lebenslauf',
            'Standard-Sichtbarkeit',
            'E-Mail Support'
          ],
          jobLimit: packageConfigs.basic.jobLimit,
          cvAccessLimit: packageConfigs.basic.cvAccessLimit,
          anonymizedCVOnly: packageConfigs.basic.anonymizedCVOnly
        },
        pro: {
          id: 'pro',
          name: 'Pro',
          price: packageConfigs.pro.price,
          duration: 30,
          features: [
            '3 Stellenanzeigen',
            '10 vollständige Lebensläufe',
            'Hervorgehobene Anzeigen',
            'Bewerber-Management',
            'Priority Support'
          ],
          jobLimit: packageConfigs.pro.jobLimit,
          cvAccessLimit: packageConfigs.pro.cvAccessLimit,
          anonymizedCVOnly: packageConfigs.pro.anonymizedCVOnly
        },
        enterprise: {
          id: 'enterprise',
          name: 'Enterprise',
          price: packageConfigs.enterprise.price,
          duration: 30,
          features: [
            '10 Stellenanzeigen',
            '50 vollständige Lebensläufe',
            'Premium-Support',
            'Analytics-Dashboard',
            'Top-Platzierung'
          ],
          jobLimit: packageConfigs.enterprise.jobLimit,
          cvAccessLimit: packageConfigs.enterprise.cvAccessLimit,
          anonymizedCVOnly: packageConfigs.enterprise.anonymizedCVOnly
        },
        unlimited: {
          id: 'unlimited',
          name: 'Unlimited',
          price: packageConfigs.unlimited.price,
          duration: 30,
          features: [
            'Unbegrenzte Stellenanzeigen',
            'Unbegrenzter Zugriff auf Lebensläufe',
            'API-Zugang',
            'Erweiterte Statistiken',
            'Dedizierter Account Manager'
          ],
          jobLimit: packageConfigs.unlimited.jobLimit,
          cvAccessLimit: packageConfigs.unlimited.cvAccessLimit,
          anonymizedCVOnly: packageConfigs.unlimited.anonymizedCVOnly
        }
      };
      return res.json({ packages: employerPackages });
    
    } else if (type === 'suche-einen-job') {
      // Jobsuche-Pakete
      const jobSeekerPackages = {
        basic: {
          id: 'basic',
          name: 'Basic',
          price: packageConfigs['basic-job'].price,
          duration: packageConfigs['basic-job'].duration,
          features: ['Veröffentlichung in 24h', '1 Bild möglich']
        },
        plus: {
          id: 'plus',
          name: 'Plus',
          price: packageConfigs['plus-job'].price,
          duration: packageConfigs['plus-job'].duration,
          features: ['Veröffentlichung in 24h', 'Bis zu 3 Bilder', 'Social Media Posting']
        },
        premium: {
          id: 'premium',
          name: 'Premium',
          price: packageConfigs['premium-job'].price,
          duration: packageConfigs['premium-job'].duration,
          features: ['Veröffentlichung in 24h', 'Bis zu 5 Bilder', 'Video möglich', 'Social Media Posting']
        }
      };
      return res.json({ packages: jobSeekerPackages });
    
    } else {
      return res.status(400).json({ message: "Typ muss 'stellenanzeigen-aufgeben' oder 'suche-einen-job' sein" });
    }

  } catch (error) {
    console.error("Fehler beim Abrufen der Pakete:", error);
    return res.status(500).json({ message: "Fehler beim Abrufen der Pakete", error });
  }
});

export default router; 