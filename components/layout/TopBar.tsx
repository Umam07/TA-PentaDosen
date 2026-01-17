import React from 'react';
import { Menu as HamburgerMenu } from 'lucide-react';
import { Notification } from './Notification';
import { ProfileMenu } from './ProfileMenu';
import { ThemeToggle } from './ThemeToggle';

interface TopBarProps {
  onMobileMenuOpen: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
  onNotificationEventClick?: (date: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  onMobileMenuOpen, 
  onLogout, 
  onOpenProfile,
  onNotificationEventClick 
}) => {
  return (
    <header className="h-16 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 px-4 md:px-8 flex items-center justify-between z-[40]">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMobileMenuOpen} 
          className="p-2 md:hidden text-slate-500 dark:text-neutral-400"
          aria-label="Open mobile menu"
        >
          <HamburgerMenu className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-6">
        <Notification onEventClick={onNotificationEventClick} />
        <ThemeToggle />
        <ProfileMenu onLogout={onLogout} onViewProfile={onOpenProfile} />
      </div>
    </header>
  );
};