import gspread
import json
import os

# Leer credenciales desde variable de entorno
# GitHub Actions define GOOGLE_CREDENTIALS_ACTUALIZADOR
creds_json = os.environ.get("GOOGLE_CREDENTIALS_ACTUALIZADOR")
if not creds_json:
    raise ValueError("No se encontró la variable de entorno GOOGLE_CREDENTIALS_ACTUALIZADOR")

creds_dict = json.loads(creds_json)  # convertir string JSON en dict
gc = gspread.service_account_from_dict(creds_dict)

# Abrir planilla por ID
sh = gc.open_by_key("1faQLs3WhxNTeC1wmDi4Y9kD6ktnqPNeTO5h3ITzlaeg")

# Hojas válidas
valid_sheets = [
    "A1", "A2", "A3", "A4",
    "B1", "B2", "B3", "B4",
    "C1", "C2", "C3",
    "D1", "D2",
    "L1", "L2"
]

column_names = [
    "numero",
    "superficie",
    "precio_contado",
    "plan36_entrega_inicial",
    "plan36_cuotas",
    "plan36_precio_final",
    "plan60_entrega_inicial",
    "plan60_cuotas",
    "plan60_precio_final",
    "fecha_entrega",
    "estado"
]

data = {}
for sheet_name in valid_sheets:
    ws = sh.worksheet(sheet_name)
    rows = ws.get_all_values()[1:]  # saltamos encabezado
    parsed = []

    for row in rows:
        if len(row) < len(column_names):
            row += [""] * (len(column_names) - len(row))
        parsed.append(dict(zip(column_names, row)))

    data[sheet_name] = parsed

output_path = os.path.join(os.path.dirname(__file__), "datos.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ JSON generado con éxito en {output_path}")