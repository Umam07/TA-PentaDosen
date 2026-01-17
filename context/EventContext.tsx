import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string; // ISO date string (YYYY-MM-DD)
  category: 'Research' | 'Publication' | 'HKI' | 'Other';
}

interface EventContextType {
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  notifications: CalendarEvent[];
  unreadCount: number;
  readNotifications: string[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  focusDate: Date | null;
  setFocusDate: (date: Date | null) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const STORAGE_KEY = 'pentadosen_global_events_v3';
const NOTIF_READ_KEY = 'pentadosen_read_notifications_v3';

const INITIAL_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Proposal Hibah Internal', description: 'Batas akhir pengumpulan proposal penelitian internal YARSI semester ganjil.', startDate: '2025-10-25', endDate: '2025-10-30', category: 'Research' },
  { id: '2', title: 'Submit Jurnal Q1', description: 'Target pengiriman manuskrip ke jurnal internasional bereputasi.', startDate: '2025-10-18', endDate: '2025-10-20', category: 'Publication' },
];

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : INITIAL_EVENTS;
  });

  const [readNotifications, setReadNotifications] = useState<string[]>(() => {
    const stored = localStorage.getItem(NOTIF_READ_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [focusDate, setFocusDate] = useState<Date | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(NOTIF_READ_KEY, JSON.stringify(readNotifications));
  }, [readNotifications]);

  // Normalize date to midnight based on the specific timezone requirement
  const getTodayTime = () => {
    const now = new Date();
    const jakartaTodayStr = now.toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' });
    return new Date(jakartaTodayStr).getTime();
  };

  const notifications = useMemo(() => {
    const today = getTodayTime();
    const sevenDaysLater = today + (7 * 24 * 60 * 60 * 1000);

    return events
      .filter(ev => {
        const start = new Date(ev.startDate).getTime();
        const end = new Date(ev.endDate || ev.startDate).getTime();
        
        // Ongoing: Started on or before today, ends on or after today
        const isOngoing = start <= today && end >= today;
        // Upcoming: Starts after today and within next 7 days
        const isUpcomingSoon = start > today && start <= sevenDaysLater;
        
        return isOngoing || isUpcomingSoon;
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [events]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !readNotifications.includes(n.id)).length;
  }, [notifications, readNotifications]);

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent = { ...event, id: Math.random().toString(36).substring(7) };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, updatedFields: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(ev => (ev.id === id ? { ...ev, ...updatedFields } : ev)));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(ev => ev.id !== id));
  };

  const markAsRead = (id: string) => {
    if (!readNotifications.includes(id)) {
      setReadNotifications(prev => [...prev, id]);
    }
  };

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadNotifications(Array.from(new Set([...readNotifications, ...allIds])));
  };

  return (
    <EventContext.Provider value={{
      events, addEvent, updateEvent, deleteEvent,
      notifications, unreadCount, readNotifications, markAsRead, markAllAsRead,
      focusDate, setFocusDate
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error('useEvents must be used within an EventProvider');
  return context;
};
