import React from 'react'
import './styles/Layout.css'
import { ActionButton } from './ActionButton'
import { FaFilePen, FaTrashCan, FaGear, FaFileCircleCheck } from 'react-icons/fa6'

export const Sidebar = ({ children, ...props }) => {
  return (
    <div className="sidebar" {...props}>
      <div className="utils">
        <ActionButton>
          <FaFilePen color="#fff" />
        </ActionButton>
        <ActionButton>
          <FaFileCircleCheck color="#fff" />
        </ActionButton>
        <ActionButton>
          <FaTrashCan color="#fff" />
        </ActionButton>
        <ActionButton>
          <FaGear color="#fff" />
        </ActionButton>
      </div>
      {children}
    </div>
  )
}

export const Editor = ({ children, ...props }, ref) => {
  return (
    <div className="editor" {...props} ref={ref}>
      {children}
    </div>
  )
}

export const RootLayout = ({ children, ...props }) => {
  return (
    <div className="main" {...props}>
      {children}
    </div>
  )
}
