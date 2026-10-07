export type Gender = 'L' | 'P';

export interface Student {
  no: number;
  name: string;
  g: Gender;
  hadir: boolean;
}

export type ZoneType = 'L' | 'P' | '';

export interface DeskAssignments {
  [deskNum: number]: string[];
}

export interface SubjectGroupData {
  mode: 'mix' | 'L' | 'P';
  count: number;
  groups: string[][];
  time: string;
}

export interface InfoItem {
  id: string;
  title: string;
  body: string;
  time: string;
  time_sort: number;
}

export interface CountdownItem {
  id: string;
  name: string;
  target: string;
}

export interface TaskItem {
  id: string;
  title: string;
  subject?: string;
  deadline: string;
  done: boolean;
}

export interface PollOption {
  id: string;
  t: string;
}

export interface PollVoter {
  n: string;
  o: string;
}

export interface PollItem {
  id: string;
  q: string;
  options: PollOption[];
  voters: { [nameKey: string]: PollVoter };
  time: string;
  ts: number;
}

export interface SpinConfig {
  src: 'L' | 'P' | 'C' | 'X';
  extra: string[];
}

export interface SpinLastResult {
  ts: number;
  idx: number;
  name: string;
}

export interface AppState {
  students: Student[];
  zones: { [deskNum: number]: ZoneType };
  assignments: DeskAssignments;
  groupsBySubject: { [subjectName: string]: SubjectGroupData };
  infoItems: InfoItem[];
  countdowns: CountdownItem[];
  tasks: TaskItem[];
  spinItems: string[];
  spinCfg: SpinConfig | null;
  spinLast: SpinLastResult | null;
  polls: PollItem[];
}

export type UserRole = 'siswa' | 'guru' | 'tamu' | '';
export type ColorScheme = 'gold' | 'sage' | 'rosewood' | 'ocean' | 'lavender' | 'karang' | 'nila';
export type DisplayMode = 'desktop' | 'mobile' | 'auto';
export type TabName = 'home' | 'peserta' | 'denah' | 'kelompok' | 'spin' | 'polling' | 'jadwal' | 'tugas' | 'countdown' | 'info' | 'riwayat' | 'struktur' | 'galeri';
