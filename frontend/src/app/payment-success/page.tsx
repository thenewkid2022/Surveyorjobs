"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { getApiUrl } from '@/utils/api';
import { berufe } from "@shared/lib/berufe";

interface StellenanzeigeData {
  titel?: string;
  beschreibung?: string;
  standort?: string;
  kategorie?: string;
  beruf?: string;
  erfahrung?: string;
  ausbildung?: string;
  faehigkeiten?: string[];
  sprachen?: string[];
  mobilitaet?: string;
  artDerStelle?: string;
  verfuegbarAb?: string;
  kontaktEmail?: string;
  kontaktTelefon?: string;
  lebenslauf?: string;
  anschreiben?: string;
  expiresAt?: string;
  packageId?: string;
  packageName?: string;
  duration?: number;
}

export default function PaymentSuccess() {
  const [status, setStatus] = useState<'pending'|'success'|'error'>('pending');
  const [message, setMessage] = useState<string>('');
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const searchParams = new URLSearchParams(window.location.search);
    const data = searchParams.get('data');
    const type = searchParams.get('type');
    const paymentIntent = searchParams.get('payment_intent');
    const redirectStatus = searchParams.get('redirect_status');

    if (redirectStatus !== 'succeeded') {
      setStatus('error');
      setMessage('Die Zahlung war nicht erfolgreich. Bitte versuchen Sie es erneut.');
      return;
    }

    if (!data || !type || !paymentIntent) {
      setStatus('error');
      setMessage('Fehlende Daten. Bitte kontaktieren Sie den Support.');
      return;
    }

    try {
      const parsedData: StellenanzeigeData = JSON.parse(data);

      // Validierung der Datumswerte
      if (parsedData.verfuegbarAb) {
        const verfuegbarAbDate = new Date(parsedData.verfuegbarAb);
        if (isNaN(verfuegbarAbDate.getTime())) {
          throw new Error('Ungültiges Verfügbarkeitsdatum');
        }
      }

      if (parsedData.expiresAt) {
        const expiresAtDate = new Date(parsedData.expiresAt);
        if (isNaN(expiresAtDate.getTime())) {
          throw new Error('Ungültiges Ablaufdatum');
        }
      }

      // Finde die Kategorie basierend auf dem Beruf
      if (type === 'suche-einen-job' && parsedData.beruf) {
        const beruf = berufe.find(b => b.titel === parsedData.beruf);
        if (beruf) {
          parsedData.kategorie = beruf.kategorie;
        } else {
          throw new Error('Ungültiger Beruf');
        }
      }

      // Token-Generierung
      fetch(`${getApiUrl()}/api/auth/temp-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: paymentIntent })
      })
      .then(async res => {
        if (!res.ok) {
          const responseData = await res.json();
          throw new Error(responseData.message || 'Fehler bei der Token-Generierung');
        }
        return res.json();
      })
      .then(({ token }) => {
        // Daten transformieren
        const transformedData = {
          ...parsedData,
          erstelltAm: new Date().toISOString(),
          status: 'aktiv'
        };

        // Endpunkt basierend auf Typ wählen
        const endpoint = type === 'stellenanzeigen-aufgeben' 
          ? '/api/stellenanzeigen-aufgeben'
          : '/api/suche-einen-job';

        // Veröffentlichung mit Token
        return fetch(`${getApiUrl()}${endpoint}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(transformedData)
        });
      })
      .then(async res => {
        if (!res.ok) {
          const responseData = await res.json();
          throw new Error(responseData.message || 'Fehler bei der Veröffentlichung');
        }
        return res.json();
      })
      .then(() => {
        setStatus('success');
        setMessage(type === 'stellenanzeigen-aufgeben' 
          ? 'Deine Stellenanzeige wurde erfolgreich veröffentlicht!'
          : 'Deine Jobsuche wurde erfolgreich veröffentlicht!');
      })
      .catch((error) => {
        console.error('Fehler im Prozess:', error);
        setStatus('error');
        setMessage(`Fehler beim Veröffentlichen: ${error.message}. Bitte kontaktiere den Support.`);
      });
    } catch (error) {
      console.error('Fehler beim Parsen der Daten:', error);
      setStatus('error');
      setMessage('Fehler bei der Verarbeitung der Daten. Bitte kontaktiere den Support.');
    }
  }, []);

  return (
    <main className="bg-light min-vh-100 font-sans d-flex flex-column justify-content-center align-items-center p-3">
      <h1 className="display-4 text-success mb-3 text-center">
        {status === 'success' ? 'Erfolg!' : status === 'error' ? 'Fehler' : 'Verarbeite...'}
      </h1>
      <p className="lead mb-3 text-center">{message}</p>
      <Link href="/" className="w-100 w-md-auto">
        <button className="btn btn-success btn-lg w-100 w-md-auto">
          Zurück zur Startseite
        </button>
      </Link>
    </main>
  );
} 