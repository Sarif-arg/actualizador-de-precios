import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const data = await req.json()
    const { id } = await params

    // Upsert to handle updates if the path already exists
    const lot = await prisma.lot.upsert({
      where: {
        projectId_svgPathId: {
          projectId: id,
          svgPathId: data.svgPathId
        }
      },
      update: {
        sector: data.sector,
        numero: data.numero,
      },
      create: {
        projectId: id,
        svgPathId: data.svgPathId,
        sector: data.sector,
        numero: data.numero,
        estado: data.estado || "Disponible"
      }
    })

    return NextResponse.json(lot)
  } catch (error) {
    return NextResponse.json({ error: "Failed to save lot" }, { status: 500 })
  }
}
