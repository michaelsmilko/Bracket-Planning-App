import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold text-center mb-2">Bracket</h1>
      <p className="text-slate-400 text-center mb-8 max-w-sm">
        Create a bracket, share the link. Friends tap their picks. You get the results.
      </p>
      <Link href="/create" className="primary">
        Create a bracket
      </Link>
    </main>
  );
}
