// Gerador de áudio retrô 8-bit sintetizado via Web Audio API (SFX + Chiptune BGM Procedural)
// Não requer assets de áudio externos, peso zero e latência zero

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isBgmMuted: boolean = false;

  // Controle da BGM
  private bgmIntervalId: number | null = null;
  private currentStep: number = 0;
  private isBgmPlaying: boolean = false;

  constructor() {
    try {
      this.isMuted = localStorage.getItem('poke_memory_sound_muted') === 'true';
      this.isBgmMuted = localStorage.getItem('poke_memory_bgm_muted') === 'true';
    } catch {
      this.isMuted = false;
      this.isBgmMuted = false;
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // ==========================================
  // Controle de Mudo (SFX e BGM separados)
  // ==========================================
  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('poke_memory_sound_muted', String(muted));
    } catch {}
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getBgmMuted(): boolean {
    return this.isBgmMuted;
  }

  public setBgmMuted(muted: boolean) {
    this.isBgmMuted = muted;
    try {
      localStorage.setItem('poke_memory_bgm_muted', String(muted));
    } catch {}

    if (muted) {
      this.stopBgm();
    } else if (this.isBgmPlaying) {
      this.startBgm();
    }
  }

  public toggleBgmMute(): boolean {
    const nextState = !this.isBgmMuted;
    this.setBgmMuted(nextState);
    return nextState;
  }

  private vibrate(pattern: number | number[]) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {}
    }
  }

  // ==========================================
  // Música de Fundo (Chiptune 8-bit BGM)
  // Melodia estilo Game Boy Route 1 / Pallet Town
  // ==========================================
  private bgmMelody = [
    // Compasso 1
    { note: 261.63, dur: 0.12 }, // C4
    { note: 329.63, dur: 0.12 }, // E4
    { note: 392.00, dur: 0.12 }, // G4
    { note: 523.25, dur: 0.22 }, // C5
    // Compasso 2
    { note: 440.00, dur: 0.12 }, // A4
    { note: 392.00, dur: 0.12 }, // G4
    { note: 329.63, dur: 0.12 }, // E4
    { note: 293.66, dur: 0.22 }, // D4
    // Compasso 3
    { note: 261.63, dur: 0.12 }, // C4
    { note: 329.63, dur: 0.12 }, // E4
    { note: 392.00, dur: 0.12 }, // G4
    { note: 440.00, dur: 0.18 }, // A4
    // Compasso 4
    { note: 392.00, dur: 0.12 }, // G4
    { note: 329.63, dur: 0.12 }, // E4
    { note: 293.66, dur: 0.12 }, // D4
    { note: 261.63, dur: 0.25 }, // C4
  ];

  public startBgm() {
    this.isBgmPlaying = true;
    if (this.isBgmMuted || this.bgmIntervalId !== null) return;

    const ctx = this.getContext();
    if (!ctx) return;

    this.currentStep = 0;
    // Roda a melodia a ~145 BPM (205ms por nota)
    this.bgmIntervalId = window.setInterval(() => {
      if (this.isBgmMuted) return;
      const step = this.bgmMelody[this.currentStep % this.bgmMelody.length];
      this.playChiptuneNote(step.note, step.dur);
      this.currentStep++;
    }, 205);
  }

  public stopBgm() {
    if (this.bgmIntervalId !== null) {
      window.clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  private playChiptuneNote(freq: number, duration: number) {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle'; // Som suave de Game Boy para BGM de fundo
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.025, now); // Volume de fundo bem sutil
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  // ==========================================
  // Efeitos Sonoros (SFX)
  // ==========================================
  public playFlip() {
    this.vibrate(25);
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(560, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  public playMatch() {
    this.vibrate([40, 50, 60]);
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [
      { freq: 523.25, time: 0, duration: 0.1 },
      { freq: 659.25, time: 0.1, duration: 0.1 },
      { freq: 783.99, time: 0.2, duration: 0.18 },
    ];

    notes.forEach(({ freq, time, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      const start = ctx.currentTime + time;
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.09, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + duration);
    });
  }

  public playMismatch() {
    this.vibrate([60, 40, 60]);
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  public playCombo(comboCount: number) {
    this.vibrate(35);
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    const baseFreq = Math.min(1000, 500 + comboCount * 120);
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.1);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playDefeat() {
    this.vibrate([200, 100, 200]);
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [
      { freq: 280, time: 0, dur: 0.15 },
      { freq: 240, time: 0.15, dur: 0.15 },
      { freq: 200, time: 0.3, dur: 0.15 },
      { freq: 160, time: 0.45, dur: 0.3 },
    ];

    notes.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      const start = ctx.currentTime + time;
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.09, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + dur);
    });
  }

  public playVictory() {
    this.vibrate([100, 50, 100, 50, 200]);
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const melody = [
      { freq: 440, time: 0.0, dur: 0.12 },
      { freq: 554.37, time: 0.14, dur: 0.12 },
      { freq: 659.25, time: 0.28, dur: 0.12 },
      { freq: 880, time: 0.42, dur: 0.35 },
    ];

    melody.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      const start = ctx.currentTime + time;
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.1, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + dur);
    });
  }
}

export const sounds = new SoundManager();
