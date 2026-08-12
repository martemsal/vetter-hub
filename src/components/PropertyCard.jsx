import React from 'react';
import { MapPin, BedDouble, Car, Maximize2, ExternalLink, HardDrive, ArrowRight } from 'lucide-react';

export default function PropertyCard({ property, onSelect, onOpenFloorPlan }) {
  const getStatusClass = (status) => {
    const s = status.toLowerCase();
    if (s.includes('lançamento')) return 'status-lançamento';
    if (s.includes('construção') || s.includes('obra')) return 'status-em-construção';
    return 'status-pronto-para-morar';
  };

  return (
    <div className="property-card">
      <div className="card-image-wrap" onClick={() => onSelect(property)}>
        <img src={property.coverImage} alt={property.name} loading="lazy" />
        <div className="card-gradient-overlay" />
        
        <span className={`card-status-badge ${getStatusClass(property.status)}`}>
          {property.status}
        </span>

        <a
          href={property.driveFolderUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="card-drive-btn"
          onClick={(e) => e.stopPropagation()}
          title="Ver arquivos no Google Drive"
        >
          <HardDrive size={13} />
          <span>Drive</span>
          <ExternalLink size={10} />
        </a>

        <div className="card-price-tag">
          <div className="card-price-label">A partir de</div>
          <div className="card-price-val">{property.priceStartingAt}</div>
        </div>
      </div>

      <div className="card-content">
        <div className="card-title-row" onClick={() => onSelect(property)} style={{ cursor: 'pointer' }}>
          <h3 className="card-title">{property.name}</h3>
          <div className="card-location">
            <MapPin size={13} />
            <span>{property.location}</span>
          </div>
        </div>

        <div className="card-specs-row">
          <div className="card-spec-item">
            <BedDouble size={16} className="spec-icon" />
            <span className="spec-val">{property.specs.suites.split(' ')[0]} Suítes</span>
            <span className="spec-lbl">Tipologia</span>
          </div>
          <div className="card-spec-item">
            <Maximize2 size={16} className="spec-icon" />
            <span className="spec-val">{property.specs.area.split(' a ')[0]}</span>
            <span className="spec-lbl">Área Priv.</span>
          </div>
          <div className="card-spec-item">
            <Car size={16} className="spec-icon" />
            <span className="spec-val">{property.specs.garages.split(' ')[0]} Vagas</span>
            <span className="spec-lbl">Garagem</span>
          </div>
        </div>

        <div className="card-actions-row">
          <button className="btn-primary" onClick={() => onSelect(property)}>
            <span>Ver Detalhes & Arquivos</span>
            <ArrowRight size={14} />
          </button>
          <button 
            className="btn-secondary"
            onClick={() => onOpenFloorPlan(property)}
            title="Ver Plantas e Cotas"
          >
            <span>Plantas ({property.floorPlans?.length || 0})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
