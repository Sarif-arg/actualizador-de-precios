"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

type Project = {
  id: string
  name: string
  svgContent: string | null
  lots: Lot[]
}

type Lot = {
  id: string
  svgPathId: string
  sector: string
  numero: string
  estado: string
}

export default function SvgEditorClient({ project }: { project: Project }) {
  const router = useRouter()
  const svgContainerRef = useRef<HTMLDivElement>(null)

  const [svgContent, setSvgContent] = useState<string | null>(project.svgContent)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)

  // Data local para evitar requests constantes en cada input
  const [localLots, setLocalLots] = useState<Lot[]>(project.lots)

  const [formSector, setFormSector] = useState("")
  const [formNumero, setFormNumero] = useState("")

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()

    // Save to server
    const res = await fetch(`/api/projects/${project.id}/svg`, {
      method: "POST",
      body: JSON.stringify({ svgContent: text }),
      headers: { "Content-Type": "application/json" }
    })
    if (res.ok) {
      setSvgContent(text)
      router.refresh()
    }
  }

  // Effect to attach click handlers to all paths/polygons
  useEffect(() => {
    if (!svgContainerRef.current) return

    const svgElement = svgContainerRef.current.querySelector('svg')
    if (!svgElement) return

    const interactableElements = svgElement.querySelectorAll('path, polygon, rect')

    // Función para manejar clicks en elementos del SVG
    const handleElementClick = (e: Event) => {
      const target = e.currentTarget as SVGElement

      // Si no tiene ID, le generamos uno en el momento (solo para este render, no se guarda en el crudo original sino que el ID se asocia)
      // Idealmente el SVG ya viene con IDs desde Illustrator/Inkscape.
      let id = target.getAttribute('id')
      if (!id) {
        id = `gen_${Math.random().toString(36).substr(2, 9)}`
        target.setAttribute('id', id)
      }

      setSelectedElementId(id)

      // Check if it already exists in lots
      const existing = localLots.find(l => l.svgPathId === id)
      if (existing) {
        setFormSector(existing.sector)
        setFormNumero(existing.numero)
      } else {
        setFormSector("")
        setFormNumero("")
      }

      // Visual feedback
      interactableElements.forEach(el => el.classList.remove('selected-path'))
      target.classList.add('selected-path')
    }

    interactableElements.forEach(el => {
      const svgEl = el as SVGElement
      // Add cursor pointer
      svgEl.style.cursor = 'pointer'
      el.addEventListener('click', handleElementClick)

      // Optional: if it's already a lot, color it slightly different to indicate it's mapped
      const isMapped = localLots.some(l => l.svgPathId === el.getAttribute('id'))
      if (isMapped) {
        el.classList.add('mapped-path')
      } else {
        el.classList.remove('mapped-path')
      }
    })

    return () => {
      interactableElements.forEach(el => {
        el.removeEventListener('click', handleElementClick)
      })
    }
  }, [svgContent, localLots])

  // Save the selected lot info
  const handleSaveLot = async () => {
    if (!selectedElementId || !formSector || !formNumero) return

    const res = await fetch(`/api/projects/${project.id}/lots`, {
      method: "POST",
      body: JSON.stringify({
        svgPathId: selectedElementId,
        sector: formSector,
        numero: formNumero,
        estado: "Disponible" // default
      }),
      headers: { "Content-Type": "application/json" }
    })

    if (res.ok) {
      const newLot = await res.json()
      // Update local state
      setLocalLots(prev => {
        const filtered = prev.filter(l => l.svgPathId !== selectedElementId)
        return [...filtered, newLot]
      })
      alert("Lote guardado correctamente")
    } else {
      alert("Error al guardar")
    }
  }

  const handleDeleteLot = async () => {
    if (!selectedElementId) return
    const lot = localLots.find(l => l.svgPathId === selectedElementId)
    if (!lot) return

    const res = await fetch(`/api/projects/${project.id}/lots/${lot.id}`, { method: "DELETE" })
    if (res.ok) {
      setLocalLots(prev => prev.filter(l => l.svgPathId !== selectedElementId))
      setSelectedElementId(null)
      alert("Vínculo eliminado")
    }
  }

  return (
    <div className="flex h-full text-black">
      {/* Sidebar Editor */}
      <div className="w-80 bg-white shadow-xl flex flex-col z-10 border-r">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-lg">Cargar Plano (SVG)</h3>
          <p className="text-sm text-gray-500 mb-2">Sube el archivo exportado desde tu editor gráfico.</p>
          <input
            type="file"
            accept=".svg"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <h3 className="font-semibold text-lg mb-4">Lote Seleccionado</h3>

          {!selectedElementId ? (
            <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md text-sm border border-yellow-200">
              Haz clic en un polígono en el mapa a la derecha para vincularlo a un lote.
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">ID del SVG Path</label>
                <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all">{selectedElementId}</div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Sector / Manzana</label>
                <input
                  type="text"
                  value={formSector}
                  onChange={e => setFormSector(e.target.value)}
                  placeholder="Ej. A1"
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Número de Lote</label>
                <input
                  type="text"
                  value={formNumero}
                  onChange={e => setFormNumero(e.target.value)}
                  placeholder="Ej. 1"
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="pt-4 flex flex-col gap-2">
                <button
                  onClick={handleSaveLot}
                  className="w-full bg-blue-600 text-white font-medium py-2 rounded shadow hover:bg-blue-700 transition"
                >
                  Guardar / Vincular
                </button>
                {localLots.find(l => l.svgPathId === selectedElementId) && (
                   <button
                   onClick={handleDeleteLot}
                   className="w-full bg-red-50 text-red-600 font-medium py-2 rounded border border-red-200 hover:bg-red-100 transition"
                 >
                   Desvincular Lote
                 </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 text-sm text-gray-600">
          Lotes mapeados: <strong>{localLots.length}</strong>
        </div>
      </div>

      {/* SVG Container */}
      <div className="flex-1 bg-gray-200 overflow-auto relative p-8">
        {!svgContent ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            Sube un archivo SVG para comenzar a editar
          </div>
        ) : (
          <div
            ref={svgContainerRef}
            className="svg-workspace shadow-2xl bg-white border border-gray-300 rounded mx-auto"
            style={{ width: 'fit-content', transformOrigin: 'top left' }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}
      </div>

      <style jsx global>{`
        .svg-workspace svg {
          max-width: none !important;
          height: auto !important;
        }
        /* Visual feedback para los elementos interactivos */
        .svg-workspace path:hover, .svg-workspace polygon:hover {
          fill-opacity: 0.8;
          stroke: #3b82f6;
          stroke-width: 2px;
        }
        .svg-workspace .selected-path {
          fill: #bfdbfe !important; /* blue-200 */
          stroke: #2563eb !important; /* blue-600 */
          stroke-width: 3px !important;
        }
        .svg-workspace .mapped-path {
          fill: #dcfce7; /* green-100 */
          fill-opacity: 0.7;
          stroke: #16a34a; /* green-600 */
          stroke-width: 1px;
        }
      `}</style>
    </div>
  )
}
