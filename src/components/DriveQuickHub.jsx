import React, { useState } from 'react';
import { 
  HardDrive, ExternalLink, Table, Layers, BookOpen, 
  FolderArchive, ArrowUpRight, ShieldCheck, Share2, Search, FileText, Download, RefreshCw 
} from 'lucide-react';
import { DRIVE_ROOT_URL } from '../data/driveIndex';

export default function DriveQuickHub({ driveFiles, syncStatus, onRefresh }) {
  const [searchFilter, setSearchFilter] = useState('');

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(DRIVE_ROOT_URL);
    alert('Link da pasta do Google Drive copiado para a área de transferência!');
  };

  const filteredFiles = driveFiles.filter(file => 
    file.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    file.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    file.propertyName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    file.folder.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="gold-badge">Google Drive Conectado</span>
          <h2 style={{ fontSize: 22, marginTop: 4 }}>Acervo de Arquivos</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            {driveFiles.length} arquivos sincronizados diretamente do Drive.
          </p>
        </div>
        
        <button
          className={`header-btn ${syncStatus === 'syncing' ? 'recording' : ''}`}
          onClick={onRefresh}
          disabled={syncStatus === 'syncing'}
          title="Verificar atualizações no Drive"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Card Principal */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          boxShadow: 'var(--shadow-gold)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div 
            style={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              background: 'var(--gold-subtle)',
              border: '1px solid var(--border-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gold-primary)'
            }}
          >
            <HardDrive size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: 16 }}>Pasta Geral de Empreendimentos</h3>
            <div style={{ fontSize: 12, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={13} />
              <span>Sincronização em Tempo Real Ativa</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <a
            href={DRIVE_ROOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ flex: 1 }}
          >
            <span>Abrir Pasta no Google Drive</span>
            <ArrowUpRight size={16} />
          </a>
          <button 
            className="btn-secondary" 
            onClick={handleCopyLink}
            title="Copiar Link"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Busca Rápida no Índice */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ fontSize: 14, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Arquivos Indexados nas Pastas ({filteredFiles.length})
          </h4>
        </div>

        <div className="search-input-box" style={{ background: 'var(--bg-card)' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Filtrar por arquivo, pasta ou empreendimento..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <span className="gold-badge" style={{ fontSize: 10 }}>{file.propertyName}</span>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {file.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  📁 {file.folder} • {file.size}
                </div>
              </div>

              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ padding: '8px 10px' }}
                title="Visualizar ou Baixar arquivo"
              >
                <Download size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
