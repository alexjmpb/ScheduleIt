import axios from 'axios'
import moment from 'moment'

export const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    timeout: 5000,
    headers: {
        'Authorization': `JWT ${localStorage.getItem('access_token')}`
    }
});

export const axiosInstanceUnauth = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    timeout: 5000,
});

axiosInstance.interceptors.request.use(async (config) => {
    if (localStorage.getItem('refresh_token') && localStorage.getItem('access_token')) {
        const refreshToken = localStorage.getItem('refresh_token');
        const accessToken = localStorage.getItem('access_token');
        const accessData = JSON.parse(atob(accessToken.split('.')[1]));

        const isAccessExpired = moment.unix(accessData.exp).isBefore(moment())

        if (!isAccessExpired) return config;
        const response = await axios.post('http://127.0.0.1:8000/api/auth/jwt/refresh/', {refresh:refreshToken})

        localStorage.setItem('access_token', response.data.access)
        localStorage.setItem('refresh_token', response.data.refresh)
        config.headers['Authorization'] = `JWT ${response.data.access}`

        return config
    }
});