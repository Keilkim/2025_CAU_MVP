"use client";

import Link from "next/link";
import { beatmaps } from "@/lib/beatmap";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* 타이틀 */}
      <div className="text-center mb-12">
        {/* 캐릭터 이미지 플레이스홀더 */}
        <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-amber-700/50 border-4 border-amber-500 flex items-center justify-center overflow-hidden">
          <img
            src="/images/character.png"
            alt="바우덕이"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).nextElementSibling!.classList.remove("hidden");
            }}
          />
          <span className="text-6xl hidden">🥁</span>
        </div>

        <h1 className="text-5xl font-bold text-amber-200 mb-2">바우덕이</h1>
        <p className="text-xl text-amber-400">리듬 게임</p>
        <p className="text-sm text-amber-600 mt-2">
          조선 최고의 예인과 함께 장단을 맞춰보세요!
        </p>
      </div>

      {/* 곡 선택 */}
      <div className="w-full max-w-md space-y-4">
        <h2 className="text-xl text-amber-300 text-center mb-4">곡 선택</h2>

        {beatmaps.map((beatmap) => (
          <Link
            key={beatmap.id}
            href={`/game?song=${beatmap.id}`}
            className="block w-full p-4 bg-amber-800/50 hover:bg-amber-700/50
              border-2 border-amber-600 rounded-xl transition-all
              hover:scale-105 hover:border-amber-400"
          >
            <div className="text-xl font-bold text-amber-200">
              {beatmap.title}
            </div>
            <div className="text-sm text-amber-400">{beatmap.artist}</div>
            <div className="text-xs text-amber-600 mt-1">
              BPM: {beatmap.bpm} | 노트: {beatmap.notes.length}개
            </div>
          </Link>
        ))}
      </div>

      {/* 조작 안내 */}
      <div className="mt-12 text-center text-amber-500/80 text-sm">
        <p className="mb-2">키보드: D F J K</p>
        <p>모바일: 하단 터치 버튼</p>
      </div>
    </main>
  );
}
