import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaShieldAlt, FaSun, FaMoon } from 'react-icons/fa';
import bangzenLogo from '../assets/images/BGZENBGIJObulat.png';
import { useNavbar } from '../contexts/NavbarContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAdmin } from '../contexts/AdminContext';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const CLIP_PATH =
  'polygon(0 0, 100% 0, 100% 85%, 68% 85%, 64% 100%, 36% 100%, 32% 85%, 0 85%)';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  const { isNavbarVisible, hideNavbar, showNavbar } = useNavbar();
  const { isAuthenticated, logout } = useAdmin();
  const { theme, toggleTheme } = useTheme();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to hash on location change if on home
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else if (location.pathname === '/' && !location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const handleAdminAccess = () => {
    if (isAuthenticated) {
      setShowAdminDashboard(true);
      hideNavbar();
    } else {
      setShowAdminLogin(true);
      hideNavbar();
    }
  };

  const handleLoginSuccess = () => {
    setShowAdminLogin(false);
    setShowAdminDashboard(true);
    hideNavbar();
  };

  const handleAdminLogout = () => {
    logout();
    setShowAdminDashboard(false);
    showNavbar();
  };

  const handleCloseAdminDashboard = () => {
    setShowAdminDashboard(false);
    showNavbar();
  };

  const handleCloseAdminLogin = () => {
    setShowAdminLogin(false);
    showNavbar();
  };

  // Improved Navigation Handler
  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (href.startsWith('#')) {
      if (location.pathname === '/') {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          // Update URL hash without reload
          window.history.pushState(null, '', href);
        }
      } else {
        navigate('/' + href);
      }
    } else {
      navigate(href);
    }
  };

  const NavLink = ({ href, children, isGallery }) => {
    // Check active state
    const isActive = isGallery
      ? location.pathname === '/gallery'
      : location.pathname === '/' && location.hash === href;

    return (
      <li>
        <a
          href={href}
          onClick={(e) => handleNavClick(e, href)}
          className={`relative block dark:text-white text-slate-700 font-[Rubik] font-bold text-base tracking-wider py-2 transition-transform duration-300 hover:scale-110 group ${isActive ? 'text-cyan-500 dark:text-cyan-400' : ''}`}
        >
          {children}
          <span className={`absolute bottom-1 left-0 block h-[2px] w-0 dark:bg-[#00ffdc] bg-cyan-600 transition-all duration-500 group-hover:w-full ${isActive ? 'w-full' : ''}`}></span>
        </a>
      </li>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isNavbarVisible && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 w-full z-50 pointer-events-none"
          >
            {/* Drop Shadow Gradient Animated */}
            {theme === 'dark' ? (
              <div
                className="pointer-events-none absolute left-0 right-0 z-10 transition-opacity duration-500"
                style={{
                  top: '0',
                  height: '85px',
                  WebkitClipPath: isMenuOpen ? 'none' : CLIP_PATH,
                  clipPath: isMenuOpen ? 'none' : CLIP_PATH,
                  background: 'linear-gradient(90deg, #00fff0, #00ffdc, #4079ff, #40ffaa, #00fff0)',
                  backgroundSize: '300% 100%',
                  animation: 'gradientShadowMove 6s linear infinite',
                  opacity: isScrolled ? 0 : 1,
                  filter: 'drop-shadow(0 16px 24px rgba(64,255,170,0.35))',
                }}
              ></div>
            ) : (
              <div
                className="pointer-events-none absolute left-0 right-0 z-10 transition-opacity duration-500"
                style={{
                  top: '0',
                  height: '100px',
                  WebkitClipPath: isMenuOpen ? 'none' : CLIP_PATH,
                  clipPath: isMenuOpen ? 'none' : CLIP_PATH,
                  background: 'linear-gradient(90deg, #0891b2, #06b6d4, #0891b2, #06b6d4, #0891b2)',
                  backgroundSize: '300% 100%',
                  animation: 'gradientShadowMove 6s linear infinite',
                  opacity: isScrolled ? 0 : 1,
                  filter: 'drop-shadow(0 8px 16px rgba(8,145,178,0.25))',
                }}
              ></div>
            )}

            {/* Navbar */}
            <header
              style={{
                WebkitClipPath: isMenuOpen ? 'none' : CLIP_PATH,
                clipPath: isMenuOpen ? 'none' : CLIP_PATH,
              }}
              className={`pt-3 ${isMenuOpen ? 'pb-0' : 'pb-5'} relative z-20 pointer-events-auto transition-all duration-300
                ${isMenuOpen
                  ? "dark:bg-[#11142F]/80 bg-white/80 backdrop-blur-xl border-b dark:border-white/10 border-slate-200/50 shadow-lg"
                  : isScrolled
                    ? "dark:bg-[#11142F]/90 bg-white/85 backdrop-blur-md border-b dark:border-white/10 border-slate-200 shadow-sm"
                    : "dark:bg-[#11142F] bg-white"
                }`}
            >
              {/* =========== REFACTORED NAVIGATION =========== */}
              <nav className="container mx-auto flex items-center justify-between flex-wrap pb-0 px-1">

                {/* --- MOBILE HEADER --- */}
                <div className="w-full flex items-center justify-between md:hidden">
                  {/* Mobile: Brand Logo & Text (Left) */}
                  <a href="/" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center gap-3">
                    <img src={bangzenLogo} alt="Bangzen Logo" className="h-12 w-12 flex-shrink-0" />
                    <div>
                      <h1 className="font-moderniz text-sm dark:text-[#00ffdc] text-slate-800 whitespace-nowrap">Zain Ahmad Fahrezi</h1>
                      <p className="font-moderniz text-[9px] dark:text-[#00ffdc] text-slate-600" style={{ textShadow: 'none' }}>
                        Let's see the awesome Experience
                      </p>
                    </div>
                  </a>
                  {/* Mobile: Hamburger Button (Right) */}
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="dark:text-[#00ffdc] text-slate-800 text-3xl pointer-events-auto">
                    &#9776;
                  </button>
                </div>

                {/* --- DESKTOP HEADER --- */}
                <div className="hidden w-full md:flex items-center justify-around">
                  {/* Desktop: Left Navigation */}
                  <ul className="flex items-center list-none gap-x-12 lg:gap-x-20">
                    <NavLink href="#home">Home</NavLink>
                    <NavLink href="#projects">Project</NavLink>
                    <NavLink href="/gallery" isGallery>Gallery</NavLink>
                  </ul>

                  {/* Desktop: Center Logo & Text */}
                  <a href="/" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center gap-3">
                    <img src={bangzenLogo} alt="Bangzen Logo" className="h-12 w-12" />
                    <div className="block">
                      <h1 className="font-moderniz text-base dark:text-[#00ffdc] text-slate-800">Zain Ahmad Fahrezi</h1>
                      <p className="font-moderniz text-[10px] dark:text-[#00ffdc] text-slate-600" style={{ textShadow: 'none' }}>
                        Let's see the awesome Experience
                      </p>
                    </div>
                  </a>

                  {/* Desktop: Right Navigation & Admin Button */}
                  <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
                    <button
                      onClick={toggleTheme}
                      className="p-2 rounded-full dark:bg-slate-800/50 bg-slate-200/50 hover:bg-slate-300/50 dark:hover:bg-slate-700/50 text-yellow-500 dark:text-slate-400 dark:hover:text-white transition-all duration-300 pointer-events-auto border dark:border-slate-700/30 border-slate-300"
                      title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                      {theme === 'dark' ? <FaSun className="text-lg" /> : <FaMoon className="text-lg text-slate-800" />}
                    </button>

                    <ul className="flex items-center list-none gap-10 lg:gap-16">
                      <NavLink href="#about">About</NavLink>
                      <NavLink href="#contact">Contact</NavLink>
                    </ul>
                    <button
                      onClick={handleAdminAccess}
                      className="flex items-center gap-2 dark:text-slate-400 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-300 pointer-events-auto"
                      title={isAuthenticated ? "Admin Dashboard" : "Admin Login"}
                    >
                      <FaShieldAlt className={`text-lg ${isAuthenticated ? 'text-green-500' : 'currentColor'}`} />
                    </button>
                  </div>
                </div>

                {/* --- MOBILE DROPDOWN MENU --- */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="w-full basis-full md:hidden"
                    >
                      {/* Navigation Links + Theme Toggle */}
                      <div className="flex flex-row flex-wrap justify-center items-center gap-x-6 gap-y-2 mt-2 mb-2">
                        <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="relative dark:text-white text-slate-700 font-[Rubik] font-bold text-base tracking-wider transition-transform duration-300 hover:scale-110">Home</a>
                        <a href="#projects" onClick={(e) => handleNavClick(e, '#projects')} className="relative dark:text-white text-slate-700 font-[Rubik] font-bold text-base tracking-wider transition-transform duration-300 hover:scale-110">Project</a>
                        <a href="/gallery" onClick={(e) => handleNavClick(e, '/gallery')} className="relative dark:text-white text-slate-700 font-[Rubik] font-bold text-base tracking-wider transition-transform duration-300 hover:scale-110 text-cyan-500">Gallery</a>
                        <a href="#about" onClick={(e) => handleNavClick(e, '#about')} className="relative dark:text-white text-slate-700 font-[Rubik] font-bold text-base tracking-wider transition-transform duration-300 hover:scale-110">About</a>
                        <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="relative dark:text-white text-slate-700 font-[Rubik] font-bold text-base tracking-wider transition-transform duration-300 hover:scale-110">Contact</a>
                        <button
                          onClick={toggleTheme}
                          className="p-2 rounded-full dark:bg-slate-800/50 bg-slate-200/50 hover:bg-slate-300/50 dark:hover:bg-slate-700/50 text-yellow-500 dark:text-slate-400 dark:hover:text-white transition-all duration-300 border dark:border-slate-700/30 border-slate-300"
                          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                          {theme === 'dark' ? <FaSun className="text-lg" /> : <FaMoon className="text-lg text-slate-800" />}
                        </button>
                      </div>

                      {/* Admin Button - Separate Row */}
                      <div className="flex justify-center mt-2 mb-2">
                        <button
                          onClick={handleAdminAccess}
                          className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors duration-300"
                        >
                          <FaShieldAlt className={`text-lg ${isAuthenticated ? 'text-green-500' : 'currentColor'}`} />
                          <span className="dark:text-slate-400 text-slate-600">Admin</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </nav>
            </header>
          </motion.div>
        )}
      </AnimatePresence >

      {/* Admin Login Modal */}
      <AdminLogin
        isOpen={showAdminLogin}
        onClose={handleCloseAdminLogin}
        onSuccess={handleLoginSuccess}
      />

      {/* UNIFIED Admin Dashboard */}
      <AdminDashboard
        isOpen={showAdminDashboard}
        onClose={handleCloseAdminDashboard}
      />

      {/* Animasi gradient keyframes */}
      <style>
        {`
          @keyframes gradientShadowMove {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }

          html {
            scroll-behavior: smooth;
          }
        `}
      </style>
    </>
  );
};

export default Header;
