import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16"
});

// Stripe-Produkte und Preise für Arbeitgeber-Pakete
export const STRIPE_PRODUCTS = {
  // Arbeitgeber-Pakete
  EMPLOYER_BASIC: 'prod_employer_basic',
  EMPLOYER_PRO: 'prod_employer_pro', 
  EMPLOYER_ENTERPRISE: 'prod_employer_enterprise',
  EMPLOYER_UNLIMITED: 'prod_employer_unlimited',
  
  // Jobsuche-Pakete
  JOBSEEKER_BASIC: 'prod_jobseeker_basic',
  JOBSEEKER_PLUS: 'prod_jobseeker_plus',
  JOBSEEKER_PREMIUM: 'prod_jobseeker_premium'
};

export const STRIPE_PRICES = {
  // Arbeitgeber-Pakete (in Rappen)
  EMPLOYER_BASIC: 9900, // CHF 99.00
  EMPLOYER_PRO: 24900, // CHF 249.00
  EMPLOYER_ENTERPRISE: 49900, // CHF 499.00
  EMPLOYER_UNLIMITED: 79900, // CHF 799.00
  
  // Jobsuche-Pakete (in Rappen)
  JOBSEEKER_BASIC: 2900, // CHF 29.00
  JOBSEEKER_PLUS: 3900, // CHF 39.00
  JOBSEEKER_PREMIUM: 4900 // CHF 49.00
};

// Stripe-Produkte erstellen (für Setup)
export async function createStripeProducts() {
  try {
    console.log("Erstelle Stripe-Produkte...");

    // Arbeitgeber-Pakete
    const employerBasic = await stripe.products.create({
      id: STRIPE_PRODUCTS.EMPLOYER_BASIC,
      name: 'Arbeitgeber Basic Paket',
      description: '1 Stellenanzeige + 1 anonymisierter Lebenslauf',
      metadata: {
        type: 'employer',
        package: 'basic',
        jobLimit: '1',
        cvAccessLimit: '1'
      }
    });

    const employerPro = await stripe.products.create({
      id: STRIPE_PRODUCTS.EMPLOYER_PRO,
      name: 'Arbeitgeber Pro Paket',
      description: '3 Stellenanzeigen + 10 vollständige Lebensläufe',
      metadata: {
        type: 'employer',
        package: 'pro',
        jobLimit: '3',
        cvAccessLimit: '10'
      }
    });

    const employerEnterprise = await stripe.products.create({
      id: STRIPE_PRODUCTS.EMPLOYER_ENTERPRISE,
      name: 'Arbeitgeber Enterprise Paket',
      description: '10 Stellenanzeigen + 50 vollständige Lebensläufe + Analytics',
      metadata: {
        type: 'employer',
        package: 'enterprise',
        jobLimit: '10',
        cvAccessLimit: '50'
      }
    });

    const employerUnlimited = await stripe.products.create({
      id: STRIPE_PRODUCTS.EMPLOYER_UNLIMITED,
      name: 'Arbeitgeber Unlimited Paket',
      description: 'Unbegrenzte Stellenanzeigen + Unbegrenzter CV-Zugriff + API',
      metadata: {
        type: 'employer',
        package: 'unlimited',
        jobLimit: '-1',
        cvAccessLimit: '-1'
      }
    });

    // Jobsuche-Pakete
    const jobseekerBasic = await stripe.products.create({
      id: STRIPE_PRODUCTS.JOBSEEKER_BASIC,
      name: 'Jobsuche Basic Paket',
      description: 'Basic Jobsuche-Veröffentlichung',
      metadata: {
        type: 'jobseeker',
        package: 'basic',
        duration: '30'
      }
    });

    const jobseekerPlus = await stripe.products.create({
      id: STRIPE_PRODUCTS.JOBSEEKER_PLUS,
      name: 'Jobsuche Plus Paket',
      description: 'Plus Jobsuche-Veröffentlichung mit Social Media',
      metadata: {
        type: 'jobseeker',
        package: 'plus',
        duration: '60'
      }
    });

    const jobseekerPremium = await stripe.products.create({
      id: STRIPE_PRODUCTS.JOBSEEKER_PREMIUM,
      name: 'Jobsuche Premium Paket',
      description: 'Premium Jobsuche-Veröffentlichung mit Video',
      metadata: {
        type: 'jobseeker',
        package: 'premium',
        duration: '90'
      }
    });

    console.log("Stripe-Produkte erfolgreich erstellt:", {
      employerBasic: employerBasic.id,
      employerPro: employerPro.id,
      employerEnterprise: employerEnterprise.id,
      employerUnlimited: employerUnlimited.id,
      jobseekerBasic: jobseekerBasic.id,
      jobseekerPlus: jobseekerPlus.id,
      jobseekerPremium: jobseekerPremium.id
    });

  } catch (error) {
    console.error("Fehler beim Erstellen der Stripe-Produkte:", error);
    throw error;
  }
}

