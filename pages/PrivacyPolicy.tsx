import React from 'react';
import { ChevronLeft, ShieldCheck, Lock, Eye, FileText, Database } from 'lucide-react';
import { motion } from 'framer-motion';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  const sections = [
    {
      title: "Pendahuluan",
      content: "PentaDosen berkomitmen untuk melindungi dan menghormati privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan platform PentaDosen.",
      icon: <FileText className="w-5 h-5 text-primary-600" />
    },
    {
      title: "Informasi yang Kami Kumpulkan",
      content: "Kami mengumpulkan data pribadi yang Anda berikan saat melakukan registrasi, seperti Nama Lengkap, NIDN, NIP, alamat email, dan informasi terkait institusi akademik Anda. Kami juga menyimpan berkas-berkas penelitian yang Anda unggah ke dalam sistem.",
      icon: <Database className="w-5 h-5 text-primary-600" />
    },
    {
      title: "Penggunaan Informasi",
      content: "Informasi yang dikumpulkan digunakan untuk mengelola akun Anda, memfasilitasi proses administrasi penelitian, memberikan notifikasi terkait status proposal, dan meningkatkan fungsionalitas platform secara keseluruhan.",
      icon: <Eye className="w-5 h-5 text-primary-600" />
    },
    {
      title: "Keamanan Data",
      content: "Kami menerapkan protokol keamanan tingkat tinggi, termasuk enkripsi data dan akses terbatas, untuk memastikan informasi dan kekayaan intelektual Anda tetap aman dari akses yang tidak sah.",
      icon: <Lock className="w-5 h-5 text-primary-600" />
    }
  ];

  return (
    <section className="min-h-screen pt-32 pb-20 px-4 bg-white dark:bg-black transition-colors duration-500 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-4xl mx-auto">
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="group mb-12 flex items-center gap-2 text-slate-400 hover:text-primary-600 transition-colors text-sm font-semibold"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </motion.button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-900/40 border border-slate-100 dark:border-white/5 rounded-[3rem] p-8 md:p-16 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Kebijakan Privasi<span className="text-primary-600">.</span>
              </h1>
              <p className="text-slate-400 dark:text-neutral-500 text-sm font-medium">Terakhir diperbarui: Jan 2026</p>
            </div>
          </div>

          <div className="space-y-12">
            {sections.map((section, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                    {section.icon}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{section.title}</h2>
                </div>
                <p className="text-slate-600 dark:text-neutral-400 leading-relaxed text-lg">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 pt-12 border-t border-slate-100 dark:border-white/5">
            <p className="text-slate-500 dark:text-neutral-500 text-sm italic">
              Dengan menggunakan PentaDosen, Anda menyetujui pengumpulan dan penggunaan informasi sesuai dengan kebijakan ini. Jika Anda memiliki pertanyaan tentang privasi Anda, silakan hubungi kami melalui email di <a href="mailto:fortunateams3@gmail.com" className="text-primary-600 font-bold hover:underline">fortunateams3@gmail.com</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};