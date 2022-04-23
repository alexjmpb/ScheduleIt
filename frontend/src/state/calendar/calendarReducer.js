import { CALENDAR_REQUEST_FAIL } from "./calendarActionTypes";

const initialState = {
    validators: []
}

function calendarReducer(state=initialState, action) {
    switch(action.type) {
        case CALENDAR_REQUEST_FAIL:
            return {
                ...state,
                validators: action.payload
            }
        default:
            return state
    }
}

export default calendarReducer