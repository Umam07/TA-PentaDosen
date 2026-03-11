import React from 'react';
import { ChevronLeft, FileText, Scale, ShieldAlert, Gavel, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface TermsConditionsProps {
  onBack: () => void;
}

export const TermsConditions: React.FC<TermsConditionsProps> = ({ onBack }) => {
  const sections = [
    {
      title: "Penerimaan Ketentuan",
      content: "Dengan mengakses atau menggunakan platform PentaDosen, Anda setuju untuk terikat oleh Syarat & Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari ketentuan ini, Anda tidak diperkenankan menggunakan layanan kami.",
      icon: <UserCheck className="w-5 h-5 text-primary-600" />
    },
    {
      title: "Hak Intelektual",
      content: "Seluruh konten, fitur, dan fungsionalitas platform adalah milik eksklusif PentaDosen dan pemberi lisensinya. Berkas penelitian dan kekayaan intelektual yang diunggah oleh pengguna tetap menjadi hak milik pengguna tersebut sesuai dengan peraturan institusi.",
      icon: <Scale className="w-5 h-5 text-primary-600" />
    },
    {
      title: "Batasan Tanggung Jawab",
      content: "PentaDosen tidak bertanggung jawab atas segala kerusakan langsung, tidak langsung, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan untuk menggunakan platform, termasuk kehilangan data atau gangguan bisnis.",
      icon: <ShieldAlert className="w-5 h-5 text-primary-600" />
    },
    {
      title: "Perubahan Ketentuan",
      content: "Kami berhak untuk mengubah atau mengganti Syarat & Ketentuan ini kapan saja. Perubahan akan berlaku segera setelah dipublikasikan di platform. Penggunaan berkelanjutan Anda setelah perubahan tersebut merupakan persetujuan atas ketentuan baru.",
      icon: <Gavel className="w-5 h-5 text-primary-600" />
    }
  ];

  return (
    <section className="min-h-screen pt-32 pb-20 px-4 bg-white dark:bg-black transition-colors duration-500 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

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
              <FileText className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Syarat & Ketentuan<span className="text-primary-600">.</span>
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
              Penggunaan platform ini tunduk pada hukum yang berlaku di Republik Indonesia. Untuk pertanyaan hukum lebih lanjut, silakan hubungi tim legal kami melalui unit IT Fakultas Teknologi Informasi Universitas YARSI.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};