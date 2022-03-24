import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as BackButtonIcon } from '../svg/left-icon.svg'

const BackButton = ({ onClick }) => {
  const navigate = useNavigate();
  function handleClick(e) {
    navigate(-1);
  }
  return (
    <button  onClick={handleClick}  className="back-button">
      <BackButtonIcon/>
    </button>
  )
}

export default BackButton