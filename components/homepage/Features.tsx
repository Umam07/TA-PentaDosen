
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { FileText, Database, CreditCard, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      title: 'Pengelolaan Proposal',
      description: 'Pantau status proposal secara real-time. Sistem notifikasi cerdas memastikan Anda tidak melewatkan tenggat waktu penting.',
      icon: <FileText className="w-7 h-7 text-primary-600 dark:text-primary-400" />,
      color: 'bg-primary-500/10',
      borderColor: 'group-hover:border-primary-500/30'
    },
    {
      title: 'Dokumentasi Terpusat',
      description: 'Seluruh luaran penelitian tersimpan aman di cloud. Akses kapan saja, di mana saja dengan enkripsi tingkat tinggi.',
      icon: <Database className="w-7 h-7 text-primary-600 dark:text-primary-400" />,
      color: 'bg-primary-500/10',
      borderColor: 'group-hover:border-primary-500/30'
    },
    {
      title: 'Pendanaan Transparan',
      description: 'Kelola anggaran penelitian dengan akurasi maksimal. Laporan pencairan dana otomatis yang siap audit.',
      icon: <CreditCard className="w-7 h-7 text-primary-600 dark:text-primary-400" />,
      color: 'bg-primary-500/10',
      borderColor: 'group-hover:border-primary-500/30'
    },
    {
      title: 'Keamanan Data',
      description: 'Privasi intelektual adalah prioritas kami. Data Anda dilindungi oleh protokol keamanan terbaru.',
      icon: <ShieldCheck className="w-7 h-7 text-primary-600 dark:text-primary-400" />,
      color: 'bg-primary-500/10',
      borderColor: 'group-hover:border-primary-500/30'
    },
    {
      title: 'Kinerja Cepat',
      description: 'Antarmuka yang responsif and optimasi database kelas atas memberikan pengalaman pengguna tanpa hambatan.',
      icon: <Zap className="w-7 h-7 text-primary-600 dark:text-primary-400" />,
      color: 'bg-primary-500/10',
      borderColor: 'group-hover:border-primary-500/30'
    },
    {
      title: 'Analitik Mendalam',
      description: 'Visualisasi data riset yang informatif untuk membantu pengambilan keputusan strategis departemen.',
      icon: <BarChart3 className="w-7 h-7 text-primary-600 dark:text-primary-400" />,
      color: 'bg-primary-500/10',
      borderColor: 'group-hover:border-primary-500/30'
    }
  ];

  // Varians untuk Container dari codingan lama
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  // Varians untuk setiap kartu dari codingan lama
  // Fix: Added explicit 'as const' to transition type to satisfy Variants type definition
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { 
        type: "spring" as const, 
        stiffness: 80, 
        damping: 15 
      }
    }
  };

  return (
    <section id="fitur" className="py-32 relative overflow-hidden bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section dengan Animasi Lama */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-20"
        >
          <h2 className="text-sm font-bold tracking-widest text-primary-600 dark:text-primary-400 uppercase mb-4">
            Fitur Utama
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Dirancang untuk <br />
            <span className="text-slate-400 dark:text-neutral-500">Mendorong Inovasi Akademik.</span>
          </h3>
          <p className="text-lg text-slate-600 dark:text-neutral-400 leading-relaxed">
            PentaDosen menyederhanakan birokrasi penelitian agar Anda dapat fokus sepenuhnya pada penemuan dan pengembangan ilmu pengetahuan.
          </p>
        </motion.div>

        {/* Grid Animasi menggunakan ContainerVariants */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ 
                y: -12, 
                transition: { type: "spring", stiffness: 300, damping: 20 } 
              }}
              className={`group bg-slate-50 dark:bg-neutral-900/20 p-10 rounded-[2.5rem] border border-transparent dark:border-white/5 hover:bg-white dark:hover:bg-neutral-900/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/10 ${feature.borderColor}`}
            >
              {/* Icon Container */}
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 group-hover:brightness-110 transition-all duration-500 shadow-sm`}>
                {feature.icon}
              </div>

              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary-600 transition-colors duration-300">
                {feature.title}
              </h4>
              
              <p className="text-slate-500 dark:text-neutral-400 leading-relaxed text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative Background */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
    </section>
  );
};
