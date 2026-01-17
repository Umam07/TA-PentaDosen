import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  FlaskConical,
  BookMarked,
  Lightbulb,
  ChevronDown,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  RotateCcw,
  Clock,
  User
} from 'lucide-react';
import { useLayout } from '../components/layout/AppLayout';

// --- Types & Interfaces ---
type ActivityType = 'create' | 'update' | 'delete' | 'login' | 'logout';

interface ActivityLog {
  id: string;
  user: string;
  faculty: string;
  department: string;
  activityType: ActivityType;
  description: string;
  timestamp: string;
}

interface TooltipData {
  faculty: string;
  label: string;
  value: number;
  color: string;
  x: number;
  y: number;
}

// --- Constants ---
const FACULTY_COLORS: Record<string, string> = {
  'Kedokteran': '#6a9256',
  'Kedokteran Gigi': '#8773ae',
  'Teknologi Informasi': '#e09a67',
  'Ekonomi Bisnis': '#036aac',
  'Hukum': '#a93246',
  'Psikologi': '#8b3969',
};

const FACULTY_MAJORS: Record<string, string[]> = {
  'Fakultas Kedokteran': ['Kedokteran'],
  'Fakultas Kedokteran Gigi': ['Kedokteran Gigi'],
  'Fakultas Teknologi Informasi': ['Teknik Informatika', 'Perpustakaan dan Sains Informasi'],
  'Fakultas Ekonomi Bisnis': ['Manajemen', 'Akuntansi'],
  'Fakultas Hukum': ['Hukum'],
  'Fakultas Psikologi': ['Psikologi'],
};

const INITIAL_ACTIVITY_LOG: ActivityLog[] = [
  { id: '1', user: 'Prof. Dr. Ahmad Wijaya, S.Kom., M.T.', faculty: 'Fakultas Teknologi Informasi', department: 'Teknik Informatika', activityType: 'create', description: 'Menambahkan proyek penelitian baru berjudul "Sistem Diagnosis Medis Berbasis AI"', timestamp: '19 Okt 2025, 14.30' },
  { id: '2', user: 'Dr. Sarah Putri, S.T., M.Kom.', faculty: 'Fakultas Teknologi Informasi', department: 'Teknik Informatika', activityType: 'update', description: 'Memperbarui publikasi "Machine Learning in Healthcare"', timestamp: '19 Okt 2025, 13.15' },
  { id: '3', user: 'Dr. Budi Santoso, S.Kom., M.M.', faculty: 'Fakultas Ekonomi Bisnis', department: 'Manajemen', activityType: 'create', description: 'Menambahkan entri HKI untuk "Digital Learning Platform"', timestamp: '19 Okt 2025, 11.45' },
  { id: '4', user: 'Lisa Kurniawan, S.Ds., M.Sn.', faculty: 'Fakultas Teknologi Informasi', department: 'Teknik Informatika', activityType: 'delete', description: 'Menghapus draf publikasi "Hasil Studi Pendahuluan"', timestamp: '19 Okt 2025, 10.20' },
  { id: '5', user: 'Dr. Rahman Abdullah, S.Si., M.Sc.', faculty: 'Fakultas Kedokteran', department: 'Kedokteran', activityType: 'login', description: 'Masuk ke dalam sistem', timestamp: '19 Okt 2025, 09.00' },
  { id: '6', user: 'Dr. Linda Sari', faculty: 'Fakultas Psikologi', department: 'Psikologi', activityType: 'logout', description: 'Pengguna keluar dari sistem', timestamp: '19 Okt 2025, 08.45' },
];

const useCountUp = (endValue: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * endValue));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [endValue, duration]);
  return count;
};

