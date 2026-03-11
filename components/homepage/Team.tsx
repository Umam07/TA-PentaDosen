import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Instagram, Users } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  major: string;
  npm: string;
  image: string;
  instagram: string;
}

const teamData: TeamMember[] = [
  {
    name: 'Kiki Aimar Wicaksana',
    role: 'Frontend',
    major: 'Teknik Informatika',
    npm: '1402022030',
    image: 'https://res.cloudinary.com/dr57ribr5/image/upload/w_500,h_600,c_fill,q_auto,f_auto/Kiki_l5i0u9.jpg',
    instagram: 'https://www.instagram.com/kim.aimarr/'
  },
  {
    name: "Muhammad Syafi'ul Umam",
    role: 'Frontend',
    major: 'Teknik Informatika',
    npm: '1402022048',
    image: 'https://res.cloudinary.com/dr57ribr5/image/upload/w_500,h_600,c_fill,q_auto,f_auto/Mamz_oz4gxx.jpg',
    instagram: 'https://www.instagram.com/umammskyy/'
  },
  {
    name: 'Rafi Daniswara',
    role: 'Backend',
    major: 'Teknik Informatika',
    npm: '1402022050',
    image: 'https://res.cloudinary.com/dr57ribr5/image/upload/w_500,h_600,c_fill,q_auto,f_auto/Denis_ohil78.jpg',
    instagram: 'https://www.instagram.com/ravidnss/'
  }
];

export const Team: React.FC = () => {
  const [hasInView, setHasInView] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 70, damping: 15 }
    }
  };

  return (
    <section id="tentang" className="py-24 md:py-32 relative bg-slate-50 dark:bg-[#0A0A0A] overflow-hidden font-sans">
      {/* Dot Pattern Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xNSkiLz48L3N2Zz4=')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <motion.div 
          className="text-center mb-20 max-w-3xl mx-auto"
          onViewportEnter={() => setHasInView(true)}
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-full mb-6"
          >
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">
              Tim Kreator
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight"
          >
            Kolaborasi di Balik <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Keunggulan Riset.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg font-medium text-slate-500 dark:text-neutral-400 leading-relaxed"
          >
            Dikembangkan oleh mahasiswa Universitas YARSI untuk mendorong inovasi akademik.
          </motion.p>
        </motion.div>

        {/* Team Grid */}
        {hasInView && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {teamData.map((member, idx) => (
              <motion.div 
                key={idx} 
                variants={cardVariants}
                className="group bg-white dark:bg-neutral-900/50 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:-translate-y-2 overflow-hidden flex flex-col p-3"
              >
                {/* Photo Container */}
                <div className="bg-slate-50 dark:bg-neutral-800/50 w-full aspect-[4/5] overflow-hidden relative rounded-[1.5rem]">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.03] will-change-transform"
                  />
                  {/* Subtle overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] pointer-events-none"></div>
                </div>

                {/* Info Container */}
                <div className="pt-6 pb-5 px-4 flex flex-col items-center text-center flex-1 bg-white dark:bg-transparent">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    {member.name}
                  </h4>
                  <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4">
                    {member.role}
                  </p>
                  
                  <div className="mb-6">
                    <span className="inline-block bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-neutral-400 text-xs font-mono px-2 py-1 rounded-md">
                      NPM: {member.npm}
                    </span>
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5 w-full flex justify-center">
                    <a 
                      href={member.instagram} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Footer Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 relative py-12 px-8 bg-slate-900 dark:bg-neutral-900/80 rounded-3xl overflow-hidden text-center shadow-xl"
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-[-50%] left-[-10%] w-[60%] h-[150%] bg-indigo-600 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-[-50%] right-[-10%] w-[50%] h-[150%] bg-purple-600 blur-[100px] rounded-full"></div>
          </div>
          <div className="relative z-10">
            <p className="text-2xl md:text-3xl font-extrabold text-white italic tracking-tight mb-6">
              "Fokus pada kesederhanaan, hasilkan keunggulan."
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-px bg-slate-700"></div>
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-slate-400">PentaDosen Core Philosophy</span>
              <div className="w-12 h-px bg-slate-700"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};