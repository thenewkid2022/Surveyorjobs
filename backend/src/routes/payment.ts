import express, { Request, Response } from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16"
});

router.post("/create-payment-intent", async (req: Request, res: Response) => {
  try {
    const { packageId, packageName, type } = req.body;
    
    // Validierung des Typs
    if (type !== 'stellenanzeigen-aufgeben' && type !== 'suche-einen-job') {
      return res.status(400).json({ message: "Ungültiger Typ" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000,
      currency: "chf",
      metadata: {
        packageId,
        packageName,
        type
      },
    });

    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Fehler beim Erstellen des Payment Intents:", error);
    return res.status(500).json({ message: "Fehler beim Erstellen des Payment Intents", error });
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

export default router; 