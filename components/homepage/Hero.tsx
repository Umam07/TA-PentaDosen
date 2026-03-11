import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

interface HeroProps {
  onNavigate: (view: 'home' | 'login' | 'register' | 'forgot-password') => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const fadeDownVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const zoomInVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 40 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut', delay: 0.4 } },
  };

  const scrollToDemo = () => {
    const element = document.getElementById('video-demo');
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-slate-50 dark:bg-[#0A0A0A] font-sans">
      {/* Ambient Glow Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      
      {/* Optional Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTQ4LCAxNjMsIDE4NCwgMC4xKSIvPjwvc3ZnPg==')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none -z-10" />

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Badge */}
        <motion.div variants={fadeDownVariants} className="flex justify-center mb-8">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold tracking-wide shadow-sm">
            ✦ v2.0 - PENTA DOSEN
          </div>
        </motion.div>
        
        {/* Heading */}
        <motion.h1 variants={fadeUpVariants} className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
          Elevasi Riset <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Tanpa Batas.
          </span>
        </motion.h1>
        
        {/* Sub-heading */}
        <motion.p variants={fadeUpVariants} className="max-w-2xl mx-auto text-lg text-slate-500 dark:text-neutral-400 mb-10 leading-relaxed">
          Transformasi digital pengelolaan penelitian untuk Dosen FTI. Efisien, terstruktur, dan siap mendukung publikasi kelas dunia.
        </motion.p>

        {/* Call to Action Buttons */}
        <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => onNavigate('login')}
            className="group px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-base transition-all hover:shadow-lg hover:shadow-indigo-600/25 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <span>Mulai Sekarang</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button 
            onClick={scrollToDemo}
            className="group px-8 py-4 bg-transparent border border-slate-200 dark:border-white/10 hover:border-indigo-600 dark:hover:border-indigo-400 text-slate-700 dark:text-neutral-300 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 active:scale-[0.98] hover:bg-slate-50 dark:hover:bg-white/5"
          >
            <Play className="w-4 h-4 text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
            <span>Lihat Demo</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Video Mockup */}
      <motion.div 
        id="video-demo" 
        variants={zoomInVariants}
        initial="hidden"
        animate="visible"
        className="mt-20 max-w-5xl mx-auto px-4 sm:px-6 relative z-10"
      >
        <div className="relative rounded-3xl shadow-2xl shadow-indigo-500/20 border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden">
          {/* macOS Browser Header */}
          <div className="h-12 bg-slate-200/80 dark:bg-neutral-800/80 backdrop-blur-sm border-b border-slate-300 dark:border-neutral-700 flex items-center px-5">
            <div className="flex space-x-2.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            </div>
          </div>

          {/* Video Container */}
          <div className="aspect-[16/9] bg-slate-900 relative w-full h-full">
            {!isPlaying ? (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900 to-slate-900 cursor-pointer group"
                onClick={() => setIsPlaying(true)}
              >
                {/* Custom Thumbnail Background Decor */}
                <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xKSIvPjwvc3ZnPg==')]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/30 blur-2xl rounded-full group-hover:bg-indigo-500/40 transition-colors"></div>
                
                {/* Play Button */}
                <div className="relative z-10 w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <div className="absolute inset-0 rounded-full border border-indigo-400/50 animate-ping"></div>
                  <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                </div>
              </div>
            ) : (
              <iframe 
                className="w-full h-full absolute inset-0"
                src="https://www.youtube.com/embed/gCMfMIjrWqE?autoplay=1&rel=0&showinfo=0&modestbranding=1" 
                title="PentaDosen Product Demo"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};