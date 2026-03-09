import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import PublicMapClient from "./PublicMapClient"

export default async function PublicProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const project = await prisma.project.findUnique({
    where: { id },
    include: { lots: true }
  })

  if (!project || !project.svgContent) {
    return notFound()
  }

  return (
    <div className="h-screen w-full flex bg-gray-100 overflow-hidden font-sans relative">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <PublicMapClient project={project as { name: string; svgContent: string; lots: any[] }} />
    </div>
  )
}
