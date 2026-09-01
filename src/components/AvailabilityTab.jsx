import React, { useState, useEffect } from 'react';
import { 
  Building2, Search, CheckCircle2, XCircle, AlertCircle, 
  DollarSign, ArrowUpRight, Scale, ChevronDown, ChevronUp, FileSpreadsheet, RefreshCw, Layers 
} from 'lucide-react';
import { getPropertyAvailability, getAvailablePipelineProperties } from '../utils/availabilityEngine';

export default function AvailabilityTab() {
  const [properties] = useState(() => getAvailablePipelineProperties());
  const [selectedPropertyId, setSelectedPropertyId] = useState(() => {
    const list = getAvailablePipelineProperties();
    return list.length > 0 ? list[0].id : 'bal-harbour';
  });
  
  const [rawUnits, setRawUnits] = useState([]);
  const [displayUnits, setDisplayUnits] = useState([]);
  
  // Filtros locais (Finais, Tipos e Status)
  const [filterFinal, setFilterFinal] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('Disponível');
  
  const [loading, setLoading] = useState(false);

  // Carrega os dados de unidades do Pipeline ao mudar o empreendimento
  useEffect(() => {
    async function loadData() {
      const data = getPropertyAvailability(selectedPropertyId);
      setRawUnits(data);
      
      // Carrega inicialmente mostrando as unidades disponíveis
      const initialDisplay = data.filter(u => u.situacao === 'Disponível');
      setDisplayUnits(initialDisplay);
      setFilterFinal('all');
      setFilterType('all');
      setFilterStatus('Disponível');
    }
    loadData();
  }, [selectedPropertyId]);

  // Função disparada ao clicar no botão "Buscar"
  const handleSearch = () => {
    setLoading(true);
    
    setTimeout(() => {
      const results = rawUnits.filter(u => {
        // Filtro por Final
        const matchesFinal = filterFinal === 'all' || u.final === filterFinal;
        
        // Filtro por Tipo (2S, 3S, 4S...)
        const matchesType = filterType === 'all' || u.tipo.toUpperCase().includes(filterType.toUpperCase());
        
        // Filtro por Status
        const matchesStatus = filterStatus === 'all' || u.situacao === filterStatus;
        
        return matchesFinal && matchesType && matchesStatus;
      });
      
      setDisplayUnits(results);
      setLoading(false);
    }, 100);
  };

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

  const getTypeBadge = (tipo) => {
    let color = '#94a3b8';
    let bg = 'rgba(255, 255, 255, 0.05)';
    
    if (tipo.includes('2S')) {
      color = '#38bdf8';
      bg = 'rgba(56, 189, 248, 0.12)';
    } else if (tipo.includes('3S')) {
      color = 'var(--gold-primary)';
      bg = 'rgba(212, 160, 23, 0.12)';
    } else if (tipo.includes('4S')) {
      color = '#a855f7';
      bg = 'rgba(168, 85, 247, 0.12)';
    } else if (tipo.includes('5S')) {
      color = '#ec4899';
      bg = 'rgba(236, 72, 153, 0.12)';
    }

    return (
      <span 
        style={{
          fontSize: 11,
          fontWeight: 700,
          color,
          background: bg,
          padding: '2px 8px',
          borderRadius: 6,
          border: `1px solid ${color}44`
        }}
      >
        {tipo}
      </span>
    );
  };

  const currentPropertyObj = properties.find(p => p.id === selectedPropertyId);

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 40 }}>
      <div>
        <span className="gold-badge">Pipeline de Vendas Oficial</span>
        <h2 style={{ fontSize: 22, marginTop: 4 }}>Disponibilidade & VGV</h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
          Consulte unidades, tipologias e valores VGV de todos os 22 empreendimentos Vetter.
        </p>
      </div>

      {/* Seleção do Empreendimento */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Empreendimento ({properties.length} disponíveis)
          </h4>
          {currentPropertyObj && (
            <span style={{ fontSize: 11, color: 'var(--accent-emerald)', fontWeight: 600 }}>
              {currentPropertyObj.availableCount} disponíveis de {currentPropertyObj.totalUnits}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {properties.map((p) => {
            const isSelected = selectedPropertyId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPropertyId(p.id)}
                className={`filter-chip ${isSelected ? 'active' : ''}`}
                style={{ flexShrink: 0 }}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Layout de Filtros: Finais, Tipo, Status e Botão Buscar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr auto', gap: 6, alignItems: 'center' }}>
        {/* Seletor de Finais */}
        <select
          value={filterFinal}
          onChange={(e) => setFilterFinal(e.target.value)}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 8px',
            color: 'var(--text-primary)',
            fontSize: 12,
            outline: 'none'
          }}
        >
          <option value="all">Finais</option>
          <option value="01">Final 01</option>
          <option value="02">Final 02</option>
          <option value="03">Final 03</option>
          <option value="04">Final 04</option>
          <option value="05">Final 05</option>
          <option value="06">Final 06</option>
          <option value="07">Final 07</option>
        </select>

        {/* Seletor de Tipo */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 8px',
            color: 'var(--text-primary)',
            fontSize: 12,
            outline: 'none'
          }}
        >
          <option value="all">Tipos</option>
          <option value="2S">2 Suítes</option>
          <option value="3S">3 Suítes</option>
          <option value="4S">4 Suítes</option>
          <option value="5S">5 Suítes</option>
          <option value="Garden">Garden</option>
          <option value="Sala">Sala</option>
        </select>

        {/* Seletor de Status */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 8px',
            color: 'var(--text-primary)',
            fontSize: 12,
            outline: 'none'
          }}
        >
          <option value="all">Todos Status</option>
          <option value="Disponível">🟢 Disponíveis</option>
          <option value="Vendida">🔴 Vendidas</option>
          <option value="Bloqueada">🟡 Bloqueadas</option>
        </select>

        {/* Botão Buscar */}
        <button
          className="btn-primary"
          onClick={handleSearch}
          style={{
            padding: '10px 14px',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <Search size={14} />
          <span>Buscar</span>
        </button>
      </div>

      {/* Listagem de Unidades */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
          <RefreshCw size={32} className="recording" style={{ margin: '0 auto 12px' }} />
          <p>Filtrando unidades...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {displayUnits.length > 0 ? (
            displayUnits.map((u, idx) => {
              return (
                <div 
                  key={`${u.propertyId}-${u.unit}-${idx}`}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16, fontWeight: 800 }}>{u.unit}</span>
                      {getTypeBadge(u.tipo)}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                      Área Privativa: {u.areaPrivativa || 'Sob consulta'}
                      {u.valorM2 && <span style={{ marginLeft: 6 }}>• m²: {u.valorM2}</span>}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--gold-primary)' }}>
                      {u.valorVGV}
                    </div>
                    <div>{getStatusBadge(u.situacao)}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
              <FileSpreadsheet size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <p>Nenhuma unidade localizada para os filtros selecionados.</p>
              <button 
                className="btn-secondary" 
                onClick={() => {
                  setFilterFinal('all');
                  setFilterType('all');
                  setFilterStatus('all');
                  setDisplayUnits(rawUnits);
                }}
                style={{ margin: '12px auto 0' }}
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
