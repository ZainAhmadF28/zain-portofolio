import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useNavbar } from '../contexts/NavbarContext';
import { FaPlay, FaHeart, FaComment, FaChevronLeft, FaChevronRight, FaImages, FaVideo } from 'react-icons/fa';
import apiService from '../services/api';

const Gallery = () => {
    const { theme } = useTheme();
    const { hideNavbar, showNavbar } = useNavbar();
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Interaction States
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [commentForm, setCommentForm] = useState({ name: '', content: '' });
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        if (selectedActivity) {
            hideNavbar();
            fetchComments(selectedActivity.id);
            setCurrentSlide(0); // Reset slide on open
        } else {
            showNavbar();
            setComments([]);
        }
        // Restore navbar on unmount
        return () => showNavbar();
    }, [selectedActivity, hideNavbar, showNavbar]);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        setIsLoading(true);
        try {
            const data = await apiService.getGallery();
            if (Array.isArray(data)) {
                // Normalize data structure if needed
                const formatted = data.map(item => ({
                    ...item,
                    src: item.media_url || item.src,
                }));
                setActivities(formatted);
            }
        } catch (err) {
            console.error('Error loading gallery', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchComments = async (galleryId) => {
        setLoadingComments(true);
        try {
            const data = await apiService.getGalleryComments(galleryId);
            if (Array.isArray(data)) {
                setComments(data);
            }
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleLike = async (e, activity) => {
        e.stopPropagation();
        // Optimistic UI Update
        const updatedActivities = activities.map(a =>
            a.id === activity.id ? { ...a, likes: (a.likes || 0) + 1 } : a
        );
        setActivities(updatedActivities);
        if (selectedActivity && selectedActivity.id === activity.id) {
            setSelectedActivity(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }));
        }

        // Call API
        await apiService.likeGalleryItem(activity.id);
    };

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!commentForm.name.trim() || !commentForm.content.trim()) return;

        setSubmittingComment(true);
        try {
            const { success, data } = await apiService.postGalleryComment(selectedActivity.id, commentForm.name, commentForm.content);
            if (success) {
                setComments([data, ...comments]); // Prepend new comment
                setCommentForm({ name: '', content: '' });
            }
        } catch (error) {
            console.error('Failed to post comment:', error);
        } finally {
            setSubmittingComment(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 max-w-7xl mx-auto pt-24 md:pt-32 pb-20"
        >
            <div className="text-center mb-8 md:mb-16 px-4">
                <h1 className="text-3xl md:text-6xl font-black font-moderniz tracking-tighter mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 dark:from-cyan-300 dark:to-blue-500 filter drop-shadow-lg">
                        ACTIVITY
                    </span>
                    <br className="md:hidden" />
                    <span className="dark:text-white text-slate-800 ml-0 md:ml-4">
                        GALLERY
                    </span>
                </h1>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
            )}

            {/* Masonry Layout (Modern & Responsive) */}
            {!isLoading && (
                <div className="columns-2 md:columns-3 gap-3 space-y-3 md:gap-6 md:space-y-6 px-2 md:px-8">
                    {activities.map((activity) => {
                        const isVideo = activity.type === 'video';
                        const isMulti = activity.media_urls && activity.media_urls.length > 1;

                        return (
                            <motion.div
                                key={activity.id}
                                layoutId={`activity-${activity.id}`}
                                className="break-inside-avoid relative group rounded-xl md:rounded-2xl overflow-hidden cursor-pointer bg-white dark:bg-slate-900 border dark:border-slate-800 border-slate-200 shadow-sm md:shadow-lg hover:shadow-xl transition-all duration-300"
                                onClick={() => setSelectedActivity(activity)}
                                whileHover={{ y: -5 }}
                            >
                                <div className="relative w-full">
                                    {isVideo ? (
                                        <video
                                            src={activity.src}
                                            className="w-full h-auto object-cover"
                                            muted
                                            loop
                                            playsInline
                                            autoPlay
                                        />
                                    ) : (
                                        <img
                                            src={activity.src}
                                            alt={activity.title}
                                            className="w-full h-auto object-cover"
                                            loading="lazy"
                                            onError={(e) => e.target.src = 'https://via.placeholder.com/600x400?text=No+Image'}
                                        />
                                    )}

                                    {/* Mobile Indicators (Top Right) - kept minimal */}
                                    <div className="absolute top-2 right-2 md:hidden text-white drop-shadow-md bg-black/30 backdrop-blur-sm rounded-full p-1.5 px-2 text-xs flex items-center">
                                        {isVideo && <FaVideo />}
                                        {!isVideo && isMulti && <FaImages />}
                                    </div>

                                    {/* Gradient Overlay (Desktop Hover) */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 hidden md:flex">
                                        <span className="text-cyan-300 text-xs font-bold uppercase tracking-wider mb-1">{activity.date}</span>
                                        <h3 className="text-white font-bold text-lg leading-tight">{activity.title}</h3>
                                    </div>
                                </div>

                                {/* Minimal info for Mobile (re-added but minimal) */}
                                <div className="p-3 md:p-4 flex items-center justify-between md:border-t dark:border-slate-800 border-slate-100 bg-white dark:bg-slate-900">
                                    <div className="flex items-center space-x-2 text-xs md:text-sm dark:text-slate-400 text-slate-500">
                                        <FaHeart className="text-red-500" /> <span>{activity.likes || 0}</span>
                                    </div>
                                    {/* Title truncation for mobile context */}
                                    <div className="md:hidden text-xs font-bold dark:text-slate-300 text-slate-700 truncate ml-2 flex-1 text-right">
                                        {activity.title}
                                    </div>
                                    <div className="hidden md:block text-xs font-mono dark:text-slate-500 text-slate-400">
                                        View Details
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && activities.length === 0 && (
                <div className="text-center py-20 dark:text-slate-500 text-slate-400">
                    <p>No activities found yet. Check back later!</p>
                </div>
            )}

            {/* Modal Detail */}
            <AnimatePresence>
                {selectedActivity && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/90 md:bg-black/80 backdrop-blur-md"
                        onClick={() => setSelectedActivity(null)}
                    >
                        <motion.div
                            layoutId={`activity-${selectedActivity.id}`}
                            className="relative w-full md:max-w-5xl bg-white dark:bg-slate-900 md:rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-full md:h-[80vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Media Section (Left/Top) */}
                            <div className="w-full md:w-[60%] bg-black flex items-center justify-center relative h-[45%] md:h-full group">
                                {(() => {
                                    const files = (selectedActivity.media_urls && selectedActivity.media_urls.length > 0)
                                        ? selectedActivity.media_urls
                                        : [selectedActivity.src];

                                    const currentFile = files[currentSlide] || files[0];
                                    const isVideoFile = currentFile.match(/\.(mp4|webm|ogg)$/i) || (selectedActivity.type === 'video' && files.length === 1);

                                    return (
                                        <>
                                            {isVideoFile ? (
                                                <video
                                                    src={currentFile}
                                                    controls
                                                    autoPlay
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                            ) : (
                                                <img
                                                    src={currentFile}
                                                    alt={selectedActivity.title}
                                                    className="max-h-full max-w-full object-contain transition-opacity duration-300"
                                                />
                                            )}

                                            {/* Navigation Arrows */}
                                            {files.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCurrentSlide(prev => (prev === 0 ? files.length - 1 : prev - 1));
                                                        }}
                                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                                                    >
                                                        <FaChevronLeft size={20} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCurrentSlide(prev => (prev === files.length - 1 ? 0 : prev + 1));
                                                        }}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                                                    >
                                                        <FaChevronRight size={20} />
                                                    </button>

                                                    {/* Dots Indicator */}
                                                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                                        {files.map((_, idx) => (
                                                            <div
                                                                key={idx}
                                                                className={`w-2 h-2 rounded-full transition-all ${currentSlide === idx ? 'bg-white w-4' : 'bg-white/50'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    );
                                })()}

                                <button
                                    onClick={() => setSelectedActivity(null)}
                                    className="absolute top-4 left-4 md:hidden p-2 bg-black/50 text-white rounded-full z-10"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Info & Comments Section (Right/Bottom) */}
                            <div className="w-full md:w-[40%] flex flex-col h-[55%] md:h-full border-l dark:border-slate-800 border-slate-200">
                                {/* Header Info */}
                                <div className="p-4 md:p-6 border-b dark:border-slate-800 border-slate-200 flex-shrink-0 bg-white dark:bg-slate-900">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400">
                                            {selectedActivity.date}
                                        </span>
                                        <button onClick={() => setSelectedActivity(null)} className="hidden md:block text-slate-400 hover:text-red-500 transition-colors">
                                            ✕
                                        </button>
                                    </div>
                                    <h2 className="text-lg md:text-xl font-bold dark:text-white text-slate-900 mb-1">{selectedActivity.title}</h2>
                                    <p className="text-xs md:text-sm dark:text-slate-400 text-slate-600 leading-relaxed line-clamp-3">
                                        {selectedActivity.description}
                                    </p>
                                </div>

                                {/* Comments List (Scrollable) */}
                                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50 dark:bg-slate-900/50">
                                    {loadingComments ? (
                                        <div className="flex justify-center py-4"><div className="animate-spin w-6 h-6 border-2 border-cyan-500 rounded-full border-t-transparent"></div></div>
                                    ) : comments.length > 0 ? (
                                        comments.map((comment) => (
                                            <div key={comment.id} className="flex gap-3 animate-fade-in">
                                                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white text-xs ${['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'][comment.id % 5]}`}>
                                                    {comment.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="bg-white dark:bg-slate-800 p-3 rounded-r-xl rounded-bl-xl shadow-sm">
                                                        <p className="text-xs font-bold dark:text-white text-slate-800 mb-1">{comment.name}</p>
                                                        <p className="text-sm dark:text-slate-300 text-slate-600">{comment.content}</p>
                                                    </div>
                                                    <span className="text-[10px] text-slate-400 ml-1 mt-1 block">
                                                        {new Date(comment.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-slate-400 text-sm">
                                            No comments yet. Be the first!
                                        </div>
                                    )}
                                </div>

                                {/* Interaction Area (Fixed Bottom) */}
                                <div className="p-4 border-t dark:border-slate-800 border-slate-200 bg-white dark:bg-slate-900 flex-shrink-0 pb-safe">
                                    <div className="flex items-center gap-4 mb-3">
                                        <button
                                            onClick={(e) => handleLike(e, selectedActivity)}
                                            className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors group"
                                        >
                                            <FaHeart className={`text-xl transition-transform group-active:scale-125 ${selectedActivity.likes > 0 ? 'text-red-500' : ''}`} />
                                            <span className="font-semibold">{selectedActivity.likes || 0} Likes</span>
                                        </button>
                                    </div>

                                    {/* Comment Form */}
                                    <form onSubmit={handlePostComment} className="flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                value={commentForm.name}
                                                onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                                                className="w-1/3 text-sm px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg border-none focus:ring-1 focus:ring-cyan-400 dark:text-white"
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder="Add a comment..."
                                                value={commentForm.content}
                                                onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                                                className="w-2/3 text-sm px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg border-none focus:ring-1 focus:ring-cyan-400 dark:text-white"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={submittingComment}
                                            className="ml-auto text-xs font-bold text-cyan-600 hover:text-cyan-500 disabled:opacity-50 uppercase tracking-wider"
                                        >
                                            {submittingComment ? 'Posting...' : 'Post Comment'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Gallery;
