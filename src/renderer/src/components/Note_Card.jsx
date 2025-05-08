import React from 'react'
import './styles/Card.css'

export const NoteCard = ({ title, sub }) => {
  return (
    <div className="card">
      <p className="Title">{title}</p>
      <p className="Subtext">{sub}</p>
    </div>
  )
}
