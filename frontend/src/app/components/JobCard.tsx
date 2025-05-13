import { FaMapMarkerAlt, FaBuilding, FaBriefcase, FaCalendarAlt } from "react-icons/fa";
import Link from "next/link";

interface JobCardProps {
  id: string;
  titel?: string;
  beruf?: string;
  berufswunsch?: string;
  position?: string;
  standort: string;
  unternehmen?: string;
  artDerStelle: string;
  erstelltAm: string;
  kategorie?: string;
  linkPrefix?: string;
  className?: string;
  type?: 'job' | 'search';
}

export default function JobCard({
  id,
  titel,
  beruf,
  berufswunsch,
  position,
  standort = "",
  unternehmen,
  artDerStelle = "Vollzeit",
  erstelltAm,
  kategorie,
  linkPrefix = "/jobs",
  className = "",
  type = 'job'
}: JobCardProps) {
  console.log('JobCard erstelltAm:', erstelltAm, 'Typ:', typeof erstelltAm);
  const link = kategorie ? `/${linkPrefix}/${kategorie}/${id}` : `/${linkPrefix}/${id}`;
  const displayTitle = type === 'job' ? titel : (beruf || berufswunsch || position);

  // Farbklassen zentral steuern
  const colorClass = type === 'job' ? 'primary' : 'success';

  // Datum formatieren
  const formattedDate = erstelltAm ? new Date(erstelltAm).toLocaleDateString("de-DE", {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }) : 'Datum nicht verfügbar';
  console.log('JobCard formatiertes Datum:', formattedDate);

  // Debug-Rendering
  console.log('JobCard Rendering mit Datum:', {
    erstelltAm,
    formattedDate,
    hasErstelltAm: Boolean(erstelltAm)
  });

  return (
    <div className={`card h-100 border-${colorClass} bg-white ${className}`}>
      <div className="card-body d-flex flex-column">
        {/* Titel - immer sichtbar */}
        <h5 className={`card-title text-${colorClass} mb-3`}>{displayTitle || 'Kein Titel verfügbar'}</h5>
        
        <div className="card-text flex-grow-1">
          {/* Standort - immer sichtbar */}
          <p className="mb-2">
            <FaMapMarkerAlt className={`text-${colorClass} me-2`} />
            <span className="text-secondary">{standort}</span>
          </p>

          {/* Unternehmen - wenn vorhanden */}
          {type === 'job' && unternehmen && (
            <p className="mb-2">
              <FaBuilding className={`text-${colorClass} me-2`} />
              <span className="text-secondary">{unternehmen}</span>
            </p>
          )}

          {/* Art der Stelle - immer sichtbar */}
          <p className="mb-2">
            <FaBriefcase className={`text-${colorClass} me-2`} />
            <span className="text-secondary">{artDerStelle}</span>
          </p>

          {/* Eingestelltes Datum - immer sichtbar */}
          <p className="mb-3 text-muted small">
            <FaCalendarAlt className={`text-${colorClass} me-2`} />
            <span className="text-secondary">Eingestellt am: {formattedDate}</span>
          </p>
        </div>

        {/* Details Button - immer am unteren Rand */}
        <Link href={link} className={`btn btn-${colorClass} w-100 mt-auto`}>
          Details anzeigen
        </Link>
      </div>
    </div>
  );
} 