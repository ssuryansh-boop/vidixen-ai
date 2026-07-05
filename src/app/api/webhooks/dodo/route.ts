import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.text();

  console.log("========== HEADERS ==========");

  for (const [key, value] of req.headers.entries()) {
    console.log(key, value);
  }

  console.log("========== BODY ==========");
  console.log(body);

  return NextResponse.json({ ok: true });
}