import { Note } from "./gameEngine";

export interface Beatmap {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  audioSrc: string;
  notes: Note[];
  duration: number; // ms
}

// 레인 인덱스
// 0: 꽹과리 (D) - 높은 금속성, 천둥
// 1: 장구 (F) - 중간 드럼, 비
// 2: 북 (J) - 낮은 베이스, 구름
// 3: 소고 (K) - 가벼운 탭

// ========================================
// 바우덕이의 소고춤 - 자진모리 장단 기반
// ========================================
export const sampleBeatmap: Beatmap = {
  id: "sample",
  title: "바우덕이의 소고춤",
  artist: "자진모리 장단",
  bpm: 140,
  audioSrc: "/audio/sample.mp3",
  duration: 45000, // 45초
  notes: generateJajinmoriNotes(),
};

function generateJajinmoriNotes(): Note[] {
  const notes: Note[] = [];
  let noteId = 0;
  const baseTime = 2000; // 시작 전 대기 시간

  // 자진모리 장단: 덩 쿵 쿵덕 쿵 (12박을 4묶음)
  // BPM 140 기준, 1박 = 약 430ms

  const beat = 430; // 1박 간격

  // ============ 1. 인트로 (쉬운 패턴) ============
  // 기본 장단 익히기 - 한 번에 하나씩
  const intro = [
    { time: 0, lanes: [2] },        // 북 - 덩
    { time: beat, lanes: [2] },     // 북 - 쿵
    { time: beat * 2, lanes: [1] }, // 장구 - 덕
    { time: beat * 3, lanes: [2] }, // 북 - 쿵
  ];

  // 인트로 2회 반복
  for (let rep = 0; rep < 2; rep++) {
    intro.forEach((pattern) => {
      pattern.lanes.forEach((lane) => {
        notes.push({
          id: `note-${noteId++}`,
          lane,
          time: baseTime + pattern.time + rep * beat * 4,
          hit: false,
        });
      });
    });
  }

  // ============ 2. 기본 자진모리 (중간 난이도) ============
  const section2Start = baseTime + beat * 8;

  // 자진모리 기본형: 덩 - 쿵 - 쿵덕 - 쿵
  const jajinmori = [
    { time: 0, lanes: [0, 2] },           // 꽹과리+북 - 덩!
    { time: beat, lanes: [2] },           // 북 - 쿵
    { time: beat * 2, lanes: [2] },       // 북 - 쿵
    { time: beat * 2.5, lanes: [1] },     // 장구 - 덕
    { time: beat * 3, lanes: [2] },       // 북 - 쿵
  ];

  // 4회 반복
  for (let rep = 0; rep < 4; rep++) {
    jajinmori.forEach((pattern) => {
      pattern.lanes.forEach((lane) => {
        notes.push({
          id: `note-${noteId++}`,
          lane,
          time: section2Start + pattern.time + rep * beat * 4,
          hit: false,
        });
      });
    });
  }

  // ============ 3. 바우덕이 소고춤 (소고 등장) ============
  const section3Start = section2Start + beat * 16;

  // 소고 강조 패턴
  const sogoPattern = [
    { time: 0, lanes: [0] },              // 꽹과리
    { time: beat * 0.5, lanes: [3] },     // 소고
    { time: beat, lanes: [3] },           // 소고
    { time: beat * 1.5, lanes: [3] },     // 소고
    { time: beat * 2, lanes: [2] },       // 북
    { time: beat * 2.5, lanes: [1] },     // 장구
    { time: beat * 3, lanes: [3] },       // 소고
    { time: beat * 3.5, lanes: [3] },     // 소고
  ];

  // 4회 반복
  for (let rep = 0; rep < 4; rep++) {
    sogoPattern.forEach((pattern) => {
      pattern.lanes.forEach((lane) => {
        notes.push({
          id: `note-${noteId++}`,
          lane,
          time: section3Start + pattern.time + rep * beat * 4,
          hit: false,
        });
      });
    });
  }

  // ============ 4. 클라이막스 (사물놀이 합주) ============
  const section4Start = section3Start + beat * 16;

  // 모든 악기 함께
  const climax = [
    { time: 0, lanes: [0, 2] },           // 꽹과리+북
    { time: beat * 0.5, lanes: [1, 3] },  // 장구+소고
    { time: beat, lanes: [0] },           // 꽹과리
    { time: beat * 1.5, lanes: [2] },     // 북
    { time: beat * 2, lanes: [0, 1, 2, 3] }, // 모두!
    { time: beat * 3, lanes: [0] },       // 꽹과리
    { time: beat * 3.25, lanes: [0] },    // 꽹과리 연타
    { time: beat * 3.5, lanes: [0] },     // 꽹과리 연타
    { time: beat * 3.75, lanes: [0] },    // 꽹과리 연타
  ];

  // 3회 반복
  for (let rep = 0; rep < 3; rep++) {
    climax.forEach((pattern) => {
      pattern.lanes.forEach((lane) => {
        notes.push({
          id: `note-${noteId++}`,
          lane,
          time: section4Start + pattern.time + rep * beat * 4,
          hit: false,
        });
      });
    });
  }

  // ============ 5. 피날레 ============
  const section5Start = section4Start + beat * 12;

  // 대단원 - 점점 빨라지며 마무리
  const finale = [
    { time: 0, lanes: [2] },
    { time: beat * 0.5, lanes: [0] },
    { time: beat, lanes: [1] },
    { time: beat * 1.5, lanes: [3] },
    { time: beat * 2, lanes: [0, 2] },
    { time: beat * 2.33, lanes: [1, 3] },
    { time: beat * 2.66, lanes: [0, 2] },
    { time: beat * 3, lanes: [0, 1, 2, 3] }, // 마지막 합주
  ];

  finale.forEach((pattern) => {
    pattern.lanes.forEach((lane) => {
      notes.push({
        id: `note-${noteId++}`,
        lane,
        time: section5Start + pattern.time,
        hit: false,
      });
    });
  });

  // 마지막 강타
  [0, 1, 2, 3].forEach((lane) => {
    notes.push({
      id: `note-${noteId++}`,
      lane,
      time: section5Start + beat * 5,
      hit: false,
    });
  });

  return notes;
}