export const Dashboard: React.FC = () => {
  const { showToast } = useLayout();
  const [searchQuery, setSearchQuery] = useState('');
  const [facultyFilter, setFacultyFilter] = useState<string>('Semua Fakultas');
  const [deptFilter, setDeptFilter] = useState<string>('Semua Jurusan');
  const [typeFilter, setTypeFilter] = useState<string>('Semua Aktivitas');
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  
  const totalResearchValue = useCountUp(218);
  const totalPubsValue = useCountUp(325);
  const totalHKIValue = useCountUp(75);

  const availableDepartments = useMemo(() => {
    if (facultyFilter === 'Semua Fakultas') return [];
    return FACULTY_MAJORS[facultyFilter] || [];
  }, [facultyFilter]);

  const handleFacultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFacultyFilter(e.target.value);
    setDeptFilter('Semua Jurusan');
  };

  const filteredLog = useMemo(() => {
    return INITIAL_ACTIVITY_LOG.filter(log => {
      const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           log.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFaculty = facultyFilter === 'Semua Fakultas' || log.faculty === facultyFilter;
      const matchesDept = deptFilter === 'Semua Jurusan' || log.department === deptFilter;
      const matchesType = typeFilter === 'Semua Aktivitas' || log.activityType === typeFilter.toLowerCase();
      return matchesSearch && matchesFaculty && matchesDept && matchesType;
    });
  }, [searchQuery, facultyFilter, deptFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLog.length / rowsPerPage));
  const paginatedLog = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredLog.slice(start, start + rowsPerPage);
  }, [filteredLog, currentPage, rowsPerPage]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, facultyFilter, deptFilter, typeFilter, rowsPerPage]);

  const handleResetFilters = () => {
    setFacultyFilter('Semua Fakultas');
    setDeptFilter('Semua Jurusan');
    setTypeFilter('Semua Aktivitas');
    setSearchQuery('');
    setRowsPerPage(10);
    setCurrentPage(1);
    showToast('Filter telah direset.', 'info');
  };

  const getActivityBadge = (type: ActivityType) => {
    switch (type) {
      case 'create': return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'update': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'delete': return 'bg-red-500/10 text-red-600 dark:text-red-400';
      case 'login': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
      case 'logout': return 'bg-slate-500/10 text-slate-600 dark:text-slate-400';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const handleMouseMove = (e: React.MouseEvent, faculty: string, label: string, value: number, color: string) => {
    setTooltip({ faculty, label, value, color, x: e.clientX, y: e.clientY });
  };

  const FACULTY_CHART_DATA = [
    { name: 'Kedokteran', research: 42, pub: 56, hki: 12 },
    { name: 'Kedokteran Gigi', research: 28, pub: 34, hki: 8 },
    { name: 'Teknologi Informasi', research: 55, pub: 78, hki: 24 },
    { name: 'Ekonomi Bisnis', research: 35, pub: 45, hki: 15 },
    { name: 'Hukum', research: 22, pub: 31, hki: 6 },
    { name: 'Psikologi', research: 18, pub: 25, hki: 10 },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 space-y-8 relative">
      
      {/* Header */}
      <div className="space-y-1.5 px-4 md:px-0">
        <h1 className="text-[20px] md:text-[24px] font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
        <p className="text-[13px] md:text-[14px] text-slate-400 dark:text-neutral-500 font-medium tracking-tight">Ikhtisar data penelitian, publikasi, dan HKI di seluruh fakultas universitas.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-0">
        {[
          { label: 'Total Penelitian', value: totalResearchValue, sub: 'Di seluruh fakultas', icon: <FlaskConical className="w-5 h-5" />, color: 'bg-blue-500/10 text-[#036aac]' },
          { label: 'Total Publikasi', value: totalPubsValue, sub: 'Karya yang dipublikasikan', icon: <BookMarked className="w-5 h-5" />, color: 'bg-green-500/10 text-[#6a9256]' },
          { label: 'Total HKI', value: totalHKIValue, sub: 'Hak Kekayaan Intelektual', icon: <Lightbulb className="w-5 h-5" />, color: 'bg-amber-500/10 text-[#e09a67]' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-neutral-900/40 border border-slate-200 dark:border-white/5 p-6 md:p-8 rounded-[2rem] shadow-sm">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-[11px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest">{stat.label}</h3>
                <span className="text-[28px] font-black text-slate-900 dark:text-white tracking-tighter leading-none">{stat.value}</span>
                <p className="text-[12px] font-medium text-slate-400 dark:text-neutral-600">{stat.sub}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 md:px-0">
        {[
          { label: 'Penelitian', key: 'research', max: 60, steps: [0, 15, 30, 45, 60] },
          { label: 'Publikasi', key: 'pub', max: 80, steps: [0, 20, 40, 60, 80] },
          { label: 'HKI', key: 'hki', max: 28, steps: [0, 7, 14, 21, 28] },
        ].map((chart, idx) => (
          <div key={idx} className="bg-white dark:bg-neutral-900/40 border border-slate-200 dark:border-white/5 p-6 md:p-8 rounded-[2rem] shadow-sm flex flex-col">
            <div className="mb-8">
              <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">{chart.label} per Fakultas</h3>
              <p className="text-[12px] font-medium text-slate-400 dark:text-neutral-500 tracking-tight">Jumlah tersegmentasi berdasarkan fakultas</p>
            </div>
            
            <div className="h-64 flex items-end justify-between relative pl-8 pr-2 pt-10">
              <div className="absolute inset-y-0 left-0 right-0 flex flex-col justify-between pointer-events-none pt-10 pb-0">
                {[...chart.steps].reverse().map(step => (
                  <div key={step} className="flex items-center h-0 w-full group">
                    <span className="text-[10px] font-black text-slate-400 dark:text-neutral-700 w-8 pr-3 text-right tabular-nums">{step}</span>
                    <div className="flex-1 h-px bg-slate-100 dark:bg-white/5"></div>
                  </div>
                ))}
              </div>

              {FACULTY_CHART_DATA.map((fac, facIdx) => {
                const value = (fac as any)[chart.key];
                const height = (value / chart.max) * 100;
                const barColor = FACULTY_COLORS[fac.name] || '#4f46e5';
                
                return (
                  <div 
                    key={facIdx} 
                    className="relative flex-1 flex flex-col items-center group h-full justify-end cursor-pointer"
                    onMouseMove={(e) => handleMouseMove(e, fac.name, chart.label, value, barColor)}
                    onMouseEnter={(e) => handleMouseMove(e, fac.name, chart.label, value, barColor)}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={(e) => handleMouseMove(e, fac.name, chart.label, value, barColor)}
                  >
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 1, ease: "circOut", delay: facIdx * 0.05 }}
                      className="w-[70%] rounded-t-lg transition-all duration-300 relative shadow-sm group-hover:shadow-lg group-hover:brightness-110"
                      style={{ backgroundColor: barColor }}
                    >
                      <div className="absolute inset-x-0 -top-6 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-black text-slate-900 dark:text-white tabular-nums">{value}</span>
                      </div>
                    </motion.div>
                    <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-full text-center">
                       <span className="text-[9px] font-black text-slate-400 dark:text-neutral-600 uppercase truncate px-1 block">
                         {fac.name.substring(0, 3)}
                       </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="h-6"></div>
          </div>
        ))}
      </div>

      {/* Activity Log Section */}
      <div className="bg-white dark:bg-neutral-900/40 border md:rounded-[2.5rem] shadow-sm flex flex-col overflow-hidden mx-4 md:mx-0">
        <div className="px-6 md:px-10 py-6 md:py-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01]">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-6">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="sm:col-span-2 lg:col-span-1 space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">Cari Aktivitas</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Cari aktivitas..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="w-full h-11 pl-11 pr-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-medium dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">Fakultas</label>
                <div className="relative">
                  <select 
                    value={facultyFilter} 
                    onChange={handleFacultyChange} 
                    className="w-full h-11 appearance-none pl-4 pr-10 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-semibold text-slate-700 dark:text-neutral-200 outline-none cursor-pointer focus:ring-2 focus:ring-primary-500/20"
                  >
                    <option>Semua Fakultas</option>
                    {Object.keys(FACULTY_MAJORS).map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">Jurusan</label>
                <div className="relative">
                  <select 
                    value={deptFilter} 
                    onChange={(e) => setDeptFilter(e.target.value)} 
                    disabled={facultyFilter === 'Semua Fakultas'}
                    className="w-full h-11 appearance-none pl-4 pr-10 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-semibold text-slate-700 dark:text-neutral-200 outline-none cursor-pointer focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option>Semua Jurusan</option>
                    {availableDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">Aktivitas</label>
                <div className="relative">
                  <select 
                    value={typeFilter} 
                    onChange={(e) => setTypeFilter(e.target.value)} 
                    className="w-full h-11 appearance-none pl-4 pr-10 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-semibold text-slate-700 dark:text-neutral-200 outline-none cursor-pointer focus:ring-2 focus:ring-primary-500/20"
                  >
                    <option>Semua Aktivitas</option>
                    <option>Create</option>
                    <option>Update</option>
                    <option>Delete</option>
                    <option>Login</option>
                    <option>Logout</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <button 
              onClick={handleResetFilters} 
              className="h-11 px-6 bg-white dark:bg-white/5 text-slate-500 dark:text-neutral-400 font-bold rounded-xl border border-slate-200 dark:border-white/10 hover:text-primary-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm shrink-0"
            >
              <RotateCcw className="w-4 h-4" /> Reset Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          {/* DESKTOP TABLE */}
          <table className="hidden md:table w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
                <th className="px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Pengguna</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Fakultas</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Jenis</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Deskripsi</th>
                <th className="px-10 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {paginatedLog.length > 0 ? paginatedLog.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black text-white shadow-lg shrink-0" style={{ backgroundColor: FACULTY_COLORS[log.faculty.replace('Fakultas ', '')] || '#4f46e5' }}>
                        {log.user[0]}
                      </div>
                      <span className="text-[14px] font-medium text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-1">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[13px] font-semibold text-slate-900 dark:text-neutral-100">{log.faculty}</span>
                      <span className="text-[11px] font-medium text-slate-400 dark:text-neutral-500">{log.department}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${getActivityBadge(log.activityType)}`}>
                      {log.activityType}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-[13px] font-medium text-slate-500 dark:text-neutral-400 max-w-xs leading-relaxed line-clamp-2">{log.description}</p>
                  </td>
                  <td className="px-10 py-6 text-right tabular-nums">
                    <span className="text-[12px] font-bold text-slate-400 dark:text-neutral-600 whitespace-nowrap">{log.timestamp}</span>
                  </td>
                </tr>
              )) : null}
            </tbody>
          </table>

          {/* MOBILE PREMIUM CARDS - FIX Teks Panjang */}
          <div className="md:hidden flex flex-col p-4 space-y-4 bg-slate-50/50 dark:bg-black/20">
            {paginatedLog.length > 0 ? paginatedLog.map((log) => (
              <motion.div 
                key={log.id} 
                whileTap={{ scale: 0.98 }}
                className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm flex relative"
              >
                <div className="w-1.5 shrink-0" style={{ backgroundColor: FACULTY_COLORS[log.faculty.replace('Fakultas ', '')] || '#4f46e5' }} />
                
                <div className="p-5 flex-1 space-y-4">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-[12px] font-black text-white shadow-inner shrink-0 mt-0.5" style={{ backgroundColor: FACULTY_COLORS[log.faculty.replace('Fakultas ', '')] || '#4f46e5' }}>
                        {log.user[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Nama User Tanpa Clamp agar terlihat semua */}
                        <h4 className="text-[14px] font-bold text-slate-900 dark:text-white break-words leading-tight">{log.user}</h4>
                        <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                           <Clock className="w-3 h-3" />
                           <span className="text-[11px] font-semibold tabular-nums">{log.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shrink-0 ${getActivityBadge(log.activityType)}`}>
                      {log.activityType}
                    </span>
                  </div>

                  {/* Deskripsi Tanpa Clamp agar terlihat semua */}
                  <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4">
                    <p className="text-[13px] font-medium text-slate-600 dark:text-neutral-400 leading-relaxed italic break-words">
                      "{log.description}"
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <div className="px-2.5 py-1 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/10">
                      <p className="text-[9px] font-black text-slate-500 dark:text-neutral-500 uppercase tracking-tighter">
                        {log.faculty}
                      </p>
                    </div>
                    <div className="px-2.5 py-1 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/10">
                      <p className="text-[9px] font-black text-slate-500 dark:text-neutral-500 uppercase tracking-tighter">
                        {log.department}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )) : null}
          </div>

          {/* Empty State */}
          {paginatedLog.length === 0 && (
             <div className="py-24 flex flex-col items-center justify-center text-center px-10 animate-in fade-in duration-700 w-full">
              <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm"><Filter className="w-8 h-8 text-slate-300" /></div>
              <h3 className="text-[18px] font-bold text-slate-900 dark:text-white">Tidak ada kecocokan ditemukan</h3>
              <p className="text-[14px] text-slate-400 dark:text-neutral-500 mt-2 max-w-xs leading-relaxed">Kami tidak dapat menemukan aktivitas yang sesuai dengan kriteria filter Anda.</p>
              <button onClick={handleResetFilters} className="mt-8 px-8 py-3 bg-primary-50 dark:bg-primary-900/10 text-primary-600 dark:text-primary-400 font-bold rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/20 transition-all flex items-center gap-2"><RotateCcw className="w-4 h-4" />Hapus filter</button>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="px-5 md:px-10 py-6 md:py-8 border-t border-slate-100 dark:border-white/5 flex flex-col lg:flex-row items-center justify-between gap-6 bg-slate-50/20 dark:bg-white/[0.01]">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 w-full lg:w-auto">
            <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl shadow-sm w-full sm:w-auto justify-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Baris:</span>
              <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))} className="bg-transparent text-[13px] font-bold text-slate-700 dark:text-neutral-200 outline-none cursor-pointer pr-1">
                {[10, 25, 50].map(val => <option key={val} value={val} className="bg-white dark:bg-neutral-900">{val}</option>)}
              </select>
            </div>
            <p className="text-[12px] md:text-[13px] font-semibold text-slate-400 text-center">Menampilkan {paginatedLog.length} dari {filteredLog.length} aktivitas</p>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
              disabled={currentPage === 1} 
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-primary-600 disabled:opacity-30 disabled:cursor-default active:scale-90 transition-all shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                if (totalPages > 5 && Math.abs(currentPage - (i + 1)) > 1 && i !== 0 && i !== totalPages - 1) return null;
                return (
                  <button 
                    key={i} 
                    onClick={() => setCurrentPage(i + 1)} 
                    className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl text-[12px] md:text-[13px] font-bold transition-all active:scale-95 ${currentPage === i + 1 ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
              disabled={currentPage === totalPages} 
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-primary-600 disabled:opacity-30 disabled:cursor-default active:scale-90 transition-all shadow-sm"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Chart Tooltip Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999]">
        <AnimatePresence>
          {tooltip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="absolute"
              style={{ 
                left: tooltip.x, 
                top: tooltip.y - 85,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-3 shadow-2xl min-w-[160px] flex items-center gap-3">
                <div className="w-2 h-10 rounded-full shrink-0" style={{ backgroundColor: tooltip.color }}></div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest leading-none mb-1">
                    Fakultas {tooltip.faculty}
                  </p>
                  <div className="flex items-end gap-1.5">
                    <span className="text-[18px] font-black text-slate-900 dark:text-white tabular-nums leading-none">
                      {tooltip.value}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-neutral-600 mb-0.5">
                      {tooltip.label}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-3 h-3 bg-white/95 dark:bg-neutral-900/95 border-r border-b border-slate-200 dark:border-white/10 rotate-45 mx-auto -mt-1.5 shadow-xl"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};