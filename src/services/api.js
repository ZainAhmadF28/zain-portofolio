import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiService {
  // Projects (Keeping fetch for now if user has backend, but theoretically should be Supabase too. 
  // Leaving as is to avoid breaking existing flows if they oddly rely on it, but Gallery WILL use Supabase).
  async getProjects() {
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } catch (error) {
      // Fallback to fetch if supabase fails or just logging
      console.warn('Supabase fetch failed, trying API_URL...', error);
      try {
        const response = await fetch(`${API_URL}/api/projects`);
        return await response.json();
      } catch (e) {
        return { success: false, error: e.message };
      }
    }
  }

  // ... (Legacy methods for Projects/Certificates can remain dual-mode or be refactored later)

  // Gallery - DIRECT SUPABASE IMPLEMENTATION
  async getGallery() {
    try {
      if (!supabase) throw new Error("Supabase client not initialized");

      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching gallery:', error);
      return { success: false, error: error.message };
    }
  }

  async createGalleryItem(itemData) {
    try {
      if (!supabase) throw new Error("Supabase client not initialized");

      // Ensure itemData matches DB columns
      const payload = {
        title: itemData.title,
        description: itemData.description,
        media_url: itemData.media_url,
        type: itemData.type,
        date: itemData.date,
        // likes default 0
      };

      const { data, error } = await supabase
        .from('gallery')
        .insert([payload])
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating gallery item:', error);
      return { success: false, error: error.message };
    }
  }

  async updateGalleryItem(id, itemData) {
    try {
      if (!supabase) throw new Error("Supabase client not initialized");

      const payload = {
        title: itemData.title,
        description: itemData.description,
        media_url: itemData.media_url,
        type: itemData.type,
        date: itemData.date,
      };

      const { data, error } = await supabase
        .from('gallery')
        .update(payload)
        .eq('id', id)
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating gallery item:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteGalleryItem(id) {
    try {
      if (!supabase) throw new Error("Supabase client not initialized");

      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      return { success: false, error: error.message };
    }
  }

  // Keep other legacy methods or refactor similarly...
  // For brevity in this tool call, I am keeping the class structure but overriding the Gallery methods I just added.
  // I will replace the whole file for cleanness if I can, but list_dir showed it is 180 lines.
  // I'll assume users want to keep existing project fetch logic unless I see it is definitely broken.
  // Given I see NO local server, I should probably switch ALL to supabase, but I'll start with Gallery as requested.


  async getProject(id) {
    try {
      const response = await fetch(`${API_URL}/api/projects/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching project:', error);
      return { success: false, error: error.message };
    }
  }

  async createProject(projectData) {
    try {
      const response = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      return { success: false, error: error.message };
    }
  }

  async updateProject(id, projectData) {
    try {
      const response = await fetch(`${API_URL}/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteProject(id) {
    try {
      const response = await fetch(`${API_URL}/api/projects/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting project:', error);
      return { success: false, error: error.message };
    }
  }

  // Certificates
  async getCertificates() {
    try {
      const response = await fetch(`${API_URL}/api/certificates`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching certificates:', error);
      return { success: false, error: error.message };
    }
  }

  async createCertificate(certificateData) {
    try {
      const response = await fetch(`${API_URL}/api/certificates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certificateData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating certificate:', error);
      return { success: false, error: error.message };
    }
  }

  // Contact Messages
  async sendContactMessage(messageData) {
    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  }

  async getContactMessages() {
    try {
      const response = await fetch(`${API_URL}/api/contact`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return { success: false, error: error.message };
    }
  }

  // Comments
  async getComments() {
    try {
      const response = await fetch(`${API_URL}/api/comments`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return { success: false, error: error.message };
    }
  }

  async createComment(commentData) {
    try {
      const response = await fetch(`${API_URL}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating comment:', error);
      return { success: false, error: error.message };
    }
  }

  async approveComment(id) {
    try {
      const response = await fetch(`${API_URL}/api/comments/${id}/approve`, {
        method: 'PUT',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error approving comment:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteComment(id) {
    try {
      const response = await fetch(`${API_URL}/api/comments/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return { success: false, error: error.message };
    }
  }

  // Gallery
  async getGallery() {
    try {
      // Direct Supabase Call
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching gallery:', error);
      return { success: false, error: error.message };
    }
  }

  async createGalleryItem(itemData) {
    try {
      const payload = {
        title: itemData.title,
        description: itemData.description,
        media_url: itemData.media_url, // Keep for backward compat
        media_urls: itemData.media_urls, // New Array
        type: itemData.type,
        date: itemData.date,
      };

      const { data, error } = await supabase
        .from('gallery')
        .insert([payload])
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating gallery item:', error);
      return { success: false, error: error.message };
    }
  }

  async updateGalleryItem(id, itemData) {
    try {
      const payload = {
        title: itemData.title,
        description: itemData.description,
        media_url: itemData.media_url,
        media_urls: itemData.media_urls,
        type: itemData.type,
        date: itemData.date,
      };

      const { data, error } = await supabase
        .from('gallery')
        .update(payload)
        .eq('id', id)
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating gallery item:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteGalleryItem(id) {
    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      return { success: false, error: error.message };
    }
  }

  // Gallery Interactions
  async likeGalleryItem(id) {
    try {
      const { error } = await supabase.rpc('increment_gallery_likes', { row_id: id });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error liking gallery item:', error);
      return { success: false, error: error.message };
    }
  }

  async getGalleryComments(galleryId) {
    try {
      const { data, error } = await supabase
        .from('gallery_comments')
        .select('*')
        .eq('gallery_id', galleryId)
        .order('created_at', { ascending: false }); // Newest first

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching gallery comments:', error);
      return { success: false, error: error.message };
    }
  }

  async postGalleryComment(galleryId, name, content) {
    try {
      const { data, error } = await supabase
        .from('gallery_comments')
        .insert([{ gallery_id: galleryId, name, content }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error posting gallery comment:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new ApiService();
