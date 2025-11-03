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

  const hideNavbar = () => setIsNavbarVisible(false);
  const showNavbar = () => setIsNavbarVisible(true);

  return (
    <NavbarContext.Provider value={{ isNavbarVisible, hideNavbar, showNavbar }}>
      {children}
    </NavbarContext.Provider>
  );
};