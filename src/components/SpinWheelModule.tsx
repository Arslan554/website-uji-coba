import React, { useState, useEffect, useRef } from 'react';
import { Student, SpinConfig, SpinLastResult } from '../types';
import { Play, Sparkles, Plus, Trash2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSpinTick, playWinFanfare, playSoftClick } from '../utils/audio';

interface SpinWheelModuleProps {
  students: Student[];
  spinCfg: SpinConfig | null;
  spinLast: SpinLastResult | null;
  onUpdateSpinConfig: (cfg: SpinConfig) => void;
  onCommitSpinResult: (res: SpinLastResult) => void;
  unlocked: boolean;
}

export const SpinWheelModule: React.FC<SpinWheelModuleProps> = ({
  students,
  spinCfg,
  spinLast,
  onUpdateSpinConfig,
  onCommitSpinResult,
  unlocked,
}) => {
  const [spinTab, setSpinTab] = useState<'pribadi' | 'admin'>('pribadi');
  const [personalCfg, setPersonalCfg] = useState<SpinConfig>(() => {
    try {
      const saved = localStorage.getItem('xe11-spin-personal');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return { src: 'C', extra: [] };
  });

  const [inputVal, setInputVal] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedWinner, setSelectedWinner] = useState<string>(spinLast?.name || '');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Active configuration based on tab
  const activeCfg = spinTab === 'pribadi' ? personalCfg : (spinCfg || { src: 'C', extra: [] });

  const getSourceNames = (src: 'L' | 'P' | 'C' | 'X'): string[] => {
    const present = students.filter((s) => s.hadir);
    if (src === 'L') return present.filter((s) => s.g === 'L').map((s) => s.name);
    if (src === 'P') return present.filter((s) => s.g === 'P').map((s) => s.name);
    if (src === 'X') return [];
    return present.map((s) => s.name);
  };

  const getItems = (cfg: SpinConfig): string[] => {
    return [...getSourceNames(cfg.src), ...cfg.extra].filter((x) => x && x.trim().length > 0);
  };

  const currentItems = getItems(activeCfg);

  // Draw Wheel on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.parentElement?.clientWidth || 300;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 4;
    const n = currentItems.length;

    if (n < 2) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#EBE0C4';
      ctx.fill();
      ctx.strokeStyle = 'rgba(58,42,16,0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#6C5C42';
      ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Tambah minimal 2 pilihan', cx, cy - 60);
      return;
    }

    const palette = ['#E8C971', '#6FA995', '#E0916A', '#D98CA0', '#C9A227', '#5F7A52', '#B08CE0'];
    const sliceAngle = (Math.PI * 2) / n;
    const startOffset = -Math.PI / 2;

    for (let i = 0; i < n; i++) {
      const angle = startOffset + i * sliceAngle;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle, angle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = palette[i % palette.length];
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Text label
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#1B140A';

      let label = currentItems[i];
      if (label.length > 14) label = label.slice(0, 13) + '…';
      ctx.fillText(label, radius - 12, 0);
      ctx.restore();
    }
  }, [currentItems]);

  const updateActiveConfig = (newCfg: SpinConfig) => {
    if (spinTab === 'pribadi') {
      setPersonalCfg(newCfg);
      try {
        localStorage.setItem('xe11-spin-personal', JSON.stringify(newCfg));
      } catch {
        // ignore
      }
    } else {
      if (!unlocked) return;
      onUpdateSpinConfig(newCfg);
    }
  };

  const handleAddItems = () => {
    if (!inputVal.trim()) return;
    playSoftClick();
    const parts = inputVal.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean);
    const updated = [...activeCfg.extra, ...parts];
    updateActiveConfig({ ...activeCfg, extra: updated });
    setInputVal('');
  };

  const handleClearExtras = () => {
    playSoftClick();
    updateActiveConfig({ ...activeCfg, extra: [] });
  };

  const handleSpin = () => {
    if (isSpinning || currentItems.length < 2) return;
    playSoftClick();
    setIsSpinning(true);
    setSelectedWinner('Memutar...');

    const n = currentItems.length;
    const winnerIdx = Math.floor(Math.random() * n);
    const sliceAngle = (Math.PI * 2) / n;
    const fullRotations = Math.PI * 2 * (6 + Math.floor(Math.random() * 2));
    const targetAngle = -(winnerIdx + 0.5) * sliceAngle + (Math.random() - 0.5) * sliceAngle * 0.6;
    const currentModulo = rotation % (Math.PI * 2);
    const delta = (((targetAngle - currentModulo) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const finalRot = rotation + fullRotations + delta;

    setRotation(finalRot);

    // Audio tick loop
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      tickCount++;
      playSpinTick();
      if (tickCount > 28) clearInterval(tickInterval);
    }, 140);

    setTimeout(() => {
      setIsSpinning(false);
      const winnerName = currentItems[winnerIdx];
      setSelectedWinner(winnerName);
      playWinFanfare();

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      if (spinTab === 'admin' && unlocked) {
        onCommitSpinResult({
          ts: Date.now(),
          idx: winnerIdx,
          name: winnerName,
        });
      }
    }, 4600);
  };

  return (
    <div className="space-y-4">
      {/* Mode Switcher */}
      <div className="p-1 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] grid grid-cols-2 gap-1">
        <button
          type="button"
          onClick={() => {
            playSoftClick();
            setSpinTab('pribadi');
          }}
          className={`py-2 text-center rounded-xl font-bold text-xs transition-all ${
            spinTab === 'pribadi'
              ? 'bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black shadow-sm'
              : 'text-[var(--muted)] hover:text-[var(--cream)]'
          }`}
        >
          Mode Pribadi (Perangkat Ini)
        </button>
        <button
          type="button"
          onClick={() => {
            playSoftClick();
            setSpinTab('admin');
          }}
          className={`py-2 text-center rounded-xl font-bold text-xs transition-all ${
            spinTab === 'admin'
              ? 'bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black shadow-sm'
              : 'text-[var(--muted)] hover:text-[var(--cream)]'
          }`}
        >
          Mode Bersama (Semua Perangkat)
        </button>
      </div>

      {/* Main Wheel Card */}
      <div className="p-4 sm:p-6 rounded-3xl bg-[var(--surface)] border border-[var(--line-strong)] shadow-md flex flex-col items-center">
        <div className="text-[11px] font-semibold text-[var(--muted)] mb-3">
          {spinTab === 'pribadi'
            ? '🎯 Mode Pribadi: Roda dan hasil tersimpan di HP/laptopmu saja'
            : unlocked
            ? '🌐 Mode Bersama (Admin): Hasil putaran dibagikan ke semua orang'
            : '🌐 Mode Bersama: Menampilkan roda kelas bersama'}
        </div>

        {/* Wheel Container with Pointer Pin */}
        <div className="relative w-full max-w-[300px] aspect-square my-2">
          {/* Pointer Pin */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 pointer-events-none">
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[22px] border-t-[var(--gold)] drop-shadow-md" />
          </div>

          {/* Rotating Canvas Wrapper */}
          <div
            className="w-full h-full rounded-full shadow-2xl relative overflow-hidden"
            style={{
              transform: `rotate(${rotation}rad)`,
              transition: isSpinning ? 'transform 4.5s cubic-bezier(0.12, 0.72, 0.14, 1)' : 'none',
            }}
          >
            <canvas ref={canvasRef} className="w-full h-full block rounded-full" />
          </div>

          {/* Center Hub */}
          <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[var(--surface)] border-2 border-[var(--gold-soft)] shadow-md flex items-center justify-center z-10 pointer-events-none">
            <Sparkles className="w-5 h-5 text-[var(--gold-soft)]" />
          </div>
        </div>

        {/* Spin Button */}
        <button
          type="button"
          onClick={handleSpin}
          disabled={isSpinning || currentItems.length < 2 || (spinTab === 'admin' && !unlocked)}
          className="w-full max-w-[280px] mt-4 py-3 px-6 rounded-2xl bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black font-bold text-sm shadow-lg hover:brightness-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-black" />
          <span>{isSpinning ? 'Memutar Roda...' : 'Putar Roda Sekarang'}</span>
        </button>

        {/* Result Callout */}
        <div className="mt-4 p-3 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] w-full max-w-[280px] text-center">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
            Hasil Terpilih
          </div>
          <div className="font-serif font-bold text-lg text-[var(--gold-soft)] mt-0.5 truncate">
            {selectedWinner || '—'}
          </div>
        </div>
      </div>

      {/* Editor & Option Controls */}
      {(spinTab === 'pribadi' || unlocked) && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-[var(--cream)]">
              Pengaturan Isi Roda
            </h3>
            <span className="text-xs text-[var(--muted)]">
              {currentItems.length} pilihan
            </span>
          </div>

          {/* Source Selector */}
          <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-[var(--surface3)] border border-[var(--line)]">
            <button
              type="button"
              onClick={() => updateActiveConfig({ ...activeCfg, src: 'C' })}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCfg.src === 'C'
                  ? 'bg-[var(--gold)] text-black shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--cream)]'
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => updateActiveConfig({ ...activeCfg, src: 'L' })}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCfg.src === 'L'
                  ? 'bg-[var(--gold)] text-black shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--cream)]'
              }`}
            >
              Laki-laki
            </button>
            <button
              type="button"
              onClick={() => updateActiveConfig({ ...activeCfg, src: 'P' })}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCfg.src === 'P'
                  ? 'bg-[var(--gold)] text-black shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--cream)]'
              }`}
            >
              Perempuan
            </button>
            <button
              type="button"
              onClick={() => updateActiveConfig({ ...activeCfg, src: 'X' })}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCfg.src === 'X'
                  ? 'bg-[var(--gold)] text-black shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--cream)]'
              }`}
            >
              Kustom
            </button>
          </div>

          {/* Add Item Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Tambah nama / teks baru (bisa dipisah koma)..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddItems();
              }}
              className="flex-1 rounded-xl border border-[var(--line-strong)] bg-[var(--bg2)] text-[var(--cream)] px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]"
            />
            <button
              type="button"
              onClick={handleAddItems}
              className="py-2 px-3 rounded-xl bg-[var(--surface3)] hover:bg-[var(--surface)] text-[var(--cream)] border border-[var(--line-strong)] font-semibold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah</span>
            </button>
          </div>

          {/* Custom Chips list */}
          {activeCfg.extra.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-[var(--muted)]">
                <span>Tambahan Kustom ({activeCfg.extra.length}):</span>
                <button
                  type="button"
                  onClick={handleClearExtras}
                  className="text-[var(--warn)] hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Hapus Semua Tambahan</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                {activeCfg.extra.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full bg-[var(--surface3)] text-[var(--cream)] border border-[var(--line)] text-xs"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = activeCfg.extra.filter((_, i) => i !== idx);
                        updateActiveConfig({ ...activeCfg, extra: updated });
                      }}
                      className="text-[var(--warn)] font-bold hover:scale-125"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
