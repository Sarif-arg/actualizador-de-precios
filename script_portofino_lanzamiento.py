import gspread
import json
import os

# Leer credenciales desde variable de entorno
# GitHub Actions define GOOGLE_CREDENTIALS_PORTOFINO_LANZAMIENTO
creds_json = os.environ.get("GOOGLE_CREDENTIALS_PORTOFINO_LANZAMIENTO")
if not creds_json:
    raise ValueError("No se encontró la variable de entorno GOOGLE_CREDENTIALS_PORTOFINO_LANZAMIENTO")

creds_dict = json.loads(creds_json)  # convertir string JSON en dict
gc = gspread.service_account_from_dict(creds_dict)

# Abrir planilla por ID
sh = gc.open_by_key("1Ey-7mblrAuVkM8jVeS--sOEnwsH60x98wMYFDiHCeWY")

# Hojas válidas
valid_sheets_plan_48 = [
    "A1", "A2",
    "B1", "B2", "B3", "B4",
    "C1", "C2.1",
    "D1", "D2",
    "L1", "L2"
]

valid_sheets_plan_60 = [
    "A3", "A4",
    "C2.2", "C3",
]

column_names_plan_48 = [
    "numero",
    "superficie",
    "precio_lista",
    "entrega_inicial",
    "cuotas_plan_12",
    "cuotas_plan_24",
    "cuotas_plan_36",
    "cuotas_plan_48",
    "plan_48_refuerzo_aguinaldo",
    "fecha_entrega",
    "estado"
]
column_names_plan_60 = [
    "numero",
    "superficie",
    "precio_lista",
    "entrega_inicial",
    "cuotas_plan_12",
    "cuotas_plan_24",
    "cuotas_plan_36",
    "cuotas_plan_48",
    "cuotas_plan_60",
    "plan_60_refuerzo_aguinaldo",
    "fecha_entrega",
    "estado"
]

def parse_sheet(sheet_name, column_names):
    ws = sh.worksheet(sheet_name)
    rows = ws.get_all_values()[2:]  # saltamos encabezado
    parsed = []

    for row in rows:
        if len(row) < len(column_names):
            row += [""] * (len(column_names) - len(row))
        parsed.append(dict(zip(column_names, row)))

    return parsed

data = {}
for sheet_name in valid_sheets_plan_48:
    data[sheet_name] = parse_sheet(sheet_name, column_names_plan_48)

for sheet_name in valid_sheets_plan_60:
    data[sheet_name] = parse_sheet(sheet_name, column_names_plan_60)

output_path = os.path.join(os.path.dirname(__file__), "datos_portofino_lanzamiento.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ JSON generado con éxito en {output_path}")
