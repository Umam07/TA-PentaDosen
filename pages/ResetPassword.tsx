import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ResetPasswordProps {
  onSuccess: () => void;
}

const appleEase = [0.22, 1, 0.36, 1];

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    // Simulate password reset
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      // After success animation, redirect to login
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 1500);
  };

  return (
    <section className="min-h-screen pt-24 md:pt-32 pb-20 flex items-center justify-center px-4 bg-white dark:bg-black transition-colors duration-500 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse [animation-delay:1.5s]"></div>

      <div className="w-full max-w-md reveal-cinematic">
        <div className="bg-white dark:bg-neutral-900/40 border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-10 md:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-none backdrop-blur-xl relative overflow-hidden min-h-[450px] flex flex-col items-center justify-center text-center">
          
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div 
                key="reset-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: appleEase }}
                className="w-full"
              >
                <div className="flex flex-col items-center mb-10">
                  <div className="w-16 h-16 bg-primary-600 rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-primary-500/30 mb-6 transition-transform hover:scale-105">
                    <BookOpen className="text-white w-8 h-8" />
                  </div>
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Create New Password<span className="text-primary-600">.</span>
                  </h1>
                  <p className="text-slate-400 dark:text-neutral-500 text-sm font-medium mt-2">
                    Enter your new password below.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">
                      New Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input 
                        type={showPassword ? "text" : "password"} 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-14 py-4 bg-slate-50 dark:bg-neutral-800/50 border border-transparent focus:border-primary-600/30 focus:bg-white dark:focus:bg-neutral-800 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 transition-all outline-none text-sm font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">
                      Confirm New Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-14 py-4 bg-slate-50 dark:bg-neutral-800/50 border border-transparent focus:border-primary-600/30 focus:bg-white dark:focus:bg-neutral-800 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 transition-all outline-none text-sm font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {error && <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">{error}</p>}
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={isLoading || !password || !confirmPassword}
                      className="w-full group px-8 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary-500/20 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>Reset Password</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: appleEase }}
                className="w-full"
              >
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-8 mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                  Password Reset Successfully
                </h2>
                <p className="text-slate-500 dark:text-neutral-400 text-sm leading-relaxed max-w-[280px] mx-auto">
                  Your password has been updated. Redirecting to login...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
