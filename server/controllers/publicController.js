import { query } from '../config/db.js';
import { z } from 'zod';
import crypto from 'crypto';

const contactSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(50).optional().nullable(),
  company: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  clientType: z.string().max(100).optional().nullable(),
  requiredService: z.string().max(150).optional().nullable(),
  budgetRange: z.string().max(100).optional().nullable(),
  urgency: z.string().max(100).optional().nullable(),
  preferredContactMethod: z.string().max(50).optional().nullable(),
  projectSummary: z.string().min(10, 'Project summary must be at least 10 characters').max(3000),
  consent: z.union([z.boolean(), z.string()]).refine(val => val === true || val === 'true', {
    message: 'Consent is required to submit an enquiry'
  }),
  website_url_hp: z.string().optional().nullable(), // Honeypot
  form_load_time: z.number().optional().nullable() // Submit time check
});

function generateRefNumber() {
  const now = new Date();
  const yearMonth = now.toISOString().slice(0, 7).replace('-', '');
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `ST-${yearMonth}-${randomHex}`;
}

export async function getPublicSite(req, res) {
  try {
    const settingsRows = await query('SELECT setting_key, setting_value FROM site_settings');
    const contentRows = await query('SELECT section_key, content_json FROM site_content');

    const settings = {};
    if (settingsRows && settingsRows.length > 0) {
      settingsRows.forEach(r => {
        settings[r.setting_key] = r.setting_value;
      });
    }

    const content = {};
    if (contentRows && contentRows.length > 0) {
      contentRows.forEach(r => {
        try {
          content[r.section_key] = typeof r.content_json === 'string' ? JSON.parse(r.content_json) : r.content_json;
        } catch (e) {
          content[r.section_key] = r.content_json;
        }
      });
    }

    return res.json({
      success: true,
      settings,
      content
    });
  } catch (err) {
    return res.json({
      success: true,
      settings: {},
      content: {},
      fallback: true
    });
  }
}

export async function getPublicServices(req, res) {
  try {
    const rows = await query(
      'SELECT * FROM services WHERE is_published = 1 ORDER BY display_order ASC, id ASC'
    );

    const services = rows.map(r => ({
      ...r,
      techStack: r.tech_stack_json ? (typeof r.tech_stack_json === 'string' ? JSON.parse(r.tech_stack_json) : r.tech_stack_json) : [],
      features: r.features_json ? (typeof r.features_json === 'string' ? JSON.parse(r.features_json) : r.features_json) : [],
      deliverables: r.deliverables_json ? (typeof r.deliverables_json === 'string' ? JSON.parse(r.deliverables_json) : r.deliverables_json) : []
    }));

    return res.json({
      success: true,
      services
    });
  } catch (err) {
    return res.json({
      success: true,
      services: [],
      fallback: true
    });
  }
}

export async function getPublicServiceBySlug(req, res) {
  try {
    const { slug } = req.params;
    const rows = await query(
      'SELECT * FROM services WHERE (slug = ? OR service_key = ? OR id = ?) AND is_published = 1 LIMIT 1',
      [slug, slug, isNaN(slug) ? 0 : parseInt(slug, 10)]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or is currently unpublished'
      });
    }

    const r = rows[0];
    const service = {
      ...r,
      techStack: r.tech_stack_json ? (typeof r.tech_stack_json === 'string' ? JSON.parse(r.tech_stack_json) : r.tech_stack_json) : [],
      features: r.features_json ? (typeof r.features_json === 'string' ? JSON.parse(r.features_json) : r.features_json) : [],
      deliverables: r.deliverables_json ? (typeof r.deliverables_json === 'string' ? JSON.parse(r.deliverables_json) : r.deliverables_json) : []
    };

    return res.json({
      success: true,
      service
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve service details'
    });
  }
}

