import React from 'react'
import { ReactComponent as AddIcon } from '../../svg/add-icon.svg'
import { useNavigate, useLocation } from 'react-router-dom'

const CreateTaskIcon = ({ onClick }) => {
  const navigate = useNavigate();
  const path = window.location.href
  const location = useLocation()
  if (!path.includes('create') && location.pathname !== '/') {
    return (
      <AddIcon onClick={() => navigate('/calendar/create/')} className="create-task"/>
    )
  }
  return null
}

export default CreateTaskIcon