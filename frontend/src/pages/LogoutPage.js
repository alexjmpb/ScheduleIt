import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../state/auth/authActions';
import { useNavigate, Navigate } from 'react-router-dom';
import { axiosInstance } from '../axios';
import LoadingLoopPage from '../components/loading/LoadingLoopPage';

const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(async () => {
    try {
      await axiosInstance.post('/auth/jwt/blacklist/', {refresh: localStorage.getItem('refresh_token')})
    }
    catch(e) {
      console.log(e)
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    dispatch(logout())
    navigate('/login/');
  }, [])

  return (
    <LoadingLoopPage title="Logging Out"/>
  )
}

export default LogoutPage