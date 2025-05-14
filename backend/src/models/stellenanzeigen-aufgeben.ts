import mongoose from "mongoose";

const StellenanzeigenAufgebenSchema = new mongoose.Schema({
  titel: { type: String, required: true },
  beschreibung: { type: String, required: true },
  standort: { type: String, required: true },
  kategorie: { 
    type: String, 
    required: true,
    enum: ['Hochbau', 'Tiefbau', 'Ausbau', 'Planung & Technik', 'Weitere Berufe']
  },
  artDerStelle: {
    type: String,
    required: true,
    enum: ['Vollzeit', 'Teilzeit', 'Befristet', 'Projektarbeit']
  },
  erstelltAm: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
  kontaktName: { type: String, required: true },
  kontaktEmail: { type: String, required: true },
  kontaktTelefon: { type: String },
  status: { 
    type: String, 
    enum: ['aktiv', 'inaktiv', 'besetzt'],
    default: 'aktiv'
  },
  ersteller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

export default mongoose.model("StellenanzeigenAufgeben", StellenanzeigenAufgebenSchema, "stellenanzeigen-aufgeben"); 