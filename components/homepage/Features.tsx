
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Database, CreditCard, ShieldCheck, Zap, BarChart3, CheckCircle2, AlertCircle, Clock, Folder, Shield } from 'lucide-react';

export const Features: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      }
    }
  };

  return (
    <section id="fitur" className="py-32 relative overflow-hidden bg-slate-50 dark:bg-[#0A0A0A]">
      {/* Dot Pattern Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xNSkiLz48L3N2Zz4=')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-20"
        >
          <h2 className="text-sm font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase mb-4">
            Fitur Utama
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
            Dirancang untuk <br />
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Mendorong Inovasi Akademik.
            </span>
          </h3>
          <p className="text-lg font-medium text-slate-500 dark:text-neutral-400 leading-relaxed">
            PentaDosen menyederhanakan birokrasi penelitian agar Anda dapat fokus sepenuhnya pada penemuan dan pengembangan ilmu pengetahuan.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(280px,auto)]"
        >
          {/* Card 1: Pengelolaan Proposal (col-span-2) */}
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            className="group relative bg-white dark:bg-neutral-900/50 p-8 rounded-[2rem] border border-slate-200/60 dark:border-white/10 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-500/10 md:col-span-2 lg:col-span-2 overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-indigo-500/10" />
            
            <div className="relative z-10 mb-8">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Pengelolaan Proposal
              </h4>
              <p className="text-slate-500 dark:text-neutral-400 leading-relaxed max-w-md">
                Pantau status proposal secara real-time. Sistem notifikasi cerdas memastikan Anda tidak melewatkan tenggat waktu penting.
              </p>
            </div>

            {/* Micro-UI: Status Badges */}
            <div className="relative z-10 h-32 w-full bg-slate-50 dark:bg-neutral-800/50 rounded-2xl border border-slate-100 dark:border-white/5 p-4 flex items-center justify-center overflow-hidden font-sans">
              <div className="relative w-full max-w-[240px] h-full flex items-center justify-center">
                
                {/* Badge 1: Diproses (Kiri/Bawah) */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, x: 0, y: 0, rotate: 0 },
                    visible: { opacity: 1, x: -32, y: 12, rotate: -8, transition: { duration: 0.6, ease: "easeOut" } },
                    hover: { x: -75, y: -5, rotate: 0, zIndex: 30, transition: { duration: 0.5, ease: "easeOut" } }
                  }}
                  className="absolute z-10 flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-slate-800/95 border border-blue-200 dark:border-blue-500/50 rounded-full shadow-md backdrop-blur-md"
                >
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-400">Diproses</span>
                </motion.div>

                {/* Badge 2: Disetujui (Tengah/Atas) */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, x: 0, y: 0, rotate: 0 },
                    visible: { opacity: 1, x: 0, y: -8, rotate: 0, zIndex: 20, transition: { duration: 0.6, ease: "easeOut" } },
                    hover: { x: 0, y: -25, rotate: 0, zIndex: 20, scale: 1.05, transition: { duration: 0.5, ease: "easeOut" } }
                  }}
                  className="absolute z-20 flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-slate-800/95 border border-green-200 dark:border-green-500/50 rounded-full shadow-lg backdrop-blur-md"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-bold text-green-700 dark:text-green-400">Disetujui</span>
                </motion.div>

                {/* Badge 3: Revisi (Kanan/Bawah) */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, x: 0, y: 0, rotate: 0 },
                    visible: { opacity: 1, x: 32, y: 12, rotate: 8, transition: { duration: 0.6, ease: "easeOut" } },
                    hover: { x: 75, y: -5, rotate: 0, zIndex: 30, transition: { duration: 0.5, ease: "easeOut" } }
                  }}
                  className="absolute z-0 flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-slate-800/95 border border-amber-200 dark:border-amber-500/50 rounded-full shadow-md backdrop-blur-md"
                >
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400">Revisi</span>
                </motion.div>

              </div>
            </div>
          </motion.div>

          {/* Card 2: Analitik Mendalam (row-span-2) */}
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            className="group relative bg-white dark:bg-neutral-900/50 p-8 rounded-[2rem] border border-slate-200/60 dark:border-white/10 hover:border-purple-500/30 dark:hover:border-purple-400/30 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-purple-500/10 md:col-span-2 lg:col-span-1 lg:row-span-2 overflow-hidden flex flex-col"
          >
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-purple-500/5 to-transparent pointer-events-none transition-all duration-500 group-hover:from-purple-500/10" />
            
            <div className="relative z-10 mb-8 flex-1">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Analitik Mendalam
              </h4>
              <p className="text-slate-500 dark:text-neutral-400 leading-relaxed text-sm">
                Visualisasi data riset yang informatif untuk membantu pengambilan keputusan strategis departemen.
              </p>
            </div>

            {/* Micro-UI: Bar Chart */}
            <div className="relative z-10 h-48 w-full mt-auto flex items-end justify-between gap-2 px-2">
              {[40, 70, 45, 90, 65, 80].map((height, i) => (
                <div key={i} className="w-full bg-slate-100 dark:bg-neutral-800 rounded-t-md relative overflow-hidden group-hover:bg-slate-200 dark:group-hover:bg-neutral-700 transition-colors" style={{ height: '100%' }}>
                  <motion.div 
                    className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-purple-600 to-indigo-500 rounded-t-md"
                    initial={{ height: '20%' }}
                    variants={{
                      hover: { height: `${height}%`, transition: { type: "spring", stiffness: 100, damping: 15, delay: i * 0.05 } }
                    }}
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 3: Dokumentasi Terpusat */}
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            className="group relative bg-white dark:bg-neutral-900/50 p-8 rounded-[2rem] border border-slate-200/60 dark:border-white/10 hover:border-sky-500/30 dark:hover:border-sky-400/30 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-sky-500/10 lg:col-span-1 overflow-hidden flex flex-col justify-between"
          >
            <div className="relative z-10 mb-6">
              <div className="w-10 h-10 bg-sky-50 dark:bg-sky-500/10 rounded-xl flex items-center justify-center mb-4 text-sky-600 dark:text-sky-400">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Dokumentasi Terpusat
              </h4>
              <p className="text-slate-500 dark:text-neutral-400 leading-relaxed text-sm">
                Seluruh luaran penelitian tersimpan aman di cloud.
              </p>
            </div>

            {/* Micro-UI: Folders */}
            <div className="relative z-10 h-24 w-full flex items-center justify-center">
              <div className="relative w-20 h-20">
                <motion.div 
                  variants={{ hover: { x: -20, rotate: -10 } }}
                  className="absolute inset-0 bg-sky-100 dark:bg-sky-900/40 border border-sky-200 dark:border-sky-700 rounded-xl flex items-center justify-center shadow-sm backdrop-blur-sm"
                >
                  <Folder className="w-8 h-8 text-sky-400 dark:text-sky-500" />
                </motion.div>
                <motion.div 
                  variants={{ hover: { x: 20, rotate: 10 } }}
                  className="absolute inset-0 bg-sky-50 dark:bg-sky-800/40 border border-sky-200 dark:border-sky-600 rounded-xl flex items-center justify-center shadow-md backdrop-blur-md"
                >
                  <Folder className="w-8 h-8 text-sky-500 dark:text-sky-400" />
                </motion.div>
                <motion.div 
                  variants={{ hover: { y: -10, scale: 1.05 } }}
                  className="absolute inset-0 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center shadow-lg z-10"
                >
                  <Folder className="w-8 h-8 text-sky-600 dark:text-sky-400 fill-sky-100 dark:fill-sky-900/30" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Pendanaan Transparan */}
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            className="group relative bg-white dark:bg-neutral-900/50 p-8 rounded-[2rem] border border-slate-200/60 dark:border-white/10 hover:border-emerald-500/30 dark:hover:border-emerald-400/30 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-500/10 lg:col-span-1 overflow-hidden flex flex-col justify-between"
          >
            <div className="relative z-10 mb-6">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Pendanaan Transparan
              </h4>
              <p className="text-slate-500 dark:text-neutral-400 leading-relaxed text-sm">
                Kelola anggaran dengan akurasi maksimal.
              </p>
            </div>

            {/* Micro-UI: Progress Bar */}
            <div className="relative z-10 w-full bg-slate-50 dark:bg-neutral-800/50 rounded-xl p-4 border border-slate-100 dark:border-white/5">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-neutral-300">Terserap</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">75%</span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                  initial={{ width: '30%' }}
                  variants={{ hover: { width: '75%', transition: { duration: 0.8, ease: "easeOut" } } }}
                />
              </div>
            </div>
          </motion.div>

          {/* Card 5: Keamanan Data */}
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            className="group relative bg-white dark:bg-neutral-900/50 p-8 rounded-[2rem] border border-slate-200/60 dark:border-white/10 hover:border-rose-500/30 dark:hover:border-rose-400/30 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-rose-500/10 lg:col-span-1 overflow-hidden flex flex-col justify-between"
          >
            <div className="relative z-10 mb-6">
              <div className="w-10 h-10 bg-rose-50 dark:bg-rose-500/10 rounded-xl flex items-center justify-center mb-4 text-rose-600 dark:text-rose-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Keamanan Data
              </h4>
              <p className="text-slate-500 dark:text-neutral-400 leading-relaxed text-sm">
                Privasi intelektual dilindungi protokol terbaru.
              </p>
            </div>

            {/* Micro-UI: Shield Pulse */}
            <div className="relative z-10 h-24 w-full flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                <motion.div 
                  variants={{ hover: { scale: 1.5, opacity: 0 } }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute w-12 h-12 bg-rose-400/40 rounded-full"
                />
                <motion.div 
                  variants={{ hover: { scale: 1.1 } }}
                  className="relative z-10 w-14 h-14 bg-white dark:bg-neutral-800 border border-rose-100 dark:border-rose-900/30 rounded-full flex items-center justify-center shadow-md"
                >
                  <Shield className="w-6 h-6 text-rose-500 dark:text-rose-400 fill-rose-50 dark:fill-rose-900/20" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Card 6: Kinerja Cepat */}
          <motion.div
            variants={itemVariants}
            whileHover="hover"
            className="group relative bg-white dark:bg-neutral-900/50 p-8 rounded-[2rem] border border-slate-200/60 dark:border-white/10 hover:border-amber-500/30 dark:hover:border-amber-400/30 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-amber-500/10 lg:col-span-1 overflow-hidden flex flex-col justify-between"
          >
            <div className="relative z-10 mb-6">
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Kinerja Cepat
              </h4>
              <p className="text-slate-500 dark:text-neutral-400 leading-relaxed text-sm">
                Antarmuka responsif tanpa hambatan.
              </p>
            </div>

            {/* Micro-UI: Speed Metrics */}
            <div className="relative z-10 w-full flex items-center justify-center mt-auto">
              <motion.div 
                variants={{ hover: { y: -5, scale: 1.05 } }}
                className="px-4 py-2.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-full flex items-center gap-3 shadow-sm"
              >
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-sm font-black text-amber-700 dark:text-amber-400 tracking-wide">99.9% UPTIME</span>
              </motion.div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};
