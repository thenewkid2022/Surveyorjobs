import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { getApiUrl } from "../utils/config";

const router = express.Router();

// Konfiguration für den Upload
const storage = multer.diskStorage({
  destination: function (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    const uploadDir = path.join(__dirname, '../../uploads');
    // Erstelle das Upload-Verzeichnis, falls es nicht existiert
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    // Generiere einen eindeutigen Dateinamen
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'lebenslauf-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter für PDF-Dateien
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
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
interface MulterRequest extends Request {
  file?: Express.Multer.File;
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