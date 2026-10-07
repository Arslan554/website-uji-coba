import React, { useState } from 'react';
import { Student, UserRole } from '../types';
import { User, GraduationCap, Users } from 'lucide-react';

interface EntryGateModalProps {
  isOpen: boolean;
  students: Student[];
  currentRole: UserRole;
  currentName: string;
  currentNo: string;
  onCommit: (role: UserRole, name: string, no: string) => void;
  onClose?: () => void;
  canCancel?: boolean;
}

export const EntryGateModal: React.FC<EntryGateModalProps> = ({
  isOpen,
  students,
  currentRole,
  currentName,
  currentNo,
  onCommit,
  onClose,
  canCancel = false,
}) => {
  const [role, setRole] = useState<UserRole>(currentRole || 'siswa');
  const [selectedNo, setSelectedNo] = useState<string>(currentNo || '');
  const [teacherName, setTeacherName] = useState<string>(currentRole === 'guru' ? currentName : '');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (role === 'siswa') {
      const targetStudent = students.find((s) => String(s.no) === selectedNo);
      if (!targetStudent) {
        setErrorMsg('Silakan pilih nomor absen dan namamu terlebih dahulu.');
        return;
      }
      onCommit('siswa', targetStudent.name, String(targetStudent.no));
    } else if (role === 'guru') {
      const name = teacherName.trim() || 'Guru';
      onCommit('guru', name, '');
    } else {
      onCommit('tamu', 'Tamu', '');
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-[var(--surface)] border border-[var(--line-strong)] p-6 shadow-2xl relative overflow-hidden">
        {/* Brand header */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src="https://man1surakarta.sch.id/aduca/images/LOGOMAN1SOLO.png"
            alt="Logo MAN 1 Surakarta"
            className="w-12 h-12 object-contain shrink-0"
          />
          <div>
            <div className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
              MAN 1 Surakarta · 2026–2029
            </div>
            <h3 className="text-xl font-bold font-serif text-[var(--cream)]">
              Euphoria X E-11
            </h3>
          </div>
        </div>

        <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed">
          Pilih identitasmu sebelum mengakses portal digital kelas.
        </p>

        {/* Role Segmented Buttons */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[var(--surface3)] border border-[var(--line)] mb-4">
          <button
            type="button"
            onClick={() => { setRole('siswa'); setErrorMsg(''); }}
            className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-xs font-bold transition-all ${
              role === 'siswa'
                ? 'bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--cream)]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Siswa</span>
          </button>
          <button
            type="button"
            onClick={() => { setRole('guru'); setErrorMsg(''); }}
            className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-xs font-bold transition-all ${
              role === 'guru'
                ? 'bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--cream)]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Guru</span>
          </button>
          <button
            type="button"
            onClick={() => { setRole('tamu'); setErrorMsg(''); }}
            className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-xs font-bold transition-all ${
              role === 'tamu'
                ? 'bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--cream)]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Tamu</span>
          </button>
        </div>

        {/* Dynamic Input based on role */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {role === 'siswa' && (
            <div>
              <label htmlFor="student-select" className="block text-xs font-bold text-[var(--cream)] mb-1.5">
                Pilih namamu (sesuai no. absen):
              </label>
              <select
                id="student-select"
                value={selectedNo}
                onChange={(e) => {
                  setSelectedNo(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--bg2)] text-[var(--cream)] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]"
              >
                <option value="">— Pilih Absen &amp; Nama —</option>
                {students
                  .slice()
                  .sort((a, b) => a.no - b.no)
                  .map((s) => (
                    <option key={s.no} value={s.no}>
                      {s.no}. {s.name} ({s.g === 'L' ? 'L' : 'P'})
                    </option>
                  ))}
              </select>
              <p className="text-[10px] text-[var(--muted)] mt-1.5">
                Namamu akan otomatis dikenali saat ikut polling dan absensi kelas.
              </p>
            </div>
          )}

          {role === 'guru' && (
            <div>
              <label htmlFor="teacher-input" className="block text-xs font-bold text-[var(--cream)] mb-1.5">
                Nama Guru / Mata Pelajaran (Opsional):
              </label>
              <input
                id="teacher-input"
                type="text"
                placeholder="Contoh: Bu Rina (Matematika)"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--bg2)] text-[var(--cream)] px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]"
              />
              <p className="text-[10px] text-[var(--muted)] mt-1.5">
                Mode guru dapat melihat seluruh data kelas dan denah tanpa mengubah data siswa.
              </p>
            </div>
          )}

          {role === 'tamu' && (
            <div className="p-3 rounded-xl bg-[var(--surface2)] border border-[var(--line)]">
              <p className="text-xs text-[var(--cream)] font-medium mb-1">Mode Tamu</p>
              <p className="text-[11px] text-[var(--muted)]">
                Sebagai tamu, kamu dapat melihat jadwal, denah, info, dan galeri kelas X E-11.
              </p>
            </div>
          )}

          {errorMsg && (
            <p className="text-xs font-semibold text-[var(--warn)] mt-1">
              {errorMsg}
            </p>
          )}

          <div className="flex items-center gap-2 pt-2">
            {canCancel && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-[var(--line-strong)] bg-[var(--surface2)] text-[var(--cream)] font-bold text-xs hover:bg-[var(--surface3)] transition-colors"
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black font-bold text-xs shadow-md hover:brightness-105 active:scale-95 transition-all"
            >
              Masuk Sekarang
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
