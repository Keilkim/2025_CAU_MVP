"use client";

import { memo } from "react";

interface NoteProps {
  lane: number;
  position: number; // 이미 계산된 위치 (0-100%)
}

const LANE_COLORS = [
  "bg-yellow-400 border-yellow-600",   // 꽹과리
  "bg-orange-400 border-orange-600",   // 장구
  "bg-red-500 border-red-700",         // 북
  "bg-amber-300 border-amber-500",     // 소고
];

// memo로 불필요한 리렌더 방지
const Note = memo(function Note({ lane, position }: NoteProps) {
  return (
    <div
      className={`absolute h-4 rounded-sm ${LANE_COLORS[lane]} border-2 shadow-md`}
      style={{
        left: `${lane * 25 + 2}%`,
        width: "21%",
        top: `${position}%`,
      }}
    />
  );
});

export default Note;
