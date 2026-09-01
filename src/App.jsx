import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Sparkles, Building2, Mic, MicOff, Layers, FolderArchive, CloudLightning, Check } from 'lucide-react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import PropertyCard from './components/PropertyCard';
import PropertyModal from './components/PropertyModal';
import FloorPlanViewer from './components/FloorPlanViewer';
import AssistantChat from './components/AssistantChat';
import DriveQuickHub from './components/DriveQuickHub';
import { PROPERTIES_DATA } from './data/properties';
import { runRealtimeDriveScanner } from './utils/driveScanner';
import { getStoredDriveIndex } from './data/driveIndex';
import DutyTab from './components/DutyTab';
import AvailabilityTab from './components/AvailabilityTab';
import StaffScheduleTab from './components/StaffScheduleTab';
import AdminUploadHub from './components/AdminUploadHub';


export default function App() {
  const [isAdmin, setIsAdmin] = useState(() => {
    const path = window.location.pathname;
    const search = window.location.search;
    return path.includes('/admin') || search.includes('admin=true') || search.includes('view=admin');
  });
  const [activeTab, setActiveTab] = useState('assistant'); // 'assistant' | 'drive'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activePropertyModal, setActivePropertyModal] = useState(null);
  const [selectedPlanPropId, setSelectedPlanPropId] = useState(null);
  const [isSearchingVoice, setIsSearchingVoice] = useState(false);
  const [driveFiles, setDriveFiles] = useState(() => getStoredDriveIndex());
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced' | 'error'
  const searchRecognitionRef = useRef(null);

  // Gatilho de Sincronização em Tempo Real na Inicialização (Drive Scanner)
  useEffect(() => {
    async function initDriveSync() {
      setSyncStatus('syncing');
      try {
        const freshFiles = await runRealtimeDriveScanner();
        if (freshFiles && freshFiles.length > 0) {
          setDriveFiles(freshFiles);
          setSyncStatus('synced');
        } else {
          setSyncStatus('error');
        }
      } catch (err) {
        console.error(err);
        setSyncStatus('error');
      }
    }
    initDriveSync();
  }, []);

  // Microfone para busca rápida por voz
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.lang = 'pt-BR';
      rec.continuous = false;
      rec.interimResults = true;

      rec.onstart = () => setIsSearchingVoice(true);
      rec.onresult = (e) => {
        let transcript = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript;
        }
        setSearchQuery(transcript);
      };
      rec.onerror = () => setIsSearchingVoice(false);
      rec.onend = () => setIsSearchingVoice(false);
      searchRecognitionRef.current = rec;
    }
  }, []);

  const toggleSearchVoice = () => {
    if (!searchRecognitionRef.current) {
      alert('Reconhecimento de voz não suportado neste navegador.');
      return;
    }
    if (isSearchingVoice) {
      searchRecognitionRef.current.stop();
      setIsSearchingVoice(false);
    } else {
      setSearchQuery('');
      try {
        searchRecognitionRef.current.start();
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const filterOptions = [
    { id: 'all', label: 'Todos os Imóveis' },
    { id: 'lançamento', label: 'Lançamentos' },
    { id: 'em-construção', label: 'Em Construção' },
    { id: 'pronto', label: 'Prontos para Morar' },
    { id: 'frente-mar', label: 'Frente Mar' },
  ];

  const filteredProperties = useMemo(() => {
    return PROPERTIES_DATA.filter((p) => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.specs.suites.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'lançamento') return p.status.toLowerCase().includes('lançamento');
      if (selectedFilter === 'em-construção') return p.status.toLowerCase().includes('construção');
      if (selectedFilter === 'pronto') return p.status.toLowerCase().includes('pronto');
      if (selectedFilter === 'frente-mar') return p.category === 'frente-mar';

      return true;
    });
  }, [searchQuery, selectedFilter]);

  const handleOpenFloorPlan = (property, planId) => {
    setSelectedPlanPropId(property.id);
    setActiveTab('floorplans');
  };

  if (isAdmin) {
    return (
      <AdminUploadHub 
        onBackToApp={() => {
          window.history.pushState({}, '', '/');
          setIsAdmin(false);
        }} 
      />
    );
  }

  return (
    <div className="app-container">
      {/* Header Fixo */}
      <Header onOpenDriveHub={() => setActiveTab('drive')} syncStatus={syncStatus} />

      {/* Indicador de Status da Sincronização em Tempo Real */}
      {syncStatus === 'syncing' && (
        <div style={{ background: 'rgba(230, 195, 92, 0.12)', borderBottom: '1px solid rgba(230, 195, 92, 0.3)', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--gold-primary)', fontWeight: 600 }}>
          <CloudLightning size={12} className="recording" />
          <span>Sincronizando com o Google Drive em tempo real...</span>
        </div>
      )}
      {syncStatus === 'synced' && (
        <div style={{ background: 'rgba(16, 185, 129, 0.08)', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--accent-emerald)', fontWeight: 600 }}>
          <Check size={12} />
          <span>Sincronização concluída com sucesso! ({driveFiles.length} arquivos disponíveis)</span>
        </div>
      )}

      {/* Conteúdo por Aba */}
      <main style={{ flex: 1 }}>
        {activeTab === 'catalog' && (
          <>
            {/* Banner de Boas-Vindas */}
            <div className="hero-banner">
              <div className="gold-badge hero-tag">
                <Sparkles size={12} />
                <span>Gestão Imobiliária Oficial</span>
              </div>
              <h1 className="hero-title">
                Catálogo de <span className="gold-gradient-text">Empreendimentos Vetter</span>
              </h1>
              <p className="hero-subtitle">
                Acesse plantas, tabelas de vendas, fotos e pastas do Google Drive digitando ou **falando por áudio**.
              </p>
            </div>

            {/* Seção de Busca e Filtros com Microfone */}
            <div className="search-filter-section">
              <div className="search-input-box">
                <Search size={18} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder={isSearchingVoice ? "Ouvindo... fale o nome do imóvel" : "Buscar por nome, praia, suítes ou falar..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                
                <button
                  type="button"
                  className={`voice-record-btn ${isSearchingVoice ? 'recording' : ''}`}
                  onClick={toggleSearchVoice}
                  title="Buscar falando por áudio"
                  style={{ width: 30, height: 30 }}
                >
                  {isSearchingVoice ? <MicOff size={15} /> : <Mic size={15} />}
                </button>

                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    style={{ color: 'var(--text-muted)', fontSize: 13 }}
                  >
                    Limpar
                  </button>
                )}
              </div>

              {/* Filtros em Chips */}
              <div className="filter-chips-container">
                {filterOptions.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`filter-chip ${selectedFilter === filter.id ? 'active' : ''}`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Listagem de Empreendimentos */}
            <div className="properties-grid">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    onSelect={setActivePropertyModal}
                    onOpenFloorPlan={handleOpenFloorPlan}
                  />
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                  <Building2 size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                  <p>Nenhum empreendimento encontrado para "{searchQuery}".</p>
                  <button 
                    className="btn-primary" 
                    style={{ margin: '14px auto 0', display: 'inline-flex' }}
                    onClick={() => { setSearchQuery(''); setSelectedFilter('all'); }}
                  >
                    Ver Todos os Imóveis
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'floorplans' && (
          <FloorPlanViewer selectedPropId={selectedPlanPropId} />
        )}

        {activeTab === 'assistant' && (
          <AssistantChat driveFiles={driveFiles} />
        )}

        {activeTab === 'drive' && (
          <DriveQuickHub driveFiles={driveFiles} syncStatus={syncStatus} onRefresh={() => runRealtimeDriveScanner().then(setDriveFiles)} />
        )}

        {activeTab === 'duty' && (
          <DutyTab />
        )}

        {activeTab === 'availability' && (
          <AvailabilityTab />
        )}

        {activeTab === 'schedule' && (
          <StaffScheduleTab />
        )}
      </main>

      {/* Modal de Detalhes do Imóvel */}
      {activePropertyModal && (
        <PropertyModal
          property={activePropertyModal}
          onClose={() => setActivePropertyModal(null)}
          onOpenFloorPlan={handleOpenFloorPlan}
        />
      )}

      {/* Barra de Navegação Inferior Fixa Mobile */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
