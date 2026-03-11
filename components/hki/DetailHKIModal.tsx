import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowLeft, ShieldCheck, Clock, Calendar as CalendarIcon, Lock, ShieldAlert, CheckCircle2, Layers, Info, FileText, Eye, Download } from 'lucide-react';
import { HKIItem, ActionButton } from './shared';

interface HKIDetailViewProps {
  detail: HKIItem;
  onBack: () => void;
  onPreview: () => void;
  onDownload: () => void;
}

export const DetailHKIModal: React.FC<HKIDetailViewProps> = ({ detail, onBack, onPreview, onDownload }) => {
  const calculateExpiration = () => {
    if (detail.jenisCiptaan === 'Hak Cipta (Umum)') {
      return { 
        duration: 'Seumur Hidup + 70 Tahun',
        endDate: 'Tidak memiliki tanggal kedaluwarsa pasti',
        isUnlimited: true,
        status: 'Active'
      };
    }
    
    if (detail.jenisCiptaan === 'Rahasia Dagang') {
      return {
        duration: 'Berlaku Selamanya',
        endDate: 'Tidak memiliki batas waktu',
        isUnlimited: true,
        status: 'Active'
      };
    }

    const start = new Date(detail.tanggalDiumumkan);
    const years = detail.jenisCiptaan === 'Hak Cipta (Digital/PT)' ? 50 : 
                  detail.jenisCiptaan === 'Paten Biasa' ? 20 : 10;
    
    const end = new Date(start);
    end.setFullYear(start.getFullYear() + years);
    
    const isExpired = new Date() > end;
    
    return {
      duration: `${years} Tahun`,
      endDate: end.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      isUnlimited: false,
      isExpired,
      status: isExpired ? 'Expired' : 'Active'
    };
  };

  const protection = calculateExpiration();

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 md:px-0">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-1">
            <span>HKI</span><ChevronRight className="w-3 h-3" /><span className="text-primary-600">Detail HKI</span>
          </div>
          <h1 className="text-[24px] md:text-[28px] font-black text-slate-900 dark:text-white tracking-tight">Detail HKI</h1>
        </div>
        <button onClick={onBack} className="w-fit h-[48px] px-6 bg-white dark:bg-white/5 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-white/10 rounded-xl text-[13px] font-bold flex items-center gap-2 shadow-sm hover:bg-slate-50 dark:hover:bg-white/10 active:scale-95 transition-all"><ArrowLeft className="w-4 h-4" /> Kembali</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 md:px-0">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Rincian Informasi HKI</h3>
                <p className="text-[12px] text-slate-400 font-medium mt-0.5">Informasi pendaftaran and legalitas hak kekayaan intelektual.</p>
              </div>
            </div>
            <div className="space-y-8">
              <div><label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest block mb-2.5">Judul HKI</label><p className="text-[18px] md:text-[20px] font-bold text-slate-900 dark:text-white leading-snug">{detail.title}</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <DetailField label="Jenis Ciptaan" value={detail.jenisCiptaan} />
                <DetailField label="Status" value={detail.status} />
                <DetailField label="Nomor Permohonan" value={detail.nomorPermohonan || '-'} />
                <DetailField label="Nomor Pencatatan" value={detail.nomorPencatatan || '-'} />
                <DetailField label="Tempat Diumumkan" value={detail.tempatDiumumkan || '-'} />
              </div>
              
              <div className="pt-4">
                <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest block mb-4">Waktu Perlindungan</label>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-[2rem] border-2 shadow-sm ${protection.isExpired ? 'bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-900/20' : 'bg-primary-50/30 border-primary-100 dark:bg-primary-900/5 dark:border-primary-900/10'}`}
                >
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1 space-y-5">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${protection.isExpired ? 'bg-red-100 text-red-600' : 'bg-white dark:bg-neutral-800 text-primary-600'}`}>
                          <Clock className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Durasi Perlindungan</p>
                          <p className={`text-[16px] font-black ${protection.isExpired ? 'text-red-700 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>{protection.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${protection.isExpired ? 'bg-red-100 text-red-600' : 'bg-white dark:bg-neutral-800 text-primary-600'}`}>
                          <CalendarIcon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tanggal Mulai (Referensi)</p>
                          <p className="text-[14px] font-bold text-slate-700 dark:text-neutral-300">
                            {new Date(detail.tanggalDiumumkan).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 space-y-5">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${protection.isExpired ? 'bg-red-100 text-red-600' : 'bg-primary-600 text-white'}`}>
                          <Lock className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tanggal Kedaluwarsa</p>
                          <p className={`text-[16px] font-black ${protection.isExpired ? 'text-red-600' : 'text-primary-600 dark:text-primary-400'}`}>{protection.endDate}</p>
                        </div>
                      </div>
                      <div className="px-4 py-2 bg-white dark:bg-neutral-800/50 rounded-xl border border-slate-100 dark:border-white/5 inline-flex items-center gap-2">
                        {protection.isExpired ? (
                          <><ShieldAlert className="w-3.5 h-3.5 text-red-500" /><span className="text-[10px] font-black uppercase text-red-500 tracking-wider">Telah Kedaluwarsa</span></>
                        ) : (
                          <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /><span className="text-[10px] font-black uppercase text-green-600 tracking-wider">Perlindungan Aktif</span></>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-5 border-t border-slate-200/50 dark:border-white/10">
                    <p className="text-[11px] font-medium text-slate-500 dark:text-neutral-500 leading-relaxed italic">
                      * Berdasarkan UU yang berlaku, {detail.jenisCiptaan} memiliki waktu perlindungan selama {protection.duration} sejak {detail.jenisCiptaan.includes('Hak Cipta') ? 'pertama kali diumumkan' : 'tanggal penerimaan'}.
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="pt-4 space-y-8">
                <div><label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest block mb-4">Pencipta</label><div className="flex flex-wrap gap-2">{detail.pencipta.map(p => <span key={p} className="px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl text-[13px] font-bold dark:text-white">{p}</span>)}</div></div>
                <div><label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest block mb-4">Pemegang Hak</label><div className="flex flex-wrap gap-2">{detail.pemegang.map(p => <span key={p} className="px-4 py-2 bg-amber-50 dark:bg-amber-900/10 border border-amber-200/20 rounded-xl text-[13px] font-bold text-amber-700 dark:text-amber-400">{p}</span>)}</div></div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[18px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Berkas HKI</h3>
                <p className="text-[12px] text-slate-400 font-medium mt-0.5">Kelola dokumen pendaftaran atau sertifikat hak kekayaan intelektual.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DocActionCard 
                title="Dokumen HKI" 
                isUploaded={!!detail.hkiFileName} 
                tooltipPrefix="HKI" 
                onPreview={onPreview} 
                onDownload={onDownload} 
              />
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <div className="bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-50 dark:border-white/5 pb-4">
              <span className="text-slate-400"><Info className="w-4 h-4" /></span>
              <h4 className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Catatan Sistem</h4>
            </div>
            <p className="text-[12px] text-slate-500 dark:text-neutral-500 leading-relaxed font-medium">Data perlindungan dihitung secara otomatis berdasarkan tanggal pengumuman/penerimaan referensi yang dimasukkan pada sistem.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DetailFieldProps {
  label: string;
  value: string;
  isHighlighted?: boolean;
}

const DetailField: React.FC<DetailFieldProps> = ({ label, value, isHighlighted }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest block">{label}</label>
    <p className={`text-[15px] font-bold ${isHighlighted ? 'text-primary-600' : 'text-slate-700 dark:text-neutral-200'}`}>{value}</p>
  </div>
);

const DocActionCard: React.FC<{ 
  title: string; 
  isUploaded: boolean; 
  tooltipPrefix: string; 
  onPreview?: () => void; 
  onDownload?: () => void 
}> = ({ title, isUploaded, tooltipPrefix, onPreview, onDownload }) => (
  <div className="p-6 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-[2rem] space-y-5 group/card transition-all hover:border-primary-500/20">
    <div className="flex items-center justify-between">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${isUploaded ? 'bg-primary-600 text-white' : 'bg-white dark:bg-neutral-800 text-slate-300'}`}>
        <FileText className="w-5 h-5" />
      </div>
      {isUploaded && (
        <div className="px-2.5 py-1 bg-green-50 dark:bg-green-900/20 rounded-md">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
        </div>
      )}
    </div>
    <div className="min-w-0">
      <h5 className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-wider truncate">{title}</h5>
      <p className="text-[11px] font-medium text-slate-400 mt-1">
        {isUploaded ? 'Dokumen tersedia' : 'Dokumen HKI belum diunggah'}
      </p>
    </div>
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 pt-2">
      {isUploaded ? (
        <>
          <ActionButton icon={<Eye />} tooltip={`Pratinjau ${tooltipPrefix}`} onClick={onPreview} />
          <ActionButton icon={<Download />} tooltip={`Unduh ${tooltipPrefix}`} onClick={onDownload} />
        </>
      ) : (
        <div className="text-[11px] font-bold text-slate-300 uppercase tracking-widest italic py-2">Berkas tidak tersedia</div>
      )}
    </div>
  </div>
);
