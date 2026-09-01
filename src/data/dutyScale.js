// Escala de Plantão Oficial Vetter
// Contém a escala de Setembro/2026 transcrita da planilha oficial.
// Suporta persistência em LocalStorage e atualização dinâmica pelo usuário.

export const INITIAL_DUTY_SCALE = {
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
  scale: [
    {
      day: "1",
      dayOfWeek: "Terça-feira",
      dateStr: "01/09/2026",
      shifts: {
        "central-picarras": "FRS",
        "central-picarras-2": "FRS",
        "container-picarras": "Domus",
        "central-armacao": "MS Neg",
        "central-armacao-2": "MS Neg",
        "central-coral": "Mirare",
        "central-coral-2": "Mirare"
      }
    },
    {
      day: "2",
      dayOfWeek: "Quarta-feira",
      dateStr: "02/09/2026",
      shifts: {
        "central-picarras": "Garra",
        "central-picarras-2": "Garra",
        "container-picarras": "Dinho Flores",
        "central-armacao": "Gasso",
        "central-armacao-2": "Gasso",
        "central-coral": "Rnorden",
        "central-coral-2": "Rnorden"
      }
    },
    {
      day: "3",
      dayOfWeek: "Quinta-feira",
      dateStr: "03/09/2026",
      shifts: {
        "central-picarras": "Ricardo Dionisio",
        "central-picarras-2": "Ricardo Dionisio",
        "container-picarras": "Domus",
        "central-armacao": "Mirare",
        "central-armacao-2": "Mirare",
        "central-coral": "Salt",
        "central-coral-2": "Battiston"
      }
    },
    {
      day: "4",
      dayOfWeek: "Sexta-feira",
      dateStr: "04/09/2026",
      shifts: {
        "central-picarras": "Rnorden",
        "central-picarras-2": "Rnorden",
        "container-picarras": "MS Neg",
        "central-armacao": "Lilo",
        "central-armacao-2": "Lilo",
        "central-coral": "Mirare",
        "central-coral-2": "Mirare"
      }
    },
    {
      day: "5",
      dayOfWeek: "Sábado",
      dateStr: "05/09/2026",
      shifts: {
        "central-picarras": "Mirare",
        "central-picarras-2": "Mirare",
        "container-picarras": "Salt",
        "central-armacao": "Garra",
        "central-armacao-2": "Garra",
        "central-coral": "Rnorden",
        "central-coral-2": "Rnorden"
      }
    },
    {
      day: "6",
      dayOfWeek: "Domingo",
      dateStr: "06/09/2026",
      shifts: {
        "central-picarras": "Rnorden",
        "central-picarras-2": "Rnorden",
        "container-picarras": "Benigno",
        "central-armacao": "Wolf",
        "central-armacao-2": "Wolf",
        "central-coral": "Mirare",
        "central-coral-2": "Mirare"
      }
    },
    {
      day: "7",
      dayOfWeek: "Segunda-feira",
      dateStr: "07/09/2026",
      shifts: {
        "central-picarras": "Mirare",
        "central-picarras-2": "Mirare",
        "container-picarras": "Cristina Schimidt",
        "central-armacao": "Ricardo Dionisio",
        "central-armacao-2": "Ricardo Dionisio",
        "central-coral": "Rnorden",
        "central-coral-2": "Rnorden"
      }
    },
    {
      day: "8",
      dayOfWeek: "Terça-feira",
      dateStr: "08/09/2026",
      shifts: {
        "central-picarras": "Lilo",
        "central-picarras-2": "Lilo",
        "container-picarras": "Domus",
        "central-armacao": "Central Imóveis",
        "central-armacao-2": "Central Imóveis",
        "central-coral": "MS Neg",
        "central-coral-2": "MS Neg"
      }
    },
    {
      day: "9",
      dayOfWeek: "Quarta-feira",
      dateStr: "09/09/2026",
      shifts: {
        "central-picarras": "Mirare",
        "central-picarras-2": "Mirare",
        "container-picarras": "RS",
        "central-armacao": "Rnorden",
        "central-armacao-2": "Rnorden",
        "central-coral": "Gasso",
        "central-coral-2": "Gasso"
      }
    },
    {
      day: "10",
      dayOfWeek: "Quinta-feira",
      dateStr: "10/09/2026",
      shifts: {
        "central-picarras": "Wolf",
        "central-picarras-2": "Wolf",
        "container-picarras": "Seu Imóvel",
        "central-armacao": "Torre Sul",
        "central-armacao-2": "Torre Sul",
        "central-coral": "SOL Imóveis",
        "central-coral-2": "SOL Imóveis"
      }
    },
    {
      day: "11",
      dayOfWeek: "Sexta-feira",
      dateStr: "11/09/2026",
      shifts: {
        "central-picarras": "Mirare",
        "central-picarras-2": "Mirare",
        "container-picarras": "Domus",
        "central-armacao": "Salt",
        "central-armacao-2": "Battiston",
        "central-coral": "Rnorden",
        "central-coral-2": "Rnorden"
      }
    },
    {
      day: "12",
      dayOfWeek: "Sábado",
      dateStr: "12/09/2026",
      shifts: {
        "central-picarras": "Rnorden",
        "central-picarras-2": "Rnorden",
        "container-picarras": "Lfernando",
        "central-armacao": "Ricardo Dionisio",
        "central-armacao-2": "Ricardo Dionisio",
        "central-coral": "Mirare",
        "central-coral-2": "Mirare"
      }
    },
    {
      day: "13",
      dayOfWeek: "Domingo",
      dateStr: "13/09/2026",
      shifts: {
        "central-picarras": "Mirare",
        "central-picarras-2": "Mirare",
        "container-picarras": "Dinho Flores",
        "central-armacao": "Rnorden",
        "central-armacao-2": "Rnorden",
        "central-coral": "Lilo",
        "central-coral-2": "Lilo"
      }
    },
    {
      day: "14",
      dayOfWeek: "Segunda-feira",
      dateStr: "14/09/2026",
      shifts: {
        "central-picarras": "Gasso",
        "central-picarras-2": "Gasso",
        "container-picarras": "Ricardo Dionisio",
        "central-armacao": "Wolf",
        "central-armacao-2": "Wolf",
        "central-coral": "Rnorden",
        "central-coral-2": "Rnorden"
      }
    },
    {
      day: "15",
      dayOfWeek: "Terça-feira",
      dateStr: "15/09/2026",
      shifts: {
        "central-picarras": "Salt",
        "central-picarras-2": "Battiston",
        "container-picarras": "MS Neg",
        "central-armacao": "Braatz Imóveis",
        "central-armacao-2": "Braatz Imóveis",
        "central-coral": "Central Imóveis",
        "central-coral-2": "Central Imóveis"
      }
    },
    {
      day: "16",
      dayOfWeek: "Quarta-feira",
      dateStr: "16/09/2026",
      shifts: {
        "central-picarras": "Ricardo Dionisio",
        "central-picarras-2": "Ricardo Dionisio",
        "container-picarras": "Benigno",
        "central-armacao": "Mirare",
        "central-armacao-2": "Mirare",
        "central-coral": "Rnorden",
        "central-coral-2": "Rnorden"
      }
    },
    {
      day: "17",
      dayOfWeek: "Quinta-feira",
      dateStr: "17/09/2026",
      shifts: {
        "central-picarras": "Cristina Schimidt",
        "central-picarras-2": "Cristina Schimidt",
        "container-picarras": "RS",
        "central-armacao": "Lilo",
        "central-armacao-2": "Lilo",
        "central-coral": "Garra",
        "central-coral-2": "Garra"
      }
    },
    {
      day: "18",
      dayOfWeek: "Sexta-feira",
      dateStr: "18/09/2026",
      shifts: {
        "central-picarras": "Rnorden",
        "central-picarras-2": "Rnorden",
        "container-picarras": "Central Imóveis",
        "central-armacao": "MS Neg",
        "central-armacao-2": "MS Neg",
        "central-coral": "Mirare",
        "central-coral-2": "Mirare"
      }
    },
    {
      day: "19",
      dayOfWeek: "Sábado",
      dateStr: "19/09/2026",
      shifts: {
        "central-picarras": "Mirare",
        "central-picarras-2": "Mirare",
        "container-picarras": "Garra",
        "central-armacao": "Rnorden",
        "central-armacao-2": "Rnorden",
        "central-coral": "Ricardo Dionisio",
        "central-coral-2": "Ricardo Dionisio"
      }
    },
    {
      day: "20",
      dayOfWeek: "Domingo",
      dateStr: "20/09/2026",
      shifts: {
        "central-picarras": "Rnorden",
        "central-picarras-2": "Rnorden",
        "container-picarras": "Domus",
        "central-armacao": "Salt",
        "central-armacao-2": "Battiston",
        "central-coral": "Mirare",
        "central-coral-2": "Mirare"
      }
    },
    {
      day: "21",
      dayOfWeek: "Segunda-feira",
      dateStr: "21/09/2026",
      shifts: {
        "central-picarras": "Seu Imóvel",
        "central-picarras-2": "Seu Imóvel",
        "container-picarras": "Lfernando",
        "central-armacao": "Gasso",
        "central-armacao-2": "Gasso",
        "central-coral": "Wolf",
        "central-coral-2": "Wolf"
      }
    },
    {
      day: "22",
      dayOfWeek: "Terça-feira",
      dateStr: "22/09/2026",
      shifts: {
        "central-picarras": "Ricardo Dionisio",
        "central-picarras-2": "Ricardo Dionisio",
        "container-picarras": "Rnorden",
        "central-armacao": "RS",
        "central-armacao-2": "RS",
        "central-coral": "Salt",
        "central-coral-2": "Battiston"
      }
    },
    {
      day: "23",
      dayOfWeek: "Quarta-feira",
      dateStr: "23/09/2026",
      shifts: {
        "central-picarras": "FRS",
        "central-picarras-2": "FRS",
        "container-picarras": "Cristina Schimidt",
        "central-armacao": "Mirare",
        "central-armacao-2": "Mirare",
        "central-coral": "Rnorden",
        "central-coral-2": "Rnorden"
      }
    },
    {
      day: "24",
      dayOfWeek: "Quinta-feira",
      dateStr: "24/09/2026",
      shifts: {
        "central-picarras": "Rnorden",
        "central-picarras-2": "Rnorden",
        "container-picarras": "MS Neg",
        "central-armacao": "Garra",
        "central-armacao-2": "Garra",
        "central-coral": "Lilo",
        "central-coral-2": "Lilo"
      }
    },
    {
      day: "25",
      dayOfWeek: "Sexta-feira",
      dateStr: "25/09/2026",
      shifts: {
        "central-picarras": "Mirare",
        "central-picarras-2": "Mirare",
        "container-picarras": "Central Imóveis",
        "central-armacao": "Rnorden",
        "central-armacao-2": "Rnorden",
        "central-coral": "Wolf",
        "central-coral-2": "Wolf"
      }
    },
    {
      day: "26",
      dayOfWeek: "Sábado",
      dateStr: "26/09/2026",
      shifts: {
        "central-picarras": "Rnorden",
        "central-picarras-2": "Rnorden",
        "container-picarras": "Battiston",
        "central-armacao": "Dinho Flores",
        "central-armacao-2": "Dinho Flores",
        "central-coral": "Mirare",
        "central-coral-2": "Mirare"
      }
    },
    {
      day: "27",
      dayOfWeek: "Domingo",
      dateStr: "27/09/2026",
      shifts: {
        "central-picarras": "Mirare",
        "central-picarras-2": "Mirare",
        "container-picarras": "Wolf",
        "central-armacao": "Ricardo Dionisio",
        "central-armacao-2": "Ricardo Dionisio",
        "central-coral": "Rnorden",
        "central-coral-2": "Rnorden"
      }
    },
    {
      day: "28",
      dayOfWeek: "Segunda-feira",
      dateStr: "28/09/2026",
      shifts: {
        "central-picarras": "Salt",
        "central-picarras-2": "Battiston",
        "container-picarras": "Seu Imóvel",
        "central-armacao": "Mirare",
        "central-armacao-2": "Mirare",
        "central-coral": "Cristina Schimidt",
        "central-coral-2": "Cristina Schimidt"
      }
    },
    {
      day: "29",
      dayOfWeek: "Terça-feira",
      dateStr: "29/09/2026",
      shifts: {
        "central-picarras": "Mirare",
        "central-picarras-2": "Mirare",
        "container-picarras": "Domus",
        "central-armacao": "Be Home",
        "central-armacao-2": "Be Home",
        "central-coral": "Salt",
        "central-coral-2": "Battiston"
      }
    },
    {
      day: "30",
      dayOfWeek: "Quarta-feira",
      dateStr: "30/09/2026",
      shifts: {
        "central-picarras": "Rnorden",
        "central-picarras-2": "Rnorden",
        "container-picarras": "RS",
        "central-armacao": "MS Neg",
        "central-armacao-2": "MS Neg",
        "central-coral": "Mirare",
        "central-coral-2": "Mirare"
      }
    }
  ]
};

