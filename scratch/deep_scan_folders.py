import urllib.request
import re
import json

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

# Scan Litoral
print("=== Scanning Litoral (1QtIVHODdXFFi85C_G94G95KLQ9A-txKk) ===")
litoral_items = fetch_items('1QtIVHODdXFFi85C_G94G95KLQ9A-txKk')
for item_id, parent_id, title, mime in litoral_items:
    print(f"  Item: {title} (ID: {item_id}, Mime: {mime})")
    # Sub-scan
    sub_items = fetch_items(item_id)
    for sid, spid, stitle, smime in sub_items:
        print(f"    -> SubItem: {stitle} (ID: {sid})")

# Scan Disponibilidade
print("\n=== Scanning Disponibilidade (1TQeiSr0A4bOMf0nYXICMKCJsW7EnUFU3) ===")
disp_items = fetch_items('1TQeiSr0A4bOMf0nYXICMKCJsW7EnUFU3')
for item_id, parent_id, title, mime in disp_items:
    print(f"  Item: {title} (ID: {item_id}, Mime: {mime})")
