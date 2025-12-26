import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, User, Lock, Mail, ChevronLeft, ChevronRight, ArrowRight, Eye, EyeOff, Building2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RegisterProps {
  onBack: () => void;
  onLogin: () => void;
}

type Step = 1 | 2;

const FACULTY_MAJORS: Record<string, string[]> = {
  'Fakultas Kedokteran': ['Kedokteran'],
  'Fakultas Kedokteran Gigi': ['Kedokteran Gigi'],
  'Fakultas Teknologi Informasi': ['Teknik Informatika', 'Perpustakaan dan Sains Informasi'],
  'Fakultas Ekonomi Bisnis': ['Manajemen', 'Akuntansi'],
  'Fakultas Hukum': ['Hukum'],
  'Fakultas Psikologi': ['Psikologi'],
};

// Custom Dropdown Component
interface CustomSelectProps {
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, value, options, placeholder, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">
        {label}
      </label>
      
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-5 py-3.5 bg-slate-50 dark:bg-neutral-800/50 border-2 transition-all duration-300 rounded-2xl text-sm font-medium
          ${isOpen ? 'border-primary-600/50 bg-white dark:bg-neutral-800 ring-4 ring-primary-600/5' : 'border-transparent'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-100/50 dark:hover:bg-neutral-800'}`}
      >
        <span className={!value ? 'text-slate-400 dark:text-neutral-600' : 'text-slate-900 dark:text-white'}>
          {value || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ChevronDown className={`w-4 h-4 ${isOpen ? 'text-primary-600' : 'text-slate-400'}`} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="absolute z-[100] w-full mt-2 bg-white/80 dark:bg-neutral-900/90 border border-slate-200/50 dark:border-white/10 rounded-2xl shadow-xl backdrop-blur-xl overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto py-2">
              {options.map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`px-5 py-3 text-sm font-medium cursor-pointer transition-all mx-2 rounded-xl
                    ${value === option 
                      ? 'bg-primary-600 text-white' 
                      : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-white/10'
                    }`}
                >
                  {option}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Register: React.FC<RegisterProps> = ({ onBack, onLogin }) => {
  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    nidn: '',
    nip: '',
    academicRank: '',
    university: '',
    otherUniversity: '',
    faculty: '',
    major: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatNIDN = (val: string) => {
    const digits = val.replace(/\D/g, '').substring(0, 10);
    let formatted = '';
    if (digits.length > 0) formatted += digits[0];
    if (digits.length > 1) formatted += '-' + digits.substring(1, 7);
    if (digits.length > 7) formatted += '-' + digits.substring(7, 10);
    return formatted;
  };

  const formatNIP = (val: string) => {
    const digits = val.replace(/\D/g, '').substring(0, 18);
    let formatted = '';
    if (digits.length > 0) formatted += digits.substring(0, 8);
    if (digits.length > 8) formatted += '-' + digits.substring(8, 14);
    if (digits.length > 14) formatted += '-' + digits.substring(14, 16);
    if (digits.length > 16) formatted += '-' + digits.substring(16, 18);
    return formatted;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'nidn') newValue = formatNIDN(value);
    if (name === 'nip') newValue = formatNIP(value);
    if (name === 'username') newValue = value.replace(/\s/g, '').toLowerCase();

    setFormData(prev => ({ ...prev, [name]: newValue }));
    validateField(name, newValue);
  };

  const setCustomValue = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'nidn') {
      const digits = value.replace(/\D/g, '');
      if (digits.length > 0 && digits.length < 10) error = 'NIDN harus 10 digit';
    }
    if (name === 'nip') {
      const digits = value.replace(/\D/g, '');
      if (digits.length > 0 && digits.length < 18) error = 'NIP harus 18 digit';
    }
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value.length > 0 && !emailRegex.test(value)) error = 'Format email tidak valid';
    }
    if (name === 'confirmPassword') {
      if (value.length > 0 && value !== formData.password) error = 'Password tidak cocok';
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) newErrors[name] = error;
      else delete newErrors[name];
      return newErrors;
    });
  };

  const isStep1Valid = () => {
    const { fullName, nidn, nip, academicRank, university, faculty, major, otherUniversity } = formData;
    return (
      fullName.trim() !== '' &&
      nidn.replace(/\D/g, '').length === 10 &&
      nip.replace(/\D/g, '').length === 18 &&
      academicRank !== '' &&
      (university === 'Universitas YARSI' || (university === 'Other' && otherUniversity.trim() !== '')) &&
      faculty !== '' &&
      major !== ''
    );
  };

  const isStep2Valid = () => {
    const { email, username, password, confirmPassword } = formData;
    return (
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      username.trim() !== '' &&
      password.length >= 6 &&
      password === confirmPassword &&
      !errors.confirmPassword && !errors.email
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStep2Valid()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onBack();
      }, 2000);
    }
  };

  return (
    <section className="min-h-screen pt-24 pb-20 flex items-center justify-center px-4 bg-white dark:bg-black transition-colors duration-500 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse [animation-delay:1.5s]"></div>

      <div className="w-full max-w-2xl">
        {/* Kembali ke Beranda */}
        <button 
          onClick={onBack}
          className="group mb-8 flex items-center gap-2 text-slate-400 hover:text-primary-600 transition-colors text-sm font-semibold"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </button>

        <div className="bg-white dark:bg-neutral-900/40 border border-slate-100 dark:border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl backdrop-blur-xl relative">
          
          {/* Progress Bar Container */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4 text-[10px] font-black uppercase tracking-[0.2em]">
              <span className={step >= 1 ? 'text-primary-600' : 'text-slate-400'}>Step 01: Personal</span>
              <span className={step >= 2 ? 'text-primary-600' : 'text-slate-400'}>Step 02: Account</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                animate={{ width: `${(step / 2) * 100}%` }}
                transition={{ type: "spring", stiffness: 50, damping: 15 }}
              />
            </div>
          </div>

          <div className="flex flex-col items-center mb-10">
            <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center shadow-2xl mb-6">
              <BookOpen className="text-white w-7 h-7" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight text-center">
              Daftar Akun<span className="text-primary-600">.</span>
            </h1>
            <p className="text-slate-400 dark:text-neutral-500 text-sm font-medium mt-2">
              {step === 1 ? 'Lengkapi informasi akademik Anda' : 'Lengkapi informasi login Anda'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="space-y-2 col-span-full">
                    <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">Nama Lengkap & Gelar</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                      <input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Dr. Budi Santoso, M.T." className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl text-sm font-medium outline-none focus:bg-white dark:focus:bg-neutral-800 transition-all border border-transparent focus:border-primary-600/30" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">NIDN</label>
                    <input name="nidn" value={formData.nidn} onChange={handleInputChange} placeholder="X-XXXXXX-XXX" className={`w-full px-5 py-3.5 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl text-sm font-medium outline-none border transition-all ${errors.nidn ? 'border-red-500/50' : 'border-transparent focus:border-primary-600/30'}`} />
                    {errors.nidn && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.nidn}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">NIP</label>
                    <input name="nip" value={formData.nip} onChange={handleInputChange} placeholder="XXXXXXXX-XXXXXX-XX-XX" className={`w-full px-5 py-3.5 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl text-sm font-medium outline-none border transition-all ${errors.nip ? 'border-red-500/50' : 'border-transparent focus:border-primary-600/30'}`} />
                    {errors.nip && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.nip}</p>}
                  </div>

                  <CustomSelect label="Jabatan Akademik" value={formData.academicRank} placeholder="Pilih Jabatan" options={['Asisten Ahli', 'Lektor', 'Lektor Kepala', 'Guru Besar']} onChange={(val) => setCustomValue('academicRank', val)} />
                  
                  <CustomSelect label="Universitas" value={formData.university} placeholder="Pilih Universitas" options={['Universitas YARSI', 'Other']} onChange={(val) => setCustomValue('university', val)} />

                  {/* FLUID OTHER UNIVERSITY FIELD */}
                  <div className="col-span-full">
                    <AnimatePresence>
                      {formData.university === 'Other' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ 
                            height: "auto", 
                            opacity: 1, 
                            marginTop: 8,
                            transition: {
                              height: { type: "spring", stiffness: 100, damping: 18 },
                              opacity: { duration: 0.3 }
                            }
                          }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-2 pb-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-neutral-600 uppercase tracking-widest ml-1">
                              Nama Universitas Lainnya
                            </label>
                            <div className="relative group">
                              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                              <input 
                                name="otherUniversity"
                                value={formData.otherUniversity}
                                onChange={handleInputChange}
                                placeholder="Masukkan nama universitas"
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-neutral-800/50 border border-transparent focus:border-primary-600/30 focus:bg-white dark:focus:bg-neutral-800 rounded-2xl text-slate-900 dark:text-white transition-all outline-none text-sm font-medium"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <CustomSelect label="Fakultas" value={formData.faculty} placeholder="Pilih Fakultas" options={Object.keys(FACULTY_MAJORS)} onChange={(val) => { setFormData(prev => ({ ...prev, faculty: val, major: '' })); }} />
                  <CustomSelect label="Jurusan" value={formData.major} placeholder="Pilih Jurusan" disabled={!formData.faculty} options={formData.faculty ? FACULTY_MAJORS[formData.faculty] : []} onChange={(val) => setCustomValue('major', val)} />
                </motion.div>
              ) : (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alamat Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                      <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="nama@email.com" className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl text-sm font-medium outline-none border transition-all ${errors.email ? 'border-red-500/50' : 'border-transparent focus:border-primary-600/30'}`} />
                    </div>
                    {errors.email && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                      <input name="username" value={formData.username} onChange={handleInputChange} placeholder="tanpa spasi" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl text-sm font-medium outline-none focus:border-primary-600/30 border border-transparent transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 relative group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                      <Lock className="absolute left-4 top-[46px] w-4 h-4 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                      <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} placeholder="••••••••" className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl text-sm font-medium outline-none focus:border-primary-600/30 border border-transparent transition-all" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[46px] text-slate-400 hover:text-primary-600 transition-colors">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                    </div>

                    <div className="space-y-2 relative group">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Konfirmasi</label>
                      <Lock className="absolute left-4 top-[46px] w-4 h-4 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                      <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" className={`w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl text-sm font-medium outline-none border transition-all ${errors.confirmPassword ? 'border-red-500/50' : 'border-transparent focus:border-primary-600/30'}`} />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-[46px] text-slate-400 hover:text-primary-600 transition-colors">{showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-8 flex gap-4">
              {step === 2 && (
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="flex-1 py-4 border border-slate-200 dark:border-white/10 rounded-2xl font-bold transition-all hover:bg-slate-50 dark:hover:bg-white/5 active:scale-95 text-slate-900 dark:text-white"
                >
                  Kembali
                </button>
              )}
              
              <button 
                type={step === 1 ? "button" : "submit"}
                onClick={step === 1 ? () => isStep1Valid() && setStep(2) : undefined}
                disabled={step === 1 ? !isStep1Valid() : (isLoading || !isStep2Valid())}
                className="flex-[2] group py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-40 disabled:grayscale"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{step === 1 ? 'Selanjutnya' : 'Daftar Akun'}</span>
                    {step === 1 ? <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> : <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Already have an account */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 dark:text-neutral-500">
              Already have an account?{' '}
              <button 
                onClick={onLogin} 
                className="text-primary-600 dark:text-primary-400 font-bold hover:underline transition-all duration-300"
              >
                Sign in
              </button>
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};