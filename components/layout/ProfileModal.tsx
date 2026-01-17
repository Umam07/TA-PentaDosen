import React, { useEffect } from 'react';
import { X, Info, Mail, Building2, GraduationCap, Phone, User as UserIcon } from 'lucide-react';

interface UserData {
  name: string;
  role: string;
  email: string;
  faculty: string;
  major: string;
  phone: string;
  initials: string;
}

const USER_DATA: UserData = {
  name: 'Dr. Jane Doe, M.T.',
  role: 'Dosen Tetap',
  email: 'jane.doe@fti.yarsi.ac.id',
  faculty: 'Fakultas Teknologi Informasi',
  major: 'Teknik Informatika',
  phone: '+62 812 3456 7890',
  initials: 'JD'
};

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  // Disable background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>
      
      {/* Modal Container */}
      <div className="relative bg-white dark:bg-[#0A0A0A] w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500 border border-slate-100 dark:border-white/5 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 sm:px-10 sm:py-6 flex justify-between items-center border-b border-slate-50 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.01]">
          <h5 className="text-[16px] sm:text-[18px] font-bold text-slate-900 dark:text-white tracking-tight">
            Informasi Profil
          </h5>
          <button 
            onClick={onClose} 
            className="p-2 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-90"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:px-10 sm:py-8 custom-scrollbar">
          <div className="space-y-8">
            {/* Profile Avatar & Primary Info */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-primary-600 rounded-[2rem] flex items-center justify-center text-2xl sm:text-3xl font-black text-white shadow-xl shadow-primary-500/20 mb-5">
                {USER_DATA.initials}
              </div>
              <div className="min-w-0">
                <h3 className="text-[20px] sm:text-[22px] font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                  {USER_DATA.name}
                </h3>
                <div className="inline-block px-4 py-1.5 bg-primary-50 dark:bg-primary-900/20 rounded-xl mt-3">
                  <p className="text-[11px] sm:text-[12px] text-primary-600 dark:text-primary-400 font-bold uppercase tracking-widest">
                    {USER_DATA.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div className="flex items-start gap-4 p-4 bg-slate-50/50 dark:bg-white/[0.02] rounded-2xl border border-slate-100 dark:border-white/5">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/5 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest mb-1">
                    Nama Lengkap
                  </p>
                  <p className="text-[14px] font-bold text-slate-800 dark:text-neutral-200 leading-tight">
                    {USER_DATA.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50/50 dark:bg-white/[0.02] rounded-2xl border border-slate-100 dark:border-white/5">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/5 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest mb-1">
                    Alamat Email
                  </p>
                  <p className="text-[14px] font-bold text-slate-800 dark:text-neutral-200 break-all leading-tight">
                    {USER_DATA.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50/50 dark:bg-white/[0.02] rounded-2xl border border-slate-100 dark:border-white/5">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/5 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest mb-1">
                    Fakultas
                  </p>
                  <p className="text-[14px] font-bold text-slate-800 dark:text-neutral-200 leading-tight">
                    {USER_DATA.faculty}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50/50 dark:bg-white/[0.02] rounded-2xl border border-slate-100 dark:border-white/5">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/5 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest mb-1">
                    Nomor Telepon
                  </p>
                  <p className="text-[14px] font-bold text-slate-800 dark:text-neutral-200 tabular-nums leading-tight">
                    {USER_DATA.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Note Section */}
            <div className="flex items-start gap-3 p-4 bg-primary-500/[0.04] rounded-2xl border border-primary-500/10">
              <Info className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
              <p className="text-[11px] sm:text-[12px] font-semibold text-primary-800/80 dark:text-primary-400/80 leading-relaxed">
                Data profil dikelola melalui sistem LDAP. Hubungi Biro Kepegawaian atau unit IT untuk pembaruan.
              </p>
            </div>
            
            {/* Footer Action */}
            <div className="pt-2">
              <button 
                onClick={onClose} 
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-black font-black rounded-2xl text-[14px] sm:text-[15px] active:scale-[0.98] transition-all shadow-xl shadow-slate-200 dark:shadow-none hover:opacity-90"
              >
                Tutup Profil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};