import re
import json

with open('drive_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Procurar window['_DRIVE_ivd']
match = re.search(r"window\['_DRIVE_ivd'\]\s*=\s*'([^']+)'", html)
if match:
    raw_ivd = match.group(1)
    # Decodificar unicode / hex escapes como \x5b
    decoded_ivd = raw_ivd.encode('utf-8').decode('unicode_escape')
    print('Decoded length:', len(decoded_ivd))
    
    try:
        data = json.loads(decoded_ivd)
        print('JSON parsed successfully!')
        with open('drive_items.json', 'w', encoding='utf-8') as f_out:
            json.dump(data, f_out, indent=2, ensure_ascii=False)
            
        # Listar todos os itens
        if isinstance(data, list) and len(data) > 0 and isinstance(data[0], list):
            items = data[0]
            print(f'Total items in folder: {len(items)}')
            for item in items:
                # Estrutura comum do Google Drive item: [id, parentIds, title, mimeType, ...]
                item_id = item[0] if len(item) > 0 else 'N/A'
                title = item[2] if len(item) > 2 else 'N/A'
                mime = item[3] if len(item) > 3 else 'N/A'
                print(f'- Title: "{title}" | Type: {mime} | ID: {item_id}')
    except Exception as e:
        print('JSON error:', e)
        # fallback regex
        names = re.findall(r'\[\"([a-zA-Z0-9_\-]+)\",\[\"1hL6hQs1pqr7-sp0bdkU14CXJWe8RBcht\"\]\s*,\s*\"([^\"]+)\"', decoded_ivd)
        print('Regex extracted items:', names)
else:
    print('DRIVE_ivd not found')
