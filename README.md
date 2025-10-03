# 🏡 Actualizador de precios - Almirón Propiedades  

Este repositorio automatiza la actualización de precios e información de lotes en distintos barrios, a partir de datos cargados en **Google Sheets**, y genera archivos **JSON** que luego son consumidos por el frontend (Leaflet + GeoJSON).  

Actualmente soporta dos barrios:  

- **Portofino**  
- **Terranova**  

---

## ⚙️ Flujo de trabajo

```text
+------------------+       +----------------------+       +-------------------+
|  Google Sheets   | ----> |  Script Python (CI)  | ----> |  datos_xxx.json   |
+------------------+       +----------------------+       +-------------------+
                                   |                              |
                                   v                              v
                             GitHub Actions                 Frontend Leaflet

## 📂 Estructura de los JSON

### Portofino (`datos_portofino.json`)
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
  ]
}
```

📌 Estados posibles:
- Disponible
- Vendido
- Reservado
- No disponible (próxima etapa)

### Terranova (`datos_terranova.json`)
```json
{
  "Manzana A": [
    {
      "numero": "1",
      "frente": "20",
      "largo": "50",
      "superficie": "1000",
      "precio_contado": "USD 100.000",
      "plan1_entrega_inicial": "USD 44.000",
      "plan1_cuotas": "USD 1.833",
      "plan1_precio_final": "USD 110.000",
      "plan2_entrega_inicial": "",
      "plan2_cuotas": "",
      "plan2_precio_final": "",
      "fecha_entrega": "Inmediata",
      "estado": "Vendido"
    }
  ]
}
```
📌 Estados posibles:
+ Disponible → verde
+ Vendido → rojo
+ Reservado → amarillo
+ No disponible → gris (próxima etapa)
+ Reventa → azul (solo contado, sin financiación)

📌 Planes:
+ Si fecha_entrega = Inmediata → planes 36 y 48 cuotas.
+ Si fecha_entrega ≠ Inmediata → planes 48 y 72 cuotas.
+ Si estado = Reventa → solo contado.

## ⏱️ Cron y Workflows

El proyecto actualiza automáticamente los archivos `datos_portofino.json` y `datos_terranova.json` desde Google Sheets usando **GitHub Actions**.

### Programación de Cron

- **Portofino**:  
  - Todos los días a las **07:00** y **19:00** (hora Buenos Aires, GMT-3).  

- **Terranova**:  
  - Todos los días a las **07:30** y **19:30** (hora Buenos Aires, GMT-3).  

Esto permite evitar el límite de lectura de Google Sheets (error 429 por demasiadas requests).

## 🗺️ Frontend

Los JSON generados son consumidos por un frontend hecho en Leaflet que:

Carga el GeoJSON con los lotes.

Cruza la info con datos_portofino.json o datos_terranova.json.

Muestra la información de cada lote en un panel lateral fijo.

Incluye leyenda de colores fija en la esquina inferior derecha.

Usa el SVG original como fondo y el GeoJSON encima, para mantener fidelidad visual.

## 🚀 Cómo correr manualmente

Ir a la pestaña Actions en GitHub.

Seleccionar el workflow Actualizar JSON desde Google Sheets.

Click en Run workflow.

Elegir Portofino, Terranova o Ambos.
