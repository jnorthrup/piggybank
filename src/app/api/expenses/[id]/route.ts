import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { amount, description, categoryId, date, receiptUrl } = await request.json();

    const existing = await prisma.expense.findFirst({
      where: { id, userId: session.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        ...(amount !== undefined && { amount: parseFloat(amount) }),
        ...(description !== undefined && { description }),
        ...(categoryId !== undefined && { categoryId }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(receiptUrl !== undefined && { receiptUrl }),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Update expense error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.expense.findFirst({
      where: { id, userId: session.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    await prisma.expense.delete({ where: { id } });

    return NextResponse.json({ message: "Expense deleted" });
  } catch (error) {
    console.error("Delete expense error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}