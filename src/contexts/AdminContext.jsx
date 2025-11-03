import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// Admin credentials (In production, this should be handled by a backend)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'zain2024@admin', // Strong password for admin
  sessionDuration: 30 * 60 * 1000 // 30 minutes in milliseconds
};

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(null);

  // Check for existing session on load
  useEffect(() => {
    const checkSession = () => {
      const sessionData = localStorage.getItem('adminSession');
      if (sessionData) {
        try {
          const { timestamp, authenticated } = JSON.parse(sessionData);
          const now = new Date().getTime();
          
          // Check if session is still valid (30 minutes)
          if (authenticated && (now - timestamp) < ADMIN_CREDENTIALS.sessionDuration) {
            setIsAuthenticated(true);
          } else {
            // Session expired, remove it
            localStorage.removeItem('adminSession');
            setIsAuthenticated(false);
          }
        } catch (error) {
          localStorage.removeItem('adminSession');
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  // Auto logout after session expires
  useEffect(() => {
    if (isAuthenticated) {
      const sessionTimer = setInterval(() => {
        const sessionData = localStorage.getItem('adminSession');
        if (sessionData) {
          const { timestamp } = JSON.parse(sessionData);
          const now = new Date().getTime();
          
          if ((now - timestamp) >= ADMIN_CREDENTIALS.sessionDuration) {
            logout();
          }
        }
      }, 60000); // Check every minute

      return () => clearInterval(sessionTimer);
    }
  }, [isAuthenticated]);

  // Login function
  const login = async (username, password) => {
    // Check if account is locked
    if (lockoutTime && new Date().getTime() < lockoutTime) {
      const remainingTime = Math.ceil((lockoutTime - new Date().getTime()) / 1000 / 60);
      throw new Error(`Account terkunci. Coba lagi dalam ${remainingTime} menit.`);
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Successful login
      const sessionData = {
        authenticated: true,
        timestamp: new Date().getTime(),
        username: username
      };
      
      localStorage.setItem('adminSession', JSON.stringify(sessionData));
      setIsAuthenticated(true);
      setLoginAttempts(0);
      setLockoutTime(null);
      return true;
    } else {
      // Failed login
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      // Lock account after 3 failed attempts for 15 minutes
      if (newAttempts >= 3) {
        const lockTime = new Date().getTime() + (15 * 60 * 1000); // 15 minutes
        setLockoutTime(lockTime);
        throw new Error('Terlalu banyak percobaan login yang gagal. Account terkunci selama 15 menit.');
      }

      throw new Error(`Username atau password salah. Sisa percobaan: ${3 - newAttempts}`);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('adminSession');
    setIsAuthenticated(false);
    setLoginAttempts(0);
    setLockoutTime(null);
  };

  // Extend session
  const extendSession = () => {
    if (isAuthenticated) {
      const sessionData = {
        authenticated: true,
        timestamp: new Date().getTime(),
        username: ADMIN_CREDENTIALS.username
      };
      localStorage.setItem('adminSession', JSON.stringify(sessionData));
    }
  };

  // Get remaining session time
  const getSessionTimeRemaining = () => {
    const sessionData = localStorage.getItem('adminSession');
    if (sessionData && isAuthenticated) {
      const { timestamp } = JSON.parse(sessionData);
      const elapsed = new Date().getTime() - timestamp;
      const remaining = ADMIN_CREDENTIALS.sessionDuration - elapsed;
      return Math.max(0, remaining);
    }
    return 0;
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    extendSession,
    getSessionTimeRemaining,
    loginAttempts,
    lockoutTime
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};