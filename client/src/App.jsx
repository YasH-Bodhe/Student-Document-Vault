import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import VerificationPage from './pages/VerificationPage';
import CertificateDetailPage from './pages/CertificateDetailPage';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <WalletProvider>
      <div className={isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}>
        <BrowserRouter>
          <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          <main className="min-h-screen transition-colors duration-300">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/verify" element={<VerificationPage />} />
              <Route path="/certificate/:certificateId" element={<CertificateDetailPage />} />
            </Routes>
          </main>
        </BrowserRouter>
      </div>
    </WalletProvider>
  );
}

export default App;
