import React from 'react'
import Calendar from '../components/calendar/Calendar';
import moment from 'moment';
import TaskForm from '../components/tasks/TaskForm';

const HomePage = () => {
  return (
    <main className='page page--homepage'>
      <div className="component">
        <div className="component__header component__header--sticky">
          <h1 className="component__title">Calendar</h1>
        </div>
        <Calendar year={moment().format('YYYY')} month={moment().format('MM')}/>
      </div>
      <div className="component">
        <div className="component__header component__header--sticky">
          <h1 className="component__title">Create a task</h1>
        </div>
        <TaskForm/>
      </div>
    </main>
  )
}

export default HomePage;
