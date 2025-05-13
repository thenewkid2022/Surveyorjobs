"use client";
import { useState } from "react";
import { kantone, kantonNamen } from "@shared/lib/kantone";
import { useRouter } from "next/navigation";

export default function KantonFilterPage() {
  const [selectedKanton, setSelectedKanton] = useState<string | null>(null);
  const router = useRouter();

  const handleApply = () => {
    if (selectedKanton) {
      router.push(`/berufe/alle?kanton=${selectedKanton}`);
    }
  };

  return (
    <main className="bg-white min-vh-100 font-sans">
      <div className="container py-5">
        <h1 className="display-5 fw-bold text-primary mb-4 text-center">Kanton wählen</h1>
        <div className="row g-3 mb-4">
          {kantone.map((kuerzel) => (
            <div className="col-6 col-md-3" key={kuerzel}>
              <button
                className={`w-100 btn btn-lg btn-outline-primary`}
                onClick={() => router.push(`/berufe/alle?kanton=${kuerzel}`)}
              >
                <span className="d-md-none fw-bold">{kuerzel}</span>
                <span className="d-none d-md-inline">{kantonNamen[kuerzel]}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 