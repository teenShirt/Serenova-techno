// Centralized API client for public website and CMS Admin

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const defaultHeaders = {};

  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    },
    credentials: 'include' // Always send HttpOnly authentication cookies
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn(`[API Fetch Warning] ${endpoint}:`, err.message);
    return {
      success: false,
      message: 'Network error or server unreachable',
      fallback: true
    };
  }
}

export const api = {
  // Public
  getPublicSite: () => request('/public/site'),
  getPublicServices: () => request('/public/services'),
  getPublicServiceBySlug: (slug) => request(`/public/services/${slug}`),
  getPublicProjects: () => request('/public/projects'),
  getPublicProjectBySlug: (slug) => request(`/public/projects/${slug}`),
  getPublicFaqs: () => request('/public/faqs'),
  postPublicContact: (data) => request('/public/contact', { method: 'POST', body: JSON.stringify(data) }),

  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getSession: () => request('/auth/session'),
  changePassword: (data) => request('/auth/password', { method: 'PUT', body: JSON.stringify(data) }),

  // Admin Dashboard & Lead Pipeline
  getDashboardMetrics: () => request('/admin/dashboard'),
  getLeads: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/leads${query ? `?${query}` : ''}`);
  },
  getLeadById: (id) => request(`/admin/leads/${id}`),
  patchLead: (id, data) => request(`/admin/leads/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  addLeadNote: (id, note) => request(`/admin/leads/${id}/notes`, { method: 'POST', body: JSON.stringify({ note }) }),
  getLeadsExportUrl: () => `${API_BASE}/admin/leads/export`,

  // Content & CRUD
  getContent: () => request('/admin/content'),
  updateContentSection: (section_key, content_json) => request('/admin/content', { method: 'PUT', body: JSON.stringify({ section_key, content_json }) }),

  getServices: () => request('/admin/services'),
  createService: (data) => request('/admin/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (id, data) => request(`/admin/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteService: (id) => request(`/admin/services/${id}`, { method: 'DELETE' }),

  getProjects: () => request('/admin/projects'),
  createProject: (data) => request('/admin/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id, data) => request(`/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id) => request(`/admin/projects/${id}`, { method: 'DELETE' }),

  getFaqs: () => request('/admin/faqs'),
  createFaq: (data) => request('/admin/faqs', { method: 'POST', body: JSON.stringify(data) }),
  updateFaq: (id, data) => request(`/admin/faqs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteFaq: (id) => request(`/admin/faqs/${id}`, { method: 'DELETE' }),

  getMessages: () => request('/admin/messages'),
  markMessageRead: (id, is_read) => request(`/admin/messages/${id}`, { method: 'PATCH', body: JSON.stringify({ is_read }) }),
  deleteMessage: (id) => request(`/admin/messages/${id}`, { method: 'DELETE' }),

  getMedia: () => request('/admin/media'),
  uploadMedia: (formData) => request('/admin/media', { method: 'POST', body: formData }),
  deleteMedia: (id) => request(`/admin/media/${id}`, { method: 'DELETE' }),

  getSettings: () => request('/admin/settings'),
  updateSettings: (data) => request('/admin/settings', { method: 'PUT', body: JSON.stringify(data) })
};
