import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { getUserCredits } from "@/lib/credits";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    const credits = await getUserCredits(decoded.uid);

    return NextResponse.json({
      remaining: credits.remaining,
      plan: credits.plan,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}