import urllib.request
import os

sheets_id = '1IXGMtPD4HxjkS_soQ8JnipSdxJW9SbncZcC1ZwliPw8'
export_url = f'https://docs.google.com/spreadsheets/d/{sheets_id}/export?format=csv'

try:
    req = urllib.request.Request(export_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp, open('scratch/pipeline_sheet_export.csv', 'wb') as f:
        f.write(resp.read())
    print(f"Exported Google Sheets CSV! Size: {os.path.getsize('scratch/pipeline_sheet_export.csv')} bytes.")
except Exception as e:
    print("Could not export sheet directly:", e)
