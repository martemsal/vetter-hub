import React from 'react';
import { Building2, ExternalLink, HardDrive, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { DRIVE_ROOT_URL } from '../data/properties';

export default function Header({ onOpenDriveHub, syncStatus }) {
  const getSyncBadge = () => {
    switch (syncStatus) {
      case 'syncing':
        return (
          <span style={{ fontSize: 10, color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <RefreshCw size={10} className="recording" />
            <span>Verificando Drive...</span>
          </span>
        );
      case 'synced':
        return (
          <span style={{ fontSize: 10, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <CheckCircle size={10} />
            <span>Sincronizado</span>
          </span>
        );
      case 'error':
        return (
          <span style={{ fontSize: 10, color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <AlertTriangle size={10} />
            <span>Offline (Drive)</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="app-header glass-panel">
      <div className="brand-section">
        <div className="brand-logo-icon">
          <Building2 size={20} />
        </div>
        <div className="brand-text-wrapper">
          <span className="brand-title gold-gradient-text">VETTER HUB</span>
          <span className="brand-subtitle" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>Gestão & Drive</span>
            {getSyncBadge()}
          </span>
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
