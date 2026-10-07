import React from 'react';
import { DisplayMode } from '../types';
import { Monitor, Smartphone, Sparkles, Check } from 'lucide-react';

interface DeviceModeModalProps {
  isOpen: boolean;
  currentMode: DisplayMode;
  onSelectMode: (mode: DisplayMode) => void;
  onClose: () => void;
}

export const DeviceModeModal: React.FC<DeviceModeModalProps> = ({
  isOpen,
  currentMode,
  onSelectMode,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-[var(--surface)] border border-[var(--line-strong)] p-6 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-[rgba(var(--accent-rgb),0.2)] blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-1.5 text-[var(--gold-soft)]">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold tracking-wider uppercase">Pilihan Desain Tampilan</span>
        </div>

        <h3 className="text-xl font-bold font-serif text-[var(--cream)] mb-2">
          Sedang Menggunakan Apa?
        </h3>
        <p className="text-xs text-[var(--muted)] mb-5 leading-relaxed">
          Pilih mode yang paling nyaman untuk perangkatmu. Kamu bisa menggantinya kapan saja lewat menu <strong>"Lainnya"</strong> di dalam aplikasi.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {/* Opsi Komputer / Desktop 3D */}
          <button
            type="button"
            onClick={() => onSelectMode('desktop')}
            className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between group ${
              currentMode === 'desktop'
                ? 'border-[var(--gold)] bg-[var(--surface2)] shadow-md ring-2 ring-[rgba(var(--accent-rgb),0.3)]'
                : 'border-[var(--line)] bg-[var(--surface2)]/60 hover:border-[var(--line-strong)] hover:bg-[var(--surface2)]'
            }`}
          >
            {currentMode === 'desktop' && (
              <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--gold)] text-black flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gold-soft)] to-[var(--gold)] text-black flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-[var(--cream)] font-serif mb-0.5">
                Komputer / Laptop
              </div>
              <p className="text-[11px] text-[var(--muted)] leading-tight">
                Desain luas, sentuhan <strong>3D interaktif</strong> logo MAN 1, denah 3D perspektif &amp; visual premium.
              </p>
            </div>
          </button>

          {/* Opsi HP / Mobile Ringan */}
          <button
            type="button"
            onClick={() => onSelectMode('mobile')}
            className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between group ${
              currentMode === 'mobile'
                ? 'border-[var(--gold)] bg-[var(--surface2)] shadow-md ring-2 ring-[rgba(var(--accent-rgb),0.3)]'
                : 'border-[var(--line)] bg-[var(--surface2)]/60 hover:border-[var(--line-strong)] hover:bg-[var(--surface2)]'
            }`}
          >
            {currentMode === 'mobile' && (
              <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--gold)] text-black flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--jade)] to-[var(--jade-bg)] text-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-[var(--cream)] font-serif mb-0.5">
                HP / Smartphone
              </div>
              <p className="text-[11px] text-[var(--muted)] leading-tight">
                Versi mobile ringan, responsif, thumb-friendly, dan menu ringkas tidak menutupi layar.
              </p>
            </div>
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[var(--line)]">
          <button
            type="button"
            onClick={() => onSelectMode('auto')}
            className="text-[11px] text-[var(--muted)] hover:text-[var(--gold-soft)] underline underline-offset-4"
          >
            Gunakan Mode Otomatis (Layar)
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black shadow-md hover:brightness-105 active:scale-95 transition-all"
          >
            Terapkan &amp; Masuk
          </button>
        </div>
      </div>
    </div>
  );
};
