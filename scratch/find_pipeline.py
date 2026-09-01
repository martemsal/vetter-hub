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

print("Scanning Drive for Pipeline(-).csv...")
items = fetch_folder_items_deep('1hL6hQs1pqr7-sp0bdkU14CXJWe8RBcht', 'Root')
for item in items:
    print(f"[{'FOLDER' if item['is_folder'] else 'FILE'}] {item['title']} (ID: {item['id']})")
    if item['is_folder']:
        sub_items = fetch_folder_items_deep(item['id'], item['title'])
        for s in sub_items:
            print(f"  [{'FOLDER' if s['is_folder'] else 'FILE'}] {s['title']} (ID: {s['id']})")

disp_items = fetch_folder_items_deep('1TQeiSr0A4bOMf0nYXICMKCJsW7EnUFU3', 'Disponibilidade')
for d in disp_items:
    print(f"  [DISP] {d['title']} (ID: {d['id']})")
