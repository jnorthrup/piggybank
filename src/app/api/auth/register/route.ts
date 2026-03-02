import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/auth";

const VALID_REGIONS = ["US", "INDONESIA", "SINGAPORE", "EUROPE", "AUSTRALIA"];

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, region, currency } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    if (await findUserByEmail(email)) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const validRegion = VALID_REGIONS.includes(region) ? region : "US";
    const validCurrency = currency || "USD";

    const user = await createUser(email, password, name, validRegion, validCurrency);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}