export type JudgeResult = "perfect" | "good" | "miss" | null;

export interface Note {
  id: string;
  lane: number; // 0-3 (D, F, J, K)
  time: number; // ms from song start
  hit: boolean;
}

export interface GameState {
  score: number;
  combo: number;
  maxCombo: number;
  perfectCount: number;
  goodCount: number;
  missCount: number;
  isPlaying: boolean;
  currentTime: number;
}

// 판정 범위 (ms)
const PERFECT_WINDOW = 50;
const GOOD_WINDOW = 100;

export const LANE_KEYS = ["d", "f", "j", "k"];

export function createInitialState(): GameState {
  return {
    score: 0,
    combo: 0,
    maxCombo: 0,
    perfectCount: 0,
    goodCount: 0,
    missCount: 0,
    isPlaying: false,
    currentTime: 0,
  };
}

export function judgeNote(
  noteTime: number,
  hitTime: number
): JudgeResult {
  const diff = Math.abs(noteTime - hitTime);

  if (diff <= PERFECT_WINDOW) {
    return "perfect";
  } else if (diff <= GOOD_WINDOW) {
    return "good";
  }
  return null;
}

export function calculateScore(
  state: GameState,
  result: JudgeResult
): GameState {
  const newState = { ...state };

  switch (result) {
    case "perfect":
      newState.score += 100 * (1 + state.combo * 0.1);
      newState.combo += 1;
      newState.perfectCount += 1;
      break;
    case "good":
      newState.score += 50 * (1 + state.combo * 0.05);
      newState.combo += 1;
      newState.goodCount += 1;
      break;
    case "miss":
      newState.combo = 0;
      newState.missCount += 1;
      break;
  }

  if (newState.combo > newState.maxCombo) {
    newState.maxCombo = newState.combo;
  }

  return newState;
}

export function getGrade(state: GameState): string {
  const total = state.perfectCount + state.goodCount + state.missCount;
  if (total === 0) return "N/A";

  const accuracy = (state.perfectCount * 100 + state.goodCount * 50) / (total * 100);

  if (accuracy >= 0.95) return "S";
  if (accuracy >= 0.9) return "A";
  if (accuracy >= 0.8) return "B";
  if (accuracy >= 0.7) return "C";
  return "D";
}
