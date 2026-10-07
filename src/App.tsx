import React, { useState, useEffect, useCallback } from 'react';
import {
  Student,
  ZoneType,
  DeskAssignments,
  SubjectGroupData,
  AppState,
  DisplayMode,
  ColorScheme,
  UserRole,
  TabName,
  SpinConfig,
  SpinLastResult,
} from './types';
import {
  defaultStudents,
  defaultZones,
  defaultAssignments,
  jadwalData,
  jsDayToName,
  ADMIN_PIN,
  BACKEND_URL,
  SHARED_KEY,
  HIST_KEY,
} from './constants/initialData';
import { playChime, playSoftClick } from './utils/audio';

import { ThreeScene } from './components/ThreeScene';
import { DeviceModeModal } from './components/DeviceModeModal';
import { EntryGateModal } from './components/EntryGateModal';
import { MoreDrawer } from './components/MoreDrawer';
import { ThemeModal } from './components/ThemeModal';
import { DesktopHeader } from './components/DesktopHeader';
import { AttendanceModule } from './components/AttendanceModule';
import { DesksModule } from './components/DesksModule';
import { GroupsModule } from './components/GroupsModule';
import { ScheduleModule } from './components/ScheduleModule';
import { SpinWheelModule } from './components/SpinWheelModule';
import { PollsModule } from './components/PollsModule';
import { TasksModule } from './components/TasksModule';
import { StructureModule } from './components/StructureModule';

import {
  Users,
  Grid,
  Calendar,
  CheckSquare,
  Hourglass,
  Bell,
  BarChart3,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Volume2
} from 'lucide-react';

