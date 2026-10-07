import React from 'react';
import { TabName, DisplayMode } from '../types';
import {
  Monitor,
  Smartphone,
  Sparkles,
  BarChart3,
  Users,
  Grid,
  CheckSquare,
  Calendar,
  Hourglass,
  Bell,
  History,
  Image as ImageIcon,
  Palette,
  UserCheck,
  LogOut,
  X,
  ChevronDown
} from 'lucide-react';

interface MoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabName) => void;
  displayMode: DisplayMode;
  onSetDisplayMode: (mode: DisplayMode) => void;
  onOpenTheme: () => void;
  onOpenChangeName: () => void;
  onLogout: () => void;
  userRoleName: string;
}

export const MoreDrawer: React.FC<MoreDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  displayMode,
  onSetDisplayMode,
  onOpenTheme,
  onOpenChangeName,
  onLogout,
  userRoleName,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/35 backdrop-blur-[2.5px] transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* 
        Compact Drawer for Mobile:
        Does NOT cover full screen! Max-h is 60vh, semi-transparent background with soft blur
        so the website content behind remains clearly visible and non-intrusive.
      */}
      <div className="w-full sm:max-w-lg max-h-[72vh] sm:max-h-[85vh] flex flex-col bg-[var(--surface)]/95 border-t sm:border border-[var(--line-strong)] rounded-t-[28px] sm:rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden animate-slide-up">
        {/* Top Handle & Header Bar */}
        <div className="px-5 pt-3 pb-2 border-b border-[var(--line)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--gold-soft)] animate-pulse" />
            <span className="font-serif font-bold text-sm text-[var(--cream)]">
              Menu Lainnya &amp; Pengaturan
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[var(--muted)] hidden sm:inline">
              {userRoleName ? `Masuk: ${userRoleName}` : ''}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[var(--surface2)] text-[var(--muted)] transition-colors"
              aria-label="Tutup menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content inside compact bounds */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* SWITCH DESAIN / DEVICE MODE (Paling Penting Sesuai Permintaan User) */}
          <div className="p-3 rounded-2xl bg-[var(--surface2)] border border-[var(--line)]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif font-bold text-xs text-[var(--cream)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--gold-soft)]" />
                Model Desain Tampilan
              </span>
              <span className="text-[10px] text-[var(--muted)]">
                {displayMode === 'desktop' ? 'Mode Komputer 3D' : displayMode === 'mobile' ? 'Mode HP Ringan' : 'Otomatis'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[var(--surface3)] border border-[var(--line)]">
              <button
                type="button"
                onClick={() => onSetDisplayMode('desktop')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-semibold text-[11px] transition-all ${
                  displayMode === 'desktop'
                    ? 'bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black shadow-sm'
                    : 'text-[var(--muted)] hover:text-[var(--cream)]'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Komputer</span>
              </button>

              <button
                type="button"
                onClick={() => onSetDisplayMode('mobile')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-semibold text-[11px] transition-all ${
                  displayMode === 'mobile'
                    ? 'bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black shadow-sm'
                    : 'text-[var(--muted)] hover:text-[var(--cream)]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>HP (Ringan)</span>
              </button>

              <button
                type="button"
                onClick={() => onSetDisplayMode('auto')}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg font-semibold text-[11px] transition-all ${
                  displayMode === 'auto'
                    ? 'bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black shadow-sm'
                    : 'text-[var(--muted)] hover:text-[var(--cream)]'
                }`}
              >
                <span>⚡ Auto</span>
              </button>
            </div>
            <p className="text-[10px] text-[var(--muted)] mt-1.5 leading-tight">
              Ganti tampilan kapan saja. Mode komputer menyertakan elemen 3D logo &amp; workspace luas, mode HP tetap ringan dan tidak menutupi layar.
            </p>
          </div>

          {/* Quick Menu Grid */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mb-2 block">
              Fitur Kelas
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { onNavigateTab('polling'); onClose(); }}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--surface2)]/80 hover:bg-[var(--surface2)] border border-[var(--line)] text-left transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-[#3E7A66]/20 text-[#3E7A66] dark:text-[#6FA995] flex items-center justify-center shrink-0">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="font-bold text-[11px] text-[var(--cream)] truncate">Polling</div>
                  <div className="text-[9px] text-[var(--muted)] truncate">Suara kelas</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { onNavigateTab('peserta'); onClose(); }}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--surface2)]/80 hover:bg-[var(--surface2)] border border-[var(--line)] text-left transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-[var(--gold)]/20 text-[var(--gold-dim)] dark:text-[var(--gold-soft)] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="font-bold text-[11px] text-[var(--cream)] truncate">Peserta</div>
                  <div className="text-[9px] text-[var(--muted)] truncate">Daftar absen</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { onNavigateTab('kelompok'); onClose(); }}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--surface2)]/80 hover:bg-[var(--surface2)] border border-[var(--line)] text-left transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-[#9C5A66]/20 text-[#9C5A66] dark:text-[#EAA0B0] flex items-center justify-center shrink-0">
                  <Grid className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="font-bold text-[11px] text-[var(--cream)] truncate">Bagi Kelompok</div>
                  <div className="text-[9px] text-[var(--muted)] truncate">Per mapel</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { onNavigateTab('tugas'); onClose(); }}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--surface2)]/80 hover:bg-[var(--surface2)] border border-[var(--line)] text-left transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-[#4C9179]/20 text-[#4C9179] dark:text-[#7BD08F] flex items-center justify-center shrink-0">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="font-bold text-[11px] text-[var(--cream)] truncate">Tugas</div>
                  <div className="text-[9px] text-[var(--muted)] truncate">Deadline &amp; status</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { onNavigateTab('jadwal'); onClose(); }}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--surface2)]/80 hover:bg-[var(--surface2)] border border-[var(--line)] text-left transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-[#BE6C46]/20 text-[#BE6C46] dark:text-[#E0916A] flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="font-bold text-[11px] text-[var(--cream)] truncate">Jadwal</div>
                  <div className="text-[9px] text-[var(--muted)] truncate">Alarm pelajaran</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { onNavigateTab('countdown'); onClose(); }}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--surface2)]/80 hover:bg-[var(--surface2)] border border-[var(--line)] text-left transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-[var(--gold-soft)]/20 text-[var(--gold-dim)] dark:text-[var(--gold-soft)] flex items-center justify-center shrink-0">
                  <Hourglass className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="font-bold text-[11px] text-[var(--cream)] truncate">Countdown</div>
                  <div className="text-[9px] text-[var(--muted)] truncate">Acara penting</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { onNavigateTab('info'); onClose(); }}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--surface2)]/80 hover:bg-[var(--surface2)] border border-[var(--line)] text-left transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-[#BE6C46]/20 text-[#BE6C46] dark:text-[#E0916A] flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="font-bold text-[11px] text-[var(--cream)] truncate">Info Kelas</div>
                  <div className="text-[9px] text-[var(--muted)] truncate">Pengumuman</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { onNavigateTab('riwayat'); onClose(); }}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--surface2)]/80 hover:bg-[var(--surface2)] border border-[var(--line)] text-left transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-[#5A4E7E]/20 text-[#5A4E7E] dark:text-[#B08CE0] flex items-center justify-center shrink-0">
                  <History className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="font-bold text-[11px] text-[var(--cream)] truncate">Riwayat</div>
                  <div className="text-[9px] text-[var(--muted)] truncate">Hasil acak denah</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { onNavigateTab('struktur'); onClose(); }}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--surface2)]/80 hover:bg-[var(--surface2)] border border-[var(--line)] text-left transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-[#8A7CB0]/20 text-[#5A4E7E] dark:text-[#B08CE0] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="font-bold text-[11px] text-[var(--cream)] truncate">Struktur</div>
                  <div className="text-[9px] text-[var(--muted)] truncate">Pengurus kelas</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { onNavigateTab('galeri'); onClose(); }}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[var(--surface2)]/80 hover:bg-[var(--surface2)] border border-[var(--line)] text-left transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-[#B23C6B]/20 text-[#B23C6B] dark:text-[#EAA0B0] flex items-center justify-center shrink-0">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="font-bold text-[11px] text-[var(--cream)] truncate">Galeri IG</div>
                  <div className="text-[9px] text-[var(--muted)] truncate">@euphoria.xe11</div>
                </div>
              </button>
            </div>
          </div>

          {/* Pengaturan Akun & Tampilan */}
          <div className="pt-2 border-t border-[var(--line)] flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => { onOpenTheme(); onClose(); }}
              className="flex items-center gap-2 py-2 px-3 rounded-xl bg-[var(--surface2)] hover:bg-[var(--surface3)] text-[var(--cream)] font-medium transition-colors"
            >
              <Palette className="w-3.5 h-3.5 text-[var(--gold-soft)]" />
              <span>Tema &amp; Warna</span>
            </button>

            <button
              type="button"
              onClick={() => { onOpenChangeName(); onClose(); }}
              className="flex items-center gap-2 py-2 px-3 rounded-xl bg-[var(--surface2)] hover:bg-[var(--surface3)] text-[var(--cream)] font-medium transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-[var(--jade)]" />
              <span>Ganti Nama Login</span>
            </button>

            <button
              type="button"
              onClick={() => { onLogout(); onClose(); }}
              className="flex items-center gap-2 py-2 px-3 rounded-xl bg-[var(--surface2)] hover:bg-[var(--surface3)] text-[var(--warn)] font-medium transition-colors ml-auto"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
