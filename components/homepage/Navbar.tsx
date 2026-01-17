import React, { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, BookOpen } from 'lucide-react';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onNavigate: (view: 'home' | 'login' | 'register' | 'forgot-password') => void;
  currentView: 'home' | 'login' | 'register' | 'forgot-password';
}

export const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme, onNavigate, currentView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Beranda', href: '#beranda' },
    { name: 'Fitur', href: '#fitur' },
    { name: 'Alur Kerja', href: '#alur' },
    { name: 'Tentang Kami', href: '#tentang' },
    { name: 'Kontak', href: '#kontak' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (currentView !== 'home') {
      e.preventDefault();
      onNavigate('home');
      // Delay scrolling slightly to allow state change and mount
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    e.preventDefault();
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
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
      scrolled 
        ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 py-3 shadow-sm' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform duration-300">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              PentaDosen
              <span className="text-primary-600">.</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className={`text-sm font-medium transition-colors relative group ${
                  currentView === 'home' ? 'text-slate-600 dark:text-neutral-400' : 'text-slate-400 dark:text-neutral-500'
                } hover:text-primary-600 dark:hover:text-white`}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 dark:bg-white transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Auth & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-5">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors text-slate-600 dark:text-neutral-400 group relative"
              aria-label="Toggle theme"
            >
              <div className="transition-transform duration-500 group-hover:rotate-12">
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
              </div>
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-neutral-800 transition-colors"></div>
            <button 
              onClick={() => onNavigate('login')}
              className={`text-sm font-semibold transition-colors ${
                currentView === 'login' || currentView === 'forgot-password' ? 'text-primary-600 dark:text-white' : 'text-slate-600 dark:text-neutral-400'
              } hover:text-slate-900 dark:hover:text-white`}
            >
              Masuk
            </button>
            <button 
              onClick={() => onNavigate('register')}
              className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              Daftar
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-neutral-400"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-neutral-400 bg-slate-100 dark:bg-neutral-900 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-white dark:bg-black border-b border-slate-200 dark:border-neutral-900 transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[600px] py-6 shadow-2xl' : 'max-h-0'}`}>
        <div className="px-6 space-y-4">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block text-lg font-semibold text-slate-700 dark:text-neutral-200 hover:text-primary-600 transition-colors"
              onClick={(e) => handleLinkClick(e, item.href)}
            >
              {item.name}
            </a>
          ))}
          <div className="pt-6 border-t border-slate-100 dark:border-neutral-900 flex flex-col space-y-4">
            <button 
              onClick={() => { onNavigate('login'); setIsOpen(false); }}
              className="w-full text-center py-3 text-lg font-semibold text-slate-600 dark:text-neutral-400 transition-colors"
            >
              Masuk
            </button>
            <button 
              onClick={() => { onNavigate('register'); setIsOpen(false); }}
              className="w-full py-4 bg-primary-600 dark:bg-white text-white dark:text-black rounded-2xl text-center font-bold text-lg transition-colors"
            >
              Daftar Sekarang
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};