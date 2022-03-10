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

const initialState = {
    access: localStorage.getItem('access_token'),
    refresh: localStorage.getItem('refresh_token'),
    isAuth: false,
    user: null,
    user_loading: false,
    login_loading: false,
}

function authReducer(state = initialState, action) {
    switch(action.type) {
        case AUTH_SUCCESS:
            return {
                ...state,
                isAuth: true
            }
        case AUTH_FAIL:
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            return {
                ...state,
                isAuth: false,
                access: null,
                refersh: null
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
                user: action.payload
            }
        case USER_FAIL:
            return {
                ...state,
                user_loading: false,
                user: null
            }
        case LOGIN_REQUEST:
            return {
                ...state,
                login_loading: true
            }
        case LOGIN_SUCCESS:
            localStorage.setItem('access_token', action.payload.access);
            localStorage.setItem('refresh_token', action.payload.refresh);
            return {
                ...state,
                login_loading: false,
                access: action.payload.access,
                refersh: action.payload.refresh
            }
        case LOGIN_FAIL:
            return {
                ...state,
                login_loading: false,
                access: null,
                refersh: null
            }
        default:
            return state
    }
}

export default authReducer;