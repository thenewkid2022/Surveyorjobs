import mongoose, { Document } from "mongoose";

export interface ISucheEinenJob extends Document {
  titel: string;
  beruf: string;
  standort: string;
  beschreibung: string;
  erfahrung: string;
  ausbildung: string;
  faehigkeiten: string[];
  sprachen: string[];
  mobilitaet: 'In der Region' | 'Schweizweit' | 'International';
  artDerStelle: 'Vollzeit' | 'Teilzeit' | 'Befristet' | 'Projektarbeit';
  verfuegbarAb: Date;
  kontaktEmail: string;
  kontaktTelefon?: string;
  lebenslauf: string;
  anschreiben?: string;
  erstelltAm: Date;
  expiresAt: Date;
  status: 'aktiv' | 'inaktiv' | 'besetzt';
  kategorie: 'Hochbau' | 'Tiefbau' | 'Ausbau' | 'Planung & Technik' | 'Weitere Berufe';
  ersteller: mongoose.Types.ObjectId;
  hervorgehoben: boolean;
}

const SucheEinenJobSchema = new mongoose.Schema({
  titel: {
    type: String,
    required: true
  },
  beruf: {
    type: String,
    required: true
  },
  standort: {
    type: String,
    required: true
  },
  beschreibung: {
    type: String,
    required: true
  },
  erfahrung: {
    type: String,
    required: true
  },
  ausbildung: {
    type: String,
    required: true
  },
  faehigkeiten: [{
    type: String
  }],
  sprachen: [{
    type: String
  }],
  mobilitaet: {
    type: String,
    required: true,
    enum: ['In der Region', 'Schweizweit', 'International']
  },
  artDerStelle: {
    type: String,
    required: true,
    enum: ['Vollzeit', 'Teilzeit', 'Befristet', 'Projektarbeit']
  },
  verfuegbarAb: {
    type: Date,
    required: true
  },
  kontaktEmail: {
    type: String,
    required: true
  },
  kontaktTelefon: {
    type: String,
    required: false
  },
  lebenslauf: {
    type: String,  // URL zum gespeicherten PDF
    required: true
  },
  anschreiben: {
    type: String,
    required: false
  },
  erstelltAm: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['aktiv', 'inaktiv', 'besetzt'],
    default: 'aktiv'
  },
  kategorie: {
    type: String,
    required: true,
    enum: {
      values: ['Hochbau', 'Tiefbau', 'Ausbau', 'Planung & Technik', 'Weitere Berufe'],
      message: 'Ungültige Kategorie',
      // Case-insensitive Validierung
      validator: function(v: string) {
        const validCategories = ['Hochbau', 'Tiefbau', 'Ausbau', 'Planung & Technik', 'Weitere Berufe'];
        return validCategories.some(cat => cat.toLowerCase() === v.toLowerCase());
      }
    }
  },
  ersteller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hervorgehoben: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model<ISucheEinenJob>("SucheEinenJob", SucheEinenJobSchema, "suche-einen-job"); 