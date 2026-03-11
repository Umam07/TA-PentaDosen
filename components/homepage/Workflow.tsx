
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { UploadCloud, CheckCircle2, PlayCircle, Archive } from 'lucide-react';

export const Workflow: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const steps = [
    {
      title: 'Pengajuan Proposal',
      desc: 'Lengkapi formulir digital dan unggah berkas penelitian Anda ke dalam sistem cloud terenkripsi.',
      icon: <UploadCloud className="w-6 h-6" />,
      color: 'from-indigo-500 to-blue-500',
      shadow: 'group-hover:shadow-indigo-500/20'
    },
    {
      title: 'Review & Persetujuan',
      desc: 'Tim ahli melakukan peninjauan objektif secara transparan melalui dashboard kolaboratif.',
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      shadow: 'group-hover:shadow-purple-500/20'
    },
    {
      title: 'Pelaksanaan',
      desc: 'Kelola milestone, dokumentasi, dan pelaporan kemajuan secara berkala melalui platform.',
      icon: <PlayCircle className="w-6 h-6" />,
      color: 'from-emerald-500 to-teal-500',
      shadow: 'group-hover:shadow-emerald-500/20'
    },
    {
      title: 'Arsip & Publikasi',
      desc: 'Finalisasi hasil riset untuk pengarsipan permanen dan persiapan publikasi jurnal ilmiah.',
      icon: <Archive className="w-6 h-6" />,
      color: 'from-amber-500 to-orange-500',
      shadow: 'group-hover:shadow-amber-500/20'
    },
  ];

  return (
    <section id="alur" className="py-32 relative overflow-hidden bg-white dark:bg-[#050505]">
      {/* Technical Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24 max-w-3xl mx-auto"
        >
          <h2 className="text-sm font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase mb-4">
            Sistem Kerja
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Alur Kerja yang <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Terotomatisasi</span>
          </h3>
          <p className="text-lg font-medium text-slate-500 dark:text-neutral-400 leading-relaxed">
            Kami memangkas proses manual yang rumit menjadi langkah-langkah digital yang logis dan efisien.
          </p>
        </motion.div>

        <div ref={containerRef} className="relative max-w-5xl mx-auto">
          {/* Vertical Timeline Line (Background) */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-white/10 -translate-x-1/2" />
          
          {/* Vertical Timeline Line (Animated Fill) */}
          <motion.div 
            style={{ height: lineHeight }}
            className="absolute left-8 md:left-1/2 top-0 w-px bg-gradient-to-b from-indigo-500 via-purple-500 to-emerald-500 -translate-x-1/2 origin-top"
          />

          <div className="space-y-16 md:space-y-24">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className="relative flex flex-col md:flex-row items-center justify-between group">
                  
                  {/* Left Content (Empty for odd, Content for even) */}
                  <div className={`w-full md:w-5/12 pl-20 md:pl-0 ${isEven ? 'md:text-right md:pr-16' : 'md:order-3 md:pl-16'}`}>
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className={`bg-white dark:bg-neutral-900/50 p-8 rounded-3xl border border-slate-200/60 dark:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${step.shadow} relative overflow-hidden`}
                    >
                      {/* Large Watermark Number */}
                      <div className={`absolute -top-6 ${isEven ? '-left-4' : '-right-4'} text-[120px] font-black text-slate-100 dark:text-white/5 leading-none select-none pointer-events-none z-0`}>
                        {idx + 1}
                      </div>
                      
                      <div className="relative z-10">
                        <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">
                          {step.title}
                        </h4>
                        <p className="text-base font-medium text-slate-500 dark:text-neutral-400 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Center Node */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center md:order-2 z-20">
                    <motion.div 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                      className={`w-14 h-14 rounded-full bg-gradient-to-br ${step.color} p-[2px] shadow-lg ${step.shadow} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <div className="w-full h-full bg-white dark:bg-neutral-950 rounded-full flex items-center justify-center text-slate-900 dark:text-white">
                        {step.icon}
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Content (Empty for even, Content for odd) */}
                  <div className={`hidden md:block w-5/12 ${isEven ? 'order-3' : 'order-1'}`} />
                  
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
