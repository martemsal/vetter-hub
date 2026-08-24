import React, { useState, useEffect } from 'react';
import { 
  Building2, Search, CheckCircle2, XCircle, AlertCircle, 
  DollarSign, ArrowUpRight, Scale, ChevronDown, ChevronUp, FileSpreadsheet, RefreshCw 
} from 'lucide-react';
import { getAvailabilityFiles } from '../data/availabilityIndex';
import { getPropertyAvailability } from '../utils/availabilityEngine';

export default function AvailabilityTab() {
  const [properties] = useState(() => getAvailabilityFiles());
  const [selectedPropertyId, setSelectedPropertyId] = useState('bal-harbour');
  const [units, setUnits] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedFinal, setSelectedFinal] = useState('all');
  const [loading, setLoading] = useState(false);
  const [expandedUnit, setExpandedUnit] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getPropertyAvailability(selectedPropertyId);
      setUnits(data);
      setLoading(false);
    }
    loadData();
  }, [selectedPropertyId]);

  const filteredUnits = units.filter(u => {
    const matchesSearch = u.unit.toLowerCase().includes(searchFilter.toLowerCase()) || 
                          u.situacao.toLowerCase().includes(searchFilter.toLowerCase());
    
    if (selectedFinal === 'all') return matchesSearch;
    return matchesSearch && u.final === selectedFinal;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Disponível':
        return (
          <span className="gold-badge" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-emerald)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            🟢 Disponível
          </span>
        );
      case 'Vendida':
        return (
          <span className="gold-badge" style={{ background: 'rgba(239, 68, 68, 0.12)', color: 'var(--accent-rose)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            🔴 Vendida
          </span>
        );
      case 'Bloqueada':
        return (
          <span className="gold-badge" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            🟡 Bloqueada
          </span>
        );
      default:
        return (
          <span className="gold-badge">
            {status}
          </span>
        );
    }
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 40 }}>
      <div>
        <span className="gold-badge">Tabela de Vendas Integrada</span>
        <h2 style={{ fontSize: 22, marginTop: 4 }}>Disponibilidade & Fluxo</h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          Consulte o status e as condições de pagamento das unidades em tempo real.
        </p>
      </div>

      {/* Seleção do Empreendimento */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h4 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Selecione o Empreendimento
        </h4>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {properties.map((p) => {
            const isSelected = selectedPropertyId === p.propertyId;
            return (
              <button
                key={p.propertyId}
                onClick={() => {
                  setSelectedPropertyId(p.propertyId);
                  setExpandedUnit(null);
                }}
                className={`filter-chip ${isSelected ? 'active' : ''}`}
                style={{ flexShrink: 0 }}
              >
                {p.propertyName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtros e Busca de Unidade */}
      <div style={{ display: 'flex', gap: 8 }}>
        <div className="search-input-box" style={{ flex: 1 }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Ex: Apto 601, Disponível..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>

        {/* Dropdown de Finais */}
        <select
          value={selectedFinal}
          onChange={(e) => setSelectedFinal(e.target.value)}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '0 12px',
            color: 'var(--text-primary)',
            fontSize: 13
          }}
        >
          <option value="all">Todos Finais</option>
          <option value="01">Final 01</option>
          <option value="02">Final 02</option>
          <option value="03">Final 03</option>
          <option value="04">Final 04</option>
        </select>
      </div>

      {/* Listagem de Unidades */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
          <RefreshCw size={32} className="recording" style={{ margin: '0 auto 12px' }} />
          <p>Carregando unidades e fluxos de pagamentos...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredUnits.length > 0 ? (
            filteredUnits.map((u) => {
              const isExpanded = expandedUnit === u.unit;
              return (
                <div 
                  key={u.unit}
                  style={{
                    background: 'var(--bg-card)',
                    border: isExpanded ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    transition: 'all 0.2s'
                  }}
                >
                  <div 
                    onClick={() => setExpandedUnit(isExpanded ? null : u.unit)}
                    style={{
                      padding: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800 }}>{u.unit}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        Área Privativa: {u.areaPrivativa}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gold-primary)' }}>{u.valorTotal}</div>
                        <div style={{ marginTop: 2 }}>{getStatusBadge(u.situacao)}</div>
                      </div>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {/* Fluxo de Pagamento Expandido */}
                  {isExpanded && (
                    <div 
                      style={{
                        padding: '14px',
                        background: 'rgba(230, 195, 92, 0.03)',
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12
                      }}
                    >
                      <h4 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--gold-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <DollarSign size={14} />
                        <span>Fluxo de Pagamento Sugerido</span>
                      </h4>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <div style={{ background: '#020617', padding: 8, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Entrada (1x)</span>
                          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{u.fluxo.entrada || 'Consulte'}</div>
                        </div>

                        <div style={{ background: '#020617', padding: 8, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Parcelas Mensais</span>
                          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{u.fluxo.mensais || 'Consulte'}</div>
                        </div>

                        <div style={{ background: '#020617', padding: 8, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Reforços Anuais</span>
                          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{u.fluxo.anuais || 'Consulte'}</div>
                        </div>

                        <div style={{ background: '#020617', padding: 8, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Parcela Final</span>
                          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{u.fluxo.final || 'Consulte'}</div>
                        </div>
                      </div>

                      {u.espacoComplementar && (
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)', background: 'rgba(255, 255, 255, 0.02)', padding: '6px 10px', borderRadius: 4 }}>
                          📦 **Complementos:** {u.espacoComplementar}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
              <FileSpreadsheet size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <p>Nenhuma unidade localizada para "{searchFilter}".</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
