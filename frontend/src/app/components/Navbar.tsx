"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { kantone } from "@shared/lib/kantone";
import { FaCrown, FaPlus, FaUser, FaHome, FaUserEdit, FaCog, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaBriefcase, FaClipboardList, FaUsers, FaSearch } from 'react-icons/fa';

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
        <Link href="/" className="navbar-brand fw-bold text-brand-orange">BauJobs</Link>
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
            {/* Beide Buttons sind immer sichtbar für bessere UX */}
            <Link 
              href="/stellenanzeigen-aufgeben" 
              className="btn btn-warning d-flex align-items-center justify-content-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaBriefcase size={16} />
              Stellenanzeige aufgeben
            </Link>
            
            <Link 
              href="/suche-einen-job" 
              className="btn btn-success d-flex align-items-center justify-content-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaSearch size={16} />
              Stellengesuch erstellen
            </Link>

            {user ? (
              <div className="dropdown ms-lg-3">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsDropdownOpen(false), 150)}
                >
                  <FaUser className="me-1" />
                  {user.vorname}
                </button>
                {isDropdownOpen && (
                  <ul className="dropdown-menu dropdown-menu-end show">
                    <li>
                      <Link href="/dashboard" className="dropdown-item">
                        <FaHome className="me-2" />
                        Dashboard
                      </Link>
                    </li>
                    {user.accountTyp === 'arbeitgeber' && (
                      <>
                        <li>
                          <Link href="/stellenanzeigen-aufgeben" className="dropdown-item">
                            <FaBriefcase className="me-2" />
                            Stellenanzeige aufgeben
                          </Link>
                        </li>
                        <li>
                          <Link href="/meine-stellenanzeigen" className="dropdown-item">
                            <FaClipboardList className="me-2" />
                            Meine Stellenanzeigen
                          </Link>
                        </li>
                        <li>
                          <Link href="/cv-browser" className="dropdown-item">
                            <FaUsers className="me-2" />
                            CV-Browser
                          </Link>
                        </li>
                      </>
                    )}
                    {user.accountTyp === 'arbeitssuchender' && (
                      <>
                        <li>
                          <Link href="/suche-einen-job" className="dropdown-item">
                            <FaSearch className="me-2" />
                            Job suchen
                          </Link>
                        </li>
                        <li>
                          <Link href="/meine-stellengesuche" className="dropdown-item">
                            <FaClipboardList className="me-2" />
                            Meine Stellengesuche
                          </Link>
                        </li>
                        <li>
                          <Link href="/premium" className="dropdown-item">
                            <FaCrown className="me-2" />
                            Premium
                          </Link>
                        </li>
                      </>
                    )}
                    <li>
                      <Link href="/profile" className="dropdown-item">
                        <FaUser className="me-2" />
                        Profil
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <Link href="/settings" className="dropdown-item">
                        <FaCog className="me-2" />
                        Einstellungen
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button onClick={handleLogout} className="dropdown-item">
                        <FaSignOutAlt className="me-2" />
                        Abmelden
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaSignInAlt size={16} />
                  Anmelden
                </Link>
                <Link 
                  href="/register" 
                  className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
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
