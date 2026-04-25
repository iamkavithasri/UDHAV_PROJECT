import React from 'react'

/**
 * Button component
 * @param {string} variant - 'primary' | 'secondary' | 'ghost' | 'danger'
 * @param {string} size    - 'sm' | 'md' | 'lg'
 * @param {boolean} full   - full width
 * @param {boolean} iconOnly - icon-only square button
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  full = false,
  iconOnly = false,
  className = '',
  ...props
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '',
    full ? 'btn-full' : '',
    iconOnly ? 'btn-icon' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}