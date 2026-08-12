import React from 'react';
import { Building2, ExternalLink, HardDrive } from 'lucide-react';
import { DRIVE_ROOT_URL } from '../data/properties';

export default function Header({ onOpenDriveHub }) {
  return (
    <header className="app-header glass-panel">
      <div className="brand-section">
        <div className="brand-logo-icon">
          <Building2 size={20} />
        </div>
        <div className="brand-text-wrapper">
          <span className="brand-title gold-gradient-text">VETTER HUB</span>
          <span className="brand-subtitle">Gestão Imobiliária & Drive</span>
        </div>
      </div>

      <div className="header-actions">
        <a
          href={DRIVE_ROOT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="drive-pill-btn"
          title="Abrir pasta no Google Drive"
        >
          <HardDrive size={14} />
          <span>Drive</span>
          <ExternalLink size={11} />
        </a>
      </div>
    </header>
  );
}
