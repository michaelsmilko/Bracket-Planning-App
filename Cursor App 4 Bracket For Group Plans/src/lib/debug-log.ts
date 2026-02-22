/** Append one NDJSON line to .cursor/debug.log for server-side debug (Node only). */
export function debugLog(payload: { location: string; message: string; data?: Record<string, unknown>; hypothesisId?: string }) {
  try {
    const fs = require("fs");
    const path = require("path");
    const dir = path.join(process.cwd(), ".cursor");
    const logPath = path.join(dir, "debug.log");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const line = JSON.stringify({ ...payload, timestamp: Date.now() }) + "\n";
    fs.appendFileSync(logPath, line);
  } catch (_) {}
}
