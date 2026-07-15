import { NextResponse } from "next/server";
import { verifyBookingPayment } from "@/lib/actions/events";

export async function POST(request: Request) {
  try {
    const result = await verifyBookingPayment(request);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message ?? "Verification failed.",
      },
      {
        status: error.status ?? 500,
      }
    );
  }
}