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
      console.log('Download gestartet für URL:', fileUrl);
      
      // Extrahiere den Key aus der S3-URL
      const key = fileUrl.split('.com/')[1];
      if (!key) throw new Error('Ungültiger Dateipfad');
      console.log('Extrahierter S3-Key:', key);
      
      // Hole die pre-signed URL vom Backend
      console.log('Fordere pre-signed URL an...');
      const res = await fetch(`${getApiUrl()}/api/upload/download-url?key=${encodeURIComponent(key)}`);
      if (!res.ok) {
        console.error('Fehler beim Anfordern der Download-URL:', res.status, res.statusText);
        throw new Error('Fehler beim Anfordern der Download-URL');
      }
      
      const { url } = await res.json();
      if (!url) {
        console.error('Keine Download-URL in der Antwort erhalten');
        throw new Error('Keine Download-URL erhalten');
      }
      console.log('Pre-signed URL erhalten:', url);

      // Versuche den Download auf verschiedene Arten
      try {
        console.log('Versuche Download mit window.open()...');
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        
        // Überprüfe, ob das Fenster erfolgreich geöffnet wurde
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          console.log('window.open() fehlgeschlagen, versuche alternative Methode...');
          
          // Alternative Methode: Direkter Download-Link
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', key.split('/').pop() || 'lebenslauf.pdf');
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (openError) {
        console.error('Fehler beim Öffnen der URL:', openError);
        throw new Error('Fehler beim Öffnen der Datei');
      }
      
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