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
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    let dateFilter = {};
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      dateFilter = {
        date: {
          gte: startDate,
          lte: endDate,
        },
      };
    }

    const expenses = await prisma.expense.findMany({
      where: {
        userId: session.userId,
        ...dateFilter,
      },
      include: {
        category: true,
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Get expenses error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, description, categoryId, date, receiptUrl } = await request.json();

    if (!amount || !categoryId || !date) {
      return NextResponse.json({ error: "Amount, category, and date are required" }, { status: 400 });
    }

    const expense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        description: description || null,
        categoryId,
        date: new Date(date),
        receiptUrl: receiptUrl || null,
        userId: session.userId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("Create expense error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}