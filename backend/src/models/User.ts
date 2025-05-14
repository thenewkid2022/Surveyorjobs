import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

export interface IUser extends Document {
  email: string;
  password: string;
  vorname: string;
  nachname: string;
  telefon: string;
  firma: string;
  profilbild: string;
  accountTyp: 'arbeitgeber' | 'arbeitssuchender';
  accountStatus: 'aktiv' | 'inaktiv' | 'gesperrt';
  emailVerifiziert: boolean;
  emailVerifizierungsToken?: string | null;
  emailVerifizierungsTokenAblauf?: Date | null;
  resetPasswordToken?: string | null;
  resetPasswordTokenAblauf?: Date | null;
  letzterLogin: Date;
  erstelltAm: Date;
  aktualisiertAm: Date;
  erstellteJobs: mongoose.Types.ObjectId[];
  erstellteSucheJobs: mongoose.Types.ObjectId[];
  lebenslauf?: string;
  lebenslaufSichtbar: boolean;
  premiumFeatures: {
    lebenslaufHervorgehoben: boolean;
    premiumBis?: Date;
    premiumTyp?: 'arbeitssuchender' | 'arbeitgeber';
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateEmailVerificationToken(): Promise<string>;
  generatePasswordResetToken(): Promise<string>;
}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  vorname: {
    type: String,
    required: true,
    trim: true
  },
  nachname: {
    type: String,
    required: true,
    trim: true
  },
  telefon: {
    type: String,
    trim: true
  },
  firma: {
    type: String,
    trim: true
  },
  profilbild: {
    type: String,
    default: ''
  },
  accountTyp: {
    type: String,
    enum: ['arbeitgeber', 'arbeitssuchender'],
    required: true
  },
  accountStatus: {
    type: String,
    enum: ['aktiv', 'inaktiv', 'gesperrt'],
    default: 'inaktiv'
  },
  emailVerifiziert: {
    type: Boolean,
    default: false
  },
  emailVerifizierungsToken: {
    type: String,
    default: null
  },
  emailVerifizierungsTokenAblauf: {
    type: Date,
    default: null
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordTokenAblauf: {
    type: Date,
    default: null
  },
  letzterLogin: Date,
  erstelltAm: {
    type: Date,
    default: Date.now
  },
  aktualisiertAm: {
    type: Date,
    default: Date.now
  },
  erstellteJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  erstellteSucheJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SucheEinenJob'
  }],
  lebenslauf: {
    type: String,  // URL zum gespeicherten PDF
    required: false
  },
  lebenslaufSichtbar: {
    type: Boolean,
    default: false
  },
  premiumFeatures: {
    lebenslaufHervorgehoben: {
      type: Boolean,
      default: false
    },
    premiumBis: {
      type: Date,
      default: null
    },
    premiumTyp: {
      type: String,
      enum: ['arbeitssuchender', 'arbeitgeber'],
      default: null
    }
  }
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.pre("save", function(next) {
  this.aktualisiertAm = new Date();
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generateEmailVerificationToken = async function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailVerifizierungsToken = token;
  this.emailVerifizierungsTokenAblauf = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 Stunden
  await this.save();
  return token;
};

UserSchema.methods.generatePasswordResetToken = async function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = token;
  this.resetPasswordTokenAblauf = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 Stunde
  await this.save();
  return token;
};

export default mongoose.model<IUser>("User", UserSchema); 