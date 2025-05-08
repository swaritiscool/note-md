import React from 'react'
import './styles/ActionButton.css'

export const ActionButton = ({ children, ...props }) => {
  return (
    <button {...props} className="Action">
      {children}
    </button>
  )
}
