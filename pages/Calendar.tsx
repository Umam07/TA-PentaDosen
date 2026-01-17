import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  X, 
  ChevronDown,
  Calendar as CalendarIcon,
  AlertTriangle,
  LayoutGrid,
  Columns
} from 'lucide-react';
import { useEvents, CalendarEvent } from '../context/EventContext';
import { useLayout } from '../components/layout/AppLayout';

/* --- ANIMATION CONFIGS --- */
const appleEase = [0.22, 1, 0.36, 1] as any;

const modalVariants = {
  initial: { opacity: 0, scale: 0.96, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 12 }
};

const modalTransition = {
  duration: 0.35,
  ease: appleEase
};

const btnScaleDown = {
  whileTap: { scale: 0.96 },
  transition: { duration: 0.12, ease: "easeOut" as any }
};

const CATEGORY_DETAILS = {
  'Research': { label: 'Penelitian', color: '#036aac' },
  'Publication': { label: 'Publikasi', color: '#6a9256' },
  'HKI': { label: 'HKI (Hak Kekayaan Intelektual)', color: '#e09a67' },
  'Other': { label: 'Lainnya', color: '#8773ae' },
};

const CategoryDropdown: React.FC<{
  value: keyof typeof CATEGORY_DETAILS | '';
  onChange: (val: keyof typeof CATEGORY_DETAILS) => void;
}> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="text-[10px] font-black uppercase text-slate-400 dark:text-neutral-500 tracking-widest ml-1 mb-2 block">Kategori</label>
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full h-[52px] md:h-[46px] flex items-center justify-between px-5 bg-slate-50 dark:bg-neutral-800/50 border border-slate-200 dark:border-white/10 focus:border-primary-600/30 rounded-xl transition-all outline-none"
      >
        <div className="flex items-center gap-3">
          {value ? (
            <>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_DETAILS[value].color }}></div>
              <span className="text-[14px] font-semibold text-slate-700 dark:text-neutral-200">{CATEGORY_DETAILS[value].label}</span>
            </>
          ) : (
            <span className="text-[14px] font-medium text-slate-400">Pilih Kategori...</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            // Menggunakan bottom-full agar dropdown terbuka ke atas dan tidak menutupi tombol simpan
            className="absolute z-[110] bottom-full left-0 right-0 mb-2 bg-white dark:bg-neutral-900 border border-slate-100 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden"
          >
            {(Object.entries(CATEGORY_DETAILS) as [keyof typeof CATEGORY_DETAILS, typeof CATEGORY_DETAILS['Research']][]).map(([key, details]) => (
              <button 
                key={key} 
                type="button" 
                onClick={() => { onChange(key); setIsOpen(false); }} 
                className="w-full flex items-center gap-3 px-5 py-4 md:py-3.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left"
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: details.color }}></div>
                <span className={`text-[14px] font-medium ${value === key ? 'text-primary-600 font-bold' : 'text-slate-600 dark:text-neutral-400'}`}>
                  {details.label}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Calendar: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent, focusDate, setFocusDate } = useEvents();
  const { setGlobalBlur, showToast } = useLayout();
  
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [eventForm, setEventForm] = useState<Omit<CalendarEvent, 'id'>>({
    title: '', description: '', startDate: '', endDate: '', category: '' as any
  });

  useEffect(() => {
    if (focusDate) {
      setCurrentCalendarDate(focusDate);
      setFocusDate(null);
    }
  }, [focusDate, setFocusDate]);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const getWeekDays = (baseDate: Date) => {
    const d = new Date(baseDate);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(d.setDate(diff));
    return Array.from({ length: 7 }).map((_, i) => {
      const dayDate = new Date(start);
      dayDate.setDate(start.getDate() + i);
      return dayDate;
    });
  };

  const handlePrev = () => {
    if (viewMode === 'month') setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1));
    else { const d = new Date(currentCalendarDate); d.setDate(d.getDate() - 7); setCurrentCalendarDate(d); }
  };

  const handleNext = () => {
    if (viewMode === 'month') setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1));
    else { const d = new Date(currentCalendarDate); d.setDate(d.getDate() + 7); setCurrentCalendarDate(d); }
  };

  const handleToday = () => setCurrentCalendarDate(new Date());

  const openAddEvent = () => {
    setIsEditing(false);
    setSelectedEvent(null);
    const todayJakarta = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' });
    // Dikosongkan agar user mengisi sendiri
    setEventForm({ 
      title: '', 
      description: '', 
      startDate: todayJakarta, 
      endDate: '', 
      category: '' as any 
    });
    setIsEventModalOpen(true);
    setGlobalBlur(true);
  };

  const openEventDetails = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEditing(false);
    setIsEventModalOpen(true);
    setGlobalBlur(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.category) {
      showToast('Harap pilih kategori acara.', 'info');
      return;
    }
    if (isEditing && selectedEvent) { 
      updateEvent(selectedEvent.id, eventForm); 
      showToast('Acara diperbarui.', 'info'); 
    } else { 
      addEvent(eventForm); 
      showToast('Acara dibuat.', 'success'); 
    }
    setIsEventModalOpen(false);
    setGlobalBlur(false);
  };

  const confirmDelete = () => {
    if (selectedEvent) { 
      deleteEvent(selectedEvent.id); 
      showToast('Acara dihapus.', 'delete'); 
      setIsDeleteConfirmOpen(false); 
      setIsEventModalOpen(false); 
      setGlobalBlur(false); 
    }
  };

  const startEditEvent = () => {
    if (selectedEvent) { 
      setEventForm({ 
        title: selectedEvent.title, 
        description: selectedEvent.description, 
        startDate: selectedEvent.startDate, 
        endDate: selectedEvent.endDate || '', 
        category: selectedEvent.category 
      }); 
      setIsEditing(true); 
    }
  };

  const isDateInEventRange = (date: Date, event: CalendarEvent) => {
    const d = new Date(date).setHours(0,0,0,0);
    const s = new Date(event.startDate).setHours(0,0,0,0);
    const e = new Date(event.endDate || event.startDate).setHours(0,0,0,0);
    return d >= s && d <= e;
  };

  const renderHeaderTitle = () => {
    if (viewMode === 'month') return currentCalendarDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    const weekDays = getWeekDays(currentCalendarDate);
    return `${weekDays[0].toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })} – ${weekDays[6].toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-1.5 px-4 md:px-0">
        <h1 className="text-[20px] md:text-[24px] font-bold text-slate-900 dark:text-white tracking-tight">Kalender Akademik</h1>
        <p className="text-[13px] md:text-[14px] text-slate-400 dark:text-neutral-500 font-medium tracking-tight">Kelola dan pantau kegiatan akademik Anda di satu tempat terintegrasi.</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 px-4 md:px-0">
        <motion.button 
          {...btnScaleDown}
          onClick={openAddEvent} 
          className="h-[48px] px-8 bg-primary-600 text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Tambah Acara
        </motion.button>
        
        <div className="flex items-center gap-3">
          <div className="inline-flex p-1 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 h-[48px] w-full md:w-auto">
            <button 
              onClick={() => setViewMode('month')} 
              className={`flex-1 md:flex-none px-5 rounded-lg text-[12px] font-bold transition-all flex items-center justify-center gap-2 ${viewMode === 'month' ? 'bg-white dark:bg-white/10 text-primary-600 dark:text-white shadow-sm' : 'text-slate-500'}`}
            >
              <LayoutGrid className="w-4 h-4" /> Bulan
            </button>
            <button 
              onClick={() => setViewMode('week')} 
              className={`flex-1 md:flex-none px-5 rounded-lg text-[12px] font-bold transition-all flex items-center justify-center gap-2 ${viewMode === 'week' ? 'bg-white dark:bg-white/10 text-primary-600 dark:text-white shadow-sm' : 'text-slate-500'}`}
            >
              <Columns className="w-4 h-4" /> Minggu
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-[#0D0D0D] border md:rounded-[2.5rem] shadow-sm flex flex-col overflow-hidden mx-4 md:mx-0">
        <div className="px-5 md:px-10 py-5 md:py-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/[0.01]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center justify-between md:justify-start gap-4 w-full md:w-auto">
              <h3 className="text-[15px] md:text-[20px] font-bold text-slate-900 dark:text-white tabular-nums truncate">{renderHeaderTitle()}</h3>
              <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl shadow-inner">
                <button onClick={handlePrev} className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-slate-600 dark:text-neutral-400 active:scale-90 transition-all"><ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                <button onClick={handleToday} className="px-3 md:px-4 py-1 text-[9px] md:text-[10px] font-black text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-all uppercase tracking-widest md:tracking-[0.2em]">Hari Ini</button>
                <button onClick={handleNext} className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-slate-600 dark:text-neutral-400 active:scale-90 transition-all"><ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-6">
              {(Object.entries(CATEGORY_DETAILS) as [keyof typeof CATEGORY_DETAILS, any][]).map(([cat, details]) => (
                <div key={cat} className="flex items-center gap-2">
                  <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" style={{ backgroundColor: details.color }}></div>
                  <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">{details.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="w-full">
            {viewMode === 'month' ? (
              <div className="grid grid-cols-7 border-t border-l border-slate-100 dark:border-white/5 rounded-t-2xl overflow-hidden">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                  <div key={day} className="p-2 md:p-4 border-r border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] text-[9px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">{day}</div>
                ))}
                {Array.from({ length: 42 }).map((_, i) => {
                  const dayNumber = i - startDayOfMonth(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth()) + 1;
                  const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth());
                  const displayDate = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), dayNumber);
                  const dayEvents = events.filter(ev => isDateInEventRange(displayDate, ev));
                  const isToday = displayDate.toDateString() === new Date().toDateString();
                  const visibleEvents = dayEvents.slice(0, 2);
                  const remainingCount = dayEvents.length - 2;

                  return (
                    <div key={i} className={`min-h-[80px] md:min-h-[120px] p-1 md:p-2 border-r border-b border-slate-100 dark:border-white/5 relative transition-colors ${isCurrentMonth ? 'bg-white dark:bg-transparent' : 'bg-slate-50/30 dark:bg-white/[0.01]'}`}>
                      <div className={`text-[10px] md:text-[12px] font-bold mb-1 md:mb-2 w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full transition-all ${isToday ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400'}`}>{isCurrentMonth ? dayNumber : ''}</div>
                      <div className="space-y-0.5 md:space-y-1">
                        {visibleEvents.map(ev => (<button key={ev.id} onClick={() => openEventDetails(ev)} className="w-full p-1 text-left rounded md:rounded-lg text-white text-[8px] md:text-[10px] font-bold truncate transition-all hover:brightness-110 active:scale-95" style={{ backgroundColor: CATEGORY_DETAILS[ev.category].color }}>{ev.title}</button>))}
                        {remainingCount > 0 && (<div className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">+{remainingCount}</div>)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-7 border-t border-l border-slate-100 dark:border-white/5 rounded-t-2xl overflow-hidden">
                {getWeekDays(currentCalendarDate).map((date, i) => {
                  const dayEvents = events.filter(ev => isDateInEventRange(date, ev));
                  const isToday = date.toDateString() === new Date().toDateString();
                  return (
                    <div key={i} className={`min-h-[300px] md:min-h-[500px] border-r border-b border-slate-100 dark:border-white/5 flex flex-col ${isToday ? 'bg-primary-500/[0.02]' : 'bg-white dark:bg-transparent'}`}>
                      <div className="p-2 md:p-4 border-b border-slate-50 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.01] flex flex-col items-center gap-1 md:gap-2 text-center">
                        <span className="text-[8px] md:text-[11px] font-black uppercase tracking-widest text-slate-400">{date.toLocaleDateString('id-ID', { weekday: 'short' })}</span>
                        <div className={`text-[12px] md:text-[14px] font-bold w-7 h-7 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-all ${isToday ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-600 dark:text-neutral-400'}`}>{date.getDate()}</div>
                      </div>
                      <div className="p-1 md:p-2 space-y-1 md:space-y-2 flex-1">
                        {dayEvents.map(ev => (<button key={ev.id} onClick={() => openEventDetails(ev)} className="w-full p-2 md:p-3 text-left rounded-lg md:rounded-xl text-white text-[8px] md:text-[11px] font-bold shadow-sm md:shadow-md leading-tight" style={{ backgroundColor: CATEGORY_DETAILS[ev.category].color }}>{ev.title}</button>))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL UTAMA */}
      <AnimatePresence>
        {isEventModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-end md:items-center justify-center p-0 md:p-4 pointer-events-none">
            <div className="absolute inset-0 pointer-events-auto" onClick={() => { setIsEventModalOpen(false); setGlobalBlur(false); }} />
            <motion.div 
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={modalTransition}
              className="relative bg-white dark:bg-[#0A0A0A] w-full max-w-lg h-[95vh] md:h-auto md:rounded-[2.5rem] rounded-t-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-white/5 flex flex-col pointer-events-auto"
            >
              <div className="px-6 md:px-10 py-6 md:py-8 flex justify-between items-center border-b border-slate-50 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.01]">
                <h3 className="text-[17px] md:text-[20px] font-black text-slate-900 dark:text-white tracking-tight">{isEditing ? 'Ubah Acara' : (selectedEvent ? 'Detail Acara' : 'Tambah Acara Baru')}</h3>
                <button onClick={() => { setIsEventModalOpen(false); setGlobalBlur(false); }} className="p-2 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-400 hover:text-slate-900"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-10 custom-scrollbar">
                {!isEditing && selectedEvent ? (
                  <div className="space-y-6 md:space-y-8 py-6 md:py-8">
                    <div className="flex items-center gap-5"><div className="w-1.5 h-12 md:h-16 rounded-full" style={{ backgroundColor: CATEGORY_DETAILS[selectedEvent.category].color }}></div><div className="space-y-1"><span className="px-2 py-0.5 rounded text-[8px] md:text-[9px] font-black uppercase text-white" style={{ backgroundColor: CATEGORY_DETAILS[selectedEvent.category].color }}>{CATEGORY_DETAILS[selectedEvent.category].label}</span><h4 className="text-[18px] md:text-[22px] font-black text-slate-900 dark:text-white tracking-tight leading-snug">{selectedEvent.title}</h4></div></div>
                    <div className="bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 p-5 md:p-6 rounded-2xl space-y-5 md:space-y-6">
                      <div className="flex items-center gap-4"><div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center text-primary-600 shadow-sm shrink-0"><CalendarIcon className="w-4 h-4 md:w-5 md:h-5" /></div><div className="min-w-0"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Rentang Tanggal</p><span className="text-[13px] md:text-[14px] font-bold text-slate-700 dark:text-white">{new Date(selectedEvent.startDate).toLocaleDateString('id-ID', { dateStyle: 'long' })} – {new Date(selectedEvent.endDate || selectedEvent.startDate).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span></div></div>
                      {selectedEvent.description && (<div><p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Deskripsi</p><p className="text-[13px] md:text-[14px] text-slate-600 dark:text-neutral-400 leading-relaxed font-medium">{selectedEvent.description}</p></div>)}
                    </div>
                    <div className="flex gap-3 md:gap-4 pt-4">
                      <motion.button {...btnScaleDown} onClick={startEditEvent} className="flex-1 h-[52px] md:h-[56px] bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-[14px] md:text-[15px] shadow-xl">Ubah</motion.button>
                      <button onClick={() => setIsDeleteConfirmOpen(true)} className="flex-1 h-[52px] md:h-[56px] bg-red-50 dark:bg-red-500/10 text-red-500 font-bold rounded-2xl text-[14px] md:text-[15px] active:scale-[0.98]">Hapus</button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveEvent} className="space-y-5 md:space-y-6 py-6 md:py-8">
                    <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest ml-1">Judul Acara</label><input type="text" required value={eventForm.title} onChange={e => setEventForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Contoh: Rapat Koordinasi Penelitian" className="w-full h-[52px] px-5 bg-slate-50 dark:bg-neutral-800/50 border border-transparent focus:border-primary-600/30 rounded-2xl outline-none font-medium dark:text-white text-[14px]" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest ml-1">Deskripsi</label><textarea value={eventForm.description} onChange={e => setEventForm(prev => ({ ...prev, description: e.target.value }))} className="w-full p-5 bg-slate-50 dark:bg-neutral-800/50 border border-transparent focus:border-primary-600/30 rounded-2xl outline-none font-medium dark:text-white min-h-[100px] md:min-h-[120px] text-[14px]" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest ml-1">Mulai</label>
                        <input type="date" required value={eventForm.startDate} onChange={e => setEventForm(prev => ({ ...prev, startDate: e.target.value }))} className="w-full h-[52px] px-4 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl font-bold dark:text-white text-[13px]" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest ml-1">Selesai</label>
                        <input type="date" required value={eventForm.endDate} onChange={e => setEventForm(prev => ({ ...prev, endDate: e.target.value }))} className="w-full h-[52px] px-4 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl font-bold dark:text-white text-[13px]" />
                      </div>
                    </div>
                    {/* Komponen Dropdown */}
                    <CategoryDropdown value={eventForm.category} onChange={val => setEventForm(prev => ({ ...prev, category: val }))} />
                    
                    <div className="flex gap-3 md:gap-4 pt-6">
                      <button type="button" onClick={() => { setIsEventModalOpen(false); setGlobalBlur(false); }} className="flex-1 h-[52px] md:h-[56px] border border-slate-200 text-slate-500 font-bold rounded-2xl active:scale-[0.98] text-[14px]">Batal</button>
                      <motion.button {...btnScaleDown} type="submit" className="flex-[2] h-[52px] md:h-[56px] bg-primary-600 text-white font-black rounded-2xl shadow-xl shadow-primary-600/20 text-[14px]">Simpan Acara</motion.button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL KONFIRMASI HAPUS */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 dark:bg-black/70 backdrop-blur-xl"
              onClick={() => setIsDeleteConfirmOpen(false)}
            />
            
            <motion.div 
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={modalTransition}
              className="relative bg-white dark:bg-[#0D0D0D] w-full max-w-[360px] rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] p-8 md:p-10 text-center border border-slate-100 dark:border-white/10 overflow-hidden"
            >
              <div className="relative mx-auto w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-red-500/10 dark:bg-red-500/20 rounded-[2rem] rotate-6" />
                <div className="absolute inset-0 bg-red-500/10 dark:bg-red-500/20 rounded-[2rem] -rotate-3" />
                <div className="relative w-full h-full bg-red-50 dark:bg-red-500/10 rounded-[2rem] flex items-center justify-center border border-red-100/50 dark:border-red-500/20">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
              </div>

              <h3 className="text-[20px] md:text-[22px] font-black text-slate-900 dark:text-white mb-3 tracking-tight">Hapus Acara?</h3>
              <p className="text-slate-500 dark:text-neutral-400 text-[14px] md:text-[15px] mb-8 leading-relaxed px-2 font-medium">
                Tindakan ini tidak dapat dibatalkan. Acara <span className="text-slate-900 dark:text-white font-bold">"{selectedEvent?.title}"</span> akan dihapus permanen.
              </p>

              <div className="grid grid-cols-1 gap-3">
                <motion.button 
                  {...btnScaleDown} 
                  onClick={confirmDelete} 
                  className="w-full h-[58px] bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl shadow-lg shadow-red-500/25 transition-colors text-[15px]"
                >
                  Ya, Hapus Permanen
                </motion.button>
                <button 
                  onClick={() => setIsDeleteConfirmOpen(false)} 
                  className="w-full h-[58px] bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-400 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-[15px]"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};