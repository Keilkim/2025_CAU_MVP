"use client";

import { useEffect, useState } from "react";
import { JudgeResult } from "@/lib/gameEngine";

interface JudgeEffectProps {
  result: JudgeResult;
  lane: number;
}

const JUDGE_COLORS = {
  perfect: "text-cyan-400",
  good: "text-green-400",
  miss: "text-red-400",
};

const JUDGE_TEXT = {
  perfect: "PERFECT!",
  good: "GOOD",
  miss: "MISS",
};

export default function JudgeEffect({ result, lane }: JudgeEffectProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!result || !visible) return null;

  return (
    <div
      className={`absolute text-2xl font-bold ${JUDGE_COLORS[result]}
        animate-bounce pointer-events-none z-20`}
      style={{
        left: `calc(${lane * 25}% + 12.5%)`,
        bottom: "30%",
        transform: "translateX(-50%)",
      }}
    >
      {JUDGE_TEXT[result]}
    </div>
  );
}
