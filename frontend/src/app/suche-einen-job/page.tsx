"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStripe, useElements, PaymentElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { berufe } from "@shared/lib/berufe";
import { getApiUrl } from '@/utils/api';
import LocationInput from "@/app/components/LocationInput";

// Stripe Promise initialisieren
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PricingPackage {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  newsletterInclusions: number;
  images: number;
  hasVideo: boolean;
  hasSocialMedia: boolean;
}

const packages: PricingPackage[] = [
  {
    id: "basic",
    name: "Basic",
    price: 29,
    duration: 30,
    features: ["Veröffentlichung in 24h", "1 Bild möglich"],
    newsletterInclusions: 1,
    images: 1,
    hasVideo: false,
    hasSocialMedia: false
  },
  {
    id: "plus",
    name: "Plus",
    price: 39,
    duration: 60,
    features: ["Veröffentlichung in 24h", "Bis zu 3 Bilder", "Social Media Posting"],
    newsletterInclusions: 2,
    images: 3,
    hasVideo: false,
    hasSocialMedia: true
  },
  {
    id: "premium",
    name: "Premium",
    price: 49,
    duration: 90,
    features: ["Veröffentlichung in 24h", "Bis zu 5 Bilder", "Video möglich", "Social Media Posting"],
    newsletterInclusions: 3,
    images: 5,
    hasVideo: true,
    hasSocialMedia: true
  }
];

interface JobSucheFormData {
  beruf: string;
  standort: string;
  beschreibung: string;
  erfahrung: string;
  ausbildung: string;
  faehigkeiten: string[];
  sprachen: string[];
  mobilitaet: string;
  artDerStelle: string;
  verfuegbarAb: string;
  kontaktEmail: string;
  kontaktTelefon: string;
  lebenslauf: File | null;
  anschreiben: string;
  titel: string;
}

function PackageCard({ pkg, onSelect }: { pkg: PricingPackage, onSelect: (pkg: PricingPackage) => void }) {
  return (
    <div className="col-md-4">
      <div className="card h-100 shadow-sm border-0 bg-dark text-white">
        <div className="card-body p-4">
          <h3 className="card-title h4 mb-3 text-white">{pkg.name}</h3>
          <div className="mb-4">
            <span className="display-4 fw-bold text-white">CHF {pkg.price}</span>
            <span className="text-white-50">/ {pkg.duration} Tage</span>
          </div>
          <ul className="list-unstyled mb-4">
            {pkg.features.map((feature, index) => (
              <li key={index} className="mb-2 text-white-50">
                <i className="bi bi-check-circle-fill text-primary me-2"></i>
                {feature}
              </li>
            ))}
          </ul>
          <button
            onClick={() => onSelect(pkg)}
            className="btn btn-primary w-100"
          >
            Jetzt auswählen
          </button>
        </div>
      </div>
    </div>
  );
}

