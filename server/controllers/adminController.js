import { query } from '../config/db.js';
import fs from 'fs';
import path from 'path';

function formatDbError(err) {
  if (err && (err.code === 'ECONNREFUSED' || (err.message && err.message.includes('ECONNREFUSED')))) {
    return 'Database is currently offline. Please start your MySQL service on port 3306 to save changes to the database.';
  }
  return err ? (err.message || 'Database error occurred.') : 'An error occurred.';
}

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// --- DASHBOARD METRICS ---
export async function getDashboardMetrics(req, res) {
  try {
    const [servicesCount] = await query('SELECT COUNT(*) as count FROM services');
    const [projectsCount] = await query('SELECT COUNT(*) as count FROM projects');
    const [faqsCount] = await query('SELECT COUNT(*) as count FROM faqs');
    const [mediaCount] = await query('SELECT COUNT(*) as count FROM media');

    const [newLeads] = await query("SELECT COUNT(*) as count FROM contact_messages WHERE status = 'new' AND is_archived = 0");
    const [qualifiedLeads] = await query("SELECT COUNT(*) as count FROM contact_messages WHERE status = 'qualified' AND is_archived = 0");
    const [pendingFollowups] = await query("SELECT COUNT(*) as count FROM contact_messages WHERE follow_up_date IS NOT NULL AND follow_up_date <= CURDATE() AND is_archived = 0");
    const [proposalsSent] = await query("SELECT COUNT(*) as count FROM contact_messages WHERE status = 'proposal_sent' AND is_archived = 0");
    const [wonLeads] = await query("SELECT COUNT(*) as count FROM contact_messages WHERE status = 'won' AND is_archived = 0");
    const [closedLeads] = await query("SELECT COUNT(*) as count FROM contact_messages WHERE status = 'closed' AND is_archived = 0");

    const serviceBreakdown = await query(
      `SELECT COALESCE(required_service, 'General Consultation') as service_name, COUNT(*) as lead_count 
       FROM contact_messages 
       WHERE is_archived = 0
       GROUP BY required_service 
       ORDER BY lead_count DESC`
    );

    const recentLeads = await query(
      `SELECT id, reference_number, name, email, required_service, status, priority, created_at 
       FROM contact_messages 
       WHERE is_archived = 0
       ORDER BY created_at DESC 
       LIMIT 5`
    );

    return res.json({
      success: true,
      metrics: {
        servicesCount: servicesCount?.count || 0,
        projectsCount: projectsCount?.count || 0,
        faqsCount: faqsCount?.count || 0,
        mediaCount: mediaCount?.count || 0,
        newLeads: newLeads?.count || 0,
        qualifiedLeads: qualifiedLeads?.count || 0,
        pendingFollowups: pendingFollowups?.count || 0,
        proposalsSent: proposalsSent?.count || 0,
        wonLeads: wonLeads?.count || 0,
        closedLeads: closedLeads?.count || 0,
        serviceBreakdown: serviceBreakdown || [],
        recentLeads: recentLeads || []
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: formatDbError(err) });
  }
}

// --- SITE CONTENT ---
export async function getContent(req, res) {
  try {
    const rows = await query('SELECT * FROM site_content');
    const contentMap = {};
    rows.forEach(r => {
      try {
        contentMap[r.section_key] = typeof r.content_json === 'string' ? JSON.parse(r.content_json) : r.content_json;
      } catch (e) {
        contentMap[r.section_key] = r.content_json;
      }
    });
    return res.json({ success: true, content: contentMap });
  } catch (err) {
    return res.json({ success: true, content: {}, warning: formatDbError(err) });
  }
}

export async function updateContentSection(req, res) {
  try {
    const { section_key, content_json } = req.body;
    if (!section_key || !content_json) {
      return res.status(400).json({ success: false, message: 'section_key and content_json are required.' });
    }

    const jsonString = typeof content_json === 'string' ? content_json : JSON.stringify(content_json);
    const updatedBy = req.admin ? req.admin.username : 'admin';

    await query(
      `INSERT INTO site_content (section_key, content_json, updated_by)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE content_json = VALUES(content_json), updated_by = VALUES(updated_by)`,
      [section_key, jsonString, updatedBy]
    );

    return res.json({ success: true, message: `Section '${section_key}' updated successfully.` });
  } catch (err) {
    return res.status(500).json({ success: false, message: formatDbError(err) });
  }
}

// --- SERVICES CRUD ---
export async function getAdminServices(req, res) {
  try {
    const rows = await query('SELECT * FROM services ORDER BY display_order ASC, id ASC');
    const services = rows.map(r => ({
      ...r,
      techStack: r.tech_stack_json ? (typeof r.tech_stack_json === 'string' ? JSON.parse(r.tech_stack_json) : r.tech_stack_json) : [],
      features: r.features_json ? (typeof r.features_json === 'string' ? JSON.parse(r.features_json) : r.features_json) : [],
      deliverables: r.deliverables_json ? (typeof r.deliverables_json === 'string' ? JSON.parse(r.deliverables_json) : r.deliverables_json) : []
    }));
    return res.json({ success: true, services });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createService(req, res) {
  try {
    const {
      service_key,
      slug,
      title,
      category,
      short_desc,
      full_desc,
      problem_solved,
      deliverables,
      ideal_customer,
      starting_price,
      icon_name,
      image_url,
      techStack,
      features,
      seo_title,
      seo_description,
      display_order,
      is_published
    } = req.body;

    if (!title || !short_desc) {
      return res.status(400).json({ success: false, message: 'Title and short description are required.' });
    }

    const key = service_key || `service-${Date.now()}`;
    const cleanSlug = slugify(slug || title) || key;
    const techJson = JSON.stringify(techStack || []);
    const featJson = JSON.stringify(features || []);
    const delivJson = JSON.stringify(deliverables || []);

    const result = await query(
      `INSERT INTO services 
       (service_key, slug, title, category, short_desc, full_desc, problem_solved, deliverables_json, ideal_customer, starting_price, icon_name, image_url, tech_stack_json, features_json, seo_title, seo_description, display_order, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        key,
        cleanSlug,
        title,
        category || 'General Service',
        short_desc,
        full_desc || short_desc,
        problem_solved || null,
        delivJson,
        ideal_customer || null,
        starting_price || null,
        icon_name || 'Server',
        image_url || null,
        techJson,
        featJson,
        seo_title || null,
        seo_description || null,
        display_order || 0,
        is_published !== undefined ? (is_published ? 1 : 0) : 1
      ]
    );

    return res.json({ success: true, message: 'Service created successfully.', id: result.insertId, slug: cleanSlug });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateService(req, res) {
  try {
    const { id } = req.params;
    const {
      slug,
      title,
      category,
      short_desc,
      full_desc,
      problem_solved,
      deliverables,
      ideal_customer,
      starting_price,
      icon_name,
      image_url,
      techStack,
      features,
      seo_title,
      seo_description,
      display_order,
      is_published
    } = req.body;

    const cleanSlug = slugify(slug || title) || `service-${id}`;
    const techJson = JSON.stringify(techStack || []);
    const featJson = JSON.stringify(features || []);
    const delivJson = JSON.stringify(deliverables || []);

    await query(
      `UPDATE services 
       SET slug=?, title=?, category=?, short_desc=?, full_desc=?, problem_solved=?, deliverables_json=?, ideal_customer=?, starting_price=?, icon_name=?, image_url=?, tech_stack_json=?, features_json=?, seo_title=?, seo_description=?, display_order=?, is_published=?
       WHERE id=?`,
      [
        cleanSlug,
        title,
        category,
        short_desc,
        full_desc,
        problem_solved || null,
        delivJson,
        ideal_customer || null,
        starting_price || null,
        icon_name,
        image_url,
        techJson,
        featJson,
        seo_title || null,
        seo_description || null,
        display_order,
        is_published ? 1 : 0,
        id
      ]
    );

    return res.json({ success: true, message: 'Service updated successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteService(req, res) {
  try {
    const { id } = req.params;
    await query('DELETE FROM services WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Service deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// --- PROJECTS / CASE STUDIES CRUD ---
export async function getAdminProjects(req, res) {
  try {
    const rows = await query('SELECT * FROM projects ORDER BY display_order ASC, id ASC');
    const projects = rows.map(r => ({
      ...r,
      techStack: r.tech_stack_json ? (typeof r.tech_stack_json === 'string' ? JSON.parse(r.tech_stack_json) : r.tech_stack_json) : [],
      gallery: r.gallery_json ? (typeof r.gallery_json === 'string' ? JSON.parse(r.gallery_json) : r.gallery_json) : []
    }));
    return res.json({ success: true, projects });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createProject(req, res) {
  try {
    const {
      slug,
      title,
      category,
      service_category,
      client_type,
      description,
      challenge,
      solution,
      result,
      client_name,
      project_url,
      image_url,
      gallery,
      techStack,
      project_date,
      completion_date,
      seo_title,
      seo_description,
      is_featured,
      is_published,
      display_order
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    const cleanSlug = slugify(slug || title) || `project-${Date.now()}`;
    const techJson = JSON.stringify(techStack || []);
    const galleryJson = JSON.stringify(gallery || []);

    const resDb = await query(
      `INSERT INTO projects 
       (slug, title, category, service_category, client_type, description, challenge, solution, result, client_name, project_url, image_url, gallery_json, tech_stack_json, project_date, completion_date, seo_title, seo_description, is_featured, is_published, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cleanSlug,
        title,
        category || 'IT Solution',
        service_category || null,
        client_type || null,
        description,
        challenge || null,
        solution || null,
        result || null,
        client_name || null,
        project_url || null,
        image_url || null,
        galleryJson,
        techJson,
        project_date || null,
        completion_date || null,
        seo_title || null,
        seo_description || null,
        is_featured ? 1 : 0,
        is_published !== undefined ? (is_published ? 1 : 0) : 1,
        display_order || 0
      ]
    );

    return res.json({ success: true, message: 'Case study created successfully.', id: resDb.insertId, slug: cleanSlug });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const {
      slug,
      title,
      category,
      service_category,
      client_type,
      description,
      challenge,
      solution,
      result,
      client_name,
      project_url,
      image_url,
      gallery,
      techStack,
      project_date,
      completion_date,
      seo_title,
      seo_description,
      is_featured,
      is_published,
      display_order
    } = req.body;

    const cleanSlug = slugify(slug || title) || `project-${id}`;
    const techJson = JSON.stringify(techStack || []);
    const galleryJson = JSON.stringify(gallery || []);

    await query(
      `UPDATE projects 
       SET slug=?, title=?, category=?, service_category=?, client_type=?, description=?, challenge=?, solution=?, result=?, client_name=?, project_url=?, image_url=?, gallery_json=?, tech_stack_json=?, project_date=?, completion_date=?, seo_title=?, seo_description=?, is_featured=?, is_published=?, display_order=?
       WHERE id=?`,
      [
        cleanSlug,
        title,
        category,
        service_category || null,
        client_type || null,
        description,
        challenge || null,
        solution || null,
        result || null,
        client_name || null,
        project_url || null,
        image_url || null,
        galleryJson,
        techJson,
        project_date || null,
        completion_date || null,
        seo_title || null,
        seo_description || null,
        is_featured ? 1 : 0,
        is_published ? 1 : 0,
        display_order || 0,
        id
      ]
    );

    return res.json({ success: true, message: 'Case study updated successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteProject(req, res) {
  try {
    const { id } = req.params;
    await query('DELETE FROM projects WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// --- FAQS CRUD ---
export async function getAdminFaqs(req, res) {
  try {
    const rows = await query('SELECT * FROM faqs ORDER BY display_order ASC, id ASC');
    return res.json({ success: true, faqs: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function createFaq(req, res) {
  try {
    const { question, answer, display_order, is_published } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Question and answer are required.' });
    }

    const result = await query(
      `INSERT INTO faqs (question, answer, display_order, is_published) VALUES (?, ?, ?, ?)`,
      [question, answer, display_order || 0, is_published !== undefined ? (is_published ? 1 : 0) : 1]
    );

    return res.json({ success: true, message: 'FAQ created successfully.', id: result.insertId });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateFaq(req, res) {
  try {
    const { id } = req.params;
    const { question, answer, display_order, is_published } = req.body;

    await query(
      `UPDATE faqs SET question=?, answer=?, display_order=?, is_published=? WHERE id=?`,
      [question, answer, display_order, is_published ? 1 : 0, id]
    );

    return res.json({ success: true, message: 'FAQ updated successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteFaq(req, res) {
  try {
    const { id } = req.params;
    await query('DELETE FROM faqs WHERE id = ?', [id]);
    return res.json({ success: true, message: 'FAQ deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// --- LEAD MANAGEMENT PIPELINE ---
export async function getLeads(req, res) {
  try {
    const { status, priority, service, search, includeArchived, page = 1, limit = 20 } = req.query;

    let whereConditions = [];
    let params = [];

    if (!includeArchived || includeArchived === 'false') {
      whereConditions.push('is_archived = 0');
    }

    if (status && status !== 'all') {
      whereConditions.push('status = ?');
      params.push(status);
    }

    if (priority && priority !== 'all') {
      whereConditions.push('priority = ?');
      params.push(priority);
    }

    if (service && service !== 'all') {
      whereConditions.push('required_service = ?');
      params.push(service);
    }

    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      whereConditions.push('(name LIKE ? OR email LIKE ? OR reference_number LIKE ? OR company LIKE ? OR message LIKE ?)');
      params.push(q, q, q, q, q);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    const [totalRow] = await query(`SELECT COUNT(*) as count FROM contact_messages ${whereClause}`, params);
    const total = totalRow?.count || 0;

    const leads = await query(
      `SELECT id, reference_number, name, email, phone, company, country, client_type, required_service, budget_range, urgency, preferred_contact_method, subject, consent, status, priority, follow_up_date, is_read, is_archived, created_at
       FROM contact_messages
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    return res.json({
      success: true,
      leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function getLeadById(req, res) {
  try {
    const { id } = req.params;

    const rows = await query('SELECT * FROM contact_messages WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Lead record not found' });
    }

    const lead = rows[0];

    // Auto mark read if unread
    if (!lead.is_read) {
      await query('UPDATE contact_messages SET is_read = 1 WHERE id = ?', [id]);
      lead.is_read = 1;
    }

    // Fetch Notes
    const notes = await query(
      `SELECT n.id, n.note, n.created_at, u.username as admin_name 
       FROM lead_notes n 
       LEFT JOIN admin_users u ON n.admin_user_id = u.id 
       WHERE n.contact_message_id = ? 
       ORDER BY n.created_at DESC`,
      [id]
    );

    // Fetch Activity Log
    const activity = await query(
      `SELECT a.id, a.action, a.old_value, a.new_value, a.created_at, u.username as admin_name 
       FROM lead_activity a 
       LEFT JOIN admin_users u ON a.admin_user_id = u.id 
       WHERE a.contact_message_id = ? 
       ORDER BY a.created_at DESC`,
      [id]
    );

    return res.json({
      success: true,
      lead,
      notes: notes || [],
      activity: activity || []
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function patchLead(req, res) {
  try {
    const { id } = req.params;
    const { status, priority, follow_up_date, is_archived } = req.body;
    const adminId = req.admin ? req.admin.id : null;

    const rows = await query('SELECT * FROM contact_messages WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    const currentLead = rows[0];

    if (status && status !== currentLead.status) {
      await query('UPDATE contact_messages SET status = ? WHERE id = ?', [status, id]);
      await query(
        'INSERT INTO lead_activity (contact_message_id, admin_user_id, action, old_value, new_value) VALUES (?, ?, ?, ?, ?)',
        [id, adminId, 'STATUS_CHANGE', currentLead.status, status]
      );
    }

    if (priority && priority !== currentLead.priority) {
      await query('UPDATE contact_messages SET priority = ? WHERE id = ?', [priority, id]);
      await query(
        'INSERT INTO lead_activity (contact_message_id, admin_user_id, action, old_value, new_value) VALUES (?, ?, ?, ?, ?)',
        [id, adminId, 'PRIORITY_CHANGE', currentLead.priority, priority]
      );
    }

    if (follow_up_date !== undefined) {
      const fDate = follow_up_date || null;
      await query('UPDATE contact_messages SET follow_up_date = ? WHERE id = ?', [fDate, id]);
      await query(
        'INSERT INTO lead_activity (contact_message_id, admin_user_id, action, old_value, new_value) VALUES (?, ?, ?, ?, ?)',
        [id, adminId, 'FOLLOW_UP_DATE', currentLead.follow_up_date || 'None', fDate || 'Cleared']
      );
    }

    if (is_archived !== undefined) {
      const archivedVal = is_archived ? 1 : 0;
      await query('UPDATE contact_messages SET is_archived = ? WHERE id = ?', [archivedVal, id]);
      await query(
        'INSERT INTO lead_activity (contact_message_id, admin_user_id, action, old_value, new_value) VALUES (?, ?, ?, ?, ?)',
        [id, adminId, 'ARCHIVE_TOGGLE', currentLead.is_archived ? 'Archived' : 'Active', archivedVal ? 'Archived' : 'Active']
      );
    }

    return res.json({ success: true, message: 'Lead record updated successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function addLeadNote(req, res) {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const adminId = req.admin ? req.admin.id : null;

    if (!note || !note.trim()) {
      return res.status(400).json({ success: false, message: 'Note text cannot be empty.' });
    }

    const result = await query(
      'INSERT INTO lead_notes (contact_message_id, admin_user_id, note) VALUES (?, ?, ?)',
      [id, adminId, note.trim()]
    );

    await query(
      'INSERT INTO lead_activity (contact_message_id, admin_user_id, action, new_value) VALUES (?, ?, ?, ?)',
      [id, adminId, 'NOTE_ADDED', 'New internal note added']
    );

    return res.json({
      success: true,
      message: 'Note added successfully.',
      noteId: result.insertId
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function exportLeadsCsv(req, res) {
  try {
    const leads = await query(
      `SELECT reference_number, name, email, phone, company, country, client_type, required_service, budget_range, urgency, preferred_contact_method, status, priority, follow_up_date, created_at 
       FROM contact_messages 
       WHERE is_archived = 0 
       ORDER BY created_at DESC`
    );

    const headers = [
      'Reference',
      'Name',
      'Email',
      'Phone',
      'Company',
      'Country',
      'Client Type',
      'Service',
      'Budget',
      'Urgency',
      'Preferred Contact',
      'Status',
      'Priority',
      'Follow-Up Date',
      'Created At'
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvRows = [headers.map(h => `"${h}"`).join(',')];
    leads.forEach(l => {
      const row = [
        escapeCsv(l.reference_number),
        escapeCsv(l.name),
        escapeCsv(l.email),
        escapeCsv(l.phone),
        escapeCsv(l.company),
        escapeCsv(l.country),
        escapeCsv(l.client_type),
        escapeCsv(l.required_service),
        escapeCsv(l.budget_range),
        escapeCsv(l.urgency),
        escapeCsv(l.preferred_contact_method),
        escapeCsv(l.status),
        escapeCsv(l.priority),
        escapeCsv(l.follow_up_date),
        escapeCsv(l.created_at)
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\r\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=serenova-leads-${Date.now()}.csv`);
    return res.status(200).send(csvContent);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// Backward compatibility for existing message routes
export async function getMessages(req, res) {
  return getLeads(req, res);
}

export async function markMessageRead(req, res) {
  const { id } = req.params;
  const { is_read } = req.body;
  await query('UPDATE contact_messages SET is_read = ? WHERE id = ?', [is_read ? 1 : 0, id]);
  return res.json({ success: true, message: 'Message status updated.' });
}

export async function deleteMessage(req, res) {
  const { id } = req.params;
  await query('UPDATE contact_messages SET is_archived = 1 WHERE id = ?', [id]);
  return res.json({ success: true, message: 'Message archived successfully.' });
}

// --- MEDIA LIBRARY ---
export async function getMedia(req, res) {
  try {
    const rows = await query('SELECT * FROM media ORDER BY created_at DESC');
    return res.json({ success: true, media: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function handleUploadMedia(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const { filename, originalname, mimetype, size } = req.file;
    const publicPath = `/uploads/${filename}`;
    const altText = req.body.alt_text || originalname;

    const result = await query(
      `INSERT INTO media (filename, original_name, mime_type, size_bytes, file_path, alt_text)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [filename, originalname, mimetype, size, publicPath, altText]
    );

    return res.json({
      success: true,
      message: 'File uploaded successfully.',
      file: {
        id: result.insertId,
        filename,
        original_name: originalname,
        mime_type: mimetype,
        size_bytes: size,
        file_path: publicPath,
        alt_text: altText
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteMedia(req, res) {
  try {
    const { id } = req.params;
    const mediaRows = await query('SELECT * FROM media WHERE id = ?', [id]);
    if (mediaRows && mediaRows.length > 0) {
      const item = mediaRows[0];
      const filePath = path.resolve(process.cwd(), 'server', 'uploads', item.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      await query('DELETE FROM media WHERE id = ?', [id]);
    }
    return res.json({ success: true, message: 'Media item deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// --- SITE SETTINGS ---
export async function getSettings(req, res) {
  try {
    const rows = await query('SELECT * FROM site_settings');
    const settings = {};
    rows.forEach(r => {
      settings[r.setting_key] = r.setting_value;
    });
    return res.json({ success: true, settings });
  } catch (err) {
    return res.json({ success: true, settings: {}, warning: formatDbError(err) });
  }
}

export async function updateSettings(req, res) {
  try {
    const settings = req.body;
    for (const [key, value] of Object.entries(settings)) {
      await query(
        `INSERT INTO site_settings (setting_key, setting_value)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [key, String(value || '')]
      );
    }
    return res.json({ success: true, message: 'Settings saved successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: formatDbError(err) });
  }
}
