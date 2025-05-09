import React from 'react'
import './styles/Card.css'

export const NoteCard = ({ title, sub, ...props }) => {
  return (
    <button className="card" {...props}>
      <p className="Title">{title}</p>
      <p className="Subtext">{sub}</p>
    </button>
  )
}
