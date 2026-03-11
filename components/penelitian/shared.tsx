import React from 'react';
import { motion } from 'framer-motion';

export interface ResearchItem {
  id: string;
  title: string;
  leadResearcher: string;
  members: string[];
  scheme: 'Hibah Internal' | 'Hibah External' | 'Mandiri';
  amount: string;
  year: string;
  progressReport?: string; 
  progressFile?: File; 
  finalReport?: string;    
  finalFile?: File;    
  proposedAmount?: string; 
  sourceOfFunds?: string;  
  status?: string;
  proposalFileName?: string;
  proposalFile?: File; 
}

export const getStatusStyles = (status?: string) => {
  switch (status) {
    case 'Proposal':
      return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30';
    case 'Sedang Berjalan':
      return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
    case 'Lengkap':
      return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30';
    case 'Ditolak':
      return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30';
    default:
      return 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-neutral-400 border-slate-100 dark:border-white/10';
  }
};

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

export const generateResearchFileName = (title: string, nidn: string, file: File, type: 'proposal' | 'progress' | 'final'): string => {
  const cleanTitle = title.replace(/[\/\\:*?"<>|]/g, '').trim();
  const cleanNidn = nidn.replace(/-/g, '');
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const extension = file.name.split('.').pop() || 'pdf';
  
  if (type === 'progress') {
    return `${cleanTitle}_Progress_${cleanNidn}_${date}.${extension}`;
  } else if (type === 'final') {
    return `${cleanTitle}_Final_${cleanNidn}_${date}.${extension}`;
  }
  return `${cleanTitle}_${cleanNidn}_${date}.${extension}`;
};

const appleEase = [0.22, 1, 0.36, 1] as any;

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
    <motion.button type="button" {...btnScaleDown} className={`${baseStyles} ${variantStyles[variant]}`} onClick={onClick}>
      {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-[18px] h-[18px]' })}
      {tooltip && (<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-bold rounded-lg opacity-0 pointer-events-none group-hover/btn:opacity-100 transition-all duration-300 whitespace-nowrap z-[100] shadow-xl border border-white/10 hidden md:block">{tooltip}<div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-slate-900 dark:border-t-white"></div></div>)}
    </motion.button>
  );
};
