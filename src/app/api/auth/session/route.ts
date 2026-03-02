import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ user: null, authenticated: false });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, name: true, region: true, currency: true, createdAt: true },
    });

    return NextResponse.json({ user, authenticated: !!user });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ user: null, authenticated: false });
  }
}