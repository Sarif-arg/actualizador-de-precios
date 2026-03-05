import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import LotsTableClient from "./LotsTableClient"

export default async function ProjectDataPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: { lots: true }
  })

  if (!project) return notFound()

  // Sorter los lotes de forma simple (por sector y número)
  const sortedLots = project.lots.sort((a, b) => {
    if (a.sector === b.sector) {
      return a.numero.localeCompare(b.numero, undefined, { numeric: true })
    }
    return a.sector.localeCompare(b.sector)
  })

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Datos: {project.name}</h1>
          <p className="text-gray-500">Gestiona precios, estados y financiación de los lotes vinculados al mapa.</p>
        </div>
        <a href="/admin" className="text-blue-600 hover:underline">← Volver al inicio</a>
      </header>

      <main className="bg-white border shadow-sm rounded-lg overflow-hidden">
        <LotsTableClient projectId={id} initialLots={sortedLots} />
      </main>
    </div>
  )
}