// ========================================
// 휘모리 장단 - 빠른 템포
// ========================================
export const hwimoriBeatmap: Beatmap = {
  id: "hwimori",
  title: "경복궁 공연",
  artist: "휘모리 장단",
  bpm: 180,
  audioSrc: "/audio/hwimori.mp3",
  duration: 35000,
  notes: generateHwimoriNotes(),
};

function generateHwimoriNotes(): Note[] {
  const notes: Note[] = [];
  let noteId = 0;
  const baseTime = 2000;
  const beat = 333; // 180 BPM

  // 휘모리: 매우 빠른 장단, 긴박한 느낌
  // 패턴: 꽹과리 중심의 빠른 연타

  const pattern = [
    { time: 0, lanes: [0] },
    { time: beat * 0.5, lanes: [0] },
    { time: beat, lanes: [2] },
    { time: beat * 1.5, lanes: [0] },
    { time: beat * 2, lanes: [0, 2] },
    { time: beat * 2.5, lanes: [1] },
    { time: beat * 3, lanes: [0] },
    { time: beat * 3.5, lanes: [3] },
  ];

  for (let rep = 0; rep < 8; rep++) {
    pattern.forEach((p) => {
      p.lanes.forEach((lane) => {
        notes.push({
          id: `note-${noteId++}`,
          lane,
          time: baseTime + p.time + rep * beat * 4,
          hit: false,
        });
      });
    });
  }

  return notes;
}

// 빈 비트맵 템플릿
export function createEmptyBeatmap(
  id: string,
  title: string,
  audioSrc: string
): Beatmap {
  return {
    id,
    title,
    artist: "Unknown",
    bpm: 120,
    audioSrc,
    notes: [],
    duration: 0,
  };
}

// 모든 비트맵 목록
export const beatmaps: Beatmap[] = [sampleBeatmap, hwimoriBeatmap];
