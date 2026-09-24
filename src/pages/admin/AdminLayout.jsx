import React, { useCallback, useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { API_URL, clearSession, getToken, getUser, setUser } from '../../utils/adminAuth';
import {
  IconGrid,
  IconInbox,
  IconLogout,
  IconGlobe,
  IconSettings,
  IconWallet,
  IconBuilding,
  IconBriefcase,
  IconFile,
  IconReceipt,
  IconRefresh,
  IconClock,
  IconLifebuoy,
  IconUsers,
  IconNews,
  IconShield,
  IconList
} from './icons';
import { canAccess, ROLE_META } from './permissions';
import './AdminShared.css';
import './AdminLayout.css';
import './AdminModules.css';

// Sidebar sections; each link is shown only if the user's role can use its area.
const NAV = [
  { items: [{ to: '/admin', end: true, label: 'Overview', icon: IconGrid }] },
  {
    heading: 'Sales',
    items: [
      { to: '/admin/submissions', label: 'Leads', icon: IconInbox, area: 'leads' },
      { to: '/admin/quotations', label: 'Quotations', icon: IconFile, area: 'quotations' },
      { to: '/admin/clients', label: 'Clients', icon: IconBuilding, area: 'clients' }
    ]
  },
  {
    heading: 'Delivery',
    items: [
      { to: '/admin/projects', label: 'Projects', icon: IconBriefcase, area: 'projects' },
      { to: '/admin/timesheets', label: 'Timesheets', icon: IconClock, area: 'timesheets' },
      { to: '/admin/tickets', label: 'Support Tickets', icon: IconLifebuoy, area: 'tickets' }
    ]
  },
  {
    heading: 'Money',
    items: [
      { to: '/admin/invoices', label: 'Invoices', icon: IconReceipt, area: 'invoices' },
      { to: '/admin/finances', label: 'Finances', icon: IconWallet, area: 'finances' },
      { to: '/admin/renewals', label: 'Renewals', icon: IconRefresh, area: 'renewals' }
    ]
  },
  {
    heading: 'Company',
    items: [
      { to: '/admin/team', label: 'Team', icon: IconUsers, area: 'employees' },
      { to: '/admin/news', label: 'News', icon: IconNews, area: 'content' },
      { to: '/admin/users', label: 'Users & Roles', icon: IconShield, area: 'users' },
      { to: '/admin/audit-log', label: 'Audit Log', icon: IconList, area: 'audit' },
      { to: '/admin/settings', label: 'Settings', icon: IconSettings }
    ]
  }
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const [user, setUserState] = useState(getUser);
  const [navOpen, setNavOpen] = useState(false);

  // Refresh the stored user so role changes (or sessions from before roles
  // existed) are picked up without logging out.
  useEffect(() => {
    fetch(`${API_URL}/user`, { headers: { Accept: 'application/json', Authorization: `Bearer ${getToken()}` } })
      .then((res) => {
        if (res.status === 401) {
          clearSession();
          navigate('/admin/login', { replace: true });
          return null;
        }
        return res.ok ? res.json() : null;
      })
      .then((fresh) => {
        if (fresh && fresh.id) {
          setUser(fresh);
          setUserState(fresh);
        }
      })
      .catch(() => {});
  }, [navigate]);

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
    <div className={`admin-shell${navOpen ? ' admin-nav-open' : ''}`}>
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <span className="admin-sidebar-logo-mark">4</span>
          <span className="admin-sidebar-logo-copy">
            <span className="admin-sidebar-logo-text">Web<span>4</span>rtTech</span>
            <span className="admin-sidebar-logo-tagline">Build · Grow · Automate</span>
          </span>
          <button type="button" className="admin-nav-toggle" onClick={() => setNavOpen((o) => !o)} aria-label="Toggle menu">
            {navOpen ? '×' : '☰'}
          </button>
        </div>

        <nav className="admin-nav" onClick={(e) => e.target.closest('a') && setNavOpen(false)}>
          {NAV.map((section, i) => {
            const items = section.items.filter((item) => !item.area || canAccess(user, item.area));
            if (items.length === 0) return null;
            return (
              <div key={section.heading || i} className="admin-nav-section">
                {section.heading && <span className="admin-nav-heading">{section.heading}</span>}
                {items.map(({ to, end, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
                  >
                    <Icon className="admin-nav-icon" />
                    {label}
                  </NavLink>
                ))}
              </div>
            );
          })}
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
              <span className="admin-user-email">{ROLE_META[user?.role || 'admin']?.label} · {user?.email || ''}</span>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={logout} title="Log out">
            <IconLogout className="admin-nav-icon" />
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <Outlet context={{ user }} />
      </div>
    </div>
  );
};

export default AdminLayout;
