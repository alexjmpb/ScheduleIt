import {
    AUTH_SUCCESS,
    AUTH_FAIL,
    USER_REQUEST,
    USER_SUCCESS,
    USER_FAIL,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
} from './authActionsTypes'
import axiosInstance from '../../axios'


const authSuccess = () => {
	return {
		type: AUTH_SUCCESS,
	}
}

const authFail = () => {
	return {
		type: AUTH_FAIL,	
	}
}

export const auth = () => {
	return (dispatch) => {
		axiosInstance.post('/auth/jwt/verify/', {token: localStorage.getItem('access')})
			.then((response) => {
				dispatch(authSuccess())
			})
			.catch((error) => {
				dispatch(authFail())
			})
	}
}

const userRequest = () => {
	return {
		type: USER_REQUEST,
	}
}

const userSuccess = (user) => {
	return {
		type: USER_SUCCESS,
	}
}

const userFail = () => {
	return {
		type: USER_FAIL,	
	}
}

export const getUser = () => {
	return (dispatch) => {
		dispatch(userRequest())
		axiosInstance.get('/auth/users/me/')
			.then((response) => {
				dispatch(userRequest(response.data))
			})
			.catch((error) => {
				dispatch(userFail())
			})
	}
}