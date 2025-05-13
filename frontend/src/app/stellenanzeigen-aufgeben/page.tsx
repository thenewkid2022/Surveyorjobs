"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { kategorien } from "@shared/lib/berufe";
import { getApiUrl } from '@/utils/api';
import LocationInput from '@/app/components/LocationInput';
import { berufe } from "@shared/lib/berufe";
import { getKantonForOrt } from "@shared/lib/kantone";
import { FaUserTie } from "react-icons/fa";

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
    price: 79,
    duration: 30,
    features: ["Veröffentlichung in 24h", "1 Bild möglich", "Standard Sichtbarkeit"],
    newsletterInclusions: 1,
    images: 1,
    hasVideo: false,
    hasSocialMedia: false
  },
  {
    id: "plus",
    name: "Plus",
    price: 99,
    duration: 60,
    features: ["Veröffentlichung in 24h", "Bis zu 3 Bilder", "Social Media Posting", "Hervorgehobene Anzeige"],
    newsletterInclusions: 2,
    images: 3,
    hasVideo: false,
    hasSocialMedia: true
  },
  {
    id: "premium",
    name: "Premium",
    price: 139,
    duration: 90,
    features: ["Veröffentlichung in 24h", "Bis zu 5 Bilder", "Video möglich", "Social Media Posting", "Top-Anzeige", "Newsletter-Priorität"],
    newsletterInclusions: 3,
    images: 5,
    hasVideo: true,
    hasSocialMedia: true
  }
];

interface StellenanzeigeFormData {
  titel: string;
  beschreibung: string;
  standort: string;
  kontaktName: string;
  kontaktEmail: string;
  kontaktTelefon?: string;
  kanton?: string;
}

