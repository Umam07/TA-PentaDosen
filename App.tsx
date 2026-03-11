import React, { useState, useEffect } from 'react';
import { Navbar } from './components/homepage/Navbar';
import { Hero } from '././components/homepage/Hero';
import { Features } from './components/homepage/Features';
import { Workflow } from './components/homepage/Workflow';
import { Team } from './components/homepage/Team';
import { Footer } from './components/homepage/Footer';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { VerifyOTP } from './pages/VerifyOTP';
import { ResetPassword } from './pages/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { Calendar } from './pages/Calendar';
import { Penelitian } from './pages/Penelitian';
import { Publikasi } from './pages/Publikasi';
import { HKI } from './pages/HKI';
import { SumberDaya } from './pages/SumberDaya';
import { ManajemenPengguna } from './pages/ManajemenPengguna';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';
import { Info } from 'lucide-react';
import { EventProvider } from './context/EventContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AppLayout } from './components/layout/AppLayout';

declare global {
  interface Window {
    initReveal: () => void;
  }
}

export type ViewType = 'home' | 'login' | 'register' | 'forgot-password' | 'verify-otp' | 'reset-password' | 'dashboard' | 'privacy-policy' | 'terms-conditions';

const AppContent: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [view, setView] = useState<ViewType>('home');
  const [activeTab, setActiveTab] = useState('Dashboard');

  const navigateTo = (newView: ViewType) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.initReveal) window.initReveal();
    }, 100);
    return () => clearTimeout(timer);
  }, [view]);

  const isAuthView = view === 'dashboard';

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary-100 dark:selection:bg-primary-900/30 transition-colors duration-500">
      {!isAuthView && (
        <Navbar 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
          onNavigate={navigateTo} 
          currentView={view}
        />
      )}
      
      <main className="flex-grow">
        {view === 'home' && (
          <div className="scroll-smooth">
            <section id="beranda">
              <Hero onNavigate={navigateTo} />
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
            onSuccess={() => navigateTo('dashboard')}
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
            onSuccess={() => navigateTo('verify-otp')}
          />
        )}
        {view === 'verify-otp' && (
          <VerifyOTP 
            onBackToLogin={() => navigateTo('login')}
            onSuccess={() => navigateTo('reset-password')}
          />
        )}
        {view === 'reset-password' && (
          <ResetPassword 
            onSuccess={() => navigateTo('login')}
          />
        )}
        {view === 'privacy-policy' && (
          <PrivacyPolicy onBack={() => navigateTo('home')} />
        )}
        {view === 'terms-conditions' && (
          <TermsConditions onBack={() => navigateTo('home')} />
        )}
        {view === 'dashboard' && (
          <AppLayout 
            onLogout={() => navigateTo('home')}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          >
            {activeTab === 'Dashboard' && <Dashboard />}
            {activeTab === 'Kalender' && <Calendar />}
            {activeTab === 'Penelitian' && <Penelitian />}
            {activeTab === 'Publikasi' && <Publikasi />}
            {activeTab === 'HKI' && <HKI />}
            {activeTab === 'Sumber Daya' && <SumberDaya />}
            {activeTab === 'Manajemen Pengguna' && <ManajemenPengguna />}
            {activeTab !== 'Dashboard' && activeTab !== 'Kalender' && activeTab !== 'Penelitian' && activeTab !== 'Publikasi' && activeTab !== 'HKI' && activeTab !== 'Sumber Daya' && activeTab !== 'Manajemen Pengguna' && (
              <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-[2rem] flex items-center justify-center text-primary-600 mb-6">
                  <Info className="w-10 h-10" />
                </div>
                <h2 className="text-xl font-bold dark:text-white">Bagian {activeTab}</h2>
                <p className="text-slate-500 dark:text-neutral-400 mt-2">Konten untuk modul ini sedang dalam pengembangan.</p>
              </div>
            )}
          </AppLayout>
        )}
      </main>

      {!isAuthView && <Footer onNavigate={navigateTo} currentView={view} />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <EventProvider>
        <AppContent />
      </EventProvider>
    </ThemeProvider>
  );
};

export default App;