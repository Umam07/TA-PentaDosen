import React, { useState, createContext, useContext, useEffect, useCallback } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { ProfileModal } from './ProfileModal';
import { useEvents } from '../../context/EventContext';
import { Toast, ToastType } from './Toast';

interface LayoutContextType {
  setGlobalBlur: (active: boolean) => void;
  showToast: (message: string, type: ToastType) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error('useLayout must be used within a LayoutProvider');
  return context;
};

interface AppLayoutProps {
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ onLogout, activeTab, setActiveTab, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGlobalBlurActive, setIsGlobalBlurActive] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean } | null>(null);
  const { setFocusDate } = useEvents();

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type, isVisible: true });
    setTimeout(() => {
      setToast(prev => prev ? { ...prev, isVisible: false } : null);
    }, 3000);
  }, []);

  const closeToast = useCallback(() => {
    setToast(prev => prev ? { ...prev, isVisible: false } : null);
  }, []);

  useEffect(() => {
    if (isGlobalBlurActive || isProfileModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isGlobalBlurActive, isProfileModalOpen]);

  const handleNotificationEventClick = (dateStr: string) => {
    setFocusDate(new Date(dateStr));
    setActiveTab('Kalender');
  };

  return (
    <LayoutContext.Provider value={{ 
      setGlobalBlur: setIsGlobalBlurActive,
      showToast: showToast
    }}>
      <div className="min-h-screen bg-[#FBFBFD] dark:bg-black flex font-sans transition-colors duration-500 relative">
        
        <Toast 
          isVisible={!!toast?.isVisible}
          message={toast?.message || ''}
          type={toast?.type || 'success'}
          onClose={closeToast}
        />

        {/* Global Backdrop - Z-INDEX 140 */}
        {isGlobalBlurActive && (
          <div 
            className="fixed inset-0 z-[140] bg-black/30 dark:bg-black/60 backdrop-blur-md animate-in fade-in duration-500 pointer-events-auto"
            aria-hidden="true"
          />
        )}

        <Sidebar 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          <TopBar 
            onMobileMenuOpen={() => setIsMobileSidebarOpen(true)}
            onLogout={onLogout}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onNotificationEventClick={handleNotificationEventClick}
          />

          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            <div className="w-full max-w-[1920px] mx-auto p-4 md:p-10 pt-6 md:pt-10">
              {children}
            </div>
          </div>
        </main>

        <ProfileModal 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)} 
        />
      </div>
    </LayoutContext.Provider>
  );
};