function StellenanzeigeFormular({ setShowForm, clientSecret, selectedPackage }: { setShowForm: (show: boolean) => void, clientSecret: string, selectedPackage: PricingPackage }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<StellenanzeigeFormData>({
    titel: "",
    beschreibung: "",
    standort: "",
    kontaktName: "",
    kontaktEmail: "",
    kontaktTelefon: ""
  });
  const [titelSuggestions, setTitelSuggestions] = useState<string[]>([]);
  const [showTitelSuggestions, setShowTitelSuggestions] = useState(false);
  const titelInputRef = useRef<HTMLInputElement>(null);

  const handleTitelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, titel: value }));
    if (value.length > 1) {
      const suggestions = berufe
        .map(b => b.titel)
        .filter(titel => titel.toLowerCase().includes(value.toLowerCase()));
      setTitelSuggestions(suggestions);
      setShowTitelSuggestions(true);
    } else {
      setTitelSuggestions([]);
      setShowTitelSuggestions(false);
    }
  };

  const handleTitelSuggestionClick = (suggestion: string) => {
    setFormData(prev => ({ ...prev, titel: suggestion }));
    setShowTitelSuggestions(false);
    titelInputRef.current?.blur();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError(null);
    setIsLoading(true);
    if (!formData.standort) {
      setError("Bitte geben Sie einen Standort an");
      setIsLoading(false);
      return;
    }
    try {
      const kanton = getKantonForOrt(formData.standort);
      if (!kanton) {
        throw new Error("Bitte geben Sie einen gültigen Schweizer Ort ein.");
      }

      // Bestätige die Zahlung und leite zur Payment Success Page weiter
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?data=${encodeURIComponent(JSON.stringify({
            ...formData,
            kanton,
            packageId: selectedPackage.id,
            packageName: selectedPackage.name,
            duration: selectedPackage.duration,
            erstelltAm: new Date().toISOString(),
            expiresAt: new Date(Date.now() + selectedPackage.duration * 24 * 60 * 60 * 1000).toISOString(),
            status: 'aktiv'
          }))}&type=stellenanzeigen-aufgeben`,
        },
      });

      if (submitError) {
        throw new Error(submitError.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein unerwarteter Fehler ist aufgetreten");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="mb-3 position-relative">
        <label htmlFor="titel" className="form-label">Stellentitel *</label>
        <input
          type="text"
          className="form-control"
          id="titel"
          name="titel"
          value={formData.titel}
          onChange={handleTitelChange}
          required
          placeholder="z.B. Bauleiter/in"
          autoComplete="off"
          ref={titelInputRef}
          onFocus={() => setShowTitelSuggestions(titelSuggestions.length > 0)}
          onBlur={() => setTimeout(() => setShowTitelSuggestions(false), 200)}
        />
        {showTitelSuggestions && titelSuggestions.length > 0 && (
          <ul className="list-group position-absolute w-100 mt-1 shadow-sm" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
            {titelSuggestions.map((suggestion) => (
              <li
                key={suggestion}
                className="list-group-item list-group-item-action py-2"
                onClick={() => handleTitelSuggestionClick(suggestion)}
                style={{ cursor: 'pointer' }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="beschreibung" className="form-label">Stellenbeschreibung *</label>
        <textarea
          className="form-control"
          id="beschreibung"
          name="beschreibung"
          rows={5}
          value={formData.beschreibung}
          onChange={handleChange}
          required
          placeholder="Beschreiben Sie die Stelle und die Anforderungen..."
        />
      </div>
      <div className="mb-3">
        <label htmlFor="standort" className="form-label">Standort *</label>
        <LocationInput
          value={formData.standort}
          onChange={(value) => setFormData(prev => ({ ...prev, standort: value }))}
          required
        />
        <div className="form-text">
          Bitte geben Sie einen Schweizer Ort ein. Der Kanton wird automatisch zugewiesen.
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="kontaktName" className="form-label">Ansprechperson *</label>
        <input
          type="text"
          className="form-control"
          id="kontaktName"
          name="kontaktName"
          value={formData.kontaktName}
          onChange={handleChange}
          required
          placeholder="z.B. Max Mustermann"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="kontaktEmail" className="form-label">E-Mail der Ansprechperson *</label>
        <input
          type="email"
          className="form-control"
          id="kontaktEmail"
          name="kontaktEmail"
          value={formData.kontaktEmail}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="kontaktTelefon" className="form-label">Telefon der Ansprechperson (optional)</label>
        <input
          type="tel"
          className="form-control"
          id="kontaktTelefon"
          name="kontaktTelefon"
          value={formData.kontaktTelefon}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <PaymentElement />
      </div>
      <div className="d-flex justify-content-between">
        <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>
          Zurück zur Auswahl
        </button>
        <button type="submit" className="btn btn-success" disabled={!stripe || isLoading}>
          {isLoading ? 'Wird verarbeitet...' : 'Stellenanzeige aufgeben'}
        </button>
      </div>
    </form>
  );
}

export default function StellenanzeigeAufgeben() {
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
          type: 'stellenanzeigen-aufgeben',
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
        <h1 className="display-4 mb-3">Stellenanzeige aufgeben</h1>
        <p className="lead text-secondary">
          Wählen Sie ein Paket und veröffentlichen Sie Ihre Stellenanzeige
        </p>
      </div>

      <div className="container">
        {!showForm ? (
          <div className="row g-4 justify-content-center">
            {packages.map((pkg) => (
              <div className="col-md-4" key={pkg.id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <h3 className="card-title text-center mb-4">{pkg.name}</h3>
                    <div className="text-center mb-4">
                      <span className="display-4 fw-bold">{pkg.price} CHF</span>
                      <span className="text-muted">/ {pkg.duration} Tage</span>
                    </div>
                    <ul className="list-unstyled mb-4">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="mb-2">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto">
                      <button
                        className="btn btn-success w-100"
                        onClick={() => handlePackageSelect(pkg)}
                      >
                        Jetzt auswählen
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : clientSecret && selectedPackage ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h3 className="card-title mb-4">Stellenanzeige erstellen</h3>
                    <StellenanzeigeFormular 
                      setShowForm={setShowForm} 
                      clientSecret={clientSecret} 
                      selectedPackage={selectedPackage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Elements>
        ) : (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Lade Zahlungsdaten…</span>
            </div>
            <p className="mt-3 text-secondary">Lade Zahlungsdaten…</p>
          </div>
        )}

        <div className="text-center mt-4">
          <p className="text-secondary">
            <small>✓ Keine automatische Verlängerung ✓ Keine versteckten Kosten</small>
          </p>
        </div>
      </div>
    </main>
  );
} 