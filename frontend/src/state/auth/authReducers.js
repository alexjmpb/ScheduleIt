import { axiosInstance } from '../../axios';
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
	REGISTER_SUCCESS,
	REGISTER_FAIL,
    CLEAN_SUBMITTING,
    REQUEST_SUBMIT
} from './authActionsTypes'

const initialState = {
    access: localStorage.getItem('access_token'),
    refresh: localStorage.getItem('refresh_token'),
    isAuth: null,
    user: null,
    user_loading: false,
    login_loading: false,
    submitLoading: false,
    errors: [],
    validators: [],
}

function authReducer(state = initialState, action) {
    switch(action.type) {
        case CLEAN_SUBMITTING:
            return {
                ...state,
                submitLoading: false,
            }
        case AUTH_SUCCESS:
            return {
                ...state,
                isAuth: true,
                errors: []
            }
        case AUTH_FAIL:
            return {
                ...state,
                isAuth: false,
                access: null,
                refersh: null,
                errors: []
            }
        case USER_REQUEST:
            return {
                ...state,
                user_loading: true
            }
        case USER_SUCCESS:
            return {
                ...state,
                user_loading: false,
                user: action.payload,
                errors: [],
            }
        case USER_FAIL:
            return {
                ...state,
                user_loading: false,
                user: null
            }
        case REQUEST_SUBMIT:
            return {
                ...state,
                submitLoading: true
            }
        case LOGIN_SUCCESS:
            return {
                ...state,
                isAuth: true,
                access: action.payload.access,
                refersh: action.payload.refresh,
                errors: [],
            }
        case LOGIN_FAIL:
            return {
                ...state,
                access: null,
                refersh: null,
                errors: action.payload
            }
        case REGISTER_SUCCESS:
            return {
                ...state,
                errors: [],
            }
        case REGISTER_FAIL:
            return {
                ...state,
                errors: action.payload,
            }
        case LOGOUT:
            return {
                ...state,
                user: null,
                access: null,
                refresh: null,
                isAuth: false
            }
        default:
            return state
    }
}

export default authReducer;