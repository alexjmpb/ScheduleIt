import React from 'react'
import { useSelector } from 'react-redux'

const Input = (props) => {
  return (
		<React.Fragment>
			<div className="form__wrapper flex">
				<div className="form__field">
						<input {...props} id={props.name} className="form__input"/>
						<label htmlFor={props.name}>{props.placeholder}</label>
				</div>
				{
					props.validators != []
					&&
					props.validators[props.name]
					&&
					<ul className='props.validators'>
					{
						props.validators[props.name].map((validator, index) => 
							<li key={index} className='validator'>
								{validator}
							</li>
						)
					}
					</ul>
				}
			</div>
			
		</React.Fragment>
  )
}

export default Input