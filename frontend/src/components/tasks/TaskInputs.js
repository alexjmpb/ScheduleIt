import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

export const TaskInput = (props) => {
  const validators = useSelector(state => state.calendar.validators)

  return (
    <React.Fragment>
      <div className="task-form__wrapper">
        {
          props.label ?
            <label htmlFor={props?.name}>{props['label']}</label>
          :
            null
        }
        <div className="task-form__validation-wrapper">
          <input 
            {...props}
            children={null} 
            className={"task-form__input " + (validators[props.name] ? "task-form__input--validator " : "") + (props?.className ? props?.className : '')}
            id={props?.name}
            autoComplete="off"
          />
          {
            validators[props.name] &&
            validators[props.name].map((validator, index) => 
              <div className="task-form__validator">
                {validator}
              </div>
            )
          }
        </div>
        {props.children}
      </div>
    </React.Fragment>
  )
}


export const TaskTextarea = (props) => {
  return (
    <React.Fragment>
      <div className="task-form__wrapper">
        <label htmlFor={props.name}>{props['label']}</label>
        <textarea 
          className="task-form__textarea" 
          {...props} 
          id={props.name}
        >
          {props.children}
        </textarea>
      </div>
    </React.Fragment>
  )
}

export const TaskDatetime = (props) => {
  return (
    <TaskInput
      {...props} 
      className={"task-form__input--datetime" + (props?.className ? props?.className : '')}
      id={props?.name} 
      type="datetime-local"
    />
  )
}

export const TaskTime = (props) => {
  return (
    <TaskInput
      {...props}
      className={"task-form__input--time" + (props?.className ? props?.className : '')}
      id={props?.name}
      type="time"
    />
  )
}

export const TaskDate = (props) => {
  return (
    <TaskInput
      {...props}
      className={"task-form__input--date" + (props?.className ? props?.className : '')}
      id={props?.name}
      type="date"
    />
  )
}

export const TaskCheckbox = (props) => {
  return (
    <TaskInput 
      {...props}
      value={props.checked}
      className={"task-form__input--checkbox" + (props?.className ? props?.className : '')}
      id={props?.name} 
      type="checkbox"
    >
      <label htmlFor={props.name} className="task-form__label task-form__label--checkbox-style"></label>
    </TaskInput>
  )
}

export const TaskRecurrence = (props) => {
  function handleChange(e) {
    // if (e.target.value < 1 && e.target.value !== '') e.target.value = '1' 
    props.onChange(e)
  }

  return (
    <div className="task-form__wrapper">
      <TaskInput
        {...props} 
        className={"task-form__input--number"  + (props?.className ? props?.className : '')}
        type="number" 
        value={props.value} 
        onChange={handleChange}
        id={props.name}
        style={{width: `calc(${(props.value.length ? props.value.length : 1 + 1)}ch + 20px)`}}
      >
        <label htmlFor={props?.name}>{props.value > 1 ? 'days' : 'day'}</label>
      </TaskInput>
    </div>
  )
}