import urllib.request
import re

url = 'https://drive.google.com/drive/folders/1QtIVHODdXFFi85C_G94G95KLQ9A-txKk'
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
req = urllib.request.Request(url, headers=headers)

try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        with open('litoral_folder.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print('Saved litoral_folder.html, size:', len(html))
        
        # Procurar por window['_DRIVE_ivd']
        match = re.search(r"window\['_DRIVE_ivd'\]\s*=\s*'([^']+)'", html)
        if match:
            raw_ivd = match.group(1)
            decoded_ivd = raw_ivd.encode('utf-8').decode('unicode_escape')
            with open('litoral_ivd.txt', 'w', encoding='utf-8') as f2:
                f2.write(decoded_ivd)
            print('Saved litoral_ivd.txt')
            
            # Buscar por nomes com csv ou Disponibilidade
            csv_matches = re.findall(r'\"([^\"]*csv[^\"]*)\"', decoded_ivd, re.IGNORECASE)
            print('CSV matches in IVD:', csv_matches)
            
            # Listar todos os itens da pasta
            items = re.findall(r'\["([a-zA-Z0-9_\-]+)",\["1QtIVHODdXFFi85C_G94G95KLQ9A-txKk"\]\s*,\s*"([^"]+)"', decoded_ivd)
            print('Items in Litoral:', items)
except Exception as e:
    print('Error:', e)
