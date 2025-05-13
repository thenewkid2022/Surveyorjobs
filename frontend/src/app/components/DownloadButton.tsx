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
      console.log('Starte Download-Prozess...');
      
      // Extrahiere den Key aus der S3-URL
      const key = fileUrl.split('.com/')[1];
      if (!key) throw new Error('Ungültiger Dateipfad');
      console.log('Extrahierter Key:', key);
      
      // Hole die pre-signed URL vom Backend
      console.log('Hole pre-signed URL...');
      const res = await fetch(`${getApiUrl()}/api/upload/download-url?key=${encodeURIComponent(key)}`);
      if (!res.ok) throw new Error('Fehler beim Anfordern der Download-URL');
      
      const { url } = await res.json();
      if (!url) throw new Error('Keine Download-URL erhalten');
      console.log('Pre-signed URL erhalten:', url);

      // Prüfe ob wir auf einem mobilen Gerät sind
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      console.log('Ist Mobile-Gerät:', isMobile, 'UserAgent:', navigator.userAgent);
      
      if (isMobile) {
        console.log('Öffne URL in neuem Tab für mobiles Gerät...');
        // Versuche zuerst mit window.open
        const newWindow = window.open(url, '_blank');
        
        // Wenn window.open blockiert wurde oder fehlschlägt
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          console.log('window.open fehlgeschlagen, versuche alternativen Ansatz...');
          // Alternative Methode: Erstelle einen Link und klicke ihn
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        console.log('Starte Download für Desktop-Gerät...');
        const link = document.createElement('a');
        link.href = url;
        link.download = key.split('/').pop() || 'document.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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