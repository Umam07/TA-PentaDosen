import React from 'react';
import { ChevronRight, ArrowLeft, FileText, Layers, User, Info, Building2, Briefcase, GraduationCap, Eye, Download, Upload, CheckCircle2 } from 'lucide-react';
import { ResearchItem, getStatusStyles, ActionButton } from './shared';
import { terbilangRupiah } from './utils';

export interface DetailPenelitianModalProps {
  detail: ResearchItem;
  onBack: () => void;
  onPreview: (type: 'proposal' | 'progress' | 'final') => void;
  onDownload: (type: 'proposal' | 'progress' | 'final') => void;
  onUploadReport: (id: string, type: 'progress' | 'final' | 'proposal') => void;
}

export const DetailPenelitianModal: React.FC<DetailPenelitianModalProps> = ({ detail, onBack, onPreview, onDownload, onUploadReport }) => (
  <div className="space-y-10">
    <div className="space-y-6 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1">
            <span>Penelitian</span><ChevronRight className="w-3 h-3" />
            <span className="text-primary-600">Detail Penelitian</span>
          </div>
          <h1 className="text-[24px] md:text-[28px] font-black text-slate-900 dark:text-white tracking-tight">Detail Penelitian</h1>
        </div>
        <button onClick={onBack} className="w-fit h-[48px] px-6 bg-white dark:bg-white/5 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"><ArrowLeft className="w-4 h-4" /> Kembali</button>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 md:px-0">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-10">
          <div className="flex items-center gap-4"><div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-2xl flex items-center justify-center"><FileText className="w-6 h-6" /></div><div><h3 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Rincian Proposal Penelitian</h3><p className="text-[12px] text-slate-400 font-medium mt-0.5">Informasi lengkap terkait proposal riset yang diajukan.</p></div></div>
          <div className="space-y-8">
            <div><label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest block mb-2.5">Judul Penelitian</label><p className="text-[18px] md:text-[20px] font-bold text-slate-900 dark:text-white leading-snug">{detail.title}</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <DetailField label="Skema" value={detail.scheme} />
              <DetailField label="Sumber Dana" value={detail.sourceOfFunds || 'Universitas YARSI'} />
              <DetailField label="Anggaran Diusulkan" value={detail.proposedAmount || detail.amount} terbilang={terbilangRupiah(detail.proposedAmount || detail.amount)} />
              <DetailField label="Anggaran Didanai" value={detail.amount} terbilang={terbilangRupiah(detail.amount)} />
              <DetailField label="Tahun" value={detail.year} />
              <DetailField label="Status" value={detail.status || 'Aktif'} badgeStyles={getStatusStyles(detail.status)} />
            </div>
            <div className="pt-4">
              <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest block mb-4">Anggota Peneliti (Project Members)</label>
              <div className="flex flex-wrap gap-2.5">
                <div className="h-10 px-4 bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/20 rounded-xl flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-600 text-[10px] font-black text-white flex items-center justify-center shadow-sm">
                    {detail.leadResearcher[0]}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-primary-700 dark:text-primary-300">{detail.leadResearcher}</span>
                    <span className="px-2 py-0.5 bg-primary-600/10 text-primary-600 dark:text-primary-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-primary-600/10">Ketua Peneliti</span>
                  </div>
                </div>
                {detail.members.map((member, idx) => (
                  <div key={idx} className="h-10 px-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white dark:bg-neutral-800 text-[10px] font-black text-primary-600 flex items-center justify-center shadow-sm">
                      {member[0]}
                    </div>
                    <span className="text-[13px] font-bold text-slate-700 dark:text-neutral-200">{member}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-8">
          <div className="flex items-center gap-4"><div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl flex items-center justify-center"><Layers className="w-6 h-6" /></div><div><h3 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Dokumen Penelitian</h3><p className="text-[12px] text-slate-400 font-medium mt-0.5">Kelola berkas proposal, laporan kemajuan, dan laporan akhir.</p></div></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DocActionCard title="Berkas Proposal" isUploaded={!!detail.proposalFileName} tooltipPrefix="Proposal" onUpload={() => onUploadReport(detail.id, 'proposal')} onPreview={() => onPreview('proposal')} onDownload={() => onDownload('proposal')} />
            <DocActionCard title="Laporan Kemajuan" isUploaded={!!detail.progressReport} tooltipPrefix="Laporan Kemajuan" onUpload={() => onUploadReport(detail.id, 'progress')} onPreview={() => onPreview('progress')} onDownload={() => onDownload('progress')} />
            <DocActionCard title="Laporan Akhir" isUploaded={!!detail.finalReport} tooltipPrefix="Laporan Akhir" onUpload={() => onUploadReport(detail.id, 'final')} onPreview={() => onPreview('final')} onDownload={() => onDownload('final')} />
          </div>
        </div>
      </div>
      <div className="space-y-8">
        <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm space-y-8 sticky top-10">
          <div className="flex items-center gap-3 border-b border-slate-50 dark:border-white/5 pb-6"><div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl flex items-center justify-center"><User className="w-5 h-5" /></div><h4 className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Ketua Peneliti</h4></div>
          <div className="space-y-6">
            <div className="flex flex-col items-center py-4"><div className="w-20 h-20 bg-primary-600 text-white rounded-[2rem] flex items-center justify-center text-2xl font-black shadow-xl shadow-primary-500/20 mb-4">JD</div><h5 className="text-[18px] font-black text-slate-900 dark:text-white text-center leading-tight">{detail.leadResearcher}</h5><p className="text-[12px] font-bold text-primary-600 uppercase tracking-widest mt-2">Dosen Tetap</p></div>
            <div className="space-y-5 pt-4">
              <SidebarField label="NIDN" value="1-402022-048" icon={<Info className="w-3.5 h-3.5" />} />
              <SidebarField label="NIP" value="14020220-488888-88-88" icon={<Info className="w-3.5 h-3.5" />} />
              <SidebarField label="Universitas" value="Universitas YARSI" icon={<Building2 className="w-3.5 h-3.5" />} />
              <SidebarField label="Fakultas" value="Teknologi Informasi" icon={<Briefcase className="w-3.5 h-3.5" />} />
              <SidebarField label="Program Studi" value="Teknik Informatika" icon={<GraduationCap className="w-3.5 h-3.5" />} />
              <SidebarField label="Email" value="jane.doe@fti.yarsi.ac.id" icon={<FileText className="w-3.5 h-3.5" />} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const DetailField: React.FC<{ label: string; value: string; badgeStyles?: string; terbilang?: string }> = ({ label, value, badgeStyles, terbilang }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest block">{label}</label>
    {badgeStyles ? (<span className={`inline-block px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider ${badgeStyles}`}>{value}</span>) : (<div className="flex flex-col gap-1"><p className="text-[15px] font-bold text-slate-700 dark:text-neutral-200">{value}</p>{terbilang && (<p className="text-[12px] text-slate-400 dark:text-neutral-500 italic font-medium">({terbilang})</p>)}</div>)}
  </div>
);

const SidebarField: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="flex items-start gap-4 p-3.5 bg-slate-50/50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-2xl">
    <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/5 flex items-center justify-center text-slate-400 shrink-0 shadow-sm border border-slate-100 dark:border-white/5">{icon}</div>
    <div className="min-w-0"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p><p className="text-[13px] font-bold text-slate-700 dark:text-neutral-200 truncate">{value}</p></div>
  </div>
);

const DocActionCard: React.FC<{ title: string; isUploaded: boolean; tooltipPrefix: string; onUpload?: () => void; onPreview?: () => void; onDownload?: () => void }> = ({ title, isUploaded, tooltipPrefix, onUpload, onPreview, onDownload }) => (
  <div className="p-6 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-[2rem] space-y-5 group/card transition-all hover:border-primary-500/20">
    <div className="flex items-center justify-between"><div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${isUploaded ? 'bg-primary-600 text-white' : 'bg-white dark:bg-neutral-800 text-slate-300'}`}><FileText className="w-5 h-5" /></div>{isUploaded && (<div className="px-2.5 py-1 bg-green-50 dark:bg-green-900/20 rounded-md"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /></div>)}</div>
    <div><h5 className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-wider">{title}</h5><p className="text-[11px] font-medium text-slate-400 mt-1">{isUploaded ? 'Dokumen tersedia' : 'Belum diunggah'}</p></div>
    <div className="flex items-center gap-2 pt-2">{isUploaded ? (<><ActionButton icon={<Eye />} tooltip={`Pratinjau ${tooltipPrefix}`} onClick={onPreview} /><ActionButton icon={<Download />} tooltip={`Unduh ${tooltipPrefix}`} onClick={onDownload} /></>) : (<ActionButton icon={<Upload />} tooltip={`Unggah ${tooltipPrefix}`} onClick={onUpload} />)}</div>
  </div>
);
