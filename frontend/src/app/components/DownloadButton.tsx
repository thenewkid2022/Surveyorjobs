'use client';

import { FaFilePdf } from "react-icons/fa";
import { IconBaseProps } from "react-icons";
import { getApiUrl } from "@/utils/api";

interface DownloadButtonProps {
  fileUrl: string;
  variant?: 'view' | 'download';
}

export default function DownloadButton({ fileUrl, variant = 'download' }: DownloadButtonProps) {
  const handleDownload = async () => {
    try {
      // Extrahiere den Key aus der S3-URL
      const key = fileUrl.split('.com/')[1];
      if (!key) throw new Error('Ungültiger Dateipfad');
      
      // Hole die pre-signed URL vom Backend
      const res = await fetch(`${getApiUrl()}/api/upload/download-url?key=${encodeURIComponent(key)}`);
      if (!res.ok) throw new Error('Fehler beim Anfordern der Download-URL');
      
      const { url } = await res.json();
      if (!url) throw new Error('Keine Download-URL erhalten');
      
      // Erstelle einen temporären Link für den Download
      const link = document.createElement('a');
      link.href = url;
      link.download = key.split('/').pop() || 'document.pdf'; // Extrahiere den Dateinamen
      link.target = '_blank'; // Fallback für Browser, die den Download nicht unterstützen
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Fehler beim Download:', error);
      alert('Fehler beim Herunterladen der Datei. Bitte versuchen Sie es später erneut.');
    }
  };

  const buttonText = variant === 'view' ? 'Lebenslauf anzeigen' : 'PDF Lebenslauf herunterladen';

  return (
    <button
      className="btn btn-outline-success"
      onClick={handleDownload}
    >
      <FaFilePdf {...{ size: 20, style: { marginRight: '0.5rem' } } as IconBaseProps} />
      {buttonText}
    </button>
  );
} 