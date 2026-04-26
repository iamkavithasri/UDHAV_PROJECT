import React, { useState } from 'react'
import Button from '../components/Button'
import { Input } from '../components/Input'

export default function LoginScreen({ navigate, onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Minimum 6 characters'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    // Simulate auth — replace with firebase auth.signIn()
    setTimeout(() => {
      setLoading(false)
      onLogin({ email: form.email, name: form.email.split('@')[0] })
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

        <div className="auth-stats">
          <div className="auth-stat">
            <div className="auth-stat-number">1.2k</div>
            <div className="auth-stat-label">Volunteers</div>
          </div>
          <div className="auth-stat">
            <div className="auth-stat-number">340</div>
            <div className="auth-stat-label">Active Tasks</div>
          </div>
          <div className="auth-stat">
            <div className="auth-stat-number">98%</div>
            <div className="auth-stat-label">Completion</div>
          </div>
        </div>

        {/* Decorative quote */}
        <blockquote style={{
          marginTop: '3rem',
          maxWidth: '360px',
          textAlign: 'center',
          zIndex: 1,
          color: 'var(--slate-400)',
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: '1rem',
          lineHeight: 1.7,
          borderLeft: '3px solid var(--gold)',
          paddingLeft: '1.25rem',
          textAlign: 'left',
        }}>
          "The best way to find yourself is to lose yourself in the service of others."
          <cite style={{
            display: 'block',
            marginTop: '0.5rem',
            fontStyle: 'normal',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--gold)',
            letterSpacing: '0.08em',
          }}>— Mahatma Gandhi</cite>
        </blockquote>
      </div>

      {/* Right panel — form */}
      <div className="auth-panel-right">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <p className="page-subtitle" style={{ marginBottom: '0.5rem' }}>Welcome back</p>
            <h2>Sign in to your account</h2>
          </div>

          <form onSubmit={handleSubmit} noValidate>
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
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange('password')}
              error={errors.password}
              autoComplete="current-password"
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem', marginTop: '-0.5rem' }}>
              <a href="#" style={{ fontSize: '0.82rem' }}>Forgot password?</a>
            </div>

            <Button type="submit" variant="primary" full size="lg" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </Button>
          </form>

          <div className="divider-text">or</div>

          <Button
            variant="secondary"
            full
            onClick={() => navigate('signup')}
            style={{ marginBottom: '0' }}
          >
            Create a new account
          </Button>

          <div className="auth-form-footer" style={{ marginTop: '2rem' }}>
            <span style={{ color: 'var(--slate-500)', fontSize: '0.78rem' }}>
              By signing in you agree to our{' '}
              <a href="#">Terms of Service</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}