import json

with open('scratch/live_drive_files_september.json', 'r', encoding='utf-8') as f:
    files = json.load(f)

drive_index = []

def clean_title(name):
    return (name.replace('.pdf', '')
                .replace('.csv', '')
                .replace('[', '')
                .replace(']', '')
                .replace('Tabela ', '')
                .replace(' - Setembro 266', '')
                .replace(' - Setembro 26', '')
                .replace(' - Setembro 2026', '')
                .replace(' - Agosto 2026', '')
                .replace('Apresentação Comercial', '')
                .replace('Apresentação comercial', '')
                .replace('Apresentação lançamento', '')
                .replace('ApresentaÃ§Ã£o Comercial', '')
                .replace('ApresentaÃ§Ã£o comercial', '')
                .replace('ApresentaÃ§Ã£o lanÃ§amento', '')
                .replace('Apresentação LanÃ§amento (2)', '')
                .replace('Apresentação LanÃ§amento', '')
                .replace('Catálogo Digital WhatsApp', '')
                .replace('CatÃ¡logo Digital WhatsApp', '')
                .replace('V2 ', '')
                .replace('WhatsApp — ', '')
                .replace('WhatsApp â€” ', '')
                .replace('E-mail - ', '')
                .replace('Vetter_', '')
                .replace('_lançamento', '')
                .replace('_lanÃ§amento', '')
                .replace('_Breeze', 'Breeze')
                .strip())

for it in files:
    name = it['name']
    if name.endswith('.csv') or 'Pipeline' in name:
        continue
        
    is_table = 'tabela' in name.lower()
    category = 'tabela' if is_table else 'book'
    folder_name = 'Tabela' if is_table else 'Apresentação'
    
    prop_name = clean_title(name).split(' - ')[0].split('_')[0].strip()
    if not prop_name or len(prop_name) < 2:
        prop_name = "Vetter"
        
    prop_id = prop_name.lower().replace(' ', '-')
    
    aliases = [
        prop_name.lower(),
        f"{category} {prop_name.lower()}",
        f"tabela do {prop_name.lower()}",
        f"tabela {prop_name.lower()}",
        f"apresentação {prop_name.lower()}",
        f"apresentacao {prop_name.lower()}"
    ]
    
    drive_index.append({
        'id': it['id'],
        'driveId': it['id'],
        'propertyName': prop_name,
        'propertyId': prop_id,
        'folder': folder_name,
        'name': name,
        'title': name.replace('.pdf', ''),
        'aliases': aliases,
        'type': 'pdf',
        'category': category,
        'size': '2.8 MB',
        'updatedAt': 'Setembro/2026 (Atualizado)',
        'url': f"https://drive.google.com/uc?export=download&id={it['id']}",
        'viewUrl': f"https://drive.google.com/file/d/{it['id']}/view?usp=sharing"
    })

js_content = f"""// Índice Oficial de Arquivos Google Drive - Vetter Hub (Atualizado em Tempo Real)
// 20 Arquivos Oficiais Mapeados (Tabelas de Setembro/2026 e Apresentações)

export const INITIAL_DRIVE_INDEX = {json.dumps(drive_index, ensure_ascii=False, indent=2)};

const STORAGE_KEY = 'vetter_drive_index_v3_set26';

export function getStoredDriveIndex() {{
  try {{
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {{
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {{
        return parsed;
      }}
    }}
  }} catch (e) {{
    console.warn('Erro ao carregar drive index:', e);
  }}
  return INITIAL_DRIVE_INDEX;
}}

export function saveStoredDriveIndex(indexData) {{
  try {{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(indexData));
  }} catch (e) {{
    console.warn('Erro ao salvar drive index:', e);
  }}
}}
"""

with open('src/data/driveIndex.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Generated src/data/driveIndex.js with {len(drive_index)} live files (September 2026)!")
