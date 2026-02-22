import { NextRequest, NextResponse } from "next/server";
import { getBracket } from "@/lib/store";
import { debugLog } from "@/lib/debug-log";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // #region agent log
  debugLog({
    location: "api/brackets/[id]/route.ts GET",
    message: "GET bracket",
    data: { id, idType: typeof id },
    hypothesisId: "H2",
  });
  // #endregion
  const bracket = await getBracket(id);
  // #region agent log
  debugLog({
    location: "api/brackets/[id]/route.ts GET result",
    message: "GET bracket result",
    data: { id, found: !!bracket, status: bracket ? 200 : 404 },
    hypothesisId: "H2",
  });
  // #endregion
  if (!bracket) {
    return NextResponse.json({ error: "Bracket not found." }, { status: 404 });
  }
  return NextResponse.json(bracket);
}
