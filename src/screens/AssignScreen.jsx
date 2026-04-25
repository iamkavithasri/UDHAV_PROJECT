import React, { useState } from 'react'
import Header from '../components/Header'
import Button from '../components/Button'
import { Select } from '../components/Input'
import { findBestMatches, matchLabel, matchBadgeVariant } from '../utils/match'
import { useEffect } from 'react'
import { getVolunteers } from '../services/volunteers'
import { getTasks } from '../services/tasks'
import { assign } from '../services/assignments'


const getInitials = (name) => name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

export default function AssignScreen({ navigate, user, handleLogout }) {
  const [selectedTask, setSelectedTask] = useState('')
  const [selectedVolunteer, setSelectedVolunteer] = useState('')
  const [assignments, setAssignments] = useState([])
  const [toast, setToast] = useState(null)

  const [volunteers, setVolunteers] = useState([])
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    getVolunteers().then(setVolunteers)
    getTasks().then(setTasks)
  }, [])

  const task = tasks.find((t) => t.id === Number(selectedTask))
  const matches = task ? findBestMatches(task, volunteers) : []

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleAssign = async () => {
    if (!selectedTask || !selectedVolunteer) {
      showToast('⚠ Please select both a task and a volunteer')
      return
    }
    const vol = volunteers.find((v) => v.id === selectedVolunteer)
    const tsk = tasks.find((t) => t.id === selectedTask)
    await assign(selectedVolunteer, selectedTask)
    showToast(`✓ ${vol.name} assigned to "${tsk.title}"`)
    setSelectedVolunteer('')
  }

  return (
    <div className="app-layout">
      <Header currentScreen="assign" navigate={navigate} user={user} handleLogout={handleLogout} />

      <main className="main-content">
        <div className="page-header">
          <div className="page-header-inner">
            <div>
              <div className="page-subtitle">Smart Matching</div>
              <h2 className="page-title">Assign Task</h2>
            </div>
          </div>
        </div>

        <div className="page-body">
          <div className="two-col-grid">
            {/* Left: assignment form */}
            <div>
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-header">
                  <h3 className="card-title">New Assignment</h3>
                </div>

                <Select
                  label="Select Task"
                  value={selectedTask}
                  onChange={(e) => { setSelectedTask(e.target.value); setSelectedVolunteer('') }}
                >
                  <option value="">— Choose a task —</option>
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.priority} priority)
                    </option>
                  ))}
                </Select>

                {task && (
                  <div style={{
                    background: 'rgba(201,168,76,0.07)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    marginBottom: '1.25rem',
                  }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Task Details</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--slate-200)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <div>🏷 <strong style={{ color: 'var(--white)' }}>{task.category}</strong></div>
                      <div>📅 Deadline: <strong style={{ color: 'var(--white)' }}>{task.deadline}</strong></div>
                      <div>⚡ Required: <strong style={{ color: 'var(--white)' }}>{task.requiredSkills.join(', ')}</strong></div>
                    </div>
                  </div>
                )}

                <Select
                  label="Select Volunteer"
                  value={selectedVolunteer}
                  onChange={(e) => setSelectedVolunteer(e.target.value)}
                >
                  <option value="">— Choose a volunteer —</option>
                  {volunteers.filter((v) => v.status === 'Active').map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </Select>

                <Button variant="primary" full size="lg" onClick={handleAssign}>
                  ⇄ Assign Now
                </Button>
              </div>

              {/* Recent session assignments */}
              {assignments.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Session Assignments</h3>
                    <span className="badge badge-gold">{assignments.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {assignments.map((a) => (
                      <div key={a.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}>
                        <div style={{ fontSize: '1.2rem' }}>✓</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--white)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.volunteerName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>→ {a.taskTitle}</div>
                        </div>
                        <span className="badge badge-green">Done</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: AI matches */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Smart Matches</h3>
                {task && <span className="badge badge-blue">{matches.length} found</span>}
              </div>

              {!task ? (
                <div className="empty-state" style={{ padding: '2.5rem 1rem' }}>
                  <div className="empty-state-icon">⇄</div>
                  <h3>Select a task</h3>
                  <p>We'll show the best-matched volunteers based on skills and availability.</p>
                </div>
              ) : matches.length === 0 ? (
                <div className="empty-state" style={{ padding: '2.5rem 1rem' }}>
                  <div className="empty-state-icon">😕</div>
                  <h3>No strong matches</h3>
                  <p>No active volunteers match the required skills for this task.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {matches.map(({ volunteer: v, score, matchedSkills }) => (
                    <div key={v.id} style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${selectedVolunteer === String(v.id) ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.07)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'all var(--transition)',
                    }}
                      onClick={() => setSelectedVolunteer(String(v.id))}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                        <div className="volunteer-avatar" style={{ width: 36, height: 36, fontSize: '0.85rem', borderRadius: '10px' }}>
                          {getInitials(v.name)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, color: 'var(--white)', fontSize: '0.9rem' }}>{v.name}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--slate-400)' }}>{v.availability}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.4rem',
                            fontWeight: 900,
                            color: score >= 70 ? 'var(--gold-light)' : 'var(--slate-400)',
                            lineHeight: 1,
                          }}>{score}%</div>
                          <span className={`badge badge-${matchBadgeVariant(score)}`} style={{ fontSize: '0.6rem' }}>
                            {matchLabel(score)}
                          </span>
                        </div>
                      </div>

                      {/* Skill match bar */}
                      <div style={{ marginBottom: '0.6rem' }}>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${score}%`,
                            background: 'linear-gradient(90deg, var(--gold), var(--amber-300))',
                            borderRadius: '4px',
                            transition: 'width 0.5s ease',
                          }} />
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                        {v.skills.map((s) => (
                          <span key={s} className={`skill-tag ${matchedSkills.includes(s) ? '' : ''}`}
                            style={{ opacity: matchedSkills.map(ms => ms.toLowerCase()).includes(s.toLowerCase()) ? 1 : 0.4 }}>
                            {matchedSkills.map(ms => ms.toLowerCase()).includes(s.toLowerCase()) ? '✓ ' : ''}{s}
                          </span>
                        ))}
                      </div>

                      {selectedVolunteer === String(v.id) && (
                        <div style={{
                          marginTop: '0.75rem',
                          padding: '0.4rem 0.75rem',
                          background: 'rgba(201,168,76,0.1)',
                          border: '1px solid rgba(201,168,76,0.25)',
                          borderRadius: 'var(--radius-sm)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          color: 'var(--gold)',
                          textAlign: 'center',
                        }}>
                          ✓ Selected — click "Assign Now"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className="toast">
          <span className="toast-icon">🔔</span>
          <span className="toast-text">{toast}</span>
        </div>
      )}
    </div>
  )
}