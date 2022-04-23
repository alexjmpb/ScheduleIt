import React from 'react'

const ModalButton = (props) => {
  const newProps = {...props}
  delete newProps['func']
  return (
    <div {...newProps} className={'button modal__button ' + props.classNames} onClick={props.func}>
      <p>{newProps.children}</p>
    </div>
  )
}

export default ModalButton