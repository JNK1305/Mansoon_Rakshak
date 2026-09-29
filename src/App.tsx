import React, { useState, useEffect } from 'react';
import { Navbar, PageId } from './components/layout/Navbar';
import { Banner } from './components/layout/Banner';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './pages/HeroSection';
import { DashboardPage } from './pages/DashboardPage';
import { ModelComparisonPage } from './pages/ModelComparisonPage';
import { WeatherRegimesPage } from './pages/WeatherRegimesPage';
import { HeavyRainProbPage } from './pages/HeavyRainProbPage';
import { VerificationPage } from './pages/VerificationPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { LimitationsPage } from './pages/LimitationsPage';
import { WeatherDataService } from './services/dataService';
import { RegimeType } from './types/weather';

import { OperationalTicker } from './components/common/OperationalTicker';
import { JudgePitchModal } from './components/common/JudgePitchModal';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('landing');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [currentRegime, setCurrentRegime] = useState<RegimeType>('Active');
  const [anomalySigma, setAnomalySigma] = useState<number>(1.45);
  const [isPitchOpen, setIsPitchOpen] = useState<boolean>(false);

  // Synchronize dark mode class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  // Load initial synoptic regime indicator
  useEffect(() => {
    WeatherDataService.getMonsoonCalendar().then((calendar) => {
      if (calendar && calendar.length > 0) {
        // Pick an active or depression day as default status
        const activeDay = calendar[4] || calendar[0];
        setCurrentRegime(activeDay.regime);
        setAnomalySigma(activeDay.coreZoneAnomaly);
      }
    });
  }, []);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1220] text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Persistent Disclaimer Banner */}
      <Banner onOpenLimitations={() => handleNavigate('limitations')} />

      {/* Live Operational Ticker Bar */}
      <OperationalTicker currentRegime={currentRegime} anomalySigma={anomalySigma} />

      {/* Sticky Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        currentRegime={currentRegime}
        anomalySigma={anomalySigma}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        onOpenPitch={() => setIsPitchOpen(true)}
      />

      {/* SIH Judge 30-Second Executive Pitch Modal */}
      <JudgePitchModal
        isOpen={isPitchOpen}
        onClose={() => setIsPitchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {currentPage === 'landing' && <HeroSection onNavigate={handleNavigate} />}
        {currentPage === 'dashboard' && (
          <DashboardPage
            onNavigateToRegimes={() => handleNavigate('regimes')}
            onNavigateToComparison={() => handleNavigate('model-comparison')}
          />
        )}
        {currentPage === 'model-comparison' && <ModelComparisonPage />}
        {currentPage === 'regimes' && <WeatherRegimesPage />}
        {currentPage === 'heavy-rain-prob' && <HeavyRainProbPage />}
        {currentPage === 'verification' && <VerificationPage />}
        {currentPage === 'methodology' && <MethodologyPage />}
        {currentPage === 'limitations' && <LimitationsPage />}
      </main>

      {/* Citations & Project Footer */}
      <Footer />
    </div>
  );
}

export default App;
