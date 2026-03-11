import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Download, FileSearch, FileText } from 'lucide-react';

const appleEase = [0.22, 1, 0.36, 1] as any;

const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const modalVariants = {
  initial: { opacity: 0, scale: 0.96, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 12 }
};

const modalTransition = {
  duration: 0.35,
  ease: appleEase
};

interface PreviewModalProps {
  fileName: string;
  fileUrl: string;
  fileType: string;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ fileName, fileUrl, fileType, onClose }) => {
  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      <motion.div 
        variants={backdropVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="absolute inset-0 bg-black/45 dark:bg-black/80 backdrop-blur-xl" 
        onClick={onClose} 
      />
      <motion.div 
        variants={modalVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={modalTransition}
        className="relative bg-white dark:bg-[#0D0D0D] w-full md:w-[92vw] md:max-w-6xl h-full md:h-[90vh] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/10"
      >
        <div className="px-6 py-4 md:px-10 md:py-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center shrink-0 bg-white/80 dark:bg-black/60 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-primary-600/10 text-primary-600 rounded-xl flex items-center justify-center shrink-0">
              <FileSearch className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[16px] md:text-[19px] font-black text-slate-900 dark:text-white leading-tight truncate max-w-[200px] md:max-w-md">
                {fileName}
              </h3>
              <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-0.5">
                Quick Look Preview
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             {fileUrl && (
               <button 
                 onClick={() => { const a = document.createElement('a'); a.href = fileUrl; a.download = fileName; a.click(); }}
                 className="hidden sm:flex h-11 px-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-neutral-300 font-bold rounded-xl items-center gap-2 hover:bg-slate-100 transition-all active:scale-95"
               >
                 <Download className="w-4 h-4" /> Unduh
               </button>
             )}
             <button 
               onClick={onClose} 
               className="w-11 h-11 flex items-center justify-center bg-slate-100 dark:bg-white/10 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all active:scale-90"
               aria-label="Tutup Pratinjau"
             >
               <X className="w-6 h-6" />
             </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden bg-slate-50 dark:bg-black relative">
          {fileUrl && fileType === 'pdf' ? (
            <div className="w-full h-full p-2 md:p-6 lg:p-8">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-white shadow-2xl border border-black/5">
                <iframe 
                  src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=1`} 
                  className="w-full h-full border-none" 
                  title="PDF Document Viewer" 
                />
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center p-6">
              <div className="max-w-md w-full bg-white dark:bg-neutral-900/60 p-10 md:p-16 rounded-[3rem] text-center shadow-2xl border border-slate-100 dark:border-white/5 space-y-10 animate-in fade-in zoom-in-95 duration-700 backdrop-blur-md">
                <div className="w-24 h-24 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner relative group">
                  <div className="absolute inset-0 bg-primary-500/20 blur-2xl rounded-full scale-50 group-hover:scale-100 transition-transform duration-1000 opacity-0 group-hover:opacity-100"></div>
                  <FileText className="w-12 h-12 relative z-10" />
                </div>
                <div className="space-y-4">
                  <h4 className="text-[22px] md:text-[26px] font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    Pratinjau tidak tersedia
                  </h4>
                  <p className="text-[15px] md:text-[17px] text-slate-500 dark:text-neutral-400 leading-relaxed font-medium">
                    {fileType === 'pdf' 
                      ? 'Berkas demo ini tidak memiliki konten fisik untuk dipratinjau. Silakan unggah berkas PDF baru Anda untuk mengaktifkan fitur penampil dokumen.' 
                      : 'Pratinjau langsung untuk format file .DOCX saat ini tidak didukung. Silakan unduh berkas untuk melihat konten secara lokal.'}
                  </p>
                </div>
                <div className="flex flex-col gap-3 pt-4">
                  {fileUrl && (
                    <button 
                      onClick={() => { const a = document.createElement('a'); a.href = fileUrl; a.download = fileName; a.click(); }} 
                      className="w-full py-5 bg-primary-600 text-white font-black rounded-2xl shadow-xl shadow-primary-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 hover:bg-primary-700"
                    >
                      <Download className="w-5 h-5" /> Unduh Berkas
                    </button>
                  )}
                  <button 
                    onClick={onClose}
                    className="w-full py-5 bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-neutral-400 font-bold rounded-2xl active:scale-[0.98] transition-all"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
