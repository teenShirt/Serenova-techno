import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
};

async function seed() {
  console.log('--- SerenovaTech CMS Database Setup & Admin Seed ---');

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('[1/4] Connected to MySQL server.');

    const dbName = process.env.DB_NAME || 'serenova_tech_cms';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.query(`USE \`${dbName}\`;`);
    console.log(`[2/4] Database '${dbName}' verified.`);

    const schemaSql = fs.readFileSync(path.resolve(__dirname, 'schema.sql'), 'utf8');
    await connection.query(schemaSql);
    console.log('[3/4] Schema tables initialized.');

    // Seed Admin User
    const adminUser = process.env.INITIAL_ADMIN_USERNAME || 'admin';
    const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@serenovatech.com';
    const adminPass = process.env.INITIAL_ADMIN_PASSWORD || 'AdminSecurePass2026!';

    const [existing] = await connection.query('SELECT id FROM admin_users WHERE username = ? OR email = ? LIMIT 1', [adminUser, adminEmail]);

    if (existing.length === 0) {
      const hash = await bcrypt.hash(adminPass, 10);
      await connection.query(
        'INSERT INTO admin_users (username, email, password_hash) VALUES (?, ?, ?)',
        [adminUser, adminEmail, hash]
      );
      console.log(`[4/4] Created administrator user '${adminUser}' (${adminEmail}).`);
    } else {
      console.log(`[4/4] Administrator user '${adminUser}' already exists.`);
    }

    console.log('\n✅ Database seeding complete!');
    console.log(`Admin Username: ${adminUser}`);
    console.log(`Admin Password: ${adminPass}`);
    console.log('You can now log in at: /admin/login\n');
  } catch (err) {
    console.error('\n❌ Database Seeding Failed:', err.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

seed();
