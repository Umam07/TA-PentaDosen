import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ArrowRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

interface VerifyOTPProps {
  onBackToLogin: () => void;
  onSuccess: () => void;
}

const appleEase = [0.22, 1, 0.36, 1];

export const VerifyOTP: React.FC<VerifyOTPProps> = ({ onBackToLogin, onSuccess }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const handleChange = (index: number, value: string) => {
    if (value && isNaN(Number(value))) return;
    
    const newOtp = [...otp];
    // Take only the last character if multiple characters are entered (except for paste)
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move focus to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move focus to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    const data = pastedData.substring(0, 6).split('');
    
    if (data.every(char => !isNaN(Number(char)))) {
      const newOtp = [...otp];
      data.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      
      // Focus the next empty input or the last one
      const nextFocusIndex = Math.min(data.length, 5);
      inputRefs.current[nextFocusIndex]?.focus();
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(60);
    setCanResend(false);
    // Simulate resend logic here
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some(digit => !digit)) return;

    setIsLoading(true);
    // Simulate OTP validation
    setTimeout(() => {
      setIsLoading(false);
      setIsVerified(true);
      // After success animation, redirect to reset password
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
        {/* Back Button */}
        <button 
          onClick={onBackToLogin}
          className="group mb-8 flex items-center gap-2 text-slate-400 hover:text-primary-600 transition-colors text-sm font-semibold opacity-0 animate-slide-up [animation-fill-mode:forwards]"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Login
        </button>

        <div className="bg-white dark:bg-neutral-900/40 border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-10 md:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-none backdrop-blur-xl relative overflow-hidden min-h-[450px] flex flex-col items-center justify-center text-center">
          
          <AnimatePresence mode="wait">
            {!isVerified ? (
              <motion.div 
                key="otp-form"
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
                    Verify OTP Code<span className="text-primary-600">.</span>
                  </h1>
                  <p className="text-slate-400 dark:text-neutral-500 text-sm font-medium mt-2">
                    Enter the 6-digit verification code sent to your email.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="flex justify-between gap-2 md:gap-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className="w-full aspect-square text-center text-2xl font-bold bg-slate-50 dark:bg-neutral-800/50 border border-transparent focus:border-primary-600/30 focus:bg-white dark:focus:bg-neutral-800 rounded-xl text-slate-900 dark:text-white transition-all outline-none shadow-sm"
                      />
                    ))}
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit"
                      disabled={isLoading || otp.some(digit => !digit)}
                      className="w-full group px-8 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary-500/20 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>Verify Code</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-sm font-medium">
                    <p className="text-slate-400 dark:text-neutral-500">
                      Didn't receive the code?{' '}
                      {canResend ? (
                        <button 
                          type="button"
                          onClick={handleResend}
                          className="text-primary-600 dark:text-primary-400 font-bold hover:underline"
                        >
                          Resend OTP
                        </button>
                      ) : (
                        <span className="text-slate-300 dark:text-neutral-700 font-bold">
                          Resend OTP in {timer}s
                        </span>
                      )}
                    </p>
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
                  OTP Verified Successfully
                </h2>
                <p className="text-slate-500 dark:text-neutral-400 text-sm leading-relaxed max-w-[280px] mx-auto">
                  Redirecting you to reset your password...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
