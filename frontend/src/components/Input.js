import React from 'react'

const Input = (props) => {
  return (
		<React.Fragment>
			<div className="form__wrapper flex">
				<div className="form__field">
						<input {...props} id={props.name} className="form__input" invalid={props.validators[props.name] ? "true" : "false"}/>
						<label htmlFor={props.name} className="form__label form__label--date">{props.placeholder}</label>
				</div>
				{
					props.validators !== []
					&&
					props.validators[props.name]
					&&
					<ul className='validators'>
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