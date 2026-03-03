import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import SvgEditorClient from "./SvgEditorClient"

export default async function EditMapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      lots: true
    }
  })

  if (!project) return notFound()

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Editor de Mapa: {project.name}</h1>
          <p className="text-sm text-gray-500">Haz clic en los polígonos del SVG para definirlos como lotes.</p>
        </div>
        <a href="/admin" className="text-blue-600 hover:underline">← Volver</a>
      </header>

      <main className="flex-1 overflow-hidden relative">
        <SvgEditorClient project={project} />
      </main>
    </div>
  )
}
