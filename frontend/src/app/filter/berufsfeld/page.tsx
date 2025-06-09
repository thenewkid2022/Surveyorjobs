"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { kategorien, berufe } from "@shared/lib/berufe";

// Mapping von Kategorie-Werten zu URL-Schlüsseln
const kategorieToUrlKey: { [key: string]: string } = {
  'Hochbau': 'hochbau',
  'Tiefbau': 'tiefbau',
  'Ausbau': 'ausbau',
  'Planung & Technik': 'planung',
  'Weitere Berufe': 'weitere'
};

export default function BerufsfeldFilterPage() {
  const router = useRouter();
  const [selectedKategorie, setSelectedKategorie] = useState<string>("");

  // DEBUG: Überprüfe alle einzigartigen Kategorien aus dem berufe-Array
  const uniqueKategorienFromBerufe = [...new Set(berufe.map(b => b.kategorie))];
  console.log('🔍 DEBUG - Eindeutige Kategorien aus berufe-Array:', uniqueKategorienFromBerufe);
  
  // DEBUG: Schaue direkt in das importierte kategorien-Objekt
  console.log('🔍 DEBUG - kategorien direkt importiert:', kategorien);
  console.log('🔍 DEBUG - typeof kategorien:', typeof kategorien);
  console.log('🔍 DEBUG - kategorien keys:', Object.keys(kategorien));

  const handleApply = () => {
    if (selectedKategorie) {
      // Konvertiere den ausgewählten Wert in den URL-Schlüssel
      const urlKey = kategorieToUrlKey[selectedKategorie];
      if (urlKey) {
        router.push(`/berufe/${urlKey}`);
      }
    }
  };

  return (
    <main className="bg-white min-vh-100 font-sans">
      <div className="container py-5">
        <h1 className="display-5 fw-bold text-primary mb-4">Berufsfeld auswählen</h1>
        <div className="row g-4">
          {Object.entries(kategorien).map(([key, titel]) => {
            console.log('🔍 DEBUG - Rendering Button:', { key, titel });
            return (
              <div className="col-12 col-md-4" key={key}>
                <button
                  className="btn btn-outline-primary w-100 py-3"
                  onClick={() => {
                    const urlKey = kategorieToUrlKey[titel];
                    if (urlKey) {
                      router.push(`/berufe/${urlKey}`);
                    }
                  }}
                >
                  {titel}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
} 