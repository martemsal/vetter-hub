import React, { useState } from 'react';
import { 
  Users, Building, ShieldCheck, CheckCircle2, UserCheck, 
  ChevronRight, FileSpreadsheet, Edit3, Save, Briefcase, Calendar 
} from 'lucide-react';
import { getStoredStaffSchedule, saveStoredStaffSchedule } from '../data/staffSchedule';

export default function StaffScheduleTab() {
  const [scheduleData, setScheduleData] = useState(() => getStoredStaffSchedule());
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date();
    const isCurrent = today.getFullYear() === 2026 && today.getMonth() === 8;
    return isCurrent ? String(today.getDate()) : "1";
  });
  
  const [selectedSector, setSelectedSector] = useState(() => {
    return scheduleData.sectors && scheduleData.sectors.length > 0 ? scheduleData.sectors[0].id : 'atendimento';
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [rawTextImport, setRawTextImport] = useState('');

  // Encontra a escala para o dia selecionado
  const currentDayScale = scheduleData.scale.find(s => s.day === selectedDay) || scheduleData.scale[0] || {
    day: "1",
    dayOfWeek: "Dia",
    dateStr: "01/09/2026",
    shifts: {}
  };

  const currentSectorObj = scheduleData.sectors.find(s => s.id === selectedSector) || scheduleData.sectors[0];
  const assignedStaff = currentDayScale.shifts ? currentDayScale.shifts[selectedSector] : 'Não escalado';

  const handleDaySelect = (day) => {
    setSelectedDay(day);
  };

  const handleImportCSV = () => {
    if (!rawTextImport.trim()) return;

    try {
      const lines = rawTextImport.trim().split('\n');
      if (lines.length === 0) return;

      // Se a primeira linha tiver os nomes dos setores
      const firstLineParts = lines[0].split('\t');
      let sectors = scheduleData.sectors;
      let startRow = 0;

      // Se a primeira linha começar com "Dia" ou "Data", podemos extrair os setores das colunas
      if (firstLineParts[0].toLowerCase().includes('dia') || firstLineParts[0].toLowerCase().includes('data')) {
        const customSectors = [];
        for (let j = 2; j < firstLineParts.length; j++) {
          const secName = firstLineParts[j].trim();
          if (secName) {
            customSectors.push({
              id: `sec-${j}-${secName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
              label: secName
            });
          }
        }
        if (customSectors.length > 0) {
          sectors = customSectors;
        }
        startRow = 1;
      }

      const parsedScale = [];

      for (let i = startRow; i < lines.length; i++) {
        const parts = lines[i].split('\t');
        if (parts.length >= 3) {
          const dateStr = parts[0].trim();
          const dayOfWeek = parts[1] ? parts[1].trim() : '';
          
          const dayMatch = dateStr.match(/^(\d+)/);
          const day = dayMatch ? dayMatch[1] : String(i + 1);
          
          const shifts = {};
          for (let col = 2; col < parts.length; col++) {
            const sectorIdx = col - 2;
            if (sectorIdx < sectors.length) {
              shifts[sectors[sectorIdx].id] = parts[col].trim();
            }
          }

          parsedScale.push({
            day,
            dayOfWeek: dayOfWeek || 'Dia',
            dateStr,
            shifts
          });
        }
      }

      if (parsedScale.length > 0) {
        const newScheduleData = {
          month: scheduleData.month || "Mês Atual",
          year: "2026",
          sectors,
          scale: parsedScale
        };
        setScheduleData(newScheduleData);
        saveStoredStaffSchedule(newScheduleData);
        if (sectors.length > 0) {
          setSelectedSector(sectors[0].id);
        }
        setIsEditing(false);
        setRawTextImport('');
        alert('Escala de colaboradores importada e atualizada com sucesso!');
      } else {
        alert('Nenhuma linha válida encontrada. Certifique-se de copiar as colunas do Excel.');
      }
    } catch (e) {
      console.error(e);
      alert('Erro ao processar os dados do Excel. Verifique a formatação.');
    }
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 40 }}>
      {/* Header da Aba */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="gold-badge">Gestão de Equipe</span>
          <h2 style={{ fontSize: 22, marginTop: 4 }}>Escala de Colaboradores</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            Acompanhe a escala por setor, colaborador e data.
          </p>
        </div>

        <button
          className="header-btn"
          onClick={() => setIsEditing(!isEditing)}
          title="Editar ou colar nova escala do Excel"
        >
          <Edit3 size={16} />
        </button>
      </div>

      {/* Janela de Importação da Planilha */}
      {isEditing && (
        <div 
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}
        >
          <h3 style={{ fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
            <FileSpreadsheet size={18} color="var(--gold-primary)" />
            <span>Alimentar Escala via Excel</span>
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Selecione a tabela na sua planilha do Excel (com colunas de Data, Dia da Semana e os Setores), copie (Ctrl+C) e cole na caixa abaixo:
          </p>
          <textarea
            placeholder="Cole aqui as células copiadas do Excel (Ctrl+V)..."
            value={rawTextImport}
            onChange={(e) => setRawTextImport(e.target.value)}
            style={{
              width: '100%',
              height: 120,
              background: '#020617',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: 8,
              fontSize: 11,
              fontFamily: 'monospace',
              color: 'var(--text-primary)'
            }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-primary" onClick={handleImportCSV} style={{ flex: 1 }}>
              <Save size={14} />
              <span>Importar Escala</span>
            </button>
            <button className="btn-secondary" onClick={() => setIsEditing(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* 1. Box da Data (Carrossel de Dias) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={14} />
            <span>Data & Dia ({scheduleData.month} / {scheduleData.year})</span>
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
          {scheduleData.scale.map((s) => {
            const isSelected = selectedDay === s.day;
            const isWeekend = s.dayOfWeek && (s.dayOfWeek.includes('Sábado') || s.dayOfWeek.includes('Domingo'));
            
            return (
              <button
                key={s.day}
                onClick={() => handleDaySelect(s.day)}
                style={{
                  minWidth: 48,
                  height: 60,
                  borderRadius: '10px',
                  background: isSelected ? 'var(--gold-primary)' : 'var(--bg-card)',
                  border: isSelected ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)',
                  color: isSelected ? '#000' : 'var(--text-primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: 9, opacity: isSelected ? 0.8 : 0.6, fontWeight: 700 }}>
                  {(s.dayOfWeek || 'DIA').substring(0, 3).toUpperCase()}
                </span>
                <span style={{ fontSize: 16, fontWeight: 800, marginTop: 2, color: isWeekend && !isSelected ? 'var(--accent-rose)' : 'inherit' }}>
                  {s.day}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Box do Setor (Seletor em Chips) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h4 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Briefcase size={14} />
          <span>Setor / Departamento</span>
        </h4>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {scheduleData.sectors.map((sec) => {
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

      {/* 3. Box do Colaborador (Card Principal de Destaque) */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.35) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-lg)',
          padding: '22px 18px',
          boxShadow: 'var(--shadow-gold)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 12
        }}
      >
        <div 
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'var(--gold-subtle)',
            border: '2px solid var(--border-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gold-primary)',
            fontSize: 22,
            fontWeight: 800
          }}
        >
          {assignedStaff ? assignedStaff.substring(0, 2).toUpperCase() : 'EC'}
        </div>

        <div>
          <span className="gold-gradient-text" style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {currentSectorObj?.label}
          </span>
          <h3 style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>
            {assignedStaff || 'Ninguém escalado'}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            {currentDayScale.dateStr} — ({currentDayScale.dayOfWeek})
          </p>
        </div>

        <div 
          style={{
            marginTop: 4,
            width: '100%',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: 12,
            fontSize: 12,
            color: 'var(--accent-emerald)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6
          }}
        >
          <CheckCircle2 size={14} />
          <span>Colaborador Confirmado na Escala</span>
        </div>
      </div>

      {/* Visão Geral da Escala Completa do Dia */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h4 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Todos os Setores neste dia
        </h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {scheduleData.sectors.map((sec) => {
            const staffName = currentDayScale.shifts ? currentDayScale.shifts[sec.id] : null;
            const isChosenSector = selectedSector === sec.id;
            
            return (
              <div 
                key={sec.id}
                onClick={() => setSelectedSector(sec.id)}
                style={{
                  background: 'var(--bg-card)',
                  border: isChosenSector ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Briefcase size={16} color={isChosenSector ? "var(--gold-primary)" : "var(--text-muted)"} />
                  <span style={{ fontSize: 13, fontWeight: isChosenSector ? 700 : 500 }}>{sec.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: isChosenSector ? 'var(--gold-primary)' : 'var(--text-primary)' }}>
                    {staffName || 'Livre'}
                  </span>
                  <ChevronRight size={14} color="var(--text-muted)" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
