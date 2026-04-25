import React, { useState } from 'react'
import Header from '../components/Header'
import Button from '../components/Button'
import { Input, Select } from '../components/Input'
import { useEffect } from 'react'
import { getVolunteers, addVolunteer, updateVolunteer, deleteVolunteer } from '../services/volunteers'


const EMPTY_FORM = { name: '', email: '', skills: '', availability: 'Weekends', status: 'Active' }

export default function VolunteerScreen({ navigate, user, handleLogout }) {
  const [volunteers, setVolunteers] = useState([])

  useEffect(() => {
    getVolunteers().then(setVolunteers)
  }, [])
  
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const filtered = volunteers.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.email.toLowerCase().includes(search.toLowerCase()) ||
    v.skills.join(' ').toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setErrors({})
    setEditTarget(null)
    setShowModal(true)
  }

  const openEdit = (v) => {
    setForm({ ...v, skills: v.skills.join(', ') })
    setEditTarget(v.id)
    setErrors({})
    setShowModal(true)
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.skills.trim()) e.skills = 'At least one skill required'
    return e
  }

  const handleSave = async () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const skillArr = form.skills.split(',').map((s) => s.trim()).filter(Boolean)
    if (editTarget) {
      await updateVolunteer(editTarget, { ...form, skills: skillArr })
    } else {
      await addVolunteer({ ...form, skills: skillArr })
    }
    setVolunteers(await getVolunteers())
    setShowModal(false)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Remove this volunteer?')) {
      await deleteVolunteer(id)
      setVolunteers((prev) => prev.filter((v) => v.id !== id))
    }
  }

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors((er) => ({ ...er, [field]: '' }))
  }

  const getInitials = (name) => name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="app-layout">
      <Header currentScreen="volunteers" navigate={navigate} user={user} handleLogout={handleLogout} />

      <main className="main-content">
        <div className="page-header">
          <div className="page-header-inner">
            <div>
              <div className="page-subtitle">People</div>
              <h2 className="page-title">Volunteers</h2>
            </div>
            <Button variant="primary" onClick={openAdd}>＋ Add Volunteer</Button>
          </div>
        </div>

        <div className="page-body">
          {/* Filter bar */}
          <div className="filter-bar">
            <div className="input-wrapper" style={{ flex: 1, maxWidth: '380px' }}>
              <span className="input-icon">🔍</span>
              <input
                className="form-input"
                placeholder="Search by name, email or skill…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
              {filtered.length} volunteer{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Cards grid */}
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <h3>No volunteers found</h3>
              <p>Try a different search term or add a new volunteer.</p>
              <Button variant="primary" onClick={openAdd}>Add Volunteer</Button>
            </div>
          ) : (
            <div className="volunteers-grid">
              {filtered.map((v) => (
                <div key={v.id} className="volunteer-card">
                  <div className="volunteer-card-header">
                    <div className="volunteer-avatar">{getInitials(v.name)}</div>
                    <div>
                      <div className="volunteer-name">{v.name}</div>
                      <div className="volunteer-email">{v.email}</div>
                    </div>
                    <span className={`badge ${v.status === 'Active' ? 'badge-green' : 'badge-gray'}`} style={{ marginLeft: 'auto' }}>
                      {v.status}
                    </span>
                  </div>

                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Skills</div>
                    <div className="volunteer-skills">
                      {v.skills.map((s) => <span key={s} className="skill-tag">{s}</span>)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--slate-400)' }}>
                      🕐 {v.availability}
                    </span>
                  </div>

                  <div className="volunteer-card-actions">
                    <Button variant="secondary" size="sm" full onClick={() => openEdit(v)}>✎ Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(v.id)}>✕</Button>
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
              <h3 className="modal-title">{editTarget ? 'Edit Volunteer' : 'Add Volunteer'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <Input
              label="Full Name"
              icon="👤"
              placeholder="Jane Doe"
              value={form.name}
              onChange={handleChange('name')}
              error={errors.name}
            />
            <Input
              label="Email"
              type="email"
              icon="✉"
              placeholder="jane@example.com"
              value={form.email}
              onChange={handleChange('email')}
              error={errors.email}
            />
            <Input
              label="Skills (comma-separated)"
              icon="✦"
              placeholder="e.g. Medical, Teaching, IT Support"
              value={form.skills}
              onChange={handleChange('skills')}
              error={errors.skills}
              hint="Enter skills separated by commas"
            />
            <Select
              label="Availability"
              value={form.availability}
              onChange={handleChange('availability')}
            >
              <option value="Full-time">Full-time</option>
              <option value="Weekends">Weekends</option>
              <option value="Evenings">Evenings</option>
              <option value="On-call">On-call</option>
            </Select>
            <Select
              label="Status"
              value={form.status}
              onChange={handleChange('status')}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>

            <div className="modal-footer">
              <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSave}>
                {editTarget ? 'Save Changes' : 'Add Volunteer'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}