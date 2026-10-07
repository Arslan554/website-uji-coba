import React, { useState, useEffect } from 'react';
import { TaskItem, CountdownItem, InfoItem } from '../types';
import { CheckSquare, Hourglass, Bell, Plus, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { playSoftClick } from '../utils/audio';

interface TasksModuleProps {
  tasks: TaskItem[];
  countdowns: CountdownItem[];
  infoItems: InfoItem[];
  onToggleTask: (id: string, done: boolean) => void;
  onAddTask: (title: string, subject: string, deadline: string) => void;
  onDeleteTask: (id: string) => void;
  onAddCountdown: (name: string, target: string) => void;
  onDeleteCountdown: (id: string) => void;
  onAddInfo: (title: string, body: string) => void;
  onDeleteInfo: (id: string) => void;
  unlocked: boolean;
}

export const TasksModule: React.FC<TasksModuleProps> = ({
  tasks,
  countdowns,
  infoItems,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onAddCountdown,
  onDeleteCountdown,
  onAddInfo,
  onDeleteInfo,
  unlocked,
}) => {
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubj, setTaskSubj] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');

  const [cdName, setCdName] = useState('');
  const [cdTarget, setCdTarget] = useState('');

  const [infoTitle, setInfoTitle] = useState('');
  const [infoBody, setInfoBody] = useState('');

  // Live timer tick for countdowns
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = new Date().toISOString().slice(0, 10);

  const filteredTasks = tasks
    .slice()
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .filter((t) => {
      if (taskFilter === 'pending') return !t.done;
      if (taskFilter === 'done') return t.done;
      return true;
    });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlocked) return;
    if (!taskTitle.trim() || !taskDeadline) return;
    playSoftClick();

    onAddTask(taskTitle.trim(), taskSubj.trim(), taskDeadline);
    setTaskTitle('');
    setTaskSubj('');
    setTaskDeadline('');
  };

  const handleCreateCd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlocked) return;
    if (!cdName.trim() || !cdTarget) return;
    playSoftClick();

    onAddCountdown(cdName.trim(), new Date(cdTarget).toISOString());
    setCdName('');
    setCdTarget('');
  };

  const handleCreateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlocked) return;
    if (!infoTitle.trim() || !infoBody.trim()) return;
    playSoftClick();

    onAddInfo(infoTitle.trim(), infoBody.trim());
    setInfoTitle('');
    setInfoBody('');
  };

  const formatCountdown = (targetIso: string) => {
    const diff = new Date(targetIso).getTime() - Date.now();
    if (diff <= 0) return 'Sudah terlaksana / lewat';
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${d}h ${h}j ${m}m ${s}d`;
  };

  return (
    <div className="space-y-6">
      {/* TUGAS & DEADLINE SECTION */}
      <div className="space-y-3">
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div>
            <h2 className="font-serif font-bold text-base sm:text-lg text-[var(--cream)] flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-[var(--jade)]" />
              Tugas &amp; Deadline Kelas
            </h2>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              Pantau tugas mata pelajaran dan jangan lewatkan tenggat waktu
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1 p-1 rounded-xl bg-[var(--surface3)] border border-[var(--line)]">
            <button
              type="button"
              onClick={() => setTaskFilter('all')}
              className={`py-1 px-2.5 rounded-lg font-bold text-xs transition-all ${
                taskFilter === 'all'
                  ? 'bg-[var(--gold)] text-black shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--cream)]'
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setTaskFilter('pending')}
              className={`py-1 px-2.5 rounded-lg font-bold text-xs transition-all ${
                taskFilter === 'pending'
                  ? 'bg-[var(--gold)] text-black shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--cream)]'
              }`}
            >
              Belum
            </button>
            <button
              type="button"
              onClick={() => setTaskFilter('done')}
              className={`py-1 px-2.5 rounded-lg font-bold text-xs transition-all ${
                taskFilter === 'done'
                  ? 'bg-[var(--gold)] text-black shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--cream)]'
              }`}
            >
              Selesai
            </button>
          </div>
        </div>

        {/* Admin Add Task Form */}
        {unlocked && (
          <form onSubmit={handleCreateTask} className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] space-y-3">
            <span className="text-xs font-bold font-serif text-[var(--cream)] block">
              + Tambah Tugas Baru
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Judul tugas..."
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="rounded-xl border border-[var(--line-strong)] bg-[var(--bg2)] text-[var(--cream)] p-2 text-xs focus:outline-none"
              />
              <input
                type="text"
                placeholder="Mata pelajaran (opsional)..."
                value={taskSubj}
                onChange={(e) => setTaskSubj(e.target.value)}
                className="rounded-xl border border-[var(--line-strong)] bg-[var(--bg2)] text-[var(--cream)] p-2 text-xs focus:outline-none"
              />
              <input
                type="date"
                value={taskDeadline}
                onChange={(e) => setTaskDeadline(e.target.value)}
                className="rounded-xl border border-[var(--line-strong)] bg-[var(--bg2)] text-[var(--cream)] p-2 text-xs focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black font-bold text-xs shadow-md hover:brightness-105"
            >
              Simpan Tugas
            </button>
          </form>
        )}

        {/* Task Item List */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[var(--surface)] border border-[var(--line-strong)] shadow-sm space-y-2">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((t) => {
              const isOverdue = !t.done && t.deadline < todayStr;
              return (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface2)]/60 hover:bg-[var(--surface2)] border border-[var(--line)] gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={t.done}
                      disabled={!unlocked}
                      onChange={(e) => {
                        playSoftClick();
                        onToggleTask(t.id, e.target.checked);
                      }}
                      className="w-4 h-4 rounded text-[var(--gold)] accent-[var(--gold)] cursor-pointer shrink-0 disabled:cursor-default"
                    />
                    <div className="min-w-0">
                      <div
                        className={`text-xs sm:text-sm font-bold truncate ${
                          t.done ? 'line-through text-[var(--muted)]' : 'text-[var(--cream)]'
                        }`}
                      >
                        {t.title}
                      </div>
                      <div className="text-[11px] text-[var(--muted)] flex items-center gap-2 mt-0.5">
                        {t.subject && <span>{t.subject} ·</span>}
                        <span className={isOverdue ? 'text-[var(--warn)] font-bold flex items-center gap-1' : ''}>
                          {isOverdue && <AlertCircle className="w-3 h-3" />}
                          Tenggat: {t.deadline}
                          {isOverdue && ' (Lewat Deadline)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {unlocked && (
                    <button
                      type="button"
                      onClick={() => onDeleteTask(t.id)}
                      className="p-1.5 text-[var(--warn)] hover:bg-[var(--surface3)] rounded-lg shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-xs text-[var(--muted)] py-4 text-center">
              Tidak ada tugas dalam kategori ini.
            </div>
          )}
        </div>
      </div>

      {/* COUNTDOWN & INFO DUAL COLUMN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* COUNTDOWN SECTION */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-[var(--cream)] flex items-center gap-2">
              <Hourglass className="w-4 h-4 text-[var(--gold-soft)]" />
              Countdown Acara
            </h3>
          </div>

          {unlocked && (
            <form onSubmit={handleCreateCd} className="p-3.5 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] space-y-2">
              <input
                type="text"
                placeholder="Nama acara (contoh: PTS Genap)..."
                value={cdName}
                onChange={(e) => setCdName(e.target.value)}
                className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--bg2)] text-[var(--cream)] p-2 text-xs focus:outline-none"
              />
              <input
                type="datetime-local"
                value={cdTarget}
                onChange={(e) => setCdTarget(e.target.value)}
                className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--bg2)] text-[var(--cream)] p-2 text-xs focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-1.5 rounded-xl bg-[var(--gold)] text-black font-bold text-xs shadow-sm hover:brightness-105"
              >
                + Tambah Countdown
              </button>
            </form>
          )}

          <div className="space-y-2">
            {countdowns.length > 0 ? (
              countdowns.map((cd) => (
                <div key={cd.id} className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--line-strong)] flex items-center justify-between gap-3 shadow-sm">
                  <div>
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-[var(--cream)]">
                      {cd.name}
                    </h4>
                    <div className="font-mono font-bold text-sm sm:text-base text-[var(--gold-soft)] mt-0.5">
                      {formatCountdown(cd.target)}
                    </div>
                    <div className="text-[10px] text-[var(--muted)]">
                      {new Date(cd.target).toLocaleString('id-ID')}
                    </div>
                  </div>

                  {unlocked && (
                    <button
                      type="button"
                      onClick={() => onDeleteCountdown(cd.id)}
                      className="p-1.5 text-[var(--warn)] hover:bg-[var(--surface2)] rounded-lg shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="p-6 text-center rounded-2xl bg-[var(--surface2)] text-xs text-[var(--muted)]">
                Belum ada countdown acara penting.
              </div>
            )}
          </div>
        </div>

        {/* INFO KELAS SECTION */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-[var(--cream)] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[var(--rose)]" />
              Info &amp; Pengumuman Kelas
            </h3>
          </div>

          {unlocked && (
            <form onSubmit={handleCreateInfo} className="p-3.5 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] space-y-2">
              <input
                type="text"
                placeholder="Judul info..."
                value={infoTitle}
                onChange={(e) => setInfoTitle(e.target.value)}
                className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--bg2)] text-[var(--cream)] p-2 text-xs focus:outline-none"
              />
              <textarea
                placeholder="Isi informasi lengkap..."
                value={infoBody}
                onChange={(e) => setInfoBody(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--bg2)] text-[var(--cream)] p-2 text-xs focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-1.5 rounded-xl bg-[var(--gold)] text-black font-bold text-xs shadow-sm hover:brightness-105"
              >
                + Tambah Info
              </button>
            </form>
          )}

          <div className="space-y-2">
            {infoItems.length > 0 ? (
              infoItems.map((inf) => (
                <div key={inf.id} className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--line-strong)] space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between gap-2 border-b border-[var(--line)] pb-1.5">
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-[var(--cream)]">
                      {inf.title}
                    </h4>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-[var(--muted)]">{inf.time}</span>
                      {unlocked && (
                        <button
                          type="button"
                          onClick={() => onDeleteInfo(inf.id)}
                          className="p-1 text-[var(--warn)] hover:bg-[var(--surface2)] rounded-lg"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-[var(--cream)] whitespace-pre-wrap leading-relaxed">
                    {inf.body}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-6 text-center rounded-2xl bg-[var(--surface2)] text-xs text-[var(--muted)]">
                Belum ada pengumuman kelas saat ini.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
