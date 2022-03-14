import React from 'react'

const ModalButton = ({children, onClick, func, classNames}) => {
  return (
    <div className={'button modal__button ' + classNames} onClick={func}>
      <p>{children}</p>
    </div>
  )
}

export default ModalButton