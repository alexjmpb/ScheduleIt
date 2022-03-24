import React, { useEffect, useRef } from 'react'

const DropDown = ({ children, close, open=false }) => {
  const dropdown = useRef()
  function handleClick(e) {
    if (dropdown.current && !dropdown.current.contains(e.target)) {
      close()
    }
  }
  useEffect(() => {
    if (open) document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [open])
  
  return (
    open ?
      <div className='dropdown' ref={dropdown}>DropDown {children}</div>
    :
    null
  )
}

export default DropDown