import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';

interface ProfileMenuProps {
  onLogout: () => void;
  onViewProfile: () => void;
}

const USER_DATA = {
  name: 'Dr. Jane Doe, M.T.',
  role: 'Dosen',
  initials: 'JD'
};

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ onLogout, onViewProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setIsOpen(false);
    onViewProfile();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-3 p-1 group">
        <div className="text-right hidden sm:block">
          <p className="text-[13px] font-semibold text-slate-900 dark:text-white">{USER_DATA.name}</p>
          <p className="text-[11px] font-medium text-slate-400 dark:text-neutral-500">{USER_DATA.role}</p>
        </div>
        <div className="w-9 h-9 bg-slate-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center text-xs font-bold text-slate-600 dark:text-neutral-400 border border-slate-200 dark:border-white/10 transition-colors">
          {USER_DATA.initials}
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-slate-100 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          <div className="p-2 space-y-1">
            <button 
              onClick={handleProfileClick} 
              className="w-full flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-colors"
            >
              <User className="w-4 h-4" /> Lihat Profil
            </button>
            <div className="h-px bg-slate-100 dark:bg-white/5 mx-2"></div>
            <button 
              onClick={onLogout} 
              className="w-full flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" /> Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};