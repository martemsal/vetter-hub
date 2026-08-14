import urllib.request
import re
import json

def fetch_folder_items_resilient(folder_id, folder_name="Root"):
    url = f'https://drive.google.com/drive/folders/{folder_id}'
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            match = re.search(r"window\['_DRIVE_ivd'\]\s*=\s*'([^']+)'", html)
            if match:
                raw_ivd = match.group(1)
                decoded_ivd = raw_ivd.encode('utf-8').decode('unicode_escape')
                
                # Extrair itens usando Regex robusta em vez de json.loads total
                # Cada item no array tem o formato: ["ID", ["PARENT_ID"], "TITLE", "MIMETYPE", ...]
                # Vamos buscar por esse padrão de assinaturas
                pattern = r'\["([a-zA-Z0-9_\-]+)",\["([a-zA-Z0-9_\-]+)"\],"([^"]+)"\s*,\s*"([^"]+)"'
                matches = re.findall(pattern, decoded_ivd)
                
                if matches:
                    print(f'\n--- Folder "{folder_name}" ({folder_id}) --- Items Found: {len(matches)}')
                    results = []
                    for item_id, parent_id, title, mime in matches:
                        is_folder = (mime == 'application/vnd.google-apps.folder')
                        results.append({
                            'id': item_id,
                            'title': title,
                            'mime': mime,
                            'is_folder': is_folder,
                            'parent_folder': folder_name
                        })
                        print(f"[{'PASTA' if is_folder else 'ARQUIVO'}] {title} (ID: {item_id})")
                    return results
    except Exception as e:
        print(f'Error fetching folder {folder_id}:', e)
    return []

# Mapear a pasta raiz do link do usuário
print('Scanning Root folder: 1hL6hQs1pqr7-sp0bdkU14CXJWe8RBcht')
root_items = fetch_folder_items_resilient('1hL6hQs1pqr7-sp0bdkU14CXJWe8RBcht', 'Litoral')

# Fazer a busca profunda
all_files = []
for item in root_items:
    if item['is_folder']:
        sub_items = fetch_folder_items_resilient(item['id'], item['title'])
        for sub in sub_items:
            if sub['is_folder']:
                deep_items = fetch_folder_items_resilient(sub['id'], f"{item['title']} / {sub['title']}")
                all_files.extend(deep_items)
            else:
                all_files.append(sub)
    else:
        all_files.append(item)

# Salvar no JSON
with open('all_drive_files_mapped.json', 'w', encoding='utf-8') as f_out:
    json.dump(all_files, f_out, indent=2, ensure_ascii=False)

print(f'\nScan complete! Total files found: {len(all_files)}')
