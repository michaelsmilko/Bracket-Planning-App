import { NextRequest, NextResponse } from "next/server";
import { debugLog } from "@/lib/debug-log";

/** Client can POST here to append a log line (e.g. when fetch returns 404). */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    debugLog({
      location: body.location ?? "client",
      message: body.message ?? "client log",
      data: body.data,
      hypothesisId: body.hypothesisId,
    });
    return NextResponse.json({ ok: true });
  } catch (_) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
