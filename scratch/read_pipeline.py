import urllib.request
import csv
import os

file_id = '1TUXM6hYbmSQ2nco4TSoyMCprKTAU4I4h'
download_url = f'https://drive.google.com/uc?export=download&id={file_id}'
output_path = 'scratch/pipeline.csv'

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
req = urllib.request.Request(download_url, headers=headers)

try:
    with urllib.request.urlopen(req) as resp, open(output_path, 'wb') as out_file:
        out_file.write(resp.read())
    print(f"Downloaded successfully to {output_path}. Size: {os.path.getsize(output_path)} bytes.")
except Exception as e:
    print("Download error:", e)

# Inspecionar as primeiras 25 linhas
encodings = ['utf-8-sig', 'utf-8', 'latin-1', 'cp1252']
for enc in encodings:
    try:
        with open(output_path, 'r', encoding=enc) as f:
            lines = [f.readline() for _ in range(25)]
            print(f"\n--- Encoding: {enc} ---")
            for idx, l in enumerate(lines):
                if l.strip():
                    print(f"L{idx+1}: {l.strip()}")
            break
    except Exception as e:
        print(f"Failed with {enc}:", e)
