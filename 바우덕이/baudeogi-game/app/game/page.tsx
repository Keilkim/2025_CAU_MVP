"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  GameState,
  createInitialState,
  calculateScore,
  getGrade,
  LANE_KEYS,
  Note as NoteType,
} from "@/lib/gameEngine";
import { beatmaps, sampleBeatmap } from "@/lib/beatmap";
import { soundManager, INSTRUMENTS } from "@/lib/sounds";
import Lane from "@/components/Lane";
import Note from "@/components/Note";
import TouchButton from "@/components/TouchButton";
import ScoreDisplay from "@/components/ScoreDisplay";

const NOTE_SPEED = 2000; // 노트가 위에서 판정선까지 내려오는 시간 (ms)
const JUDGE_LINE_POSITION = 80; // 판정선 위치 (%)
const HIT_WINDOW = 150; // 판정 허용 범위 (ms)

function GameContent() {
  const searchParams = useSearchParams();
  const songId = searchParams.get("song") || "sample";
  const beatmap = beatmaps.find((b) => b.id === songId) || sampleBeatmap;

  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [pressedKeys, setPressedKeys] = useState<boolean[]>([false, false, false, false]);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // useRef로 렌더링 최적화
  const currentTimeRef = useRef(0);
  const startTimeRef = useRef(0);
  const animationRef = useRef(0);
  const notesRef = useRef<NoteType[]>([]);
  const hitNotesRef = useRef<Set<string>>(new Set());
  const [renderTrigger, setRenderTrigger] = useState(0);

  // 사운드 초기화
  useEffect(() => {
    soundManager.init();
  }, []);

  const playSound = useCallback((laneIndex: number) => {
    soundManager.play(laneIndex);
  }, []);

  const startGame = useCallback(() => {
    setCountdown(3);
  }, []);

  // 카운트다운
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // 게임 시작
      setIsStarted(true);
      setCountdown(null);
      startTimeRef.current = performance.now();
      currentTimeRef.current = 0;
      hitNotesRef.current = new Set();
      notesRef.current = beatmap.notes.map(n => ({ ...n, hit: false }));
    }
  }, [countdown, beatmap.notes]);

  // 게임 루프 - 최적화됨
  useEffect(() => {
    if (!isStarted || isFinished) return;

    let lastRender = 0;

    const gameLoop = (timestamp: number) => {
      currentTimeRef.current = performance.now() - startTimeRef.current;

      // 60fps로 제한 (약 16ms마다 렌더)
      if (timestamp - lastRender > 16) {
        lastRender = timestamp;

        // 미스 처리: 판정선을 지나간 노트
        const missedNotes = notesRef.current.filter(note => {
          if (hitNotesRef.current.has(note.id)) return false;
          const timeDiff = currentTimeRef.current - note.time;
          return timeDiff > HIT_WINDOW;
        });

        missedNotes.forEach(note => {
          if (!hitNotesRef.current.has(note.id)) {
            hitNotesRef.current.add(note.id);
            setGameState(prev => calculateScore(prev, "miss"));
          }
        });

        // 게임 종료 체크
        if (currentTimeRef.current > beatmap.duration + 2000) {
          setIsFinished(true);
          return;
        }

        setRenderTrigger(prev => prev + 1);
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isStarted, isFinished, beatmap.duration]);

  // 키 입력 처리
  const handleKeyPress = useCallback((laneIndex: number) => {
    if (!isStarted || isFinished) return;

    const currentTime = currentTimeRef.current;

    // 해당 레인에서 아직 안 친 노트 중 가장 가까운 것 찾기
    let closestNote: NoteType | null = null;
    let closestDiff = Infinity;

    for (const note of notesRef.current) {
      if (note.lane !== laneIndex) continue;
      if (hitNotesRef.current.has(note.id)) continue;

      const diff = Math.abs(note.time - currentTime);
      if (diff < closestDiff && diff < HIT_WINDOW) {
        closestDiff = diff;
        closestNote = note;
      }
    }

    if (closestNote) {
      hitNotesRef.current.add(closestNote.id);

      // 판정
      const result = closestDiff < 50 ? "perfect" : "good";
      setGameState(prev => calculateScore(prev, result));

      // 즉시 노트 사라지게 렌더 트리거
      setRenderTrigger(prev => prev + 1);
    }
  }, [isStarted, isFinished]);

  // 키보드 이벤트
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return; // 키 반복 무시
      const key = e.key.toLowerCase();
      const index = LANE_KEYS.indexOf(key);
      if (index !== -1) {
        e.preventDefault();
        setPressedKeys(prev => {
          const next = [...prev];
          next[index] = true;
          return next;
        });
        playSound(index);
        handleKeyPress(index);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const index = LANE_KEYS.indexOf(key);
      if (index !== -1) {
        setPressedKeys(prev => {
          const next = [...prev];
          next[index] = false;
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyPress, playSound]);

  // 터치 핸들러
  const handleTouchPress = useCallback((index: number) => {
    setPressedKeys(prev => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
    playSound(index);
    handleKeyPress(index);
  }, [playSound, handleKeyPress]);

  const handleTouchRelease = useCallback((index: number) => {
    setPressedKeys(prev => {
      const next = [...prev];
      next[index] = false;
      return next;
    });
  }, []);

  // 화면에 보여줄 노트 계산
  const visibleNotes = useMemo(() => {
    const currentTime = currentTimeRef.current;
    return notesRef.current
      .filter(note => {
        if (hitNotesRef.current.has(note.id)) return false;
        const position = ((currentTime - note.time + NOTE_SPEED) / NOTE_SPEED) * JUDGE_LINE_POSITION;
        return position > -10 && position < 100;
      })
      .map(note => ({
        ...note,
        position: ((currentTimeRef.current - note.time + NOTE_SPEED) / NOTE_SPEED) * JUDGE_LINE_POSITION,
      }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderTrigger]);

  // 결과 화면
  if (isFinished) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8 text-white">
        <h1 className="text-4xl font-bold mb-8 text-amber-200">결과</h1>
        <div className="text-8xl font-bold mb-8 text-yellow-400">{getGrade(gameState)}</div>
        <div className="text-center space-y-2 mb-8">
          <p className="text-3xl">점수: {Math.floor(gameState.score)}</p>
          <p className="text-xl text-amber-400">최대 콤보: {gameState.maxCombo}</p>
          <div className="text-lg mt-4">
            <span className="text-cyan-400">Perfect: {gameState.perfectCount}</span>
            {" | "}
            <span className="text-green-400">Good: {gameState.goodCount}</span>
            {" | "}
            <span className="text-red-400">Miss: {gameState.missCount}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setGameState(createInitialState());
              setIsStarted(false);
              setIsFinished(false);
              setRenderTrigger(0);
            }}
            className="px-8 py-4 bg-amber-600 hover:bg-amber-500 rounded-xl text-xl font-bold"
          >
            다시 하기
          </button>
          <Link href="/" className="px-8 py-4 bg-gray-600 hover:bg-gray-500 rounded-xl text-xl font-bold">
            메뉴로
          </Link>
        </div>
      </main>
    );
  }

  // 시작 화면
  if (!isStarted && countdown === null) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8 text-white">
        <h1 className="text-4xl font-bold mb-4 text-amber-200">{beatmap.title}</h1>
        <p className="text-xl text-amber-400 mb-8">{beatmap.artist}</p>
        <button
          onClick={startGame}
          className="px-12 py-6 bg-amber-600 hover:bg-amber-500 rounded-2xl text-2xl font-bold transition-all hover:scale-105"
        >
          시작하기
        </button>
        <div className="mt-8 text-amber-500/80 text-center">
          <p className="mb-2">키보드: D F J K</p>
          <p>모바일: 하단 터치 버튼</p>
        </div>
        <Link href="/" className="mt-8 text-amber-600 hover:text-amber-400 underline">
          뒤로 가기
        </Link>
      </main>
    );
  }

  // 카운트다운
  if (countdown !== null) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        <div className="text-9xl font-bold text-amber-400 animate-pulse">{countdown}</div>
      </main>
    );
  }

  // 게임 화면
  return (
    <main className="h-screen flex flex-col overflow-hidden select-none">
      {/* 배경 */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black z-0" />

      {/* 점수 */}
      <ScoreDisplay state={gameState} />

      {/* 게임 영역 */}
      <div className="flex-1 flex relative z-10 pb-20">
        {/* 레인 */}
        {LANE_KEYS.map((key, index) => (
          <Lane
            key={index}
            index={index}
            keyLabel={key.toUpperCase()}
            instrumentName={INSTRUMENTS[index].name}
            isPressed={pressedKeys[index]}
          />
        ))}

        {/* 판정선 */}
        <div
          className="absolute left-0 right-0 h-1 bg-white z-20"
          style={{ top: `${JUDGE_LINE_POSITION}%` }}
        />

        {/* 노트들 */}
        {visibleNotes.map(note => (
          <Note key={note.id} lane={note.lane} position={note.position} />
        ))}
      </div>

      {/* 모바일 터치 버튼 */}
      <div className="flex p-2 bg-black/80 z-20 md:hidden">
        {LANE_KEYS.map((key, index) => (
          <TouchButton
            key={index}
            index={index}
            keyLabel={key.toUpperCase()}
            instrumentName={INSTRUMENTS[index].name}
            isPressed={pressedKeys[index]}
            onPress={() => handleTouchPress(index)}
            onRelease={() => handleTouchRelease(index)}
          />
        ))}
      </div>
    </main>
  );
}

function GameLoading() {
  return (
    <main className="min-h-screen flex items-center justify-center text-white">
      <div className="text-2xl text-amber-400">로딩 중...</div>
    </main>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<GameLoading />}>
      <GameContent />
    </Suspense>
  );
}
