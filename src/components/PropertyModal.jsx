import React, { useState } from 'react';
import { 
  X, HardDrive, FileSpreadsheet, BookOpen, Film, Camera, 
  MapPin, CheckCircle2, Share2, Layers, ExternalLink 
} from 'lucide-react';
import { DRIVE_ROOT_URL } from '../data/properties';

export default function PropertyModal({ property, onClose, onOpenFloorPlan }) {
  const [activeTab, setActiveTab] = useState('materials');

  if (!property) return null;

  const handleShare = () => {
    const text = `Confira os materiais e plantas do *${property.name}* (Vetter):\n📂 Google Drive: ${property.driveFolderUrl}\n📐 Tipologia: ${property.specs.suites} | ${property.specs.area}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-bottom-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle-bar">
          <div className="sheet-handle" />
        </div>

        <div className="modal-header">
          <div>
            <span className="gold-badge" style={{ marginBottom: 4 }}>{property.status}</span>
            <h2 style={{ fontSize: 20, marginTop: 4 }}>{property.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', fontSize: 12 }}>
              <MapPin size={12} />
              <span>{property.location}</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <div className="modal-tabs">
          <button 
            className={`modal-tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
            onClick={() => setActiveTab('materials')}
          >
            <HardDrive size={15} />
            <span>Materiais & Drive</span>
          </button>
          <button 
            className={`modal-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            <span>Especificações</span>
          </button>
          <button 
            className={`modal-tab-btn ${activeTab === 'plans' ? 'active' : ''}`}
            onClick={() => setActiveTab('plans')}
          >
            <Layers size={15} />
            <span>Plantas ({property.floorPlans?.length || 0})</span>
          </button>
        </div>

        <div className="modal-body-scroll">
          {activeTab === 'materials' && (
            <>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Acesse diretamente os arquivos oficiais na pasta do Google Drive ou compartilhe com seus clientes:
              </p>

              <div className="materials-grid">
                <a
                  href={property.driveFolderUrl || DRIVE_ROOT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="material-card-btn"
                >
                  <div className="material-icon-box icon-drive">
                    <HardDrive size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                      Pasta no Drive <ExternalLink size={11} />
                    </strong>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Todos os arquivos</div>
                  </div>
                </a>

                <a
                  href={property.materials.tablePdfUrl || DRIVE_ROOT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="material-card-btn"
                >
                  <div className="material-icon-box icon-table">
                    <FileSpreadsheet size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                      Tabela de Preços <ExternalLink size={11} />
                    </strong>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Valores & condições</div>
                  </div>
                </a>

                <a
                  href={property.materials.bookPdfUrl || DRIVE_ROOT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="material-card-btn"
                >
                  <div className="material-icon-box icon-book">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                      Book & Apresentação <ExternalLink size={11} />
                    </strong>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Material comercial</div>
                  </div>
                </a>

                <a
                  href={property.driveFolderUrl || DRIVE_ROOT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="material-card-btn"
                >
                  <div className="material-icon-box icon-video">
                    <Camera size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                      Fotos & Obras <ExternalLink size={11} />
                    </strong>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{property.materials.photosCount} fotos em alta</div>
                  </div>
                </a>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <button className="btn-primary" onClick={handleShare} style={{ flex: 1 }}>
                  <Share2 size={16} />
                  <span>Compartilhar no WhatsApp</span>
                </button>
              </div>
            </>
          )}

          {activeTab === 'specs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {property.description}
              </p>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: 14, marginBottom: 8, color: 'var(--gold-primary)' }}>Dados do Projeto</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
                  <div><strong>Previsão de Entrega:</strong> {property.deliveryDate}</div>
                  <div><strong>Metragem:</strong> {property.specs.area}</div>
                  <div><strong>Tipologia:</strong> {property.specs.suites}</div>
                  <div><strong>Garagens:</strong> {property.specs.garages}</div>
                  <div><strong>Total de Unidades:</strong> {property.specs.totalUnits} apartamentos</div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: 14, marginBottom: 8, color: 'var(--gold-primary)' }}>Diferenciais de Padrão Vetter</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {property.specs.differentiators.map((diff, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                      <CheckCircle2 size={15} style={{ color: 'var(--accent-emerald)', marginTop: 2, flexShrink: 0 }} />
                      <span>{diff}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'plans' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Plantas baixas cotadas com detalhamento de metragens e disposições:
              </p>

              {property.floorPlans?.map((plan) => (
                <div 
                  key={plan.id}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{plan.title}</strong>
                    <span className="gold-badge">{plan.area}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    Orientação: {plan.orientation} • {plan.suites} Suítes • {plan.garages} Vagas
                  </div>
                  
                  <button 
                    className="btn-primary" 
                    style={{ marginTop: 4 }}
                    onClick={() => {
                      onClose();
                      onOpenFloorPlan(property, plan.id);
                    }}
                  >
                    <Layers size={14} />
                    <span>Abrir Visualizador de Cômodos & Cotas</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
