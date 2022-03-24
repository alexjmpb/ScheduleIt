import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { round } from 'mathjs'
import { axiosInstance } from '../axios';
import { Link } from 'react-router-dom';
import { ReactComponent as LeftArrow } from '../svg/left-icon.svg'
import { ReactComponent as RightArrow } from '../svg/right-icon.svg'

const Calendar = () => {
  const [now, setNow] = useState(moment('9000-01-02'));

  const [tasks, setTasks] = useState([])
  const [calendar, setCalendar] = useState({})
  const [recurringPatterns, setRecurringPatterns] = useState([])
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  


  useEffect(async () => {
    await axiosInstance.get(`/calendar/${now.clone().format('YYYY')}/${now.clone().format('MM')}/`)
      .then((response) => {
        setRecurringPatterns(response.data.recurring_patterns);
        
        const recurringTasks = []

        response.data.recurring_patterns.map((pattern) => {
          const monthStart = now.clone().startOf('month').startOf('week')
          const endDay = (!pattern.has_end ? now.clone().endOf('month').endOf('week') : moment(pattern.final_date));
          const dueDate = moment(pattern.parent_object.due_date);
          const startDay = (!dueDate.isAfter(monthStart, 'month') ? monthStart : dueDate.clone().add(pattern.recurrence, 'days'));
          const diff = startDay.diff(dueDate, 'days');
          const recurringDay = dueDate.clone().add(round(diff / pattern.recurrence) * pattern.recurrence, 'days');

          if (round(endDay.diff(startDay, 'days') / 7) < 6 && !pattern.has_end) {
            endDay.add(1, 'w')
          }

          while (recurringDay.isBefore(endDay)) {
            const newObject = pattern.parent_object;
            const occurrence = round(recurringDay.diff(dueDate, 'days') / pattern.recurrence)
            if (response.data.calendar_exceptions.filter(exception => exception.occurrence_number == occurrence).length == 0) {
              recurringTasks.push({
                ...newObject,
                due_date: recurringDay.clone().utc().format(),
                start_date: recurringDay.clone().subtract(moment(pattern.start_date).diff(dueDate, 'days'), 'days').utc().format(),
                occurrence: occurrence,
              });
            }
            recurringDay.add(pattern.recurrence, 'days');
          }
        })

        setTasks(response.data.calendar_objects.concat(recurringTasks, response.data.calendar_exceptions))
      })

  }, [now])

  useEffect(() => {
    const endDay = now.clone().endOf('month').endOf('week');
    const startDay = now.clone().startOf('month').startOf('week');
    const month = {};

    if (round(endDay.diff(startDay, 'days') / 7) < 6 ) {
      endDay.add(1, 'w')
    }

    while (startDay.isBefore(endDay)) {
      month[startDay.format('YYYY-MM-DD')] = {
        "moment":startDay.clone(),
        "tasks": tasks.filter(task => startDay.isSame(moment(task.due_date), 'day'))
      }
      startDay.add(1, 'd')
    }

    setCalendar(month);
  }, [tasks, now])
  
  return (
    <div className="component">
        <div className="component__header">
          <h1 className="component__title">Calendar</h1>
        </div>
        <div className="component__body">
            <div className="calendar">
              <div className="calendar__header">
                <button onClick={() => setNow(now.clone().subtract(1, 'month'))} className="icon-button"><LeftArrow className="calendar__arrow"/></button>
                <h1>{now.format('MMMM YYYY')}</h1>
                <button onClick={() => setNow(now.clone().add(1, 'month'))} className="icon-button"><RightArrow className="calendar__arrow"/></button>
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
                    
                    <div className={"calendar__day" + (!calendar[key].moment.isSame(now.clone(), 'month') ? ' calendar__day--unactive' : '')} key={index}>
                      {calendar[key].moment.format('DD')}
                      {calendar[key].tasks.map((task, taskIndex) => 
                        <Link to={`/calendar/objects/${task.id}/`} state={{taskOptions: task}} className="link"  key={taskIndex}>
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
        </div>
    </div>
  )
}

export default Calendar