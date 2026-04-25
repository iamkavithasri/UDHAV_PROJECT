import React, { useState } from 'react'
import Header from '../components/Header'
import Button from '../components/Button'
import { Input, Select, Textarea } from '../components/Input'
import { useEffect } from 'react'
import { getTasks, addTask, updateTask, deleteTask } from '../services/tasks'


const PRIORITY_COLORS = { High: 'priority-high', Medium: 'priority-medium', Low: 'priority-low' }
const STATUS_BADGES    = { Open: 'badge-blue', 'In Progress': 'badge-gold', Completed: 'badge-green', Cancelled: 'badge-red' }

const EMPTY_FORM = {
  title: '', description: '', category: 'Medical', priority: 'Medium',
  status: 'Open', deadline: '', requiredSkills: '',
}

export default function TaskScreen({ navigate, user, handleLogout }) {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    getTasks().then(setTasks)
  }, [])
  
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const filtered = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'All' || t.status === filterStatus
    const matchPriority = filterPriority === 'All' || t.priority === filterPriority
    return matchSearch && matchStatus && matchPriority
  })

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setErrors({})
    setEditTarget(null)
    setShowModal(true)
  }

  const openEdit = (t) => {
    setForm({ ...t, requiredSkills: t.requiredSkills.join(', ') })
    setEditTarget(t.id)
    setErrors({})
    setShowModal(true)
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.deadline) e.deadline = 'Deadline is required'
    return e
  }

  const handleSave = async () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const skillArr = form.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
    if (editTarget) {
      await updateTask(editTarget, { ...form, requiredSkills: skillArr })
    } else {
      await addTask({ ...form, requiredSkills: skillArr })
    }
    setTasks(await getTasks())
    setShowModal(false)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      await deleteTask(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
    }
  }

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors((er) => ({ ...er, [field]: '' }))
  }

  return (
    <div className="app-layout">
      <Header currentScreen="tasks" navigate={navigate} user={user} handleLogout={handleLogout} />

      <main className="main-content">
        <div className="page-header">
          <div className="page-header-inner">
            <div>
              <div className="page-subtitle">Mission Board</div>
              <h2 className="page-title">Tasks</h2>
            </div>
            <Button variant="primary" onClick={openAdd}>＋ Create Task</Button>
          </div>
        </div>

        <div className="page-body">
          {/* Filters */}
          <div className="filter-bar">
            <div className="input-wrapper" style={{ flex: 1, maxWidth: '320px' }}>
              <span className="input-icon">🔍</span>
              <input
                className="form-input"
                placeholder="Search tasks…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select className="form-select" style={{ width: 'auto' }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select className="form-select" style={{ width: 'auto' }} value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--slate-500)', whiteSpace: 'nowrap' }}>
              {filtered.length} task{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Task list */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✦</div>
              <h3>No tasks found</h3>
              <p>Adjust filters or create a new task.</p>
              <Button variant="primary" onClick={openAdd}>Create Task</Button>
            </div>
          ) : (
            <div className="tasks-list">
              {filtered.map((t) => (
                <div key={t.id} className="task-card">
                  <div className={`task-priority-bar ${PRIORITY_COLORS[t.priority]}`} />
                  <div className="task-content">
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                      <div className="task-title" style={{ marginBottom: 0, flex: 1 }}>{t.title}</div>
                      <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                        <span className={`badge ${STATUS_BADGES[t.status] || 'badge-gray'}`}>{t.status}</span>
                        <span className={`badge ${t.priority === 'High' ? 'badge-red' : t.priority === 'Medium' ? 'badge-gold' : 'badge-green'}`}>
                          {t.priority}
                        </span>
                      </div>
                    </div>
                    <div className="task-description">{t.description}</div>
                    <div className="task-meta">
                      <span className="task-meta-item">🏷 {t.category}</span>
                      <span className="task-meta-item">📅 {t.deadline}</span>
                      <span className="task-meta-item">⚡ {t.requiredSkills.join(', ') || '—'}</span>
                    </div>
                  </div>
                  <div className="task-actions">
                    <Button variant="secondary" size="sm" onClick={() => openEdit(t)}>✎</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(t.id)}>✕</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editTarget ? 'Edit Task' : 'Create Task'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <Input
              label="Task Title"
              placeholder="e.g. Medical Camp Setup"
              value={form.title}
              onChange={handleChange('title')}
              error={errors.title}
            />
            <Textarea
              label="Description"
              placeholder="Describe the task in detail…"
              value={form.description}
              onChange={handleChange('description')}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Select label="Category" value={form.category} onChange={handleChange('category')}>
                {['Medical', 'Logistics', 'Education', 'IT', 'Healthcare', 'Construction', 'Outreach'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
              <Select label="Priority" value={form.priority} onChange={handleChange('priority')}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Select label="Status" value={form.status} onChange={handleChange('status')}>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </Select>
              <Input
                label="Deadline"
                type="date"
                value={form.deadline}
                onChange={handleChange('deadline')}
                error={errors.deadline}
              />
            </div>
            <Input
              label="Required Skills (comma-separated)"
              placeholder="e.g. Medical, First Aid"
              value={form.requiredSkills}
              onChange={handleChange('requiredSkills')}
            />

            <div className="modal-footer">
              <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSave}>
                {editTarget ? 'Save Changes' : 'Create Task'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}