/**
 * Zentrale Definition des Job-Interfaces für die gesamte Anwendung.
 * Dieses Interface definiert die Struktur eines Stellenangebots.
 */
export interface Job {
  // Pflichtfelder
  _id: string;
  titel: string;
  beschreibung: string;
  standort: string;
  erstelltAm: string;
  kategorie: string;
  artDerStelle: string;
  status: string;
  
  // Optionale Felder
  unternehmen?: string;
  erfahrung?: string;
  kontaktName?: string;
  kontaktEmail?: string;
  kontaktTelefon?: string;
  expiresAt?: string;
  lebenslauf?: string;
  berufId?: string;
} 