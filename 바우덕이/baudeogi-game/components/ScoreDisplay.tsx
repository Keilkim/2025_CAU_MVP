"use client";

import { GameState } from "@/lib/gameEngine";

interface ScoreDisplayProps {
  state: GameState;
}

export default function ScoreDisplay({ state }: ScoreDisplayProps) {
  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-start text-white z-10">
      {/* 점수 */}
      <div className="text-left">
        <div className="text-sm opacity-70">SCORE</div>
        <div className="text-3xl font-bold">{Math.floor(state.score)}</div>
      </div>

      {/* 콤보 */}
      <div className="text-center">
        {state.combo > 0 && (
          <>
            <div className="text-4xl font-bold text-yellow-400">
              {state.combo}
            </div>
            <div className="text-sm opacity-70">COMBO</div>
          </>
        )}
      </div>

      {/* 판정 카운트 */}
      <div className="text-right text-sm">
        <div className="text-cyan-400">Perfect: {state.perfectCount}</div>
        <div className="text-green-400">Good: {state.goodCount}</div>
        <div className="text-red-400">Miss: {state.missCount}</div>
      </div>
    </div>
  );
}
