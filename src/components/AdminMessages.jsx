import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEnvelope, 
  FaEnvelopeOpen, 
  FaUser, 
  FaCalendar, 
  FaTrash, 
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaCheck,
  FaSignOutAlt,
  FaClock,
  FaShieldAlt
} from 'react-icons/fa';
import { useAdmin } from '../contexts/AdminContext';

const AdminMessages = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [sessionTime, setSessionTime] = useState('');
  
  const { logout, getSessionTimeRemaining, extendSession } = useAdmin();

  // Load messages from localStorage
  useEffect(() => {
    if (isOpen) {
      const savedMessages = localStorage.getItem('portfolioContactMessages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    }
  }, [isOpen]);

  // Session timer
  useEffect(() => {
    const updateSessionTime = () => {
      const remaining = getSessionTimeRemaining();
      const minutes = Math.floor(remaining / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      setSessionTime(`${minutes}:${String(seconds).padStart(2, '0')}`);
      
      // Auto logout when session expires
      if (remaining <= 0) {
        handleLogout();
      }
    };

    if (isOpen) {
      updateSessionTime();
      const timer = setInterval(updateSessionTime, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, getSessionTimeRemaining]);

  // Mark message as read
  const markAsRead = (messageId) => {
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { ...msg, status: 'read' } : msg
    );
    setMessages(updatedMessages);
    localStorage.setItem('portfolioContactMessages', JSON.stringify(updatedMessages));
  };

  // Delete message
  const deleteMessage = (messageId) => {
    const updatedMessages = messages.filter(msg => msg.id !== messageId);
    setMessages(updatedMessages);
    localStorage.setItem('portfolioContactMessages', JSON.stringify(updatedMessages));
    setSelectedMessage(null);
  };

  // Open message details
  const openMessage = (message) => {
    setSelectedMessage(message);
    if (message.status === 'unread') {
      markAsRead(message.id);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    onClose();
  };

  const unreadCount = messages.filter(msg => msg.status === 'unread').length;

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative max-w-6xl w-full bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-cyan-600 to-emerald-600 rounded-full">
              <FaShieldAlt className="text-white text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
                <div className="bg-green-500/20 px-2 py-1 rounded-full border border-green-400/30">
                  <span className="text-green-300 text-xs font-semibold">AUTHENTICATED</span>
                </div>
              </div>
              <p className="text-slate-400">
                {messages.length} messages, {unreadCount} unread
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Session Timer */}
            <div className="bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-600/50 flex items-center gap-2">
              <FaClock className="text-slate-400" />
              <span className="text-slate-300 text-sm font-mono">{sessionTime}</span>
              <button
                onClick={extendSession}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
                title="Extend session"
              >
                +15m
              </button>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="bg-orange-500/20 hover:bg-orange-500/30 backdrop-blur-md p-3 rounded-full border border-orange-400/30 transition-all duration-300 group"
              title="Logout"
            >
              <FaSignOutAlt className="text-orange-300 group-hover:text-orange-200" />
            </button>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="bg-red-500/20 hover:bg-red-500/30 backdrop-blur-md p-3 rounded-full border border-red-400/30 transition-all duration-300 group"
            >
              <FaTimes className="text-red-300 group-hover:text-red-200" />
            </button>
          </div>
        </div>

        <div className="flex h-[70vh]">
          {/* Messages List */}
          <div className="w-1/2 border-r border-slate-700/50 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <FaEnvelope className="text-6xl mb-4 opacity-50" />
                <p>No messages yet</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => openMessage(message)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                      message.status === 'unread'
                        ? 'bg-cyan-900/20 border-cyan-500/30 hover:bg-cyan-900/30'
                        : 'bg-slate-800/50 border-slate-600/30 hover:bg-slate-700/50'
                    } ${selectedMessage?.id === message.id ? 'ring-2 ring-cyan-400' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {message.status === 'unread' ? (
                            <FaEnvelope className="text-cyan-400 text-sm flex-shrink-0" />
                          ) : (
                            <FaEnvelopeOpen className="text-slate-400 text-sm flex-shrink-0" />
                          )}
                          <h4 className={`font-semibold truncate ${
                            message.status === 'unread' ? 'text-white' : 'text-slate-300'
                          }`}>
                            {message.name}
                          </h4>
                        </div>
                        <p className="text-slate-400 text-sm truncate mb-2">{message.email}</p>
                        <p className="text-slate-300 text-sm line-clamp-2">{message.message}</p>
                        <p className="text-slate-500 text-xs mt-2">
                          {new Date(message.timestamp).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {message.status === 'unread' && (
                        <div className="w-3 h-3 bg-cyan-400 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Message Details */}
          <div className="w-1/2 flex flex-col">
            {selectedMessage ? (
              <div className="flex-1 flex flex-col">
                {/* Message Header */}
                <div className="p-6 border-b border-slate-700/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {selectedMessage.name}
                      </h3>
                      <p className="text-cyan-400 mb-1">{selectedMessage.email}</p>
                      <p className="text-slate-400 text-sm">
                        {new Date(selectedMessage.timestamp).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedMessage.status === 'unread'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-slate-600/20 text-slate-300 border border-slate-600/30'
                      }`}>
                        {selectedMessage.status === 'unread' ? 'Unread' : 'Read'}
                      </div>
                      <button
                        onClick={() => deleteMessage(selectedMessage.id)}
                        className="bg-red-500/20 hover:bg-red-500/30 p-2 rounded-full border border-red-400/30 transition-all duration-300 group"
                      >
                        <FaTrash className="text-red-300 group-hover:text-red-200 text-sm" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/30">
                    <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <FaEnvelopeOpen className="text-6xl mx-auto mb-4 opacity-50" />
                  <p>Select a message to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Custom Styles */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </motion.div>
  );
};

export default AdminMessages;