// Stripe-Preise erstellen
export async function createStripePrices() {
  try {
    console.log("Erstelle Stripe-Preise...");

    // Arbeitgeber-Pakete Preise
    const priceEmployerBasic = await stripe.prices.create({
      product: STRIPE_PRODUCTS.EMPLOYER_BASIC,
      unit_amount: STRIPE_PRICES.EMPLOYER_BASIC,
      currency: 'chf',
      recurring: {
        interval: 'month'
      },
      metadata: {
        package: 'basic',
        type: 'employer'
      }
    });

    const priceEmployerPro = await stripe.prices.create({
      product: STRIPE_PRODUCTS.EMPLOYER_PRO,
      unit_amount: STRIPE_PRICES.EMPLOYER_PRO,
      currency: 'chf',
      recurring: {
        interval: 'month'
      },
      metadata: {
        package: 'pro',
        type: 'employer'
      }
    });

    const priceEmployerEnterprise = await stripe.prices.create({
      product: STRIPE_PRODUCTS.EMPLOYER_ENTERPRISE,
      unit_amount: STRIPE_PRICES.EMPLOYER_ENTERPRISE,
      currency: 'chf',
      recurring: {
        interval: 'month'
      },
      metadata: {
        package: 'enterprise',
        type: 'employer'
      }
    });

    const priceEmployerUnlimited = await stripe.prices.create({
      product: STRIPE_PRODUCTS.EMPLOYER_UNLIMITED,
      unit_amount: STRIPE_PRICES.EMPLOYER_UNLIMITED,
      currency: 'chf',
      recurring: {
        interval: 'month'
      },
      metadata: {
        package: 'unlimited',
        type: 'employer'
      }
    });

    // Jobsuche-Pakete Preise (einmalig)
    const priceJobseekerBasic = await stripe.prices.create({
      product: STRIPE_PRODUCTS.JOBSEEKER_BASIC,
      unit_amount: STRIPE_PRICES.JOBSEEKER_BASIC,
      currency: 'chf',
      metadata: {
        package: 'basic',
        type: 'jobseeker'
      }
    });

    const priceJobseekerPlus = await stripe.prices.create({
      product: STRIPE_PRODUCTS.JOBSEEKER_PLUS,
      unit_amount: STRIPE_PRICES.JOBSEEKER_PLUS,
      currency: 'chf',
      metadata: {
        package: 'plus',
        type: 'jobseeker'
      }
    });

    const priceJobseekerPremium = await stripe.prices.create({
      product: STRIPE_PRODUCTS.JOBSEEKER_PREMIUM,
      unit_amount: STRIPE_PRICES.JOBSEEKER_PREMIUM,
      currency: 'chf',
      metadata: {
        package: 'premium',
        type: 'jobseeker'
      }
    });

    console.log("Stripe-Preise erfolgreich erstellt:", {
      employerBasic: priceEmployerBasic.id,
      employerPro: priceEmployerPro.id,
      employerEnterprise: priceEmployerEnterprise.id,
      employerUnlimited: priceEmployerUnlimited.id,
      jobseekerBasic: priceJobseekerBasic.id,
      jobseekerPlus: priceJobseekerPlus.id,
      jobseekerPremium: priceJobseekerPremium.id
    });

    return {
      employer: {
        basic: priceEmployerBasic.id,
        pro: priceEmployerPro.id,
        enterprise: priceEmployerEnterprise.id,
        unlimited: priceEmployerUnlimited.id
      },
      jobseeker: {
        basic: priceJobseekerBasic.id,
        plus: priceJobseekerPlus.id,
        premium: priceJobseekerPremium.id
      }
    };

  } catch (error) {
    console.error("Fehler beim Erstellen der Stripe-Preise:", error);
    throw error;
  }
}

// Preis basierend auf Paket und Typ abrufen
export function getStripePrice(packageId: string, type: string): number {
  if (type === 'stellenanzeigen-aufgeben') {
    switch (packageId) {
      case 'basic': return STRIPE_PRICES.EMPLOYER_BASIC;
      case 'pro': return STRIPE_PRICES.EMPLOYER_PRO;
      case 'enterprise': return STRIPE_PRICES.EMPLOYER_ENTERPRISE;
      case 'unlimited': return STRIPE_PRICES.EMPLOYER_UNLIMITED;
      default: return 1000; // Fallback
    }
  } else if (type === 'suche-einen-job') {
    switch (packageId) {
      case 'basic': return STRIPE_PRICES.JOBSEEKER_BASIC;
      case 'plus': return STRIPE_PRICES.JOBSEEKER_PLUS;
      case 'premium': return STRIPE_PRICES.JOBSEEKER_PREMIUM;
      default: return 1000; // Fallback
    }
  }
  
  return 1000; // Fallback
}

export default stripe; 