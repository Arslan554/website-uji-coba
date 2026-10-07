import React, { useState, useEffect } from 'react';
import { TabName, DisplayMode, UserRole } from '../types';
import {
  Monitor,
  Smartphone,
  Lock,
  Unlock,
  Palette,
  UserCheck,
  LogOut,
  Clock,
  Sparkles
} from 'lucide-react';
import { playSoftClick } from '../utils/audio';

interface DesktopHeaderProps {
  activeTab: TabName;
  onNavigateTab: (tab: TabName) => void;
  displayMode: DisplayMode;
  onSetDisplayMode: (mode: DisplayMode) => void;
  onOpenTheme: () => void;
  onOpenGate: () => void;
  onLogout: () => void;
  unlocked: boolean;
  onToggleLock: () => void;
  userRole: UserRole;
  userName: string;
  userNo: string;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  activeTab,
  onNavigateTab,
  displayMode,
  onSetDisplayMode,
  onOpenTheme,
  onOpenGate,
  onLogout,
  unlocked,
  onToggleLock,
  userRole,
  userName,
  userNo,
}) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[var(--surface)]/90 backdrop-blur-xl border-b border-[var(--line-strong)] shadow-sm px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <div
          onClick={() => {
            playSoftClick();
            onNavigateTab('home');
          }}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <img
            src="https://man1surakarta.sch.id/aduca/images/LOGOMAN1SOLO.png"
            alt="Logo MAN 1 Surakarta"
            className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-base sm:text-lg text-[var(--cream)] tracking-tight">
                Euphoria X E-11
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[var(--gold)]/20 text-[var(--gold-dim)] dark:text-[var(--gold-soft)] border border-[var(--gold)]/30">
                MAN 1 Surakarta
              </span>
            </div>
            <div className="text-[11px] text-[var(--muted)] font-serif italic">
              "From Strangers to Family" · 2026–2029
            </div>
          </div>
        </div>

        {/* Live Clock & Navigation */}
        <div className="hidden md:flex items-center gap-1.5 bg-[var(--surface2)]/80 p-1 rounded-2xl border border-[var(--line)]">
          <button
            type="button"
            onClick={() => onNavigateTab('home')}
            className={`py-1.5 px-3 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'home'
                ? 'bg-[var(--gold)] text-black shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--cream)]'
            }`}
          >
            Beranda
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('denah')}
            className={`py-1.5 px-3 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'denah'
                ? 'bg-[var(--gold)] text-black shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--cream)]'
            }`}
          >
            Denah 3D
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('peserta')}
            className={`py-1.5 px-3 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'peserta'
                ? 'bg-[var(--gold)] text-black shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--cream)]'
            }`}
          >
            Peserta
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('kelompok')}
            className={`py-1.5 px-3 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'kelompok'
                ? 'bg-[var(--gold)] text-black shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--cream)]'
            }`}
          >
            Kelompok
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('spin')}
            className={`py-1.5 px-3 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'spin'
                ? 'bg-[var(--gold)] text-black shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--cream)]'
            }`}
          >
            Spin
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('jadwal')}
            className={`py-1.5 px-3 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'jadwal'
                ? 'bg-[var(--gold)] text-black shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--cream)]'
            }`}
          >
            Jadwal
          </button>
        </div>

        {/* Right Tools & Mode Switcher */}
        <div className="flex items-center gap-2">
          {/* Live Clock Pill */}
          <div className="hidden xl:flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-[var(--surface2)] border border-[var(--line)] text-[11px] font-mono text-[var(--muted)]">
            <Clock className="w-3.5 h-3.5 text-[var(--gold-soft)]" />
            <span>{timeStr} WIB</span>
          </div>

          {/* Quick Switch to Mobile Mode */}
          <button
            type="button"
            onClick={() => onSetDisplayMode(displayMode === 'desktop' ? 'mobile' : 'desktop')}
            className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl border border-[var(--line-strong)] bg-[var(--surface2)] hover:bg-[var(--surface3)] text-xs font-semibold text-[var(--cream)] transition-all"
            title="Beralih ke Mode HP Ringan / Komputer 3D"
          >
            {displayMode === 'desktop' ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-[var(--gold-soft)]" />
                <span className="hidden sm:inline text-[11px]">Mode PC</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[var(--jade)]" />
                <span className="hidden sm:inline text-[11px]">Mode HP</span>
              </>
            )}
          </button>

          {/* Theme Palette */}
          <button
            type="button"
            onClick={onOpenTheme}
            className="p-2 rounded-xl border border-[var(--line-strong)] bg-[var(--surface2)] hover:bg-[var(--surface3)] text-[var(--muted)] hover:text-[var(--cream)] transition-colors"
            title="Ganti Tema Warna & Mode Gelap"
          >
            <Palette className="w-4 h-4 text-[var(--gold-soft)]" />
          </button>

          {/* User Role / Identity Pill */}
          <button
            type="button"
            onClick={onOpenGate}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-[var(--line-strong)] bg-[var(--surface2)] hover:bg-[var(--surface3)] text-xs font-medium text-[var(--cream)] max-w-[160px] truncate"
            title="Ganti Identitas Siswa / Guru / Tamu"
          >
            <UserCheck className="w-3.5 h-3.5 text-[var(--jade)] shrink-0" />
            <span className="truncate text-[11px]">
              {userRole === 'siswa' && userName
                ? `${userNo ? `${userNo}. ` : ''}${userName.split(' ')[0]}`
                : userRole === 'guru'
                ? `Guru`
                : 'Tamu'}
            </span>
          </button>

          {/* Admin Lock Button */}
          <button
            type="button"
            onClick={onToggleLock}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl font-bold text-xs transition-all ${
              unlocked
                ? 'bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black shadow-sm ring-2 ring-[rgba(var(--accent-rgb),0.3)]'
                : 'border border-[var(--line-strong)] bg-[var(--surface2)] text-[var(--muted)] hover:text-[var(--cream)]'
            }`}
          >
            {unlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{unlocked ? 'Admin' : 'Pencari Info'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
