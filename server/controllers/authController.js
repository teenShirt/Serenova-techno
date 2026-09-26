import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const JWT_SECRET = process.env.JWT_SECRET || 'serenovatech_super_secret_jwt_key_2026_safe_hash';

export async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username/Email and Password are required.'
      });
    }

    let user = null;

    // Try finding admin user in database
    try {
      const users = await query(
        'SELECT * FROM admin_users WHERE username = ? OR email = ? LIMIT 1',
        [username, username]
      );
      if (users && users.length > 0) {
        user = users[0];
      }
    } catch (err) {
      console.warn('[Auth Warning] Database check failed during login:', err.message);
    }

    // Fallback to initial env admin credentials if DB is not reachable/empty
    const envUsername = process.env.INITIAL_ADMIN_USERNAME || 'admin';
    const envEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@serenovatech.com';
    const envPass = process.env.INITIAL_ADMIN_PASSWORD || 'AdminSecurePass2026!';

    let isMatch = false;

    if (user) {
      isMatch = await bcrypt.compare(password, user.password_hash);
    } else if (username === envUsername || username === envEmail) {
      // Direct env admin match fallback
      if (password === envPass) {
        isMatch = true;
        user = {
          id: 1,
          username: envUsername,
          email: envEmail
        };
      }
    }

    if (!isMatch || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your username and password.'
      });
    }

    // Issue JWT Token
    const tokenPayload = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '8h' });

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
    });

    return res.json({
      success: true,
      message: 'Login successful.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error('[Auth Error]', err);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during authentication.'
    });
  }
}

export async function logout(req, res) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('admin_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax'
  });

  return res.json({
    success: true,
    message: 'Logged out successfully.'
  });
}

export async function getSession(req, res) {
  if (!req.admin) {
    return res.status(401).json({ success: false, message: 'Unauthenticated' });
  }

  return res.json({
    success: true,
    user: {
      id: req.admin.id,
      username: req.admin.username,
      email: req.admin.email
    }
  });
}

export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long.'
      });
    }

    const adminId = req.admin.id;

    // Verify current password against DB
    const users = await query('SELECT * FROM admin_users WHERE id = ? LIMIT 1', [adminId]);

    if (users && users.length > 0) {
      const isMatch = await bcrypt.compare(currentPassword, users[0].password_hash);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect.'
        });
      }
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    try {
      await query('UPDATE admin_users SET password_hash = ? WHERE id = ?', [newHash, adminId]);
    } catch (err) {
      console.warn('[Auth Warning] Database update error:', err.message);
    }

    return res.json({
      success: true,
      message: 'Password updated successfully.'
    });
  } catch (err) {
    console.error('[Auth Password Error]', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update password.'
    });
  }
}
