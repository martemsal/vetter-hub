import json

with open('scratch/escala_setembro_parsed.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Corrigir caracteres corrompidos caso haja
def fix_str(s):
    if not isinstance(s, str): return s
    return (s.replace('tera-feira', 'Terça-feira')
             .replace('sbado', 'Sábado')
             .replace('Piarras', 'Piçarras')
             .replace('Andria', 'Andréia')
             .replace('Frias', 'Férias'))

for d in data['days']:
    d['dayOfWeek'] = fix_str(d['dayOfWeek']).capitalize()

for c in data['collaborators']:
    c['name'] = fix_str(c['name'])
    c['sector'] = fix_str(c['sector'])
    for k, v in c['days'].items():
        c['days'][k] = fix_str(v)

sectors_list = [
    { "id": "todos", "label": "Todos os Setores" },
    { "id": "administrativo", "label": "Administrativo" },
    { "id": "comercial", "label": "Comercial" },
    { "id": "sdr", "label": "SDR" }
]

js_code = f"""// Escala Oficial de Trabalho Administrativo e Comercial - Vetter Hub
// Extraída automaticamente do arquivo oficial 'Escala de Trabalho atualizada v3.xlsx' do Google Drive.

export const OFFICIAL_STAFF_DATA = {json.dumps(data, ensure_ascii=False, indent=2)};

const STORAGE_KEY = 'vetter_staff_schedule_v3_set26';

export function getStoredStaffSchedule() {{
  try {{
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {{
      const parsed = JSON.parse(saved);
      if (parsed && parsed.collaborators && parsed.collaborators.length > 0) {{
        return parsed;
      }}
    }}
  }} catch (e) {{
    console.warn(e);
  }}
  return OFFICIAL_STAFF_DATA;
}}

export function saveStoredStaffSchedule(scheduleData) {{
  try {{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scheduleData));
  }} catch (e) {{
    console.warn(e);
  }}
}}
"""

with open('src/data/staffSchedule.js', 'w', encoding='utf-8') as f:
    f.write(js_code)

print("Updated src/data/staffSchedule.js successfully!")
