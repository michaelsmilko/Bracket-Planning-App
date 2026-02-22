"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { BracketData } from "@/lib/bracket";
import {
  getMatchupOptionsFromPicks,
  getValidPickValues,
  isPicksComplete,
} from "@/lib/bracket";

const STORAGE_KEY = "bracket-picks";

export default function VotePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const share = searchParams.get("share") === "1";

  const [bracket, setBracket] = useState<BracketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [picks, setPicks] = useState<(number | null)[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const url = `/api/brackets/${id}`;
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/f85f75b9-730e-41fc-aa08-db15597b6e47", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "r/[id]/page.tsx useEffect",
        message: "Fetching bracket",
        data: { id, url, idUndefined: id === undefined },
        timestamp: Date.now(),
        hypothesisId: "H3",
      }),
    }).catch(() => {});
    // #endregion
    fetch(url)
      .then((r) => {
        // #region agent log
        if (r.status === 404) {
          fetch("/api/debug-log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "r/[id]/page.tsx fetch response",
              message: "Bracket fetch 404",
              data: { id, status: 404, url },
              hypothesisId: "H2",
            }),
          }).catch(() => {});
        }
        // #endregion
        return r.ok ? r.json() : Promise.reject(new Error("Not found"));
      })
      .then((data) => {
        setBracket(data);
        const len = data.matchups.length;
        const stored = typeof window !== "undefined" ? localStorage.getItem(`${STORAGE_KEY}-${id}`) : null;
        let initial: (number | null)[] = Array(len).fill(null);
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as number[];
            if (Array.isArray(parsed) && parsed.length === len) {
              initial = parsed;
            }
          } catch (_) {}
        }
        setPicks(initial);
        setShowIntro(stored ? false : true);
      })
      .catch(() => setError("Bracket not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const savePicks = useCallback(
    (next: (number | null)[]) => {
      setPicks(next);
      if (typeof window !== "undefined") {
        localStorage.setItem(`${STORAGE_KEY}-${id}`, JSON.stringify(next));
      }
    },
    [id]
  );

  const currentMatchupIndex = picks.findIndex((p) => p == null);
  const currentMatchup =
    bracket && currentMatchupIndex >= 0 && currentMatchupIndex < bracket.matchups.length
      ? bracket.matchups[currentMatchupIndex]
      : null;
  const complete = bracket ? isPicksComplete(bracket, picks) : false;

  const handlePick = (value: number) => {
    if (!bracket || !currentMatchup) return;
    const next = [...picks];
    next[currentMatchup.index] = value;
    savePicks(next);
  };

  const handleSubmit = async () => {
    if (!bracket || !complete || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/brackets/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ picks }),
      });
      if (!res.ok) throw new Error("Submit failed");
      if (typeof window !== "undefined") {
        localStorage.removeItem(`${STORAGE_KEY}-${id}`);
      }
      setSubmitted(true);
    } catch {
      setError("Failed to submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <p className="text-slate-400">Loading…</p>
      </main>
    );
  }
  if (error && !bracket) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-red-400 mb-4">{error}</p>
        <Link href="/" className="text-[var(--accent)]">
          Go home
        </Link>
      </main>
    );
  }
  if (!bracket) return null;

  const totalMatchups = bracket.matchups.length;
  const completedCount = picks.filter((p) => p != null).length;

  if (submitted) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold mb-2">You're done!</h2>
        <p className="text-slate-400 mb-6">
          The organizer will share the results in the chat.
        </p>
        <Link href={`/r/${id}/results`} className="text-[var(--accent)]">
          See results when they're in
        </Link>
      </main>
    );
  }

  if (showIntro) {
    return (
      <main className="min-h-screen flex flex-col justify-center p-6 max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-2">{bracket.title}</h1>
        <p className="text-slate-400 mb-8">
          You'll see two options at a time. Tap the one you prefer. Keep going until you've picked one winner. Takes a minute.
        </p>
        <button
          type="button"
          onClick={() => setShowIntro(false)}
          className="primary"
        >
          Start
        </button>
      </main>
    );
  }

  if (share) {
    const url = typeof window !== "undefined" ? window.location.origin + window.location.pathname : "";
    return (
      <main className="min-h-screen flex flex-col p-6 max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-2">Share this link</h1>
        <p className="text-slate-400 text-sm mb-4">
          Anyone with the link can fill out their bracket. No sign-in.
        </p>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            readOnly
            className="input flex-1 text-sm"
            value={url}
          />
          <button
            type="button"
            className="primary py-3 px-4 whitespace-nowrap"
            onClick={() => {
              navigator.clipboard.writeText(url);
            }}
          >
            Copy
          </button>
        </div>
        <Link href={`/r/${id}`} className="secondary text-center block mb-6">
          Fill out my bracket
        </Link>
        <Link href={`/r/${id}/results`} className="text-slate-400 text-sm">
          View results →
        </Link>
      </main>
    );
  }

  if (complete) {
    return (
      <main className="min-h-screen flex flex-col justify-center p-6 max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-2">All set</h1>
        <p className="text-slate-400 mb-8">
          You've picked a winner for every matchup. Submit to add your bracket to the results.
        </p>
        <button
          type="button"
          onClick={handleSubmit}
          className="primary"
          disabled={submitting}
        >
          {submitting ? "Submitting…" : "Submit"}
        </button>
        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </main>
    );
  }

  if (!currentMatchup) return null;

  const [labelA, labelB] = getMatchupOptionsFromPicks(bracket, currentMatchup, picks);
  const [valA, valB] = getValidPickValues(currentMatchup, bracket.options.length);
  const isBye = labelA === "Bye" || labelB === "Bye";
  const oneOption = isBye ? (labelA === "Bye" ? valB : valA) : null;

  return (
    <main className="min-h-screen flex flex-col p-6 max-w-md mx-auto">
      <p className="text-slate-400 text-sm mb-4">
        Matchup {completedCount + 1} of {totalMatchups}
      </p>
      <h2 className="text-lg font-semibold mb-6">Pick the winner</h2>
      <div className="flex flex-col gap-3 flex-1">
        {oneOption != null ? (
          <button
            type="button"
            className="primary"
            onClick={() => handlePick(oneOption)}
          >
            {labelA === "Bye" ? labelB : labelA} advances
          </button>
        ) : (
          <>
            <button
              type="button"
              className="secondary"
              onClick={() => handlePick(valA)}
            >
              {labelA}
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => handlePick(valB)}
            >
              {labelB}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
