import gspread
import json
import os

# Autenticación con Google Service Account
gc = gspread.service_account(filename="D:\Descargas\Programacion\Actualizar precios portofino\credenciales.json")

# Abrir archivo por nombre
sh = gc.open_by_key("1faQLs3WhxNTeC1wmDi4Y9kD6ktnqPNeTO5h3ITzlaeg")

# Hojas válidas (descartamos "Directorio")
valid_sheets = [
    "A1", "A2", "A3", "A4",
    "B1", "B2", "B3", "B4",
    "C1", "C2", "C3",
    "D1", "D2",
    "L1", "L2"
]

# Nombres de columnas esperadas
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

# Parsear datos
data = {}
for sheet_name in valid_sheets:
    ws = sh.worksheet(sheet_name)
    rows = ws.get_all_values()[2:]  # saltamos el header (fila 1)
    parsed = []

    for row in rows:
        if len(row) < len(column_names):  # rellenar si faltan columnas
            row += [""] * (len(column_names) - len(row))
        parsed.append(dict(zip(column_names, row)))

    data[sheet_name] = parsed

# Guardar en JSON en el mismo directorio que el script
output_path = os.path.join(os.path.dirname(__file__), "datos.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("✅ JSON generado con éxito: datos.json")
