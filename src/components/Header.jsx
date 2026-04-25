import React, { useState } from 'react'

const NAV_ITEMS = [
  { id: 'home',        icon: '⬡',  label: 'Dashboard' },
  { id: 'volunteers',  icon: '👥',  label: 'Volunteers',  badge: null },
  { id: 'tasks',       icon: '✦',   label: 'Tasks',       badge: null },
  { id: 'assign',      icon: '⇄',   label: 'Assign Task' },
  { id: 'assignments', icon: '◈',   label: 'Assignments' },
]

export default function Header({ currentScreen, navigate, user, handleLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'VH'

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="mobile-menu-toggle"
        style={{
          display: 'none',
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 200,
          background: 'var(--navy-700)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.5rem',
          cursor: 'pointer',
          color: 'var(--white)',
          fontSize: '1.1rem',
        }}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <nav className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">🌿</div>
          <div>
            <div className="sidebar-brand-text">VolunteerHub</div>
            <div className="sidebar-brand-sub">Mission Control</div>
          </div>
        </div>

        {/* Navigation */}
        <div className="sidebar-nav">
          <div className="sidebar-section-label">Navigation</div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentScreen === item.id ? 'active' : ''}`}
              onClick={() => {
                navigate(item.id)
                setMobileOpen(false)
              }}
            >
              <span className="nav-item-icon">{item.icon}</span>
              {item.label}
              {item.badge && (
                <span className="nav-item-badge">{item.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* User footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">
                {user?.name || user?.email || 'Admin'}
              </div>
              <div className="sidebar-user-role">Coordinator</div>
            </div>
            <button
              className="sidebar-logout"
              onClick={handleLogout}
              title="Log out"
            >
              ⏻
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99,
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  )
}