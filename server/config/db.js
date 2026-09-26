import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'serenova_tech_cms',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool = null;
let isConnected = false;

try {
  pool = mysql.createPool(dbConfig);
} catch (err) {
  console.warn('[DB Warning] Could not initialize MySQL pool:', err.message);
}

export async function query(sql, params = []) {
  if (!pool) {
    throw new Error('Database pool not initialized');
  }
  try {
    const [rows] = await pool.execute(sql, params);
    isConnected = true;
    return rows;
  } catch (err) {
    // Log connection issue once
    if (isConnected) {
      console.warn('[DB Error]', err.message);
      isConnected = false;
    }
    throw err;
  }
}

export async function testConnection() {
  try {
    if (!pool) return false;
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    isConnected = true;
    console.log('[DB Info] Successfully connected to MySQL database:', dbConfig.database);
    return true;
  } catch (err) {
    console.warn('[DB Info] MySQL database is currently unreachable:', err.message);
    console.warn('[DB Info] Public API will operate in static fallback mode.');
    return false;
  }
}

export { pool };
