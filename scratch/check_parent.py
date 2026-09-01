import urllib.request
import re

url = 'https://drive.google.com/drive/folders/1hL6hQs1pqr7-sp0bdkU14CXJWe8RBcht'
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        
        # Procurar IDs de pastas associadas
        parent_matches = re.findall(r'\"([a-zA-Z0-9_\-]{25,45})\"', html)
        print("Candidate IDs found:", set(parent_matches[:20]))
        
        # Procurar por "Escala" ou "xlsx"
        xlsx_matches = re.findall(r'([^\"]*Escala[^\"]*)', html, re.IGNORECASE)
        print("Escala matches in HTML:", xlsx_matches)
except Exception as e:
    print('Error:', e)
