import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));
    const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const expenses = await prisma.expense.findMany({
      where: {
        userId: session.userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
    });

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    const categoryMap = new Map<string, { categoryId: string; categoryName: string; icon: string; color: string; total: number; count: number }>();
    
    for (const expense of expenses) {
      const existing = categoryMap.get(expense.categoryId);
      if (existing) {
        existing.total += expense.amount;
        existing.count += 1;
      } else {
        categoryMap.set(expense.categoryId, {
          categoryId: expense.categoryId,
          categoryName: expense.category.name,
          icon: expense.category.icon,
          color: expense.category.color,
          total: expense.amount,
          count: 1,
        });
      }
    }

    const byCategory = Array.from(categoryMap.values()).sort((a, b) => b.total - a.total);

    return NextResponse.json({ total, byCategory });
  } catch (error) {
    console.error("Summary error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}