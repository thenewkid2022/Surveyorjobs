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
    setIsLoading(true);
    setError(null);
    
    try {
      // Extrahiere den Key aus der S3-URL
      const key = fileUrl.split('.com/')[1];
      if (!key) throw new Error('Ungültiger Dateipfad');
      
      // Hole die pre-signed URL vom Backend
      const res = await fetch(`${getApiUrl()}/api/upload/download-url?key=${encodeURIComponent(key)}`);
      if (!res.ok) throw new Error('Fehler beim Anfordern der Download-URL');
      
      const { url } = await res.json();
      if (!url) throw new Error('Keine Download-URL erhalten');

      // Direktes Öffnen der URL in einem neuen Tab
      window.open(url, '_blank', 'noopener,noreferrer');
      
    } catch (error) {
      console.error('Fehler beim Download:', error);
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