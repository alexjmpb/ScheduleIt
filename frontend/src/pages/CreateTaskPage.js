import React from 'react'
import TaskForm from '../components/tasks/TaskForm'
import BackButton from '../components/BackButton'

const CreateTaskPage = () => {
  return (
    <div className="page">
        <div className="component">
          <div className="component__header">
            <BackButton/>
            <h1 className="component__title">Create a task</h1>
          </div> 
            <TaskForm/>
        </div>
    </div>
  )
}

export default CreateTaskPage