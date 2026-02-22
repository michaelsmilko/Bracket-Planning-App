"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { BracketData } from "@/lib/bracket";
import { getChampionOptionIndex, getOptionRoundEliminated } from "@/lib/bracket";

type Submission = {
  id: string;
  bracketId: string;
  nickname?: string;
  picks: number[];
  submittedAt: string;
};

export default function ResultsPage() {
  const params = useParams();
  const id = params.id as string;
  const [bracket, setBracket] = useState<BracketData | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`/api/brackets/${id}`).then((r) => (r.ok ? r.json() : Promise.reject(new Error("Not found")))),
      fetch(`/api/brackets/${id}/submissions`).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([b, s]) => {
        setBracket(b);
        setSubmissions(s);
      })
      .catch(() => setError("Could not load results"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <p className="text-slate-400">Loading…</p>
      </main>
    );
  }
  if (error || !bracket) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-red-400 mb-4">{error || "Not found"}</p>
        <Link href="/" className="text-[var(--accent)]">Go home</Link>
      </main>
    );
  }

  const championCounts: Record<number, number> = {};
  const pointsTotal: Record<number, number> = {};
  bracket.options.forEach((_, i) => {
    championCounts[i] = 0;
    pointsTotal[i] = 0;
  });
  submissions.forEach((sub) => {
    const champ = getChampionOptionIndex(bracket, sub.picks);
    if (champ != null) championCounts[champ] = (championCounts[champ] ?? 0) + 1;
    bracket.options.forEach((_, i) => {
      pointsTotal[i] = (pointsTotal[i] ?? 0) + getOptionRoundEliminated(bracket, sub.picks, i);
    });
  });

  const rankedByChampion = bracket.options
    .map((opt, i) => ({ option: opt, index: i, count: championCounts[i] ?? 0 }))
    .sort((a, b) => b.count - a.count);

  const rankedByPoints = bracket.options
    .map((opt, i) => ({ option: opt, index: i, points: pointsTotal[i] ?? 0 }))
    .sort((a, b) => b.points - a.points);

  return (
    <main className="min-h-screen p-6 max-w-md mx-auto">
      <Link href={`/r/${id}`} className="text-slate-400 text-sm mb-4 inline-block">
        ← Back to bracket
      </Link>
      <h1 className="text-xl font-bold mb-1">{bracket.title}</h1>
      <p className="text-slate-400 text-sm mb-6">
        {submissions.length} {submissions.length === 1 ? "response" : "responses"}
      </p>

      <h2 className="text-sm font-semibold text-slate-300 mb-2">By bracket points</h2>
      <p className="text-slate-500 text-xs mb-3">
        Points = how far each option got in everyone&apos;s bracket (champion = most, first-round exit = 0).
      </p>
      <div className="space-y-2 mb-8">
        {rankedByPoints.map((r, i) => (
          <div
            key={`points-${r.option.id}`}
            className="flex items-center justify-between py-3 px-4 rounded-xl bg-[var(--surface)]"
          >
            <span className="font-medium">
              #{i + 1} {r.option.label}
            </span>
            <span className="text-slate-400 text-sm">{r.points} pts</span>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-slate-300 mb-2">By champion picks</h2>
      <p className="text-slate-500 text-xs mb-3">
        How many people had this option as their winner.
      </p>
      <div className="space-y-2 mb-8">
        {rankedByChampion.map((r, i) => (
          <div
            key={`champ-${r.option.id}`}
            className="flex items-center justify-between py-3 px-4 rounded-xl bg-[var(--surface)]"
          >
            <span className="font-medium">
              #{i + 1} {r.option.label}
            </span>
            <span className="text-slate-400 text-sm">
              {r.count} of {submissions.length} {r.count === 1 ? "pick" : "picks"}
            </span>
          </div>
        ))}
      </div>

      <p className="text-slate-400 text-sm mt-8 text-center">
        Share the bracket link so more people can vote.
      </p>
    </main>
  );
}
