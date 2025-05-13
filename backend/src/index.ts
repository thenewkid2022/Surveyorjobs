import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
dotenv.config();
import stellenanzeigenRouter from "./routes/stellenanzeigen-aufgeben";
import sucheJobRouter from "./routes/suche-einen-job";
import paymentRouter from "./routes/payment";
import authRouter from "./routes/auth";
import uploadRouter from "./routes/upload";
import locationsRouter from "./routes/locations";

const app = express();

// CORS Konfiguration
const corsOptions = {
  origin: ['https://www.surveyjobs.org', 'http://localhost:3000', 'https://surveyorjobs.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With'],
  credentials: true,
  maxFileSize: '5mb'
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Erstelle Upload-Verzeichnis, falls es nicht existiert
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// MongoDB Verbindung
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error("MONGODB_URI ist nicht definiert!");
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log("MongoDB verbunden"))
  .catch((err) => {
    console.error("MongoDB Verbindungsfehler:", err);
    process.exit(1);
  });

// Statische Dateien
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/stellenanzeigen-aufgeben", stellenanzeigenRouter);
app.use("/api/suche-einen-job", sucheJobRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/locations", locationsRouter);

// Health Check
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.head("/api/ping", (_, res) => {
  res.status(200).end();
});

// Server starten
const PORT = parseInt(process.env.PORT || '10000', 10);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server läuft auf Port ${PORT}`);
  console.log(`Umgebung: ${process.env.NODE_ENV}`);
  console.log(`Node Version: ${process.version}`);
  console.log(`Arbeitsspeicher-Limit: ${process.env.NODE_OPTIONS}`);
}); 