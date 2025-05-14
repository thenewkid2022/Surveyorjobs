import mongoose, { Document } from "mongoose";

export interface IJob extends Document {
  titel: string;
  standort: string;
  beschreibung: string;
  unternehmen: string;
  artDerStelle: string;
  kontaktEmail: string;
  kontaktTelefon?: string;
  erfahrung?: string;
  erstelltAm: Date;
  expiresAt: Date;
  ersteller: mongoose.Types.ObjectId;
}

const JobSchema = new mongoose.Schema({
  titel: {
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
  unternehmen: {
    type: String,
    required: true
  },
  artDerStelle: {
    type: String,
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
  erfahrung: {
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
  ersteller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

export default mongoose.model<IJob>("Job", JobSchema); 