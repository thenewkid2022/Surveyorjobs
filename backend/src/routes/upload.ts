import express, { Request, Response } from "express";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const router = express.Router();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({ error: "Fehlende Parameter" });
    }

    // Optional: Dateityp prüfen
    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(fileType)) {
      return res.status(400).json({ error: "Nur PDF erlaubt" });
    }

    const key = `uploads/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      ContentType: fileType,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });

    return res.json({ url, key });
  } catch (error) {
    console.error("Fehler beim Generieren der pre-signed URL:", error);
    return res.status(500).json({ error: "Fehler beim Generieren der Upload-URL" });
  }
});

// GET /api/upload/download-url?key=uploads/filename.pdf
router.get("/download-url", async (req: Request, res: Response) => {
  try {
    const { key } = req.query;
    if (!key || typeof key !== "string") {
      return res.status(400).json({ error: "Key ist erforderlich" });
    }
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }); // 5 Minuten gültig
    return res.json({ url });
  } catch (error) {
    console.error("Fehler beim Generieren der Download-URL:", error);
    return res.status(500).json({ error: "Fehler beim Generieren der Download-URL" });
  }
});

// GET /api/upload/download?key=uploads/filename.pdf
router.get("/download", async (req: Request, res: Response): Promise<void> => {
  try {
    const { key } = req.query;
    if (!key || typeof key !== "string") {
      res.status(400).json({ error: "Key ist erforderlich" });
      return;
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
    });

    const response = await s3.send(command);
    
    if (!response.Body) {
      throw new Error("Keine Datei gefunden");
    }

    res.setHeader('Content-Type', response.ContentType || 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(key.split('/').pop() || 'download.pdf')}"`);
    res.setHeader('Content-Length', response.ContentLength?.toString() || '0');

    const stream = response.Body as any;
    stream.pipe(res);
  } catch (error) {
    console.error("Fehler beim Download:", error);
    res.status(500).json({ error: "Fehler beim Download der Datei" });
  }
});

export default router; 