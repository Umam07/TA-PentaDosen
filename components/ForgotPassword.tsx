
import React, { useState } from 'react';
import { BookOpen, Mail, ArrowRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (val: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val.length > 0 && !emailRegex.test(val)) {
      setError('Format email tidak valid');
    } else {
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      setError('Masukkan alamat email yang valid');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  return (
    <section className="min-h-screen pt-24 md:pt-32 pb-20 flex items-center justify-center px-4 bg-white dark:bg-black transition-colors duration-500 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse [animation-delay:1.5s]"></div>

      <div className="w-full max-w-md reveal-cinematic">
        {/* Back Button */}
        <button 
          onClick={onBackToLogin}
          className="group mb-8 flex items-center gap-2 text-slate-400 hover:text-primary-600 transition-colors text-sm font-semibold opacity-0 animate-slide-up [animation-fill-mode:forwards]"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Login
        </button>

        <div className="bg-white dark:bg-neutral-900/40 border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-10 md:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-none backdrop-blur-xl relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center">
          
          {!isSubmitted ? (
            <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Logo Area */}
              <div className="flex flex-col items-center mb-10">
                <div className="w-16 h-16 bg-primary-600 rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-primary-500/30 mb-6 transition-transform hover:scale-105">
                  <BookOpen className="text-white w-8 h-8" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Reset Password<span className="text-primary-600">.</span>
                </h1>
                <p className="text-slate-400 dark:text-neutral-500 text-sm font-medium mt-2">
                  Masukkan email Anda untuk menerima link reset
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">
                    Alamat Email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        validateEmail(e.target.value);
                      }}
                      placeholder="your@email.com"
                      className={`w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-neutral-800/50 border ${error ? 'border-red-500/50' : 'border-transparent'} focus:border-primary-600/30 focus:bg-white dark:focus:bg-neutral-800 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 transition-all outline-none text-sm font-medium`}
                    />
                  </div>
                  {error && <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">{error}</p>}
                </div>

                {/* Reset Button */}
                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isLoading || !email || !!error}
                    className="w-full group px-8 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary-500/20 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Send reset link</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="w-full animate-in zoom-in fade-in duration-700">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-8 mx-auto">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                Link Terkirim!
              </h2>
              <p className="text-slate-500 dark:text-neutral-400 text-sm leading-relaxed mb-10 max-w-[280px] mx-auto">
                Jika email <span className="font-bold text-slate-900 dark:text-white">{email}</span> terdaftar, link reset password akan dikirimkan segera.
              </p>
              <button 
                onClick={onBackToLogin}
                className="text-primary-600 dark:text-primary-400 font-bold hover:underline transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
              >
                <ChevronLeft className="w-4 h-4" />
                Kembali ke Login
              </button>
            </div>
          )}

          {/* Bottom Footer Helper Link */}
          {!isSubmitted && (
            <div className="mt-8">
              <button onClick={onBackToLogin} className="text-sm font-bold text-slate-400 dark:text-neutral-600 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Teringat password Anda? Masuk
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
