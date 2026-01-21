import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { FaTrash, FaEdit, FaPlus, FaImage, FaVideo, FaTimes, FaSave } from 'react-icons/fa';
import apiService from '../services/api';

const AdminGallery = ({ isOpen, onClose }) => {
    const { theme } = useTheme();
    const [galleryItems, setGalleryItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        media_url: '',
        type: 'image', // 'image' or 'video'
        date: '',
    });

    useEffect(() => {
        if (isOpen) {
            fetchGallery();
        }
    }, [isOpen]);

    const fetchGallery = async () => {
        setIsLoading(true);
        try {
            const data = await apiService.getGallery();
            // If data is array usually, but api wrapper might return { success: false }
            if (Array.isArray(data)) {
                setGalleryItems(data);
            } else if (data.success === false) {
                // Fallback dummy data if DB empty or error for now
                setGalleryItems([]);
                console.error(data.error);
            } else {
                setGalleryItems(data);
            }
        } catch (err) {
            setError('Failed to fetch gallery items');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            const result = await apiService.deleteGalleryItem(id);
            if (result.success !== false) {
                setGalleryItems(galleryItems.filter(item => item.id !== id));
            } else {
                alert('Failed to delete item');
            }
        }
    };

    const handleEdit = (item) => {
        setCurrentItem(item);
        setFormData({
            title: item.title,
            description: item.description,
            media_url: item.media_url || item.src, // Handle both DB and dummy naming if needed
            type: item.type,
            date: item.date,
        });
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setCurrentItem(null);
        setFormData({
            title: '',
            description: '',
            media_url: '',
            type: 'image',
            date: new Date().toISOString().split('T')[0], // Today's date YYYY-MM-DD
        });
        setIsEditing(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...formData };

        if (currentItem) {
            // Update
            const result = await apiService.updateGalleryItem(currentItem.id, payload);
            if (result.success !== false) {
                fetchGallery(); // Refresh list
                setIsEditing(false);
            } else {
                alert('Failed to update item: ' + result.error);
            }
        } else {
            // Create
            const result = await apiService.createGalleryItem(payload);
            if (result.success !== false) {
                fetchGallery();
                setIsEditing(false);
            } else {
                alert('Failed to create item: ' + result.error);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b dark:border-slate-800 border-slate-200 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
                        <h2 className="text-2xl font-bold dark:text-white text-slate-800 flex items-center gap-3">
                            <FaImage className="text-cyan-500" /> Gallery Manager
                        </h2>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleAddNew}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-md"
                            >
                                <FaPlus /> Add New
                            </button>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors dark:text-slate-400">
                                <FaTimes className="text-xl" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden flex flex-row">
                        {/* List Sidebar */}
                        <div className={`w-full ${isEditing ? 'md:w-1/2 hidden md:block' : 'w-full'} flex flex-col border-r dark:border-slate-800 border-slate-200`}>
                            <div className="p-4 overflow-y-auto h-full space-y-3">
                                {isLoading ? (
                                    <div className="text-center py-10 dark:text-slate-500">Loading gallery...</div>
                                ) : galleryItems.length === 0 ? (
                                    <div className="text-center py-10 dark:text-slate-500 italic">No items found. Add one!</div>
                                ) : (
                                    galleryItems.map(item => (
                                        <div key={item.id} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border dark:border-slate-800 border-slate-100">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                                                <img src={item.media_url || item.src} alt={item.title} className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://via.placeholder.com/150'} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold dark:text-white text-slate-800 truncate">{item.title}</h4>
                                                <p className="text-xs dark:text-slate-400 text-slate-500">{item.date} • {item.type}</p>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(item)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-full"><FaEdit /></button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full"><FaTrash /></button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Edit Form */}
                        {isEditing && (
                            <div className="w-full md:w-1/2 flex flex-col h-full bg-slate-50 dark:bg-slate-900/50 absolute md:relative inset-0 md:inset-auto z-10">
                                <div className="p-4 border-b dark:border-slate-800 border-slate-200 flex justify-between items-center md:hidden">
                                    <h3 className="font-bold dark:text-white">Edit Item</h3>
                                    <button onClick={() => setIsEditing(false)} className="text-slate-500">Close</button>
                                </div>
                                <div className="p-6 overflow-y-auto flex-1">
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium dark:text-slate-300 text-slate-700 mb-1">Title</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-white dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium dark:text-slate-300 text-slate-700 mb-1">Date</label>
                                                <input
                                                    type="date"
                                                    required
                                                    value={formData.date}
                                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-lg border dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-white dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium dark:text-slate-300 text-slate-700 mb-1">Type</label>
                                                <select
                                                    value={formData.type}
                                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                                    className="w-full px-4 py-2 rounded-lg border dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-white dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                                >
                                                    <option value="image">Image</option>
                                                    <option value="video">Video</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium dark:text-slate-300 text-slate-700 mb-1">Media URL</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="url"
                                                    required
                                                    placeholder="https://..."
                                                    value={formData.media_url}
                                                    onChange={e => setFormData({ ...formData, media_url: e.target.value })}
                                                    className="flex-1 px-4 py-2 rounded-lg border dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-white dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                                />
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">Paste a direct image link from Unsplash or Supabase Storage.</p>
                                        </div>

                                        {/* Preview */}
                                        {formData.media_url && (
                                            <div className="aspect-video rounded-lg overflow-hidden bg-black/10 dark:bg-black/50 border dark:border-slate-800">
                                                <img src={formData.media_url} alt="Preview" className="w-full h-full object-contain" onError={e => e.target.style.display = 'none'} />
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium dark:text-slate-300 text-slate-700 mb-1">Description</label>
                                            <textarea
                                                rows="4"
                                                required
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border dark:border-slate-700 border-slate-300 dark:bg-slate-800 bg-white dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
                                            />
                                        </div>

                                        <div className="pt-4 flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="px-4 py-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg flex items-center gap-2"
                                            >
                                                <FaSave /> Save Item
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AdminGallery;
