import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Squares from './components/Squares';
import { NavbarProvider } from './contexts/NavbarContext';
import { AdminProvider } from './contexts/AdminContext';
import { useTheme } from './contexts/ThemeContext';

// Pages
import Home from './pages/Home';
import Gallery from './pages/Gallery';

function App() {
  const { theme } = useTheme();
  const location = useLocation();

  return (
    <AdminProvider>
      <NavbarProvider>
        <div className="relative min-h-screen dark:bg-[#060010] bg-slate-50 transition-colors duration-500 overflow-hidden">
          {/* Global Background Animation */}
          <div className="fixed inset-0 z-0">
            <Squares
              speed={0.2}
              squareSize={35}
              direction="diagonal"
              borderColor={theme === 'dark' ? "rgba(255, 255, 255, 0.03)" : "rgba(15, 23, 42, 0.05)"}
              hoverFillColor={theme === 'dark' ? "rgba(31, 137, 187, 0.53)" : "rgba(8, 145, 178, 0.1)"}
              gradientColorStart={theme === 'dark' ? "#000428" : "#f1f5f9"}
              gradientColorEnd={theme === 'dark' ? "#002545ff" : "#e2e8f0"}
            />
          </div>

          <Header />

          {/* Page Routing with Transitions */}
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
            </Routes>
          </AnimatePresence>
        </div>
      </NavbarProvider>
    </AdminProvider>
  );
}

export default App;