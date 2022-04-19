import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { round } from 'mathjs'
import { axiosInstance } from '../../axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as LeftArrow } from '../../svg/left-icon.svg'
import { ReactComponent as RightArrow } from '../../svg/right-icon.svg'
import { calendarMonth, getTasks } from '../../utils/calendarUtils';

const Calendar = ({onDayClick, year, month}) => {
  const params = useParams();
  const [now, setNow] = useState(
    moment(
      params.year 
      && 
      params.month 
      ?
        `${params.year}-${params.month}`
      :
      year && month
      ?
      `${year}-${month}`
      :
      null
    )
  )
  const [tasks, setTasks] = useState([]);
  const [recurringPatterns, setRecurringPatterns] = useState([])
  const [calendar, setCalendar] = useState({})
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const navigate = useNavigate();

  useEffect(() => {
    getTasks(now)
      .then((response) => {
        setTasks(response[0])
        setRecurringPatterns(response[1])
      })
  }, [now])

  useEffect(() => {
    setCalendar(calendarMonth(tasks, now));
  }, [tasks, now])

  useEffect(() => {
    if (params.year && params.month) {
      setNow(moment(`${params.year}-${params.month}`))
    }
  }, [params.year, params.month])
  
  return (
    <div className="calendar">
      <div className="calendar__header">
        <h1>{now.format('MMMM YYYY')}</h1>
        <button className='button button-outlined' onClick={() => navigate(moment().format('[/calendar/]YYYY/MM/'))}>Today</button>
        <div className='calendar__arrows'>
          <button
            onClick={() => {
              if (params.year && params.month) {
                navigate(now.clone().subtract(1, 'months').format('[/calendar/]YYYY/MM/'));
              } else {
                setNow(now.clone().subtract(1, 'months'));
              }
            }} 
            className="icon-button"
          >
            <LeftArrow className="calendar__arrow"/>
          </button>
          <button 
            onClick={() => {
              if (params.year && params.month)
              {
                navigate(now.clone().add(1, 'months').format('[/calendar/]YYYY/MM/'));
              } else {
                setNow(now.clone().add(1, 'months'));
              }
            }} 
            className="icon-button"
          >
            <RightArrow className="calendar__arrow"/>
          </button>
        </div>
      </div>
      <div className="calendar__body">
      {
          weekDays.map((day, index) => 
            <div className="calendar__day calendar__day--word" key={index}>
              {day}
            </div>
          )
        }
        {
          Object.keys(calendar).map((key, index) => 
            
            <div 
              className={
                "calendar__day" 
                + (!calendar[key].moment.isSame(now.clone(), 'month') ? ' calendar__day--unactive' : '') 
                + (calendar[key].tasks.length > 0 ? ' calendar__day--has-tasks' : '')
              } 
              key={index}
            >
              <Link 
                to={
                  `/calendar/${calendar[key].moment.format('YYYY')}/${calendar[key].moment.format('MM')}/${calendar[key].moment.format('DD')}/`
                } 
                className="link day-link"
              >
                <p className="calendar__number">
                  {calendar[key].moment.format('D')}
                </p>
              </Link>
              {calendar[key].tasks.map((task, taskIndex) =>
                  task?.is_deleted ?
                    null
                  :
                  <Link 
                    to={
                      `/calendar/edit/${
                        btoa(JSON.stringify({
                          isException: (task.is_exception ? true : false),
                          id: task.id
                        }))
                      }/`
                    } 
                    state={
                      {
                        taskOptions: task,
                        recurringPattern: recurringPatterns.find(pattern => pattern.parent_object.id === task.id)
                      }
                    } 
                    className="link task-link"  
                    key={taskIndex}
                  >
                    <div className="calendar__task">
                      {moment(task.due_date).format("ha ")}
                      {task.title}
                    </div>
                  </Link>
              )}
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Calendar