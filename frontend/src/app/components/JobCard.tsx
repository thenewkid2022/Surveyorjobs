import { FaMapMarkerAlt, FaBuilding, FaBriefcase, FaCalendarAlt, FaUser } from "react-icons/fa";
import Link from "next/link";

interface JobCardProps {
  id: string;
  titel?: string;
  berufswunsch?: string;
  position?: string;
  standort: string;
  unternehmen?: string;
  artDerStelle?: string;
  erstelltAm: string;
  kategorie?: string;
  linkPrefix?: string;
  className?: string;
  type?: 'job' | 'search';
}

export default function JobCard({
  id,
  titel,
  berufswunsch,
  position,
  standort,
  unternehmen,
  artDerStelle,
  erstelltAm,
  kategorie,
  linkPrefix = "/jobs",
  className = "",
  type = 'job'
}: JobCardProps) {
  const link = kategorie ? `/${linkPrefix}/${kategorie}/${id}` : `/${linkPrefix}/${id}`;
  const displayTitle = type === 'job' ? titel : (berufswunsch || position);

  // Farbklassen zentral steuern
  const colorClass = type === 'job' ? 'primary' : 'success';

  return (
    <div className={`card h-100 border-${colorClass} bg-white ${className}`}>
      <div className="card-body">
        <h5 className={`card-title text-${colorClass}`}>{displayTitle}</h5>
        <div className="card-text">
          <p className="mb-2">
            <FaMapMarkerAlt className={`text-${colorClass} me-2`} />
            <span className="text-secondary">{standort}</span>
          </p>
          {type === 'job' && unternehmen && (
            <p className="mb-2">
              <FaBuilding className={`text-${colorClass} me-2`} />
              <span className="text-secondary">{unternehmen}</span>
            </p>
          )}
          {artDerStelle && (
            <p className="mb-2">
              <FaBriefcase className={`text-${colorClass} me-2`} />
              <span className="text-secondary">{artDerStelle}</span>
            </p>
          )}
          <p className="mb-3">
            <FaCalendarAlt className={`text-${colorClass} me-2`} />
            <span className="text-secondary">
              Eingestellt am: {new Date(erstelltAm).toLocaleDateString("de-DE")}
            </span>
          </p>
          <Link href={link} className={`btn btn-${colorClass} w-100`}>
            Details anzeigen
          </Link>
        </div>
      </div>
    </div>
  );
} 