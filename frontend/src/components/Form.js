import React, { cloneElement, isValidElement } from 'react'
import { useSelector } from 'react-redux'

const Form = ({ children, onSubmit, validators, onChange }) => {
  return (
	  <React.Fragment>
      <div className="form-wrapper">
        <form onSubmit={onSubmit} className="form flex">
          {
            children.length > 1 ?
              children.map((child, index) => {
                if (isValidElement(child)) {
                  let clonedChild = cloneElement(child, {
                    validators: validators, 
                    key: index, 
                    onChange: onChange
                  })
                  return clonedChild
                }
                return child
              })
            :
              cloneElement(children, {validators: validators, onChange: onChange})
          }
          {
            validators != []
            &&
            <ul className="validators">
              {
                validators['non_field_errors']
                &&
                validators['non_field_errors'].map((validator, index) => 
                  <li className='validator' key={index}>
                    {validator}
                  </li>
                )
                ||
                validators['detail']
                &&
                <li className="validator">
                  {validators['detail']}
                </li>
              }
            </ul>
          }
        </form>
      </div>
	  </React.Fragment>
  )
}

export default Form