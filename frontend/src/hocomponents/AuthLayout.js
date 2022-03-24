import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { auth } from '../state/auth/authActions'
import { darkTheme, lightTheme } from '../utils/themes';

const AuthLayout = () => {
  const isAuth = useSelector(state => state.auth.isAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dark = useSelector(state => state.auth.dark)
  
  useEffect(() => {
    if (dark) {
      for (var key of Object.keys(darkTheme)) {
        document.documentElement.style.setProperty(key, darkTheme[key]);
      }
    }
    else {
      for (var key of Object.keys(lightTheme)) {
        document.documentElement.style.setProperty(key, lightTheme[key]);
      }
    }
    dispatch(auth())
    
    if (isAuth === true) navigate('/')
  })
  
  return (
    <Outlet/>
  )
}

export default AuthLayout