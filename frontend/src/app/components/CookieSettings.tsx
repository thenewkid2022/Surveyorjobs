"use client";

import { useState } from 'react';
import { useCookies } from '@/contexts/CookieContext';
import { FaCog, FaCookie } from 'react-icons/fa';

export default function CookieSettings() {
  const { showSettings, resetConsent } = useCookies();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenSettings = () => {
    resetConsent(); // Zeigt das Cookie-Banner mit Einstellungen an
  };

  return (
    <button
      onClick={handleOpenSettings}
      className="btn btn-link text-secondary text-decoration-none p-0"
      style={{ fontSize: '0.9rem' }}
    >
      <FaCookie className="me-1" />
      Cookie-Einstellungen
    </button>
  );
} 