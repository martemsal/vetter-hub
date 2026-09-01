import React, { useState, useEffect } from 'react';
import { 
  UploadCloud, Lock, ShieldCheck, FolderArchive, RefreshCw, 
  CheckCircle2, AlertCircle, FileText, FileSpreadsheet, ExternalLink, 
  ArrowLeft, Trash2, Eye, Key, Sparkles, Database, Layers
} from 'lucide-react';
import { DRIVE_ROOT_URL } from '../data/driveIndex';
import { runRealtimeDriveScanner } from '../utils/driveScanner';

// IDs das Pastas no Google Drive
const FOLDERS = {
  tabelas: {
    name: 'Tabelas de Vendas (Litoral > Tabela)',
    id: '1LbjGFcq9CsiwQCpc-pCJ1z9NvPLj8y1O',
    url: 'https://drive.google.com/drive/folders/1LbjGFcq9CsiwQCpc-pCJ1z9NvPLj8y1O?usp=sharing',
    icon: FileSpreadsheet,
    desc: 'Pasta onde ficam os PDFs de tabelas mensais (ex: Tabela Bal Harbour - Setembro 26.pdf)'
  },
  apresentacoes: {
    name: 'Apresentações Comerciais (Litoral > Apresentação)',
    id: '1nrJRqWuf39hk9tJe8Swdr5VqOo1hWQuy',
    url: 'https://drive.google.com/drive/folders/1nrJRqWuf39hk9tJe8Swdr5VqOo1hWQuy?usp=sharing',
    icon: FileText,
    desc: 'Pasta onde ficam os books e apresentações dos empreendimentos'
  },
  disponibilidade: {
    name: 'Disponibilidade (Pipeline.csv)',
    id: '1TQeiSr0A4bOMf0nYXICMKCJsW7EnUFU3',
    url: 'https://drive.google.com/drive/folders/1TQeiSr0A4bOMf0nYXICMKCJsW7EnUFU3?usp=sharing',
    icon: Database,
    desc: 'Pasta onde fica a planilha consolidada Pipeline(-).csv com 1.793 unidades'
  }
};

