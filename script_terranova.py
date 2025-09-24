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
sh = gc.open_by_key("1LgEsuOrtTwbpckNV3JPpDKR9xejNyPv-ul5EM9lisNw")

# Hojas válidas
valid_sheets = [
    "Manzana A", "Manzana B", "Manzana C", "Manzana D",
    "Manzana E", "Manzana F", "Manzana G", "Manzana H",
    "Manzana I", "Manzana J", "Manzana K", "Manzana L",
    "Manzana M", "Manzana N", "Manzana O", "Manzana P",
    "Manzana Q",
]

column_names = [
    "numero",
    "frente",
    "largo",
    "superficie",
    "precio_contado",
    "plan1_entrega_inicial",
    "plan1_cuotas",
    "plan1_precio_final",
    "plan2_entrega_inicial",
    "plan2_cuotas",
    "plan2_precio_final",
    "fecha_entrega",
    "estado"
]

data = {}
for sheet_name in valid_sheets:
    ws = sh.worksheet(sheet_name)
    rows = ws.get_all_values()[2:]  # saltamos encabezado
    parsed = []

    for row in rows:
        if len(row) < len(column_names):
            row += [""] * (len(column_names) - len(row))
        parsed.append(dict(zip(column_names, row)))

    data[sheet_name] = parsed

output_path = os.path.join(os.path.dirname(__file__), "datos_terranova.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ JSON generado con éxito en {output_path}")
