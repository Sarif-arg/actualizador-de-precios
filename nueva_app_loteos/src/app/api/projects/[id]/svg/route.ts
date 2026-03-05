import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { svgContent } = await req.json()

    const updated = await prisma.project.update({
      where: { id },
      data: { svgContent }
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: "Failed to save SVG" }, { status: 500 })
  }
}
