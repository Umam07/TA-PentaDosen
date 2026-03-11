import React from 'react';
import { motion } from 'framer-motion';

export interface PublicationItem {
  id: string;
  title: string;
  author: string; 
  coAuthors: string[];
  category: 'Publikasi Karya Ilmiah' | 'Publikasi Buku Ilmiah';
  type: 'Artikel' | 'Buku' | 'Majalah';
  publisher: string;
  pages: string;
  isbn: string;
  abstract?: string;
  year: string;
  status: 'Lengkap' | 'Sedang Berjalan';
  manuscriptFile?: File;
  manuscriptFileName?: string;
}

export const MEMBER_SUGGESTIONS = [
  'Prof. Ahmad Fauzi',
  'Dr. Sarah Putri, S.T., M.Kom.',
  'Dr. Budi Santoso, S.Kom., M.M.',
  'Lisa Kurniawan, S.Ds., M.Sn.',
  'Dr. Linda Sari',
  'Hendra Wijaya',
  'Siti Aminah',
  'Rafly Eryan Azis',
  'Rafi Daniswara',
  "Muhammad Syafi'ul Umam"
];

/* --- ANIMATION CONFIGS --- */
export const appleEase = [0.22, 1, 0.36, 1] as any;

export const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const modalVariants = {
  initial: { opacity: 0, scale: 0.96, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 12 }
};

export const modalTransition = {
  duration: 0.35,
  ease: appleEase
};

export const btnScaleDown = {
  whileTap: { scale: 0.96 },
  transition: { duration: 0.12, ease: "easeOut" as any }
};

/* --- HELPERS --- */

export const getStatusStyles = (status: PublicationItem['status']) => {
  switch (status) {
    case 'Lengkap':
      return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30';
    case 'Sedang Berjalan':
      return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
    default:
      return 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-neutral-400 border-slate-100 dark:border-white/10';
  }
};

export const formatISBN = (val: string) => {
  const digits = val.replace(/\D/g, '').substring(0, 13);
  let formatted = '';
  if (digits.length > 0) formatted += digits.substring(0, 3);
  if (digits.length > 3) formatted += '-' + digits.substring(3, 6);
  if (digits.length > 6) formatted += '-' + digits.substring(6, 8);
  if (digits.length > 8) formatted += '-' + digits.substring(8, 12);
  if (digits.length > 12) formatted += '-' + digits.substring(12, 13);
  return formatted;
};

export const generateFileName = (title: string, nidn: string, originalFile: File) => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}${mm}${dd}`;
  
  const cleanTitle = title.replace(/[/\\:*?"<>|]/g, '');
  const cleanNidn = nidn.replace(/-/g, '');
  const extension = originalFile.name.split('.').pop();
  const extDot = extension ? `.${extension}` : '.pdf';
  
  return `${cleanTitle}_${cleanNidn}_${dateStr}${extDot}`;
};

interface ActionButtonProps {
  icon: React.ReactNode;
  tooltip?: string;
  variant?: 'primary' | 'ghost' | 'danger';
  onClick?: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ icon, tooltip, variant = 'primary', onClick }) => {
  const baseStyles = "w-10 h-10 md:w-9 md:h-9 flex items-center justify-center rounded-xl transition-all active:scale-90 group/btn relative";
  const variantStyles = {
    primary: "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-neutral-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 border border-slate-200 dark:border-white/10 shadow-sm",
    ghost: "text-slate-400 dark:text-neutral-600 hover:text-primary-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5",
    danger: "text-slate-400 dark:text-neutral-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
  };
  return (
    <button type="button" className={`${baseStyles} ${variantStyles[variant]}`} onClick={onClick}>
      {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-[18px] h-[18px]' })}
      {tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-bold rounded-lg opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-all duration-300 whitespace-nowrap z-[100] shadow-xl border border-white/10 hidden md:block">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-slate-900 dark:border-t-white"></div>
        </div>
      )}
    </button>
  );
};
