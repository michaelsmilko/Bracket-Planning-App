import { NextRequest, NextResponse } from "next/server";
import { getBracket, getSubmissionsForBracket } from "@/lib/store";

export const dynamic = "force-dynamic";

function respondSubmissions(submissions: Awaited<ReturnType<typeof getSubmissionsForBracket>>) {
  console.log("[submissions] count=%d", submissions.length);
  const res = NextResponse.json(submissions);
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  res.headers.set("X-Submissions-Count", String(submissions.length));
  return res;
}

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
  return respondSubmissions(submissions);
}

/** POST avoids any GET caching (browser, CDN). Use this from the results page. */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bracket = await getBracket(id);
  if (!bracket) {
    return NextResponse.json({ error: "Bracket not found." }, { status: 404 });
  }
  const submissions = await getSubmissionsForBracket(id);
  return respondSubmissions(submissions);
}
