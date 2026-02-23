"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { BracketData } from "@/lib/bracket";
import {
  getChampionOptionIndex,
  getOptionRoundEliminated,
  getRankedListPointsForOption,
} from "@/lib/bracket";

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
      fetch(`/api/brackets/${id}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
        cache: "no-store",
      }).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([b, s]) => {
        setBracket(b);
        setSubmissions(Array.isArray(s) ? s : []);
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

  const isRankedList = bracket.type === "ranked_list";
  const n = bracket.options.length;
  const championCounts: Record<number, number> = {};
  const pointsTotal: Record<number, number> = {};
  const rankCounts: Record<number, Record<number, number>> = {};
  bracket.options.forEach((_, i) => {
    championCounts[i] = 0;
    pointsTotal[i] = 0;
    rankCounts[i] = {};
    for (let r = 0; r < n; r++) rankCounts[i][r] = 0;
  });
  submissions.forEach((sub) => {
    if (isRankedList) {
      bracket.options.forEach((_, optIdx) => {
        pointsTotal[optIdx] = (pointsTotal[optIdx] ?? 0) + getRankedListPointsForOption(n, sub.picks, optIdx);
        const rank = sub.picks.indexOf(optIdx);
        if (rank >= 0) rankCounts[optIdx][rank] = (rankCounts[optIdx][rank] ?? 0) + 1;
      });
    } else {
      const champ = getChampionOptionIndex(bracket, sub.picks);
      if (champ != null) championCounts[champ] = (championCounts[champ] ?? 0) + 1;
      bracket.options.forEach((_, i) => {
        pointsTotal[i] = (pointsTotal[i] ?? 0) + getOptionRoundEliminated(bracket, sub.picks, i);
      });
    }
  });
  const rankedByPoints = bracket.options
    .map((opt, i) => ({ option: opt, index: i, points: pointsTotal[i] ?? 0 }))
    .sort((a, b) => b.points - a.points);
  const rankedByChampion = bracket.options
    .map((opt, i) => ({
      option: opt,
      index: i,
      count: isRankedList ? (rankCounts[i]?.[0] ?? 0) : (championCounts[i] ?? 0),
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <main className="min-h-screen p-6 max-w-md mx-auto">
      <Link href={`/r/${id}`} className="text-slate-400 text-sm mb-4 inline-block">
        ← Back to {isRankedList ? "ranking" : "bracket"}
      </Link>
      <h1 className="text-xl font-bold mb-1">{bracket.title}</h1>
      <p className="text-slate-400 text-sm mb-6">
        Scoreboard · {submissions.length} {submissions.length === 1 ? "response" : "responses"} total
      </p>
      {submissions.length === 1 && (
        <p className="text-amber-600/90 text-xs mb-4 rounded-lg bg-amber-500/10 p-3">
          Only one response loaded. If others have submitted, try a hard refresh (Cmd+Shift+R or Ctrl+Shift+R) or open the results link in a private window.
        </p>
      )}

      <h2 className="text-sm font-semibold text-slate-300 mb-2">Points (cumulative)</h2>
      <p className="text-slate-500 text-xs mb-3">
        {isRankedList
          ? "1st place = " + n + " pts, 2nd = " + (n - 1) + ", … last = 1. Totals below."
          : "Total points from everyone's brackets. Higher = option went further across all picks."}
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

      {isRankedList ? (
        <h2 className="text-sm font-semibold text-slate-300 mb-2">How many put each option 1st</h2>
      ) : (
        <h2 className="text-sm font-semibold text-slate-300 mb-2">Champion picks (cumulative)</h2>
      )}
      <p className="text-slate-500 text-xs mb-3">
        {isRankedList
          ? "Number of people who ranked this option first."
          : "How many people had this option as their winner."}
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
              {isRankedList
                ? (rankCounts[r.index]?.[0] ?? 0) + " of " + submissions.length + " had 1st"
                : r.count + " of " + submissions.length + " " + (r.count === 1 ? "pick" : "picks")}
            </span>
          </div>
        ))}
      </div>

      <p className="text-slate-400 text-sm mt-8 text-center">
        Share the link so more people can vote.
      </p>
    </main>
  );
}
