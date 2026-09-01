import urllib.request
import re
import json
import sys

# Forçar stdout para UTF-8
sys.stdout.reconfigure(encoding='utf-8')

def fetch_items(folder_id):
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
                
                # Pattern para pegar [ID, [PARENT_ID], TITLE, MIMETYPE]
                pattern = r'\["([a-zA-Z0-9_\-]+)",\["([a-zA-Z0-9_\-]+)"\],"([^"]+)"\s*,\s*"([^"]+)"'
                matches = re.findall(pattern, decoded_ivd)
                
                return matches
    except Exception as e:
        print(f"Error fetching {folder_id}:", e)
    return []

all_files = []

# Scan Litoral
print("=== Scanning Litoral (1QtIVHODdXFFi85C_G94G95KLQ9A-txKk) ===")
litoral_items = fetch_items('1QtIVHODdXFFi85C_G94G95KLQ9A-txKk')
for item_id, parent_id, title, mime in litoral_items:
    print(f"  [Folder] {title} (ID: {item_id})")
    sub_items = fetch_items(item_id)
    for sid, spid, stitle, smime in sub_items:
        print(f"    -> [File] {stitle} (ID: {sid})")
        all_files.append({
            'id': sid,
            'name': stitle,
            'folder': title,
            'folderId': item_id
        })

# Scan Disponibilidade
print("\n=== Scanning Disponibilidade (1TQeiSr0A4bOMf0nYXICMKCJsW7EnUFU3) ===")
disp_items = fetch_items('1TQeiSr0A4bOMf0nYXICMKCJsW7EnUFU3')
for item_id, parent_id, title, mime in disp_items:
    print(f"  [Disp File] {title} (ID: {item_id})")
    all_files.append({
        'id': item_id,
        'name': title,
        'folder': 'Disponibilidade',
        'folderId': '1TQeiSr0A4bOMf0nYXICMKCJsW7EnUFU3'
    })

with open('scratch/live_drive_files_september.json', 'w', encoding='utf-8') as f:
    json.dump(all_files, f, ensure_ascii=False, indent=2)

print(f"\nTotal live files collected: {len(all_files)}")
