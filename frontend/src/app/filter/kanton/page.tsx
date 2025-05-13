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
        <h1 className="display-5 fw-bold text-success mb-4 text-center">Kanton wählen</h1>
        <div className="row g-3 mb-4">
          {kantone.map((kuerzel) => (
            <div className="col-6 col-md-3" key={kuerzel}>
              <button
                className={`w-100 btn btn-lg ${selectedKanton === kuerzel ? "btn-success" : "btn-outline-success"}`}
                onClick={() => setSelectedKanton(kuerzel)}
              >
                {kantonNamen[kuerzel]}
              </button>
            </div>
          ))}
        </div>
        <div className="text-center mt-5">
          <button
            className="btn btn-success btn-lg px-5"
            onClick={handleApply}
            disabled={!selectedKanton}
          >
            Anzeigen filtern
          </button>
        </div>
      </div>
    </main>
  );
} 