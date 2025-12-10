import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // Save STK results to DB (later)
  console.log("MPesa Callback:", body);

  return NextResponse.json({ status: "ok" });
}
