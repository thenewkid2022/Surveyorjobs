import { createStripeProducts, createStripePrices } from '../services/stripeService';

async function setupStripe() {
  try {
    console.log("🔧 Stripe-Setup wird gestartet...");

    // Stripe-Produkte erstellen
    console.log("📦 Erstelle Stripe-Produkte...");
    await createStripeProducts();
    console.log("✅ Stripe-Produkte erfolgreich erstellt");

    // Stripe-Preise erstellen  
    console.log("💰 Erstelle Stripe-Preise...");
    const prices = await createStripePrices();
    console.log("✅ Stripe-Preise erfolgreich erstellt");

    console.log("\n🎉 Stripe-Setup erfolgreich abgeschlossen!");
    console.log("\n📋 Übersicht der erstellten Preise:");
    console.log("Arbeitgeber-Pakete:");
    console.log(`  Basic: CHF 99/Monat (${prices.employer.basic})`);
    console.log(`  Pro: CHF 249/Monat (${prices.employer.pro})`);
    console.log(`  Enterprise: CHF 499/Monat (${prices.employer.enterprise})`);
    console.log(`  Unlimited: CHF 799/Monat (${prices.employer.unlimited})`);
    
    console.log("\nJobsuche-Pakete:");
    console.log(`  Basic: CHF 29 einmalig (${prices.jobseeker.basic})`);
    console.log(`  Plus: CHF 39 einmalig (${prices.jobseeker.plus})`);
    console.log(`  Premium: CHF 49 einmalig (${prices.jobseeker.premium})`);

    console.log("\n⚠️  Wichtige Hinweise:");
    console.log("- Arbeitgeber-Pakete sind monatlich wiederkehrend");
    console.log("- Jobsuche-Pakete sind einmalige Zahlungen");
    console.log("- Alle Preise sind in CHF");
    console.log("- DSGVO-konform: Lebensläufe nur mit Bewerber-Einwilligung");

    process.exit(0);

  } catch (error) {
    console.error("❌ Fehler beim Stripe-Setup:", error);
    
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        console.log("ℹ️  Einige Produkte existieren bereits. Das ist normal.");
        console.log("💡 Verwenden Sie das Stripe-Dashboard um bestehende Produkte zu verwalten.");
      } else {
        console.error("Detaillierter Fehler:", error.message);
      }
    }
    
    process.exit(1);
  }
}

// Script ausführen wenn direkt aufgerufen
if (require.main === module) {
  setupStripe();
}

export default setupStripe; 