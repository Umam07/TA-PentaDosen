import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  PanelLeftClose, 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  FlaskConical, 
  BookMarked, 
  Lightbulb 
} from 'lucide-react';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  activeTab,
  setActiveTab,
}) => {
  const sidebarItems = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
    { name: 'Kalender', icon: <CalendarIcon className="w-[18px] h-[18px]" /> },
    { name: 'Penelitian', icon: <FlaskConical className="w-[18px] h-[18px]" /> },
    { name: 'Publikasi', icon: <BookMarked className="w-[18px] h-[18px]" /> },
    { name: 'HKI', icon: <Lightbulb className="w-[18px] h-[18px]" /> },
  ];

  const springConfig = {
    type: "spring" as const,
    stiffness: 150,
    damping: 24,
    mass: 1.2
  };

  const mobileSpringConfig = {
    type: "spring" as const,
    stiffness: 140,
    damping: 23,
    mass: 1.1
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => {
    const isExpanded = isSidebarOpen || isMobile;

    return (
      <>
        {/* Sidebar Header */}
        <div className={`flex items-center pt-6 pb-4 ${
          isExpanded ? 'px-7 justify-between' : 'px-0 justify-center'
        }`}>
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={springConfig}
                className="flex items-center overflow-hidden mr-2"
              >
                <span className="font-bold text-[19px] lg:text-[21px] tracking-tighter text-slate-900 dark:text-white truncate whitespace-nowrap">
                  PentaDosen<span className="text-primary-600">.</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button 
            onClick={() => isMobileSidebarOpen ? setIsMobileSidebarOpen(false) : setIsSidebarOpen(!isSidebarOpen)}
            className={`w-10 h-10 flex items-center justify-center text-slate-500 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-white bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 group/toggle shrink-0`}
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isMobile ? (
              <X className="w-5 h-5" />
            ) : (
              <motion.div 
                animate={{ rotate: isSidebarOpen ? 0 : 180 }}
                transition={springConfig}
              >
                <PanelLeftClose className="w-[18px] h-[18px] hidden md:block" />
              </motion.div>
            )}
            
            {!isExpanded && !isMobile && (
              <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-black text-[11px] font-bold rounded-lg opacity-0 pointer-events-none group-hover/toggle:opacity-100 group-hover/toggle:translate-x-1 transition-all duration-300 z-[100] whitespace-nowrap shadow-xl">
                {isSidebarOpen ? 'Sembunyikan' : 'Tampilkan'}
              </div>
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className={`flex-1 mt-8 space-y-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-300 ${
          isExpanded ? 'px-4' : 'px-2.5'
        }`}>
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={springConfig}
                className="mb-4 px-4 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-neutral-600 whitespace-nowrap overflow-hidden"
              >
                Platform Utama
              </motion.div>
            )}
          </AnimatePresence>
          
          {sidebarItems.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  if(isMobileSidebarOpen) setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                  isExpanded ? 'px-4 py-3 gap-3.5' : 'py-3.5 justify-center px-0'
                } ${
                  isActive 
                    ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-[0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-none border border-slate-200/60 dark:border-white/5' 
                    : 'text-slate-500 dark:text-neutral-400 hover:bg-white/60 dark:hover:bg-white/[0.03] hover:text-slate-900 dark:hover:text-white border border-transparent'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && isExpanded && (
                  <motion.div 
                    layoutId="activeBar"
                    className="absolute left-0 w-1 h-5 bg-primary-600 rounded-r-full"
                    transition={springConfig}
                  />
                )}
                
                <span className={`shrink-0 transition-transform duration-300 ${
                  isActive ? 'text-primary-600 dark:text-primary-400 scale-110' : 'group-hover:scale-110'
                }`}>
                  {item.icon}
                </span>
                
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={springConfig}
                      className="flex-1 flex items-center overflow-hidden"
                    >
                      <span className={`text-[14px] tracking-tight truncate whitespace-nowrap transition-all duration-300 ${
                        isActive ? 'font-bold' : 'font-semibold opacity-75 group-hover:opacity-100'
                      }`}>
                        {item.name}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {!isExpanded && !isMobile && (
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-black text-[11px] font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 z-[100] whitespace-nowrap shadow-xl">
                    {item.name}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Section */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={springConfig}
              className="mt-auto overflow-hidden"
            >
              <div className="px-7 py-8 border-t border-slate-200/40 dark:border-white/5">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 shadow-sm transition-transform duration-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/80 dark:bg-green-500 animate-pulse shrink-0"></div>
                  <p className="text-[10px] font-black tracking-tight whitespace-nowrap text-slate-500 dark:text-neutral-400">
                    v2.1 <span className="mx-0.5 opacity-30">•</span> Stable
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            {/* Mobile Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            
            {/* Mobile Sidebar */}
            <motion.aside 
              initial={{ x: "-100%", opacity: 0.5 }}
              animate={{ x: "0%", opacity: 1 }}
              exit={{ x: "-100%", opacity: 0.5 }}
              transition={mobileSpringConfig}
              className="fixed inset-y-0 left-0 z-[110] w-full max-w-[280px] bg-[#F9F9FB] dark:bg-[#0E0E0E] border-r border-slate-200/60 dark:border-white/5 flex flex-col md:hidden overflow-x-hidden"
            >
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar with Framer Motion Animation */}
      <motion.aside 
        layout
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 280 : 72,
        }}
        transition={springConfig}
        className="hidden md:flex flex-col bg-[#F9F9FB] dark:bg-[#0E0E0E] border-r border-slate-200/60 dark:border-white/5 z-[30] relative group/sidebar overflow-x-hidden"
      >
        <SidebarContent />
      </motion.aside>
    </>
  );
};