function JobSucheFormular({ setShowForm, clientSecret }: { setShowForm: (show: boolean) => void, clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<JobSucheFormData>({
    beruf: "",
    standort: "",
    beschreibung: "",
    erfahrung: "",
    ausbildung: "",
    faehigkeiten: [],
    sprachen: [],
    mobilitaet: "In der Region",
    artDerStelle: "Vollzeit",
    verfuegbarAb: "",
    kontaktEmail: "",
    kontaktTelefon: "",
    lebenslauf: null,
    anschreiben: "",
    titel: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        lebenslauf: e.target.files![0]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    // Validierung der erforderlichen Felder
    if (!formData.lebenslauf) {
      setError('Bitte laden Sie Ihren Lebenslauf hoch');
      return;
    }

    if (!formData.verfuegbarAb) {
      setError('Bitte geben Sie Ihr Verfügbarkeitsdatum an');
      return;
    }

    // Validierung des Datums
    const verfuegbarAbDate = new Date(formData.verfuegbarAb + 'T00:00:00.000Z');
    if (isNaN(verfuegbarAbDate.getTime())) {
      setError('Bitte geben Sie ein gültiges Datum ein');
      return;
    }

    if (verfuegbarAbDate < new Date()) {
      setError('Das Verfügbarkeitsdatum muss in der Zukunft liegen');
      return;
    }

    if (!formData.mobilitaet) {
      setError('Bitte wählen Sie Ihre Mobilität');
      return;
    }

    if (!formData.ausbildung) {
      setError('Bitte geben Sie Ihre Ausbildung an');
      return;
    }

    if (!formData.beruf) {
      setError('Bitte wählen Sie Ihren Beruf');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Zuerst den Lebenslauf zu S3 hochladen
      let lebenslaufUrl = '';
      if (formData.lebenslauf) {
        // 1. Pre-signed URL vom Backend holen
        const presignRes = await fetch(`${getApiUrl()}/api/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: formData.lebenslauf.name,
            fileType: formData.lebenslauf.type,
          }),
        });
        if (!presignRes.ok) throw new Error('Fehler beim Anfordern der Upload-URL');
        const { url, key } = await presignRes.json();

        // 2. Datei direkt zu S3 hochladen
        const uploadRes = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': formData.lebenslauf.type },
          body: formData.lebenslauf,
        });
        if (!uploadRes.ok) throw new Error('Fehler beim Hochladen zu S3');

        // 3. S3-URL merken
        lebenslaufUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
      }

      // Dann die Zahlung verarbeiten
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?data=${encodeURIComponent(JSON.stringify({
            ...formData,
            titel: formData.beruf,
            lebenslauf: lebenslaufUrl,
            verfuegbarAb: verfuegbarAbDate.toISOString(),
            mobilitaet: formData.mobilitaet || 'In der Region',
            ausbildung: formData.ausbildung || '',
            beruf: formData.beruf || '',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 Tage
          }))}&type=suche-einen-job`,
        },
      });

      if (submitError) {
        throw new Error(submitError.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      {error && (
        <div className="alert alert-danger d-flex align-items-center bg-danger-subtle border-danger-subtle text-white" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{error}</div>
        </div>
      )}

      <div className="card shadow-sm border-0 mb-4 bg-dark">
        <div className="card-body p-4">
          <h4 className="card-title mb-4 text-white">Berufliche Details</h4>
          
          <div className="mb-4">
            <label htmlFor="beruf" className="form-label fw-medium text-white">Berufsbezeichnung *</label>
            <select
              className="form-select bg-dark text-white border-secondary"
              id="beruf"
              name="beruf"
              value={formData.beruf}
              onChange={handleChange}
              required
            >
              <option value="">Bitte wählen</option>
              {[...berufe].sort((a, b) => a.titel.localeCompare(b.titel)).map((beruf) => (
                <option key={beruf.id} value={beruf.titel}>{beruf.titel}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="standort" className="form-label fw-medium text-body-emphasis">Gewünschter Arbeitsort *</label>
            <LocationInput
              value={formData.standort}
              onChange={(value) => setFormData(prev => ({ ...prev, standort: value }))}
              required
            />
            <div className="form-text text-body-secondary">
              Bitte geben Sie einen Schweizer Ort ein. Der Kanton wird automatisch zugewiesen.
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="erfahrung" className="form-label fw-medium text-white">Berufserfahrung *</label>
            <select 
              className="form-select bg-dark text-white border-secondary" 
              id="erfahrung" 
              name="erfahrung" 
              value={formData.erfahrung} 
              onChange={handleChange} 
              required
            >
              <option value="">Bitte wählen</option>
              <option value="Berufseinsteiger">Berufseinsteiger</option>
              <option value="1-3 Jahre">1-3 Jahre</option>
              <option value="3-5 Jahre">3-5 Jahre</option>
              <option value="5+ Jahre">5+ Jahre</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="ausbildung" className="form-label fw-medium text-white">Ausbildung/Abschlüsse *</label>
            <textarea 
              className="form-control bg-dark text-white border-secondary" 
              id="ausbildung" 
              name="ausbildung" 
              rows={3} 
              value={formData.ausbildung} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="mb-4">
            <label htmlFor="beschreibung" className="form-label fw-medium text-white">Kurze Beschreibung Ihrer Qualifikationen *</label>
            <textarea 
              className="form-control bg-dark text-white border-secondary" 
              id="beschreibung" 
              name="beschreibung" 
              rows={5} 
              value={formData.beschreibung} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="mb-4">
            <label htmlFor="mobilitaet" className="form-label fw-medium text-white">Mobilität *</label>
            <select 
              className="form-select bg-dark text-white border-secondary" 
              id="mobilitaet" 
              name="mobilitaet" 
              value={formData.mobilitaet} 
              onChange={handleChange} 
              required
            >
              <option value="In der Region">In der Region</option>
              <option value="Schweizweit">Schweizweit</option>
              <option value="International">International</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="artDerStelle" className="form-label fw-medium text-white">Gewünschte Anstellungsart *</label>
            <select 
              className="form-select bg-dark text-white border-secondary" 
              id="artDerStelle" 
              name="artDerStelle" 
              value={formData.artDerStelle} 
              onChange={handleChange} 
              required
            >
              <option value="Vollzeit">Vollzeit</option>
              <option value="Teilzeit">Teilzeit</option>
              <option value="Befristet">Befristet</option>
              <option value="Projektarbeit">Projektarbeit</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4 bg-dark">
        <div className="card-body p-4">
          <h4 className="card-title mb-4 text-white">Kontaktdaten</h4>
          
          <div className="mb-4">
            <label htmlFor="kontaktEmail" className="form-label fw-medium text-white">E-Mail *</label>
            <input
              type="email"
              className="form-control bg-dark text-white border-secondary"
              id="kontaktEmail"
              name="kontaktEmail"
              value={formData.kontaktEmail}
              onChange={handleChange}
              required
              placeholder="max.mustermann@beispiel.ch"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="kontaktTelefon" className="form-label fw-medium text-white">Telefon (optional)</label>
            <input
              type="tel"
              className="form-control bg-dark text-white border-secondary"
              id="kontaktTelefon"
              name="kontaktTelefon"
              value={formData.kontaktTelefon}
              onChange={handleChange}
              placeholder="+41 79 123 45 67"
            />
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4 bg-dark">
        <div className="card-body p-4">
          <h4 className="card-title mb-4 text-white">Dokumente</h4>
          
          <div className="mb-4">
            <label htmlFor="lebenslauf" className="form-label fw-medium text-white">Lebenslauf (PDF) *</label>
            <input
              type="file"
              className="form-control bg-dark text-white border-secondary"
              id="lebenslauf"
              name="lebenslauf"
              onChange={handleFileChange}
              accept=".pdf"
              required
            />
            <div className="form-text text-white-50">
              Bitte laden Sie Ihren Lebenslauf als PDF-Datei hoch (max. 5MB)
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="anschreiben" className="form-label fw-medium text-white">Anschreiben (optional)</label>
            <textarea
              className="form-control bg-dark text-white border-secondary"
              id="anschreiben"
              name="anschreiben"
              rows={4}
              value={formData.anschreiben}
              onChange={handleChange}
              placeholder="Optional: Fügen Sie hier Ihr Anschreiben ein..."
            />
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4 bg-dark">
        <div className="card-body p-4">
          <h4 className="card-title mb-4 text-white">Zahlungsinformationen</h4>
          <div className="payment-element-wrapper">
            <PaymentElement />
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <button 
          type="button" 
          className="btn btn-outline-light px-4"
          onClick={() => setShowForm(false)}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Zurück zur Auswahl
        </button>
        <button 
          type="submit" 
          className="btn btn-primary px-5"
          disabled={!stripe || isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Wird verarbeitet...
            </>
          ) : (
            'Jobsuche veröffentlichen'
          )}
        </button>
      </div>
    </form>
  );
}

export default function SucheEinenJob() {
  const [showForm, setShowForm] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage | null>(null);

  const handlePackageSelect = async (pkg: PricingPackage) => {
    setSelectedPackage(pkg);
    try {
      const response = await fetch(`${getApiUrl()}/api/payment/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: pkg.price * 100,
          packageId: pkg.id,
          packageName: pkg.name,
          type: 'suche-einen-job',
          duration: pkg.duration
        }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Erstellen der Zahlungsabsicht');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
      setShowForm(true);
    } catch (error) {
      console.error('Fehler beim Erstellen des Payment Intents:', error);
    }
  };

  return (
    <main className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3 text-white">Jobsuche veröffentlichen</h1>
        <p className="lead text-white-50">
          Wählen Sie ein Paket und veröffentlichen Sie Ihre Jobsuche
        </p>
      </div>

      <div className="container px-4">
        {!showForm ? (
          <div className="row g-4 justify-content-center">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} onSelect={handlePackageSelect} />
            ))}
          </div>
        ) : clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="card shadow-sm border-0 bg-dark">
                  <div className="card-body p-4">
                    <h3 className="card-title h4 mb-4 text-white">Jobsuche erstellen</h3>
                    <JobSucheFormular 
                      setShowForm={setShowForm} 
                      clientSecret={clientSecret}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Elements>
        ) : (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Lade Zahlungsdaten…</span>
            </div>
            <p className="mt-3 text-white-50">Lade Zahlungsdaten…</p>
          </div>
        )}

        <div className="text-center mt-5">
          <div className="d-inline-flex align-items-center gap-3 text-white-50">
            <i className="bi bi-shield-check"></i>
            <span>✓ Keine automatische Verlängerung</span>
            <i className="bi bi-shield-check"></i>
            <span>✓ Keine versteckten Kosten</span>
          </div>
        </div>
      </div>
    </main>
  );
} 