import Link from "next/link";
import { FaEnvelope, FaPhone, FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="py-5 mt-auto bg-light border-top border-secondary">
      <div className="container">
        {/* Hauptbereich */}
        <div className="row g-4">
          {/* Über uns */}
          <div className="col-12 col-md-3">
            <h5 className="mb-3 fw-bold text-primary">BauJobs</h5>
            <p className="text-secondary mb-3 small">
              Ihre Plattform für Jobs und Stellenanzeigen in der Baubranche. Spezialisiert auf Bauberufe, von Bauarbeitern über Poliere bis hin zu Bauingenieuren.
            </p>
            <div className="d-flex gap-3">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-primary hover-opacity-75">
                <FaLinkedin size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-primary hover-opacity-75">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-primary hover-opacity-75">
                <FaTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-12 col-md-3">
            <h5 className="mb-3 fw-bold text-primary">Quick Links</h5>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <Link href="/#jobs" className="text-decoration-none text-secondary">
                  Jobs finden
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/#stellenanzeigen" className="text-decoration-none text-secondary">
                  Stellenanzeigen
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/stellenanzeigen-aufgeben" className="text-decoration-none text-secondary">
                  Job inserieren
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/suche-einen-job" className="text-decoration-none text-secondary">
                  Suche einen Job
                </Link>
              </li>
            </ul>
          </div>

          {/* Rechtliches */}
          <div className="col-12 col-md-3">
            <h5 className="mb-3 fw-bold text-primary">Rechtliches</h5>
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <Link href="/impressum" className="text-decoration-none text-secondary">
                  Impressum
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/datenschutz" className="text-decoration-none text-secondary">
                  Datenschutz
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/agb" className="text-decoration-none text-secondary">
                  AGB
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/cookie-richtlinie" className="text-decoration-none text-secondary">
                  Cookie-Richtlinie
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div className="col-12 col-md-3">
            <h5 className="mb-3 fw-bold text-primary">Kontakt</h5>
            <ul className="list-unstyled mb-0">
              <li className="mb-2 d-flex align-items-center">
                <FaEnvelope className="me-2 text-primary" />
                <a href="mailto:info@baujobs.org" className="text-decoration-none text-secondary">
                  info@baujobs.org
                </a>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <FaPhone className="me-2 text-primary" />
                <a href="tel:+41791234567" className="text-decoration-none text-secondary">
                  +41 79 123 45 67
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Trennlinie */}
        <hr className="my-4 border-secondary opacity-25" />

        {/* Copyright */}
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <small className="text-secondary">
              © {new Date().getFullYear()} BauJobs. Alle Rechte vorbehalten.
            </small>
          </div>
          <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
            <small className="text-secondary">
              Made with <span className="text-danger">❤️</span> in Switzerland
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
} 