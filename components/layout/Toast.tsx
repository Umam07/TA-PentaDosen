import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'error' | 'delete';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'delete': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success': return 'bg-white/90 dark:bg-neutral-900/90 border-green-500/20';
      case 'info': return 'bg-white/90 dark:bg-neutral-900/90 border-blue-500/20';
      case 'delete':
      case 'error': return 'bg-white/90 dark:bg-neutral-900/90 border-red-500/20';
      default: return 'bg-white/90 dark:bg-neutral-900/90 border-slate-200';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            mass: 1
          }}
          className={`fixed top-6 right-4 left-4 md:left-auto md:right-8 z-[999] flex items-center gap-3.5 px-5 py-4 min-w-[320px] max-w-md ${getBgColor()} border backdrop-blur-xl rounded-[1.25rem] shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)]`}
        >
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <p className="flex-1 text-[14px] font-semibold text-slate-800 dark:text-neutral-200 leading-snug">
            {message}
          </p>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors text-slate-400 dark:text-neutral-500"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};