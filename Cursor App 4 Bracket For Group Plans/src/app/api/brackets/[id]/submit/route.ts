import { NextRequest, NextResponse } from "next/server";
import { getBracket, addSubmission } from "@/lib/store";
import { isPicksComplete } from "@/lib/bracket";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bracket = await getBracket(id);
  if (!bracket) {
    return NextResponse.json({ error: "Bracket not found." }, { status: 404 });
  }
  try {
    const body = await request.json();
    const { picks, nickname } = body;
    if (!Array.isArray(picks)) {
      return NextResponse.json(
        { error: "Need picks array." },
        { status: 400 }
      );
    }
    const picksArr = picks as (number | null)[];
    if (!isPicksComplete(bracket, picksArr)) {
      return NextResponse.json(
        { error: "Incomplete bracket." },
        { status: 400 }
      );
    }
    const submission = await addSubmission(id, picksArr as number[], nickname);
    return NextResponse.json({ id: submission.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to submit." },
      { status: 500 }
    );
  }
}
