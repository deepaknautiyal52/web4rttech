import React, { useCallback } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { API_URL, clearSession, getToken, getUser } from '../../utils/adminAuth';
import { IconGrid, IconInbox, IconLogout, IconGlobe, IconSettings, IconWallet } from './icons';
import './AdminShared.css';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const user = getUser();

  const logout = useCallback(async () => {
    const token = getToken();
    if (token) {
      try {
        await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
        });
      } catch {
        // Ignore network errors on logout, still clear local session.
      }
    }
    clearSession();
    navigate('/admin/login', { replace: true });
  }, [navigate]);

  const initials = (user?.name || 'A')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <span className="admin-sidebar-logo-mark">4</span>
          <span className="admin-sidebar-logo-copy">
            <span className="admin-sidebar-logo-text">Web<span>4</span>rtTech</span>
            <span className="admin-sidebar-logo-tagline">Build · Grow · Automate</span>
          </span>
        </div>

        <nav className="admin-nav">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
          >
            <IconGrid className="admin-nav-icon" />
            Overview
          </NavLink>
          <NavLink
            to="/admin/submissions"
            className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
          >
            <IconInbox className="admin-nav-icon" />
            Submissions
          </NavLink>
          <NavLink
            to="/admin/finances"
            className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
          >
            <IconWallet className="admin-nav-icon" />
            Finances
          </NavLink>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
          >
            <IconSettings className="admin-nav-icon" />
            Settings
          </NavLink>
          <a href="/" target="_blank" rel="noreferrer" className="admin-nav-link admin-nav-link-muted">
            <IconGlobe className="admin-nav-icon" />
            View Site
          </a>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user">
            <div className="admin-user-avatar">{initials}</div>
            <div className="admin-user-meta">
              <span className="admin-user-name">{user?.name || 'Admin'}</span>
              <span className="admin-user-email">{user?.email || ''}</span>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={logout} title="Log out">
            <IconLogout className="admin-nav-icon" />
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
