import { NextRequest, NextResponse } from "next/server";
import { getBracket, getSubmissionsForBracket } from "@/lib/store";

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
  return NextResponse.json(submissions);
}
