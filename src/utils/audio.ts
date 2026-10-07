// Web Audio API pure synthesizer (tanpa file eksternal yang rentan gagal load)
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtx = new AudioCtx();
      }
    } catch {
      // AudioContext not supported or blocked
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playChime() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const freqs = [880, 1108, 1318]; // A5, C#6, E6
  const baseTime = ctx.currentTime;

  freqs.forEach((freq, i) => {
    const t0 = baseTime + i * 0.18;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t0);

    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.22, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t0);
    osc.stop(t0 + 0.6);
  });
}

export function playSpinTick() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const t0 = ctx.currentTime;

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(1200, t0);
  osc.frequency.exponentialRampToValueAtTime(300, t0 + 0.04);

  gain.gain.setValueAtTime(0.08, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(t0);
  osc.stop(t0 + 0.05);
}

export function playWinFanfare() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  const baseTime = ctx.currentTime;

  notes.forEach((freq, idx) => {
    const t0 = baseTime + idx * 0.12;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t0);

    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(0.25, t0 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t0);
    osc.stop(t0 + 0.5);
  });
}

export function playSoftClick() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const t0 = ctx.currentTime;

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, t0);

  gain.gain.setValueAtTime(0.04, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.03);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(t0);
  osc.stop(t0 + 0.03);
}

export function triggerVibration(pattern: number | number[] = 40) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration error
    }
  }
}
