import React, { useState } from 'react';
import { jadwalData, jadwalDays, jsDayToName, PeriodItem } from '../constants/initialData';
import { Bell, Copy, Check, Calendar } from 'lucide-react';
import { playSoftClick } from '../utils/audio';

interface ScheduleModuleProps {
  alarmEnabled: boolean;
  onToggleAlarm: (enabled: boolean) => void;
}

export const ScheduleModule: React.FC<ScheduleModuleProps> = ({
  alarmEnabled,
  onToggleAlarm,
}) => {
  const todayName = jsDayToName[new Date().getDay()] || 'Senin';
  const [selectedDay, setSelectedDay] = useState<string>(todayName);
  const [copied, setCopied] = useState(false);

  const periods: PeriodItem[] = jadwalData[selectedDay] || [];

  const copyScheduleWhatsApp = () => {
    playSoftClick();
    let text = `📚 *JADWAL PELAJARAN HARI ${selectedDay.toUpperCase()}*\n`;
    text += `*KELAS X E-11 MAN 1 SURAKARTA*\n\n`;

    let jamCount = 0;
    periods.forEach((p) => {
      if (p.brk) {
        text += `☕ *Istirahat:* ${p.t}\n`;
      } else {
        jamCount++;
        text += `🔹 Jam ${jamCount} (${p.t}): *${p.s}*${p.r ? ` (R. ${p.r})` : ''}\n`;
      }
    });

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div>
          <h2 className="font-serif font-bold text-base sm:text-lg text-[var(--cream)] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[var(--gold-soft)]" />
            Jadwal Pelajaran Kelas X E-11
          </h2>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Tahun Ajaran 2026/2027 · MAN 1 Surakarta
          </p>
        </div>

        <button
          type="button"
          onClick={copyScheduleWhatsApp}
          className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black font-bold text-xs shadow-sm hover:brightness-105 active:scale-95 transition-all"
          title="Salin jadwal hari yang dipilih ke WhatsApp"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Tersalin!' : `Salin Jadwal ${selectedDay}`}</span>
        </button>
      </div>

      {/* Alarm Banner & Toggle */}
      <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--jade-bg)] text-[var(--jade)] flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs sm:text-sm text-[var(--cream)]">
              Alarm Akhir Pelajaran Otomatis
            </div>
            <p className="text-[11px] text-[var(--muted)]">
              Bunyi notifikasi merdu &amp; getar tiap jam pelajaran berakhir
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={alarmEnabled}
            onChange={(e) => {
              playSoftClick();
              onToggleAlarm(e.target.checked);
            }}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-[#DDD0A9] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--jade)]"></div>
        </label>
      </div>

      {/* Day Selector Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {jadwalDays.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => {
              playSoftClick();
              setSelectedDay(d);
            }}
            className={`py-2 px-4 rounded-2xl font-bold text-xs whitespace-nowrap transition-all ${
              selectedDay === d
                ? 'bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black shadow-sm'
                : 'bg-[var(--surface2)] text-[var(--muted)] hover:text-[var(--cream)] border border-[var(--line)]'
            }`}
          >
            {d} {d === todayName && '· Hari Ini'}
          </button>
        ))}
      </div>

      {/* Schedule Rows */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[var(--surface)] border border-[var(--line-strong)] shadow-sm space-y-2">
        {periods.map((p, idx) => {
          if (p.brk) {
            return (
              <div
                key={idx}
                className="py-2.5 px-3 rounded-xl bg-[var(--surface3)]/60 border border-dashed border-[var(--line)] text-center text-xs font-semibold text-[var(--muted)]"
              >
                ☕ Istirahat ({p.t})
              </div>
            );
          }

          return (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface2)]/60 hover:bg-[var(--surface2)] border border-[var(--line)] transition-colors gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-16 text-center py-1 px-2 rounded-lg bg-[var(--surface3)] font-mono font-bold text-[11px] text-[var(--gold-soft)] shrink-0">
                  {p.t}
                </span>
                <span className="font-bold text-xs sm:text-sm text-[var(--cream)] truncate">
                  {p.s}
                </span>
              </div>

              {p.r && (
                <span className="py-1 px-2.5 rounded-lg bg-[var(--jade-bg)] text-[var(--jade)] font-bold text-[11px] shrink-0 border border-[var(--jade-line)]">
                  R. {p.r}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
