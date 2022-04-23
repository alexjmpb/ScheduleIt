import { CALENDAR_REQUEST_FAIL } from "./calendarActionTypes"

export const calendarRequestFail = (valdiators) => {
	return {
		type: CALENDAR_REQUEST_FAIL,
        payload: valdiators
	}
}