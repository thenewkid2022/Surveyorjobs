"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { kantone } from "@shared/lib/kantone";
import { FaCrown, FaPlus, FaUser, FaHome, FaUserEdit, FaCog, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

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
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/filter/berufsfeld" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Berufsfeld wählen
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/filter/kanton" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Kanton wählen
              </Link>
            </li>
          </ul>
          
          <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2 ms-auto">
            {user?.accountTyp === 'arbeitgeber' && (
              <Link 
                href="/stellenanzeigen-aufgeben" 
                className="btn btn-warning d-flex align-items-center justify-content-center gap-2 order-1 order-lg-1"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaPlus size={16} />
                Stellenanzeige aufgeben
              </Link>
            )}
            {user?.accountTyp === 'arbeitssuchender' && (
              <Link 
                href="/suche-einen-job" 
                className="btn btn-warning d-flex align-items-center justify-content-center gap-2 order-1 order-lg-1"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaPlus size={16} />
                Stellengesuch erstellen
              </Link>
            )}

            {user ? (
              <>
                <Link 
                  href="/premium" 
                  className="btn btn-outline-warning d-flex align-items-center justify-content-center gap-2 order-2 order-lg-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaCrown size={16} />
                  Premium
                </Link>
                <div className="dropdown order-3 order-lg-3">
                  <button
                    className="btn btn-outline-primary dropdown-toggle d-flex align-items-center justify-content-center gap-2"
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <FaUser size={16} />
                    {user.vorname} {user.nachname}
                  </button>
                  <div className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? 'show' : ''} ${isMenuOpen ? 'mt-2' : ''}`}>
                    <Link href="/dashboard" className="dropdown-item d-flex align-items-center gap-2" onClick={() => setIsDropdownOpen(false)}>
                      <FaHome size={16} />
                      Dashboard
                    </Link>
                    <Link href="/profile" className="dropdown-item d-flex align-items-center gap-2" onClick={() => setIsDropdownOpen(false)}>
                      <FaUserEdit size={16} />
                      Profil
                    </Link>
                    <Link href="/settings" className="dropdown-item d-flex align-items-center gap-2" onClick={() => setIsDropdownOpen(false)}>
                      <FaCog size={16} />
                      Einstellungen
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item text-danger d-flex align-items-center gap-2" onClick={handleLogout}>
                      <FaSignOutAlt size={16} />
                      Abmelden
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2 order-2 order-lg-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaSignInAlt size={16} />
                  Anmelden
                </Link>
                <Link 
                  href="/register" 
                  className="btn btn-primary d-flex align-items-center justify-content-center gap-2 order-3 order-lg-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUserPlus size={16} />
                  Registrieren
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
