import React, { useState } from 'react';
import { Student, ZoneType, DeskAssignments } from '../types';
import { deskOrder } from '../constants/initialData';
import { Copy, Check, RefreshCw, Shuffle, Edit3, Eye, Box, X } from 'lucide-react';
import { playSoftClick } from '../utils/audio';

interface DesksModuleProps {
  students: Student[];
  zones: { [deskNum: number]: ZoneType };
  assignments: DeskAssignments;
  onUpdateZones: (zones: { [deskNum: number]: ZoneType }) => void;
  onUpdateAssignments: (assignments: DeskAssignments) => void;
  onPushHistory: () => void;
  onRefresh: () => void;
  unlocked: boolean;
  statusMsg: string;
  setStatusMsg: (msg: string) => void;
}

export const DesksModule: React.FC<DesksModuleProps> = ({
  students,
  zones,
  assignments,
  onUpdateZones,
  onUpdateAssignments,
  onPushHistory,
  onRefresh,
  unlocked,
  statusMsg,
  setStatusMsg,
}) => {
  const [view3D, setView3D] = useState(false);
  const [copied, setCopied] = useState(false);
  const [modalDesk, setModalDesk] = useState<number | null>(null);
  const [seatA, setSeatA] = useState('');
  const [seatB, setSeatB] = useState('');
  const [modalErr, setModalErr] = useState('');

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

  const cycleZone = (num: number) => {
    if (!unlocked) return;
    playSoftClick();
    const cur = zones[num] || '';
    const next: ZoneType = cur === '' ? 'L' : cur === 'L' ? 'P' : '';
    const newZones = { ...zones, [num]: next };
    const newAssign = { ...assignments };
    delete newAssign[num];
    onUpdateZones(newZones);
    onUpdateAssignments(newAssign);
    setStatusMsg(`Zona Meja ${num} diubah menjadi ${next === 'L' ? 'Laki-laki' : next === 'P' ? 'Perempuan' : 'Netral'}.`);
  };

  const handleShufflePositionsOnly = () => {
    if (!unlocked) return;
    playSoftClick();
    const hasAny = Object.keys(assignments).some((d) => assignments[Number(d)] && assignments[Number(d)].length > 0);
    if (!hasAny) {
      setStatusMsg('Belum ada pasangan tempat duduk. Gunakan "Acak Posisi + Siswa" dulu.');
      return;
    }

    const bundles = deskOrder.map((d) => ({
      zone: zones[d] || '',
      assignment: assignments[d] ? [...assignments[d]] : null,
    }));

    const shuffled = shuffleArray(bundles);
    const newZones: { [deskNum: number]: ZoneType } = {};
    const newAssign: DeskAssignments = {};

    deskOrder.forEach((d, i) => {
      newZones[d] = shuffled[i].zone as ZoneType;
      if (shuffled[i].assignment) {
        newAssign[d] = shuffled[i].assignment;
      }
    });

    onUpdateZones(newZones);
    onUpdateAssignments(newAssign);
    onPushHistory();
    setStatusMsg('Posisi meja berhasil diacak! Pasangan duduk yang sudah ada tetap sama.');
  };

  const handleRandomAll = () => {
    if (!unlocked) return;
    playSoftClick();
    const boys = shuffleArray(getPresent('L'));
    const girls = shuffleArray(getPresent('P'));
    const lDesks = deskOrder.filter((d) => zones[d] === 'L');
    const pDesks = deskOrder.filter((d) => zones[d] === 'P');

    if (lDesks.length * 2 < boys.length || pDesks.length * 2 < girls.length) {
      setStatusMsg('Zona meja belum cukup untuk menampung seluruh siswa yang hadir.');
      return;
    }

    const newAssign: DeskAssignments = {};
    lDesks.forEach((d) => {
      newAssign[d] = boys.splice(0, 2);
    });
    pDesks.forEach((d) => {
      newAssign[d] = girls.splice(0, 2);
    });

    onUpdateAssignments(newAssign);
    onPushHistory();
    setStatusMsg('Tempat duduk dan posisi siswa berhasil diacak!');
  };

  const handleRandomZoneOnly = () => {
    if (!unlocked) return;
    playSoftClick();
    const boys = getPresent('L');
    const girls = getPresent('P');
    const neededL = Math.ceil(boys.length / 2);
    const neededP = Math.ceil(girls.length / 2);

    const shuffledDesks = shuffleArray(deskOrder);
    const nz: { [deskNum: number]: ZoneType } = {};
    shuffledDesks.forEach((d) => { nz[d] = ''; });
    shuffledDesks.slice(0, neededL).forEach((d) => { nz[d] = 'L'; });
    shuffledDesks.slice(neededL, neededL + neededP).forEach((d) => { nz[d] = 'P'; });

    onUpdateZones(nz);
    onUpdateAssignments({});
    setStatusMsg('Distribusi zona meja diacak. Silakan acak siswa kembali.');
  };

  const copyDesksWhatsApp = () => {
    playSoftClick();
    let text = `🪑 *DENAH TEMPAT DUDUK KELAS X E-11*\n`;
    text += `*MAN 1 SURAKARTA (2026/2027)*\n\n`;

    deskOrder.forEach((d) => {
      const z = zones[d] || 'Netral';
      const occ = assignments[d] || [];
      text += `📍 *Meja ${d}* (${z === 'L' ? 'Laki-laki' : z === 'P' ? 'Perempuan' : 'Netral'}):\n`;
      if (occ.length > 0) {
        occ.forEach((name, idx) => {
          text += `  ${idx + 1}. ${name}\n`;
        });
      } else {
        text += `  (Kosong / Belum terisi)\n`;
      }
      text += `\n`;
    });

    const absent = students.filter((s) => !s.hadir);
    if (absent.length > 0) {
      text += `❌ *Tidak Hadir:* ${absent.map((s) => `${s.no}. ${s.name}`).join(', ')}\n`;
    }

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const openModal = (d: number) => {
    setModalDesk(d);
    const occ = assignments[d] || [];
    setSeatA(occ[0] || '');
    setSeatB(occ[1] || '');
    setModalErr('');
  };

  const saveSeatModal = () => {
    if (modalDesk === null) return;
    if (seatA && seatA === seatB) {
      setModalErr('Kursi 1 dan Kursi 2 tidak boleh diisi oleh orang yang sama.');
      return;
    }

    playSoftClick();
    const newAssign = { ...assignments };
    newAssign[modalDesk] = [seatA, seatB].filter(Boolean);

    onUpdateAssignments(newAssign);
    setModalDesk(null);
    setStatusMsg(`Susunan Meja ${modalDesk} berhasil disimpan.`);
  };

  const absentList = students.filter((s) => !s.hadir);

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div>
          <h2 className="font-serif font-bold text-base sm:text-lg text-[var(--cream)] flex items-center gap-2">
            <Box className="w-5 h-5 text-[var(--gold-soft)]" />
            Denah Tempat Duduk Kelas X E-11
          </h2>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            18 Meja · 36 Kursi · Ruang Kelas X E-11 MAN 1 Surakarta
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle 2D / 3D Isometric View */}
          <button
            type="button"
            onClick={() => {
              playSoftClick();
              setView3D(!view3D);
            }}
            className={`flex items-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
              view3D
                ? 'bg-[var(--gold)] text-black border-transparent shadow-sm'
                : 'bg-[var(--surface3)] text-[var(--cream)] border-[var(--line-strong)] hover:bg-[var(--surface2)]'
            }`}
          >
            {view3D ? <Box className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{view3D ? 'Tampilan 3D Isometrik' : 'Tampilan 2D Grid'}</span>
          </button>

          <button
            type="button"
            onClick={copyDesksWhatsApp}
            className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black font-bold text-xs shadow-sm hover:brightness-105 active:scale-95 transition-all"
            title="Salin susunan denah ke format pesan WhatsApp"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin Denah WA'}</span>
          </button>
        </div>
      </div>

      {/* Classroom Canvas / Desk Grid */}
      <div
        className={`p-4 sm:p-6 rounded-3xl bg-[var(--surface)] border border-[var(--line-strong)] shadow-md transition-all ${
          view3D ? 'perspective-[1100px] overflow-x-auto' : ''
        }`}
      >
        {/* Guru Desk (Front of class) */}
        <div className="flex justify-center mb-6">
          <div
            className={`w-40 sm:w-52 py-2 text-center rounded-xl font-bold font-serif text-xs sm:text-sm text-black bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] shadow-md border border-white/20 transition-transform ${
              view3D ? 'transform -rotate-x-12 translate-z-4' : ''
            }`}
          >
            👨‍🏫 Meja Guru &amp; Papan Tulis
          </div>
        </div>

        {/* 18 Desks Grid (3 columns, 6 rows) */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 transition-transform duration-500 ${
            view3D ? 'transform rotate-x-6 scale-95 origin-top' : ''
          }`}
        >
          {deskOrder.map((num) => {
            const zone = zones[num] || '';
            const occupants = assignments[num] || [];
            const isZoneL = zone === 'L';
            const isZoneP = zone === 'P';

            return (
              <div
                key={num}
                onClick={() => cycleZone(num)}
                className={`relative p-3 sm:p-3.5 rounded-2xl border transition-all select-none flex flex-col justify-between min-h-[96px] ${
                  isZoneL
                    ? 'bg-[var(--jade-bg)] border-[var(--jade-line)] dark:bg-[#1E332B] dark:border-[#2F4A3E]'
                    : isZoneP
                    ? 'bg-[var(--rose-bg)] border-[rgba(173,100,114,0.35)] dark:bg-[#3A2028] dark:border-[#522935]'
                    : 'bg-[var(--bg2)] border-[var(--line)]'
                } ${unlocked ? 'cursor-pointer hover:border-[var(--gold-soft)]' : ''} ${
                  view3D ? 'hover:-translate-y-1 hover:shadow-lg transition-transform' : ''
                }`}
              >
                {/* Header Meja */}
                <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-1.5 mb-1.5">
                  <span className="font-bold text-[11px] text-[var(--muted)]">
                    Meja {num}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isZoneL
                        ? 'bg-[var(--jade)] text-white'
                        : isZoneP
                        ? 'bg-[var(--rose)] text-white'
                        : 'bg-[var(--line-strong)] text-[var(--muted)]'
                    }`}
                  >
                    {isZoneL ? 'Laki-laki' : isZoneP ? 'Perempuan' : 'Netral'}
                  </span>
                </div>

                {/* Occupants / Student Names */}
                <div className="text-[11px] font-bold text-[var(--cream)] space-y-1 my-auto">
                  {occupants.length > 0 ? (
                    occupants.map((name, i) => (
                      <div key={i} className="truncate" title={name}>
                        {i + 1}. {name}
                      </div>
                    ))
                  ) : (
                    <div className="text-[10px] text-[var(--muted)] italic">
                      {isZoneL ? 'Zona L (Kosong)' : isZoneP ? 'Zona P (Kosong)' : 'Belum diatur'}
                    </div>
                  )}
                </div>

                {/* Edit Button for Admin */}
                {unlocked && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(num);
                    }}
                    className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-[var(--surface2)]/80 hover:bg-[var(--surface2)] text-[var(--cream)] border border-[var(--line)] transition-colors shadow-sm"
                    title={`Atur Meja ${num}`}
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-4 border-t border-[var(--line)] text-xs text-[var(--muted)]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[var(--jade)]" />
            <span>Zona Laki-laki</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[var(--rose)]" />
            <span>Zona Perempuan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[var(--line-strong)]" />
            <span>Netral</span>
          </div>
        </div>

        {/* Absent students note */}
        {absentList.length > 0 && (
          <div className="mt-3 text-center text-[11px] text-[var(--warn)] font-medium">
            Siswa tidak hadir hari ini ({absentList.length}): {absentList.map((s) => `${s.no}. ${s.name}`).join(', ')}
          </div>
        )}
      </div>

      {/* Admin Action Bar (if unlocked) */}
      {unlocked && (
        <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleShufflePositionsOnly}
              className="flex-1 min-w-[200px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black font-bold text-xs shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Acak Posisi Meja (Pasangan Tetap)</span>
            </button>

            <button
              type="button"
              onClick={handleRandomAll}
              className="py-2.5 px-3 rounded-xl border border-[var(--line-strong)] bg-[var(--surface3)] text-[var(--cream)] font-semibold text-xs hover:bg-[var(--surface2)] transition-colors"
            >
              Acak Posisi + Siswa
            </button>

            <button
              type="button"
              onClick={handleRandomZoneOnly}
              className="py-2.5 px-3 rounded-xl border border-[var(--line-strong)] bg-[var(--surface3)] text-[var(--cream)] font-semibold text-xs hover:bg-[var(--surface2)] transition-colors"
            >
              Acak Zona Saja
            </button>

            <button
              type="button"
              onClick={onRefresh}
              className="py-2.5 px-3 rounded-xl border border-[var(--line-strong)] bg-[var(--surface3)] text-[var(--cream)] font-semibold text-xs hover:bg-[var(--surface2)] transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sinkron</span>
            </button>
          </div>

          {statusMsg && (
            <p className="text-xs text-[var(--gold-soft)] font-medium text-center">
              {statusMsg}
            </p>
          )}
        </div>
      )}

      {/* Seat Edit Modal */}
      {modalDesk !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[var(--surface)] border border-[var(--line-strong)] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
              <h3 className="font-serif font-bold text-sm text-[var(--cream)]">
                Atur Meja {modalDesk} ({zones[modalDesk] === 'L' ? 'Laki-laki' : 'Perempuan'})
              </h3>
              <button
                type="button"
                onClick={() => setModalDesk(null)}
                className="p-1 rounded-full text-[var(--muted)] hover:bg-[var(--surface2)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[var(--cream)] mb-1">
                  Kursi 1:
                </label>
                <select
                  value={seatA}
                  onChange={(e) => {
                    setSeatA(e.target.value);
                    setModalErr('');
                  }}
                  className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--bg2)] text-[var(--cream)] p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]"
                >
                  <option value="">(Kosong)</option>
                  {getPresent(zones[modalDesk] === 'L' ? 'L' : 'P').map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[var(--cream)] mb-1">
                  Kursi 2:
                </label>
                <select
                  value={seatB}
                  onChange={(e) => {
                    setSeatB(e.target.value);
                    setModalErr('');
                  }}
                  className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--bg2)] text-[var(--cream)] p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]"
                >
                  <option value="">(Kosong)</option>
                  {getPresent(zones[modalDesk] === 'L' ? 'L' : 'P').map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {modalErr && (
              <p className="text-xs text-[var(--warn)] font-semibold">
                {modalErr}
              </p>
            )}

            <div className="flex gap-2 pt-2 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={() => setModalDesk(null)}
                className="flex-1 py-2 px-3 rounded-xl border border-[var(--line-strong)] bg-[var(--surface2)] text-[var(--cream)] font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={saveSeatModal}
                className="flex-1 py-2 px-3 rounded-xl bg-[var(--gold)] text-black font-bold text-xs shadow-md hover:brightness-105"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
