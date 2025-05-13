import mongoose from "mongoose";

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
  }
});

export default mongoose.model("Job", JobSchema); 