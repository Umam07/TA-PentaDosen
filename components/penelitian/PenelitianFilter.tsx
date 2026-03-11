import React from 'react';
import { Search, ChevronDown, RotateCcw } from 'lucide-react';

interface PenelitianFilterProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  schemeFilter: string;
  setSchemeFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  yearFilter: string;
  setYearFilter: (val: string) => void;
  onReset: () => void;
}

export const PenelitianFilter: React.FC<PenelitianFilterProps> = ({
  searchQuery,
  setSearchQuery,
  schemeFilter,
  setSchemeFilter,
  statusFilter,
  setStatusFilter,
  yearFilter,
  setYearFilter,
  onReset
}) => {
  return (
    <div className="px-6 md:px-10 py-6 md:py-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01]">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">Cari Penelitian</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Cari judul..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-11 pl-11 pr-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-medium dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 transition-all" />
            </div>
          </div>
          <div className="lg:col-span-1 space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">Skema</label>
            <div className="relative group">
              <select value={schemeFilter} onChange={(e) => setSchemeFilter(e.target.value)} className="w-full h-11 appearance-none pl-4 pr-10 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-normal text-slate-700 dark:text-neutral-200 outline-none cursor-pointer"><option>Semua Skema</option><option>Hibah Internal</option><option>Hibah External</option><option>Mandiri</option></select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="lg:col-span-1 space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">Status</label>
            <div className="relative group">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full h-11 appearance-none pl-4 pr-10 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-normal text-slate-700 dark:text-neutral-200 outline-none cursor-pointer"><option>Semua Status</option><option>Proposal</option><option>Sedang Berjalan</option><option>Lengkap</option><option>Ditolak</option></select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="lg:col-span-1 space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">Tahun</label>
            <div className="relative group">
              <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="w-full h-11 appearance-none pl-4 pr-10 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-normal text-slate-700 dark:text-neutral-200 outline-none cursor-pointer"><option>Semua Tahun</option><option>2024</option><option>2025</option><option>2026</option></select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
        <button onClick={onReset} className="h-11 px-6 bg-white dark:bg-white/5 text-slate-500 dark:text-neutral-400 font-bold rounded-xl border border-slate-200 dark:border-white/10 hover:text-primary-600 dark:hover:text-white hover:border-primary-500/40 transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0 shadow-sm"><RotateCcw className="w-4 h-4" /> Reset Filter</button>
      </div>
    </div>
  );
};
