import React, { useState } from 'react';
import { 
  Users, Building, ShieldCheck, CheckCircle2, UserCheck, 
  ChevronRight, FileSpreadsheet, Edit3, Save, Briefcase, Calendar, Coffee, Clock 
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
    return scheduleData.sectors && scheduleData.sectors.length > 0 ? scheduleData.sectors[0].id : 'todos';
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [rawTextImport, setRawTextImport] = useState('');

  // Encontra a escala para o dia selecionado
  const currentDayScale = scheduleData.scale.find(s => s.day === selectedDay) || scheduleData.scale[0] || {
    day: "1",
    dayOfWeek: "Terça-feira",
    dateStr: "01/09/2026",
    shifts: {}
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
  };

  // Parser avançado específico para o modelo de cabeçalho da Vetter:
  // [Folga] \t [Setor] \t [Colaborador] \t [01/09/2026] \t [02/09/2026] ...
  const handleImportExcelVetter = () => {
    if (!rawTextImport.trim()) return;

    try {
      const rawLines = rawTextImport.trim().split('\n');
      if (rawLines.length < 2) return;

      // Localizar a linha de cabeçalho com as datas
      let headerRowIndex = -1;
      for (let i = 0; i < rawLines.length; i++) {
        if (rawLines[i].includes('Setor') && rawLines[i].includes('Colaborador')) {
          headerRowIndex = i;
          break;
        }
      }

      if (headerRowIndex === -1) {
        headerRowIndex = 0;
      }

      const headerCols = rawLines[headerRowIndex].split('\t');
      
      // As datas começam após as colunas Folga (0), Setor (1), Colaborador (2)
      // Ou seja, a partir do índice 3 (ou 2 se não tiver Folga)
      let dateStartIndex = 3;
      if (!headerCols[0].toLowerCase().includes('folga')) {
        dateStartIndex = 2;
      }

      const daysList = [];
      for (let col = dateStartIndex; col < headerCols.length; col++) {
        const colHeader = headerCols[col].trim();
        if (!colHeader) continue;
        
        // Tenta achar data no formato DD/MM/AAAA ou DD/MM
        const dateMatch = colHeader.match(/(\d{1,2})\/(\d{1,2})/);
        const dayNum = dateMatch ? String(parseInt(dateMatch[1], 10)) : String(col - dateStartIndex + 1);
        
        daysList.push({
          colIndex: col,
          day: dayNum,
          dateStr: colHeader
        });
      }

      // Processar as linhas dos colaboradores
      const sectorsMap = new Map();
      const collaborators = [];

      for (let r = headerRowIndex + 1; r < rawLines.length; r++) {
        const rowCols = rawLines[r].split('\t');
        if (rowCols.length < 3) continue;

        let folga = "";
        let sectorName = "";
        let staffName = "";

        if (dateStartIndex === 3) {
          folga = rowCols[0] ? rowCols[0].trim() : "";
          sectorName = rowCols[1] ? rowCols[1].trim() : "Geral";
          staffName = rowCols[2] ? rowCols[2].trim() : "";
        } else {
          sectorName = rowCols[0] ? rowCols[0].trim() : "Geral";
          staffName = rowCols[1] ? rowCols[1].trim() : "";
        }

        if (!staffName) continue;

        const sectorId = sectorName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        if (!sectorsMap.has(sectorId)) {
          sectorsMap.set(sectorId, { id: sectorId, label: sectorName });
        }

        const scheduleByDay = {};
        daysList.forEach(d => {
          const status = rowCols[d.colIndex] ? rowCols[d.colIndex].trim() : "";
          scheduleByDay[d.day] = status;
        });

        collaborators.push({
          name: staffName,
          sectorId,
          sectorName,
          folga,
          scheduleByDay
        });
      }

      // Reconstruir scale por dia
      const newScale = daysList.map(d => {
        const shifts = {};
        collaborators.forEach(c => {
          // Se o colaborador trabalha ou tem status nesse dia
          const dayStatus = c.scheduleByDay[d.day];
          if (dayStatus) {
            shifts[c.sectorId] = shifts[c.sectorId] ? `${shifts[c.sectorId]}, ${c.name} (${dayStatus})` : `${c.name} (${dayStatus})`;
          } else {
            shifts[c.sectorId] = shifts[c.sectorId] || c.name;
          }
        });

        return {
          day: d.day,
          dayOfWeek: "Dia",
          dateStr: d.dateStr,
          shifts
        };
      });

      const sectorsArray = Array.from(sectorsMap.values());
      if (sectorsArray.length === 0) {
        sectorsArray.push({ id: "geral", label: "Administrativo & Comercial" });
      }

      const updatedSchedule = {
        month: "Setembro",
        year: "2026",
        sectors: sectorsArray,
        scale: newScale.length > 0 ? newScale : scheduleData.scale,
        collaborators
      };

      setScheduleData(updatedSchedule);
      saveStoredStaffSchedule(updatedSchedule);
      if (sectorsArray.length > 0) {
        setSelectedSector(sectorsArray[0].id);
      }
      setIsEditing(false);
      setRawTextImport('');
      alert('Escala importada e organizada com sucesso!');
    } catch (e) {
      console.error(e);
      alert('Erro ao processar as colunas do Excel. Verifique se copiou a tabela completa.');
    }
  };

  const currentSectorObj = scheduleData.sectors.find(s => s.id === selectedSector) || scheduleData.sectors[0];
  const assignedStaff = currentDayScale.shifts ? currentDayScale.shifts[selectedSector] : 'Não escalado';

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 40 }}>
      {/* Header da Aba */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="gold-badge">Escala de Trabalho</span>
          <h2 style={{ fontSize: 22, marginTop: 4 }}>Administrativo & Comercial</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            Consulte o setor, colaborador, plantões e folgas.
          </p>
        </div>

        <button
          className="header-btn"
          onClick={() => setIsEditing(!isEditing)}
          title="Colar planilha do Excel"
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
            <span>Importar Planilha do Excel</span>
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Selecione no Excel desde o cabeçalho (<strong>Folga, Setor, Colaborador, Datas...</strong>) até as linhas dos colaboradores, copie (Ctrl+C) e cole abaixo:
          </p>
          <textarea
            placeholder="Cole aqui os dados copiados do Excel (Ctrl+V)..."
            value={rawTextImport}
            onChange={(e) => setRawTextImport(e.target.value)}
            style={{
              width: '100%',
              height: 130,
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
            <button className="btn-primary" onClick={handleImportExcelVetter} style={{ flex: 1 }}>
              <Save size={14} />
              <span>Processar & Salvar</span>
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
            <span>Data da Escala ({scheduleData.month} / {scheduleData.year})</span>
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
          <span>Setor / Área</span>
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
          {assignedStaff ? assignedStaff.substring(0, 2).toUpperCase() : 'ET'}
        </div>

        <div>
          <span className="gold-gradient-text" style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {currentSectorObj?.label}
          </span>
          <h3 style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>
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
          <span>Escala Confirmada</span>
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
