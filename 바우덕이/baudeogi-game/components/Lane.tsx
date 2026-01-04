"use client";

import { memo } from "react";
import Image from "next/image";

interface LaneProps {
  index: number;
  keyLabel: string;
  instrumentName: string;
  isPressed: boolean;
}

const LANE_COLORS = [
  { border: "border-yellow-500", bg: "bg-yellow-500/30" },
  { border: "border-orange-500", bg: "bg-orange-500/30" },
  { border: "border-red-500", bg: "bg-red-500/30" },
  { border: "border-amber-400", bg: "bg-amber-400/30" },
];

const Lane = memo(function Lane({ index, keyLabel, isPressed }: LaneProps) {
  const colors = LANE_COLORS[index];

  return (
    <div
      className={`relative flex-1 border-x ${colors.border} ${
        isPressed ? colors.bg : "bg-black/20"
      } transition-colors duration-50`}
    >
      {/* 하단 히트 영역 - 악기 이미지 + 키 */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-28
          flex flex-col items-center justify-center
          border-t-4 ${colors.border} transition-all duration-50
          ${isPressed ? "scale-105 brightness-125" : ""}`}
      >
        {/* 악기 이미지 */}
        <div className="relative w-16 h-16 mb-1">
          <Image
            src={`/images/note_${index}.png`}
            alt="instrument"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* 키 */}
        <div className={`text-lg font-bold ${isPressed ? "text-white" : "text-white/60"}`}>
          {keyLabel}
        </div>
      </div>
    </div>
  );
});

export default Lane;
