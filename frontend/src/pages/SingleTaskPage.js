import React from 'react'
import SingleTask from '../components/tasks/SingleTask'
import BackButton from '../components/BackButton'

const SingleTaskPage = () => {
  return (
    <main className="page">
        <div className="component">
          <div className="component__header">
            <BackButton/>
          </div> 
          <SingleTask/>
        </div>
    </main>
  )
}

export default SingleTaskPage