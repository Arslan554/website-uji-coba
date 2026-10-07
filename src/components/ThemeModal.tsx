import React from 'react';
import { ColorScheme } from '../types';
import { Sun, Moon, X } from 'lucide-react';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScheme: ColorScheme;
  onSelectScheme: (scheme: ColorScheme) => void;
  isDarkMode: boolean;
  onToggleDarkMode: (dark: boolean) => void;
}

const colorSchemes: { id: ColorScheme; name: string; gradient: string }[] = [
  { id: 'gold', name: 'Emas Kraton', gradient: 'from-[#E8C971] to-[#A97D0C]' },
  { id: 'sage', name: 'Sage Zamrud', gradient: 'from-[#A9D493] to-[#5F7A52]' },
  { id: 'rosewood', name: 'Rosewood Senja', gradient: 'from-[#EAA0B0] to-[#9C3F49]' },
  { id: 'ocean', name: 'Samudra Teal', gradient: 'from-[#3D9BAC] to-[#1F7A8C]' },
  { id: 'lavender', name: 'Lavender Senja', gradient: 'from-[#B08CE0] to-[#6C4FA0]' },
  { id: 'karang', name: 'Karang Terakota', gradient: 'from-[#DE8752] to-[#C1602E]' },
  { id: 'nila', name: 'Nila Indigo', gradient: 'from-[#6C70C0] to-[#4A4FA0]' },
];

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  currentScheme,
  onSelectScheme,
  isDarkMode,
  onToggleDarkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[115] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-[var(--surface)] border border-[var(--line-strong)] p-6 shadow-2xl relative overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-serif font-bold text-[var(--cream)]">
            Tampilan &amp; Skema Warna
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[var(--muted)] hover:bg-[var(--surface2)] transition-colors"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Terang / Gelap */}
        <div className="mb-5">
          <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block mb-2">
            Mode Pencahayaan
          </span>
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[var(--surface3)] border border-[var(--line)]">
            <button
              type="button"
              onClick={() => onToggleDarkMode(false)}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                !isDarkMode
                  ? 'bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--cream)]'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>Mode Terang</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleDarkMode(true)}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                isDarkMode
                  ? 'bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--cream)]'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Mode Gelap</span>
            </button>
          </div>
        </div>

        {/* Palet Warna */}
        <div>
          <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block mb-2">
            Palet Aksen Budaya
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {colorSchemes.map((scheme) => (
              <button
                key={scheme.id}
                type="button"
                onClick={() => onSelectScheme(scheme.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                  currentScheme === scheme.id
                    ? 'border-[var(--gold-soft)] bg-[var(--surface2)] ring-2 ring-[rgba(var(--accent-rgb),0.3)] shadow-sm'
                    : 'border-[var(--line)] bg-[var(--surface2)]/50 hover:bg-[var(--surface2)]'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full bg-gradient-to-br ${scheme.gradient} shadow-sm border border-white/20`}
                />
                <span
                  className={`text-[10px] font-semibold text-center ${
                    currentScheme === scheme.id ? 'text-[var(--cream)]' : 'text-[var(--muted)]'
                  }`}
                >
                  {scheme.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
