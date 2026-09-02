import csv

print("--- Google Sheets Exported CSV (Primeiras 15 linhas) ---")
with open('scratch/pipeline_sheet_export.csv', 'r', encoding='utf-8', errors='ignore') as f:
    reader = csv.reader(f)
    for i in range(15):
        try:
            row = next(reader)
            print(f"L{i+1}: {row}")
        except StopIteration:
            break

print("\n--- Pipeline(-).csv do Drive (Primeiras 10 linhas) ---")
with open('scratch/pipeline_latest.csv', 'r', encoding='latin-1', errors='ignore') as f:
    reader = csv.reader(f, delimiter=';')
    for i in range(10):
        try:
            row = next(reader)
            print(f"L{i+1}: {row}")
        except StopIteration:
            break