export default function App() {
  // App Persistent State
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('xe11-local-app-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          students: parsed.students || defaultStudents,
          zones: parsed.zones || defaultZones,
          assignments: parsed.assignments || defaultAssignments,
          groupsBySubject: parsed.groupsBySubject || {},
          infoItems: parsed.infoItems || [],
          countdowns: parsed.countdowns || [],
          tasks: parsed.tasks || [],
          spinItems: parsed.spinItems || [],
          spinCfg: parsed.spinCfg || null,
          spinLast: parsed.spinLast || null,
          polls: parsed.polls || [],
        };
      }
    } catch {
      // fallback
    }
    return {
      students: defaultStudents,
      zones: defaultZones,
      assignments: defaultAssignments,
      groupsBySubject: {},
      infoItems: [],
      countdowns: [],
      tasks: [],
      spinItems: [],
      spinCfg: null,
      spinLast: null,
      polls: [],
    };
  });

  // User Session & Display Preferences
  const [userRole, setUserRole] = useState<UserRole>(() => {
    try { return (localStorage.getItem('xe11-role') as UserRole) || ''; } catch { return ''; }
  });
  const [userName, setUserName] = useState<string>(() => {
    try { return localStorage.getItem('xe11-voter') || ''; } catch { return ''; }
  });
  const [userNo, setUserNo] = useState<string>(() => {
    try { return localStorage.getItem('xe11-voter-no') || ''; } catch { return ''; }
  });

  // Display Mode: Desktop (3D) vs Mobile (Ringan) vs Auto
  const [displayMode, setDisplayMode] = useState<DisplayMode>(() => {
    try { return (localStorage.getItem('xe11-display-mode') as DisplayMode) || 'auto'; } catch { return 'auto'; }
  });
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabName>('home');

  // Modals & Drawers
  const [showDeviceModal, setShowDeviceModal] = useState<boolean>(false);
  const [showGateModal, setShowGateModal] = useState<boolean>(false);
  const [showMoreDrawer, setShowMoreDrawer] = useState<boolean>(false);
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // Admin lock
  const [unlocked, setUnlocked] = useState<boolean>(false);

  // Theme & Dark Mode
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    try { return (localStorage.getItem('xe11-scheme') as ColorScheme) || 'gold'; } catch { return 'gold'; }
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try { return localStorage.getItem('xe11-mode') === 'dark'; } catch { return false; }
  });

  // Schedule Alarm
  const [alarmEnabled, setAlarmEnabled] = useState<boolean>(() => {
    try { return localStorage.getItem('xe11-alarm-enabled') !== '0'; } catch { return true; }
  });
  const [alarmBannerText, setAlarmBannerText] = useState<string>('');

  // Status message for desks
  const [deskStatusMsg, setDeskStatusMsg] = useState<string>('');

  // Sync color scheme & dark mode to DOM root
  useEffect(() => {
    if (colorScheme === 'gold') {
      document.documentElement.removeAttribute('data-scheme');
    } else {
      document.documentElement.setAttribute('data-scheme', colorScheme);
    }
    try { localStorage.setItem('xe11-scheme', colorScheme); } catch {}

    if (isDarkMode) {
      document.documentElement.setAttribute('data-mode', 'dark');
    } else {
      document.documentElement.removeAttribute('data-mode');
    }
    try { localStorage.setItem('xe11-mode', isDarkMode ? 'dark' : 'light'); } catch {}
  }, [colorScheme, isDarkMode]);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine effective rendering mode
  const effectiveMode = displayMode === 'auto' ? (windowWidth >= 1024 ? 'desktop' : 'mobile') : displayMode;

  // Prompt device selection on first visit or login if never chosen explicitly
  useEffect(() => {
    if (!userRole) {
      setShowGateModal(true);
    } else {
      const chosen = localStorage.getItem('xe11-display-mode-chosen');
      if (!chosen) {
        setShowDeviceModal(true);
      }
    }
  }, [userRole]);

  // Save state to localStorage & remote backend
  const saveState = useCallback((newState: AppState) => {
    setState(newState);
    try {
      localStorage.setItem('xe11-local-app-state', JSON.stringify(newState));
    } catch {}

    if (BACKEND_URL) {
      fetch(`${BACKEND_URL}?key=${encodeURIComponent(SHARED_KEY)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(newState),
      }).catch(() => {});
    }
  }, []);

  // Remote data fetch
  const refreshFromShared = useCallback(() => {
    if (!BACKEND_URL) return;
    fetch(`${BACKEND_URL}?key=${encodeURIComponent(SHARED_KEY)}`)
      .then((r) => r.text())
      .then((text) => {
        if (!text) return;
        try {
          const s = JSON.parse(text);
          if (s) {
            setState((prev) => ({
              ...prev,
              students: s.students || prev.students,
              zones: s.zones || prev.zones,
              assignments: s.assignments || prev.assignments,
              groupsBySubject: s.groupsBySubject || prev.groupsBySubject,
              infoItems: s.infoItems || prev.infoItems,
              countdowns: s.countdowns || prev.countdowns,
              tasks: s.tasks || prev.tasks,
              spinItems: s.spinItems || prev.spinItems,
              spinCfg: s.spinCfg || prev.spinCfg,
              spinLast: s.spinLast || prev.spinLast,
              polls: s.polls || prev.polls,
            }));
          }
        } catch {}
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    refreshFromShared();
    const interval = setInterval(refreshFromShared, 12000);
    return () => clearInterval(interval);
  }, [refreshFromShared]);

  // Check Schedule Alarm every 15s
  useEffect(() => {
    const checkAlarm = () => {
      if (!alarmEnabled) return;
      const today = jsDayToName[new Date().getDay()];
      if (!today || !jadwalData[today]) return;

      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();

      jadwalData[today].forEach((p) => {
        if (p.brk) return;
        const parts = p.t.split('-');
        if (parts.length < 2) return;
        const [endH, endM] = parts[1].split('.').map((x) => parseInt(x, 10));
        const endTotal = endH * 60 + endM;

        if (Math.abs(nowMin - endTotal) <= 1) {
          const key = `alarm_${now.toDateString()}_${p.t}`;
          if (!sessionStorage.getItem(key)) {
            sessionStorage.setItem(key, '1');
            playChime();
            setAlarmBannerText(`Jam pelajaran ${p.s || ''} telah selesai.`);
            setTimeout(() => setAlarmBannerText(''), 6000);
          }
        }
      });
    };

    checkAlarm();
    const interval = setInterval(checkAlarm, 15000);
    return () => clearInterval(interval);
  }, [alarmEnabled]);

  // Current or next lesson calculation
  const getCurrentLesson = () => {
    const today = jsDayToName[new Date().getDay()];
    if (!today || !jadwalData[today]) return null;

    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const periods = jadwalData[today];

    for (let i = 0; i < periods.length; i++) {
      const p = periods[i];
      if (p.brk) continue;
      const [start, end] = p.t.split('-');
      const [sH, sM] = start.split('.').map((x) => parseInt(x, 10));
      const [eH, eM] = end.split('.').map((x) => parseInt(x, 10));
      const sMin = sH * 60 + sM;
      const eMin = eH * 60 + eM;

      if (nowMin < eMin) {
        return {
          subject: p.s || '',
          room: p.r || '',
          time: p.t,
          ongoing: nowMin >= sMin,
        };
      }
    }
    return null;
  };

  const currentLesson = getCurrentLesson();

  // Handlers for App state mutations
  const handleToggleHadir = (no: number, hadir: boolean) => {
    const updated = state.students.map((s) => (s.no === no ? { ...s, hadir } : s));
    saveState({ ...state, students: updated });
  };

  const handleUpdateRoster = (newRoster: Student[]) => {
    saveState({ ...state, students: newRoster, assignments: {} });
  };

  const handleUpdateZones = (newZones: { [deskNum: number]: ZoneType }) => {
    saveState({ ...state, zones: newZones });
  };

  const handleUpdateAssignments = (newAssign: DeskAssignments) => {
    saveState({ ...state, assignments: newAssign });
  };

  const handlePushHistory = () => {
    try {
      const savedHist = localStorage.getItem(HIST_KEY);
      const parsed = savedHist ? JSON.parse(savedHist) : [];
      const updated = [
        {
          time: new Date().toLocaleString('id-ID'),
          zones: { ...state.zones },
          assignments: { ...state.assignments },
        },
        ...parsed,
      ].slice(0, 4);
      localStorage.setItem(HIST_KEY, JSON.stringify(updated));
    } catch {}
  };

  const handleUpdateSubjectGroups = (subject: string, data: SubjectGroupData) => {
    saveState({
      ...state,
      groupsBySubject: {
        ...state.groupsBySubject,
        [subject]: data,
      },
    });
  };

  const handleUpdateSpinConfig = (cfg: SpinConfig) => {
    saveState({ ...state, spinCfg: cfg });
  };

  const handleCommitSpinResult = (res: SpinLastResult) => {
    saveState({ ...state, spinLast: res });
  };

  const handleVote = (pollId: string, optionId: string) => {
    if (!userName) return;
    const updatedPolls = state.polls.map((p) => {
      if (p.id !== pollId) return p;
      return {
        ...p,
        voters: {
          ...p.voters,
          [userName.toLowerCase()]: { n: userName, o: optionId },
        },
      };
    });
    saveState({ ...state, polls: updatedPolls });
  };

  const handleCreatePoll = (q: string, options: string[]) => {
    const newPoll = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      q,
      options: options.map((t, idx) => ({ id: `opt_${idx}_${Date.now()}`, t })),
      voters: {},
      time: new Date().toLocaleString('id-ID'),
      ts: Date.now(),
    };
    saveState({ ...state, polls: [newPoll, ...state.polls] });
  };

  const handleDeletePoll = (pollId: string) => {
    saveState({ ...state, polls: state.polls.filter((p) => p.id !== pollId) });
  };

  const handleToggleTask = (id: string, done: boolean) => {
    const updated = state.tasks.map((t) => (t.id === id ? { ...t, done } : t));
    saveState({ ...state, tasks: updated });
  };

  const handleAddTask = (title: string, subject: string, deadline: string) => {
    const newTask = {
      id: Date.now().toString(36),
      title,
      subject,
      deadline,
      done: false,
    };
    saveState({ ...state, tasks: [...state.tasks, newTask] });
  };

  const handleDeleteTask = (id: string) => {
    saveState({ ...state, tasks: state.tasks.filter((t) => t.id !== id) });
  };

  const handleAddCountdown = (name: string, target: string) => {
    const newCd = {
      id: Date.now().toString(36),
      name,
      target,
    };
    saveState({ ...state, countdowns: [...state.countdowns, newCd] });
  };

  const handleDeleteCountdown = (id: string) => {
    saveState({ ...state, countdowns: state.countdowns.filter((c) => c.id !== id) });
  };

  const handleAddInfo = (title: string, body: string) => {
    const newInfo = {
      id: Date.now().toString(36),
      title,
      body,
      time: new Date().toLocaleString('id-ID'),
      time_sort: Date.now(),
    };
    saveState({ ...state, infoItems: [newInfo, ...state.infoItems] });
  };

  const handleDeleteInfo = (id: string) => {
    saveState({ ...state, infoItems: state.infoItems.filter((i) => i.id !== id) });
  };

  // Auth & login
  const handleLoginCommit = (role: UserRole, name: string, no: string) => {
    setUserRole(role);
    setUserName(name);
    setUserNo(no);
    setShowGateModal(false);

    try {
      localStorage.setItem('xe11-role', role);
      if (name) localStorage.setItem('xe11-voter', name);
      if (no) localStorage.setItem('xe11-voter-no', no);
    } catch {}

    // Check if user has chosen device mode yet
    const chosen = localStorage.getItem('xe11-display-mode-chosen');
    if (!chosen) {
      setShowDeviceModal(true);
    }
  };

  const handleLogout = () => {
    setUserRole('');
    setUserName('');
    setUserNo('');
    setUnlocked(false);
    try {
      localStorage.removeItem('xe11-role');
      localStorage.removeItem('xe11-voter');
      localStorage.removeItem('xe11-voter-no');
    } catch {}
    setShowGateModal(true);
  };

  // Admin PIN verification
  const handleVerifyPin = () => {
    if (pinInput.trim() === ADMIN_PIN) {
      setUnlocked(true);
      setShowPinModal(false);
      setPinInput('');
      setPinError('');
    } else {
      setPinError('PIN salah, silakan coba lagi.');
    }
  };

  // Total attendance computation
  const totalStudents = state.students.length;
  const hadirCount = state.students.filter((s) => s.hadir).length;
  const hadirPct = totalStudents ? Math.round((hadirCount / totalStudents) * 100) : 0;
  const pendingTasksCount = state.tasks.filter((t) => !t.done).length;

  return (
    <div className="min-h-screen flex flex-col text-[var(--cream)] pb-20 lg:pb-8 selection:bg-[var(--gold-soft)] selection:text-black">
      {/* Alarm Floating Banner */}
      {alarmBannerText && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] max-w-sm w-[90%] p-3.5 rounded-2xl bg-[var(--surface)] border-2 border-[var(--jade)] shadow-2xl flex items-center gap-3 animate-slide-up">
          <div className="w-8 h-8 rounded-xl bg-[var(--jade)] text-white flex items-center justify-center shrink-0">
            <Volume2 className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-[var(--cream)] leading-snug">
            {alarmBannerText}
          </p>
        </div>
      )}

      {/* 
        ============================================================
        TOP BAR: Berubah Sesuai Mode (Desktop 3D vs Mobile Ringan)
        ============================================================
      */}
      {effectiveMode === 'desktop' ? (
        <DesktopHeader
          activeTab={activeTab}
          onNavigateTab={(tab) => {
            playSoftClick();
            setActiveTab(tab);
          }}
          displayMode={displayMode}
          onSetDisplayMode={(mode) => {
            setDisplayMode(mode);
            try {
              localStorage.setItem('xe11-display-mode', mode);
              localStorage.setItem('xe11-display-mode-chosen', '1');
            } catch {}
          }}
          onOpenTheme={() => setShowThemeModal(true)}
          onOpenGate={() => setShowGateModal(true)}
          onLogout={handleLogout}
          unlocked={unlocked}
          onToggleLock={() => {
            if (unlocked) {
              setUnlocked(false);
            } else {
              setShowPinModal(true);
            }
          }}
          userRole={userRole}
          userName={userName}
          userNo={userNo}
        />
      ) : (
        /* Mobile Clean Topbar */
        <header className="sticky top-0 z-40 bg-[var(--surface)]/90 backdrop-blur-xl border-b border-[var(--line-strong)] px-4 py-3 flex items-center justify-between shadow-sm">
          <div
            onClick={() => {
              playSoftClick();
              setActiveTab('home');
            }}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <img
              src="https://man1surakarta.sch.id/aduca/images/LOGOMAN1SOLO.png"
              alt="Logo MAN 1 Surakarta"
              className="w-9 h-9 object-contain"
            />
            <div>
              <h1 className="font-serif font-bold text-base text-[var(--cream)] leading-tight">
                Euphoria X E-11
              </h1>
              <p className="text-[10px] text-[var(--muted)] font-serif italic">
                MAN 1 Surakarta · 2026–2029
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowThemeModal(true)}
              className="p-2 rounded-full border border-[var(--line)] bg-[var(--surface2)] text-[var(--muted)]"
              aria-label="Ubah tema"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--gold-soft)]" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (unlocked) setUnlocked(false);
                else setShowPinModal(true);
              }}
              className={`py-1 px-2.5 rounded-full text-xs font-bold transition-all ${
                unlocked
                  ? 'bg-gradient-to-r from-[var(--gold-soft)] to-[var(--gold)] text-black shadow-sm'
                  : 'border border-[var(--line-strong)] bg-[var(--surface2)] text-[var(--muted)]'
              }`}
            >
              {unlocked ? 'Admin' : 'Pencari Info'}
            </button>
          </div>
        </header>
      )}

      {/* 
        ============================================================
        MAIN CONTAINER
        ============================================================
      */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {effectiveMode === 'desktop' ? (
          /* ========================================================
             DESKTOP MODE (LUAS, 3D LOGO & DUAL WORKSPACE)
             ======================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* SISI KIRI (Col 1 - 4): 3D Scene + Live Widgets */}
            <aside className="lg:col-span-4 space-y-5">
              {/* 3D Showcase Medallion */}
              <div className="rounded-3xl bg-[var(--surface)] border border-[var(--line-strong)] p-5 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--gold)] animate-pulse" />
                    <span className="font-serif font-bold text-xs text-[var(--cream)] uppercase tracking-wider">
                      Emblem 3D MAN 1 Surakarta
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--muted)] font-mono">
                    WebGL · Interactive
                  </span>
                </div>

                {/* The Three.js 3D Model */}
                <ThreeScene className="h-64 sm:h-72 w-full" />

                <div className="text-center mt-3 pt-3 border-t border-[var(--line)]">
                  <div className="font-serif font-bold text-sm text-[var(--gold-soft)]">
                    "From Strangers to Family"
                  </div>
                  <p className="text-[11px] text-[var(--muted)] mt-0.5">
                    Kebanggaan Kelas X E-11 Tahun Ajaran 2026/2027
                  </p>
                </div>
              </div>

              {/* Attendance Ring Widget */}
              <div className="p-5 rounded-3xl bg-[var(--surface2)] border border-[var(--line)] shadow-sm flex items-center gap-4">
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="var(--line-strong)"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="var(--gold-soft)"
                      strokeWidth="6"
                      strokeDasharray="163"
                      strokeDashoffset={163 - (163 * hadirPct) / 100}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-700"
                    />
                  </svg>
                  <span className="absolute font-serif font-bold text-xs text-[var(--cream)]">
                    {hadirPct}%
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="font-serif font-bold text-sm text-[var(--cream)]">
                    Presensi Siswa Hari Ini
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-0.5">
                    {hadirCount} dari {totalStudents} siswa hadir di kelas
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('peserta')}
                    className="mt-1.5 text-[11px] font-bold text-[var(--gold-soft)] hover:underline flex items-center gap-1"
                  >
                    <span>Buka Daftar Absensi</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Current Lesson Widget */}
              <div className="p-5 rounded-3xl bg-[var(--surface2)] border border-[var(--line)] shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
                    {currentLesson?.ongoing ? 'Sedang Berlangsung' : 'Pelajaran Berikutnya'}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[var(--jade)]" />
                </div>

                {currentLesson ? (
                  <div>
                    <div className="font-serif font-bold text-base text-[var(--gold-soft)]">
                      {currentLesson.subject}
                    </div>
                    <div className="text-xs text-[var(--muted)] mt-0.5">
                      {currentLesson.time} {currentLesson.room && `· Ruang ${currentLesson.room}`}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-[var(--muted)] py-1">
                    Tidak ada jadwal aktif saat ini.
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setActiveTab('jadwal')}
                  className="pt-2 text-[11px] font-bold text-[var(--gold-soft)] hover:underline flex items-center gap-1 border-t border-[var(--line)] w-full"
                >
                  <span>Lihat Jadwal Lengkap</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </aside>

            {/* SISI KANAN (Col 5 - 12): Main Content Workspace */}
            <section className="lg:col-span-8">
              {activeTab === 'home' ? (
                /* Desktop Dashboard Bento View */
                <div className="space-y-5">
                  <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--line-strong)] shadow-md">
                    <h2 className="font-serif font-bold text-xl text-[var(--cream)] mb-1">
                      Selamat Datang di Portal Kelas X E-11
                    </h2>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      Kelola denah tempat duduk 3D, bagi kelompok tugas secara instan, ikut polling kelas, dan pantau tenggat waktu tugas.
                    </p>
                  </div>

                  {/* Bento Grid Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab('denah')}
                      className="p-5 rounded-3xl bg-[var(--surface2)] hover:bg-[var(--surface3)] border border-[var(--line)] text-left transition-all shadow-sm group"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-[var(--jade-bg)] text-[var(--jade)] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <Grid className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif font-bold text-base text-[var(--cream)] mb-1">
                        Denah Meja 3D &amp; 2D
                      </h3>
                      <p className="text-xs text-[var(--muted)] leading-relaxed">
                        Atur meja siswa dengan zona L/P, acak posisi, dan lihat ruang kelas dalam perspektif 3D.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('kelompok')}
                      className="p-5 rounded-3xl bg-[var(--surface2)] hover:bg-[var(--surface3)] border border-[var(--line)] text-left transition-all shadow-sm group"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-[#9C5A66]/20 text-[#9C5A66] dark:text-[#EAA0B0] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <Users className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif font-bold text-base text-[var(--cream)] mb-1">
                        Bagi Kelompok Per Mapel
                      </h3>
                      <p className="text-xs text-[var(--muted)] leading-relaxed">
                        Pengacakan kelompok tersimpan terpisah untuk setiap mata pelajaran tanpa saling menimpa.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('spin')}
                      className="p-5 rounded-3xl bg-[var(--surface2)] hover:bg-[var(--surface3)] border border-[var(--line)] text-left transition-all shadow-sm group"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-[var(--gold)]/20 text-[var(--gold-dim)] dark:text-[var(--gold-soft)] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif font-bold text-base text-[var(--cream)] mb-1">
                        Roda Putar Spin
                      </h3>
                      <p className="text-xs text-[var(--muted)] leading-relaxed">
                        Pilih siswa secara acak untuk giliran presentasi, kuis, atau piket kelas dengan efek suara.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('polling')}
                      className="p-5 rounded-3xl bg-[var(--surface2)] hover:bg-[var(--surface3)] border border-[var(--line)] text-left transition-all shadow-sm group"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-[var(--jade-bg)] text-[var(--jade)] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif font-bold text-base text-[var(--cream)] mb-1">
                        Polling Suara Kelas
                      </h3>
                      <p className="text-xs text-[var(--muted)] leading-relaxed">
                        Suarakan pendapatmu dalam voting pemilihan kelas dengan persentase suara real-time.
                      </p>
                    </button>
                  </div>

                  {/* Modules Shortcut Bar */}
                  <div className="p-4 rounded-3xl bg-[var(--surface2)] border border-[var(--line)] flex flex-wrap gap-2 justify-center text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveTab('jadwal')}
                      className="py-1.5 px-3 rounded-xl bg-[var(--surface3)] hover:bg-[var(--surface)] text-[var(--cream)] font-medium"
                    >
                      📅 Jadwal &amp; Alarm
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('tugas')}
                      className="py-1.5 px-3 rounded-xl bg-[var(--surface3)] hover:bg-[var(--surface)] text-[var(--cream)] font-medium"
                    >
                      📝 Tugas ({pendingTasksCount} Tertunda)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('struktur')}
                      className="py-1.5 px-3 rounded-xl bg-[var(--surface3)] hover:bg-[var(--surface)] text-[var(--cream)] font-medium"
                    >
                      👥 Pengurus Kelas
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('galeri')}
                      className="py-1.5 px-3 rounded-xl bg-[var(--surface3)] hover:bg-[var(--surface)] text-[var(--cream)] font-medium"
                    >
                      📸 Galeri Instagram
                    </button>
                  </div>
                </div>
              ) : activeTab === 'peserta' ? (
                <AttendanceModule
                  students={state.students}
                  onToggleHadir={handleToggleHadir}
                  onUpdateRoster={handleUpdateRoster}
                  unlocked={unlocked}
                />
              ) : activeTab === 'denah' ? (
                <DesksModule
                  students={state.students}
                  zones={state.zones}
                  assignments={state.assignments}
                  onUpdateZones={handleUpdateZones}
                  onUpdateAssignments={handleUpdateAssignments}
                  onPushHistory={handlePushHistory}
                  onRefresh={refreshFromShared}
                  unlocked={unlocked}
                  statusMsg={deskStatusMsg}
                  setStatusMsg={setDeskStatusMsg}
                />
              ) : activeTab === 'kelompok' ? (
                <GroupsModule
                  students={state.students}
                  groupsBySubject={state.groupsBySubject}
                  onUpdateSubjectGroups={handleUpdateSubjectGroups}
                  unlocked={unlocked}
                />
              ) : activeTab === 'jadwal' ? (
                <ScheduleModule
                  alarmEnabled={alarmEnabled}
                  onToggleAlarm={setAlarmEnabled}
                />
              ) : activeTab === 'spin' ? (
                <SpinWheelModule
                  students={state.students}
                  spinCfg={state.spinCfg}
                  spinLast={state.spinLast}
                  onUpdateSpinConfig={handleUpdateSpinConfig}
                  onCommitSpinResult={handleCommitSpinResult}
                  unlocked={unlocked}
                />
              ) : activeTab === 'polling' ? (
                <PollsModule
                  polls={state.polls}
                  userRole={userRole}
                  userName={userName}
                  userNo={userNo}
                  onVote={handleVote}
                  onCreatePoll={handleCreatePoll}
                  onDeletePoll={handleDeletePoll}
                  onOpenGate={() => setShowGateModal(true)}
                  unlocked={unlocked}
                />
              ) : activeTab === 'tugas' || activeTab === 'countdown' || activeTab === 'info' ? (
                <TasksModule
                  tasks={state.tasks}
                  countdowns={state.countdowns}
                  infoItems={state.infoItems}
                  onToggleTask={handleToggleTask}
                  onAddTask={handleAddTask}
                  onDeleteTask={handleDeleteTask}
                  onAddCountdown={handleAddCountdown}
                  onDeleteCountdown={handleDeleteCountdown}
                  onAddInfo={handleAddInfo}
                  onDeleteInfo={handleDeleteInfo}
                  unlocked={unlocked}
                />
              ) : (
                <StructureModule />
              )}
            </section>
          </div>
        ) : (
          /* ========================================================
             MOBILE MODE (RINGAN, CEPAT, NON-INTRUSIVE LAINNYA)
             ======================================================== */
          <div className="space-y-4">
            {activeTab === 'home' ? (
              <div className="space-y-4">
                {/* Hero Card */}
                <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--line-strong)] shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-serif font-bold text-[var(--gold-soft)]">
                      Halo, {userRole === 'siswa' && userName ? userName.split(' ')[0] : 'X E-11'} 👋
                    </span>
                    <span className="text-[10px] text-[var(--muted)]">
                      {new Date().toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                  </div>

                  <h2 className="font-serif font-bold text-lg text-[var(--cream)] mb-3">
                    Euphoria X E-11
                  </h2>

                  {/* Progress & Current Lesson in 2 columns */}
                  <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-[var(--line)]">
                    <div className="p-2.5 rounded-2xl bg-[var(--surface2)]">
                      <div className="text-[10px] text-[var(--muted)]">Kehadiran</div>
                      <div className="font-serif font-bold text-sm text-[var(--cream)] mt-0.5">
                        {hadirCount}/{totalStudents} Siswa
                      </div>
                      <div className="text-[10px] text-[var(--jade)] font-bold">
                        {hadirPct}% Hadir
                      </div>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-[var(--surface2)]">
                      <div className="text-[10px] text-[var(--muted)]">Jadwal Aktif</div>
                      <div className="font-serif font-bold text-xs text-[var(--gold-soft)] truncate mt-0.5">
                        {currentLesson?.subject || 'Selesai'}
                      </div>
                      <div className="text-[10px] text-[var(--muted)] truncate">
                        {currentLesson?.time || 'Tidak ada jadwal'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Bento Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('peserta')}
                    className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] text-left shadow-sm active:scale-95 transition-all"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[var(--gold)]/20 text-[var(--gold-dim)] dark:text-[var(--gold-soft)] flex items-center justify-center mb-2">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="font-serif font-bold text-xs text-[var(--cream)]">
                      Peserta
                    </div>
                    <div className="text-[10px] text-[var(--muted)]">
                      {hadirCount}/{totalStudents} hadir
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('denah')}
                    className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] text-left shadow-sm active:scale-95 transition-all"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[var(--jade-bg)] text-[var(--jade)] flex items-center justify-center mb-2">
                      <Grid className="w-4 h-4" />
                    </div>
                    <div className="font-serif font-bold text-xs text-[var(--cream)]">
                      Denah Kelas
                    </div>
                    <div className="text-[10px] text-[var(--muted)]">
                      18 Meja L &amp; P
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('kelompok')}
                    className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] text-left shadow-sm active:scale-95 transition-all"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#9C5A66]/20 text-[#9C5A66] dark:text-[#EAA0B0] flex items-center justify-center mb-2">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="font-serif font-bold text-xs text-[var(--cream)]">
                      Kelompok
                    </div>
                    <div className="text-[10px] text-[var(--muted)]">
                      Bagi per mapel
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('spin')}
                    className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] text-left shadow-sm active:scale-95 transition-all"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[var(--gold-soft)]/20 text-[var(--gold-dim)] dark:text-[var(--gold-soft)] flex items-center justify-center mb-2">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="font-serif font-bold text-xs text-[var(--cream)]">
                      Roda Spin
                    </div>
                    <div className="text-[10px] text-[var(--muted)]">
                      Acak siswa
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('polling')}
                    className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] text-left shadow-sm active:scale-95 transition-all"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[var(--jade-bg)] text-[var(--jade)] flex items-center justify-center mb-2">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div className="font-serif font-bold text-xs text-[var(--cream)]">
                      Polling
                    </div>
                    <div className="text-[10px] text-[var(--muted)]">
                      Suara kelas
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('jadwal')}
                    className="p-4 rounded-2xl bg-[var(--surface2)] border border-[var(--line)] text-left shadow-sm active:scale-95 transition-all"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#BE6C46]/20 text-[#BE6C46] dark:text-[#E0916A] flex items-center justify-center mb-2">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="font-serif font-bold text-xs text-[var(--cream)]">
                      Jadwal
                    </div>
                    <div className="text-[10px] text-[var(--muted)]">
                      Alarm pelajaran
                    </div>
                  </button>
                </div>
              </div>
            ) : activeTab === 'peserta' ? (
              <AttendanceModule
                students={state.students}
                onToggleHadir={handleToggleHadir}
                onUpdateRoster={handleUpdateRoster}
                unlocked={unlocked}
              />
            ) : activeTab === 'denah' ? (
              <DesksModule
                students={state.students}
                zones={state.zones}
                assignments={state.assignments}
                onUpdateZones={handleUpdateZones}
                onUpdateAssignments={handleUpdateAssignments}
                onPushHistory={handlePushHistory}
                onRefresh={refreshFromShared}
                unlocked={unlocked}
                statusMsg={deskStatusMsg}
                setStatusMsg={setDeskStatusMsg}
              />
            ) : activeTab === 'kelompok' ? (
              <GroupsModule
                students={state.students}
                groupsBySubject={state.groupsBySubject}
                onUpdateSubjectGroups={handleUpdateSubjectGroups}
                unlocked={unlocked}
              />
            ) : activeTab === 'jadwal' ? (
              <ScheduleModule
                alarmEnabled={alarmEnabled}
                onToggleAlarm={setAlarmEnabled}
              />
            ) : activeTab === 'spin' ? (
              <SpinWheelModule
                students={state.students}
                spinCfg={state.spinCfg}
                spinLast={state.spinLast}
                onUpdateSpinConfig={handleUpdateSpinConfig}
                onCommitSpinResult={handleCommitSpinResult}
                unlocked={unlocked}
              />
            ) : activeTab === 'polling' ? (
              <PollsModule
                polls={state.polls}
                userRole={userRole}
                userName={userName}
                userNo={userNo}
                onVote={handleVote}
                onCreatePoll={handleCreatePoll}
                onDeletePoll={handleDeletePoll}
                onOpenGate={() => setShowGateModal(true)}
                unlocked={unlocked}
              />
            ) : activeTab === 'tugas' || activeTab === 'countdown' || activeTab === 'info' ? (
              <TasksModule
                tasks={state.tasks}
                countdowns={state.countdowns}
                infoItems={state.infoItems}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                onAddCountdown={handleAddCountdown}
                onDeleteCountdown={handleDeleteCountdown}
                onAddInfo={handleAddInfo}
                onDeleteInfo={handleDeleteInfo}
                unlocked={unlocked}
              />
            ) : (
              <StructureModule />
            )}
          </div>
        )}
      </main>

      {/* 
        ============================================================
        MOBILE BOTTOM NAV BAR (Thumb-friendly & clean)
        ============================================================
      */}
      {effectiveMode === 'mobile' && (
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-[var(--surface)]/95 backdrop-blur-xl border-t border-[var(--line-strong)] py-2 px-4 shadow-lg flex items-center justify-around">
          <button
            type="button"
            onClick={() => {
              playSoftClick();
              setActiveTab('home');
            }}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
              activeTab === 'home' ? 'text-[var(--gold-soft)] scale-105' : 'text-[var(--muted)]'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center">🏠</div>
            <span>Beranda</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSoftClick();
              setActiveTab('spin');
            }}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
              activeTab === 'spin' ? 'text-[var(--gold-soft)] scale-105' : 'text-[var(--muted)]'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center">🎯</div>
            <span>Spin</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSoftClick();
              setActiveTab('denah');
            }}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
              activeTab === 'denah' ? 'text-[var(--gold-soft)] scale-105' : 'text-[var(--muted)]'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center">🪑</div>
            <span>Denah</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSoftClick();
              setShowMoreDrawer(true);
            }}
            className="flex flex-col items-center gap-1 text-[10px] font-bold text-[var(--muted)] hover:text-[var(--cream)]"
          >
            <div className="w-5 h-5 flex items-center justify-center">✨</div>
            <span>Lainnya</span>
          </button>
        </nav>
      )}

      {/* 
        ============================================================
        MODALS & DRAWERS (Non-intrusive)
        ============================================================
      */}
      {/* 1. Modal Tanya Perangkat (Komputer vs HP) */}
      <DeviceModeModal
        isOpen={showDeviceModal}
        currentMode={displayMode}
        onSelectMode={(mode) => {
          setDisplayMode(mode);
          try {
            localStorage.setItem('xe11-display-mode', mode);
            localStorage.setItem('xe11-display-mode-chosen', '1');
          } catch {}
          setShowDeviceModal(false);
        }}
        onClose={() => setShowDeviceModal(false)}
      />

      {/* 2. Login Entry Gate */}
      <EntryGateModal
        isOpen={showGateModal}
        students={state.students}
        currentRole={userRole}
        currentName={userName}
        currentNo={userNo}
        onCommit={handleLoginCommit}
        onClose={() => setShowGateModal(false)}
        canCancel={!!userRole}
      />

      {/* 3. More Drawer (Compact on Mobile, does NOT cover screen!) */}
      <MoreDrawer
        isOpen={showMoreDrawer}
        onClose={() => setShowMoreDrawer(false)}
        onNavigateTab={(tab) => {
          playSoftClick();
          setActiveTab(tab);
        }}
        displayMode={displayMode}
        onSetDisplayMode={(mode) => {
          setDisplayMode(mode);
          try {
            localStorage.setItem('xe11-display-mode', mode);
            localStorage.setItem('xe11-display-mode-chosen', '1');
          } catch {}
        }}
        onOpenTheme={() => setShowThemeModal(true)}
        onOpenChangeName={() => setShowGateModal(true)}
        onLogout={handleLogout}
        userRoleName={userName || (userRole === 'guru' ? 'Guru' : 'Tamu')}
      />

      {/* 4. Theme & Dark Mode Modal */}
      <ThemeModal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        currentScheme={colorScheme}
        onSelectScheme={(s) => setColorScheme(s)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={(d) => setIsDarkMode(d)}
      />

      {/* 5. Admin PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xs rounded-3xl bg-[var(--surface)] border border-[var(--line-strong)] p-5 shadow-2xl space-y-3">
            <h3 className="font-serif font-bold text-sm text-[var(--cream)] text-center">
              Masukkan PIN Admin
            </h3>
            <p className="text-[11px] text-[var(--muted)] text-center">
              Akses khusus untuk mengubah susunan meja dan pengaturan kelas
            </p>
            <input
              type="password"
              inputMode="numeric"
              placeholder="PIN Admin"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleVerifyPin();
              }}
              className="w-full text-center rounded-xl border border-[var(--line-strong)] bg-[var(--bg2)] text-[var(--cream)] p-2.5 text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[var(--gold-soft)]"
            />
            {pinError && (
              <p className="text-xs text-[var(--warn)] font-semibold text-center">
                {pinError}
              </p>
            )}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowPinModal(false);
                  setPinInput('');
                  setPinError('');
                }}
                className="flex-1 py-2 rounded-xl border border-[var(--line-strong)] bg-[var(--surface2)] text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleVerifyPin}
                className="flex-1 py-2 rounded-xl bg-[var(--gold)] text-black text-xs font-bold hover:brightness-105"
              >
                Buka
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
