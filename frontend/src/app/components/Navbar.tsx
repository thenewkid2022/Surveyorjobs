"use client";
import Link from "next/link";
import { useState } from "react";
import { theme } from "@/styles/theme";
import { kantone } from "@shared/lib/kantone";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link href="/" className="navbar-brand fw-bold text-primary">BauJobs</Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>          
          <div className="d-flex gap-2 ms-auto">
            <Link href="/filter/berufsfeld" className="btn btn-outline-primary fw-bold">
              Berufsfeld wählen
            </Link>
            <Link href="/filter/kanton" className="btn btn-outline-success fw-bold">
              Kanton wählen
            </Link>
            <Link href="/suche-einen-job" className="btn btn-warning fw-bold">Suche einen Job</Link>
            <Link href="/stellenanzeigen-aufgeben" className="btn btn-warning fw-bold">Stellenanzeigen aufgeben</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
