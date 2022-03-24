import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { axiosInstance } from '../axios';
import moment from 'moment';
import Notifier from "react-desktop-notification"
import {floor} from 'mathjs';
import DatePicker from './DatePicker';

const SingleTask = ({onChange}) => {
  const params = useParams();
  const [task, setTask] = useState({
    title: '',
    description: '',
    start_date: '',
    due_date: '',
    is_recurring: '',
    is_fully_day: '',
    is_event: '',
    created_by: '',
  });
  const [taskInfo, setTaskInfo] = useState(task);
  const location = useLocation();
  
  function handleChange(e) {
    setTaskInfo({
      ...taskInfo,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    if (location.state.taskOptions) {
      const taskOptions = location.state.taskOptions
      setTask(taskOptions)
      setTaskInfo(taskOptions)
    }
    else {
      axiosInstance.get(`/calendar/objects/${params.id}/`)
      .then((response) => {
        setTask(response.data);
      })
      .catch((error) => {
        console.log(error.response)
      })
    }
    
  }, [])

  console.log(moment(taskInfo.start_date))
  console.log(taskInfo)

  return (
    <div className="task">
      <DatePicker/>
    </div>
  )
}

export default SingleTask