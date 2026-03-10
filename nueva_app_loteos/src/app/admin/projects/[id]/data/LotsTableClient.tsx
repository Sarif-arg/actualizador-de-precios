"use client"

import { useState } from "react"

// Types
type Lot = {
  id: string
  projectId: string
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

export default function LotsTableClient({ projectId, initialLots }: { projectId: string, initialLots: Lot[] }) {
  const [lots, setLots] = useState<Lot[]>(initialLots)
  const [editingLotId, setEditingLotId] = useState<string | null>(null)

  // Temporal state para edición de un lote en específico
  const [editForm, setEditForm] = useState<Partial<Lot>>({})

  const startEdit = (lot: Lot) => {
    setEditingLotId(lot.id)
    setEditForm(lot)
  }

  const cancelEdit = () => {
    setEditingLotId(null)
    setEditForm({})
  }

  const saveEdit = async () => {
    if (!editingLotId) return

    // Call our patch API
    const res = await fetch(`/api/projects/${projectId}/lots/${editingLotId}`, {
      method: 'PATCH',
      body: JSON.stringify(editForm),
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.ok) {
      const updatedLot = await res.json()
      setLots(prev => prev.map(l => l.id === updatedLot.id ? updatedLot : l))
      setEditingLotId(null)
      setEditForm({})
    } else {
      alert("Error al guardar cambios")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  if (lots.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Aún no hay lotes vinculados. Ve al <strong>Editor de Mapa</strong> para vincular polígonos del SVG con los lotes.</p>
        <a href={`/admin/projects/${projectId}/edit-map`} className="text-blue-600 hover:underline mt-4 inline-block">Ir al Editor de Mapa</a>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto text-black text-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100 border-b text-gray-700">
          <tr>
            <th className="p-3 font-semibold w-16">Sector</th>
            <th className="p-3 font-semibold w-16">N°</th>
            <th className="p-3 font-semibold w-32">Estado</th>
            <th className="p-3 font-semibold w-24">Superficie</th>
            <th className="p-3 font-semibold w-32">Precio Contado</th>
            <th className="p-3 font-semibold w-32">Fecha Entrega</th>
            <th className="p-3 font-semibold text-center border-l bg-blue-50/50" colSpan={4}>Plan 1 (Ej. 36 Cuotas)</th>
            <th className="p-3 font-semibold text-center border-l bg-green-50/50" colSpan={4}>Plan 2 (Ej. 60 Cuotas)</th>
            <th className="p-3 font-semibold text-center w-24 border-l">Acción</th>
          </tr>
          {/* Subheaders for plans */}
          <tr className="bg-gray-50 border-b text-xs text-gray-600">
            <th colSpan={6} className="p-2 border-r"></th>
            <th className="p-2 border-l border-r border-gray-200">Nombre</th>
            <th className="p-2 border-r border-gray-200">Entrega</th>
            <th className="p-2 border-r border-gray-200">Cuotas</th>
            <th className="p-2 border-r border-gray-200">P. Final</th>

            <th className="p-2 border-l border-r border-gray-200">Nombre</th>
            <th className="p-2 border-r border-gray-200">Entrega</th>
            <th className="p-2 border-r border-gray-200">Cuotas</th>
            <th className="p-2 border-r border-gray-200">P. Final</th>
            <th className="p-2 border-l"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {lots.map(lot => {
            const isEditing = editingLotId === lot.id

            if (isEditing) {
              return (
                <tr key={lot.id} className="bg-yellow-50/30">
                  <td className="p-2"><input className="w-full p-1 border rounded" name="sector" value={editForm.sector || ""} onChange={handleInputChange} /></td>
                  <td className="p-2"><input className="w-full p-1 border rounded" name="numero" value={editForm.numero || ""} onChange={handleInputChange} /></td>
                  <td className="p-2">
                    <select className="w-full p-1 border rounded" name="estado" value={editForm.estado || "Disponible"} onChange={handleInputChange}>
                      <option value="Disponible">Disponible</option>
                      <option value="Reservado">Reservado</option>
                      <option value="Vendido">Vendido</option>
                      <option value="ProximaEtapa">Próxima Etapa / No Disp</option>
                      <option value="Reventa">Reventa</option>
                    </select>
                  </td>
                  <td className="p-2"><input className="w-full p-1 border rounded" name="superficie" value={editForm.superficie || ""} onChange={handleInputChange} /></td>
                  <td className="p-2"><input className="w-full p-1 border rounded" name="precio_contado" value={editForm.precio_contado || ""} onChange={handleInputChange} /></td>
                  <td className="p-2 border-r"><input className="w-full p-1 border rounded" name="fecha_entrega" value={editForm.fecha_entrega || ""} onChange={handleInputChange} /></td>

                  {/* Plan 1 */}
                  <td className="p-2"><input className="w-full p-1 border rounded text-xs" name="plan1_nombre" value={editForm.plan1_nombre || ""} onChange={handleInputChange} /></td>
                  <td className="p-2"><input className="w-full p-1 border rounded text-xs" name="plan1_entrega" value={editForm.plan1_entrega || ""} onChange={handleInputChange} /></td>
                  <td className="p-2"><input className="w-full p-1 border rounded text-xs" name="plan1_cuotas" value={editForm.plan1_cuotas || ""} onChange={handleInputChange} /></td>
                  <td className="p-2 border-r"><input className="w-full p-1 border rounded text-xs" name="plan1_precio_final" value={editForm.plan1_precio_final || ""} onChange={handleInputChange} /></td>

                  {/* Plan 2 */}
                  <td className="p-2"><input className="w-full p-1 border rounded text-xs" name="plan2_nombre" value={editForm.plan2_nombre || ""} onChange={handleInputChange} /></td>
                  <td className="p-2"><input className="w-full p-1 border rounded text-xs" name="plan2_entrega" value={editForm.plan2_entrega || ""} onChange={handleInputChange} /></td>
                  <td className="p-2"><input className="w-full p-1 border rounded text-xs" name="plan2_cuotas" value={editForm.plan2_cuotas || ""} onChange={handleInputChange} /></td>
                  <td className="p-2 border-r"><input className="w-full p-1 border rounded text-xs" name="plan2_precio_final" value={editForm.plan2_precio_final || ""} onChange={handleInputChange} /></td>

                  <td className="p-2 text-center flex gap-1 justify-center">
                    <button onClick={saveEdit} className="text-white bg-green-600 hover:bg-green-700 px-2 py-1 rounded shadow text-xs">Guardar</button>
                    <button onClick={cancelEdit} className="text-gray-600 bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded shadow text-xs">❌</button>
                  </td>
                </tr>
              )
            }

            return (
              <tr key={lot.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3">{lot.sector}</td>
                <td className="p-3 font-semibold">{lot.numero}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${lot.estado === 'Disponible' ? 'bg-green-100 text-green-800' :
                      lot.estado === 'Reservado' ? 'bg-yellow-100 text-yellow-800' :
                      lot.estado === 'Vendido' ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-800'}`}>
                    {lot.estado}
                  </span>
                </td>
                <td className="p-3 text-gray-600">{lot.superficie || '-'}</td>
                <td className="p-3 text-gray-600">{lot.precio_contado || '-'}</td>
                <td className="p-3 border-r text-gray-600">{lot.fecha_entrega || '-'}</td>

                <td className="p-3 text-xs text-gray-500">{lot.plan1_nombre || '-'}</td>
                <td className="p-3 text-xs text-gray-500">{lot.plan1_entrega || '-'}</td>
                <td className="p-3 text-xs text-gray-500">{lot.plan1_cuotas || '-'}</td>
                <td className="p-3 border-r text-xs font-semibold text-gray-600">{lot.plan1_precio_final || '-'}</td>

                <td className="p-3 text-xs text-gray-500">{lot.plan2_nombre || '-'}</td>
                <td className="p-3 text-xs text-gray-500">{lot.plan2_entrega || '-'}</td>
                <td className="p-3 text-xs text-gray-500">{lot.plan2_cuotas || '-'}</td>
                <td className="p-3 border-r text-xs font-semibold text-gray-600">{lot.plan2_precio_final || '-'}</td>

                <td className="p-3 text-center border-l">
                  <button onClick={() => startEdit(lot)} className="text-blue-600 hover:text-blue-800 hover:underline">
                    Editar
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
