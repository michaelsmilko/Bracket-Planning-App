/**
 * Bracket structure: build matchups from a list of options.
 * Pads to next power of 2 with "Bye"; each matchup is (optionIndex | bye) vs (optionIndex | bye).
 */

export type Option = { id: string; label: string };
export type Bye = { bye: true };
export type Slot = Option | Bye;

export type Matchup = {
  index: number;
  round: number;
  /** For round 0: slot indices (0..numSlots-1; slot >= options.length = bye). For round > 0: matchup indices. */
  left: number;
  right: number;
};

export type PollType = "bracket" | "ranked_list";

export type BracketData = {
  id: string;
  title: string;
  options: Option[];
  matchups: Matchup[];  // in display order (round 0 first, then 1, ...); empty for ranked_list
  type?: PollType;      // default 'bracket'
};

const BYE = -1;

/** Next power of 2 >= n */
function nextPower2(n: number): number {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

/**
 * Build round-0 matchups: pair (0,1), (2,3), ... with options padded by BYE.
 * options length might be 6 → pad to 8, so indices 0..5 are options, 6,7 are BYE.
 */
function buildRound0Matchups(numSlots: number): Matchup[] {
  const matchups: Matchup[] = [];
  for (let i = 0; i < numSlots; i += 2) {
    matchups.push({
      index: matchups.length,
      round: 0,
      left: i,
      right: i + 1,
    });
  }
  return matchups;
}

/**
 * Build subsequent rounds. Round 1: winner of 0 vs winner of 1, winner of 2 vs winner of 3, ...
 * We don't store "winner of" in the matchup—we only need the count of matchups per round.
 * When displaying, we'll use the user's picks to resolve "winner of matchup i".
 * So we need matchups in order: [r0_0, r0_1, ..., r1_0, r1_1, ..., r2_0].
 * Each matchup after round 0 is (leftMatchupIndex, rightMatchupIndex).
 */
function buildBracketMatchups(numRound0Matchups: number): Matchup[] {
  const round0 = buildRound0Matchups(numRound0Matchups * 2); // numSlots = 2 * numRound0Matchups
  const all: Matchup[] = [...round0];
  let prevRoundCount = round0.length;
  let prevStart = 0;
  let round = 1;

  while (prevRoundCount > 1) {
    const roundStart = all.length;
    for (let i = 0; i < prevRoundCount; i += 2) {
      all.push({
        index: all.length,
        round,
        left: prevStart + i,     // matchup index (winner = user's pick)
        right: prevStart + i + 1,
      } as Matchup);
    }
    prevRoundCount = prevRoundCount / 2;
    prevStart = roundStart;
    round++;
  }

  return all;
}

/**
 * Build full bracket: options padded to next power of 2 (with "bye" slots),
 * and matchups in display order.
 * Option indices in round-0 matchups refer to a padded "slots" array: [opt0, opt1, ..., bye, bye].
 */
export function buildBracket(id: string, title: string, options: Option[]): BracketData {
  const n = options.length;
  if (n < 2) throw new Error("Need at least 2 options");
  const numSlots = nextPower2(n);
  const numByes = numSlots - n;
  // Slots: indices 0..n-1 are options, n..numSlots-1 are byes (we use index -1 or a sentinel in matchups).
  // Actually we store options and pad with "bye" conceptually. In round-0 matchups we use indices 0..numSlots-1.
  // Option indices 0..n-1 are real; n..numSlots-1 we treat as bye. So in Matchup we use left/right as slot index;
  // when slot index >= n it's a bye.
  const numRound0Matchups = numSlots / 2;
  const matchups = buildBracketMatchups(numRound0Matchups);
  // Fix round-0 matchups: left/right are slot indices (0..numSlots-1). We need to ensure we don't reference
  // option index out of bounds. Our round0 build used left: i, right: i+1 for i = 0,2,4,... so indices go 0..numSlots-1.
  // Options array has length n. So slot indices >= n are byes. We'll use a convention: in Matchup, left/right are
  // slot indices. When resolving label, if index >= options.length it's a bye.
  return {
    id,
    title,
    options,
    matchups,
  };
}

/** Get option label for a slot index (round 0). Slot index may be >= options.length = bye. */
export function getSlotLabel(options: Option[], slotIndex: number): string {
  if (slotIndex < 0 || slotIndex >= options.length) return "Bye";
  return options[slotIndex].label;
}

/** Get the two option labels for a matchup (from options or from picks for later rounds). */
export function getMatchupOptionsFromPicks(
  bracket: BracketData,
  matchup: Matchup,
  picks: (number | null)[]
): [string, string] {
  if (matchup.round === 0) {
    return [
      getSlotLabel(bracket.options, matchup.left),
      getSlotLabel(bracket.options, matchup.right),
    ];
  }
  return [
    resolveWinnerToLabel(bracket, matchup.left, picks),
    resolveWinnerToLabel(bracket, matchup.right, picks),
  ];
}

/** Resolve matchup index to the winning option label (recursively). */
function resolveWinnerToLabel(bracket: BracketData, matchupIndex: number, picks: (number | null)[]): string {
  const winner = picks[matchupIndex];
  if (winner == null) return "?";
  const matchup = bracket.matchups[matchupIndex];
  if (matchup.round === 0) {
    return getSlotLabel(bracket.options, winner);
  }
  return resolveWinnerToLabel(bracket, winner, picks);
}

/** Return the two valid "pick" values for this matchup (for round 0: left or right slot; for round > 0: left or right matchup index). */
export function getValidPickValues(matchup: Matchup, optionsLength: number): [number, number] {
  if (matchup.round === 0) {
    const leftBye = matchup.left >= optionsLength;
    const rightBye = matchup.right >= optionsLength;
    if (leftBye) return [matchup.right, matchup.right];
    if (rightBye) return [matchup.left, matchup.left];
  }
  return [matchup.left, matchup.right];
}

/** Get the champion option index from a full picks array (last matchup winner). */
export function getChampionOptionIndex(bracket: BracketData, picks: (number | null)[]): number | null {
  const lastMatchup = bracket.matchups[bracket.matchups.length - 1];
  if (!lastMatchup) return null;
  const winner = picks[lastMatchup.index];
  if (winner == null) return null;
  if (lastMatchup.round === 0) return winner;
  return getChampionOptionIndexFromMatchup(bracket, winner, picks);
}

function getChampionOptionIndexFromMatchup(bracket: BracketData, matchupIndex: number, picks: (number | null)[]): number | null {
  const matchup = bracket.matchups[matchupIndex];
  const winner = picks[matchupIndex];
  if (winner == null) return null;
  if (matchup.round === 0) return winner;
  return getChampionOptionIndexFromMatchup(bracket, winner, picks);
}

/** Validate that picks are complete (every matchup has a valid winner). */
export function isPicksComplete(bracket: BracketData, picks: (number | null)[]): boolean {
  for (const m of bracket.matchups) {
    const w = picks[m.index];
    if (w == null) return false;
    if (m.round === 0) {
      if (w !== m.left && w !== m.right) return false;
    } else {
      if (w !== m.left && w !== m.right) return false;
    }
  }
  return true;
}

/** Get the option index (0..options.length-1) that won this matchup. */
export function getWinnerOptionIndex(
  bracket: BracketData,
  picks: (number | null)[],
  matchupIndex: number
): number | null {
  const matchup = bracket.matchups[matchupIndex];
  if (!matchup) return null;
  const winner = picks[matchupIndex];
  if (winner == null) return null;
  if (matchup.round === 0) {
    if (winner >= bracket.options.length) {
      return matchup.left < bracket.options.length ? matchup.left : matchup.right;
    }
    return winner;
  }
  return getWinnerOptionIndex(bracket, picks, winner);
}

/**
 * Get the round (0-based) where this option was eliminated.
 * Champion = last round number (so they get max points). First-round exit = 0.
 */
export function getOptionRoundEliminated(
  bracket: BracketData,
  picks: (number | null)[],
  optionIndex: number
): number {
  const numRounds =
    bracket.matchups.length === 0 ? 0 : Math.max(...bracket.matchups.map((m) => m.round)) + 1;
  for (const matchup of bracket.matchups) {
    let leftOpt: number | null;
    let rightOpt: number | null;
    if (matchup.round === 0) {
      leftOpt = matchup.left < bracket.options.length ? matchup.left : null;
      rightOpt = matchup.right < bracket.options.length ? matchup.right : null;
    } else {
      leftOpt = getWinnerOptionIndex(bracket, picks, matchup.left);
      rightOpt = getWinnerOptionIndex(bracket, picks, matchup.right);
    }
    if (leftOpt !== optionIndex && rightOpt !== optionIndex) continue;
    const winnerOpt = getWinnerOptionIndex(bracket, picks, matchup.index);
    if (winnerOpt === optionIndex) {
      if (matchup.round === numRounds - 1) return numRounds;
      continue;
    }
    return matchup.round;
  }
  return numRounds;
}

// --- Ranked list (order the options; 1st = N pts, 2nd = N-1, ..., last = 1) ---

/** Picks for ranked list: [optionIndex1st, optionIndex2nd, ...], length = options.length, each 0..n-1 once. */
export function isRankedListPicksComplete(optionsLength: number, picks: (number | null)[]): boolean {
  if (picks.length !== optionsLength) return false;
  const seen = new Set<number>();
  for (const p of picks) {
    if (p == null || p < 0 || p >= optionsLength || seen.has(p)) return false;
    seen.add(p);
  }
  return seen.size === optionsLength;
}

/** Points for one ranked-list submission: option at rank r (0-based) gets (n - r) points. */
export function getRankedListPointsForOption(
  optionsLength: number,
  picks: number[],
  optionIndex: number
): number {
  const rank = picks.indexOf(optionIndex);
  if (rank < 0) return 0;
  return optionsLength - rank;
}

