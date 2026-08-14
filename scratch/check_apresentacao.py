import urllib.request
import re

url = 'https://drive.google.com/drive/folders/1nrJRqWuf39hk9tJe8Swdr5VqOo1hWQuy'
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
req = urllib.request.Request(url, headers=headers)

try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        with open('apresentacao_page.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print('Saved apresentacao_page.html, size:', len(html))
        
        # Procurar por window['_DRIVE_ivd']
        match = re.search(r"window\['_DRIVE_ivd'\]\s*=\s*'([^']+)'", html)
        if match:
            raw_ivd = match.group(1)
            decoded_ivd = raw_ivd.encode('utf-8').decode('unicode_escape')
            with open('apresentacao_ivd.txt', 'w', encoding='utf-8') as f2:
                f2.write(decoded_ivd)
            print('Saved apresentacao_ivd.txt')
            
            # Capturar qualquer trecho com nomes
            names = re.findall(r'\["([a-zA-Z0-9_\-]+)",\["1nrJRqWuf39hk9tJe8Swdr5VqOo1hWQuy"\]\s*,\s*"([^"]+)"', decoded_ivd)
            print('Found items in Apresentacao folder:', names)
except Exception as e:
    print('Error:', e)
