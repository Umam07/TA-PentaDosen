import React from 'react';
import { Eye, Download, Upload, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ResearchItem, getStatusStyles, ActionButton } from './shared';

interface PenelitianTableProps {
  paginatedResearch: ResearchItem[];
  filteredResearchLength: number;
  rowsPerPage: number;
  setRowsPerPage: (val: number) => void;
  currentPage: number;
  setCurrentPage: (val: number | ((prev: number) => number)) => void;
  totalPages: number;
  setSelectedResearchDetail: (item: ResearchItem) => void;
  openEditModal: (item: ResearchItem) => void;
  openDeleteConfirm: (item: ResearchItem) => void;
  handleDownload: (item: ResearchItem, type: 'proposal' | 'progress' | 'final') => void;
  openPreview: (item: ResearchItem, type: 'proposal' | 'progress' | 'final') => void;
  handleTriggerReportUpload: (id: string, type: 'proposal' | 'progress' | 'final') => void;
}

export const PenelitianTable: React.FC<PenelitianTableProps> = ({
  paginatedResearch,
  filteredResearchLength,
  rowsPerPage,
  setRowsPerPage,
  currentPage,
  setCurrentPage,
  totalPages,
  setSelectedResearchDetail,
  openEditModal,
  openDeleteConfirm,
  handleDownload,
  openPreview,
  handleTriggerReportUpload
}) => {
  return (
    <>
      <div className="hidden md:block overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-slate-50/30 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/10">
              <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Judul Penelitian</th>
              <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Ketua Peneliti</th>
              <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400" style={{ minWidth: '160px' }}>Skema</th>
              <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400" style={{ minWidth: '160px' }}>Status</th>
              <th className="px-4 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Tahun</th>
              <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Progress</th>
              <th className="px-6 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Final</th>
              <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {paginatedResearch.length > 0 ? paginatedResearch.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6 max-sm"><p className="text-[14px] font-medium text-slate-900 dark:text-white leading-snug group-hover:text-primary-600 transition-colors">{item.title}</p></td>
                <td className="px-6 py-6"><div className="flex items-center gap-3"><span className="text-[13px] font-bold text-slate-800 dark:text-neutral-200">{item.leadResearcher}</span></div></td>
                <td className="px-6 py-6"><span className="inline-block px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-wider rounded-lg whitespace-nowrap text-center leading-none">{item.scheme}</span></td>
                <td className="px-6 py-6"><span className={`inline-block px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap text-center leading-none ${getStatusStyles(item.status)}`}>{item.status || 'Aktif'}</span></td>
                <td className="px-4 py-6"><span className="text-[13px] font-medium text-slate-500 dark:text-neutral-400">{item.year}</span></td>
                <td className="px-6 py-6 text-center"><div className="flex items-center justify-center gap-2">{item.progressReport ? <><ActionButton icon={<Eye />} tooltip="Pratinjau File" onClick={() => openPreview(item, 'progress')} /><ActionButton icon={<Download />} tooltip="Unduh File" onClick={() => handleDownload(item, 'progress')} /></> : <ActionButton icon={<Upload />} tooltip="Unggah Laporan Kemajuan" onClick={() => handleTriggerReportUpload(item.id, 'progress')} />}</div></td>
                <td className="px-6 py-6 text-center"><div className="flex items-center justify-center gap-2">{item.finalReport ? <><ActionButton icon={<Eye />} tooltip="Pratinjau File" onClick={() => openPreview(item, 'final')} /><ActionButton icon={<Download />} tooltip="Unduh File" onClick={() => handleDownload(item, 'final')} /></> : <ActionButton icon={<Upload />} tooltip="Unggah Laporan Akhir" onClick={() => handleTriggerReportUpload(item.id, 'final')} />}</div></td>
                <td className="px-8 py-6"><div className="flex items-center justify-end gap-2.5"><ActionButton icon={<Eye />} tooltip="Detail Penelitian" variant="ghost" onClick={() => setSelectedResearchDetail(item)} /><ActionButton icon={<Pencil />} tooltip="Edit Data" variant="ghost" onClick={() => openEditModal(item)} /><ActionButton icon={<Trash2 />} tooltip="Hapus Data" variant="danger" onClick={() => openDeleteConfirm(item)} /></div></td>
              </tr>
            )) : <tr><td colSpan={8} className="py-20 text-center text-slate-400">Tidak ada data.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="md:hidden flex flex-col divide-y divide-slate-100 dark:divide-white/5">
        {paginatedResearch.length > 0 ? paginatedResearch.map((item) => (
          <div key={item.id} className="p-6 space-y-5 bg-white dark:bg-transparent">
            <h4 className="text-[16px] font-medium text-slate-900 dark:text-white leading-relaxed">{item.title}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ketua Peneliti</p><p className="text-[13px] font-bold text-slate-700 dark:text-neutral-200">{item.leadResearcher}</p></div>
              <div className="space-y-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tahun</p><p className="text-[13px] font-bold text-slate-700 dark:text-neutral-200">{item.year}</p></div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-wider rounded-lg border border-primary-100 dark:border-primary-900/30 whitespace-nowrap text-center leading-none">{item.scheme}</span>
              <span className={`px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap text-center leading-none ${getStatusStyles(item.status)}`}>{item.status || 'Aktif'}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mb-3 text-center">Progress</p>
                <div className="flex justify-center gap-2">{item.progressReport ? (<><ActionButton icon={<Eye />} onClick={() => openPreview(item, 'progress')} /><ActionButton icon={<Download />} onClick={() => handleDownload(item, 'progress')} /></>) : (<ActionButton icon={<Upload />} onClick={() => handleTriggerReportUpload(item.id, 'progress')} />)}</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mb-3 text-center">Final</p>
                <div className="flex justify-center gap-2">{item.finalReport ? (<><ActionButton icon={<Eye />} onClick={() => openPreview(item, 'final')} /><ActionButton icon={<Download />} onClick={() => handleDownload(item, 'final')} /></>) : (<ActionButton icon={<Upload />} onClick={() => handleTriggerReportUpload(item.id, 'final')} />)}</div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
              <div className="flex gap-1.5"><ActionButton icon={<Eye />} variant="ghost" onClick={() => setSelectedResearchDetail(item)} /><ActionButton icon={<Pencil />} variant="ghost" onClick={() => openEditModal(item)} /><ActionButton icon={<Trash2 />} variant="danger" onClick={() => openDeleteConfirm(item)} /></div>
              <div className="text-[12px] font-black text-primary-600/50 uppercase tracking-widest tabular-nums">ID: {item.id}</div>
            </div>
          </div>
        )) : <div className="py-20 text-center text-slate-400 px-6">Tidak ada data hasil pencarian.</div>}
      </div>
      <div className="px-6 md:px-10 py-8 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-50/20 dark:bg-white/[0.01]">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-8 w-full md:w-auto">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl shadow-sm hover:border-primary-500/50 transition-colors">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Baris:</span>
            <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))} className="bg-transparent text-[13px] font-bold text-slate-700 dark:text-neutral-200 outline-none cursor-pointer pr-1">
              {[10, 25, 50, 100].map(val => <option key={val} value={val} className="bg-white dark:bg-neutral-900">{val}</option>)}
            </select>
          </div>
          <p className="text-[13px] font-semibold text-slate-400">Menampilkan {paginatedResearch.length} dari {filteredResearchLength} penelitian</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto justify-center">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
            disabled={currentPage === 1} 
            className={`w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-primary-600 dark:hover:text-white hover:border-primary-500 disabled:opacity-30 disabled:cursor-default transition-all shadow-sm active:scale-90`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 flex items-center justify-center rounded-xl text-[13px] font-bold transition-all active:scale-95 ${currentPage === i + 1 ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>{i + 1}</button>
            ))}
          </div>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
            disabled={currentPage === totalPages} 
            className={`w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-primary-600 dark:hover:text-white hover:border-primary-500 disabled:opacity-30 disabled:cursor-default transition-all shadow-sm active:scale-90`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </>
  );
};
