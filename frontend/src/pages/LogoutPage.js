import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../state/auth/authActions';
import { useNavigate, Navigate } from 'react-router-dom';
import { axiosInstance } from '../axios';
import LoadingLoopPage from '../components/loading/LoadingLoopPage';
import { useAlert } from 'react-alert';

const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();
  useEffect(() => {
    async function blacklist() {
      await axiosInstance.post('/auth/jwt/blacklist/', {refresh: localStorage.getItem('refresh_token')})
    }
    blacklist()
      .catch((e) => {
        console.log(e)
      })
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    dispatch(logout())
    alert.show('Logged out')
    navigate('/login/');
  }, [])

  return (
    <LoadingLoopPage title="Logging Out"/>
  )
}

export default LogoutPage