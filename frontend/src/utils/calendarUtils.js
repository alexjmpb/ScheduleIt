import { round } from 'mathjs'
import { axiosInstance } from '../axios'
import moment from 'moment'

export async function getTasks(now) {
  let tasks = []
  let recurringPatterns = []
  await axiosInstance.get(`/calendar/${now.clone().format('YYYY')}/${now.clone().format('MM')}/`)
  .then((response) => {
    const recurringTasks = []
    const exceptions = response.data.calendar_exceptions.map(exception => {
      return {...exception, is_exception: true}
    })

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

      while (recurringDay.isSameOrBefore(endDay)) {
        const newObject = pattern.parent_object;
        const occurrence = round(recurringDay.diff(dueDate, 'days') / pattern.recurrence)
        if (response.data.calendar_exceptions.filter(exception => exception.occurrence_number === occurrence).length === 0 && recurringDay.isAfter(dueDate)) {
          recurringTasks.push({
            ...newObject,
            due_date: recurringDay.clone().utc().format(),
            start_date: recurringDay.clone().subtract(moment(pattern.start_date).diff(dueDate, 'days'), 'days').utc().format(),
            occurrence_number: occurrence,
            original_object: pattern.parent_object.id
          });
        }
        recurringDay.add(pattern.recurrence, 'days');
      }
    })
    tasks = response.data.calendar_objects.concat(recurringTasks, exceptions)
    recurringPatterns = response.data.recurring_patterns
  })
  return [tasks.sort((a, b) => moment(a.due_date).unix() - moment(b.due_date).unix()), recurringPatterns]
}

export function calendarMonth(tasks, now) {
  const endDay = now.clone().endOf('month').endOf('week');
  const startDay = now.clone().startOf('month').startOf('week');
  const month = {};

  if (round(endDay.diff(startDay, 'days') / 7) < 6 ) {
    endDay.add(1, 'w')
  }

  while (startDay.isBefore(endDay)) {
    month[startDay.format('YYYY-MM-DD')] = {
      "moment":startDay.clone(),
      "tasks": tasks?.filter(task => startDay.isSame(moment(task.due_date), 'day'))
    }
    startDay.add(1, 'd')
  }
  return month
}