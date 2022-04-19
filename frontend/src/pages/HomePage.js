import React from 'react'
import Calendar from '../components/calendar/Calendar';
import moment from 'moment';

const HomePage = () => {
  return (
    <main className='page page--homepage'>
      <Calendar year={moment().format('YYYY')} month={moment().format('MM')}/>
    </main>
  )
}

export default HomePage;
