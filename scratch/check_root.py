import urllib.request
import re

url = 'https://drive.google.com/drive/folders/1hL6hQs1pqr7-sp0bdkU14CXJWe8RBcht'
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
req = urllib.request.Request(url, headers=headers)

try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        
        # Procurar por window['_DRIVE_ivd']
        match = re.search(r"window\['_DRIVE_ivd'\]\s*=\s*'([^']+)'", html)
        if match:
            raw_ivd = match.group(1)
            decoded_ivd = raw_ivd.encode('utf-8').decode('unicode_escape')
            with open('root_ivd.txt', 'w', encoding='utf-8') as f2:
                f2.write(decoded_ivd)
            print('Saved root_ivd.txt')
            
            # Buscar por nomes de pastas ou arquivos
            items = re.findall(r'\["([a-zA-Z0-9_\-]+)",\["1hL6hQs1pqr7-sp0bdkU14CXJWe8RBcht"\]\s*,\s*"([^"]+)"', decoded_ivd)
            print('Items in Root:', items)
except Exception as e:
    print('Error:', e)
