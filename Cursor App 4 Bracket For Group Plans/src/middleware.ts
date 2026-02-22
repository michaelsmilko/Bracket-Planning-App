import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/f85f75b9-730e-41fc-aa08-db15597b6e47", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: "middleware.ts",
      message: "Request path",
      data: { path: request.nextUrl.pathname, method: request.method },
      timestamp: Date.now(),
      hypothesisId: "H1",
    }),
  }).catch(() => {});
  // #endregion
  return NextResponse.next();
}
