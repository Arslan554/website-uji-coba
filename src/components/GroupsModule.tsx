import React, { useState } from 'react';
import { Student, SubjectGroupData } from '../types';
import { initialSubjects } from '../constants/initialData';
import { Copy, Check, Shuffle, Plus, Trash2, X, Users, BookOpen } from 'lucide-react';
import { playSoftClick } from '../utils/audio';

interface GroupsModuleProps {
  students: Student[];
  groupsBySubject: { [subjectName: string]: SubjectGroupData };
  onUpdateSubjectGroups: (subject: string, data: SubjectGroupData) => void;
  unlocked: boolean;
}

export const GroupsModule: React.FC<GroupsModuleProps> = ({
  students,
  groupsBySubject,
  onUpdateSubjectGroups,
  unlocked,
}) => {
  const [currentSubject, setCurrentSubject] = useState<string>('Matematika');
  const [customSubject, setCustomSubject] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [groupMode, setGroupMode] = useState<'mix' | 'L' | 'P'>('mix');
  const [groupCount, setGroupCount] = useState<number>(4);
  const [copied, setCopied] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('');

  const activeSubject = isCustomMode ? (customSubject.trim() || 'Lainnya') : currentSubject;
  const currentData: SubjectGroupData = groupsBySubject[activeSubject] || {
    mode: 'mix',
    count: 4,
    groups: [],
    time: '',
  };

  const shuffleArray = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const getPresent = (gender: 'L' | 'P') => {
    return students
      .filter((s) => s.g === gender && s.hadir)
      .map((s) => `${s.no}. ${s.name}`);
  };

  // Siswa yang belum masuk kelompok
  const usedMembers = new Set<string>();
  currentData.groups.forEach((g) => g.forEach((m) => usedMembers.add(m)));
  const unassigned = students
    .filter((s) => s.hadir && !usedMembers.has(`${s.no}. ${s.name}`))
    .map((s) => `${s.no}. ${s.name}`);

  const rollGroups = () => {
    if (!unlocked) return;
    playSoftClick();

    const boys = shuffleArray(getPresent('L'));
    const girls = shuffleArray(getPresent('P'));
    const n = Math.max(2, groupCount);
    const groups: string[][] = Array.from({ length: n }, () => []);

    if (groupMode === 'L') {
      if (!boys.length) {
        setStatusMsg('Tidak ada siswa laki-laki yang hadir.');
        return;
      }
      boys.forEach((name, i) => groups[i % n].push(name));
    } else if (groupMode === 'P') {
      if (!girls.length) {
        setStatusMsg('Tidak ada siswa perempuan yang hadir.');
        return;
      }
      girls.forEach((name, i) => groups[i % n].push(name));
    } else {
      if (!boys.length && !girls.length) {
        setStatusMsg('Tidak ada siswa yang hadir.');
        return;
      }
      boys.forEach((name, i) => groups[i % n].push(name));
      girls.forEach((name, i) => groups[i % n].push(name));
    }

    const newData: SubjectGroupData = {
      mode: groupMode,
      count: n,
      groups,
      time: new Date().toLocaleString('id-ID'),
    };

    onUpdateSubjectGroups(activeSubject, newData);
    setStatusMsg(`Kelompok mata pelajaran ${activeSubject} berhasil diacak!`);
  };

  const copyGroupsWhatsApp = () => {
    playSoftClick();
    if (!currentData.groups || currentData.groups.length === 0) {
      return;
    }

    let text = `👥 *PEMBAGIAN KELOMPOK - ${activeSubject.toUpperCase()}*\n`;
    text += `*KELAS X E-11 MAN 1 SURAKARTA*\n`;
    text += `🗓 Terakhir diacak: ${currentData.time || '-'}\n\n`;

    currentData.groups.forEach((members, idx) => {
      text += `📌 *Kelompok ${idx + 1} (${members.length} siswa):*\n`;
      if (members.length === 0) {
        text += `  (Kosong)\n`;
      } else {
        members.forEach((m, i) => {
          text += `  ${i + 1}. ${m}\n`;
        });
      }
      text += `\n`;
    });

    if (unassigned.length > 0) {
      text += `⚠️ *Belum Masuk Kelompok (${unassigned.length} siswa):*\n`;
      unassigned.forEach((m) => {
        text += `- ${m}\n`;
      });
    }

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const removeGroup = (idx: number) => {
    if (!unlocked) return;
    playSoftClick();
    const newGroups = currentData.groups.filter((_, i) => i !== idx);
    onUpdateSubjectGroups(activeSubject, {
      ...currentData,
      groups: newGroups,
      time: new Date().toLocaleString('id-ID'),
    });
  };

  const addManualGroup = () => {
    if (!unlocked) return;
    playSoftClick();
    const newGroups = [...currentData.groups, []];
    onUpdateSubjectGroups(activeSubject, {
      ...currentData,
      groups: newGroups,
      time: new Date().toLocaleString('id-ID'),
    });
  };

  const removeMember = (groupIdx: number, memberName: string) => {
    if (!unlocked) return;
    playSoftClick();
    const newGroups = currentData.groups.map((grp, i) => {
      if (i === groupIdx) return grp.filter((m) => m !== memberName);
      return grp;
    });
    onUpdateSubjectGroups(activeSubject, {
      ...currentData,
      groups: newGroups,
      time: new Date().toLocaleString('id-ID'),
    });
  };

  const addMember = (groupIdx: number, memberName: string) => {
    if (!unlocked || !memberName) return;
    playSoftClick();
    const newGroups = currentData.groups.map((grp, i) => {
      if (i === groupIdx) return [...grp, memberName];
      return grp;
    });
    onUpdateSubjectGroups(activeSubject, {
      ...currentData,
      groups: newGroups,
      time: new Date().toLocaleString('id-ID'),
    });
  };

  return (
    <div className="space-y-4">
      {/* Subject Picker Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] space-y-3 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[var(--gold-soft)]" />
            <h2 className="font-serif font-bold text-base sm:text-lg text-[var(--cream)]">
              Bagi Kelompok Per Mata Pelajaran
            </h2>
          </div>

          {currentData.groups.length > 0 && (
            <button
              type="button"
              onClick={copyGroupsWhatsApp}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black font-bold text-xs shadow-sm hover:brightness-105 active:scale-95 transition-all"
              title="Salin hasil kelompok ke WhatsApp"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Kelompok WA'}</span>
            </button>
          )}
        </div>

        <p className="text-xs text-[var(--muted)]">
          Tiap mata pelajaran memiliki data kelompok tersendiri dan tidak akan saling menimpa.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <select
            value={isCustomMode ? '__custom__' : currentSubject}
            onChange={(e) => {
              playSoftClick();
              if (e.target.value === '__custom__') {
                setIsCustomMode(true);
              } else {
                setIsCustomMode(false);
                setCurrentSubject(e.target.value);
              }
            }}
            className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--bg2)] text-[var(--cream)] p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]"
          >
            {initialSubjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
            <option value="__custom__">Lainnya (Tulis Manual)...</option>
          </select>

          {isCustomMode && (
            <input
              type="text"
              placeholder="Tulis nama mata pelajaran kustom..."
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--bg2)] text-[var(--cream)] p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]"
            />
          )}
        </div>

        <div className="text-[11px] text-[var(--muted)]">
          Mata Pelajaran Aktif: <strong className="text-[var(--gold-soft)] font-serif">{activeSubject}</strong>
          {currentData.time && ` · Terakhir diacak: ${currentData.time}`}
        </div>
      </div>

      {/* Group Generation Controls (if unlocked) */}
      {unlocked && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-[var(--cream)]">
              Pengaturan Pengacakan
            </h3>
            <span className="text-xs text-[var(--muted)]">Khusus Admin</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Gender Mode */}
            <div>
              <label className="block text-[11px] font-bold text-[var(--cream)] mb-1.5">
                Mode Gender Anggota:
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[var(--surface3)] border border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setGroupMode('mix')}
                  className={`py-1.5 text-center rounded-lg font-bold text-xs transition-all ${
                    groupMode === 'mix'
                      ? 'bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black shadow-sm'
                      : 'text-[var(--muted)] hover:text-[var(--cream)]'
                  }`}
                >
                  Campur
                </button>
                <button
                  type="button"
                  onClick={() => setGroupMode('L')}
                  className={`py-1.5 text-center rounded-lg font-bold text-xs transition-all ${
                    groupMode === 'L'
                      ? 'bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black shadow-sm'
                      : 'text-[var(--muted)] hover:text-[var(--cream)]'
                  }`}
                >
                  Hanya L
                </button>
                <button
                  type="button"
                  onClick={() => setGroupMode('P')}
                  className={`py-1.5 text-center rounded-lg font-bold text-xs transition-all ${
                    groupMode === 'P'
                      ? 'bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black shadow-sm'
                      : 'text-[var(--muted)] hover:text-[var(--cream)]'
                  }`}
                >
                  Hanya P
                </button>
              </div>
            </div>

            {/* Group Count Stepper */}
            <div>
              <label className="block text-[11px] font-bold text-[var(--cream)] mb-1.5">
                Jumlah Kelompok:
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setGroupCount((prev) => Math.max(2, prev - 1))}
                  className="w-9 h-9 rounded-xl border border-[var(--line-strong)] bg-[var(--surface3)] text-[var(--cream)] font-bold text-base hover:bg-[var(--surface2)] active:scale-95 transition-all"
                >
                  -
                </button>
                <span className="font-serif font-bold text-lg text-[var(--gold-soft)] w-10 text-center">
                  {groupCount}
                </span>
                <button
                  type="button"
                  onClick={() => setGroupCount((prev) => Math.min(14, prev + 1))}
                  className="w-9 h-9 rounded-xl border border-[var(--line-strong)] bg-[var(--surface3)] text-[var(--cream)] font-bold text-base hover:bg-[var(--surface2)] active:scale-95 transition-all"
                >
                  +
                </button>
                <span className="text-xs text-[var(--muted)]">kelompok</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-[var(--line)]">
            <button
              type="button"
              onClick={rollGroups}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black font-bold text-xs shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Acak Kelompok {activeSubject}</span>
            </button>
            <button
              type="button"
              onClick={addManualGroup}
              className="py-2.5 px-3 rounded-xl border border-[var(--line-strong)] bg-[var(--surface3)] text-[var(--cream)] font-semibold text-xs hover:bg-[var(--surface2)] transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Kelompok</span>
            </button>
          </div>

          {statusMsg && (
            <p className="text-xs text-[var(--gold-soft)] font-medium text-center">
              {statusMsg}
            </p>
          )}
        </div>
      )}

      {/* Unassigned Students Notice */}
      {unlocked && unassigned.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] space-y-1">
          <div className="font-bold text-xs text-[var(--cream)] flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[var(--warn)]" />
            <span>Siswa belum masuk kelompok ({unassigned.length}):</span>
          </div>
          <p className="text-[11px] text-[var(--muted)] leading-relaxed">
            {unassigned.join(', ')}
          </p>
        </div>
      )}

      {/* Group Cards Grid */}
      {currentData.groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentData.groups.map((members, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
                <h4 className="font-serif font-bold text-sm text-[var(--cream)]">
                  Kelompok {idx + 1} ({members.length} siswa)
                </h4>
                {unlocked && (
                  <button
                    type="button"
                    onClick={() => removeGroup(idx)}
                    className="p-1 rounded-lg text-[var(--warn)] hover:bg-[var(--surface2)] transition-colors"
                    title="Hapus kelompok ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {members.length === 0 ? (
                <div className="text-xs text-[var(--muted)] italic py-4 text-center">
                  (Kelompok kosong)
                </div>
              ) : (
                <ul className="space-y-1 text-xs">
                  {members.map((name, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-[var(--surface2)] transition-colors"
                    >
                      <span className="text-[var(--cream)] font-medium truncate">
                        {i + 1}. {name}
                      </span>
                      {unlocked && (
                        <button
                          type="button"
                          onClick={() => removeMember(idx, name)}
                          className="text-[var(--warn)] font-bold text-xs p-1 ml-1 hover:scale-110"
                          title="Keluarkan dari kelompok"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {/* Add unassigned student to this group */}
              {unlocked && unassigned.length > 0 && (
                <div className="pt-2 border-t border-[var(--line)]">
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        addMember(idx, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--bg2)] text-[var(--cream)] p-2 text-xs focus:outline-none"
                  >
                    <option value="">+ Tambah siswa...</option>
                    {unassigned.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center rounded-2xl bg-[var(--surface2)] border border-[var(--line)] text-xs text-[var(--muted)]">
          Belum ada pembagian kelompok untuk mata pelajaran <strong>{activeSubject}</strong>.
          {unlocked && ' Silakan tekan tombol "Acak Kelompok" di atas.'}
        </div>
      )}
    </div>
  );
};
