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
    <div className="dropdown">
      {
        
        children.find(child => child.type?.name === 'DropDownHandler')
      }
      {
        open ?
          <div className='dropdown__data' ref={dropdown}>
            {children.filter(child => child.type?.name !== 'DropDownHandler')}
          </div>
        :
          null
      }
    </div>
    
  )
}

export default DropDown