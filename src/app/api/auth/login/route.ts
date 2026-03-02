import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";
import { createSession, setSessionCookie } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const user = await authenticateUser(email, password);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await createSession(user);
    await setSessionCookie(token);

    return NextResponse.json({ user, message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}