import React from 'react'
import Header from '../components/Header'
import { StatCard } from '../components/Card'

const ACTIVITY = [
  { text: <><strong>Priya Sharma</strong> was assigned to <strong>Medical Camp Setup</strong></>, time: '2m ago' },
  { text: <><strong>Ravi Kumar</strong> completed <strong>Food Distribution Round 3</strong></>, time: '18m ago' },
  { text: <><strong>New task</strong> created: <strong>Children's Education Drive</strong></>, time: '1h ago' },
  { text: <><strong>Anjali Mehta</strong> joined as a volunteer</>, time: '2h ago' },
  { text: <><strong>Assignment #47</strong> marked as in-progress</>, time: '3h ago' },
]

const QUICK_ACTIONS = [
  { icon: '👥', label: 'Add Volunteer', desc: 'Register new volunteer', screen: 'volunteers' },
  { icon: '✦',  label: 'Create Task',   desc: 'Define a new mission',  screen: 'tasks' },
  { icon: '⇄',  label: 'Assign Task',   desc: 'Match volunteers',      screen: 'assign' },
  { icon: '◈',  label: 'View Reports',  desc: 'Assignments & status',  screen: 'assignments' },
]

export default function HomeScreen({ navigate, user, handleLogout, currentScreen = 'home' }) {
  return (
    <div className="app-layout">
      <Header currentScreen="home" navigate={navigate} user={user} handleLogout={handleLogout} />

      <main className="main-content">
        <div className="page-header">
          <div className="page-header-inner">
            <div>
              <div className="page-subtitle">Dashboard</div>
              <h2 className="page-title">
                Good day, {user?.name || 'Coordinator'} 👋
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--slate-500)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.35rem 0.75rem',
              }}>
                {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        <div className="page-body">
          {/* Stats */}
          <div className="stats-grid">
            <StatCard icon="👥" number="124" label="Total Volunteers" delta="8 this week" />
            <StatCard icon="✦"  number="38"  label="Active Tasks" delta="5 new" />
            <StatCard icon="⇄"  number="91"  label="Assignments" delta="12 today" />
            <StatCard icon="✔"  number="87%" label="Completion Rate" delta="3%" />
          </div>

          {/* Body grid */}
          <div className="two-col-grid">
            {/* Quick actions */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Quick Actions</h3>
              </div>
              <div className="quick-actions-grid">
                {QUICK_ACTIONS.map((qa) => (
                  <div
                    key={qa.label}
                    className="quick-action-card"
                    onClick={() => navigate(qa.screen)}
                  >
                    <div className="quick-action-icon">{qa.icon}</div>
                    <div>
                      <div className="quick-action-label">{qa.label}</div>
                      <div className="quick-action-desc">{qa.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity feed */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Activity</h3>
                <span className="badge badge-gold">Live</span>
              </div>
              <div className="activity-feed">
                {ACTIVITY.map((a, i) => (
                  <div key={i} className="activity-item">
                    <div className="activity-dot" />
                    <div className="activity-text">{a.text}</div>
                    <div className="activity-time">{a.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div style={{ marginTop: '1.5rem' }}>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Mission Overview</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.25rem' }}>
                {[
                  { label: 'Pending', count: 12, color: 'var(--amber-400)' },
                  { label: 'In Progress', count: 26, color: '#3b82f6' },
                  { label: 'Completed', count: 53, color: 'var(--success)' },
                  { label: 'Cancelled', count: 4, color: 'var(--error)' },
                ].map((s) => (
                  <div key={s.label} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute',
                      bottom: 0, left: 0, right: 0,
                      height: '3px',
                      background: s.color,
                      opacity: 0.7,
                    }} />
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '2rem',
                      fontWeight: 900,
                      color: s.color,
                      lineHeight: 1,
                      marginBottom: '0.35rem',
                    }}>{s.count}</div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: 'var(--slate-400)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}