import React, { useState } from 'react'
import Button from '../components/Button'
import { Input } from '../components/Input'

export default function SignupScreen({ navigate, onLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Minimum 6 characters'
    if (!form.confirm) e.confirm = 'Please confirm your password'
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    // Replace with firebase auth.createUser()
    setTimeout(() => {
      setLoading(false)
      onLogin({ email: form.email, name: form.name })
    }, 900)
  }

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors((er) => ({ ...er, [field]: '' }))
  }

  return (
    <div className="auth-layout">
      {/* Left panel */}
      <div className="auth-panel-left">
        <div className="auth-brand">
          <div className="auth-brand-logo">🌿</div>
          <h1>UDHAV</h1>
          <p>Connect · Serve · Impact</p>
        </div>

        <div style={{
          marginTop: '3rem',
          zIndex: 1,
          maxWidth: '340px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {[
            { icon: '✦', title: 'Smart Matching', desc: 'AI-powered volunteer-task matching based on skills & availability' },
            { icon: '◈', title: 'Real-time Tracking', desc: 'Monitor assignments and progress from one unified dashboard' },
            { icon: '⬡', title: 'Impact Reports', desc: 'Measure community impact with detailed analytics and insights' },
          ].map((f) => (
            <div key={f.title} style={{
              display: 'flex',
              gap: '0.875rem',
              alignItems: 'flex-start',
              padding: '0.875rem',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <span style={{ fontSize: '1.3rem', color: 'var(--gold)', flexShrink: 0 }}>{f.icon}</span>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--white)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{f.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--slate-400)' }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-panel-right">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <p className="page-subtitle" style={{ marginBottom: '0.5rem' }}>Get started</p>
            <h2>Create your account</h2>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <Input
              label="Full Name"
              type="text"
              icon="👤"
              placeholder="Jane Doe"
              value={form.name}
              onChange={handleChange('name')}
              error={errors.name}
              autoComplete="name"
            />

            <Input
              label="Email address"
              type="email"
              icon="✉"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange('email')}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              icon="🔑"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange('password')}
              error={errors.password}
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              type="password"
              icon="🔒"
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={handleChange('confirm')}
              error={errors.confirm}
              autoComplete="new-password"
            />

            <Button type="submit" variant="primary" full size="lg" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account →'}
            </Button>
          </form>

          <div className="divider-text">already have an account?</div>

          <Button variant="secondary" full onClick={() => navigate('login')}>
            Sign In Instead
          </Button>
        </div>
      </div>
    </div>
  )
}