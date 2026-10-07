import { Student, ZoneType, DeskAssignments } from '../types';

export const ADMIN_PIN = "1108";
export const BACKEND_URL = "https://script.google.com/macros/s/AKfycbyrOLh62KCgt1tsRGMW4kbyrl0kgzhakhVQje-NG2rWseX2jOsDGwmgjirVgqrgbSsaAw/exec";
export const SHARED_KEY = "xe11-app-state-v1";
export const HIST_KEY = "xe11-app-hist-v1";

export const deskOrder = [1, 7, 13, 2, 8, 14, 3, 9, 15, 4, 10, 16, 5, 11, 17, 6, 12, 18];

export const defaultZones: { [deskNum: number]: ZoneType } = {
  1: 'L', 2: 'P', 3: 'L', 4: 'P', 5: 'P', 6: 'L',
  7: 'P', 8: 'L', 9: 'L', 10: 'P', 11: 'P', 12: 'P',
  13: 'L', 14: 'P', 15: 'P', 16: 'P', 17: 'L', 18: 'L'
};

export const defaultStudents: Student[] = [
  { no: 1, g: 'P', name: "Abidah Muti'atus Salimah", hadir: true },
  { no: 2, g: 'L', name: "Adib Fausta Khosyi", hadir: true },
  { no: 3, g: 'L', name: "Adyaraka Sirajuddin Nail", hadir: true },
  { no: 4, g: 'P', name: "'Alma Nur Hanifah", hadir: true },
  { no: 5, g: 'L', name: "Andika Fajar Pratama", hadir: true },
  { no: 6, g: 'P', name: "Anindhita Fitriani Sholikhah", hadir: true },
  { no: 7, g: 'P', name: "Anisa Uswatun Khasanah", hadir: true },
  { no: 8, g: 'P', name: "Ararya Lituhayu Nugrahaeny", hadir: true },
  { no: 9, g: 'P', name: "Ardyana Octaviani", hadir: true },
  { no: 10, g: 'L', name: "Arsenna Dwi Permana", hadir: true },
  { no: 11, g: 'L', name: "Dzaky Farrel Khalfani", hadir: true },
  { no: 12, g: 'L', name: "Fadhil Khairy Rahman Wijayanto", hadir: true },
  { no: 13, g: 'P', name: "Felicia Belva Audrey Sakhi", hadir: true },
  { no: 14, g: 'P', name: "Halimatus Sadiyah", hadir: true },
  { no: 15, g: 'P', name: "Inas Ramila Wardany", hadir: true },
  { no: 16, g: 'P', name: "Jevanindya Addina Sukmadewi", hadir: true },
  { no: 17, g: 'P', name: "Luthfia Nur Isna Fauzan", hadir: true },
  { no: 18, g: 'L', name: "Majid Hilmy Syamil", hadir: true },
  { no: 19, g: 'L', name: "Misbachul Fikri Al Hasan", hadir: true },
  { no: 20, g: 'L', name: "Muhammad Adib Zainul Muttaqin", hadir: true },
  { no: 21, g: 'L', name: "Muhammad Aslan Setiawan", hadir: true },
  { no: 22, g: 'L', name: "Muhammad Fattaharozzaq Mahasurya", hadir: true },
  { no: 23, g: 'P', name: "Nabiila Mega Syahiira", hadir: true },
  { no: 24, g: 'L', name: "Nahdan Avicenna Rasyidin", hadir: true },
  { no: 25, g: 'P', name: "Najla Dzakiyyah", hadir: true },
  { no: 26, g: 'P', name: "Paraulin Najwa Naulindra", hadir: true },
  { no: 27, g: 'L', name: "Rizky Arbi Nur Qomarun", hadir: true },
  { no: 28, g: 'P', name: "Salma Syarifah", hadir: true },
  { no: 29, g: 'P', name: "Salma Wafiyah", hadir: true },
  { no: 30, g: 'L', name: "Sanjay Gerrysta Putra", hadir: true },
  { no: 31, g: 'P', name: "Sheza Adzkiya Zayna", hadir: true },
  { no: 32, g: 'L', name: "Syaah Syiham Azka Musyayyad", hadir: true },
  { no: 33, g: 'P', name: "Tabina Aisya Fairuz Amjad", hadir: true },
  { no: 34, g: 'L', name: "Wishnu Murti Aryo Widagdo", hadir: true },
  { no: 35, g: 'P', name: "Zafreen Dita Saffana", hadir: true },
  { no: 36, g: 'P', name: "Zahira Arvia Husna", hadir: true }
];

