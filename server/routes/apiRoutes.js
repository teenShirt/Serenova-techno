import express from 'express';
import rateLimit from 'express-rate-limit';

import {
  getPublicSite,
  getPublicServices,
  getPublicServiceBySlug,
  getPublicProjects,
  getPublicProjectBySlug,
  getPublicFaqs,
  postPublicContact
} from '../controllers/publicController.js';

import {
  login,
  logout,
  getSession,
  changePassword
} from '../controllers/authController.js';

import {
  getDashboardMetrics,
  getContent,
  updateContentSection,
  getAdminServices,
  createService,
  updateService,
  deleteService,
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
  getAdminFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  getLeads,
  getLeadById,
  patchLead,
  addLeadNote,
  exportLeadsCsv,
  getMessages,
  markMessageRead,
  deleteMessage,
  getMedia,
  handleUploadMedia,
  deleteMedia,
  getSettings,
  updateSettings
} from '../controllers/adminController.js';

import { requireAdminAuth } from '../middleware/authMiddleware.js';
import { uploadSingle } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Rate Limiters
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' }
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many enquiry submissions. Please try again after 15 minutes.' }
});

// --- PUBLIC ROUTES ---
router.get('/public/site', getPublicSite);
router.get('/public/services', getPublicServices);
router.get('/public/services/:slug', getPublicServiceBySlug);
router.get('/public/projects', getPublicProjects);
router.get('/public/projects/:slug', getPublicProjectBySlug);
router.get('/public/faqs', getPublicFaqs);
router.post('/public/contact', contactLimiter, postPublicContact);

// --- AUTHENTICATION ROUTES ---
router.post('/auth/login', loginLimiter, login);
router.post('/auth/logout', logout);
router.get('/auth/session', requireAdminAuth, getSession);
router.put('/auth/password', requireAdminAuth, changePassword);

// --- PROTECTED ADMIN CMS ROUTES ---
router.use('/admin', requireAdminAuth);

// Dashboard
router.get('/admin/dashboard', getDashboardMetrics);

// Lead Management Pipeline
router.get('/admin/leads/export', exportLeadsCsv);
router.get('/admin/leads', getLeads);
router.get('/admin/leads/:id', getLeadById);
router.patch('/admin/leads/:id', patchLead);
router.post('/admin/leads/:id/notes', addLeadNote);

// Backward Compatibility Messages
router.get('/admin/messages', getMessages);
router.patch('/admin/messages/:id', markMessageRead);
router.delete('/admin/messages/:id', deleteMessage);

// Site Content
router.get('/admin/content', getContent);
router.put('/admin/content', updateContentSection);

// Services
router.get('/admin/services', getAdminServices);
router.post('/admin/services', createService);
router.put('/admin/services/:id', updateService);
router.delete('/admin/services/:id', deleteService);

// Projects
router.get('/admin/projects', getAdminProjects);
router.post('/admin/projects', createProject);
router.put('/admin/projects/:id', updateProject);
router.delete('/admin/projects/:id', deleteProject);

// FAQs
router.get('/admin/faqs', getAdminFaqs);
router.post('/admin/faqs', createFaq);
router.put('/admin/faqs/:id', updateFaq);
router.delete('/admin/faqs/:id', deleteFaq);

// Media Library
router.get('/admin/media', getMedia);
router.post('/admin/media', uploadSingle, handleUploadMedia);
router.delete('/admin/media/:id', deleteMedia);

// Site Settings
router.get('/admin/settings', getSettings);
router.put('/admin/settings', updateSettings);

export default router;
