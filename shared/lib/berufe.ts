export interface Beruf {
  id: string;
  titel: string;
  kategorie: string;
  ausbildung?: string;
}

export const berufe: Beruf[] = [
  // Hochbau
  { id: 'maurer', titel: 'Maurer/in EFZ', kategorie: 'Hochbau', ausbildung: 'EFZ' },
  { id: 'betonbauer', titel: 'Beton- und Stahlbetonbauer/in EFZ', kategorie: 'Hochbau', ausbildung: 'EFZ' },
  { id: 'trockenbauer', titel: 'Trockenbauer/in EFZ', kategorie: 'Hochbau', ausbildung: 'EFZ' },
  { id: 'zimmerer', titel: 'Zimmerer/Zimmermann/Zimmerin EFZ', kategorie: 'Hochbau', ausbildung: 'EFZ' },
  { id: 'maler', titel: 'Maler/in EFZ', kategorie: 'Hochbau', ausbildung: 'EFZ' },
  { id: 'fliesenleger', titel: 'Fliesenleger/in EFZ', kategorie: 'Hochbau', ausbildung: 'EFZ' },
  { id: 'natursteinbearbeiter', titel: 'Natursteinbearbeiter/in EFZ', kategorie: 'Hochbau', ausbildung: 'EFZ' },
  { id: 'bauhelfer-hochbau', titel: 'Bauhelfer/in Hochbau', kategorie: 'Hochbau' },

  // Tiefbau
  { id: 'strassenbauer', titel: 'Strassenbauer/in EFZ', kategorie: 'Tiefbau', ausbildung: 'EFZ' },
  { id: 'tiefbaufacharbeiter', titel: 'Tiefbaufacharbeiter/in EBA', kategorie: 'Tiefbau', ausbildung: 'EBA' },
  { id: 'gleisbauer', titel: 'Gleisbauer/in EFZ', kategorie: 'Tiefbau', ausbildung: 'EFZ' },
  { id: 'grundbauer', titel: 'Grundbauer/in EFZ', kategorie: 'Tiefbau', ausbildung: 'EFZ' },
  { id: 'kanalbauer', titel: 'Kanalbauer/in EFZ', kategorie: 'Tiefbau', ausbildung: 'EFZ' },
  { id: 'bauhelfer-tiefbau', titel: 'Bauhelfer/in Tiefbau', kategorie: 'Tiefbau' },

  // Ausbau
  { id: 'schreiner', titel: 'Schreiner/in EFZ', kategorie: 'Ausbau', ausbildung: 'EFZ' },
  { id: 'elektroinstallateur', titel: 'Elektroinstallateur/in EFZ', kategorie: 'Ausbau', ausbildung: 'EFZ' },
  { id: 'heizungsinstallateur', titel: 'Heizungsinstallateur/in EFZ', kategorie: 'Ausbau', ausbildung: 'EFZ' },
  { id: 'sanitaerinstallateur', titel: 'Sanitärinstallateur/in EFZ', kategorie: 'Ausbau', ausbildung: 'EFZ' },
  { id: 'dachdecker', titel: 'Dachdecker/in EFZ', kategorie: 'Ausbau', ausbildung: 'EFZ' },
  { id: 'spengler', titel: 'Spengler/in EFZ', kategorie: 'Ausbau', ausbildung: 'EFZ' },
  { id: 'lueftungsinstallateur', titel: 'Lüftungsinstallateur/in EFZ', kategorie: 'Ausbau', ausbildung: 'EFZ' },
  { id: 'kaeltesystem-monteur', titel: 'Kältesystem-Monteur/in EFZ', kategorie: 'Ausbau', ausbildung: 'EFZ' },
  { id: 'plattenleger', titel: 'Plattenleger/in EFZ', kategorie: 'Ausbau', ausbildung: 'EFZ' },
  { id: 'bodenleger', titel: 'Bodenleger/in EFZ', kategorie: 'Ausbau', ausbildung: 'EFZ' },
  { id: 'anstreicher', titel: 'Anstreicher/in EFZ', kategorie: 'Ausbau', ausbildung: 'EFZ' },
  { id: 'gipser', titel: 'Gipser/in EFZ', kategorie: 'Ausbau', ausbildung: 'EFZ' },

  // Planung & Technik
  { id: 'architekt', titel: 'Architekt/in FH/ETH', kategorie: 'Planung & Technik', ausbildung: 'FH/ETH' },
  { id: 'bauingenieur', titel: 'Bauingenieur/in FH/ETH', kategorie: 'Planung & Technik', ausbildung: 'FH/ETH' },
  { id: 'bauzeichner', titel: 'Bauzeichner/in EFZ', kategorie: 'Planung & Technik', ausbildung: 'EFZ' },
  { id: 'geomatiker', titel: 'Geomatiker/in EFZ', kategorie: 'Planung & Technik', ausbildung: 'EFZ' },
  { id: 'vermessungstechniker', titel: 'Vermessungstechniker/in EFZ', kategorie: 'Planung & Technik', ausbildung: 'EFZ' },
  { id: 'bauleiter', titel: 'Bauleiter/in HFP', kategorie: 'Planung & Technik', ausbildung: 'HFP' },
  { id: 'bauoekonom', titel: 'Bauökonom/in FH', kategorie: 'Planung & Technik', ausbildung: 'FH' },
  { id: 'facility-manager', titel: 'Facility Manager/in FH', kategorie: 'Planung & Technik', ausbildung: 'FH' },
  { id: 'innenarchitekt', titel: 'Innenarchitekt/in FH', kategorie: 'Planung & Technik', ausbildung: 'FH' },

  // Weitere Berufe
  { id: 'baumaschinenmechaniker', titel: 'Baumaschinenmechaniker/in EFZ', kategorie: 'Weitere Berufe', ausbildung: 'EFZ' },
  { id: 'landschaftsgaertner', titel: 'Landschaftsgärtner/in EFZ', kategorie: 'Weitere Berufe', ausbildung: 'EFZ' },
  { id: 'gartenbauer', titel: 'Gartenbauer/in EFZ', kategorie: 'Weitere Berufe', ausbildung: 'EFZ' },
  { id: 'forstwart', titel: 'Forstwart/in EFZ', kategorie: 'Weitere Berufe', ausbildung: 'EFZ' },
  { id: 'metallbauer', titel: 'Metallbauer/in EFZ', kategorie: 'Weitere Berufe', ausbildung: 'EFZ' },
  { id: 'schlossereimechaniker', titel: 'Schlossereimechaniker/in EFZ', kategorie: 'Weitere Berufe', ausbildung: 'EFZ' },
  { id: 'baufuehrer', titel: 'Bauführer/in', kategorie: 'Weitere Berufe' },
  { id: 'polier', titel: 'Polier/in', kategorie: 'Weitere Berufe' },
  { id: 'bauvorarbeiter', titel: 'Bauvorarbeiter/in', kategorie: 'Weitere Berufe' },
  { id: 'kranfuehrer', titel: 'Kranführer/in', kategorie: 'Weitere Berufe' },
  { id: 'betontrennfachmann', titel: 'Betontrennfachmann/-frau', kategorie: 'Weitere Berufe' },
  { id: 'sprengfachmann', titel: 'Sprengfachmann/-frau', kategorie: 'Weitere Berufe' },

  // Spezialisierte Berufe
  { id: 'fassadenbauer', titel: 'Fassadenbauer/in EFZ', kategorie: 'Weitere Berufe', ausbildung: 'EFZ' },
  { id: 'holzbau-polier', titel: 'Holzbau-Polier/in HFP', kategorie: 'Weitere Berufe', ausbildung: 'HFP' },
  { id: 'beton-polier', titel: 'Beton- und Stahlbetonbau-Polier/in HFP', kategorie: 'Weitere Berufe', ausbildung: 'HFP' },
  { id: 'strassenbau-polier', titel: 'Strassenbau-Polier/in HFP', kategorie: 'Weitere Berufe', ausbildung: 'HFP' },
  { id: 'tiefbau-polier', titel: 'Tiefbau-Polier/in HFP', kategorie: 'Weitere Berufe', ausbildung: 'HFP' },
  { id: 'bauwerktrenner', titel: 'Bauwerktrenner/in', kategorie: 'Weitere Berufe' },
  { id: 'denkmalpfleger', titel: 'Denkmalpfleger/in', kategorie: 'Weitere Berufe' },

  // Verwaltung
  { id: 'bauadministrationsfachmann', titel: 'Bauadministrationsfachmann/-frau', kategorie: 'Weitere Berufe' },
  { id: 'bauoekonom-verwaltung', titel: 'Bauökonom/in', kategorie: 'Weitere Berufe' },
  { id: 'baukostenplaner', titel: 'Baukostenplaner/in FH', kategorie: 'Weitere Berufe', ausbildung: 'FH' },
  { id: 'bausachverstaendiger', titel: 'Bausachverständige/r', kategorie: 'Weitere Berufe' }
];

export const kategorien = {
  'Hochbau': 'Hochbau',
  'Tiefbau': 'Tiefbau',
  'Ausbau': 'Ausbau',
  'Planung & Technik': 'Planung & Technik',
  'Weitere Berufe': 'Weitere Berufe'
};

export function getBerufeByKategorie(kategorie: string): Beruf[] {
  return berufe.filter(beruf => beruf.kategorie === kategorie);
}

export function getKategorieByBeruf(berufId: string): string | undefined {
  return berufe.find(beruf => beruf.id === berufId)?.kategorie;
}

export function getBerufById(berufId: string): Beruf | undefined {
  return berufe.find(beruf => beruf.id === berufId);
} 