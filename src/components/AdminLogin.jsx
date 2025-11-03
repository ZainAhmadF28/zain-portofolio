import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaLock, 
  FaUser, 
  FaEye, 
  FaEyeSlash, 
  FaShieldAlt,
  FaTimes,
  FaExclamationTriangle,
  FaClock
} from 'react-icons/fa';
import { useAdmin } from '../contexts/AdminContext';

const AdminLogin = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [lockoutTimer, setLockoutTimer] = useState(0);

  const { login, loginAttempts, lockoutTime } = useAdmin();

  // Handle lockout timer
  useEffect(() => {
    if (lockoutTime) {
      const updateTimer = () => {
        const remaining = Math.max(0, Math.ceil((lockoutTime - new Date().getTime()) / 1000));
        setLockoutTimer(remaining);
        
        if (remaining <= 0) {
          setLockoutTimer(0);
          setError('');
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await login(formData.username, formData.password);
      setFormData({ username: '', password: '' });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ username: '', password: '' });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  const isLocked = lockoutTime && new Date().getTime() < lockoutTime;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative max-w-md w-full bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-8 text-center">
          <div className="absolute top-4 right-4">
            <button 
              onClick={handleClose}
              className="bg-red-500/20 hover:bg-red-500/30 backdrop-blur-md p-2 rounded-full border border-red-400/30 transition-all duration-300 group"
            >
              <FaTimes className="text-red-300 group-hover:text-red-200 text-sm" />
            </button>
          </div>

          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-cyan-600 to-emerald-600 rounded-full">
              <FaShieldAlt className="text-white text-3xl" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Admin Login</h2>
          <p className="text-slate-400">Enter your credentials to access admin panel</p>
        </div>

        {/* Login Form */}
        <div className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="group">
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  disabled={isLocked}
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors duration-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  disabled={isLocked}
                  className="w-full pl-12 pr-12 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLocked}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors duration-300 disabled:opacity-50"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 flex items-center gap-3"
                >
                  <FaExclamationTriangle className="text-red-400 flex-shrink-0" />
                  <p className="text-red-300 text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Lockout Timer */}
            <AnimatePresence>
              {lockoutTimer > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-orange-500/20 border border-orange-400/30 rounded-xl p-4 flex items-center gap-3"
                >
                  <FaClock className="text-orange-400 flex-shrink-0" />
                  <div className="text-orange-300 text-sm">
                    <p>Account terkunci</p>
                    <p className="font-mono">
                      {Math.floor(lockoutTimer / 60)}:{String(lockoutTimer % 60).padStart(2, '0')}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Attempts Warning */}
            {loginAttempts > 0 && loginAttempts < 3 && !isLocked && (
              <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-xl p-3">
                <p className="text-yellow-300 text-sm text-center">
                  Login attempts: {loginAttempts}/3
                </p>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting || isLocked}
              whileHover={{ scale: isSubmitting || isLocked ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting || isLocked ? 1 : 0.98 }}
              className="w-full bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isLocked ? (
                <>
                  <FaLock />
                  <span>Account Locked</span>
                </>
              ) : (
                <>
                  <FaShieldAlt />
                  <span>Login as Admin</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
            <p className="text-slate-400 text-xs text-center">
              🔒 Secure admin access - Sessions expire after 30 minutes
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminLogin;