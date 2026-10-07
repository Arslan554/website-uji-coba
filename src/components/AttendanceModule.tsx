import React, { useState } from 'react';
import { Student } from '../types';
import { Search, Copy, Check, Users, UserPlus } from 'lucide-react';
import { playSoftClick } from '../utils/audio';

interface AttendanceModuleProps {
  students: Student[];
  onToggleHadir: (no: number, hadir: boolean) => void;
  onUpdateRoster: (roster: Student[]) => void;
  unlocked: boolean;
}

export const AttendanceModule: React.FC<AttendanceModuleProps> = ({
  students,
  onToggleHadir,
  onUpdateRoster,
  unlocked,
}) => {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const [showRosterEditor, setShowRosterEditor] = useState(false);
  const [rosterText, setRosterText] = useState('');

  const filterLower = search.trim().toLowerCase();
  const sorted = [...students].sort((a, b) => a.no - b.no);

  const boys = sorted.filter((s) => s.g === 'L');
  const girls = sorted.filter((s) => s.g === 'P');

  const boysFiltered = boys.filter((s) => !filterLower || s.name.toLowerCase().includes(filterLower));
  const girlsFiltered = girls.filter((s) => !filterLower || s.name.toLowerCase().includes(filterLower));

  const boysHadir = boys.filter((s) => s.hadir).length;
  const girlsHadir = girls.filter((s) => s.hadir).length;
  const totalHadir = boysHadir + girlsHadir;
  const totalStudents = students.length;

  const copyReport = () => {
    playSoftClick();
    const absent = sorted.filter((s) => !s.hadir);
    const dateStr = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    let text = `📋 *PRESENSI KELAS X E-11 MAN 1 SURAKARTA*\n`;
    text += `🗓 *Hari/Tanggal:* ${dateStr}\n`;
    text += `👥 *Total Hadir:* ${totalHadir}/${totalStudents} siswa (${Math.round((totalHadir / (totalStudents || 1)) * 100)}%)\n`;
    text += `👦 *Laki-laki:* ${boysHadir}/${boys.length} hadir\n`;
    text += `👧 *Perempuan:* ${girlsHadir}/${girls.length} hadir\n\n`;

    if (absent.length === 0) {
      text += `✅ *Alhamdulillah, semua siswa hadir lengkap!*`;
    } else {
      text += `❌ *Tidak Hadir (${absent.length} siswa):*\n`;
      absent.forEach((s) => {
        text += `- No. ${s.no} ${s.name} (${s.g === 'L' ? 'Laki-laki' : 'Perempuan'})\n`;
      });
    }

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const openEditor = () => {
    setShowRosterEditor(!showRosterEditor);
    if (!showRosterEditor) {
      const text = sorted.map((s) => `${s.no},${s.name},${s.g}`).join('\n');
      setRosterText(text);
    }
  };

  const saveRoster = () => {
    playSoftClick();
    const lines = rosterText.split('\n').map((l) => l.trim()).filter(Boolean);
    const out: Student[] = [];

    lines.forEach((line) => {
      const parts = line.split(',');
      if (parts.length < 3) return;
      const no = parseInt(parts[0], 10);
      const g = parts[parts.length - 1].trim().toUpperCase() as 'L' | 'P';
      const name = parts.slice(1, parts.length - 1).join(',').trim();
      if (!no || !name || (g !== 'L' && g !== 'P')) return;
      out.push({ no, name, g, hadir: true });
    });

    if (out.length > 0) {
      onUpdateRoster(out);
      setShowRosterEditor(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div>
          <h2 className="font-serif font-bold text-base sm:text-lg text-[var(--cream)] flex items-center gap-2">
            <Users className="w-5 h-5 text-[var(--gold-soft)]" />
            Daftar Peserta &amp; Presensi
          </h2>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Total {totalHadir} dari {totalStudents} siswa hadir ({Math.round((totalHadir / (totalStudents || 1)) * 100)}%)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyReport}
            className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black font-bold text-xs shadow-sm hover:brightness-105 active:scale-95 transition-all"
            title="Salin laporan presensi ke WhatsApp"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin Laporan WA'}</span>
          </button>

          {unlocked && (
            <button
              type="button"
              onClick={openEditor}
              className="flex items-center gap-1.5 py-2 px-3 rounded-xl border border-[var(--line-strong)] bg-[var(--surface3)] text-[var(--cream)] font-semibold text-xs hover:bg-[var(--surface2)] transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{showRosterEditor ? 'Tutup Editor' : 'Kelola Siswa'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Roster Editor Drawer (if unlocked) */}
      {unlocked && showRosterEditor && (
        <div className="p-4 rounded-2xl bg-[var(--surface3)] border border-[var(--line-strong)] space-y-2 animate-slide-up">
          <p className="text-xs font-semibold text-[var(--cream)]">
            Format: nomor,nama,L atau P (satu baris satu siswa)
          </p>
          <textarea
            value={rosterText}
            onChange={(e) => setRosterText(e.target.value)}
            rows={8}
            className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--bg2)] text-[var(--cream)] p-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]"
            spellCheck={false}
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={saveRoster}
              className="py-2 px-4 rounded-xl bg-[var(--gold)] text-black font-bold text-xs shadow-sm hover:brightness-105"
            >
              Simpan Daftar Siswa
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Cari nama siswa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--bg2)] text-[var(--cream)] pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]"
        />
      </div>

      {/* Boys & Girls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Laki-laki */}
        <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--jade)]" />
              <h3 className="font-serif font-bold text-sm text-[var(--cream)]">
                Laki-laki
              </h3>
            </div>
            <span className="text-xs font-semibold text-[var(--muted)]">
              {boysHadir} / {boys.length} hadir
            </span>
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {boysFiltered.map((s) => (
              <div
                key={s.no}
                className="flex items-center justify-between p-2 rounded-xl bg-[var(--surface3)]/60 hover:bg-[var(--surface3)] border border-transparent hover:border-[var(--line)] transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-[var(--jade-bg)] text-[var(--jade)] font-bold text-[11px] flex items-center justify-center shrink-0">
                    {s.no}
                  </span>
                  <span
                    className={`text-xs font-medium truncate ${
                      s.hadir ? 'text-[var(--cream)]' : 'line-through text-[var(--muted)]'
                    }`}
                  >
                    {s.name}
                  </span>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
                  <input
                    type="checkbox"
                    checked={s.hadir}
                    disabled={!unlocked}
                    onChange={(e) => {
                      playSoftClick();
                      onToggleHadir(s.no, e.target.checked);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-[#DDD0A9] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--jade)] peer-disabled:opacity-50"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Perempuan */}
        <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--rose)]" />
              <h3 className="font-serif font-bold text-sm text-[var(--cream)]">
                Perempuan
              </h3>
            </div>
            <span className="text-xs font-semibold text-[var(--muted)]">
              {girlsHadir} / {girls.length} hadir
            </span>
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {girlsFiltered.map((s) => (
              <div
                key={s.no}
                className="flex items-center justify-between p-2 rounded-xl bg-[var(--surface3)]/60 hover:bg-[var(--surface3)] border border-transparent hover:border-[var(--line)] transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-[var(--rose-bg)] text-[var(--rose)] font-bold text-[11px] flex items-center justify-center shrink-0">
                    {s.no}
                  </span>
                  <span
                    className={`text-xs font-medium truncate ${
                      s.hadir ? 'text-[var(--cream)]' : 'line-through text-[var(--muted)]'
                    }`}
                  >
                    {s.name}
                  </span>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
                  <input
                    type="checkbox"
                    checked={s.hadir}
                    disabled={!unlocked}
                    onChange={(e) => {
                      playSoftClick();
                      onToggleHadir(s.no, e.target.checked);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-[#DDD0A9] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--rose)] peer-disabled:opacity-50"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
