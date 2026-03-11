import React from 'react';
import { motion } from 'framer-motion';
import { Book, FileText, FileSpreadsheet, Award, Download } from 'lucide-react';
import { useLayout } from '../components/layout/AppLayout';

interface ResourceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  fileName: string;
}

const RESOURCES: ResourceItem[] = [
  {
    id: '1',
    title: 'Manual Book PentaDosen',
    description: 'Panduan penggunaan sistem PentaDosen untuk dosen.',
    icon: <Book className="w-6 h-6" />,
    fileName: 'Manual_Book_PentaDosen.pdf'
  },
  {
    id: '2',
    title: 'Template Penelitian',
    description: 'Format standar untuk pengajuan proposal dan laporan penelitian.',
    icon: <FileText className="w-6 h-6" />,
    fileName: 'Template_Penelitian.docx'
  },
  {
    id: '3',
    title: 'Template Publikasi',
    description: 'Format standar untuk penulisan artikel publikasi ilmiah.',
    icon: <FileSpreadsheet className="w-6 h-6" />,
    fileName: 'Template_Publikasi.docx'
  },
  {
    id: '4',
    title: 'Template HKI',
    description: 'Format standar untuk pengajuan Hak Kekayaan Intelektual.',
    icon: <Award className="w-6 h-6" />,
    fileName: 'Template_HKI.docx'
  }
];

const btnScaleDown = {
  whileTap: { scale: 0.96 },
  transition: { duration: 0.12, ease: "easeOut" as any }
};

export const SumberDaya: React.FC = () => {
  const { showToast } = useLayout();

  const handleDownload = (fileName: string) => {
    // Simulate download
    const blob = new Blob(["Demo content for " + fileName], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast(`Berhasil mengunduh ${fileName}`, 'success');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="space-y-6 px-4 md:px-0">
        <div className="space-y-1.5">
          <h1 className="text-[20px] md:text-[24px] font-bold text-slate-900 dark:text-white tracking-tight">Sumber Daya</h1>
          <p className="text-[13px] md:text-[14px] text-slate-400 dark:text-neutral-500 font-medium tracking-tight">
            Kumpulan dokumen dan template yang dapat digunakan oleh dosen untuk mendukung kegiatan penelitian, publikasi, dan pengajuan HKI.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8 px-4 md:px-0">
        {RESOURCES.map((resource) => (
          <div 
            key={resource.id} 
            className="p-6 bg-white dark:bg-[#0D0D0D] border border-slate-200 dark:border-white/5 rounded-[2rem] shadow-sm flex flex-col justify-between space-y-6 group/card transition-all hover:border-primary-500/30 hover:shadow-md"
          >
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center shadow-sm group-hover/card:scale-110 transition-transform duration-500">
                {resource.icon}
              </div>
              <div>
                <h3 className="text-[16px] font-black text-slate-900 dark:text-white leading-tight mb-2">
                  {resource.title}
                </h3>
                <p className="text-[13px] font-medium text-slate-500 dark:text-neutral-400 leading-relaxed">
                  {resource.description}
                </p>
              </div>
            </div>
            
            <motion.button 
              {...btnScaleDown}
              onClick={() => handleDownload(resource.fileName)}
              className="w-full h-12 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-neutral-300 font-bold rounded-xl border border-slate-200 dark:border-white/10 hover:bg-primary-600 hover:text-white hover:border-primary-600 dark:hover:bg-primary-600 dark:hover:text-white dark:hover:border-primary-600 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" /> Download
            </motion.button>
          </div>
        ))}
      </div>
    </div>
  );
};
