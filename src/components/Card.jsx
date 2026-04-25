import React from 'react'

export default function Card({ children, className = '', style, onClick }) {
  return (
    <div
      className={`card ${className}`}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, action }) {
  return (
    <div className="card-header">
      <h3 className="card-title">{children}</h3>
      {action && <div>{action}</div>}
    </div>
  )
}

export function StatCard({ icon, number, label, delta, style }) {
  return (
    <div className="stat-card" style={style}>
      {delta && <span className="stat-card-delta">↑ {delta}</span>}
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-number">{number}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  )
}