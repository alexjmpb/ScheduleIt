import axios from 'axios'
import moment from 'moment'
import store from './state/store'
import { auth, authFail } from './state/auth/authActions'

const host = 'http://127.0.0.1:8000'

export const axiosInstance = axios.create({
    baseURL: `${host}/api/`,
    timeout: 5000,
    headers: {
        'Authorization': `JWT ${localStorage.getItem('access_token')}`
    }
});

export const axiosInstanceUnauth = axios.create({
    baseURL: `${host}/api/`,
    timeout: 5000,
});

axiosInstance.interceptors.request.use(async (config) => {
    if (localStorage.getItem('refresh_token') && localStorage.getItem('access_token')) {
        const refreshToken = localStorage.getItem('refresh_token');
        const refreshData = JSON.parse(atob(refreshToken.split('.')[1]));
        const accessToken = localStorage.getItem('access_token');
        const accessData = JSON.parse(atob(accessToken.split('.')[1]));

        const isAccessExpired = moment.unix(accessData.exp).isBefore(moment());
        
        if (!isAccessExpired) return config;
        await axios.post(`${host}/api/auth/jwt/refresh/`, {refresh:refreshToken})
            .then((response) => {
                localStorage.setItem('access_token', response.data.access)
                localStorage.setItem('refresh_token', response.data.refresh)
                axiosInstance.defaults.headers['Authorization'] = `JWT ${response.data.access}`
                config.headers['Authorization'] = `JWT ${response.data.access}`
            })
            .catch((error) => {
                store.dispatch(authFail())
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                axiosInstance.defaults.headers['Authorization'] = ''
                config.headers['Authorization'] = ''
            })

        return config
    }
});