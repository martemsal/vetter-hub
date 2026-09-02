import urllib.request
import re
import json
import os
import sys

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
                
                pattern = r'\["([a-zA-Z0-9_\-]+)",\["([a-zA-Z0-9_\-]+)"\],"([^"]+)"\s*,\s*"([^"]+)"'
                matches = re.findall(pattern, decoded_ivd)
                return matches
    except Exception as e:
        print(f"Error fetching folder {folder_id}:", e)
    return []

print("Buscando arquivos na pasta Disponibilidade (1TQeiSr0A4bOMf0nYXICMKCJsW7EnUFU3)...")
disp_items = fetch_items('1TQeiSr0A4bOMf0nYXICMKCJsW7EnUFU3')
pipe_id = None
pipe_name = None

for item_id, parent_id, title, mime in disp_items:
    print(f" -> Arquivo encontrado: {title} (ID: {item_id})")
    if 'pipeline' in title.lower() or 'pipe' in title.lower():
        pipe_id = item_id
        pipe_name = title

if not pipe_id:
    # Tenta na pasta raiz ou pelo ID anterior
    print("Tentando ID conhecido anterior: 1TUXM6hYbmSQ2nco4TSoyMCprKTAU4I4h")
    pipe_id = '1TUXM6hYbmSQ2nco4TSoyMCprKTAU4I4h'
    pipe_name = 'Pipeline(-).csv'

print(f"\nBaixando {pipe_name} (ID: {pipe_id})...")
download_url = f'https://drive.google.com/uc?export=download&id={pipe_id}'
req = urllib.request.Request(download_url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp, open('scratch/pipeline_latest.csv', 'wb') as f:
        f.write(resp.read())
    size = os.path.getsize('scratch/pipeline_latest.csv')
    print(f"Download concluído com sucesso! Tamanho: {size} bytes.")
except Exception as e:
    print("Erro ao baixar:", e)
