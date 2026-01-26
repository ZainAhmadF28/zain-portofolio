import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useNavbar } from '../contexts/NavbarContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const FloatingThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const { isMenuOpen } = useNavbar();

    if (isMenuOpen) return null;

    return (
        <button
            onClick={toggleTheme}
            className="fixed top-24 left-5 z-[70] p-3 rounded-full bg-slate-200/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-300 dark:border-slate-600 shadow-lg text-yellow-500 dark:text-slate-200 transition-all duration-300 hover:scale-110"
            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
        >
            {theme === 'dark' ? <FaSun className="text-xl" /> : <FaMoon className="text-xl text-slate-800" />}
        </button>
    );
};

export default FloatingThemeToggle;
