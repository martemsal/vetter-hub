import csv
import json
import re
import os

units_by_property = {}
all_units = []

def clean_money(val_str):
    if not val_str: return 0.0
    s = val_str.replace('R$', '').replace(' ', '').strip()
    if not s: return 0.0
    
    # Se estiver no formato brasileiro "3.507.414,26"
    if ',' in s:
        s = s.replace('.', '').replace(',', '.')
    else:
        # Se estiver no formato " 3,499,017 "
        parts = s.split(',')
        if len(parts) > 1 and len(parts[-1]) == 3:
            s = ''.join(parts)
    try:
        return float(s)
    except:
        return 0.0

def format_currency(num):
    if not num or num <= 0: return "Sob consulta"
    return f"R$ {num:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')

def make_prop_id(name):
    return (name.lower()
            .replace(' ', '-')
            .replace('á', 'a')
            .replace('ã', 'a')
            .replace('é', 'e')
            .replace('ó', 'o')
            .replace('í', 'i')
            .replace('ú', 'u')
            .replace('ç', 'c'))

# Processar o CSV mais recente exportado
with open('scratch/pipeline_sheet_export.csv', 'r', encoding='utf-8', errors='ignore') as f:
    reader = csv.reader(f)
    header = next(reader)
    print("Header processado:", header)
    
    for row in reader:
        if len(row) >= 6:
            emp = row[0].strip()
            
            # REGRA: Desconsiderar tudo que for referente ao Destin
            if 'destin' in emp.lower():
                continue

            unidade = row[1].strip()
            tipo = row[2].strip()
            area = row[3].strip()
            situacao = row[4].strip()
            valor_raw = row[5].strip()
            valor_m2 = row[6].strip() if len(row) > 6 else ""
            
            # Normalizar situação
            situacao_clean = "Disponível"
            if "bloq" in situacao.lower():
                situacao_clean = "Bloqueada"
            elif "vend" in situacao.lower():
                situacao_clean = "Vendida"

            val_num = clean_money(valor_raw)
            val_vgv = format_currency(val_num)

            # Extração de unidade e final
            unit_match = re.search(r'(\d+)', unidade)
            unit_num = unit_match.group(1) if unit_match else ""
            final_num = unit_num[-2:].zfill(2) if len(unit_num) >= 2 else unit_num.zfill(2)

            prop_id = make_prop_id(emp)

            item = {
                'property': emp,
                'propertyId': prop_id,
                'unit': unidade,
                'unitNumber': unit_num,
                'final': final_num,
                'tipo': tipo.upper(),
                'areaPrivativa': f"{area} m²" if area and not 'm²' in area else area,
                'situacao': situacao_clean,
                'valorVGV': val_vgv,
                'valorNum': val_num,
                'valorM2': valor_m2 if valor_m2 else ""
            }

            all_units.append(item)
            if prop_id not in units_by_property:
                units_by_property[prop_id] = {
                    'propertyName': emp,
                    'propertyId': prop_id,
                    'units': []
                }
            units_by_property[prop_id]['units'].append(item)

# Lista de empreendimentos
properties_list = []
for pid, pdata in sorted(units_by_property.items(), key=lambda x: x[1]['propertyName']):
    properties_list.append({
        'id': pid,
        'name': pdata['propertyName'],
        'totalUnits': len(pdata['units']),
        'availableCount': sum(1 for u in pdata['units'] if u['situacao'] == 'Disponível')
    })

js_code = f"""// Pipeline Oficial de VGV e Disponibilidade Vetter (Atualizado - Setembro 2026)
// Processado diretamente da planilha viva do Google Drive com {len(all_units)} unidades em {len(properties_list)} empreendimentos.

export const PIPELINE_PROPERTIES = {json.dumps(properties_list, ensure_ascii=False, indent=2)};

export const PIPELINE_DATA_BY_PROPERTY = {json.dumps(units_by_property, ensure_ascii=False, indent=2)};

export const ALL_PIPELINE_UNITS = {json.dumps(all_units, ensure_ascii=False, indent=2)};
"""

with open('src/data/pipelineData.js', 'w', encoding='utf-8') as f:
    f.write(js_code)

print(f"\nSucesso absoluto! Gerado src/data/pipelineData.js com {len(all_units)} unidades em {len(properties_list)} empreendimentos com valores atualizados.")
