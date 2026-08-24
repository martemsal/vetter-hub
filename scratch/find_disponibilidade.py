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
                
                # Extrair itens usando Regex robusta
                pattern = r'\["([a-zA-Z0-9_\-]+)",\["([a-zA-Z0-9_\-]+)"\],"([^"]+)"\s*,\s*"([^"]+)"'
                matches = re.findall(pattern, decoded_ivd)
                
                if matches:
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
                    return results
    except Exception as e:
        print(f'Error fetching folder {folder_id}:', e)
    return []

# Mapear a pasta raiz do link do usuário
print('Scanning Root folder: 1hL6hQs1pqr7-sp0bdkU14CXJWe8RBcht')
root_items = fetch_folder_items_resilient('1hL6hQs1pqr7-sp0bdkU14CXJWe8RBcht', 'Litoral')

# Fazer a busca profunda
all_folders = []
for item in root_items:
    if item['is_folder']:
        print(f"Found Folder: {item['title']} (ID: {item['id']})")
        all_folders.append(item)
        # Scan subfolder
        sub_items = fetch_folder_items_resilient(item['id'], item['title'])
        for sub in sub_items:
            if sub['is_folder']:
                print(f"Found Subfolder: {sub['title']} (ID: {sub['id']})")
                deep_items = fetch_folder_items_resilient(sub['id'], f"{item['title']} / {sub['title']}")
                for di in deep_items:
                    if di['is_folder']:
                        print(f"Found Deep Folder: {di['title']} (ID: {di['id']})")
            else:
                print(f"  [FILE] {sub['title']} (ID: {sub['id']})")

# Vamos tentar achar a pasta "disponibilidade" ou similar
print("\nScanning parent 1QtIVHODdXFFi85C_G94G95KLQ9A-txKk directly...")
litoral_items = fetch_folder_items_resilient('1QtIVHODdXFFi85C_G94G95KLQ9A-txKk', 'Litoral')
for item in litoral_items:
    if item['is_folder']:
        print(f"Litoral Subfolder: {item['title']} (ID: {item['id']})")
        # List files inside
        sub_files = fetch_folder_items_resilient(item['id'], item['title'])
        for sf in sub_files:
            print(f"  [{'FOLDER' if sf['is_folder'] else 'FILE'}] {sf['title']} (ID: {sf['id']})")
