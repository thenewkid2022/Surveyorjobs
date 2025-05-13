'use client';

import { FaFilePdf } from "react-icons/fa";
import { IconBaseProps } from "react-icons";
import { getApiUrl } from "@/utils/api";
import { useState } from "react";

interface DownloadButtonProps {
  fileUrl: string;
  variant?: 'view' | 'download';
}

export default function DownloadButton({ fileUrl, variant = 'download' }: DownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Extrahiere den S3-Key aus der URL und behalte den uploads/ Pfad
      const key = fileUrl.split('uploads/').pop() || '';
      const fullKey = `uploads/${key}`;
      console.log('Starte Download-Prozess für Key:', fullKey);
      
      // Prüfe ob es sich um Safari handelt
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      console.log('Browser erkannt:', navigator.userAgent);
      console.log('Ist Safari:', isSafari);
      
      // Hole die pre-signed URL vom Backend
      console.log('Fordere pre-signed URL an...');
      const response = await fetch(`${getApiUrl()}/api/upload/download-url?key=${encodeURIComponent(fullKey)}`);
      
      if (!response.ok) {
        throw new Error(`Fehler beim Abrufen der Download-URL: ${response.statusText}`);
      }
      
      const { url } = await response.json();
      console.log('Pre-signed URL erhalten:', url);
      
      if (isSafari) {
        // Safari-spezifische Download-Methode
        console.log('Verwende Safari-spezifische Download-Methode');
        const link = document.createElement('a');
        // Füge Content-Disposition Header über URL-Parameter hinzu
        const urlWithDisposition = `${url}&response-content-disposition=attachment; filename="${encodeURIComponent(key)}"`;
        console.log('Finale Download-URL mit Content-Disposition:', urlWithDisposition);
        link.href = urlWithDisposition;
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener,noreferrer');
        document.body.appendChild(link);
        console.log('Starte Download mit modifizierter URL...');
        link.click();
        document.body.removeChild(link);
      } else {
        // Standard-Methode für andere Browser
        console.log('Verwende Standard-Download-Methode');
        window.open(url, '_blank', 'noopener,noreferrer');
      }
      
      console.log('Download-Prozess abgeschlossen');
    } catch (err) {
      console.error('Fehler beim Download:', err);
      setError('Fehler beim Herunterladen der Datei. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  const buttonText = variant === 'view' ? 'Lebenslauf anzeigen' : 'PDF Lebenslauf herunterladen';

  return (
    <div>
      <button
        className={`btn ${variant === 'view' ? 'btn-outline-primary' : 'btn-primary'}`}
        onClick={handleDownload}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Lade...
          </>
        ) : (
          <>
            <FaFilePdf className="me-2" size={20} />
            {buttonText}
          </>
        )}
      </button>
      {error && (
        <div className="alert alert-danger mt-2" role="alert">
          {error}
        </div>
      )}
    </div>
  );
} 