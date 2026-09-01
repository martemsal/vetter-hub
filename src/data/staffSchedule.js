// Escala de Colaboradores por Setor - Vetter Hub
// Suporta persistência em LocalStorage e importação direta do Excel.

export const INITIAL_STAFF_SCHEDULE = {
  month: "Setembro",
  year: "2026",
  sectors: [
    { id: "atendimento", label: "Atendimento & Recepção" },
    { id: "vendas-internas", label: "Vendas Internas" },
    { id: "pos-vendas", label: "Pós-Venda & Relacionamento" },
    { id: "suporte-comercial", label: "Suporte Comercial" },
    { id: "marketing-eventos", label: "Marketing & Eventos" },
    { id: "administrativo", label: "Administrativo" }
  ],
  scale: [
    {
      day: "1",
      dayOfWeek: "Terça-feira",
      dateStr: "01/09/2026",
      shifts: {
        "atendimento": "Mariana Silva",
        "vendas-internas": "Carlos Eduardo",
        "pos-vendas": "Fernanda Lima",
        "suporte-comercial": "Lucas Martins",
        "marketing-eventos": "Beatriz Souza",
        "administrativo": "Juliana Costa"
      }
    },
    {
      day: "2",
      dayOfWeek: "Quarta-feira",
      dateStr: "02/09/2026",
      shifts: {
        "atendimento": "Juliana Costa",
        "vendas-internas": "Mariana Silva",
        "pos-vendas": "Carlos Eduardo",
        "suporte-comercial": "Fernanda Lima",
        "marketing-eventos": "Lucas Martins",
        "administrativo": "Beatriz Souza"
      }
    },
    {
      day: "3",
      dayOfWeek: "Quinta-feira",
      dateStr: "03/09/2026",
      shifts: {
        "atendimento": "Beatriz Souza",
        "vendas-internas": "Juliana Costa",
        "pos-vendas": "Mariana Silva",
        "suporte-comercial": "Carlos Eduardo",
        "marketing-eventos": "Fernanda Lima",
        "administrativo": "Lucas Martins"
      }
    },
    {
      day: "4",
      dayOfWeek: "Sexta-feira",
      dateStr: "04/09/2026",
      shifts: {
        "atendimento": "Lucas Martins",
        "vendas-internas": "Beatriz Souza",
        "pos-vendas": "Juliana Costa",
        "suporte-comercial": "Mariana Silva",
        "marketing-eventos": "Carlos Eduardo",
        "administrativo": "Fernanda Lima"
      }
    },
    {
      day: "5",
      dayOfWeek: "Sábado",
      dateStr: "05/09/2026",
      shifts: {
        "atendimento": "Fernanda Lima",
        "vendas-internas": "Lucas Martins",
        "pos-vendas": "Beatriz Souza",
        "suporte-comercial": "Juliana Costa",
        "marketing-eventos": "Mariana Silva",
        "administrativo": "Carlos Eduardo"
      }
    },
    {
      day: "6",
      dayOfWeek: "Domingo",
      dateStr: "06/09/2026",
      shifts: {
        "atendimento": "Carlos Eduardo",
        "vendas-internas": "Fernanda Lima",
        "pos-vendas": "Lucas Martins",
        "suporte-comercial": "Beatriz Souza",
        "marketing-eventos": "Juliana Costa",
        "administrativo": "Mariana Silva"
      }
    }
  ]
};

const STORAGE_KEY = 'vetter_staff_schedule_v1';

export function getStoredStaffSchedule() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.scale && parsed.scale.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn(e);
  }
  return INITIAL_STAFF_SCHEDULE;
}

export function saveStoredStaffSchedule(scheduleData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scheduleData));
  } catch (e) {
    console.warn(e);
  }
}
