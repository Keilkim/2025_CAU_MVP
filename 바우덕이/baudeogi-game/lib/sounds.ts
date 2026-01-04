// 전통 악기 사운드 관리 (개선된 Web Audio API 합성음)

export const INSTRUMENTS = [
  { id: "kkwaenggwari", name: "꽹과리", file: "/audio/kkwaenggwari.mp3" },
  { id: "janggu", name: "장구", file: "/audio/janggu.mp3" },
  { id: "buk", name: "북", file: "/audio/buk.mp3" },
  { id: "sogo", name: "소고", file: "/audio/sogo.mp3" },
];

class SoundManager {
  private audioContext: AudioContext | null = null;
  private audioElements: Map<number, HTMLAudioElement[]> = new Map();
  private audioAvailable: Map<number, boolean> = new Map();
  private poolSize = 4;
  private currentIndex: Map<number, number> = new Map();
  private initialized = false;

  init() {
    if (this.initialized || typeof window === "undefined") return;

    this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

    INSTRUMENTS.forEach((instrument, laneIndex) => {
      const pool: HTMLAudioElement[] = [];
      this.audioAvailable.set(laneIndex, false);

      for (let i = 0; i < this.poolSize; i++) {
        const audio = new Audio(instrument.file);
        audio.preload = "auto";
        audio.volume = 0.7;

        audio.addEventListener("canplaythrough", () => {
          this.audioAvailable.set(laneIndex, true);
        }, { once: true });

        audio.addEventListener("error", () => {
          this.audioAvailable.set(laneIndex, false);
        });

        pool.push(audio);
      }

      this.audioElements.set(laneIndex, pool);
      this.currentIndex.set(laneIndex, 0);
    });

    this.initialized = true;
  }

  // 노이즈 생성 (타악기 어택용)
  private createNoiseBuffer(duration: number): AudioBuffer {
    const ctx = this.audioContext!;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    return buffer;
  }

  // 꽹과리 - 금속성 징/꽹과리 소리
  private playKkwaenggwari() {
    if (!this.audioContext) return;
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // 메인 금속음 (여러 하모닉스)
    const frequencies = [1100, 2200, 3300, 4400];
    const gains = [0.3, 0.15, 0.1, 0.05];

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.95, now + 0.3);

      gain.gain.setValueAtTime(gains[i], now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    });

    // 어택 노이즈 (치는 소리)
    const noiseSource = ctx.createBufferSource();
    const noiseGain = ctx.createGain();
    const noiseFilter = ctx.createBiquadFilter();

    noiseSource.buffer = this.createNoiseBuffer(0.05);
    noiseFilter.type = "highpass";
    noiseFilter.frequency.value = 3000;

    noiseGain.gain.setValueAtTime(0.2, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseSource.start(now);
  }

  // 장구 - 가죽 드럼 + 나무 테두리
  private playJanggu() {
    if (!this.audioContext) return;
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // 가죽 울림 (낮은음 + 높은음 혼합 - 장구 양면)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();

    // 궁편 (낮은 쪽)
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(180, now);
    osc1.frequency.exponentialRampToValueAtTime(80, now + 0.15);
    gain1.gain.setValueAtTime(0.4, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    // 채편 (높은 쪽)
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(400, now);
    osc2.frequency.exponentialRampToValueAtTime(200, now + 0.1);
    gain2.gain.setValueAtTime(0.25, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(ctx.destination);
    gain2.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.25);
    osc2.stop(now + 0.2);

    // 채 맞는 소리
    const noiseSource = ctx.createBufferSource();
    const noiseGain = ctx.createGain();
    const noiseFilter = ctx.createBiquadFilter();

    noiseSource.buffer = this.createNoiseBuffer(0.03);
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 2000;
    noiseFilter.Q.value = 1;

    noiseGain.gain.setValueAtTime(0.15, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseSource.start(now);
  }

  // 북 - 깊은 베이스 드럼
  private playBuk() {
    if (!this.audioContext) return;
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // 깊은 베이스 (메인)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);

    // 어택 (북채 맞는 소리)
    const attackOsc = ctx.createOscillator();
    const attackGain = ctx.createGain();

    attackOsc.type = "triangle";
    attackOsc.frequency.setValueAtTime(200, now);
    attackOsc.frequency.exponentialRampToValueAtTime(60, now + 0.05);

    attackGain.gain.setValueAtTime(0.4, now);
    attackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    attackOsc.connect(attackGain);
    attackGain.connect(ctx.destination);

    attackOsc.start(now);
    attackOsc.stop(now + 0.1);

    // 가죽 울림
    const noiseSource = ctx.createBufferSource();
    const noiseGain = ctx.createGain();
    const noiseFilter = ctx.createBiquadFilter();

    noiseSource.buffer = this.createNoiseBuffer(0.1);
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.value = 500;

    noiseGain.gain.setValueAtTime(0.2, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseSource.start(now);
  }

  // 소고 - 가벼운 손북
  private playSogo() {
    if (!this.audioContext) return;
    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // 가벼운 탁 소리
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);

    // 나무 테두리 소리 (밝은 어택)
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();

    clickOsc.type = "square";
    clickOsc.frequency.setValueAtTime(800, now);
    clickOsc.frequency.exponentialRampToValueAtTime(400, now + 0.02);

    clickGain.gain.setValueAtTime(0.1, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);

    clickOsc.start(now);
    clickOsc.stop(now + 0.04);

    // 손바닥 치는 노이즈
    const noiseSource = ctx.createBufferSource();
    const noiseGain = ctx.createGain();
    const noiseFilter = ctx.createBiquadFilter();

    noiseSource.buffer = this.createNoiseBuffer(0.02);
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 3000;

    noiseGain.gain.setValueAtTime(0.12, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseSource.start(now);
  }

  private playSynthSound(laneIndex: number) {
    if (this.audioContext?.state === "suspended") {
      this.audioContext.resume();
    }

    switch (laneIndex) {
      case 0:
        this.playKkwaenggwari();
        break;
      case 1:
        this.playJanggu();
        break;
      case 2:
        this.playBuk();
        break;
      case 3:
        this.playSogo();
        break;
    }
  }

  play(laneIndex: number) {
    if (!this.initialized) this.init();

    const hasAudio = this.audioAvailable.get(laneIndex);

    if (hasAudio) {
      const pool = this.audioElements.get(laneIndex);
      if (!pool) return;

      const currentIdx = this.currentIndex.get(laneIndex) || 0;
      const audio = pool[currentIdx];

      audio.currentTime = 0;
      audio.play().catch(() => {
        this.playSynthSound(laneIndex);
      });

      this.currentIndex.set(laneIndex, (currentIdx + 1) % this.poolSize);
    } else {
      this.playSynthSound(laneIndex);
    }
  }

  preload() {
    if (!this.initialized) this.init();
  }
}

export const soundManager = new SoundManager();
