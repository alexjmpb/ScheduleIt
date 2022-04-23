import { combineReducers } from 'redux'
import auth from './auth/authReducers'
import calendar from './calendar/calendarReducer'

export default combineReducers({
    auth,
    calendar
})