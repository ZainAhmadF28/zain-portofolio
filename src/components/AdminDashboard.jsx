import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaProjectDiagram,
  FaCertificate,
  FaEnvelope,
  FaComments,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaEye,
  FaCheck,
  FaHeart,
  FaCalendar,
  FaUser,
  FaLink,
  FaImage,
  FaTags,
  FaStar,
  FaThumbtack
} from 'react-icons/fa';
import { supabase } from '../lib/supabase';

const AdminDashboard = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [messages, setMessages] = useState([]);
  const [comments, setComments] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    image_url: '',
    demo_url: '',
    github_url: '',
    tags: '',
    featured: false
  });

  const [certificateForm, setCertificateForm] = useState({
    title: '',
    issuer: '',
    issue_date: '',
    credential_url: '',
    image_url: ''
  });

  // Gallery Form State
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: '',
    media_url: '',
    type: 'image',
    date: new Date().toISOString().split('T')[0],
  });

  // File upload states
  const [uploadingFile, setUploadingFile] = useState(false);
  const [projectImageFile, setProjectImageFile] = useState(null);
  const [certificateImageFile, setCertificateImageFile] = useState(null);
  const [certificatePdfFile, setCertificatePdfFile] = useState(null);
  const [galleryMediaFile, setGalleryMediaFile] = useState(null); // New for gallery

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'projects':
          await fetchProjects();
          break;
        case 'certificates':
          await fetchCertificates();
          break;
        case 'messages':
          await fetchMessages();
          break;
        case 'comments':
          await fetchComments();
          break;
        case 'gallery':
          await fetchGallery();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGallery = async () => {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('date', { ascending: false });
    if (data) setGallery(data);
    if (error) console.error('Error fetching gallery:', error);
  };

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setProjects(data);
    if (error) console.error('Error fetching projects:', error);
  };

  const fetchCertificates = async () => {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('issue_date', { ascending: false });
    if (data) setCertificates(data);
    if (error) console.error('Error fetching certificates:', error);
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setMessages(data);
    if (error) console.error('Error fetching messages:', error);
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('is_pinned', { ascending: false })  // Pinned first
      .order('created_at', { ascending: false }); // Then by date
    if (data) setComments(data);
    if (error) console.error('Error fetching comments:', error);
  };

  // FILE UPLOAD Functions
  const uploadFile = async (file, bucket, folder = '') => {
    try {
      setUploadingFile(true);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      setUploadingFile(false);
      return publicUrl;
    } catch (error) {
      setUploadingFile(false);
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleProjectImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      setProjectImageFile(file);
      const imageUrl = await uploadFile(file, 'project-images', 'projects/');
      setProjectForm(prev => ({ ...prev, image_url: imageUrl }));
      alert('Image uploaded successfully!');
    } catch (error) {
      alert('Failed to upload image: ' + error.message);
    }
  };

  const handleCertificateImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      setCertificateImageFile(file);
      const imageUrl = await uploadFile(file, 'certificate-images', 'certificates/');
      setCertificateForm(prev => ({ ...prev, image_url: imageUrl }));
      alert('Certificate image uploaded successfully!');
    } catch (error) {
      alert('Failed to upload certificate image: ' + error.message);
    }
  };

  const handleCertificatePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('PDF size should be less than 10MB');
      return;
    }

    try {
      setCertificatePdfFile(file);
      const pdfUrl = await uploadFile(file, 'certificates', 'pdfs/');
      setCertificateForm(prev => ({ ...prev, credential_url: pdfUrl }));
      alert('Certificate PDF uploaded successfully!');
    } catch (error) {
      alert('Failed to upload PDF: ' + error.message);
    }
  };

  const handleGalleryMediaUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingFile(true);
    const uploadedUrls = [];
    let hasError = false;

    // Check file type based on selected type (image or video)
    const isVideo = galleryForm.type === 'video';
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // Increased limits

    try {
      for (const file of files) {
        if (isVideo && !file.type.startsWith('video/')) {
          alert(`File ${file.name} is not a video.`);
          continue;
        }
        if (!isVideo && !file.type.startsWith('image/')) {
          alert(`File ${file.name} is not an image.`);
          continue;
        }
        if (file.size > maxSize) {
          alert(`File ${file.name} exceeds size limit.`);
          continue;
        }

        try {
          // Bucket: 'gallery-media'
          const mediaUrl = await uploadFile(file, 'gallery-media', `${galleryForm.type}s/`);
          uploadedUrls.push(mediaUrl);
        } catch (err) {
          console.error(`Failed to upload ${file.name}:`, err);
          hasError = true;
        }
      }

      if (uploadedUrls.length > 0) {
        const currentUrls = galleryForm.media_urls || [];
        const newUrls = [...currentUrls, ...uploadedUrls];
        setGalleryForm(prev => ({
          ...prev,
          media_urls: newUrls,
          media_url: newUrls[0] // Fallback for backward compatibility
        }));
        if (!hasError) alert('All media uploaded successfully!');
        else alert('Some files uploaded, but errors occurred with others.');
      }
    } catch (error) {
      alert('Upload process failed: ' + error.message);
    } finally {
      setUploadingFile(false);
    }
  };

  // CREATE Operations
  const createProject = async () => {
    try {
      const tagsArray = projectForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const { error } = await supabase
        .from('projects')
        .insert([{
          ...projectForm,
          tags: tagsArray
        }]);

      if (error) throw error;

      alert('Project created successfully!');
      resetProjectForm();
      setIsCreating(false);
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project: ' + error.message);
    }
  };

  const createCertificate = async () => {
    try {
      const { error } = await supabase
        .from('certificates')
        .insert([certificateForm]);

      if (error) throw error;

      alert('Certificate created successfully!');
      resetCertificateForm();
      setIsCreating(false);
      fetchCertificates();
    } catch (error) {
      console.error('Error creating certificate:', error);
      alert('Failed to create certificate: ' + error.message);
    }
  };

  // UPDATE Operations
  const updateProject = async () => {
    try {
      const tagsArray = typeof projectForm.tags === 'string'
        ? projectForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : projectForm.tags;

      const { error } = await supabase
        .from('projects')
        .update({
          ...projectForm,
          tags: tagsArray
        })
        .eq('id', editingItem.id);

      if (error) throw error;

      alert('Project updated successfully!');
      setEditingItem(null);
      resetProjectForm();
      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project: ' + error.message);
    }
  };

  const updateCertificate = async () => {
    try {
      const { error } = await supabase
        .from('certificates')
        .update(certificateForm)
        .eq('id', editingItem.id);

      if (error) throw error;

      alert('Certificate updated successfully!');
      setEditingItem(null);
      resetCertificateForm();
      fetchCertificates();
    } catch (error) {
      console.error('Error updating certificate:', error);
      alert('Failed to update certificate: ' + error.message);
    }
  };

  const updateMessageStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      fetchMessages();
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  // DELETE Operations
  const deleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Project deleted successfully!');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project: ' + error.message);
    }
  };

  const deleteCertificate = async (id) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;

    try {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Certificate deleted successfully!');
      fetchCertificates();
    } catch (error) {
      console.error('Error deleting certificate:', error);
      alert('Failed to delete certificate: ' + error.message);
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Message deleted successfully!');
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message: ' + error.message);
    }
  };

  const deleteComment = async (id) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Comment deleted successfully!');
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment: ' + error.message);
    }
  };

  // ✨ NEW: Toggle pin status for comment
  const togglePinComment = async (id, currentPinStatus) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ is_pinned: !currentPinStatus })
        .eq('id', id);

      if (error) throw error;

      const action = !currentPinStatus ? 'pinned' : 'unpinned';
      alert(`Comment ${action} successfully! 📌`);
      fetchComments();
    } catch (error) {
      console.error('Error toggling pin status:', error);
      alert('Failed to toggle pin status: ' + error.message);
    }
  };

  // Form reset functions
  const resetProjectForm = () => {
    setProjectForm({
      title: '',
      description: '',
      image_url: '',
      demo_url: '',
      github_url: '',
      tags: '',
      featured: false
    });
  };

  const resetCertificateForm = () => {
    setCertificateForm({
      title: '',
      issuer: '',
      issue_date: '',
      credential_url: '',
      image_url: ''
    });
  };

  // GALLERY OPERATIONS
  const createGallery = async () => {
    try {
      const { error } = await supabase
        .from('gallery')
        .insert([galleryForm]);

      if (error) throw error;
      alert('Gallery item created successfully!');
      resetGalleryForm();
      setIsCreating(false);
      fetchGallery();
    } catch (error) {
      console.error('Error creating gallery item:', error);
      alert('Failed to create gallery item: ' + error.message);
    }
  };

  const updateGallery = async () => {
    try {
      const { error } = await supabase
        .from('gallery')
        .update(galleryForm)
        .eq('id', editingItem.id);

      if (error) throw error;
      alert('Gallery item updated successfully!');
      setEditingItem(null);
      resetGalleryForm();
      fetchGallery();
    } catch (error) {
      console.error('Error updating gallery item:', error);
      alert('Failed to update gallery item: ' + error.message);
    }
  };

  const deleteGallery = async (id) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;
    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Gallery item deleted successfully!');
      fetchGallery();
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      alert('Failed to delete gallery item: ' + error.message);
    }
  };

  const resetGalleryForm = () => {
    setGalleryForm({
      title: '',
      description: '',
      media_url: '',
      type: 'image',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const startEdit = (item, type) => {
    setEditingItem({ ...item, type });
    if (type === 'project') {
      setProjectForm({
        title: item.title,
        description: item.description,
        image_url: item.image_url,
        demo_url: item.demo_url || '',
        github_url: item.github_url || '',
        tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags,
        featured: item.featured || false
      });
    } else if (type === 'certificate') {
      setCertificateForm({
        title: item.title,
        issuer: item.issuer,
        issue_date: item.issue_date,
        credential_url: item.credential_url || '',
        image_url: item.image_url || ''
      });
    } else if (type === 'gallery') {
      setGalleryForm({
        title: item.title,
        description: item.description,
        media_url: item.media_url,
        type: item.type,
        date: item.date
      });
    }
  };

  const tabs = [
    { id: 'projects', label: 'Projects', icon: <FaProjectDiagram />, count: projects.length },
    { id: 'certificates', label: 'Certificates', icon: <FaCertificate />, count: certificates.length },
    { id: 'gallery', label: 'Gallery', icon: <FaImage />, count: gallery.length },
    { id: 'messages', label: 'Messages', icon: <FaEnvelope />, count: messages.length },
    { id: 'comments', label: 'Comments', icon: <FaComments />, count: comments.length }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-900 rounded-3xl border border-slate-700 w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-700 flex items-center justify-between bg-gradient-to-r from-cyan-900/20 to-emerald-900/20">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h2>
              <p className="text-slate-400">Manage your portfolio content</p>
            </div>
            <button
              onClick={onClose}
              className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors duration-300"
            >
              <FaTimes className="text-white text-xl" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 p-6 border-b border-slate-700 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsCreating(false);
                  setEditingItem(null);
                }}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span className="px-2 py-1 bg-white/20 rounded-full text-xs">{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {/* Projects Tab */}
                {activeTab === 'projects' && (
                  <div className="space-y-6">
                    {/* Add New Button */}
                    {!isCreating && !editingItem && (
                      <button
                        onClick={() => {
                          setIsCreating(true);
                          resetProjectForm();
                        }}
                        className="w-full bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
                      >
                        <FaPlus />
                        Add New Project
                      </button>
                    )}

                    {/* Create/Edit Form */}
                    {(isCreating || editingItem?.type === 'project') && (
                      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                        <h3 className="text-2xl font-bold text-white mb-6">
                          {isCreating ? 'Create New Project' : 'Edit Project'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-slate-400 mb-2">Title *</label>
                            <input
                              type="text"
                              value={projectForm.title}
                              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                              placeholder="Project title"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-2">Tags (comma separated) *</label>
                            <input
                              type="text"
                              value={projectForm.tags}
                              onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                              placeholder="React, Next.js, TailwindCSS"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-slate-400 mb-2">Description *</label>
                            <textarea
                              value={projectForm.description}
                              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                              rows="3"
                              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                              placeholder="Project description"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-2">Project Image *</label>
                            <div className="space-y-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleProjectImageUpload}
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-600 file:text-white hover:file:bg-cyan-500 file:cursor-pointer focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                              />
                              {projectForm.image_url && (
                                <div className="flex items-center gap-2">
                                  <img src={projectForm.image_url} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-slate-600" />
                                  <span className="text-sm text-slate-400 break-all">{projectForm.image_url}</span>
                                </div>
                              )}
                              {uploadingFile && <p className="text-sm text-cyan-400">Uploading...</p>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-2">Demo URL</label>
                            <input
                              type="text"
                              value={projectForm.demo_url}
                              onChange={(e) => setProjectForm({ ...projectForm, demo_url: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                              placeholder="https://..."
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-2">GitHub URL</label>
                            <input
                              type="text"
                              value={projectForm.github_url}
                              onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                              placeholder="https://github.com/..."
                            />
                          </div>
                          <div>
                            <label className="flex items-center gap-3 text-slate-400 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={projectForm.featured}
                                onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                                className="w-5 h-5 text-cyan-600 bg-slate-900 border-slate-600 rounded focus:ring-2 focus:ring-cyan-400/20"
                              />
                              <span>Featured Project</span>
                              <FaStar className="text-yellow-400" />
                            </label>
                          </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                          <button
                            onClick={isCreating ? createProject : updateProject}
                            className="flex-1 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
                          >
                            <FaSave />
                            {isCreating ? 'Create Project' : 'Update Project'}
                          </button>
                          <button
                            onClick={() => {
                              setIsCreating(false);
                              setEditingItem(null);
                              resetProjectForm();
                            }}
                            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors duration-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Projects List */}
                    <div className="grid grid-cols-1 gap-4">
                      {projects.map(project => (
                        <div key={project.id} className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-cyan-400/50 transition-all duration-300">
                          <div className="flex gap-6">
                            <img
                              src={project.image_url}
                              alt={project.title}
                              className="w-32 h-32 object-cover rounded-xl"
                              onError={(e) => e.target.src = 'https://via.placeholder.com/128?text=Project'}
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    {project.title}
                                    {project.featured && <FaStar className="text-yellow-400" />}
                                  </h3>
                                  <p className="text-slate-400 mt-1">{project.description}</p>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => startEdit(project, 'project')}
                                    className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors duration-300"
                                    title="Edit"
                                  >
                                    <FaEdit className="text-white" />
                                  </button>
                                  <button
                                    onClick={() => deleteProject(project.id)}
                                    className="p-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors duration-300"
                                    title="Delete"
                                  >
                                    <FaTrash className="text-white" />
                                  </button>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-3">
                                {Array.isArray(project.tags) && project.tags.map((tag, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-cyan-600/20 text-cyan-400 rounded-full text-sm">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <div className="flex gap-4 mt-3 text-sm text-slate-400">
                                {project.demo_url && (
                                  <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-cyan-400">
                                    <FaLink /> Demo
                                  </a>
                                )}
                                {project.github_url && (
                                  <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-cyan-400">
                                    <FaLink /> GitHub
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gallery Tab */}
                {activeTab === 'gallery' && (
                  <div className="space-y-6">
                    {/* Add New Button */}
                    {!isCreating && !editingItem && (
                      <button
                        onClick={() => {
                          setIsCreating(true);
                          resetGalleryForm();
                        }}
                        className="w-full bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
                      >
                        <FaPlus />
                        Add New Activity
                      </button>
                    )}

                    {/* Create/Edit Form */}
                    {(isCreating || editingItem?.type === 'gallery') && (
                      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                        <h3 className="text-2xl font-bold text-white mb-6">
                          {isCreating ? 'Create New Activity' : 'Edit Activity'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-slate-400 mb-2">Title *</label>
                            <input
                              type="text"
                              required
                              value={galleryForm.title}
                              onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-2">Date *</label>
                            <input
                              type="date"
                              required
                              value={galleryForm.date}
                              onChange={(e) => setGalleryForm({ ...galleryForm, date: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-2">Type *</label>
                            <select
                              value={galleryForm.type}
                              onChange={(e) => setGalleryForm({ ...galleryForm, type: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                            >
                              <option value="image">Image</option>
                              <option value="video">Video</option>
                            </select>
                          </div>
                          <div>

                            <label className="block text-slate-400 mb-2">Media Files (Image/Video) *</label>
                            <div className="space-y-4">
                              {/* File Input */}
                              <input
                                type="file"
                                multiple
                                accept={galleryForm.type === 'video' ? "video/*" : "image/*"}
                                onChange={handleGalleryMediaUpload}
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-600 file:text-white hover:file:bg-cyan-500 file:cursor-pointer focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                              />
                              <p className="text-xs text-slate-500">You can select multiple files to create a carousel.</p>

                              {uploadingFile && <div className="text-sm text-cyan-400 animate-pulse">Uploading... Please wait.</div>}

                              {/* Manual URL Input (Fallback) */}
                              <div className="flex gap-2">
                                <input
                                  type="url"
                                  placeholder="Add URL manually..."
                                  id="manual-url-input"
                                  className="flex-1 px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-sm text-slate-300 focus:border-cyan-400"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const input = document.getElementById('manual-url-input');
                                    if (input.value) {
                                      const newUrls = [...(galleryForm.media_urls || []), input.value];
                                      setGalleryForm(prev => ({
                                        ...prev,
                                        media_urls: newUrls,
                                        media_url: newUrls[0] // Update primary thumbnail
                                      }));
                                      input.value = '';
                                    }
                                  }}
                                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm"
                                >
                                  Add
                                </button>
                              </div>

                              {/* Preview List */}
                              {galleryForm.media_urls && galleryForm.media_urls.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                                  {galleryForm.media_urls.map((url, index) => (
                                    <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-700 bg-black/50 aspect-video flex items-center justify-center">
                                      {galleryForm.type === 'video' ? (
                                        <video src={url} className="w-full h-full object-cover" />
                                      ) : (
                                        <img src={url} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
                                      )}

                                      {/* Remove Button */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newUrls = galleryForm.media_urls.filter((_, i) => i !== index);
                                          setGalleryForm(prev => ({
                                            ...prev,
                                            media_urls: newUrls,
                                            media_url: newUrls[0] || '' // Update/Clear thumbnail
                                          }));
                                        }}
                                        className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <FaTrash size={12} />
                                      </button>

                                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] text-white p-1 truncate text-center">
                                        {index === 0 ? 'Cover' : `Slide ${index + 1}`}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-slate-400 mb-2">Description</label>
                            <textarea
                              value={galleryForm.description}
                              onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                              rows="3"
                              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                            />
                          </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                          <button
                            onClick={isCreating ? createGallery : updateGallery}
                            disabled={uploadingFile}
                            className={`flex-1 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 ${uploadingFile ? 'opacity-50 cursor-not-allowed' : 'hover:from-cyan-500 hover:to-emerald-500'}`}
                          >
                            <FaSave />
                            {uploadingFile ? 'Uploading Media...' : (isCreating ? 'Create Activity' : 'Update Activity')}
                          </button>
                          <button
                            onClick={() => {
                              setIsCreating(false);
                              setEditingItem(null);
                              resetGalleryForm();
                            }}
                            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors duration-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Gallery List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {gallery.map(item => (
                        <div key={item.id} className="bg-slate-800 rounded-2xl p-4 border border-slate-700 hover:border-cyan-400/50 transition-all duration-300 group">
                          <div className="aspect-video rounded-xl bg-slate-900 overflow-hidden mb-3 relative">
                            <img src={item.media_url} alt={item.title} className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=No+Media'} />
                            <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-xs text-white capitalize">
                              {item.type}
                            </div>
                          </div>
                          <h3 className="font-bold text-white truncate">{item.title}</h3>
                          <p className="text-slate-400 text-sm mb-3">{item.date}</p>
                          <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEdit(item, 'gallery')} className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white">
                              <FaEdit />
                            </button>
                            <button onClick={() => deleteGallery(item.id)} className="p-2 bg-red-600 hover:bg-red-500 rounded-lg text-white">
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certificates Tab */}
                {activeTab === 'certificates' && (
                  <div className="space-y-6">
                    {/* Add New Button */}
                    {!isCreating && !editingItem && (
                      <button
                        onClick={() => {
                          setIsCreating(true);
                          resetCertificateForm();
                        }}
                        className="w-full bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
                      >
                        <FaPlus />
                        Add New Certificate
                      </button>
                    )}

                    {/* Create/Edit Form */}
                    {(isCreating || editingItem?.type === 'certificate') && (
                      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                        <h3 className="text-2xl font-bold text-white mb-6">
                          {isCreating ? 'Create New Certificate' : 'Edit Certificate'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-slate-400 mb-2">Title *</label>
                            <input
                              type="text"
                              value={certificateForm.title}
                              onChange={(e) => setCertificateForm({ ...certificateForm, title: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                              placeholder="Certificate title"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-2">Issuer *</label>
                            <input
                              type="text"
                              value={certificateForm.issuer}
                              onChange={(e) => setCertificateForm({ ...certificateForm, issuer: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                              placeholder="Issuing organization"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-2">Issue Date *</label>
                            <input
                              type="date"
                              value={certificateForm.issue_date}
                              onChange={(e) => setCertificateForm({ ...certificateForm, issue_date: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-2">Certificate PDF</label>
                            <div className="space-y-2">
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleCertificatePdfUpload}
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-600 file:text-white hover:file:bg-cyan-500 file:cursor-pointer focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                              />
                              {certificateForm.credential_url && (
                                <div className="flex items-center gap-2">
                                  <a href={certificateForm.credential_url} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-400 hover:underline break-all">
                                    📄 {certificateForm.credential_url}
                                  </a>
                                </div>
                              )}
                              {uploadingFile && <p className="text-sm text-cyan-400">Uploading PDF...</p>}
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-slate-400 mb-2">Certificate Image (Preview)</label>
                            <div className="space-y-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleCertificateImageUpload}
                                className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-600 file:text-white hover:file:bg-cyan-500 file:cursor-pointer focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                              />
                              {certificateForm.image_url && (
                                <div className="flex items-center gap-2">
                                  <img src={certificateForm.image_url} alt="Preview" className="w-32 h-20 object-cover rounded-lg border border-slate-600" />
                                  <span className="text-sm text-slate-400 break-all">{certificateForm.image_url}</span>
                                </div>
                              )}
                              {uploadingFile && <p className="text-sm text-cyan-400">Uploading image...</p>}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                          <button
                            onClick={isCreating ? createCertificate : updateCertificate}
                            className="flex-1 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
                          >
                            <FaSave />
                            {isCreating ? 'Create Certificate' : 'Update Certificate'}
                          </button>
                          <button
                            onClick={() => {
                              setIsCreating(false);
                              setEditingItem(null);
                              resetCertificateForm();
                            }}
                            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors duration-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Certificates List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {certificates.map(cert => (
                        <div key={cert.id} className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-cyan-400/50 transition-all duration-300">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-white">{cert.title}</h3>
                              <p className="text-cyan-400 text-sm mt-1">{cert.issuer}</p>
                              <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                                <FaCalendar />
                                {new Date(cert.issue_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEdit(cert, 'certificate')}
                                className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors duration-300"
                                title="Edit"
                              >
                                <FaEdit className="text-white text-sm" />
                              </button>
                              <button
                                onClick={() => deleteCertificate(cert.id)}
                                className="p-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors duration-300"
                                title="Delete"
                              >
                                <FaTrash className="text-white text-sm" />
                              </button>
                            </div>
                          </div>
                          {cert.credential_url && (
                            <a
                              href={cert.credential_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-slate-400 hover:text-cyan-400 flex items-center gap-1 mt-2"
                            >
                              <FaLink /> View Certificate
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Messages Tab */}
                {activeTab === 'messages' && (
                  <div className="space-y-4">
                    {messages.map(msg => (
                      <div key={msg.id} className={`bg-slate-800 rounded-2xl p-6 border transition-all duration-300 ${msg.status === 'unread'
                        ? 'border-cyan-400 bg-cyan-900/10'
                        : 'border-slate-700'
                        }`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <FaUser className="text-cyan-400" />
                                {msg.name}
                              </h3>
                              {msg.status === 'unread' && (
                                <span className="px-3 py-1 bg-cyan-600 text-white text-xs rounded-full">NEW</span>
                              )}
                            </div>
                            <p className="text-slate-400 text-sm mb-2">{msg.email}</p>
                            <p className="text-white mt-3">{msg.message}</p>
                            <p className="text-slate-500 text-xs mt-3">
                              {new Date(msg.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {msg.status === 'unread' && (
                              <button
                                onClick={() => updateMessageStatus(msg.id, 'read')}
                                className="p-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors duration-300"
                                title="Mark as read"
                              >
                                <FaCheck className="text-white" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteMessage(msg.id)}
                              className="p-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors duration-300"
                              title="Delete"
                            >
                              <FaTrash className="text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {messages.length === 0 && (
                      <div className="text-center py-12 text-slate-400">
                        <FaEnvelope className="text-4xl mx-auto mb-4 opacity-50" />
                        <p>No messages yet</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Comments Tab */}
                {activeTab === 'comments' && (
                  <div className="space-y-4">
                    {comments.map(comment => (
                      <div
                        key={comment.id}
                        className={`rounded-2xl p-6 border transition-all duration-300 ${comment.is_pinned
                          ? 'bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-400/50 shadow-lg'
                          : 'bg-slate-800 border-slate-700 hover:border-cyan-400/50'
                          }`}
                      >
                        {/* Pin Indicator */}
                        {comment.is_pinned && (
                          <div className="mb-3 flex items-center gap-2 text-cyan-400">
                            <FaThumbtack className="w-5 h-5" />
                            <span className="text-sm font-semibold">Pinned Comment</span>
                          </div>
                        )}

                        <div className="flex gap-4">
                          <img
                            src={comment.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.name)}&background=00ffdc&color=000754&size=100`}
                            alt={comment.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-slate-600"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-bold text-white">{comment.name}</h3>
                                <p className="text-slate-400 text-sm">
                                  {new Date(comment.created_at).toLocaleString()}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                {/* Pin/Unpin Button */}
                                <button
                                  onClick={() => togglePinComment(comment.id, comment.is_pinned)}
                                  className={`p-2 rounded-lg transition-colors duration-300 ${comment.is_pinned
                                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                    }`}
                                  title={comment.is_pinned ? 'Unpin comment' : 'Pin comment'}
                                >
                                  <FaThumbtack className="w-5 h-5" />
                                </button>
                                {/* Delete Button */}
                                <button
                                  onClick={() => deleteComment(comment.id)}
                                  className="p-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors duration-300"
                                  title="Delete"
                                >
                                  <FaTrash className="text-white" />
                                </button>
                              </div>
                            </div>
                            <p className="text-white mt-3">{comment.message}</p>
                            <div className="flex items-center gap-2 mt-3 text-slate-400">
                              <FaHeart className="text-red-400" />
                              <span className="text-sm">{comment.likes || 0} likes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {comments.length === 0 && (
                      <div className="text-center py-12 text-slate-400">
                        <FaComments className="text-4xl mx-auto mb-4 opacity-50" />
                        <p>No comments yet</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminDashboard;
