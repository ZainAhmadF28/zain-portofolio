import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaComment,
  FaComments,
  FaUser, 
  FaCalendar, 
  FaTrash, 
  FaThumbsUp,
  FaTimes,
  FaSignOutAlt,
  FaClock,
  FaShieldAlt,
  FaEdit,
  FaCheck,
  FaPlus
} from 'react-icons/fa';
import { useAdmin } from '../contexts/AdminContext';

const AdminComments = ({ isOpen, onClose }) => {
  const [comments, setComments] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null);
  const [sessionTime, setSessionTime] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [newComment, setNewComment] = useState({
    name: '',
    message: ''
  });
  
  const { logout, getSessionTimeRemaining, extendSession } = useAdmin();

  // Load comments from localStorage and fallback to JSON
  useEffect(() => {
    const loadComments = async () => {
      try {
        // First try localStorage
        const savedComments = localStorage.getItem('portfolioComments');
        if (savedComments) {
          setComments(JSON.parse(savedComments));
        } else {
          // Fallback to JSON file
          const response = await fetch('/comments.json');
          if (response.ok) {
            const data = await response.json();
            setComments(data);
            // Save to localStorage for future use
            localStorage.setItem('portfolioComments', JSON.stringify(data));
          }
        }
      } catch (error) {
        console.error('Error loading comments:', error);
        setComments([]);
      }
    };

    if (isOpen) {
      loadComments();
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

  // Save comments to localStorage
  const saveComments = (updatedComments) => {
    setComments(updatedComments);
    localStorage.setItem('portfolioComments', JSON.stringify(updatedComments));
  };

  // Delete comment
  const deleteComment = (commentId) => {
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    saveComments(updatedComments);
    setSelectedComment(null);
  };

  // Edit comment
  const startEdit = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.message);
  };

  const saveEdit = () => {
    const updatedComments = comments.map(comment =>
      comment.id === editingComment 
        ? { ...comment, message: editText, edited: true }
        : comment
    );
    saveComments(updatedComments);
    setEditingComment(null);
    setEditText('');
    
    // Update selected comment if it's the one being edited
    if (selectedComment && selectedComment.id === editingComment) {
      setSelectedComment({ ...selectedComment, message: editText, edited: true });
    }
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditText('');
  };

  // Add new comment
  const addComment = () => {
    if (!newComment.name.trim() || !newComment.message.trim()) return;

    const comment = {
      id: Date.now(),
      name: newComment.name.trim(),
      message: newComment.message.trim(),
      photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(newComment.name)}&background=random&color=ffffff&size=100`,
      timestamp: new Date().toISOString(),
      likes: 0
    };

    const updatedComments = [comment, ...comments];
    saveComments(updatedComments);
    setNewComment({ name: '', message: '' });
    setIsAddingComment(false);
  };

  // Update likes
  const updateLikes = (commentId, increment) => {
    const updatedComments = comments.map(comment =>
      comment.id === commentId 
        ? { ...comment, likes: Math.max(0, comment.likes + increment) }
        : comment
    );
    saveComments(updatedComments);
    
    // Update selected comment if it's the one being updated
    if (selectedComment && selectedComment.id === commentId) {
      setSelectedComment({ 
        ...selectedComment, 
        likes: Math.max(0, selectedComment.likes + increment) 
      });
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    onClose();
  };

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
            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
              <FaComments className="text-white text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-white">Comments Manager</h2>
                <div className="bg-green-500/20 px-2 py-1 rounded-full border border-green-400/30">
                  <span className="text-green-300 text-xs font-semibold">AUTHENTICATED</span>
                </div>
              </div>
              <p className="text-slate-400">
                {comments.length} total comments
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Add Comment Button */}
            <button
              onClick={() => setIsAddingComment(true)}
              className="bg-green-500/20 hover:bg-green-500/30 backdrop-blur-md px-4 py-2 rounded-full border border-green-400/30 transition-all duration-300 group flex items-center gap-2"
            >
              <FaPlus className="text-green-300 group-hover:text-green-200 text-sm" />
              <span className="text-green-300 group-hover:text-green-200 text-sm">Add Comment</span>
            </button>

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
          {/* Comments List */}
          <div className="w-1/2 border-r border-slate-700/50 overflow-y-auto">
            {comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <FaComment className="text-6xl mb-4 opacity-50" />
                <p>No comments yet</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedComment(comment)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border bg-slate-800/50 border-slate-600/30 hover:bg-slate-700/50 ${
                      selectedComment?.id === comment.id ? 'ring-2 ring-purple-400' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={comment.photo}
                        alt={comment.name}
                        className="w-10 h-10 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white truncate">
                            {comment.name}
                          </h4>
                          {comment.edited && (
                            <span className="text-xs text-slate-400">(edited)</span>
                          )}
                        </div>
                        <p className="text-slate-300 text-sm line-clamp-2 mb-2">
                          {comment.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-slate-500 text-xs">
                            {new Date(comment.timestamp).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <div className="flex items-center gap-1 text-slate-400">
                            <FaThumbsUp className="text-xs" />
                            <span className="text-xs">{comment.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Comment Details */}
          <div className="w-1/2 flex flex-col">
            {selectedComment ? (
              <div className="flex-1 flex flex-col">
                {/* Comment Header */}
                <div className="p-6 border-b border-slate-700/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <img
                        src={selectedComment.photo}
                        alt={selectedComment.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">
                          {selectedComment.name}
                        </h3>
                        <p className="text-slate-400 text-sm mb-2">
                          {new Date(selectedComment.timestamp).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <FaThumbsUp className="text-slate-400" />
                            <span className="text-slate-300">{selectedComment.likes} likes</span>
                          </div>
                          {selectedComment.edited && (
                            <span className="text-xs text-amber-400">Edited</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Like Controls */}
                      <button
                        onClick={() => updateLikes(selectedComment.id, 1)}
                        className="bg-green-500/20 hover:bg-green-500/30 p-2 rounded-full border border-green-400/30 transition-all duration-300 group"
                        title="Add like"
                      >
                        <FaThumbsUp className="text-green-300 group-hover:text-green-200 text-sm" />
                      </button>
                      
                      <button
                        onClick={() => updateLikes(selectedComment.id, -1)}
                        className="bg-red-500/20 hover:bg-red-500/30 p-2 rounded-full border border-red-400/30 transition-all duration-300 group"
                        title="Remove like"
                      >
                        <FaThumbsUp className="text-red-300 group-hover:text-red-200 text-sm rotate-180" />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => startEdit(selectedComment)}
                        className="bg-blue-500/20 hover:bg-blue-500/30 p-2 rounded-full border border-blue-400/30 transition-all duration-300 group"
                        title="Edit comment"
                      >
                        <FaEdit className="text-blue-300 group-hover:text-blue-200 text-sm" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => deleteComment(selectedComment.id)}
                        className="bg-red-500/20 hover:bg-red-500/30 p-2 rounded-full border border-red-400/30 transition-all duration-300 group"
                        title="Delete comment"
                      >
                        <FaTrash className="text-red-300 group-hover:text-red-200 text-sm" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comment Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {editingComment === selectedComment.id ? (
                    <div className="space-y-4">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full h-32 p-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 resize-none"
                        placeholder="Edit comment..."
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="bg-green-500/20 hover:bg-green-500/30 px-4 py-2 rounded-xl border border-green-400/30 text-green-300 hover:text-green-200 transition-all duration-300 flex items-center gap-2"
                        >
                          <FaCheck /> Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-slate-600/20 hover:bg-slate-600/30 px-4 py-2 rounded-xl border border-slate-500/30 text-slate-300 hover:text-slate-200 transition-all duration-300 flex items-center gap-2"
                        >
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/30">
                      <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {selectedComment.message}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <FaComment className="text-6xl mx-auto mb-4 opacity-50" />
                  <p>Select a comment to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Add Comment Modal */}
      <AnimatePresence>
        {isAddingComment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
            onClick={() => setIsAddingComment(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Add New Comment</h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={newComment.name}
                  onChange={(e) => setNewComment(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                />
                
                <textarea
                  placeholder="Comment message"
                  value={newComment.message}
                  onChange={(e) => setNewComment(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full h-32 p-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 resize-none"
                />
                
                <div className="flex gap-3">
                  <button
                    onClick={addComment}
                    disabled={!newComment.name.trim() || !newComment.message.trim()}
                    className="flex-1 bg-green-500/20 hover:bg-green-500/30 disabled:bg-slate-600/20 px-4 py-3 rounded-xl border border-green-400/30 disabled:border-slate-500/30 text-green-300 disabled:text-slate-400 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FaCheck /> Add Comment
                  </button>
                  
                  <button
                    onClick={() => setIsAddingComment(false)}
                    className="bg-slate-600/20 hover:bg-slate-600/30 px-4 py-3 rounded-xl border border-slate-500/30 text-slate-300 hover:text-slate-200 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

export default AdminComments;