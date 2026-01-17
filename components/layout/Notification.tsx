import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Calendar as CalendarIcon, Clock, X } from 'lucide-react';
import { useEvents } from '../../context/EventContext';

const CATEGORY_COLORS = {
  'Research': '#036aac',
  'Publication': '#6a9256',
  'HKI': '#e09a67',
  'Other': '#8773ae',
};

interface NotificationProps {
  onEventClick?: (date: string) => void;
}

export const Notification: React.FC<NotificationProps> = ({ onEventClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, readNotifications, markAsRead, markAllAsRead } = useEvents();
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

  const handleNotificationClick = (notif: any) => {
    markAsRead(notif.id);
    setIsOpen(false);
    if (onEventClick) {
      onEventClick(notif.startDate);
    }
  };

  const getEventStatus = (start: string, end: string) => {
    const now = new Date();
    // Get current date in Jakarta YYYY-MM-DD format for direct string comparison
    const today = now.toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' });
    const endDate = end || start;

    if (today >= start && today <= endDate) return { label: 'Sedang Berlangsung', color: 'text-primary-600 dark:text-primary-400' };
    if (today < start) return { label: 'Belum Dimulai', color: 'text-amber-500 dark:text-amber-400' };
    return { label: 'Selesai', color: 'text-slate-400 dark:text-neutral-600' };
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-xl transition-all relative group ${isOpen ? 'bg-primary-50 dark:bg-white/10 text-primary-600 dark:text-white' : 'text-slate-400 hover:text-primary-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'}`}
      >
        <Bell className={`w-5 h-5 transition-transform group-hover:rotate-12 ${unreadCount > 0 && !isOpen ? 'animate-bounce' : ''}`} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 border-2 border-white dark:border-black rounded-full text-[9px] font-black text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-x-4 top-20 sm:absolute sm:inset-auto sm:right-0 sm:mt-3 sm:w-[380px] bg-white dark:bg-neutral-900 border border-slate-100 dark:border-white/10 rounded-[1.5rem] shadow-2xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
            <h4 className="text-[13px] sm:text-[14px] font-bold text-slate-900 dark:text-white">Acara Mendatang</h4>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-[10px] sm:text-[11px] font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="w-3 h-3" /> <span className="hidden xs:inline">Tandai semua dibaca</span>
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="sm:hidden p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="max-h-[60vh] sm:max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              <div className="divide-y divide-slate-50 dark:divide-white/5">
                {notifications.map((notif) => {
                  const isUnread = !readNotifications.includes(notif.id);
                  const status = getEventStatus(notif.startDate, notif.endDate);
                  
                  return (
                    <button
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`w-full text-left py-3.5 px-4 sm:p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex flex-col sm:flex-row gap-3 sm:gap-4 items-start relative group ${isUnread ? 'bg-primary-500/[0.02]' : ''}`}
                    >
                      {isUnread && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 sm:w-0.5 bg-primary-600"></div>
                      )}
                      
                      {/* Mobile header with icon and category */}
                      <div className="flex items-center justify-between w-full sm:w-auto">
                        <div 
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                          style={{ backgroundColor: (CATEGORY_COLORS as any)[notif.category] + '15' }}
                        >
                          <CalendarIcon className="w-[18px] h-[18px] sm:w-5 sm:h-5" style={{ color: (CATEGORY_COLORS as any)[notif.category] }} />
                        </div>
                        <span className="sm:hidden text-[8px] font-black text-white px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0" style={{ backgroundColor: (CATEGORY_COLORS as any)[notif.category] }}>
                          {notif.category}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex justify-between items-start gap-2">
                          <p className={`text-[13px] sm:text-[13px] font-bold leading-tight ${isUnread ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-neutral-400'} sm:truncate sm:max-w-[180px]`}>
                            {notif.title}
                          </p>
                          <span className="hidden sm:inline-block text-[10px] font-black text-white px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0" style={{ backgroundColor: (CATEGORY_COLORS as any)[notif.category] }}>
                            {notif.category}
                          </span>
                        </div>
                        
                        {/* Status for Mobile & Desktop */}
                        <div className="mt-1.5 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                          <p className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider ${status.color}`}>
                            {status.label}
                          </p>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-300 dark:bg-neutral-700"></span>
                            <div className="flex items-center gap-1 text-[11px] sm:text-[11px] font-semibold text-slate-400 dark:text-neutral-500">
                              <Clock className="w-3 h-3 sm:w-3 sm:h-3" />
                              {new Date(notif.startDate).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-10 sm:p-12 text-center flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-slate-300 dark:text-neutral-700" />
                </div>
                <p className="text-[13px] sm:text-[14px] font-bold text-slate-400 dark:text-neutral-600">Tidak ada acara mendatang</p>
                <p className="text-[11px] sm:text-[12px] text-slate-400 dark:text-neutral-700 mt-1">Periksa kembali nanti untuk pembaruan baru.</p>
              </div>
            )}
          </div>
          {notifications.length > 0 && (
            <div className="p-3 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5 text-center">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest">
                Periksa Kalender untuk detailnya
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};