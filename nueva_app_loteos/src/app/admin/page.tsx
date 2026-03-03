import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { revalidatePath } from "next/cache"

export default async function AdminPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' }
  })

  async function createProject(formData: FormData) {
    "use server"
    const name = formData.get("name") as string
    if (!name) return
    await prisma.project.create({ data: { name } })
    revalidatePath("/admin")
  }

  return (
    <div className="p-8 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6">Administración de Loteos</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-xl font-semibold mb-4">Crear Nuevo Proyecto</h2>
        <form action={createProject} className="flex gap-4">
          <input
            type="text"
            name="name"
            placeholder="Ej: Portofino Etapa 2"
            className="border p-2 rounded flex-1 text-black"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Crear Proyecto
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Proyectos Existentes</h2>
        {projects.length === 0 ? (
          <p className="text-gray-500">No hay proyectos todavía.</p>
        ) : (
          <ul className="divide-y">
            {projects.map(proj => (
              <li key={proj.id} className="py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-lg text-black">{proj.name}</h3>
                  <p className="text-sm text-gray-500">
                    Creado: {proj.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link href={`/admin/projects/${proj.id}/edit-map`} className="text-blue-600 hover:underline">
                    Editar Mapa (SVG)
                  </Link>
                  <Link href={`/admin/projects/${proj.id}/data`} className="text-blue-600 hover:underline">
                    Ver/Editar Datos
                  </Link>
                  <Link href={`/public/${proj.id}`} target="_blank" className="text-green-600 font-medium hover:underline ml-2">
                    Ver Mapa Público ↗
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
