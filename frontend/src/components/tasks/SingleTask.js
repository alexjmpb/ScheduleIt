import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { axiosInstance } from '../../axios';
import TaskForm from './TaskForm';

const SingleTask = ({ onChange }) => {
  const params = useParams();
  const location = useLocation();
  const taskType = JSON.parse(atob(params?.element));
  const taskOptions = location.state?.taskOptions;
  const [task, setTask] = useState({
    id: '',
    title: '',
    description: '',
    due_date: '',
    is_event: '',
    is_fully_day: '',
    start_time: '',
    created_by: '',
    is_recurring: ''
  });
  const [recurringPattern, setRecurringPattern] = useState({
    id: '',
    recurrence: 1,
    parent_object: '',
  });

  useEffect(() => {
    if (taskOptions) {
      setTask({
        ...taskOptions
      });
    } else if (taskType.isException) {
      axiosInstance.get(`/calendar/exceptions/${taskType.id}`)
        .then((response) => {
          setTask(response.data);
        })
    } else {
      axiosInstance.get(`/calendar/objects/${taskType.id}/`)
        .then((response) => {
          setTask(response.data);
        })
    }

    if (location.state?.recurringPattern?.id) {
      setRecurringPattern(location.state.recurringPattern)
    } else if (taskType.isRecurring) {
      axiosInstance.get(`/calendar/recurring_patterns/`)
        .then((response) => {
          setRecurringPattern(
            response.data.find(pattern => pattern.parent_object.id === taskType.id)
          )
        })
    }
  }, [])

  return (
    <div className="task">
      <TaskForm
        originalTask={{...task, isException: taskOptions?.isException}}
        originalRecurringPattern={recurringPattern}
        editing={true}
      />
    </div>
  )
}

export default SingleTask