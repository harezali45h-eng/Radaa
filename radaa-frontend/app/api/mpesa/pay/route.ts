import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, fare, userId, driverId, matatuId, tripId, accountReference, description } =
      body || {};

    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { success: false, error: "phone is required" },
        { status: 400 },
      );
    }

    const cleanedPhone = phone.startsWith("254") ? phone : `254${phone.slice(1)}`;

    const baseUrlRaw =
      process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "";

    if (!baseUrlRaw) {
      return NextResponse.json(
        { success: false, error: "API base URL is not configured" },
        { status: 500 },
      );
    }

    const baseUrl = baseUrlRaw.replace(/\/+$/, "");

    const backendResponse = await fetch(`${baseUrl}/payments/mpesa/fare`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        fare,
        phoneNumber: cleanedPhone,
        matatuId,
        tripId,
        driverId,
        accountReference,
        description,
      }),
    });

    const json = await backendResponse.json().catch(() => ({}));

    return NextResponse.json(json, { status: backendResponse.status });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Failed to initiate Mpesa fare payment",
      },
      { status: 500 },
    );
  }
}
