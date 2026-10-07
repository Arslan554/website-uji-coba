import React, { useState } from 'react';
import { PollItem, UserRole } from '../types';
import { BarChart3, Plus, Trash2, Check, Copy, UserCheck } from 'lucide-react';
import { playSoftClick } from '../utils/audio';

interface PollsModuleProps {
  polls: PollItem[];
  userRole: UserRole;
  userName: string;
  userNo: string;
  onVote: (pollId: string, optionId: string) => void;
  onCreatePoll: (q: string, options: string[]) => void;
  onDeletePoll: (pollId: string) => void;
  onOpenGate: () => void;
  unlocked: boolean;
}

export const PollsModule: React.FC<PollsModuleProps> = ({
  polls,
  userRole,
  userName,
  userNo,
  onVote,
  onCreatePoll,
  onDeletePoll,
  onOpenGate,
  unlocked,
}) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const canVote = userRole === 'siswa' && !!userName;

  const handleAddOption = () => {
    if (options.length >= 10) return;
    setOptions([...options, '']);
  };

  const handleRemoveOption = (idx: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== idx));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlocked) return;
    playSoftClick();

    const qTrim = question.trim();
    const optsTrim = options.map((o) => o.trim()).filter(Boolean);
    if (!qTrim || optsTrim.length < 2) return;

    onCreatePoll(qTrim, optsTrim);
    setQuestion('');
    setOptions(['', '']);
  };

  const copyPollWhatsApp = (poll: PollItem) => {
    playSoftClick();
    const totalVotes = Object.keys(poll.voters || {}).length;

    let text = `📊 *POLLING KELAS X E-11: ${poll.q.toUpperCase()}*\n`;
    text += `*MAN 1 SURAKARTA*\n`;
    text += `🗳 Total Suara Masuk: ${totalVotes} suara\n\n`;

    poll.options.forEach((opt) => {
      let count = 0;
      Object.values(poll.voters || {}).forEach((v) => {
        if (v.o === opt.id) count++;
      });
      const pct = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
      text += `▪️ ${opt.t}: *${count} suara* (${pct}%)\n`;
    });

    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(poll.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div>
          <h2 className="font-serif font-bold text-base sm:text-lg text-[var(--cream)] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[var(--jade)]" />
            Polling Suara Kelas X E-11
          </h2>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            {canVote
              ? `Memilih sebagai: ${userNo ? `${userNo}. ` : ''}${userName}`
              : 'Mode tamu/guru: Hanya melihat hasil (bukan pemilih)'}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenGate}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-[var(--line-strong)] bg-[var(--surface3)] text-[var(--cream)] text-xs font-semibold hover:bg-[var(--surface2)]"
        >
          <UserCheck className="w-3.5 h-3.5 text-[var(--gold-soft)]" />
          <span>Ganti Identitas</span>
        </button>
      </div>

      {/* Admin Create Form (if unlocked) */}
      {unlocked && (
        <form onSubmit={handleCreate} className="p-4 sm:p-5 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-[var(--cream)]">
              Buat Polling Baru
            </h3>
            <span className="text-xs text-[var(--muted)]">Admin</span>
          </div>

          <input
            type="text"
            placeholder="Tulis pertanyaan polling..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--bg2)] text-[var(--cream)] p-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]"
          />

          <div className="space-y-2">
            <span className="text-[11px] font-bold text-[var(--muted)] uppercase block">
              Pilihan Jawaban (Minimal 2):
            </span>
            {options.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Pilihan ${i + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const updated = [...options];
                    updated[i] = e.target.value;
                    setOptions(updated);
                  }}
                  className="flex-1 rounded-xl border border-[var(--line-strong)] bg-[var(--bg2)] text-[var(--cream)] p-2 text-xs focus:outline-none"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(i)}
                    className="p-2 rounded-xl text-[var(--warn)] hover:bg-[var(--surface3)]"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            {options.length < 10 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="py-1.5 px-3 rounded-xl border border-dashed border-[var(--line-strong)] text-[var(--gold-soft)] text-xs font-semibold hover:bg-[var(--surface3)] flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Opsi</span>
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black font-bold text-xs shadow-md hover:brightness-105"
          >
            Publikasikan Polling
          </button>
        </form>
      )}

      {/* Poll Cards List */}
      {polls.length > 0 ? (
        <div className="space-y-4">
          {polls
            .slice()
            .sort((a, b) => b.ts - a.ts)
            .map((poll) => {
              const totalVotes = Object.keys(poll.voters || {}).length;
              const userVote = userName ? poll.voters?.[userName.toLowerCase()]?.o : null;

              return (
                <div
                  key={poll.id}
                  className="p-4 sm:p-5 rounded-3xl bg-[var(--surface)] border border-[var(--line-strong)] shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-[var(--line)] pb-2.5">
                    <div>
                      <h3 className="font-serif font-bold text-sm sm:text-base text-[var(--cream)]">
                        {poll.q}
                      </h3>
                      <div className="text-[11px] text-[var(--muted)] mt-0.5">
                        {totalVotes} suara terkumpul · Dibuat: {poll.time}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => copyPollWhatsApp(poll)}
                        className="p-1.5 rounded-lg bg-[var(--surface2)] text-[var(--cream)] hover:bg-[var(--surface3)] border border-[var(--line)] text-xs flex items-center gap-1"
                        title="Salin hasil polling ke WA"
                      >
                        {copiedId === poll.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline text-[10px]">Salin WA</span>
                      </button>

                      {unlocked && (
                        <button
                          type="button"
                          onClick={() => onDeletePoll(poll.id)}
                          className="p-1.5 rounded-lg text-[var(--warn)] hover:bg-[var(--surface2)]"
                          title="Hapus polling ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Options with Percentage Bars */}
                  <div className="space-y-2">
                    {poll.options.map((opt) => {
                      let voteCount = 0;
                      Object.values(poll.voters || {}).forEach((v) => {
                        if (v.o === opt.id) voteCount++;
                      });

                      const percentage = totalVotes ? Math.round((voteCount / totalVotes) * 100) : 0;
                      const isMyChoice = userVote === opt.id;

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={!canVote}
                          onClick={() => {
                            playSoftClick();
                            onVote(poll.id, opt.id);
                          }}
                          className={`w-full relative overflow-hidden p-3 rounded-2xl border text-left transition-all ${
                            isMyChoice
                              ? 'border-[var(--gold)] ring-2 ring-[rgba(var(--accent-rgb),0.3)] bg-[var(--surface2)]'
                              : 'border-[var(--line)] bg-[var(--bg2)] hover:border-[var(--line-strong)]'
                          } ${!canVote ? 'cursor-default opacity-85' : 'active:scale-98'}`}
                        >
                          {/* Animated Progress Fill */}
                          <div
                            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[rgba(var(--accent-rgb),0.25)] to-[rgba(var(--accent-rgb),0.1)] transition-all duration-500 rounded-2xl pointer-events-none"
                            style={{ width: `${percentage}%` }}
                          />

                          <div className="relative z-10 flex items-center justify-between text-xs font-bold text-[var(--cream)] gap-2">
                            <span className="truncate flex items-center gap-1.5">
                              {opt.t}
                              {isMyChoice && (
                                <span className="text-[10px] text-[var(--gold-soft)] font-serif">
                                  ✓ (Pilihanmu)
                                </span>
                              )}
                            </span>
                            <span className="font-mono text-[11px] text-[var(--gold-soft)] shrink-0">
                              {voteCount} ({percentage}%)
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="p-8 text-center rounded-2xl bg-[var(--surface2)] border border-[var(--line)] text-xs text-[var(--muted)]">
          Belum ada polling kelas yang sedang aktif.
        </div>
      )}
    </div>
  );
};
