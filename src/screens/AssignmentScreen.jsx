import React, { useState } from 'react'
import Header from '../components/Header'
import Button from '../components/Button'
import { getAssignments, updateAssignmentStatus, removeAssignment } from '../services/assignments'


const STATUS_FLOW = { Pending: 'In Progress', 'In Progress': 'Completed' }
const STATUS_BADGES = { Pending: 'badge-gold', 'In Progress': 'badge-blue', Completed: 'badge-green', Cancelled: 'badge-red' }
const PRIORITY_COLORS = { High: '#ef4444', Medium: 'var(--amber-400)', Low: 'var(--success)' }

const getInitials = (name) => name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

export default function AssignmentScreen({ navigate, user, handleLogout }) {
  const [assignments, setAssignments] = useState([])

  useEffect(() => {
    getAssignments().then(setAssignments)
  }, [])
  
  const [filterStatus, setFilterStatus] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = assignments.filter((a) => {
    const matchStatus = filterStatus === 'All' || a.status === filterStatus
    const matchSearch = a.taskTitle.toLowerCase().includes(search.toLowerCase()) ||
      a.volunteerName.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const advanceStatus = async (id) => {
    const assignment = assignments.find((a) => a.id === id)
    const nextStatus = STATUS_FLOW[assignment.status]
    if (!nextStatus) return
    await updateAssignmentStatus(id, nextStatus)
    setAssignments((prev) =>
      prev.map((a) => a.id === id ? { ...a, status: nextStatus } : a)
    )
  }

  const cancelAssignment = async (id) => {
    if (window.confirm('Cancel this assignment?')) {
      await updateAssignmentStatus(id, 'Cancelled')
      setAssignments((prev) =>
        prev.map((a) => a.id === id ? { ...a, status: 'Cancelled' } : a)
      )
    }
  }

  const counts = {
    total: assignments.length,
    pending: assignments.filter((a) => a.status === 'Pending').length,
    inProgress: assignments.filter((a) => a.status === 'In Progress').length,
    completed: assignments.filter((a) => a.status === 'Completed').length,
  }

  return (
    <div className="app-layout">
      <Header currentScreen="assignments" navigate={navigate} user={user} handleLogout={handleLogout} />

      <main className="main-content">
        <div className="page-header">
          <div className="page-header-inner">
            <div>
              <div className="page-subtitle">Tracking</div>
              <h2 className="page-title">Assignments</h2>
            </div>
            <Button variant="primary" onClick={() => navigate('assign')}>＋ New Assignment</Button>
          </div>
        </div>

        <div className="page-body">
          {/* Mini stats */}
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
            {[
              { label: 'Total', count: counts.total, color: 'var(--slate-400)' },
              { label: 'Pending', count: counts.pending, color: 'var(--amber-400)' },
              { label: 'In Progress', count: counts.inProgress, color: '#3b82f6' },
              { label: 'Completed', count: counts.completed, color: 'var(--success)' },
            ].map((s) => (
              <div
                key={s.label}
                className="stat-card"
                style={{ cursor: 'pointer', '--bar-color': s.color }}
                onClick={() => setFilterStatus(s.label === 'Total' ? 'All' : s.label)}
              >
                <style>{`.stat-card::before { background: ${s.color} !important; }`}</style>
                <div className="stat-card-number" style={{ color: s.color, fontSize: '1.8rem' }}>{s.count}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div className="filter-bar">
            <div className="input-wrapper" style={{ flex: 1, maxWidth: '320px' }}>
              <span className="input-icon">🔍</span>
              <input
                className="form-input"
                placeholder="Search by task or volunteer…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select className="form-select" style={{ width: 'auto' }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--slate-500)', whiteSpace: 'nowrap' }}>
              {filtered.length} record{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Assignment cards */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">◈</div>
              <h3>No assignments found</h3>
              <p>Try adjusting filters or create a new assignment.</p>
              <Button variant="primary" onClick={() => navigate('assign')}>New Assignment</Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filtered.map((a, idx) => (
                <div key={a.id} className="assignment-card">
                  <div className="assignment-number">
                    {String(idx + 1).padStart(2, '0')}
                  </div>

                  <div className="assignment-content">
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                      <div className="assignment-title" style={{ flex: 1 }}>{a.taskTitle}</div>
                      <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                        <span className={`badge ${STATUS_BADGES[a.status] || 'badge-gray'}`}>{a.status}</span>
                        <span className="badge" style={{
                          background: `${PRIORITY_COLORS[a.priority]}22`,
                          color: PRIORITY_COLORS[a.priority],
                          border: `1px solid ${PRIORITY_COLORS[a.priority]}44`,
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.68rem',
                          padding: '3px 10px',
                          borderRadius: '100px',
                        }}>{a.priority}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                      <div className="volunteer-avatar" style={{ width: 28, height: 28, fontSize: '0.75rem', borderRadius: '8px', flexShrink: 0 }}>
                        {getInitials(a.volunteerName)}
                      </div>
                      <span style={{ fontSize: '0.875rem', color: 'var(--white)', fontWeight: 500 }}>{a.volunteerName}</span>
                    </div>

                    <div className="assignment-meta">
                      <span className="assignment-meta-item">🏷 {a.category}</span>
                      <span className="assignment-meta-item">📋 Assigned {a.assignedDate}</span>
                      <span className="assignment-meta-item">📅 Due {a.deadline}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0, alignItems: 'flex-end' }}>
                    {STATUS_FLOW[a.status] && (
                      <Button variant="primary" size="sm" onClick={() => advanceStatus(a.id)}>
                        → {STATUS_FLOW[a.status]}
                      </Button>
                    )}
                    {a.status !== 'Cancelled' && a.status !== 'Completed' && (
                      <Button variant="danger" size="sm" onClick={() => cancelAssignment(a.id)}>
                        Cancel
                      </Button>
                    )}
                    {(a.status === 'Completed' || a.status === 'Cancelled') && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--slate-500)', textAlign: 'right' }}>
                        {a.status === 'Completed' ? '✓ Done' : '✕ Cancelled'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}