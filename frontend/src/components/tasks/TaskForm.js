import React, { useEffect, useState } from 'react'
import { TaskDate, TaskCheckbox, TaskDatetime, TaskInput, TaskRecurrence, TaskTime } from './TaskInputs'
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../axios';
import ModalBox, { ModalHeader, ModalBody, ModalFooter } from '../modals/ModalBox';
import ModalButton from '../modals/ModalButton';
import { ReactComponent as DeleteIcon } from '../../svg/delete-icon.svg'
import { useAlert } from 'react-alert';
import { useDispatch } from 'react-redux';
import { calendarRequestFail } from '../../state/calendar/calendarActions';

export const TaskFormComponent = (props) => {
  const childrenWithProps = props?.children.map((child, index) => {
    if (React.isValidElement(child)) {
      let clonedChild = React.cloneElement(child, {
        key: index, 
      })
      return clonedChild
    }
    return child
  })
  return (
    <form {...props}>
      {childrenWithProps}
    </form>
  )
}

const TaskForm = ({originalTask, originalRecurringPattern, editing=false}) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    due_date: moment.utc().toISOString(),
    is_event: false,
    is_fully_day: false,
    start_date: moment.utc().clone().subtract(15, 'minutes').toISOString(),
    is_recurring: false
  });
  const [recurringPattern, setRecurringPattern] = useState({
    recurrence: 1,
    parent_id: task?.id,
    has_end: false,
    final_date: moment.utc().format("YYYY-MM-DD")
  });
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [changeAll, setChangeAll] = useState(false);
  const [deleteAll, setDeleteAll] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const alert = useAlert();
  const dispatch = useDispatch();
  const params = useParams();
  const taskType = params?.element ? JSON.parse(atob(params?.element)) : null;
  const tzOffset = moment().format("Z")

  function handleConfirmClose() {
    setOpenConfirm(false);
    setChangeAll(false);
  }

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
      start_date: (
        e.target.name === 'start_date' ?
          moment.utc(moment.utc(task.due_date).format("YYYY-MM-DD") + "T" + e.target.value + tzOffset).toISOString()
        :
          task.start_date
      ),
      due_date: (
        e.target.name === 'due_date' ?
          moment.utc(e.target.value + tzOffset).toISOString()
        :
          task.due_date
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

  function handleRecurrenceChange(e) {
    setRecurringPattern({
      ...recurringPattern,
      [e.target.name]: e.target.value,
      has_end: (
        e.target.name === 'has_end' ?
          e.target.checked
        :
          recurringPattern.has_end
      ),
    })
  }

  useEffect(() => {
    if (originalTask) {
      setTask(originalTask)
    }
    if (originalRecurringPattern) setRecurringPattern(originalRecurringPattern)
  }, [originalTask, originalRecurringPattern])

  async function handleDelete(e) {
    if (editing) {
      try {
        if (taskType?.isException && !originalTask?.is_deleted) {
          await axiosInstance.patch(`/calendar/exceptions/${originalTask?.id}/`, {is_deleted: true})
        } else if (originalTask?.is_recurring && originalTask?.occurrence_number && !deleteAll) {
          await axiosInstance.post(`/calendar/exceptions/`, {...task, is_deleted: true})
        } else {
          await axiosInstance.delete(`/calendar/objects/${originalTask?.id}/`)
        }
        alert.show("Task deleted");
        navigate(`/calendar/${moment(task.due_date).format('YYYY/MM/')}`);
      } catch(e) {
        console.log(e)
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editing) {
        if (taskType?.isException) {
          await axiosInstance.patch(`/calendar/exceptions/${originalTask?.id}/`, task)
        } else if (originalTask?.is_recurring && !task.is_recurring) {
          await axiosInstance.delete(`/calendar/recurring_patterns/${recurringPattern.id}/`)
          await axiosInstance.patch(`/calendar/objects/${originalTask?.id}/`, task)
        } else if (!originalTask?.occurrence_number && originalTask?.is_recurring) {
          await axiosInstance.patch(`/calendar/objects/${originalTask?.id}/`, task)
          await axiosInstance.patch(`/calendar/recurring_patterns/${recurringPattern.id}/`, recurringPattern)
        } else if (originalTask?.occurrence_number) {
          if (!changeAll) {
            await axiosInstance.post('/calendar/exceptions/', task)
          } else {
            await axiosInstance.post('/calendar/objects/', task)
            .then(async (response) => {
              let oldPattern = {
                originalRecurringPattern,
                has_end: true,
                final_date: moment(originalTask?.due_date).format('YYYY-MM-DD')
              }
              let newPattern = {
                ...recurringPattern,
                parent_id: response.data.id,
                has_end: recurringPattern.has_end,
                final_date: recurringPattern.final_date
              }
              await axiosInstance.patch(`/calendar/recurring_patterns/${recurringPattern.id}/`, oldPattern)
              await axiosInstance.post(`/calendar/recurring_patterns/`, newPattern)
            })
          }
        } else {
          await axiosInstance.patch(`/calendar/objects/${originalTask?.id}/`, task)
          if (task.is_recurring) {
            await axiosInstance.post('/calendar/recurring_patterns/', {...recurringPattern, parent_id: task.id})
          }
        }
      } else {
        let createdTask = await axiosInstance.post(`/calendar/objects/`, task)
        if (task.is_recurring) {
          await axiosInstance.post('/calendar/recurring_patterns/', {...recurringPattern, parent_id: createdTask.data.id})
        }
      }
      alert.success('Task updated');
      navigate(`/calendar/${moment(task.due_date).format('YYYY/MM/')}`);
    } catch(error) {
      dispatch(calendarRequestFail(error.response.data))
      alert.error("Please check errors in the form")
    }
  }

  useEffect(() => {
    return () => {
      dispatch(calendarRequestFail([]))
    }
  }, [])

  return (
    <TaskFormComponent
      className='task-form'
      onSubmit={handleSubmit}
    >
      <TaskInput
        name="title"
        className="task-form__input--title"
        onChange={handleChange}
        value={task?.title}
      />
      <div className="optional-wrapper">
        <TaskCheckbox
          name="is_event"
          label="Is event?"
          checked={task?.is_event}
          onChange={handleChange}
        />
        {
          task?.is_event &&
            <TaskTime
              name="start_date"
              label="Starts at"
              value={moment(task?.start_date).format("HH:mm:ss")}
              onChange={handleChange}
            />
        }
      </div>
      <TaskDatetime
        value={moment(task?.due_date).format("YYYY-MM-DD[T]HH:mm:ss")}
        label="Due on"
        name="due_date"
        onChange={handleChange}
      />
      <TaskCheckbox
        name="is_recurring"
        label="Repeat task?"
        checked={task?.is_recurring}
        onChange={handleChange}
      />
      {
        task.is_recurring &&
        <div className="optional-wrapper">
          <TaskCheckbox
            name="has_end"
            label="Has end?"
            onChange={handleRecurrenceChange}
            checked={recurringPattern.has_end}
          />
          {
            recurringPattern.has_end &&
            <TaskDate
              value={moment(recurringPattern?.final_date).format("YYYY-MM-DD")}
              label="Ends on"
              name="final_date"
              onChange={handleRecurrenceChange}
            />
          }
        </div>
      }
      {
          task.is_recurring &&
          !originalTask?.is_recurring ?
          <React.Fragment>
            <TaskRecurrence
              name="recurrence"
              onChange={handleRecurrenceChange}
              value={recurringPattern?.recurrence}
              label="Repeat every"
            />
            <button type='submit' className='button'>Save</button>
          </React.Fragment>
          :
          task.is_recurring &&
          originalTask?.is_recurring ?
            <React.Fragment>
              <TaskRecurrence
                name="recurrence"
                onChange={handleRecurrenceChange}
                value={recurringPattern?.recurrence}
                label="Repeat every"
              />
              <button onClick={() => setOpenConfirm(true)} type='button' className='button'>Save</button>
              <ModalBox
                open={openConfirm}
                handleClose={handleConfirmClose}
              >
                <ModalHeader>
                  <h1 className='modal__tile'>Confirm</h1>
                </ModalHeader>
                <ModalBody>
                  <div className="task__wrapper">
                    <input type="radio" id="changeThis" name="changeSelect" checked={!changeAll} onChange={handleChangeAll}/>
                    <label htmlFor="changeThis">Change only this task</label>
                  </div>
                  <div className="task__wrapper">
                    <input type="radio" id="changeAll" name="changeSelect" checked={changeAll} onChange={handleChangeAll}/>
                    <label htmlFor="changeAll">Change this and all following tasks</label>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <ModalButton func={handleSubmit}>Save</ModalButton>
                </ModalFooter>
              </ModalBox>
            </React.Fragment>
          :
            <button type='submit' className='button'>Save</button>
        }
        {
          editing &&
          <React.Fragment>
            <DeleteIcon className="task-form__delete" onClick={() => setOpenDelete(true)}/>
            <ModalBox
              open={openDelete}
              handleClose={() => setOpenDelete(false)}
            >
              <ModalHeader>
                <h1 className="modal__title">Delete</h1>
              </ModalHeader>
              <ModalBody>
                {
                  originalTask?.occurrence_number &&
                  originalTask?.is_recurring ?
                  <React.Fragment>
                    <div className="task__wrapper">
                      <input type="radio" id="deleteThis" name="deleteSelect" checked={!deleteAll} onChange={handleDeleteAll}/>
                      <label htmlFor="deleteThis">Delete only this task</label>
                    </div>
                    <div className="task__wrapper">
                      <input type="radio" id="deleteAll" name="deleteSelect" checked={deleteAll} onChange={handleDeleteAll}/>
                      <label htmlFor="deleteAll">Delete all tasks</label>
                    </div>
                  </React.Fragment>
                  :
                  originalTask?.isException || !originalTask?.is_recurring ?
                  <p>Are you sure you want to delete this task?</p>
                  :
                  <p>Are you sure you want to delete this task? All the following tasks will be deleted as well.</p>
                }
              </ModalBody>
              <ModalFooter>
                <ModalButton func={handleDelete}>Delete</ModalButton>
              </ModalFooter>
            </ModalBox>
          </React.Fragment>
        }
    </TaskFormComponent>
  )
}

export default TaskForm