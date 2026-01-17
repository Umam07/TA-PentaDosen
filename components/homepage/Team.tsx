
import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Instagram, GraduationCap, UserCircle, Users } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  major: string;
  npm: string;
  image: string;
  instagram: string;
}

const teamData: Record<string, TeamMember[]> = {
 DUK: [
    {
      name: 'Kiki Aimar Wicaksana',
      role: 'Cloud Engineer',
      major: 'Teknik Informatika',
      npm: '1402022030',
      image: 'https://res.cloudinary.com/dr57ribr5/image/upload/w_500,h_600,c_fill,q_auto,f_auto/Kiki_l5i0u9.jpg',
      instagram: '#'
    },
    {
      name: "Muhammad Syafi'ul Umam",
      role: 'Frontend',
      major: 'Teknik Informatika',
      npm: '1402022048',
      image: 'https://res.cloudinary.com/dr57ribr5/image/upload/w_500,h_600,c_fill,q_auto,f_auto/Mamz_oz4gxx.jpg',
      instagram: '#'
    },
    {
      name: 'Rafi Daniswara',
      role: 'Backend',
      major: 'Teknik Informatika',
      npm: '1402022050',
      image: 'https://res.cloudinary.com/dr57ribr5/image/upload/w_500,h_600,c_fill,q_auto,f_auto/Denis_ohil78.jpg',
      instagram: '#'
    }
  ],
  Fortuna: [
    {
      name: "Muhammad Syafi'ul Umam",
      role: 'Frontend',
      major: 'Teknik Informatika',
      npm: '1402022048',
      image: 'https://res.cloudinary.com/dr57ribr5/image/upload/w_500,h_600,c_fill,q_auto,f_auto/Mamz_oz4gxx.jpg',
      instagram: '#'
    },
    {
      name: 'Rafly Eryan Azis',
      role: 'Backend',
      major: 'Teknik Informatika',
      npm: '1402022051',
      image: 'https://res.cloudinary.com/dr57ribr5/image/upload/w_500,h_600,c_fill,q_auto,f_auto/Rafly_apu6fy.jpg',
      instagram: '#'
    },
    {
      name: 'Rafi Daniswara',
      role: 'UI/UX Desainer',
      major: 'Teknik Informatika',
      npm: '1402022050',
      image: 'https://res.cloudinary.com/dr57ribr5/image/upload/w_500,h_600,c_fill,q_auto,f_auto/Denis_ohil78.jpg',
      instagram: '#'
    }
  ]
};

export const Team: React.FC = () => {
  const [activeTeam, setActiveTeam] = useState<'DUK' | 'Fortuna'>('DUK');

  // Varians untuk Container (Efek muncul satu per satu)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    },
    exit: { 
      opacity: 0, 
      transition: { staggerChildren: 0.05, staggerDirection: -1 } 
    }
  };

  // Varians untuk setiap kartu
  // Fix: Added explicit 'as const' to transition type
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring" as const, stiffness: 80, damping: 15 }
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <section id="tentang" className="py-24 md:py-32 bg-white dark:bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section dengan Motion */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-full mb-6"
          >
            <Users className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">
              Tim Kreator
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight"
          >
            Kolaborasi di Balik <br className="hidden md:block" />
            <span className="text-slate-400 dark:text-neutral-600">Keunggulan Riset.</span>
          </motion.h2>
          
          {/* Team Selector - Animated Pill */}
          <div className="flex justify-center mt-12">
            <div className="inline-flex p-1.5 bg-slate-100 dark:bg-neutral-900/50 backdrop-blur-md rounded-[2rem] border border-slate-200 dark:border-white/5 relative">
              {(['DUK', 'Fortuna'] as const).map((team) => (
                <button
                  key={team}
                  onClick={() => setActiveTeam(team)}
                  className={`relative z-10 px-8 py-3 rounded-[1.5rem] text-sm font-bold transition-colors duration-500 ${
                    activeTeam === team ? 'text-slate-900 dark:text-white' : 'text-slate-500'
                  }`}
                >
                  Tim {team}
                  {activeTeam === team && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white dark:bg-neutral-800 rounded-[1.5rem] shadow-xl -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Team Grid dengan AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTeam}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
          >
            {teamData[activeTeam].map((member, idx) => (
              <motion.div 
                key={`${activeTeam}-${member.npm}`} 
                variants={cardVariants}
                className="group relative flex flex-col items-center"
              >
                {/* Member Image - Modern Soft-Rounded Rectangle */}
                <div className="relative mb-10 w-full max-w-[280px] md:max-w-xs">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="aspect-[4/5] rounded-[2.5rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000 shadow-2xl border-[6px] border-white dark:border-neutral-900 group-hover:border-primary-600/20"
                  >
                    <motion.img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.8 }}
                    />
                  </motion.div>
                  
                  {/* Floating Decoration Icon */}
                  <motion.div 
                    initial={{ scale: 0, x: 20 }}
                    whileInView={{ scale: 1, x: 0 }}
                    className="absolute bottom-2 right-2 w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"
                  >
                    <UserCircle className="w-6 h-6" />
                  </motion.div>
                </div>

                {/* Member Info */}
                <div className="text-center space-y-4 max-w-[280px]">
                  <div>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-primary-600 transition-colors">
                      {member.name}
                    </h4>
                    <p className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest mt-1">
                      {member.role}
                    </p>
                  </div>
                  
                  <div className="pt-5 space-y-2.5 border-t border-slate-100 dark:border-white/5">
                    <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-neutral-400">
                      <GraduationCap className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-semibold leading-none">{member.major}</span>
                    </div>
                    <div className="inline-block px-3 py-1 bg-slate-50 dark:bg-white/5 rounded-md">
                      <span className="text-[11px] font-mono text-slate-400 dark:text-neutral-500 uppercase tracking-[0.15em]">
                        {member.npm.includes('NIDN') ? '' : 'NPM: '}{member.npm}
                      </span>
                    </div>
                  </div>

                  {/* Social Icon */}
                  <div className="pt-6">
                    <motion.a 
                      whileHover={{ y: -5, scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      href={member.instagram} 
                      className="inline-flex w-12 h-12 items-center justify-center rounded-2xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 text-slate-400 hover:text-primary-600 hover:border-primary-600/50 hover:shadow-2xl transition-all"
                    >
                      <Instagram className="w-6 h-6" />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Apple-style Callout/Quote */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 relative py-14 px-8 bg-slate-900 dark:bg-neutral-900/60 rounded-[4rem] overflow-hidden text-center"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary-600 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600 blur-[130px] rounded-full"></div>
          </div>
          <div className="relative z-10">
            <p className="text-2xl md:text-3xl font-black text-white italic tracking-tight mb-4">
              "Fokus pada kesederhanaan, hasilkan keunggulan."
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-[2px] bg-primary-500 rounded-full"></div>
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-primary-400">PentaDosen Core Philosophy</span>
              <div className="w-8 h-[2px] bg-primary-500 rounded-full"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
