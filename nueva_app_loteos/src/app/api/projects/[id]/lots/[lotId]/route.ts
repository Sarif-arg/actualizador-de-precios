import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string, lotId: string }> }
) {
  try {
    const { lotId } = await params
    await prisma.lot.delete({
      where: { id: lotId }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete lot" }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string, lotId: string }> }
) {
  try {
    const { lotId } = await params
    const body = await req.json()

    // Solo permitimos editar campos específicos
    const {
      sector, numero, estado, superficie, precio_contado, fecha_entrega,
      plan1_nombre, plan1_entrega, plan1_cuotas, plan1_precio_final,
      plan2_nombre, plan2_entrega, plan2_cuotas, plan2_precio_final
    } = body

    const updatedLot = await prisma.lot.update({
      where: { id: lotId },
      data: {
        sector, numero, estado, superficie, precio_contado, fecha_entrega,
        plan1_nombre, plan1_entrega, plan1_cuotas, plan1_precio_final,
        plan2_nombre, plan2_entrega, plan2_cuotas, plan2_precio_final
      }
    })

    return NextResponse.json(updatedLot)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update lot" }, { status: 500 })
  }
}
