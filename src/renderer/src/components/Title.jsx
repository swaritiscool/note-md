import React from 'react'
import './styles/Titlebar.css'

export const TitleComponent = ({ children, ...props }) => {
  return (
    <div className="titlebar" {...props}>
      {children}
    </div>
  )
}
