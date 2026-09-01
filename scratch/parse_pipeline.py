import csv
import json
import re

# Ler com latin-1
units = []
with open('scratch/pipeline.csv', 'r', encoding='latin-1') as f:
    reader = csv.reader(f, delimiter=';')
    header = next(reader)
    print("Header:", header)
    
    for row in reader:
        if len(row) >= 6:
            emp = row[0].strip()
            unidade = row[1].strip()
            tipo = row[2].strip()
            area = row[3].strip()
            situacao = row[4].strip()
            valor_raw = row[5].strip()
            valor_m2 = row[6].strip() if len(row) > 6 else ""
            
            # Limpar valor numérico para ordenação e filtro
            # Ex: " 3,499,017 " -> 3499017.0
            val_clean = valor_raw.replace('R$', '').replace(' ', '').replace('.', '').replace(',', '.')
            # Espera: no padrão do csv " 3,499,017 " pode ser vírgula como milhar ou decimal
            # Vamos checar o valor: " 3,499,017 " tem vírgulas a cada 3 dígitos
            # Ex: 3,499,017 é 3 milhões 499 mil e 17
            val_num = 0
            try:
                # Remove espaços
                s = valor_raw.replace(' ', '').replace('R$', '')
                # Se tem 2 vírgulas (3,499,017), são separadores de milhar
                parts = s.split(',')
                if len(parts) > 1 and len(parts[-1]) == 3:
                    val_num = float(''.join(parts))
                else:
                    val_num = float(s.replace('.', '').replace(',', '.'))
            except Exception as e:
                val_num = 0

            # Extrair o número da unidade e final
            unit_match = re.search(r'(\d+)', unidade)
            unit_num = unit_match.group(1) if unit_match else ""
            final_num = unit_num[-2:].zfill(2) if len(unit_num) >= 2 else unit_num.zfill(2)

            units.append({
                'property': emp,
                'unit': unidade,
                'unitNumber': unit_num,
                'final': final_num,
                'tipo': tipo,
                'areaPrivativa': f"{area} m²" if area else "",
                'situacao': situacao,
                'valorVGV': f"R$ {val_num:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.'),
                'valorNum': val_num,
                'valorM2': valor_m2
            })

print(f"Total units loaded: {len(units)}")
props = sorted(list(set(u['property'] for u in units)))
tipos = sorted(list(set(u['tipo'] for u in units)))
situacoes = sorted(list(set(u['situacao'] for u in units)))

print("\nProperties:", props)
print("Tipos:", tipos)
print("Situações:", situacoes)

# Exemplo de busca "3 suítes até 3 milhões disponíveis"
matches = [u for u in units if '3s' in u['tipo'].lower() and u['situacao'].lower() == 'disponível' and u['valorNum'] <= 3000000]
print(f"\nExemplo: 3 suítes até 3M disponíveis ({len(matches)} encontradas):")
for m in matches[:10]:
    print(f" - {m['property']} | {m['unit']} | {m['tipo']} | {m['valorVGV']} (Área: {m['areaPrivativa']})")

with open('scratch/pipeline_parsed.json', 'w', encoding='utf-8') as out:
    json.dump(units, out, ensure_ascii=False, indent=2)

print("\nSaved to scratch/pipeline_parsed.json")
