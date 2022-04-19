import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '../axios';
import moment from 'moment';
import ModalBox, { ModalHeader, ModalBody, ModalFooter } from './modals/ModalBox'
import ModalButton from './modals/ModalButton';
import { useAlert } from 'react-alert'
import { ReactComponent as DeleteIcon } from '../svg/delete-icon.svg'

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
  const [openConfirm, setOpenConfirm] = useState(false);
  const [changeAll, setChangeAll] = useState(false);
  const alert = useAlert();
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteAll, setDeleteAll] = useState(false);

  function handleDeleteAll(e) {
    setDeleteAll(e.target.id === "deleteAll" ? e.target.checked : false)
  }

  function handleChangeAll(e) {
    setChangeAll(e.target.id === "changeAll" ? e.target.checked : false)
  }

  function handleChange(e) {
    setTask({
      ...task, 
      [e.target.name]: e.target.value,
      due_date: (
        e.target.name === 'due_date' ?
          moment.utc(e.target.value + moment().format('Z')).toISOString()
        :
          task.due_date
      ),
      start_time: (
        e.target.name === 'start_time' ?
          moment.utc(moment(e.target.value, 'HH:mm:ss')).format('HH:mm:ss')
        :
          task.start_time
      ),
      is_event: (
        e.target.name === 'is_event' ?
          e.target.checked
        :
          task.is_event
      ),
      is_recurring: (
        e.target.name === 'is_recurring' ?
          e.target.checked
        :
          task.is_recurring
      ),
    })
  }

  function handlePatternChange(e) {
    setRecurringPattern({
      ...recurringPattern,
      [e.target.name]: e.target.value
    })
  }

  function handleConfirmClose() {
    setOpenConfirm(false);
    setChangeAll(false);
  }

  useEffect(() => {
    if (taskOptions) {
      setTask(taskOptions);
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

  async function handleDelete(e) {
    try {
      if (taskType.isException && !taskType?.is_deleted) {
        await axiosInstance.patch(`/calendar/exceptions/${taskType.id}/`, {is_deleted: true})
      } else if (taskOptions?.is_recurring && taskOptions.occurrence_number && !deleteAll) {
        await axiosInstance.post(`/calendar/exceptions/`, {...task, is_deleted: true})
      } else {
        await axiosInstance.delete(`/calendar/objects/${taskType.id}/`)
      }
      alert.show("Task deleted");
      navigate(`/calendar/${moment(task.due_date).format('YYYY/MM/')}`);
    } catch(e) {
      console.log(e)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (taskType.isException) {
        await axiosInstance.patch(`/calendar/exceptions/${taskType.id}/`, task)
      } else if (taskOptions?.is_recurring && !task.is_recurring) {
        await axiosInstance.delete(`/calendar/recurring_patterns/${recurringPattern.id}/`)
        await axiosInstance.patch(`/calendar/objects/${taskType.id}/`, task)
      } else if (!taskOptions?.occurrence_number && taskOptions?.is_recurring) {
        await axiosInstance.patch(`/calendar/objects/${taskType.id}/`, task)
        await axiosInstance.patch(`/calendar/recurring_patterns/${recurringPattern.id}/`, recurringPattern)
      } else if (taskOptions?.occurrence_number) {
        if (!changeAll) {
          await axiosInstance.post('/calendar/exceptions/', task)
        } else {
          await axiosInstance.post('/calendar/objects/', task)
          .then(async (response) => {
            let oldPattern = {
              ...location.state?.recurringPattern,
              has_end: true,
              final_date: moment(taskOptions.due_date).clone().subtract(location.state?.recurringPattern.recurrence, 'd').format('YYYY-MM-DD')
            }
            let newPattern = {
              ...recurringPattern,
              parent_id: response.data.id
            }
            await axiosInstance.patch(`/calendar/recurring_patterns/${recurringPattern.id}/`, oldPattern)
            await axiosInstance.post(`/calendar/recurring_patterns/`, newPattern)
          })
        }
      } else {
        await axiosInstance.patch(`/calendar/objects/${taskType.id}/`, task)
        if (task.is_recurring) {
          await axiosInstance.post('/calendar/recurring_patterns/', {...recurringPattern, parent_id: task.id})
      }
    }
      alert.success('Task updated');
      navigate(`/calendar/${moment(task.due_date).format('YYYY/MM/')}`);
    } catch(error) {
      console.log(error?.response);
    }
  }

  return (
    <div className="task">
      <form onSubmit={handleSubmit} className="task__form">
        <div className="task__wrapper">
          <input 
            type="text" 
            className="task__input" 
            value={task.title} 
            name="title" 
            onChange={handleChange}
          />
        </div>
        <div className="task__wrapper">
          <textarea 
            type="text" 
            className="task__input" 
            name="description" 
            onChange={handleChange}
            value={task.description} 
          >

          </textarea>
        </div>
        <div className="task__wrapper">
          <label htmlFor="isEvent">Is event?</label>
          <input 
            type="checkbox"
            id='isEvent'
            className="task__input" 
            checked={task.is_event}
            name="is_event" 
            onChange={handleChange}
          />
        </div>
        {
          task.is_event &&
            <div className="task__wrapper">
              <label htmlFor="startTime">Starts at</label>
              <input 
                type="time"
                id='startTime'
                className="task__input" 
                value={moment(moment.utc(task.start_time, 'HH:mm:ss').toISOString()).format('HH:mm:ss')} 
                name="start_time" 
                onChange={handleChange}
              />
            </div>
        }
        <div className="task__wrapper">
          <label htmlFor="dueDate">Due on</label>
          <input 
            type="datetime-local"
            id='dueDate'
            className="task__input" 
            value={moment(task.due_date).format('YYYY-MM-DD[T]HH:mm:ss')} 
            name="due_date" 
            onChange={handleChange}
          />
        </div>
        {
          !taskType.isException &&
            <div className="task__wrapper">
              <label htmlFor="isEvent">Does it repeat?</label>
              <input 
                type="checkbox"
                id='isRecurring'
                className="task__input" 
                checked={task.is_recurring}
                name="is_recurring" 
                onChange={handleChange}
              />
            </div>
        }
        {
          task.is_recurring &&
          !taskOptions.is_recurring ?
          <React.Fragment>
            <input type="number" name="recurrence" id="recurrence" value={recurringPattern.recurrence} onChange={handlePatternChange}/> 
            <button type='submit'>Save</button>
          </React.Fragment>
          :
          task.is_recurring &&
          taskOptions.is_recurring ?
            <React.Fragment>
              <input type="number" name="recurrence" id="recurrence" value={recurringPattern.recurrence} onChange={handlePatternChange}/>
              <button onClick={() => setOpenConfirm(true)} type='button'>Save</button>
              <ModalBox
                open={openConfirm}
                handleClose={handleConfirmClose}
              >
                <ModalHeader>
                  <h1 className='modal__tile'>Confirm</h1>
                </ModalHeader>
                <ModalBody>
                  <div className="task__wrapper">
                    <input type="radio" id="changeThis" name="hey" checked={!changeAll} onChange={handleChangeAll}/>
                    <label htmlFor="changeThis">Change only this task</label>
                  </div>
                  <div className="task__wrapper">
                    <input type="radio" id="changeAll" name="hey" checked={changeAll} onChange={handleChangeAll}/>
                    <label htmlFor="changeAll">Change this and all following tasks</label>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <ModalButton func={handleSubmit}>Save</ModalButton>
                </ModalFooter>
              </ModalBox>
            </React.Fragment>
          :
            <button type='submit'>Save</button>
        }

      </form>
      <DeleteIcon onClick={() => setOpenDelete(true)}/>
      <ModalBox
        open={openDelete}
        handleClose={() => setOpenDelete(false)}
      >
        <ModalHeader>
          <h1 className="modal__title">Delete</h1>
        </ModalHeader>
        <ModalBody>
          {
            taskOptions?.occurrence_number &&
            taskOptions?.is_recurring ?
            <React.Fragment>
              <div className="task__wrapper">
                <input type="radio" id="deleteThis" checked={!deleteAll} onChange={handleDeleteAll}/>
                <label htmlFor="deleteThis">Delete only this task</label>
              </div>
              <div className="task__wrapper">
                <input type="radio" id="deleteAll" checked={deleteAll} onChange={handleDeleteAll}/>
                <label htmlFor="deleteAll">Delete all tasks</label>
              </div>
            </React.Fragment>
            :
            taskType.isException ?
            <p>Are you sure you want to delete this task?</p>
            :
            <p>Are you sure you want to delete this task? All the following tasks will be deleted as well.</p>
          }

        </ModalBody>
        <ModalFooter>
          <ModalButton func={handleDelete}>Delete</ModalButton>
        </ModalFooter>
      </ModalBox>
    </div>
  )
}

export default SingleTask