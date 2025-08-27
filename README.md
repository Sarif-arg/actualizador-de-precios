# 📘 Manual Técnico – Actualizador de Precios

## 1. Descripción del proyecto

Este repositorio automatiza la actualización de precios de lotes de **Portofino** (y eventualmente otros desarrollos).

El flujo es:
* Un script en Python + GSpread lee los datos del Excel en Google Drive.
* Se genera un archivo `datos.json` estructurado por sectores.
* Un workflow de **GitHub Actions** actualiza automáticamente el repo con ese JSON todos los días.
* Un HTML con acordeones animados y tablas responsive consume `datos.json` y muestra la información en la web.

---

## 2. Estructura del JSON

Cada sector (ejemplo A1, A2, …) contiene una lista de lotes.
Ejemplo:

```json
{
  "A1": [
    {
      "numero": "1",
      "superficie": "364,20",
      "precio_contado": "27.677 USD",
      "plan36_entrega_inicial": "10.197 USD",
      "plan36_cuotas": "526 USD",
      "plan36_precio_final": "29.133 USD",
      "plan60_entrega_inicial": "9.932 USD",
      "plan60_cuotas": "386 USD",
      "plan60_precio_final": "33.106 USD",
      "fecha_entrega": "abril 2029",
      "estado": "Disponible"
    }
  ]}
```

---

## 3. Frontend (HTML + JS + Tailwind)

Cada sector se renderiza en un acordeón.

Los lotes se muestran en una tabla.

El estado colorea toda la fila:

Verde pastel → Disponible

Amarillo pastel → Reservado

Rojo pastel → Vendido

Responsive

En pantallas chicas (<760px), las tablas se transforman en cards:

Cada fila pasa a ocupar un bloque con etiquetas tipo “N°”, “Superficie”, etc.

Esto evita el scroll horizontal.

---

## 4. Workflow en GitHub Actions

Archivo: .github/workflows/update.yml

Corre todos los días a las 03:00 UTC.

Instala dependencias, ejecuta el script y hace commit automático.

Usa un PAT (Personal Access Token) guardado en GH_PAT.

---

## 5. Cómo ejecutar manualmente

Si querés correrlo en tu máquina local:

python obtener_precios.py

Esto genera datos.json en el directorio del script.

Luego:

git add datos.json

git commit -m "Actualización manual"

git push origin main

---

## 6. Archivos principales

obtener_precios.py → Script que lee Google Sheets y genera datos.json.

datos.json → Archivo actualizado con la info de precios.

index.html → Interfaz web con acordeones y tablas responsive.

.github/workflows/update.yml → Automatización de GitHub Actions.

---

## 7. Mantenimiento futuro

Si se agrega otro loteo:

Crear nueva hoja en Google Drive.

Ajustar el script para parsear ese loteo.

El JSON tendrá nuevas claves (Portofino, OtroLoteo, etc.).

El HTML leerá dinámicamente cada proyecto.
