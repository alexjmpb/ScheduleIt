import React from 'react'
import { useSelector } from 'react-redux'

const Form = ({ children, onSubmit, validators }) => {
  return (
	  <React.Fragment>
		<form onSubmit={onSubmit} className="form flex">
			{children}
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
	  </React.Fragment>
  )
}

export default Form