export const defaultAssignments: DeskAssignments = {
  1: ["22. Muhammad Fattaharozzaq Mahasurya", "32. Syaah Syiham Azka Musyayyad"],
  2: ["4. 'Alma Nur Hanifah", "29. Salma Wafiyah"],
  3: ["30. Sanjay Gerrysta Putra", "5. Andika Fajar Pratama"],
  4: ["31. Sheza Adzkiya Zayna", "26. Paraulin Najwa Naulindra"],
  5: ["1. Abidah Muti'atus Salimah", "13. Felicia Belva Audrey Sakhi"],
  6: ["2. Adib Fausta Khosyi", "12. Fadhil Khairy Rahman Wijayanto"],
  7: ["33. Tabina Aisya Fairuz Amjad", "23. Nabiila Mega Syahiira"],
  8: ["21. Muhammad Aslan Setiawan", "3. Adyaraka Sirajuddin Nail"],
  9: ["34. Wishnu Murti Aryo Widagdo", "27. Rizky Arbi Nur Qomarun"],
  10: ["17. Luthfia Nur Isna Fauzan", "25. Najla Dzakiyyah"],
  11: ["8. Ararya Lituhayu Nugrahaeny", "28. Salma Syarifah"],
  12: ["36. Zahira Arvia Husna", "9. Ardyana Octaviani"],
  13: ["10. Arsenna Dwi Permana", "18. Majid Hilmy Syamil"],
  14: ["6. Anindhita Fitriani Sholikhah", "16. Jevanindya Addina Sukmadewi"],
  15: ["14. Halimatus Sadiyah", "35. Zafreen Dita Saffana"],
  16: ["15. Inas Ramila Wardany", "7. Anisa Uswatun Khasanah"],
  17: ["20. Muhammad Adib Zainul Muttaqin", "11. Dzaky Farrel Khalfani"],
  18: ["19. Misbachul Fikri Al Hasan", "24. Nahdan Avicenna Rasyidin"]
};

export interface PeriodItem {
  t: string;
  s?: string;
  r?: string;
  brk?: boolean;
}

