import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Building2, SlidersHorizontal, MapPin } from 'lucide-react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import PropertyCard from './components/PropertyCard';
import PropertyModal from './components/PropertyModal';
import FloorPlanViewer from './components/FloorPlanViewer';
import AssistantChat from './components/AssistantChat';
import DriveQuickHub from './components/DriveQuickHub';
import { PROPERTIES_DATA } from './data/properties';

export default function App() {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'floorplans' | 'assistant' | 'drive'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activePropertyModal, setActivePropertyModal] = useState(null);
  const [selectedPlanPropId, setSelectedPlanPropId] = useState(null);

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

  return (
    <div className="app-container">
      {/* Header Fixo */}
      <Header onOpenDriveHub={() => setActiveTab('drive')} />

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
                Acesse plantas, tabelas de vendas, fotos e pastas do Google Drive com rapidez no seu celular.
              </p>
            </div>

            {/* Seção de Busca e Filtros */}
            <div className="search-filter-section">
              <div className="search-input-box">
                <Search size={18} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Buscar por empreendimento, praia, suítes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
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
          <AssistantChat onNavigateToPlan={(propId) => {
            setSelectedPlanPropId(propId);
            setActiveTab('floorplans');
          }} />
        )}

        {activeTab === 'drive' && (
          <DriveQuickHub />
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
