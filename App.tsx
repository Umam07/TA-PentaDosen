
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Workflow } from './components/Workflow';
import { Team } from './components/Team';
import { Footer } from './components/Footer';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ForgotPassword } from './components/ForgotPassword';

declare global {
  interface Window {
    initReveal: () => void;
  }
}

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [view, setView] = useState<'home' | 'login' | 'register' | 'forgot-password'>('home');

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const navigateTo = (newView: 'home' | 'login' | 'register' | 'forgot-password') => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-black', 'text-white');
      document.body.classList.remove('bg-white', 'text-slate-900');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-black', 'text-white');
      document.body.classList.add('bg-white', 'text-slate-900');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.initReveal) window.initReveal();
    }, 100);
    return () => clearTimeout(timer);
  }, [view]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary-100 dark:selection:bg-primary-900/30 transition-colors duration-500">
      <Navbar 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        onNavigate={navigateTo} 
        currentView={view}
      />
      
      <main className="flex-grow">
        {view === 'home' && (
          <div className="scroll-smooth">
            <section id="beranda">
              <Hero />
            </section>
            <Features />
            <Workflow />
            <Team />
          </div>
        )}
        {view === 'login' && (
          <Login 
            onBack={() => navigateTo('home')} 
            onRegister={() => navigateTo('register')}
            onForgotPassword={() => navigateTo('forgot-password')}
          />
        )}
        {view === 'register' && (
          <Register 
            onBack={() => navigateTo('home')} 
            onLogin={() => navigateTo('login')}
          />
        )}
        {view === 'forgot-password' && (
          <ForgotPassword 
            onBackToLogin={() => navigateTo('login')}
          />
        )}
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
};

export default App;
