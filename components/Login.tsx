
import React, { useState } from 'react';
import { BookOpen, User, Lock, ArrowRight, ChevronLeft, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onBack: () => void;
  onRegister: () => void;
  onForgotPassword: () => void;
}

export const Login: React.FC<LoginProps> = ({ onBack, onRegister, onForgotPassword }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000); // Simulate login
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="min-h-screen pt-24 md:pt-32 pb-20 flex items-center justify-center px-4 bg-white dark:bg-black transition-colors duration-500 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse [animation-delay:1s]"></div>

      <div className="w-full max-w-md reveal-cinematic">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="group mb-8 flex items-center gap-2 text-slate-400 hover:text-primary-600 transition-colors text-sm font-semibold opacity-0 animate-slide-up [animation-fill-mode:forwards]"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </button>

        <div className="bg-white dark:bg-neutral-900/40 border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-10 md:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-none backdrop-blur-xl relative overflow-hidden">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10 opacity-0 animate-slide-up [animation-delay:100ms] [animation-fill-mode:forwards]">
            <div className="w-16 h-16 bg-primary-600 rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-primary-500/30 mb-6 group transition-transform duration-500 hover:scale-105">
              <BookOpen className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight text-center">
              Selamat Datang<span className="text-primary-600">.</span>
            </h1>
            <p className="text-slate-400 dark:text-neutral-500 text-sm font-medium mt-2">
              Masuk ke akun PentaDosen Anda
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2 opacity-0 animate-slide-up [animation-delay:200ms] [animation-fill-mode:forwards]">
              <label className="text-xs font-bold text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">
                Username / Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="Masukkan username anda"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-neutral-800/50 border border-transparent focus:border-primary-600/30 focus:bg-white dark:focus:bg-neutral-800 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 transition-all outline-none text-sm font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2 opacity-0 animate-slide-up [animation-delay:300ms] [animation-fill-mode:forwards]">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold text-slate-400 dark:text-neutral-600 uppercase tracking-widest">
                  Password
                </label>
                <button 
                  type="button"
                  onClick={onForgotPassword}
                  className="text-[10px] font-bold text-primary-600 dark:text-primary-400 hover:underline uppercase tracking-wider transition-all duration-300"
                >
                  Lupa Password?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-14 py-4 bg-slate-50 dark:bg-neutral-800/50 border border-transparent focus:border-primary-600/30 focus:bg-white dark:focus:bg-neutral-800 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 transition-all outline-none text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 animate-in fade-in zoom-in duration-300" />
                  ) : (
                    <Eye className="w-5 h-5 animate-in fade-in zoom-in duration-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <div className="pt-4 opacity-0 animate-slide-up [animation-delay:400ms] [animation-fill-mode:forwards]">
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full group px-8 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary-500/20 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Bottom Footer Link */}
          <div className="mt-8 text-center opacity-0 animate-slide-up [animation-delay:500ms] [animation-fill-mode:forwards]">
            <p className="text-sm text-slate-500 dark:text-neutral-500">
              Don't have an account? <button onClick={onRegister} className="text-primary-600 dark:text-primary-400 font-bold hover:underline transition-all duration-300">Sign up here</button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
