import urllib.request
import os

file_id = '1o8Nut-blBMHlNuYWr2Zt2G8xGGeLhsqT'
download_url = f'https://drive.google.com/uc?export=download&id={file_id}'
output_path = 'scratch/escala_v3.xlsx'

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
req = urllib.request.Request(download_url, headers=headers)

try:
    with urllib.request.urlopen(req) as resp, open(output_path, 'wb') as out_file:
        out_file.write(resp.read())
    print(f"Downloaded successfully to {output_path}. Size: {os.path.getsize(output_path)} bytes.")
except Exception as e:
    print("Download error:", e)
