import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Server, 
  FolderKanban, 
  HelpCircle, 
  MessageSquare, 
  Image, 
  Settings, 
  KeyRound, 
  LogOut, 
  Globe, 
  ExternalLink,
  Cpu
} from 'lucide-react';
import './adminStyles.css';

export default function AdminLayout() {
  const { adminUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { path: '/admin/content', label: 'Homepage Content', icon: FileText },
    { path: '/admin/services', label: 'Services', icon: Server },
    { path: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { path: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
    { path: '/admin/messages', label: 'Contact Messages', icon: MessageSquare },
    { path: '/admin/media', label: 'Media Library', icon: Image },
    { path: '/admin/settings', label: 'Site Settings', icon: Settings },
    { path: '/admin/password', label: 'Change Password', icon: KeyRound }
  ];

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="logo-icon-wrap" style={{ width: '32px', height: '32px' }}>
            <Cpu size={18} />
          </div>
          <div className="admin-brand-text">
            <span>Serenova<span style={{ color: 'var(--color-cyan)' }}>CMS</span></span>
            <small>Admin Portal</small>
          </div>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn-view-site">
            <Globe size={16} />
            <span>View Public Site</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="admin-header-title">
            <span>Serenova Tech Control Panel</span>
          </div>

          <div className="admin-header-user">
            <div className="user-badge">
              <span className="user-avatar">{adminUser?.username?.charAt(0).toUpperCase() || 'A'}</span>
              <div className="user-info">
                <span className="user-name">{adminUser?.username || 'Admin'}</span>
                <small className="user-email">{adminUser?.email || 'admin@serenovatech.com'}</small>
              </div>
            </div>

            <button className="btn-logout" onClick={handleLogout} title="Log Out">
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </header>

        {/* Page View */}
        <div className="admin-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
