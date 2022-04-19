import React from 'react'

const ModalButton = (props) => {
  console.log(props)
  return (
    <div {...props} className={'button modal__button ' + props.classNames} onClick={props.func}>
      <p>{props.children}</p>
    </div>
  )
}

export default ModalButton