import React, { useState, useMemo } from 'react';
import { 
  Users, Building, ShieldCheck, CheckCircle2, UserCheck, 
  ChevronRight, FileSpreadsheet, Edit3, Save, Briefcase, Calendar, 
  Coffee, Clock, Search, Sparkles, User, MapPin, Plane, Check, X
} from 'lucide-react';
import { getStoredStaffSchedule } from '../data/staffSchedule';

export default function StaffScheduleTab() {
  const [scheduleData, setScheduleData] = useState(() => getStoredStaffSchedule());
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date();
    const isCurrent = today.getFullYear() === 2026 && today.getMonth() === 8;
    return isCurrent ? String(today.getDate()) : "1";
  });
  
  const [selectedSector, setSelectedSector] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollaboratorModal, setSelectedCollaboratorModal] = useState(null);

  const daysList = scheduleData.days || [];
  const collaborators = scheduleData.collaborators || [];

  // Obter o dia atual selecionado
  const currentDayInfo = daysList.find(d => d.day === selectedDay) || daysList[0] || {
    day: "1",
    dayOfWeek: "Terça-feira",
    dateStr: "01/09/2026"
  };

  // Filtragem dos colaboradores
  const filteredCollaborators = useMemo(() => {
    return collaborators.filter(c => {
      const matchSector = selectedSector === 'todos' || c.sector.toLowerCase() === selectedSector.toLowerCase();
      const matchSearch = !searchTerm.trim() || 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.sector.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSector && matchSearch;
    });
  }, [collaborators, selectedSector, searchTerm]);

  // Contadores de status para o dia selecionado
  const stats = useMemo(() => {
    let working = 0;
    let off = 0;
    let plantao = 0;
    let vacations = 0;

    collaborators.forEach(c => {
      const status = (c.days[selectedDay] || '').toLowerCase();
      if (status.includes('trabalhado')) {
        working++;
      } else if (status.includes('folga')) {
        off++;
      } else if (status.includes('cv') || status.includes('piçarras') || status.includes('coral')) {
        plantao++;
      } else if (status.includes('férias') || status.includes('ferias')) {
        vacations++;
      }
    });

    return { working, off, plantao, vacations };
  }, [collaborators, selectedDay]);

  // Formatação de badge por tipo de status
  const getStatusBadge = (statusStr) => {
    const s = (statusStr || '').trim();
    const lower = s.toLowerCase();

    if (lower.includes('trabalhado')) {
      return (
        <span className="status-badge-custom status-working">
          <Check size={13} />
          <span>Trabalhando</span>
        </span>
      );
    }
    if (lower.includes('folga')) {
      return (
        <span className="status-badge-custom status-off">
          <Coffee size={13} />
          <span>Folga</span>
        </span>
      );
    }
    if (lower.includes('cv') || lower.includes('piçarras') || lower.includes('coral')) {
      return (
        <span className="status-badge-custom status-plantao">
          <Building size={13} />
          <span>{s}</span>
        </span>
      );
    }
    if (lower.includes('férias') || lower.includes('ferias')) {
      return (
        <span className="status-badge-custom status-vacation">
          <Plane size={13} />
          <span>Férias</span>
        </span>
      );
    }
    return (
      <span className="status-badge-custom status-neutral">
        <span>{s || 'Livre'}</span>
      </span>
    );
  };

  const getSectorColor = (sector) => {
    switch (sector.toLowerCase()) {
      case 'administrativo':
        return '#38bdf8'; // Sky blue
      case 'comercial':
        return 'var(--gold-primary)'; // Gold
      case 'sdr':
        return '#a855f7'; // Purple
      default:
        return '#94a3b8';
    }
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 40 }}>
      {/* Header da Aba */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="gold-badge">Escala de Trabalho Oficial</span>
          <h2 style={{ fontSize: 22, marginTop: 4 }}>Administrativo e Comercial</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            Consulte a escala de Setembro/2026 de toda a equipe Vetter.
          </p>
        </div>
      </div>

      {/* 1. Box da Data (Carrossel de Dias de Setembro) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={14} color="var(--gold-primary)" />
            <span>Data Selecionada ({currentDayInfo.dateStr} — {currentDayInfo.dayOfWeek})</span>
          </h4>
        </div>
        
        <div 
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 8,
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {daysList.map((d) => {
            const isSelected = selectedDay === d.day;
            const isWeekend = d.dayOfWeek && (d.dayOfWeek.toLowerCase().includes('sábado') || d.dayOfWeek.toLowerCase().includes('domingo'));
            
            return (
              <button
                key={d.day}
                onClick={() => setSelectedDay(d.day)}
                style={{
                  minWidth: 50,
                  height: 62,
                  borderRadius: '12px',
                  background: isSelected ? 'var(--gold-primary)' : 'var(--bg-card)',
                  border: isSelected ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)',
                  color: isSelected ? '#000' : 'var(--text-primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? '0 4px 12px rgba(212, 160, 23, 0.35)' : 'none'
                }}
              >
                <span style={{ fontSize: 9, opacity: isSelected ? 0.9 : 0.6, fontWeight: 700 }}>
                  {(d.dayOfWeek || 'DIA').substring(0, 3).toUpperCase()}
                </span>
                <span style={{ fontSize: 17, fontWeight: 800, marginTop: 2, color: isWeekend && !isSelected ? 'var(--accent-rose)' : 'inherit' }}>
                  {d.day}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Box de Estatísticas Rápidas do Dia */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8
        }}
      >
        <div className="stat-pill" style={{ borderColor: 'rgba(34, 197, 94, 0.3)', background: 'rgba(34, 197, 94, 0.08)' }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#4ade80' }}>{stats.working}</span>
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Trabalhando</span>
        </div>
        <div className="stat-pill" style={{ borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.08)' }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#f87171' }}>{stats.off}</span>
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Folga</span>
        </div>
        <div className="stat-pill" style={{ borderColor: 'rgba(212, 160, 23, 0.3)', background: 'rgba(212, 160, 23, 0.08)' }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--gold-primary)' }}>{stats.plantao}</span>
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Central Vendas</span>
        </div>
      </div>

      {/* 3. Filtros por Setor e Busca por Colaborador */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Barra de Busca de Nome */}
        <div className="search-input-wrap" style={{ margin: 0 }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Buscar colaborador (ex: Daniel, Sabrina, Bianca)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Chips de Setor */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {[
            { id: 'todos', label: `Todos (${collaborators.length})` },
            { id: 'administrativo', label: `Administrativo (5)` },
            { id: 'comercial', label: `Comercial (7)` },
            { id: 'sdr', label: `SDR (4)` }
          ].map((sec) => {
            const isSelected = selectedSector === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setSelectedSector(sec.id)}
                className={`filter-chip ${isSelected ? 'active' : ''}`}
                style={{ flexShrink: 0 }}
              >
                {sec.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Lista dos Colaboradores */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Equipe ({filteredCollaborators.length})
          </h4>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Toque para ver o mês completo
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredCollaborators.map((c) => {
            const todayStatus = c.days[selectedDay] || 'Livre';
            const sectorColor = getSectorColor(c.sector);
            const initials = c.name.split(' ')[0].substring(0, 2).toUpperCase();

            return (
              <div
                key={c.name}
                onClick={() => setSelectedCollaboratorModal(c)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease, border-color 0.15s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Linha colorida do setor à esquerda */}
                <div 
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    background: sectorColor
                  }} 
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div 
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${sectorColor}66`,
                      color: sectorColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 800,
                      flexShrink: 0
                    }}
                  >
                    {initials}
                  </div>

                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>
                      {c.name}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                      <span style={{ fontSize: 11, color: sectorColor, fontWeight: 600 }}>
                        {c.sector}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        • {c.totalTrab}d trab / {c.totalFolga}d folga
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {getStatusBadge(todayStatus)}
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal / Sheet com a Escala Individual Completa do Mês */}
      {selectedCollaboratorModal && (
        <div 
          className="modal-backdrop"
          onClick={() => setSelectedCollaboratorModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#0B132B',
              borderTop: '1px solid var(--border-gold)',
              borderRadius: '24px 24px 0 0',
              width: '100%',
              maxWidth: 500,
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '24px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              animation: 'slideUp 0.3s ease'
            }}
          >
            {/* Header do Modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div 
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'var(--gold-subtle)',
                    border: '1px solid var(--border-gold)',
                    color: 'var(--gold-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 800
                  }}
                >
                  {selectedCollaboratorModal.name.split(' ')[0].substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <span className="gold-gradient-text" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                    {selectedCollaboratorModal.sector}
                  </span>
                  <h3 style={{ fontSize: 18, fontWeight: 800 }}>
                    {selectedCollaboratorModal.name}
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    Total do mês: {selectedCollaboratorModal.totalTrab} dias trabalhados • {selectedCollaboratorModal.totalFolga} folgas
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedCollaboratorModal(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Calendário Completo dos 30 Dias do Colaborador */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              <h4 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Escala de Setembro/2026 (Dia a Dia)
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {daysList.map((d) => {
                  const dayStatus = selectedCollaboratorModal.days[d.day] || 'Livre';
                  const isWeekend = d.dayOfWeek && (d.dayOfWeek.toLowerCase().includes('sábado') || d.dayOfWeek.toLowerCase().includes('domingo'));

                  return (
                    <div
                      key={d.day}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 800, minWidth: 24, color: isWeekend ? 'var(--accent-rose)' : 'var(--gold-primary)' }}>
                          {d.day.padStart(2, '0')}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          {d.dayOfWeek}
                        </span>
                      </div>
                      <div>
                        {getStatusBadge(dayStatus)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
