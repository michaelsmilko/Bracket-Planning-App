import { NextRequest, NextResponse } from "next/server";
import { getBracket, getSubmissionsForBracket } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bracket = await getBracket(id);
  if (!bracket) {
    return NextResponse.json({ error: "Bracket not found." }, { status: 404 });
  }
  const submissions = await getSubmissionsForBracket(id);
  const res = NextResponse.json(submissions);
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return res;
}
