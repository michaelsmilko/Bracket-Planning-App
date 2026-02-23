"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PRESETS } from "@/lib/presets";

type PollType = "bracket" | "ranked_list";

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState<"choose" | "form">("choose");
  const [pollType, setPollType] = useState<PollType | null>(null);
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addOption = () => setOptions((o) => [...o, ""]);
  const removeOption = (i: number) => setOptions((o) => o.filter((_, j) => j !== i));
  const setOption = (i: number, v: string) =>
    setOptions((o) => o.map((x, j) => (j === i ? v : x)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = options.map((x) => x.trim()).filter(Boolean);
    if (trimmed.length < 2) {
      setError("Add at least 2 options.");
      return;
    }
    if (!title.trim()) {
      setError("Give the bracket a title.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/brackets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          options: trimmed.map((label) => ({ label })),
          type: pollType ?? "bracket",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create bracket");
      }
      const { id } = await res.json();
      // #region agent log
      fetch("http://127.0.0.1:7242/ingest/f85f75b9-730e-41fc-aa08-db15597b6e47", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: "create/page.tsx after create",
          message: "Redirect after create",
          data: { id, redirectTo: `/r/${id}?share=1`, resStatus: res.status },
          timestamp: Date.now(),
          hypothesisId: "H4",
        }),
      }).catch(() => {});
      // #endregion
      router.push(`/r/${id}?share=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (preset: (typeof PRESETS)[0]) => {
    setTitle(preset.name);
    setOptions(preset.options.map((o) => o.label));
  };

  if (step === "choose") {
    return (
      <main className="min-h-screen p-6 max-w-md mx-auto">
        <Link href="/" className="text-slate-400 text-sm mb-6 inline-block">
          ← Back
        </Link>
        <h1 className="text-xl font-bold mb-2">Create a poll</h1>
        <p className="text-slate-400 text-sm mb-8">Choose how people will vote.</p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              setPollType("bracket");
              setStep("form");
            }}
            className="secondary text-left p-4 rounded-xl"
          >
            <span className="font-medium block">Bracket</span>
            <span className="text-slate-400 text-sm">Head-to-head matchups. Pick the winner of each pair until one champion.</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setPollType("ranked_list");
              setStep("form");
            }}
            className="secondary text-left p-4 rounded-xl"
          >
            <span className="font-medium block">Ranked list</span>
            <span className="text-slate-400 text-sm">Put options in order. 1st gets most points, last gets 1.</span>
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 max-w-md mx-auto">
      <button
        type="button"
        onClick={() => setStep("choose")}
        className="text-slate-400 text-sm mb-2 inline-block"
      >
        ← Back
      </button>
      <p className="text-slate-400 text-xs mb-6">
        Type: {pollType === "ranked_list" ? "Ranked list" : "Bracket"}
      </p>
      <h1 className="text-xl font-bold mb-6">
        {pollType === "ranked_list" ? "Create a ranked list" : "Create a bracket"}
      </h1>
      {PRESETS.length > 0 && pollType === "bracket" && (
        <div className="mb-8">
          <p className="text-sm text-slate-400 mb-2">Start from a preset</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => loadPreset(preset)}
                className="py-2 px-4 rounded-xl bg-[var(--surface)] border border-slate-600 text-sm hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Title</label>
          <input
            type="text"
            className="input"
            placeholder="e.g. Rufus Du Sol – which show?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm text-slate-400">Options</label>
            <button
              type="button"
              onClick={addOption}
              className="text-sm text-[var(--accent)]"
            >
              + Add
            </button>
          </div>
          <div className="space-y-2">
            {options.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  className="input flex-1"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => setOption(i, e.target.value)}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    className="px-3 text-slate-400 hover:text-red-400"
                    aria-label="Remove"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" className="primary w-full" disabled={loading}>
          {loading ? "Creating…" : "Create & get link"}
        </button>
      </form>
    </main>
  );
}
