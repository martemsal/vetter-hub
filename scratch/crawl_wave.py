import urllib.request
import re
import json

def fetch_folder_items(folder_id, folder_name="Root"):
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
                data = json.loads(decoded_ivd)
                if isinstance(data, list) and len(data) > 0 and isinstance(data[0], list):
                    items = data[0]
                    print(f'\n--- Items in Folder "{folder_name}" ({folder_id}) --- Total: {len(items)}')
                    results = []
                    for item in items:
                        item_id = item[0] if len(item) > 0 else 'N/A'
                        title = item[2] if len(item) > 2 else 'N/A'
                        mime = item[3] if len(item) > 3 else 'N/A'
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

# 1. Explorar The Wave
wave_items = fetch_folder_items('1QtIVHODdXFFi85C_G94G95KLQ9A-txKk', 'The Wave')

# 2. Se houver subpastas dentro de The Wave, explorar também
all_scanned_files = []
for it in wave_items:
    if it['is_folder']:
        sub_items = fetch_folder_items(it['id'], f"The Wave / {it['title']}")
        for s in sub_items:
            if s['is_folder']:
                deep_items = fetch_folder_items(s['id'], f"{it['title']} / {s['title']}")
                all_scanned_files.extend(deep_items)
            else:
                all_scanned_files.append(s)
    else:
        all_scanned_files.append(it)

with open('scanned_drive_files.json', 'w', encoding='utf-8') as f_out:
    json.dump(all_scanned_files, f_out, indent=2, ensure_ascii=False)

print(f'\nFinished scanning! Total files saved: {len(all_scanned_files)}')
