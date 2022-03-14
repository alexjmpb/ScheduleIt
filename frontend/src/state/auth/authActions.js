import {
    AUTH_SUCCESS,
    AUTH_FAIL,
    USER_REQUEST,
    USER_SUCCESS,
    USER_FAIL,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
	LOGOUT,
	REGISTER_REQUEST,
  REQUEST_SUBMIT,
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	CLEAN_SUBMITTING,
} from './authActionsTypes'
import {axiosInstance, axiosInstanceUnauth} from '../../axios'


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
	return async (dispatch) => {
		await axiosInstance.get('/auth/users/me/')
			.then((response) => {
				dispatch(authSuccess())
			})
			.catch((error) => {
				localStorage.removeItem('access_token');
				localStorage.removeItem('refresh_token');
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
		payload: user
	}
}

const userFail = (error) => {
	return {
		type: USER_FAIL,
		payload: error
	}
}

export const getUser = () => {
	return (dispatch) => {
		dispatch(userRequest())
		axiosInstance.get('/auth/users/me/')
			.then((response) => {
				dispatch(userSuccess(response.data))
			})
			.catch((error) => {
				dispatch(userFail(error))
			})
	}
}

export const loginSuccess = (tokens) => {
	return {
		type: LOGIN_SUCCESS,
		payload: tokens,
	}
}

export const loginFail = (error) => {
	return {
		type: LOGIN_FAIL,
		payload: error,
	}
}

export const submitRequest = () => {
	return {
		type: REQUEST_SUBMIT
	}
}

export const registerSuccess = () => {
	return {
		type: REGISTER_SUCCESS,
	}
}

export const registerFail = (errors) => {
	return {
		type: REGISTER_FAIL,
		payload: errors,
	}
}

export const logout = () => {
	return {
		type: LOGOUT
	}
}

export const cleanSubmit = () => {
	return {
		type: CLEAN_SUBMITTING,
	}
}