export async function getPublicProjects(req, res) {
  try {
    const rows = await query(
      'SELECT * FROM projects WHERE is_published = 1 ORDER BY is_featured DESC, display_order ASC, id ASC'
    );

    const projects = rows.map(r => ({
      ...r,
      techStack: r.tech_stack_json ? (typeof r.tech_stack_json === 'string' ? JSON.parse(r.tech_stack_json) : r.tech_stack_json) : [],
      gallery: r.gallery_json ? (typeof r.gallery_json === 'string' ? JSON.parse(r.gallery_json) : r.gallery_json) : []
    }));

    return res.json({
      success: true,
      projects
    });
  } catch (err) {
    return res.json({
      success: true,
      projects: [],
      fallback: true
    });
  }
}

export async function getPublicProjectBySlug(req, res) {
  try {
    const { slug } = req.params;
    const rows = await query(
      'SELECT * FROM projects WHERE (slug = ? OR id = ?) AND is_published = 1 LIMIT 1',
      [slug, isNaN(slug) ? 0 : parseInt(slug, 10)]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found or is currently unpublished'
      });
    }

    const r = rows[0];
    const project = {
      ...r,
      techStack: r.tech_stack_json ? (typeof r.tech_stack_json === 'string' ? JSON.parse(r.tech_stack_json) : r.tech_stack_json) : [],
      gallery: r.gallery_json ? (typeof r.gallery_json === 'string' ? JSON.parse(r.gallery_json) : r.gallery_json) : []
    };

    return res.json({
      success: true,
      project
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve case study details'
    });
  }
}

export async function getPublicFaqs(req, res) {
  try {
    const rows = await query(
      'SELECT * FROM faqs WHERE is_published = 1 ORDER BY display_order ASC, id ASC'
    );

    return res.json({
      success: true,
      faqs: rows
    });
  } catch (err) {
    return res.json({
      success: true,
      faqs: [],
      fallback: true
    });
  }
}

export async function postPublicContact(req, res) {
  try {
    // 1. Honeypot check
    if (req.body.website_url_hp) {
      // Quietly reject bot submissions without warning them
      return res.json({
        success: true,
        message: 'Thank you! Your enquiry reference ST-202609-BOTCHECK has been recorded.',
        referenceNumber: 'ST-202609-BOTCHECK'
      });
    }

    // 2. Form submission duration check (minimum 2 seconds to discourage simple scripts)
    if (req.body.form_load_time) {
      const elapsed = Date.now() - Number(req.body.form_load_time);
      if (elapsed < 2000) {
        return res.status(400).json({
          success: false,
          message: 'Submission completed too quickly. Please take a moment to review your enquiry.'
        });
      }
    }

    // 3. Schema validation
    const validationResult = contactSchema.safeParse(req.body);

    if (!validationResult.success) {
      const issue = validationResult.error.issues[0];
      return res.status(400).json({
        success: false,
        message: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Validation error'
      });
    }

    const {
      name,
      email,
      phone,
      company,
      country,
      clientType,
      requiredService,
      budgetRange,
      urgency,
      preferredContactMethod,
      projectSummary
    } = validationResult.data;

    const referenceNumber = generateRefNumber();
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const subject = requiredService ? `Enquiry: ${requiredService}` : 'New Consultation Request';

    await query(
      `INSERT INTO contact_messages 
       (reference_number, name, email, phone, company, country, client_type, required_service, budget_range, urgency, preferred_contact_method, subject, message, consent, status, priority, ip_address) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'new', 'medium', ?)`,
      [
        referenceNumber,
        name,
        email,
        phone || null,
        company || null,
        country || null,
        clientType || 'General Client',
        requiredService || 'General Consultation',
        budgetRange || null,
        urgency || 'Standard',
        preferredContactMethod || 'Email',
        subject,
        projectSummary,
        ipAddress
      ]
    );

    return res.json({
      success: true,
      message: 'Thank you! Your consultation request has been recorded successfully.',
      referenceNumber
    });
  } catch (err) {
    console.error('[Contact Error]', err);
    return res.status(500).json({
      success: false,
      message: 'Unable to process your enquiry at this time. Please try again or contact us directly.'
    });
  }
}
