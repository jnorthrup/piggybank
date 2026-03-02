import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    let userRegion = "US";

    if (session) {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { region: true },
      });
      if (user?.region) {
        userRegion = user.region;
      }
    }

    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { region: null },
          { region: userRegion },
        ],
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Categories error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}