import { NextRequest, NextResponse } from "next/server";
import { createBracket } from "@/lib/store";
import { debugLog } from "@/lib/debug-log";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, options } = body;
    if (!title || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { error: "Need a title and at least 2 options." },
        { status: 400 }
      );
    }
    const opts = options.map((o: { id?: string; label?: string }) => ({
      id: o.id ?? String(Math.random()).slice(2, 10),
      label: String(o.label ?? "").trim(),
    })).filter((o: { label: string }) => o.label.length > 0);
    if (opts.length < 2) {
      return NextResponse.json(
        { error: "Need at least 2 non-empty options." },
        { status: 400 }
      );
    }
    const bracket = await createBracket(String(title).trim(), opts);
    // #region agent log
    debugLog({
      location: "api/brackets/route.ts POST",
      message: "Bracket created",
      data: { id: bracket.id, status: 200 },
      hypothesisId: "H4",
    });
    // #endregion
    return NextResponse.json({ id: bracket.id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("Create bracket failed:", message);
    if (message.includes("SUPABASE") || message.includes("Missing")) {
      return NextResponse.json(
        { error: "Server config error. Add SUPABASE_URL and SUPABASE_ANON_KEY in Vercel → Settings → Environment Variables, then redeploy." },
        { status: 503 }
      );
    }
    if (message.includes("relation") && message.includes("does not exist")) {
      return NextResponse.json(
        { error: "Database tables missing. Run the SQL in supabase/schema.sql in Supabase → SQL Editor, then try again." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: `Failed to create bracket: ${message}` },
      { status: 500 }
    );
  }
}
