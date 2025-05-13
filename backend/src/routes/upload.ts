import express, { Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { getApiUrl } from "../utils/config";

// Definiere den Multer File Typ
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
  stream: any; // Hinzugefügt für Kompatibilität mit File Interface
}

const router = express.Router();

// Konfiguration für den Upload
const storage = multer.diskStorage({
  destination: function (_req: Request, _file: MulterFile, cb: (error: Error | null, destination: string) => void) {
    const uploadDir = path.join(__dirname, '../../uploads');
    // Erstelle das Upload-Verzeichnis, falls es nicht existiert
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (_req: Request, file: MulterFile, cb: (error: Error | null, filename: string) => void) {
    // Generiere einen eindeutigen Dateinamen
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'lebenslauf-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter für PDF-Dateien
const fileFilter = (_req: Request, file: MulterFile, cb: FileFilterCallback) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Nur PDF-Dateien sind erlaubt'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB Limit
  }
});

// Erweitere den Request-Typ für multer
interface MulterRequest extends Omit<Request, 'file'> {
  file?: MulterFile;
}

// POST /api/upload
router.post('/', upload.single('lebenslauf'), (req: MulterRequest, res: Response): void => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Keine Datei hochgeladen' });
      return;
    }

    // Erstelle die URL für den Zugriff auf die Datei
    const fileUrl = `${getApiUrl()}/uploads/${req.file.filename}`;

    res.json({ 
      message: 'Datei erfolgreich hochgeladen',
      lebenslaufUrl: fileUrl
    });
  } catch (error) {
    console.error('Fehler beim Upload:', error);
    res.status(500).json({ 
      error: 'Fehler beim Upload der Datei',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    });
  }
});

export default router; 