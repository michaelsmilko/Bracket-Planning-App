import { nanoid } from "nanoid";
import type { BracketData, PollType } from "./bracket";
import { buildBracket } from "./bracket";
import { getSupabase } from "./supabase";

export type Submission = {
  id: string;
  bracketId: string;
  nickname?: string;
  picks: number[];
  submittedAt: string;
};

export async function createBracket(
  title: string,
  options: { id: string; label: string }[],
  type: PollType = "bracket"
): Promise<BracketData> {
  const id = nanoid(8);
  const bracket: BracketData =
    type === "ranked_list"
      ? { id, title, options, matchups: [], type: "ranked_list" }
      : buildBracket(id, title, options);
  const supabase = getSupabase();
  const { error } = await supabase.from("brackets").insert({
    id: bracket.id,
    title: bracket.title,
    options: bracket.options,
    matchups: bracket.matchups,
    type: bracket.type ?? "bracket",
  });
  if (error) throw new Error(error.message);
  return bracket;
}

export async function getBracket(id: string): Promise<BracketData | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("brackets")
    .select("id, title, options, matchups, type")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  const type = (data.type as PollType) ?? "bracket";
  return {
    id: data.id,
    title: data.title,
    options: data.options as BracketData["options"],
    matchups: (data.matchups as BracketData["matchups"]) ?? [],
    type,
  };
}

export async function getSubmissionsForBracket(bracketId: string): Promise<Submission[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("submissions")
    .select("id, bracket_id, nickname, picks, submitted_at")
    .eq("bracket_id", bracketId)
    .order("submitted_at", { ascending: true })
    .limit(1000);
  if (error) return [];
  return (data ?? []).map((row) => ({
    id: row.id,
    bracketId: row.bracket_id,
    nickname: row.nickname ?? undefined,
    picks: row.picks as number[],
    submittedAt: row.submitted_at,
  }));
}

export async function addSubmission(
  bracketId: string,
  picks: number[],
  nickname?: string
): Promise<Submission> {
  const bracket = await getBracket(bracketId);
  if (!bracket) throw new Error("Bracket not found");
  const submission: Submission = {
    id: nanoid(8),
    bracketId,
    nickname,
    picks,
    submittedAt: new Date().toISOString(),
  };
  const supabase = getSupabase();
  const { error } = await supabase.from("submissions").insert({
    id: submission.id,
    bracket_id: submission.bracketId,
    nickname: submission.nickname ?? null,
    picks: submission.picks,
    submitted_at: submission.submittedAt,
  });
  if (error) throw new Error(error.message);
  return submission;
}
