import urllib.request
import re
import json

def fetch_folder_items_deep(folder_id, folder_name="Root"):
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
                
                # Regex que captura os itens do Drive
                pattern = r'\["([a-zA-Z0-9_\-]+)",\["([a-zA-Z0-9_\-]+)"\],"([^"]+)"\s*,\s*"([^"]+)"'
                matches = re.findall(pattern, decoded_ivd)
                
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

all_drive_files = []

def scan_recursive(folder_id, folder_name, depth=0):
    indent = "  " * depth
    print(f"{indent}Scanning [{folder_name}] ({folder_id})...")
    items = fetch_folder_items_deep(folder_id, folder_name)
    for it in items:
        if it['is_folder']:
            print(f"{indent} [DIR] {it['title']} (ID: {it['id']})")
            scan_recursive(it['id'], f"{folder_name} > {it['title']}", depth + 1)
        else:
            print(f"{indent} [FILE] {it['title']} (ID: {it['id']})")
            all_drive_files.append({
                'id': it['id'],
                'name': it['title'],
                'folder': folder_name,
                'mime': it['mime']
            })

scan_recursive('1hL6hQs1pqr7-sp0bdkU14CXJWe8RBcht', 'Empreendimentos')

print(f"\nTOTAL FILES FOUND IN DRIVE: {len(all_drive_files)}")
with open('scratch/live_drive_files.json', 'w', encoding='utf-8') as f:
    json.dump(all_drive_files, f, ensure_ascii=False, indent=2)

print("Saved to scratch/live_drive_files.json")
