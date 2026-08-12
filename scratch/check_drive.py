import urllib.request
import re
import json

folder_id = '1hL6hQs1pqr7-sp0bdkU14CXJWe8RBcht'
url = f'https://drive.google.com/drive/folders/{folder_id}'
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        with open('drive_page.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print('Saved drive_page.html, size:', len(html))
        
        # Procurar blocos JSON embebidos do Google Drive
        # O Google Drive geralmente injeta dados em tags script como window['_DRIVE_wiz_global_data'] ou _DRIVE_
        # Vamos procurar padrões com nomes de arquivos e IDs
        all_strings = re.findall(r'\["([A-Za-z0-9_\-\s\.\u00C0-\u00FF]{3,60})"', html)
        print('Sample strings:', all_strings[:50])
except Exception as e:
    print('Error:', e)
