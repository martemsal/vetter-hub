import csv
import json
import re

units_by_property = {}
all_units = []

def clean_money(val_str):
    s = val_str.replace(' ', '').replace('R$', '')
    if not s: return 0.0
    parts = s.split(',')
    if len(parts) > 1 and len(parts[-1]) == 3:
        try:
            return float(''.join(parts))
        except:
            pass
    try:
        return float(s.replace('.', '').replace(',', '.'))
    except:
        return 0.0

def format_currency(num):
    if not num: return "Sob consulta"
    return f"R$ {num:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')

# Mapa de normalização de IDs de empreendimento
def make_prop_id(name):
    return name.lower().replace(' ', '-').replace('á', 'a').replace('ã', 'a').replace('é', 'e').replace('ó', 'o').replace('í', 'i')

with open('scratch/pipeline.csv', 'r', encoding='latin-1') as f:
    reader = csv.reader(f, delimiter=';')
    header = next(reader)
    
    for row in reader:
        if len(row) >= 6:
            emp = row[0].strip()
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
                'areaPrivativa': f"{area} m²" if area else "",
                'situacao': situacao_clean,
                'valorVGV': val_vgv,
                'valorNum': val_num,
                'valorM2': f"R$ {valor_m2}" if valor_m2 else ""
            }

            all_units.append(item)
            if prop_id not in units_by_property:
                units_by_property[prop_id] = {
                    'propertyName': emp,
                    'propertyId': prop_id,
                    'units': []
                }
            units_by_property[prop_id]['units'].append(item)

# Lista ordenada de empreendimentos
properties_list = []
for pid, pdata in sorted(units_by_property.items(), key=lambda x: x[1]['propertyName']):
    properties_list.append({
        'id': pid,
        'name': pdata['propertyName'],
        'totalUnits': len(pdata['units']),
        'availableCount': sum(1 for u in pdata['units'] if u['situacao'] == 'Disponível')
    })

js_code = f"""// Pipeline Oficial de VGV e Disponibilidade Vetter
// Processado a partir do arquivo 'Pipeline(-).csv' com 1953 unidades e 22 empreendimentos.

export const PIPELINE_PROPERTIES = {json.dumps(properties_list, ensure_ascii=False, indent=2)};

export const PIPELINE_DATA_BY_PROPERTY = {json.dumps(units_by_property, ensure_ascii=False, indent=2)};

export const ALL_PIPELINE_UNITS = {json.dumps(all_units, ensure_ascii=False, indent=2)};
"""

with open('src/data/pipelineData.js', 'w', encoding='utf-8') as f:
    f.write(js_code)

print(f"Generated src/data/pipelineData.js with {len(all_units)} units and {len(properties_list)} properties!")
