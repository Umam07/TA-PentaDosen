import React from 'react';
import { BookOpen, Instagram, Github, MapPin, Mail, Phone } from 'lucide-react';

interface FooterProps {
  onNavigate?: (view: 'home' | 'login' | 'register' | 'forgot-password') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: 'Beranda', href: '#beranda' },
    { name: 'Fitur', href: '#fitur' },
    { name: 'Alur Kerja', href: '#alur' },
    { name: 'Tentang Kami', href: '#tentang' },
    { name: 'Kontak', href: '#kontak' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      if (onNavigate) {
        onNavigate('home');
      }
      
      e.preventDefault();
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  return (
    <footer id="kontak" className="bg-slate-50 dark:bg-black pt-20 pb-10 border-t border-slate-200 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Column 1: Brand & Socials */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => onNavigate?.('home')}>
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform duration-300">
                <BookOpen className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                PentaDosen
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-neutral-400 max-w-xs leading-relaxed">
              Platform modern pengelolaan kegiatan penelitian dosen FTI yang terstruktur, transparan, dan efisien.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Instagram, href: '#' },
                { icon: Github, href: '#' },
              ].map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-600 dark:hover:text-white dark:hover:border-white transition-all transform hover:scale-110"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">Navigasi</h4>
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-sm font-medium text-slate-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-white transition-colors w-fit group flex items-center"
                >
                  <span className="w-0 h-px bg-primary-600 dark:bg-white transition-all group-hover:w-3 mr-0 group-hover:mr-2"></span>
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 3: Contact Us */}
          <div className="lg:col-span-5 space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">Kontak Kami</h4>
            <div className="space-y-5">
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/5 flex items-center justify-center shrink-0 group-hover:text-primary-600 transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 dark:text-neutral-600 uppercase">Alamat</p>
                  <p className="text-sm text-slate-600 dark:text-neutral-300 leading-relaxed">
                    Menara Yarsi, Jl. Letjen Suprapto No.Kav.13, RT.10/RW.5, Cemp. Putih Tim., Kec. Cemp. Putih, Kota Jakarta Pusat
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/5 flex items-center justify-center shrink-0 group-hover:text-primary-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 dark:text-neutral-600 uppercase">Email</p>
                  <a 
                    href="mailto:fortunateams3@gmail.com" 
                    className="text-sm text-slate-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-white transition-colors block"
                  >
                    fortunateams3@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/5 flex items-center justify-center shrink-0 group-hover:text-primary-600 transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 dark:text-neutral-600 uppercase">Telepon</p>
                  <a 
                    href="tel:0214206674" 
                    className="text-sm text-slate-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-white transition-colors block"
                  >
                    (021) 4206674
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-[11px] font-medium text-slate-400 dark:text-neutral-600 uppercase tracking-widest leading-loose">
              &copy; {currentYear} PentaDosen. All rights reserved. <br className="md:hidden" />
              Fakultas Teknologi Informasi Universitas YARSI.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[10px] font-bold text-slate-400 dark:text-neutral-600 hover:text-slate-900 dark:hover:text-white uppercase tracking-wider transition-colors">Kebijakan Privasi</a>
            <a href="#" className="text-[10px] font-bold text-slate-400 dark:text-neutral-600 hover:text-slate-900 dark:hover:text-white uppercase tracking-wider transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
};