const STORAGE_KEY = 'vetter_duty_scale_v2_set26';

export function getStoredDutyScale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.month === "Setembro" && parsed.scale && parsed.scale.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn(e);
  }
  return INITIAL_DUTY_SCALE;
}

export function saveStoredDutyScale(scaleData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scaleData));
  } catch (e) {
    console.warn(e);
  }
}

export function queryDutyScale(query) {
  const norm = query.toLowerCase();
  if (!norm.includes('plantao') && !norm.includes('plantão') && !norm.includes('escala')) {
    return { matched: false, text: "" };
  }

  const scaleData = getStoredDutyScale();
  const today = new Date();
  
  // Tentar encontrar o dia na query (ex: "dia 5", "dia 12", "hoje", "amanhã")
  let targetDay = String(today.getDate());
  if (norm.includes('amanha') || norm.includes('amanhã')) {
    targetDay = String(today.getDate() + 1);
  } else {
    const dayMatch = norm.match(/dia\s*(\d{1,2})/i);
    if (dayMatch) {
      targetDay = String(parseInt(dayMatch[1], 10));
    }
  }

  const dayScale = scaleData.scale.find(s => s.day === targetDay) || scaleData.scale[0];
  
  // Se perguntou de uma central específica
  for (const c of scaleData.centrals) {
    if (norm.includes(c.label.toLowerCase()) || norm.includes(c.id)) {
      const shiftName = dayScale.shifts[c.id];
      return {
        matched: true,
        text: `📅 **Escala de Plantão — ${c.label}**\n\n` +
              `• **Data:** ${dayScale.dateStr} (${dayScale.dayOfWeek})\n` +
              `• **Corretor / Imobiliária:** **${shiftName || 'Não informado'}**\n\n` +
              `*Consulte a aba Plantão para ver o mês completo de ${scaleData.month}/${scaleData.year}.*`
      };
    }
  }

  // Se perguntou de forma geral para o dia
  const shiftsList = scaleData.centrals.map(c => `• **${c.label}:** ${dayScale.shifts[c.id] || 'Livre'}`).join('\n');
  return {
    matched: true,
    text: `📅 **Escala de Plantão — ${dayScale.dateStr} (${dayScale.dayOfWeek})**\n\n${shiftsList}\n\n` +
          `*Você também pode conferir e navegar por todos os dias na aba **Plantão** no menu inferior.*`
  };
}