export default function AdminUploadHub({ onBackToApp }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('vetter_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState(false);

  const [selectedFolder, setSelectedFolder] = useState('tabelas');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [liveFiles, setLiveFiles] = useState([]);

  // Senha padrão de acesso admin
  const ADMIN_PIN = 'vetter2026';

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput.trim().toLowerCase() === ADMIN_PIN) {
      setIsAuthenticated(true);
      localStorage.setItem('vetter_admin_auth', 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('vetter_admin_auth');
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch('/api/scan-drive');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSyncResult({
            success: true,
            message: `Sincronização concluída com sucesso! ${data.count} arquivos ativos encontrados no Drive.`
          });
          setLiveFiles(data.files);
        } else {
          setSyncResult({
            success: false,
            message: 'Aviso: Nenhuma alteração detectada nas pastas.'
          });
        }
      } else {
        const fallback = await runRealtimeDriveScanner();
        setSyncResult({
          success: true,
          message: `Scanner local executado: ${fallback.length} arquivos sincronizados.`
        });
        setLiveFiles(fallback);
      }
    } catch (e) {
      setSyncResult({
        success: false,
        message: 'Erro na conexão com o scanner: ' + e.message
      });
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      handleManualSync();
    }
  }, [isAuthenticated]);

  // Se não autenticado, exibe tela de login elegante
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '380px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid var(--border-gold)',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(12px)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'rgba(212, 160, 23, 0.15)',
            border: '1px solid var(--gold-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: 'var(--gold-primary)'
          }}>
            <Lock size={26} />
          </div>

          <span className="gold-badge" style={{ marginBottom: 8, display: 'inline-block' }}>Área Restrita</span>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Vetter Drive Admin</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
            Insira o PIN de administrador para acessar o painel de upload e sincronização direta.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input 
              type="password" 
              placeholder="Digite o PIN de acesso..."
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              style={{
                width: '100%',
                background: '#020617',
                border: authError ? '1px solid var(--accent-rose)' : '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px 14px',
                color: '#fff',
                fontSize: 14,
                textAlign: 'center',
                letterSpacing: '2px',
                outline: 'none'
              }}
              autoFocus
            />

            {authError && (
              <span style={{ fontSize: 12, color: 'var(--accent-rose)' }}>
                PIN incorreto. Tente novamente.
              </span>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', justifyContent: 'center' }}>
              Entrar no Painel
            </button>
          </form>

          <button 
            onClick={onBackToApp} 
            style={{ 
              marginTop: 18, 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-muted)', 
              fontSize: 12, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              margin: '18px auto 0'
            }}
          >
            <ArrowLeft size={13} />
            <span>Voltar ao Vetter Hub público</span>
          </button>
        </div>
      </div>
    );
  }

  const currentFolderInfo = FOLDERS[selectedFolder];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px 16px', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header do Painel Admin */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 16,
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button 
            onClick={onBackToApp} 
            className="btn-secondary" 
            style={{ padding: '8px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <ArrowLeft size={14} />
            <span>Ver App Público</span>
          </button>
          <div>
            <div style={{ fontSize: 11, color: 'var(--gold-primary)', textTransform: 'uppercase', fontWeight: 700 }}>
              Painel Privado do Administrador
            </div>
            <h1 style={{ fontSize: 18, fontWeight: 800 }}>Upload & Gestão do Drive</h1>
          </div>
        </div>

        <button 
          onClick={handleLogout} 
          style={{ background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '6px 10px', color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer' }}
        >
          Sair
        </button>
      </div>

      {/* Card de Destaque: Upload Rápido para a Pasta Certa */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid var(--border-gold)',
        borderRadius: 14,
        padding: 20,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <UploadCloud size={20} color="var(--gold-primary)" />
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>1. Escolha a Pasta de Destino no Google Drive</h3>
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
          Selecione a pasta correspondente e clique no botão para abrir a pasta do Drive já no ponto de soltar os arquivos.
        </p>

        {/* Seletores de Pasta */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 18 }}>
          {Object.entries(FOLDERS).map(([key, folder]) => {
            const isSelected = selectedFolder === key;
            const Icon = folder.icon;
            return (
              <div 
                key={key}
                onClick={() => setSelectedFolder(key)}
                style={{
                  padding: 14,
                  borderRadius: 10,
                  border: isSelected ? '2px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(212, 160, 23, 0.1)' : '#020617',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Icon size={16} color={isSelected ? 'var(--gold-primary)' : 'var(--text-muted)'} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? '#fff' : 'var(--text-secondary)' }}>
                    {folder.name.split(' (')[0]}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {folder.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Botão de Ação Direta para a Pasta */}
        <div style={{
          background: '#020617',
          padding: 16,
          borderRadius: 10,
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gold-primary)' }}>
                {currentFolderInfo.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                ID no Drive: <span style={{ fontFamily: 'monospace' }}>{currentFolderInfo.id}</span>
              </div>
            </div>

            <a 
              href={currentFolderInfo.url} 
              target="_blank" 
              rel="noreferrer"
              className="btn-primary"
              style={{ padding: '10px 18px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <ExternalLink size={15} />
              <span>Abrir Pasta no Drive para Soltar Arquivos</span>
            </a>
          </div>

          <div style={{ fontSize: 12, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.08)', padding: '8px 12px', borderRadius: 6, border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            💡 <strong>Como usar:</strong> Ao clicar no botão acima, a pasta do Drive se abre diretamente. Arraste os PDFs ou a nova planilha para lá. Assim que terminar, basta clicar no botão <strong>"Sincronizar Arquivos Agora"</strong> abaixo!
          </div>
        </div>
      </div>

      {/* Card: Gatilho de Sincronização em Tempo Real */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 14,
        padding: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <RefreshCw size={18} color="var(--gold-primary)" className={isSyncing ? 'recording' : ''} />
              <span>2. Sincronizar com o Hub em Tempo Real</span>
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              Força a atualização imediata no servidor da Vercel para todos os usuários do link público.
            </p>
          </div>

          <button 
            className="btn-primary"
            onClick={handleManualSync}
            disabled={isSyncing}
            style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <RefreshCw size={14} className={isSyncing ? 'recording' : ''} />
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Arquivos Agora'}</span>
          </button>
        </div>

        {syncResult && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 8,
            fontSize: 13,
            background: syncResult.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: syncResult.success ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            color: syncResult.success ? 'var(--accent-emerald)' : 'var(--accent-rose)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16
          }}>
            {syncResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{syncResult.message}</span>
          </div>
        )}

        {/* Lista de Arquivos Atualmente Ativos no Drive */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
          <h4 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Arquivos Atualmente Ativos ({liveFiles.length})
          </h4>

          <div style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, paddingRight: 4 }}>
            {liveFiles.map((file, idx) => (
              <div 
                key={file.id || idx}
                style={{
                  background: '#020617',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 8,
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, color: 'var(--gold-primary)' }}>
                    {file.folder === 'Tabela' ? '📊' : '📄'}
                  </span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{file.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      Pasta: <span style={{ color: 'var(--gold-primary)' }}>{file.folder}</span> • {file.updatedAt || 'Ativo'}
                    </div>
                  </div>
                </div>

                <a 
                  href={file.viewUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{
                    color: 'var(--text-muted)',
                    padding: 6,
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Ver no Drive"
                >
                  <Eye size={15} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
