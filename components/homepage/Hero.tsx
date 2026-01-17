import React from 'react';
import { ArrowRight, PlayCircle, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-52 md:pb-32 overflow-hidden bg-white dark:bg-black">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-primary-600/10 via-transparent to-transparent pointer-events-none -z-10 dark:from-primary-900/10 opacity-0 animate-fade-in"></div>
      <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 -left-20 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center space-x-2 bg-slate-900 dark:bg-white px-5 py-2 rounded-full mb-10 shadow-2xl shadow-slate-900/20 group cursor-pointer hover:scale-105 transition-transform duration-300 opacity-0 animate-slide-up [animation-fill-mode:forwards]">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
          </span>
          <span className="text-xs font-bold text-white dark:text-black uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            V2.1 · Penta Dosen
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 dark:text-white mb-8 leading-[0.95] md:leading-[0.9] opacity-0 animate-cinematic-in [animation-delay:150ms] [animation-fill-mode:forwards]">
          Elevasi Riset <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500 dark:from-primary-400 dark:to-blue-300">
            Tanpa Batas.
          </span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 dark:text-neutral-400 mb-12 leading-relaxed font-medium opacity-0 animate-slide-up [animation-delay:400ms] [animation-fill-mode:forwards]">
          Transformasi digital pengelolaan penelitian untuk Dosen FTI. Efisien, terstruktur, dan siap mendukung publikasi kelas dunia.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 opacity-0 animate-slide-up [animation-delay:650ms] [animation-fill-mode:forwards]">
          <button className="group px-10 py-5 bg-primary-600 hover:bg-primary-700 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-white rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-primary-500/40 dark:shadow-white/5 flex items-center space-x-3 active:scale-[0.97] hover:-translate-y-1">
            <span>Mulai Sekarang</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="group px-10 py-5 bg-white dark:bg-neutral-900/50 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-neutral-900 transition-all flex items-center space-x-3 active:scale-[0.97] hover:-translate-y-1">
            <PlayCircle className="w-5 h-5 text-primary-600" />
            <span>Lihat Demo</span>
          </button>
        </div>
      </div>

      {/* Product Showcase - Cinematic Container */}
      <div className="mt-32 relative max-w-6xl mx-auto px-4 opacity-0 animate-cinematic-in [animation-delay:900ms] [animation-fill-mode:forwards]">
        <div className="relative bg-white dark:bg-neutral-900/50 rounded-[3.5rem] p-4 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 group overflow-hidden transition-all duration-1000">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          <div className="aspect-[16/9] bg-slate-50 dark:bg-black rounded-[2.8rem] relative overflow-hidden border dark:border-white/10">
            {/* Browser Header Decor */}
             <div className="absolute top-0 left-0 right-0 h-10 bg-slate-100/50 dark:bg-neutral-800/50 backdrop-blur-md flex items-center px-6 z-10 border-b dark:border-white/5">
               <div className="flex space-x-2">
                 <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
                 <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                 <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
               </div>
               <div className="mx-auto bg-white/50 dark:bg-black/50 px-4 py-1 rounded-md text-[10px] text-slate-400 font-medium tracking-tight border dark:border-white/5">
                 pentadosen.fti.yarsi.ac.id
               </div>
             </div>
             
             {/* YouTube Iframe */}
             <div className="w-full h-full pt-10">
               <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/g6VjrAXKF9w?rel=0&showinfo=0&modestbranding=1" 
                title="PentaDosen Product Demo"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
               ></iframe>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};