import Link from "next/link";

/** /r with no id shows this instead of 404. */
export default function RRootPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-xl font-bold mb-2">Missing bracket link</h1>
      <p className="text-slate-400 mb-6">
        Use the full link the organizer shared (e.g. …/r/abc123). This page is just /r.
      </p>
      <Link href="/" className="primary max-w-xs">
        Go home
      </Link>
    </main>
  );
}
