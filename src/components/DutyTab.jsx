import React, { useState, useEffect } from 'react';
import { Calendar, Building, ShieldCheck, CheckCircle2, User, ChevronRight, FileSpreadsheet, Edit3, Save } from 'lucide-react';
import { getStoredDutyScale, saveStoredDutyScale } from '../data/dutyScale';

export default function DutyTab() {
  const [scaleData, setScaleData] = useState(() => getStoredDutyScale());
  const [selectedDay, setSelectedDay] = useState(() => {
    // Tenta pegar o dia atual se for setembro de 2026, senão inicializa com o dia "1"
    const today = new Date();
    const isSep2026 = today.getMonth() === 8 && today.getFullYear() === 2026;
    return isSep2026 ? String(today.getDate()) : "1";
  });
  
  const [selectedCentral, setSelectedCentral] = useState('central-picarras');
  const [isEditing, setIsEditing] = useState(false);
  const [rawTextImport, setRawTextImport] = useState('');

  // Encontra o item de escala para o dia selecionado
  const currentDayScale = scaleData.scale.find(s => s.day === selectedDay) || scaleData.scale[0];

  const handleDaySelect = (day) => {
    setSelectedDay(day);
  };

  const handleImportCSV = () => {
    // Permite colar texto separado por tabs (copiado do Excel) para atualizar a escala do mês!
    if (!rawTextImport.trim()) return;

    try {
      const lines = rawTextImport.trim().split('\n');
      const parsedScale = [];

      for (let i = 0; i < lines.length; i++) {
        const parts = lines[i].split('\t');
        if (parts.length >= 8) {
          const dateStr = parts[0].trim();
          const dayOfWeek = parts[1].trim();
          
          // Extrair o número do dia da data "1-set-26"
          const dayMatch = dateStr.match(/^(\d+)/);
          if (!dayMatch) continue;
          
          const day = dayMatch[1];
          
          parsedScale.push({
            day,
            dayOfWeek,
            dateStr,
            shifts: {
              "central-picarras": parts[2].trim(),
              "central-picarras-2": parts[3].trim(),
              "container-picarras": parts[4].trim(),
              "central-armacao": parts[5].trim(),
              "central-armacao-2": parts[6].trim(),
              "central-coral": parts[7].trim(),
              "central-coral-2": parts[8] ? parts[8].trim() : parts[7].trim()
            }
          });
        }
      }

      if (parsedScale.length > 0) {
        const newScaleData = {
          month: "Setembro",
          year: "2026",
          centrals: [
            { id: "central-picarras", label: "Central Piçarras" },
            { id: "central-picarras-2", label: "Central Piçarras 2" },
            { id: "container-picarras", label: "Container Piçarras" },
            { id: "central-armacao", label: "Central Armação" },
            { id: "central-armacao-2", label: "Central Armação 2" },
            { id: "central-coral", label: "Central Coral" },
            { id: "central-coral-2", label: "Central Coral 2" }
          ],
          scale: parsedScale
        };
        setScaleData(newScaleData);
        saveStoredDutyScale(newScaleData);
        setIsEditing(false);
        setRawTextImport('');
        alert('Escala de plantão atualizada com sucesso!');
      } else {
        alert('Nenhuma linha válida encontrada. Certifique-se de copiar todas as colunas do Excel.');
      }
    } catch (e) {
      alert('Erro ao processar os dados. Verifique a formatação.');
    }
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="gold-badge">Escala Oficial Vetter</span>
          <h2 style={{ fontSize: 22, marginTop: 4 }}>Plantão de Vendas</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            Consulte a imobiliária ou corretor de plantão em cada central.
          </p>
        </div>

        <button
          className="header-btn"
          onClick={() => setIsEditing(!isEditing)}
          title="Editar ou atualizar escala do mês"
        >
          <Edit3 size={16} />
        </button>
      </div>

      {/* Janela de Importação Rápida da Escala */}
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
            <span>Atualizar Escala Mensal</span>
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Abra a planilha do Excel, selecione todas as células (da coluna "Dia" até "Central Penha CORAL 2"), copie (Ctrl+C) e cole na caixa abaixo:
          </p>
          <textarea
            placeholder="Cole aqui a tabela do Excel..."
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
              <span>Salvar Nova Escala</span>
            </button>
            <button className="btn-secondary" onClick={() => setIsEditing(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Grid de Dias do Mês (Estilo Calendário Compacto Mobile) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Dia Selecionado ({scaleData.month} / {scaleData.year})
          </h4>
        </div>
        
        {/* Carrossel de Dias */}
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
          {scaleData.scale.map((s) => {
            const isSelected = selectedDay === s.day;
            const isWeekend = s.dayOfWeek.includes('Sábado') || s.dayOfWeek.includes('Domingo');
            
            return (
              <button
                key={s.day}
                onClick={() => handleDaySelect(s.day)}
                style={{
                  minWidth: 46,
                  height: 58,
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
                  {s.dayOfWeek.substring(0, 3).toUpperCase()}
                </span>
                <span style={{ fontSize: 16, fontWeight: 800, marginTop: 2, color: isWeekend && !isSelected ? 'var(--accent-rose)' : 'inherit' }}>
                  {s.day}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Seleção de Central de Vendas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h4 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Central de Vendas / Plantão
        </h4>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {scaleData.centrals.map((c) => {
            const isSelected = selectedCentral === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCentral(c.id)}
                className={`filter-chip ${isSelected ? 'active' : ''}`}
                style={{ flexShrink: 0 }}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Card Informativo Principal do Plantão */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.25) 0%, rgba(15, 23, 42, 0.7) 100%)',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
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
            width: 60,
            height: 60,
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
          {currentDayScale.shifts[selectedCentral]?.substring(0, 2).toUpperCase() || 'PL'}
        </div>

        <div>
          <span className="gold-gradient-text" style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>
            {scaleData.centrals.find(c => c.id === selectedCentral)?.label}
          </span>
          <h3 style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>
            {currentDayScale.shifts[selectedCentral] || 'Ninguém escalado'}
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
          <span>Plantão Ativo e Confirmado</span>
        </div>
      </div>

      {/* Escala Completa do Dia (Todas as Centrais) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h4 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Todas as Centrais neste dia
        </h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {scaleData.centrals.map((c) => {
            const shiftName = currentDayScale.shifts[c.id];
            const isChosenCentral = selectedCentral === c.id;
            
            return (
              <div 
                key={c.id}
                onClick={() => setSelectedCentral(c.id)}
                style={{
                  background: 'var(--bg-card)',
                  border: isChosenCentral ? '1px solid var(--border-gold)' : '1px solid var(--border-subtle)',
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
                  <Building size={16} color={isChosenCentral ? "var(--gold-primary)" : "var(--text-muted)"} />
                  <span style={{ fontSize: 13, fontWeight: isChosenCentral ? 700 : 500 }}>{c.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: isChosenCentral ? 'var(--gold-primary)' : 'var(--text-primary)' }}>
                    {shiftName}
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
