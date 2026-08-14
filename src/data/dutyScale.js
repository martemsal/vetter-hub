// Escala de Plantão Oficial Vetter
// Contém a escala de Agosto/2026 transcrita da imagem do usuário.
// Suporta persistência em LocalStorage e atualização dinâmica pelo usuário.

export const INITIAL_DUTY_SCALE = {
  month: "Agosto",
  year: "2026",
  centrals: [
    { id: "central-picarras", label: "Central Piçarras" },
    { id: "central-picarras-2", label: "Central Piçarras 2" },
    { id: "container-picarras", label: "Container Piçarras" },
    { id: "central-penha", label: "Central Penha" },
    { id: "central-penha-2", label: "Central Penha 2" },
    { id: "central-penha-coral-1", label: "Central Penha CORAL 1" },
    { id: "central-penha-coral-2", label: "Central Penha CORAL 2" }
  ],
  scale: [
    {
      day: "1",
      dayOfWeek: "Sábado",
      dateStr: "01/08/2026",
      shifts: {
        "central-picarras": "Rnorden",
        "central-picarras-2": "Rnorden",
        "container-picarras": "Domus",
        "central-penha": "Ricardo Dionisio",
        "central-penha-2": "Ricardo Dionisio",
        "central-penha-coral-1": "Mirare",
        "central-penha-coral-2": "Mirare"
      }
    },
    {
      day: "2",
      dayOfWeek: "Domingo",
      dateStr: "02/08/2026",
      shifts: {
        "central-picarras": "Mirare",
        "central-picarras-2": "Mirare",
        "container-picarras": "Battiston",
        "central-penha": "Garra",
        "central-penha-2": "Garra",
        "central-penha-coral-1": "Rnorden",
        "central-penha-coral-2": "Rnorden"
      }
    },
    {
      day: "3",
      dayOfWeek: "Segunda-feira",
      dateStr: "03/08/2026",
      shifts: {
        "central-picarras": "Central Imóveis",
        "central-picarras-2": "Central Imóveis",
        "container-picarras": "Braatz Imóveis",
        "central-penha": "Lilo",
        "central-penha-2": "Lilo",
        "central-penha-coral-1": "RS",
        "central-penha-coral-2": "RS"
      }
    },
    {
      day: "4",
      dayOfWeek: "Terça-feira",
      dateStr: "04/08/2026",
      shifts: {
        "central-picarras": "Wolf",
        "central-picarras-2": "Wolf",
        "container-picarras": "Gasso",
        "central-penha": "Seu Imóvel",
        "central-penha-2": "Seu Imóvel",
        "central-penha-coral-1": "Mirare",
        "central-penha-coral-2": "Mirare"
      }
    },
    {
      day: "5",
      dayOfWeek: "Quarta-feira",
      dateStr: "05/08/2026",
      shifts: {
        "central-picarras": "Garra",
        "central-picarras-2": "Garra",
        "container-picarras": "Torre Sul",
        "central-penha": "Mirare",
        "central-penha-2": "Mirare",
        "central-penha-coral-1": "Rnorden",
        "central-penha-coral-2": "Rnorden"
      }
    },
    {
      day: "6",
      dayOfWeek: "Quinta-feira",
      dateStr: "06/08/2026",
      shifts: {
        "central-picarras": "RS",
        "central-picarras-2": "RS",
        "container-picarras": "Domus",
        "central-penha": "Battiston",
        "central-penha-2": "Salt",
        "central-penha-coral-1": "Garra",
        "central-penha-coral-2": "Garra"
      }
    },
    {
      day: "7",
      dayOfWeek: "Sexta-feira",
      dateStr: "07/08/2026",
      shifts: {
        "central-picarras": "Mirare",
        "central-picarras-2": "Mirare",
        "container-picarras": "Vext - Piçarras",
        "central-penha": "Rnorden",
        "central-penha-2": "Rnorden",
        "central-penha-coral-1": "Gasso",
        "central-penha-coral-2": "Gasso"
      }
    },
    {
      day: "8",
      dayOfWeek: "Sábado",
      dateStr: "08/08/2026",
      shifts: {
        "central-picarras": "Mirare",
        "central-picarras-2": "Mirare",
        "container-picarras": "MS Neg",
        "central-penha": "Ricardo Dionisio",
        "central-penha-2": "Ricardo Dionisio",
        "central-penha-coral-1": "Rnorden",
        "central-penha-coral-2": "Rnorden"
      }
    },
    {
      day: "9",
      dayOfWeek: "Domingo",
      dateStr: "09/08/2026",
      shifts: {
        "central-picarras": "Rnorden",
        "central-picarras-2": "Rnorden",
        "container-picarras": "Dinho Flores",
        "central-penha": "MS Neg",
        "central-penha-2": "MS Neg",
        "central-penha-coral-1": "Mirare",
        "central-penha-coral-2": "Mirare"
      }
    },
    {
      day: "10",
      dayOfWeek: "Segunda-feira",
      dateStr: "10/08/2026",
      shifts: {
        "central-picarras": "MS Neg",
        "central-picarras-2": "MS Neg",
        "container-picarras": "Domus",
        "central-penha": "Wolf",
        "central-penha-2": "Wolf",
        "central-penha-coral-1": "Ricardo Dionisio",
        "central-penha-coral-2": "Ricardo Dionisio"
      }
    },
    {
      day: "11",
      dayOfWeek: "Terça-feira",
      dateStr: "11/08/2026",
      shifts: {
        "central-picarras": "Rnorden",
        "central-picarras-2": "Rnorden",
        "container-picarras": "RS",
        "central-penha": "Mirare",
        "central-penha-2": "Mirare",
        "central-penha-coral-1": "Central Imóveis",
        "central-penha-coral-2": "Central Imóveis"
      }
    },
    {
      day: "12",
      dayOfWeek: "Quarta-feira",
      dateStr: "12/08/2026",
      shifts: {
        "central-picarras": "Lilo",
        "central-picarras-2": "Lilo",
        "container-picarras": "Dinho Flores",
        "central-penha": "Battiston",
        "central-penha-2": "Salt",
        "central-penha-coral-1": "Mirare",
        "central-penha-coral-2": "Mirare"
      }
    },
    {
      day: "13",
      dayOfWeek: "Quinta-feira",
      dateStr: "13/08/2026",
      shifts: {
        "central-picarras": "Wolf",
        "central-picarras-2": "Wolf",
        "container-picarras": "Vext - Piçarras",
        "central-penha": "Rnorden",
        "central-penha-2": "Rnorden",
        "central-penha-coral-1": "Gasso",
        "central-penha-coral-2": "Gasso"
      }
    },
    {
      day: "14",
      dayOfWeek: "Sexta-feira",
      dateStr: "14/08/2026",
      shifts: {
        "central-picarras": "Mirare",
        "central-picarras-2": "Mirare",
        "container-picarras": "Lilo",
        "central-penha": "Battiston",
        "central-penha-2": "Salt",
        "central-penha-coral-1": "Gasso",
        "central-penha-coral-2": "Gasso"
      }
    },
    {
      day: "15",
      dayOfWeek: "Sábado",
      dateStr: "15/08/2026",
      shifts: {
        "central-picarras": "Rnorden",
        "central-picarras-2": "Rnorden",
        "container-picarras": "Battiston",
        "central-penha": "Lilo",
        "central-penha-2": "Lilo",
        "central-penha-coral-1": "Mirare",
        "central-penha-coral-2": "Mirare"
      }
    },
    {
      day: "16",
      dayOfWeek: "Domingo",
      dateStr: "16/08/2026",
      shifts: {
        "central-picarras": "Central Imóveis",
        "central-picarras-2": "Central Imóveis",
        "container-picarras": "Salt",
        "central-penha": "Gasso",
        "central-penha-2": "Gasso",
        "central-penha-coral-1": "Rnorden",
        "central-penha-coral-2": "Rnorden"
      }
    },
    {
      day: "17",
      dayOfWeek: "Segunda-feira",
      dateStr: "17/08/2026",
      shifts: {
        "central-picarras": "Rnorden",
        "central-picarras-2": "Rnorden",
        "container-picarras": "Torre Sul",
        "central-penha": "Vext - Piçarras",
        "central-penha-2": "Vext - Piçarras",
        "central-penha-coral-1": "Battiston",
        "central-penha-coral-2": "Salt"
      }
    },
    {
      day: "18",
      dayOfWeek: "Terça-feira",
      dateStr: "18/08/2026",
      shifts: {
        "central-picarras": "Mirare",
        "central-picarras-2": "Mirare",
        "container-picarras": "Braatz Imóveis",
        "central-penha": "Rnorden",
        "central-penha-2": "Rnorden",
        "central-penha-coral-1": "Garra",
        "central-penha-coral-2": "Garra"
      }
    },
    {
      day: "19",
      dayOfWeek: "Quarta-feira",
      dateStr: "19/08/2026",
      shifts: {
        "central-picarras": "Ricardo Dionisio",
        "central-picarras-2": "Ricardo Dionisio",
        "container-picarras": "Lfernando",
        "central-penha": "Lilo",
        "central-penha-2": "Lilo",
        "central-penha-coral-1": "MS Neg",
        "central-penha-coral-2": "MS Neg"
      }
    },
    {
      day: "20",
      dayOfWeek: "Quinta-feira",
      dateStr: "20/08/2026",
      shifts: {
        "central-picarras": "Salt",
        "central-picarras-2": "Battiston",
        "container-picarras": "Mirare",
        "central-penha": "Central Imóveis",
        "central-penha-2": "Central Imóveis",
        "central-penha-coral-1": "Garra",
        "central-penha-coral-2": "Garra"
      }
    },
    {
      day: "21",
      dayOfWeek: "Sexta-feira",
      dateStr: "21/08/2026",
      shifts: {
        "central-picarras": "Rnorden",
        "central-picarras-2": "Rnorden",
        "container-picarras": "Domus",
        "central-penha": "Gasso",
        "central-penha-2": "Gasso",
        "central-penha-coral-1": "Mirare",
        "central-penha-coral-2": "Mirare"
      }
    },
    {
      day: "22",
      dayOfWeek: "Sábado",
      dateStr: "22/08/2026",
      shifts: {
        "central-picarras": "Mirare",
        "central-picarras-2": "Mirare",
        "container-picarras": "Ricardo Dionisio",
        "central-penha": "Wolf",
        "central-penha-2": "Wolf",
        "central-penha-coral-1": "Rnorden",
        "central-penha-coral-2": "Rnorden"
      }
    },
    {
      day: "23",
      dayOfWeek: "Domingo",
      dateStr: "23/08/2026",
      shifts: {
        "central-picarras": "Rnorden",
        "central-picarras-2": "Rnorden",
        "container-picarras": "Lilo",
        "central-penha": "Ricardo Dionisio",
        "central-penha-2": "Ricardo Dionisio",
        "central-penha-coral-1": "Mirare",
        "central-penha-coral-2": "Mirare"
      }
    },
    {
      day: "24",
      dayOfWeek: "Segunda-feira",
      dateStr: "24/08/2026",
      shifts: {
        "central-picarras": "Cristina Schimidt",
        "central-picarras-2": "Cristina Schimidt",
        "container-picarras": "RS",
        "central-penha": "Battiston",
        "central-penha-2": "Salt",
        "central-penha-coral-1": "Wolf",
        "central-penha-coral-2": "Wolf"
      }
    },
    {
      day: "25",
      dayOfWeek: "Terça-feira",
      dateStr: "25/08/2026",
      shifts: {
        "central-picarras": "Mirare",
        "central-picarras-2": "Mirare",
        "container-picarras": "Dinho Flores",
        "central-penha": "Rnorden",
        "central-penha-2": "Rnorden",
        "central-penha-coral-1": "Lilo",
        "central-penha-coral-2": "Lilo"
      }
    },
    {
      day: "26",
      dayOfWeek: "Quarta-feira",
      dateStr: "26/08/2026",
      shifts: {
        "central-picarras": "Battiston",
        "central-picarras-2": "Salt",
        "container-picarras": "Domus",
        "central-penha": "Mirare",
        "central-penha-2": "Mirare",
        "central-penha-coral-1": "Seu Imóvel",
        "central-penha-coral-2": "Seu Imóvel"
      }
    },
    {
      day: "27",
      dayOfWeek: "Quinta-feira",
      dateStr: "27/08/2026",
      shifts: {
        "central-picarras": "Gasso",
        "central-picarras-2": "Gasso",
        "container-picarras": "Benigno",
        "central-penha": "Cristina Schimidt",
        "central-penha-2": "Cristina Schimidt",
        "central-penha-coral-1": "Ricardo Dionisio",
        "central-penha-coral-2": "Ricardo Dionisio"
      }
    },
    {
      day: "28",
      dayOfWeek: "Sexta-feira",
      dateStr: "28/08/2026",
      shifts: {
        "central-picarras": "Mirare",
        "central-picarras-2": "Mirare",
        "container-picarras": "Lfernando",
        "central-penha": "RS",
        "central-penha-2": "RS",
        "central-penha-coral-1": "Rnorden",
        "central-penha-coral-2": "Rnorden"
      }
    },
    {
      day: "29",
      dayOfWeek: "Sábado",
      dateStr: "29/08/2026",
      shifts: {
        "central-picarras": "Rnorden",
        "central-picarras-2": "Rnorden",
        "container-picarras": "Lilo",
        "central-penha": "Ricardo Dionisio",
        "central-penha-2": "Ricardo Dionisio",
        "central-penha-coral-1": "Mirare",
        "central-penha-coral-2": "Mirare"
      }
    },
    {
      day: "30",
      dayOfWeek: "Domingo",
      dateStr: "30/08/2026",
      shifts: {
        "central-picarras": "Mirare",
        "central-picarras-2": "Mirare",
        "container-picarras": "Ricardo Dionisio",
        "central-penha": "MS Neg",
        "central-penha-2": "MS Neg",
        "central-penha-coral-1": "Rnorden",
        "central-penha-coral-2": "Rnorden"
      }
    },
    {
      day: "31",
      dayOfWeek: "Segunda-feira",
      dateStr: "31/08/2026",
      shifts: {
        "central-picarras": "Garra",
        "central-picarras-2": "Garra",
        "container-picarras": "Dinho Flores",
        "central-penha": "Cristina Schimidt",
        "central-penha-2": "Cristina Schimidt",
        "central-penha-coral-1": "Wolf",
        "central-penha-coral-2": "Wolf"
      }
    }
  ]
};

export function getStoredDutyScale() {
  try {
    const saved = localStorage.getItem('vetter_duty_scale_v1');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn(e);
  }
  return INITIAL_DUTY_SCALE;
}

export function saveStoredDutyScale(scaleData) {
  try {
    localStorage.setItem('vetter_duty_scale_v1', JSON.stringify(scaleData));
  } catch (e) {
    console.warn(e);
  }
}
