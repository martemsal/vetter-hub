import React from 'react';
import { 
  HardDrive, ExternalLink, Table, Layers, BookOpen, 
  Camera, FolderArchive, ArrowUpRight, ShieldCheck, Share2 
} from 'lucide-react';
import { QUICK_DRIVE_SHORTCUTS, DRIVE_ROOT_URL, PROPERTIES_DATA } from '../data/properties';

export default function DriveQuickHub() {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Table': return <Table size={20} color="var(--accent-emerald)" />;
      case 'Layers': return <Layers size={20} color="var(--gold-primary)" />;
      case 'BookOpen': return <BookOpen size={20} color="var(--accent-cyan)" />;
      case 'Camera': return <Camera size={20} color="var(--accent-rose)" />;
      default: return <FolderArchive size={20} color="var(--gold-primary)" />;
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(DRIVE_ROOT_URL);
    alert('Link da pasta do Google Drive copiado para a área de transferência!');
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <span className="gold-badge">Google Drive Integrado</span>
        <h2 style={{ fontSize: 22, marginTop: 4 }}>Central de Arquivos Vetter</h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          Acesso direto à pasta compartilhada com todos os materiais em alta definição.
        </p>
      </div>

      {/* Card Principal de Acesso Raiz */}
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
              <span>Link Ativo & Compartilhado</span>
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
            <span>Abrir no Google Drive</span>
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

      {/* Pastas por Categoria */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h4 style={{ fontSize: 14, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Atalhos por Tipo de Material
        </h4>

        {QUICK_DRIVE_SHORTCUTS.map((item, idx) => (
          <a
            key={idx}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div 
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {getIcon(item.icon)}
              </div>
              <div>
                <strong style={{ fontSize: 14, color: 'var(--text-primary)' }}>{item.title}</strong>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{item.description}</p>
              </div>
            </div>

            <ExternalLink size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          </a>
        ))}
      </div>

      {/* Pastas por Empreendimento */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
        <h4 style={{ fontSize: 14, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Pastas por Empreendimento
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {PROPERTIES_DATA.map((prop) => (
            <a
              key={prop.id}
              href={prop.driveFolderUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6
              }}
            >
              <span className="gold-badge" style={{ alignSelf: 'flex-start', fontSize: 10 }}>{prop.status}</span>
              <strong style={{ fontSize: 13 }}>{prop.name}</strong>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <FolderArchive size={12} color="var(--gold-primary)" />
                Ver Pasta no Drive
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
