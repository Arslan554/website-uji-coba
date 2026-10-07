import React from 'react';
import { classOfficers } from '../constants/initialData';
import { Users, Instagram, ExternalLink } from 'lucide-react';

export const StructureModule: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* STRUKTUR ORGANISASI KELAS */}
      <div className="space-y-3">
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] flex items-center justify-between gap-3 shadow-sm">
          <div>
            <h2 className="font-serif font-bold text-base sm:text-lg text-[var(--cream)] flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--gold-soft)]" />
              Struktur Pengurus Kelas X E-11
            </h2>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              Tahun Ajaran 2026/2027 · MAN 1 Surakarta
            </p>
          </div>
        </div>

        {/* Officers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {classOfficers.map((officer, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border text-center space-y-2 transition-all flex flex-col items-center justify-center ${
                officer.featured
                  ? 'col-span-2 sm:col-span-1 bg-[var(--surface)] border-[var(--gold)] ring-2 ring-[rgba(var(--accent-rgb),0.2)] shadow-md'
                  : 'bg-[var(--surface2)]/80 hover:bg-[var(--surface2)] border-[var(--line)] shadow-sm'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-serif font-bold text-lg shadow-inner ${
                  officer.featured
                    ? 'bg-gradient-to-br from-[var(--gold-soft)] to-[var(--gold)] text-black'
                    : 'bg-[var(--surface3)] text-[var(--cream)] border border-[var(--line)]'
                }`}
              >
                {officer.name.charAt(0)}
              </div>

              <div>
                <div className="font-serif font-bold text-sm text-[var(--cream)]">
                  {officer.name}
                </div>
                <div className="text-[11px] font-bold text-[var(--gold-soft)] mt-0.5">
                  {officer.role}
                </div>
                <div className="text-[10px] text-[var(--muted)] mt-0.5">
                  {officer.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GALERI INSTAGRAM KELAS */}
      <div className="space-y-3">
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-[var(--cream)] flex items-center gap-2">
              <Instagram className="w-5 h-5 text-[#ee2a7b]" />
              Dokumentasi &amp; Galeri @euphoria.xe11
            </h3>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              Koleksi poster resmi dan momen kebersamaan siswa kelas X E-11
            </p>
          </div>

          <a
            href="https://instagram.com/euphoria.xe11"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white font-bold text-xs shadow-md hover:brightness-105 active:scale-95 transition-all"
          >
            <Instagram className="w-4 h-4" />
            <span>Kunjungi @euphoria.xe11</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
          </a>
        </div>

        {/* Poster Showcase Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-2">
            <div className="aspect-[4/3] rounded-xl bg-[var(--surface2)] flex items-center justify-center p-3 text-center border border-[var(--line)]">
              <span className="font-serif font-bold text-xs text-[var(--gold-soft)]">
                Begin of Our Journey 🚀
              </span>
            </div>
            <div className="text-center font-bold text-xs text-[var(--cream)]">
              Begin of Our Journey
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-2">
            <div className="aspect-[4/3] rounded-xl bg-[var(--surface2)] flex items-center justify-center p-3 text-center border border-[var(--line)]">
              <span className="font-serif font-bold text-xs text-[var(--jade)]">
                Every Step Counts ✨
              </span>
            </div>
            <div className="text-center font-bold text-xs text-[var(--cream)]">
              Every Step Counts
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-2">
            <div className="aspect-[4/3] rounded-xl bg-[var(--surface2)] flex items-center justify-center p-3 text-center border border-[var(--line)]">
              <span className="font-serif font-bold text-xs text-[var(--rose)]">
                Estuder 2026 🎒
              </span>
            </div>
            <div className="text-center font-bold text-xs text-[var(--cream)]">
              Estuder 2026
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-2">
            <div className="aspect-[4/3] rounded-xl bg-[var(--surface2)] flex items-center justify-center p-3 text-center border border-[var(--line)]">
              <span className="font-serif font-bold text-xs text-[var(--gold-soft)]">
                Dokumentasi Festara 🎭
              </span>
            </div>
            <div className="text-center font-bold text-xs text-[var(--cream)]">
              Dokumentasi Festara
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-2 col-span-2 sm:col-span-1">
            <div className="aspect-[4/3] rounded-xl bg-[var(--surface2)] flex items-center justify-center p-3 text-center border border-[var(--line)]">
              <span className="font-serif font-bold text-xs text-[var(--cream)]">
                Greetings X E-11 👋
              </span>
            </div>
            <div className="text-center font-bold text-xs text-[var(--cream)]">
              Greetings!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
