import React from 'react';
import { Search, ChevronDown, RotateCcw } from 'lucide-react';
import { JENIS_OPTIONS } from './shared';

interface HKIFilterProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  typeFilter: string;
  setTypeFilter: (val: string) => void;
  yearFilter: string;
  setYearFilter: (val: string) => void;
  onReset: () => void;
}

export const HKIFilter: React.FC<HKIFilterProps> = ({
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  yearFilter,
  setYearFilter,
  onReset
}) => {
  return (
    <div className="px-6 md:px-10 py-6 md:py-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01]">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">Cari HKI</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Cari judul atau nomor pencatatan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-11 pl-11 pr-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-medium outline-none text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 transition-all" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">Jenis</label>
            <div className="relative">
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full h-11 appearance-none pl-4 pr-10 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-semibold outline-none cursor-pointer text-slate-700 dark:text-neutral-200"><option>Semua Jenis</option>{JENIS_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}</select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">Tahun</label>
            <div className="relative">
              <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="w-full h-11 appearance-none pl-4 pr-10 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-semibold outline-none cursor-pointer text-slate-700 dark:text-neutral-200">
                <option>Semua Tahun</option>
                <option>2024</option>
                <option>2025</option>
                <option>2026</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
        <button onClick={onReset} className="h-11 px-6 bg-white dark:bg-white/5 text-slate-500 dark:text-neutral-400 font-bold rounded-xl border border-slate-200 dark:border-white/10 hover:text-primary-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm shrink-0"><RotateCcw className="w-4 h-4" /> Reset Filter</button>
      </div>
    </div>
  );
};
