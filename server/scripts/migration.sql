-- Serenova Tech Additive Migration Script
-- Safe to execute against existing databases without dropping tables or losing data.

-- 1. Services table enhancements
ALTER TABLE services ADD COLUMN IF NOT EXISTS slug VARCHAR(150) NULL UNIQUE AFTER service_key;
ALTER TABLE services ADD COLUMN IF NOT EXISTS problem_solved TEXT NULL AFTER full_desc;
ALTER TABLE services ADD COLUMN IF NOT EXISTS deliverables_json JSON NULL AFTER problem_solved;
ALTER TABLE services ADD COLUMN IF NOT EXISTS ideal_customer TEXT NULL AFTER deliverables_json;
ALTER TABLE services ADD COLUMN IF NOT EXISTS starting_price VARCHAR(100) NULL AFTER ideal_customer;
ALTER TABLE services ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255) NULL AFTER features_json;
ALTER TABLE services ADD COLUMN IF NOT EXISTS seo_description TEXT NULL AFTER seo_title;

-- Add index on services if not exists
SET @exist := (SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'services' AND index_name = 'idx_services_slug');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE services ADD INDEX idx_services_slug (slug)', 'SELECT 1');
PREPARE stmt FROM @sqlstmt; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 2. Projects table enhancements
ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug VARCHAR(150) NULL UNIQUE AFTER id;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS service_category VARCHAR(100) NULL AFTER category;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client_type VARCHAR(100) NULL AFTER service_category;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS challenge TEXT NULL AFTER description;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS solution TEXT NULL AFTER challenge;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS result TEXT NULL AFTER solution;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS gallery_json JSON NULL AFTER image_url;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS completion_date VARCHAR(50) NULL AFTER project_date;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255) NULL AFTER completion_date;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS seo_description TEXT NULL AFTER seo_title;

SET @exist_p := (SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'projects' AND index_name = 'idx_projects_slug');
SET @sqlstmt_p := IF(@exist_p = 0, 'ALTER TABLE projects ADD INDEX idx_projects_slug (slug)', 'SELECT 1');
PREPARE stmt FROM @sqlstmt_p; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 3. Contact Messages table enhancements for Lead Management Pipeline
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS reference_number VARCHAR(50) NULL UNIQUE AFTER id;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS country VARCHAR(100) NULL AFTER company;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS client_type VARCHAR(100) NULL AFTER country;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS required_service VARCHAR(150) NULL AFTER client_type;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS budget_range VARCHAR(100) NULL AFTER required_service;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS urgency VARCHAR(100) NULL AFTER budget_range;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS preferred_contact_method VARCHAR(50) NULL AFTER urgency;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS consent TINYINT(1) NOT NULL DEFAULT 1 AFTER message;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'new' AFTER consent;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS priority VARCHAR(20) NOT NULL DEFAULT 'medium' AFTER status;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS follow_up_date DATE NULL AFTER priority;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS assigned_admin_id INT NULL AFTER follow_up_date;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS is_archived TINYINT(1) NOT NULL DEFAULT 0 AFTER is_read;

-- Add lead indexes
SET @exist_m1 := (SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'contact_messages' AND index_name = 'idx_messages_ref');
SET @sqlstmt_m1 := IF(@exist_m1 = 0, 'ALTER TABLE contact_messages ADD INDEX idx_messages_ref (reference_number)', 'SELECT 1');
PREPARE stmt FROM @sqlstmt_m1; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @exist_m2 := (SELECT COUNT(*) FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'contact_messages' AND index_name = 'idx_messages_status');
SET @sqlstmt_m2 := IF(@exist_m2 = 0, 'ALTER TABLE contact_messages ADD INDEX idx_messages_status (status)', 'SELECT 1');
PREPARE stmt FROM @sqlstmt_m2; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 4. Create Lead Notes table
CREATE TABLE IF NOT EXISTS lead_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contact_message_id INT NOT NULL,
  admin_user_id INT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contact_message_id) REFERENCES contact_messages(id) ON DELETE CASCADE,
  INDEX idx_notes_lead (contact_message_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Create Lead Activity table
CREATE TABLE IF NOT EXISTS lead_activity (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contact_message_id INT NOT NULL,
  admin_user_id INT NULL,
  action VARCHAR(100) NOT NULL,
  old_value VARCHAR(255) NULL,
  new_value VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contact_message_id) REFERENCES contact_messages(id) ON DELETE CASCADE,
  INDEX idx_activity_lead (contact_message_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
