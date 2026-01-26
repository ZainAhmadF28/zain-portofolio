import React, { createContext, useContext, useState } from 'react';

const NavbarContext = createContext();

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
};

export const NavbarProvider = ({ children }) => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const hideNavbar = () => setIsNavbarVisible(false);
  const showNavbar = () => setIsNavbarVisible(true);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <NavbarContext.Provider value={{
      isNavbarVisible, hideNavbar, showNavbar,
      isMenuOpen, openMenu, closeMenu, toggleMenu, setIsMenuOpen
    }}>
      {children}
    </NavbarContext.Provider>
  );
};