import React from 'react'
import Calendar from '../components/calendar/Calendar';
import moment from 'moment';
import TaskForm from '../components/tasks/TaskForm';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <main className='page page--homepage'>
      <div className="component">
        <div className="component__header component__header--sticky">
          <Link
            to={`/calendar/${moment().format("YYYY")}/${moment().format("MM")}/`}
            className="link"
          >
            <h1 className="component__title">Calendar</h1>
          </Link>
        </div>
        <Calendar year={moment().format('YYYY')} month={moment().format('MM')}/>
      </div>
      <div className="component">
        <div className="component__header component__header--sticky">
        <Link
            to={`/calendar/create/`}
            className="link"
          >
            <h1 className="component__title">Create a task</h1>
          </Link>
        </div>
        <TaskForm/>
      </div>
    </main>
  )
}

export default HomePage;
