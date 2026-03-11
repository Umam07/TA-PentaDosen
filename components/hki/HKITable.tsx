import React from 'react';
import { Eye, Download, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { HKIItem, getStatusStyles, ActionButton } from './shared';

interface HKITableProps {
  paginatedHKI: HKIItem[];
  filteredHKILength: number;
  rowsPerPage: number;
  setRowsPerPage: (val: number) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  openPreview: (item: HKIItem) => void;
  handleDownload: (item: HKIItem) => void;
  setSelectedHkiDetail: (item: HKIItem) => void;
  openEditModal: (item: HKIItem) => void;
  onDeleteConfirm: (item: HKIItem) => void;
}

export const HKITable: React.FC<HKITableProps> = ({
  paginatedHKI,
  filteredHKILength,
  rowsPerPage,
  setRowsPerPage,
  currentPage,
  setCurrentPage,
  totalPages,
  openPreview,
  handleDownload,
  setSelectedHkiDetail,
  openEditModal,
  onDeleteConfirm
}) => {
  return (
    <>
      <div className="hidden md:block overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1300px]">
          <thead>
            <tr className="bg-slate-50/30 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/10">
              <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Judul HKI</th>
              <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Pencipta Utama</th>
              <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Jenis Ciptaan</th>
              <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Nomor Pencatatan</th>
              <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Status</th>
              <th className="px-4 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Tahun</th>
              <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Berkas</th>
              <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {paginatedHKI.length > 0 ? paginatedHKI.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6 max-w-sm"><p className="text-[14px] font-medium text-slate-900 dark:text-white leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">{item.title}</p></td>
                <td className="px-6 py-6"><span className="text-[13px] font-bold text-slate-800 dark:text-neutral-200">{item.pencipta[0] || '-'}</span></td>
                <td className="px-6 py-6"><span className="inline-block px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-wider rounded-lg border border-primary-100 dark:border-primary-900/30 whitespace-nowrap text-center leading-none">{item.jenisCiptaan}</span></td>
                <td className="px-6 py-6 text-[13px] font-medium text-slate-600 dark:text-neutral-400 tabular-nums">{item.nomorPencatatan || '-'}</td>
                <td className="px-6 py-6 text-center"><span className={`inline-block px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap text-center leading-none ${getStatusStyles(item.status)}`}>{item.status}</span></td>
                <td className="px-4 py-6 text-[13px] font-medium text-slate-500 dark:text-neutral-400">{item.year}</td>
                <td className="px-6 py-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {item.hkiFileName ? <><ActionButton icon={<Eye />} onClick={() => openPreview(item)} /><ActionButton icon={<Download />} onClick={() => handleDownload(item)} /></> : <span className="text-[11px] text-slate-300">-</span>}
                  </div>
                </td>
                <td className="px-8 py-6"><div className="flex items-center justify-end gap-2.5"><ActionButton icon={<Eye />} tooltip="Detail HKI" variant="ghost" onClick={() => setSelectedHkiDetail(item)} /><ActionButton icon={<Pencil />} tooltip="Edit Data" variant="ghost" onClick={() => openEditModal(item)} /><ActionButton icon={<Trash2 />} tooltip="Hapus Data" variant="danger" onClick={() => onDeleteConfirm(item)} /></div></td>
              </tr>
            )) : <tr><td colSpan={8} className="py-20 text-center text-slate-400 font-medium">Tidak ada data HKI ditemukan.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col divide-y divide-slate-100 dark:divide-white/5">
        {paginatedHKI.length > 0 ? paginatedHKI.map((item) => (
          <div key={item.id} className="p-6 space-y-5 bg-white dark:bg-transparent">
            <h4 className="text-[16px] font-medium text-slate-900 dark:text-white leading-relaxed">{item.title}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pencipta Pertama</p><p className="text-[13px] font-bold text-slate-700 dark:text-neutral-200">{item.pencipta[0] || '-'}</p></div>
              <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tahun</p><p className="text-[13px] font-bold text-slate-700 dark:text-neutral-200">{item.year}</p></div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-block px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-wider rounded-lg border border-primary-100 dark:border-primary-900/30 whitespace-nowrap text-center leading-none">{item.jenisCiptaan}</span>
              <span className={`inline-block px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap text-center leading-none ${getStatusStyles(item.status)}`}>{item.status}</span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
              <div className="flex gap-1.5">
                <ActionButton icon={<Eye />} variant="ghost" onClick={() => setSelectedHkiDetail(item)} />
                <ActionButton icon={<Pencil />} variant="ghost" onClick={() => openEditModal(item)} />
                <ActionButton icon={<Trash2 />} variant="danger" onClick={() => onDeleteConfirm(item)} />
              </div>
              <div className="text-[12px] font-black text-primary-600/50 uppercase tracking-widest tabular-nums">ID: {item.id}</div>
            </div>
          </div>
        )) : <div className="py-20 text-center text-slate-400 px-6 font-medium">Tidak ada data hasil pencarian.</div>}
      </div>

      <div className="px-6 md:px-10 py-8 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-50/20 dark:bg-white/[0.01]">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-8 w-full md:w-auto">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl shadow-sm hover:border-primary-500/50 transition-colors">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Baris:</span>
            <select 
              value={rowsPerPage} 
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }} 
              className="bg-transparent text-[13px] font-bold text-slate-700 dark:text-neutral-200 outline-none cursor-pointer pr-1"
            >
              {[10, 25, 50, 100].map(val => <option key={val} value={val} className="bg-white dark:bg-neutral-900">{val}</option>)}
            </select>
          </div>
          <p className="text-[13px] font-semibold text-slate-400">Menampilkan {paginatedHKI.length} dari {filteredHKILength} HKI</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto justify-center">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p-1))} 
            disabled={currentPage === 1} 
            className={`w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-primary-600 disabled:opacity-30 transition-all shadow-sm active:scale-90`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentPage(i+1)} 
                className={`w-10 h-10 flex items-center justify-center rounded-xl text-[13px] font-bold transition-all active:scale-95 ${currentPage === i+1 ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
              >
                {i+1}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} 
            disabled={currentPage === totalPages} 
            className={`w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-primary-600 disabled:opacity-30 transition-all shadow-sm active:scale-90`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </>
  );
};
