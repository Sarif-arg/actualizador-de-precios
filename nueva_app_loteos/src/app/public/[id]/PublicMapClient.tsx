"use client"

import { useEffect, useRef, useState } from "react"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"

type Lot = {
  id: string
  svgPathId: string
  sector: string
  numero: string
  estado: string
  superficie: string | null
  precio_contado: string | null
  fecha_entrega: string | null
  plan1_nombre: string | null
  plan1_entrega: string | null
  plan1_cuotas: string | null
  plan1_precio_final: string | null
  plan2_nombre: string | null
  plan2_entrega: string | null
  plan2_cuotas: string | null
  plan2_precio_final: string | null
}

type Project = {
  name: string
  svgContent: string
  lots: Lot[]
}

const estadoColors: Record<string, string> = {
  Disponible: "#22c55e",   // green-500
  Reservado: "#eab308",    // yellow-500
  Vendido: "#ef4444",      // red-500
  ProximaEtapa: "#6b7280", // gray-500
  Reventa: "#3b82f6",      // blue-500
}

export default function PublicMapClient({ project }: { project: Project }) {
  const svgRef = useRef<HTMLDivElement>(null)
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null)

  useEffect(() => {
    if (!svgRef.current) return
    const svgEl = svgRef.current.querySelector('svg')
    if (!svgEl) return

    // Color the paths based on DB state
    project.lots.forEach(lot => {
      const pathEl = document.getElementById(lot.svgPathId)
      if (pathEl) {
        pathEl.style.fill = estadoColors[lot.estado] || "#ccc"
        pathEl.style.fillOpacity = "0.7"
        pathEl.style.cursor = "pointer"
        pathEl.style.transition = "fill-opacity 0.2s, stroke-width 0.2s"

        const onEnter = () => {
          pathEl.style.fillOpacity = "0.9"
          pathEl.style.stroke = "#000"
          pathEl.style.strokeWidth = "2px"
        }

        const onLeave = () => {
          pathEl.style.fillOpacity = "0.7"
          pathEl.style.stroke = "none"
        }

        const onClick = () => setSelectedLot(lot)

        pathEl.addEventListener('mouseenter', onEnter)
        pathEl.addEventListener('mouseleave', onLeave)
        pathEl.addEventListener('click', onClick)

        // Cleanup
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(pathEl as any)._cleanup = () => {
          pathEl.removeEventListener('mouseenter', onEnter)
          pathEl.removeEventListener('mouseleave', onLeave)
          pathEl.removeEventListener('click', onClick)
        }
      }
    })

    return () => {
      project.lots.forEach(lot => {
        const pathEl = document.getElementById(lot.svgPathId)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (pathEl && (pathEl as any)._cleanup) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (pathEl as any)._cleanup()
        }
      })
    }
  }, [project.lots])

  return (
    <>
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h1 className="text-3xl font-black text-black drop-shadow-md bg-white/80 px-4 py-2 rounded-xl backdrop-blur-sm border shadow-xl">
          {project.name}
        </h1>
      </div>

      <div className="w-full h-full relative z-0 flex items-center justify-center bg-gray-200">
        <TransformWrapper
          initialScale={1}
          minScale={0.1}
          maxScale={5}
          wheel={{ step: 0.1 }}
          doubleClick={{ disabled: false }}
        >
          <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
            <div
              ref={svgRef}
              dangerouslySetInnerHTML={{ __html: project.svgContent }}
              style={{
                width: "fit-content",
                transformOrigin: "top left"
              }}
            />
          </TransformComponent>
        </TransformWrapper>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-10 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border text-sm text-gray-800 pointer-events-auto">
        <h3 className="font-bold mb-3">Leyenda</h3>
        <ul className="space-y-2">
          {Object.entries(estadoColors).map(([estado, color]) => (
            <li key={estado} className="flex items-center gap-2">
              <span className="w-4 h-4 rounded" style={{ backgroundColor: color }}></span>
              {estado}
            </li>
          ))}
        </ul>
      </div>

      {/* Info Panel Right */}
      {selectedLot && (
        <div className="absolute top-6 right-6 z-10 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border overflow-hidden transition-all duration-300 pointer-events-auto text-black text-sm animate-in slide-in-from-right-10 fade-in">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 text-white flex justify-between items-start">
            <div>
              <p className="text-gray-300 text-xs uppercase tracking-widest mb-1">Sector {selectedLot.sector}</p>
              <h2 className="text-2xl font-bold">Lote {selectedLot.numero}</h2>
            </div>
            <button
              onClick={() => setSelectedLot(null)}
              className="text-gray-400 hover:text-white bg-white/10 p-1.5 rounded-full transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: estadoColors[selectedLot.estado] || '#ccc' }}></span>
              <span className="font-semibold text-lg">{selectedLot.estado}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-y border-gray-100 py-4">
              <div>
                <p className="text-gray-500 text-xs uppercase font-semibold">Superficie</p>
                <p className="font-medium">{selectedLot.superficie ? `${selectedLot.superficie} m²` : '-'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase font-semibold">Entrega</p>
                <p className="font-medium">{selectedLot.fecha_entrega || '-'}</p>
              </div>
            </div>

            <div>
               <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Precio de Contado</p>
               <p className="font-bold text-xl text-green-700">{selectedLot.precio_contado || '-'}</p>
            </div>

            {/* Plan 1 */}
            {(selectedLot.plan1_entrega || selectedLot.plan1_cuotas) && (
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="font-semibold text-blue-900 mb-2">{selectedLot.plan1_nombre || 'Plan 1'}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 block">Entrega</span>
                    <span className="font-medium">{selectedLot.plan1_entrega || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Cuotas</span>
                    <span className="font-medium">{selectedLot.plan1_cuotas || '-'}</span>
                  </div>
                </div>
                {selectedLot.plan1_precio_final && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <span className="text-gray-500 text-xs">Precio Final:</span>
                    <span className="font-semibold float-right">{selectedLot.plan1_precio_final}</span>
                  </div>
                )}
              </div>
            )}

            {/* Plan 2 */}
            {(selectedLot.plan2_entrega || selectedLot.plan2_cuotas) && (
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="font-semibold text-blue-900 mb-2">{selectedLot.plan2_nombre || 'Plan 2'}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 block">Entrega</span>
                    <span className="font-medium">{selectedLot.plan2_entrega || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Cuotas</span>
                    <span className="font-medium">{selectedLot.plan2_cuotas || '-'}</span>
                  </div>
                </div>
                {selectedLot.plan2_precio_final && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <span className="text-gray-500 text-xs">Precio Final:</span>
                    <span className="font-semibold float-right">{selectedLot.plan2_precio_final}</span>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      <style jsx global>{`
        .react-transform-wrapper, .react-transform-component {
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
    </>
  )
}
