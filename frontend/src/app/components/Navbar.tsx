"use client";
import Link from "next/link";
import { useState } from "react";
import { kantone } from "@shared/lib/kantone";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg sticky-top shadow-sm dark-mode-navbar">
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
          <div className="d-flex flex-column flex-lg-row gap-2 ms-auto mt-3 mt-lg-0">
            <Link href="/filter/berufsfeld" className="btn btn-outline-primary w-100 w-lg-auto dark-mode-btn" onClick={() => setIsMenuOpen(false)}>
              Berufsfeld wählen
            </Link>
            <Link href="/filter/kanton" className="btn btn-outline-primary w-100 w-lg-auto dark-mode-btn" onClick={() => setIsMenuOpen(false)}>
              Kanton wählen
            </Link>
            <Link href="/suche-einen-job" className="btn btn-warning w-100 w-lg-auto" onClick={() => setIsMenuOpen(false)}>Suche einen Job</Link>
            <Link href="/stellenanzeigen-aufgeben" className="btn btn-warning w-100 w-lg-auto" onClick={() => setIsMenuOpen(false)}>Stellenanzeigen aufgeben</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
