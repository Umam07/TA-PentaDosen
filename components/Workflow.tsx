import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle2, PlayCircle, Archive } from 'lucide-react';

export const Workflow: React.FC = () => {
  const steps = [
    {
      title: 'Pengajuan Proposal',
      desc: 'Lengkapi formulir digital dan unggah berkas penelitian Anda ke dalam sistem cloud terenkripsi.',
      icon: <UploadCloud className="w-8 h-8" />,
    },
    {
      title: 'Review & Persetujuan',
      desc: 'Tim ahli melakukan peninjauan objektif secara transparan melalui dashboard kolaboratif.',
      icon: <CheckCircle2 className="w-8 h-8" />,
    },
    {
      title: 'Pelaksanaan',
      desc: 'Kelola milestone, dokumentasi, dan pelaporan kemajuan secara berkala melalui platform.',
      icon: <PlayCircle className="w-8 h-8" />,
    },
    {
      title: 'Arsip & Publikasi',
      desc: 'Finalisasi hasil riset untuk pengarsipan permanen dan persiapan publikasi jurnal ilmiah.',
      icon: <Archive className="w-8 h-8" />,
    },
  ];

  // Varians untuk line connector (animasi garis memanjang)
  const lineVariants = {
    hidden: { scaleX: 0, originX: 0 },
    visible: { 
      scaleX: 1, 
      transition: { duration: 1.5, ease: [0.65, 0, 0.35, 1], delay: 0.8 } 
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2, delayChildren: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 20 
      }
    }
  };

  return (
    <section id="alur" className="py-32 bg-slate-50 dark:bg-black/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header dengan Motion */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-sm font-bold tracking-widest text-primary-600 dark:text-primary-400 uppercase mb-4">
            Sistem Kerja
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Alur Kerja yang <span className="text-primary-600">Terotomatisasi</span>
          </h3>
          <p className="text-lg text-slate-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Kami memangkas proses manual yang rumit menjadi langkah-langkah digital yang logis dan efisien.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connector Line (Desktop) - Teranimasi */}
          <motion.div 
            variants={lineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary-500/10 via-primary-500/40 to-primary-500/10 dark:via-white/20"
          />

          {/* Grid Container */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
          >
            {steps.map((step, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="relative flex flex-col items-center group"
              >
                {/* Icon Circle dengan Hover Effect */}
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  className="w-24 h-24 bg-white dark:bg-black rounded-[2.5rem] flex items-center justify-center text-primary-600 dark:text-primary-400 mb-10 shadow-xl shadow-slate-200/50 dark:shadow-none relative z-10 transition-all duration-500 group-hover:bg-primary-600 group-hover:text-white border border-slate-100 dark:border-white/5"
                >
                  {step.icon}
                  
                  {/* Badge Number */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-slate-900 dark:bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold border-4 border-slate-50 dark:border-black transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-110">
                    {idx + 1}
                  </div>
                </motion.div>
                
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4 text-center group-hover:text-primary-600 transition-colors duration-300">
                  {step.title}
                </h4>
                <p className="text-slate-500 dark:text-neutral-400 text-center leading-relaxed max-w-[250px] text-sm md:text-base">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};