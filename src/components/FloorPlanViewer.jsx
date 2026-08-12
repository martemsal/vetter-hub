import React, { useState } from 'react';
import { 
  Maximize2, ZoomIn, ZoomOut, Compass, BedDouble, 
  Car, HardDrive, ExternalLink, Sparkles 
} from 'lucide-react';
import { PROPERTIES_DATA, DRIVE_ROOT_URL } from '../data/properties';

export default function FloorPlanViewer({ selectedPropId, initialPlanId }) {
  const [selectedProperty, setSelectedProperty] = useState(
    PROPERTIES_DATA.find((p) => p.id === selectedPropId) || PROPERTIES_DATA[0]
  );
  
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  const currentPlan = selectedProperty.floorPlans?.[currentPlanIndex] || selectedProperty.floorPlans?.[0];

  const handlePropertyChange = (e) => {
    const prop = PROPERTIES_DATA.find((p) => p.id === e.target.value);
    if (prop) {
      setSelectedProperty(prop);
      setCurrentPlanIndex(0);
      setZoomLevel(1);
    }
  };

  const handleZoom = (delta) => {
    setZoomLevel((prev) => Math.min(Math.max(prev + delta, 0.8), 2.2));
  };

  return (
    <div className="floorplan-view-container" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="gold-badge">Análise Arquitetônica</span>
            <h2 style={{ fontSize: 22, marginTop: 4 }}>Leitor de Plantas & Cotas</h2>
          </div>
          <a
            href={selectedProperty.driveFolderUrl || DRIVE_ROOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="drive-pill-btn"
          >
            <HardDrive size={13} />
            <span>Drive</span>
            <ExternalLink size={10} />
          </a>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Visualize as dimensões exatas dos cômodos, áreas privativas e insolação das tipologias Vetter.
        </p>
      </div>

      {/* Seletor de Empreendimento */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Selecionar Empreendimento
        </label>
        <select
          value={selectedProperty.id}
          onChange={handlePropertyChange}
          style={{
            padding: '12px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {PROPERTIES_DATA.map((p) => (
            <option key={p.id} value={p.id} style={{ background: '#0e172e', color: '#fff' }}>
              {p.name} ({p.city})
            </option>
          ))}
        </select>
      </div>

      {/* Seletor de Tipologia do Imóvel */}
      <div className="filter-chips-container">
        {selectedProperty.floorPlans?.map((plan, idx) => (
          <button
            key={plan.id}
            onClick={() => {
              setCurrentPlanIndex(idx);
              setZoomLevel(1);
            }}
            className={`filter-chip ${currentPlanIndex === idx ? 'active' : ''}`}
          >
            <span>{plan.title}</span>
            <span style={{ fontSize: 11, opacity: 0.8 }}>({plan.area.split(' ')[0]})</span>
          </button>
        ))}
      </div>

      {currentPlan && (
        <div className="floorplan-viewer-box">
          {/* Card Principal da Planta */}
          <div 
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden'
            }}
          >
            {/* Header da Planta */}
            <div 
              style={{
                padding: '14px 16px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.02)'
              }}
            >
              <div>
                <h3 style={{ fontSize: 16 }}>{currentPlan.title}</h3>
                <div style={{ fontSize: 12, color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <Compass size={13} />
                  <span>{currentPlan.orientation}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                <button 
                  className="header-btn" 
                  onClick={() => handleZoom(-0.2)}
                  title="Diminuir Zoom"
                >
                  <ZoomOut size={16} />
                </button>
                <button 
                  className="header-btn" 
                  onClick={() => handleZoom(0.2)}
                  title="Aumentar Zoom"
                >
                  <ZoomIn size={16} />
                </button>
              </div>
            </div>

            {/* Container da Imagem com Zoom */}
            <div 
              className="floorplan-img-container"
              style={{
                height: '280px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <img
                src={currentPlan.image}
                alt={currentPlan.title}
                style={{
                  transform: `scale(${zoomLevel})`,
                  transition: 'transform 0.2s ease',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
              <div 
                style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  background: 'rgba(0,0,0,0.7)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: 11,
                  color: 'var(--text-muted)'
                }}
              >
                Zoom: {Math.round(zoomLevel * 100)}%
              </div>
            </div>

            {/* Specs Resumo */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                padding: '12px',
                background: 'rgba(0, 0, 0, 0.2)',
                borderTop: '1px solid var(--border-subtle)',
                textAlign: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Área Privativa</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold-primary)' }}>{currentPlan.area}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Suítes</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{currentPlan.suites} Suítes</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Garagens</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{currentPlan.garages} Vagas</div>
              </div>
            </div>
          </div>

          {/* Tabela de Cômodos e Cotas */}
          <div 
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={16} color="var(--gold-primary)" />
                <span>Dimensões dos Ambientes</span>
              </h4>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{currentPlan.rooms?.length || 0} cômodos</span>
            </div>

            <table className="room-dimensions-table">
              <thead>
                <tr>
                  <th>Ambiente</th>
                  <th style={{ textAlign: 'center' }}>Medidas (LxC)</th>
                  <th style={{ textAlign: 'right' }}>Área Útil</th>
                </tr>
              </thead>
              <tbody>
                {currentPlan.rooms?.map((room, idx) => (
                  <tr key={idx}>
                    <td><strong>{room.name}</strong></td>
                    <td className="dim-val" style={{ textAlign: 'center' }}>{room.dimensions}</td>
                    <td className="dim-val" style={{ textAlign: 'right' }}>{room.area}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