export const jadwalData: { [day: string]: PeriodItem[] } = {
  "Senin": [
    { t: "07.00-07.45", r: "119", s: "Kimia" },
    { t: "07.45-08.30", r: "119", s: "Kimia" },
    { t: "08.30-09.15", r: "53", s: "Aqidah Akhlak" },
    { t: "09.15-10.00", r: "103", s: "TIK/Multimedia" },
    { brk: true, t: "10.00-10.15" },
    { t: "10.15-11.00", r: "103", s: "TIK/Multimedia" },
    { t: "11.00-11.45", r: "120", s: "SKI" },
    { brk: true, t: "11.45-12.30" },
    { t: "12.30-13.10", r: "54", s: "Sejarah" },
    { t: "13.10-13.50", r: "91", s: "Bahasa Indonesia" },
    { t: "13.50-14.30", r: "91", s: "Bahasa Indonesia" },
    { t: "14.30-15.00", r: "", s: "WS" },
    { t: "15.00-15.30", r: "", s: "WS" }
  ],
  "Selasa": [
    { t: "07.00-07.45", r: "138", s: "Seni Budaya/WS" },
    { t: "07.45-08.30", r: "120", s: "SKI" },
    { t: "08.30-09.15", r: "107", s: "BK" },
    { t: "09.15-10.00", r: "117", s: "Sosiologi" },
    { brk: true, t: "10.00-10.15" },
    { t: "10.15-11.00", r: "117", s: "Sosiologi" },
    { t: "11.00-11.45", r: "105", s: "Matematika" },
    { brk: true, t: "11.45-12.30" },
    { t: "12.30-13.10", r: "105", s: "Matematika" },
    { t: "13.10-13.50", r: "129", s: "Bahasa Arab" },
    { t: "13.50-14.30", r: "112", s: "PKN" },
    { t: "14.30-15.00", r: "", s: "WS" },
    { t: "15.00-15.30", r: "", s: "WS" }
  ],
  "Rabu": [
    { t: "07.00-07.45", r: "162", s: "Fisika" },
    { t: "07.45-08.30", r: "162", s: "Fisika" },
    { t: "08.30-09.15", r: "53", s: "Aqidah Akhlak" },
    { t: "09.15-10.00", r: "101", s: "Bahasa Inggris" },
    { brk: true, t: "10.00-10.15" },
    { t: "10.15-11.00", r: "101", s: "Bahasa Inggris" },
    { t: "11.00-11.45", r: "54", s: "Sejarah" },
    { brk: true, t: "11.45-12.30" },
    { t: "12.30-13.10", r: "", s: "WS" },
    { t: "13.10-13.50", r: "", s: "WS" },
    { t: "13.50-14.30", r: "", s: "WS" },
    { t: "14.30-15.00", r: "", s: "WS" },
    { t: "15.00-15.30", r: "", s: "WS" }
  ],
  "Kamis": [
    { t: "07.00-07.45", r: "128", s: "Qur'an Hadist" },
    { t: "07.45-08.30", r: "105", s: "Matematika" },
    { t: "08.30-09.15", r: "105", s: "Matematika" },
    { t: "09.15-10.00", r: "132", s: "Biologi" },
    { brk: true, t: "10.00-10.15" },
    { t: "10.15-11.00", r: "132", s: "Biologi" },
    { t: "11.00-11.45", r: "159", s: "Tahfidz" },
    { brk: true, t: "11.45-12.30" },
    { t: "12.30-13.10", r: "", s: "WS" },
    { t: "13.10-13.50", r: "", s: "WS" },
    { t: "13.50-14.30", r: "", s: "WS" },
    { t: "14.30-15.00", r: "", s: "WS" },
    { t: "15.00-15.30", r: "", s: "WS" }
  ],
  "Jum'at": [
    { t: "07.00-07.40", r: "145", s: "Bahasa Jawa" },
    { t: "07.40-08.20", r: "128", s: "Qur'an Hadist" },
    { t: "08.20-09.00", r: "101", s: "Bahasa Inggris" },
    { t: "09.00-09.40", r: "69", s: "Geografi" },
    { brk: true, t: "09.40-09.55" },
    { t: "09.55-10.35", r: "69", s: "Geografi" },
    { t: "10.35-11.15", r: "129", s: "Bahasa Arab" }
  ],
  "Sabtu": [
    { t: "07.00-07.45", r: "139", s: "Ekonomi" },
    { t: "07.45-08.30", r: "139", s: "Ekonomi" },
    { t: "08.30-09.15", r: "42", s: "PJOK" },
    { t: "09.15-10.00", r: "42", s: "PJOK" },
    { brk: true, t: "10.00-10.15" },
    { t: "10.15-11.00", r: "94", s: "Fiqih" },
    { t: "11.00-11.45", r: "94", s: "Fiqih" }
  ]
};

export const jadwalDays = ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
export const jsDayToName: { [dayNum: number]: string } = {
  1: "Senin", 2: "Selasa", 3: "Rabu", 4: "Kamis", 5: "Jum'at", 6: "Sabtu"
};

export const initialSubjects = [
  "Matematika", "Biologi", "Fisika", "Kimia", "Bahasa Indonesia",
  "Bahasa Inggris", "Sejarah", "Geografi", "Ekonomi", "Sosiologi",
  "Aqidah Akhlak", "Qur'an Hadist", "Fikih", "SKI", "Bahasa Arab",
  "Bahasa Jawa", "TIK/Multimedia", "PKN", "Seni Budaya", "PJOK", "Tahfidz"
];

export const classOfficers = [
  { role: "Ketua Kelas", name: "Fattah", sub: "Presiden Kelas X E-11", featured: true },
  { role: "Wakil Ketua Kelas", name: "Adib Fausta", sub: "Wakil Presiden Kelas", featured: true },
  { role: "Sekretaris 1", name: "'Alma Nur", sub: "Notulensi & Administrasi", featured: false },
  { role: "Sekretaris 2", name: "Anindhita Fitriani", sub: "Administrasi & Presensi", featured: false },
  { role: "Bendahara 1", name: "Salma Wafiyah", sub: "Keuangan & Kas Kelas", featured: false },
  { role: "Bendahara 2", name: "Sheza Adzkiya", sub: "Pembukuan Kas Kelas", featured: false },
  { role: "Seksi Kebersihan 1", name: "Andika Fajar", sub: "Koordinator Piket & Kebersihan", featured: false },
  { role: "Seksi Kebersihan 2", name: "Arsenna Dwi", sub: "Piket & Kenyamanan Kelas", featured: false },
  { role: "Seksi Keamanan 1", name: "Adyaraka Sirajuddin", sub: "Ketertiban & Disiplin", featured: false },
  { role: "Seksi Keamanan 2", name: "Muhammad Aslan", sub: "Teknologi & Ketertiban", featured: false }
];
