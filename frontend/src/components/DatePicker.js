import React, { useState } from 'react'
import DropDown from './DropDown'

const DatePicker = ({ onClick }) => {
  const [open, setOpen] = useState(false);
  function handleClose(e) {
    setOpen(false)
  }

  return (
    <React.Fragment>
      <input type="text" onClick={() => setOpen(!open)}/>
      <DropDown close={handleClose} open={open}>
        <div>DatePicker</div>
      </DropDown>
    </React.Fragment>
  )
}

export default DatePicker