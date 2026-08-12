import re
import json

with open('drive_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Procurar por blocos script contendo dados
scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
print('Total scripts:', len(scripts))

for i, s in enumerate(scripts):
    if '1hL6hQs1pqr7-sp0bdkU14CXJWe8RBcht' in s:
        print(f'Script {i} contains folder id!')
        # Imprimir trechos interessantes
        lines = s.split('\n')
        for line in lines:
            if '1hL6hQs1pqr7-sp0bdkU14CXJWe8RBcht' in line or 'Vetter' in line or 'Empreendimento' in line:
                print('Line:', line[:200])

# Procurar nomes de arquivos e pastas no HTML todo
vetter_matches = re.findall(r'([A-Za-z0-9\s\-_]{3,40}(?:Vetter|Beach|Ocean|Bay|Palais|Boulevard|Residencial|Tabela|Planta|Book|Torre)[A-Za-z0-9\s\-_]{0,40})', html, re.IGNORECASE)
print('Vetter matches found in HTML:', set(vetter_matches[:30]))
