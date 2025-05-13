import mongoose from 'mongoose';
import StellenanzeigenAufgeben from '../models/stellenanzeigen-aufgeben';
import dotenv from 'dotenv';

// Lade Umgebungsvariablen
dotenv.config();

// Definiere die erlaubten Kategorien als Union Type
type Kategorie = 'Hochbau' | 'Tiefbau' | 'Ausbau' | 'Planung & Technik' | 'Weitere Berufe';

// Kategorie-Mapping von Klein- zu Großschreibung
const kategorieMapping: { [key: string]: Kategorie } = {
  'hochbau': 'Hochbau',
  'tiefbau': 'Tiefbau',
  'ausbau': 'Ausbau',
  'planung': 'Planung & Technik',
  'weitere': 'Weitere Berufe'
};

async function updateKategorien() {
  try {
    // Verbinde zur Datenbank
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Verbunden mit MongoDB');

    // Finde alle Stellenanzeigen
    const stellenanzeigen = await StellenanzeigenAufgeben.find({});
    console.log(`Gefunden: ${stellenanzeigen.length} Stellenanzeigen`);

    // Aktualisiere jede Stellenanzeige
    for (const stellenanzeige of stellenanzeigen) {
      const neueKategorie = kategorieMapping[stellenanzeige.kategorie.toLowerCase()];
      
      if (neueKategorie) {
        // Verwende updateOne statt save, um TypeScript-Fehler zu vermeiden
        await StellenanzeigenAufgeben.updateOne(
          { _id: stellenanzeige._id },
          { $set: { kategorie: neueKategorie } }
        );
        console.log(`Aktualisiert: ${stellenanzeige._id} - ${neueKategorie}`);
      } else {
        console.warn(`Warnung: Unbekannte Kategorie "${stellenanzeige.kategorie}" für Stellenanzeige ${stellenanzeige._id}`);
      }
    }

    console.log('Migration abgeschlossen');
  } catch (error) {
    console.error('Fehler bei der Migration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Verbindung zur Datenbank geschlossen');
  }
}

// Führe die Migration aus
updateKategorien(); 